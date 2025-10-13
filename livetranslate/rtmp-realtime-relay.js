import WebSocket from "ws";
import { spawn } from "child_process";
import { EventEmitter } from "events";

/**
 * RTMP → OpenAI Realtime WebSocket ретранслятор
 * 
 * Принимает RTMP поток, декодирует аудио в PCM 24kHz моно,
 * и отправляет в OpenAI Realtime API через WebSocket
 */
export class RTMPRealtimeRelay extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.apiKey = options.apiKey;
    this.rtmpUrl = options.rtmpUrl;
    this.model = options.model || "gpt-realtime";
    this.voice = options.voice || "verse";
    this.instructions = options.instructions || 
      "Ты транскриптор речи. Твоя задача - точно транскрибировать услышанную речь в текст. Отвечай только транскрипцией, без дополнительных комментариев.";
    
    this.ws = null;
    this.ffmpeg = null;
    this.isConnected = false;
    this.isStreaming = false;
    
    // Настройки аудио
    this.sampleRate = 24000; // 24kHz
    this.channels = 1; // моно
    this.bitDepth = 16; // 16-bit
    this.chunkDurationMs = 40; // 40ms чанки
    this.chunkBytes = Math.floor(this.sampleRate * this.channels * (this.bitDepth / 8) * (this.chunkDurationMs / 1000));
    
    this.audioBuffer = Buffer.alloc(0);
    
    // Хранилище для транскрипции и логов
    this.transcriptionResults = [];
    this.openaiLogs = [];
    this.maxLogs = 1000; // Максимум логов для хранения
    
    // Realtime WebSocket URL
    this.realtimeUrl = `wss://api.openai.com/v1/realtime?model=${this.model}`;
  }

  /**
   * Начать ретрансляцию RTMP → Realtime
   */
  async start() {
    if (this.isStreaming) {
      throw new Error("Relay is already streaming");
    }

    if (!this.apiKey) {
      throw new Error("OpenAI API key is required");
    }

    if (!this.rtmpUrl) {
      throw new Error("RTMP URL is required");
    }

    try {
      await this.connectRealtime();
      this.startFFmpeg();
      this.isStreaming = true;
      this.emit("started");
      console.log(`RTMP→Realtime relay started: ${this.rtmpUrl}`);
    } catch (error) {
      this.emit("error", error);
      throw error;
    }
  }

  /**
   * Остановить ретрансляцию
   */
  stop() {
    if (!this.isStreaming) {
      return;
    }

    this.isStreaming = false;
    
    if (this.ffmpeg) {
      this.ffmpeg.kill();
      this.ffmpeg = null;
    }

    if (this.ws && this.isConnected) {
      this.ws.close();
    }

    this.audioBuffer = Buffer.alloc(0);
    this.emit("stopped");
    console.log("RTMP→Realtime relay stopped");
  }

  /**
   * Подключиться к OpenAI Realtime WebSocket
   */
  async connectRealtime() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.realtimeUrl, {
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "OpenAI-Beta": "realtime=v1"
        }
      });

      this.ws.on("open", () => {
        console.log("Connected to OpenAI Realtime WebSocket");
        this.isConnected = true;
        
        // Настройка сессии
        const sessionUpdate = {
          type: "session.update",
          session: {
            input_audio_format: "pcm16",
            input_audio_transcription: { 
              model: "whisper-1" 
            },
            turn_detection: { 
              type: "server_vad", 
              threshold: 0.5,
              silence_duration_ms: 50
            },
            instructions: this.instructions,
            voice: this.voice,
            modalities: ["text", "audio"]
          }
        };

        this.ws.send(JSON.stringify(sessionUpdate));
        this.emit("realtime_connected");
        resolve();
      });

      this.ws.on("message", (data) => {
        try {
          const event = JSON.parse(data);
          this.handleRealtimeEvent(event);
        } catch (error) {
          console.error("Error parsing Realtime message:", error);
        }
      });

      this.ws.on("error", (error) => {
        console.error("Realtime WebSocket error:", error);
        this.emit("error", error);
        reject(error);
      });

      this.ws.on("close", (code, reason) => {
        console.log(`Realtime WebSocket closed: ${code} ${reason}`);
        this.isConnected = false;
        this.emit("realtime_disconnected", { code, reason });
      });
    });
  }

  /**
   * Запустить FFmpeg для декодирования RTMP аудио
   */
  startFFmpeg() {
    const ffmpegArgs = [
      "-re", // читать в реальном времени
      "-i", this.rtmpUrl, // входной RTMP поток
      "-vn", // отключить видео
      "-ac", "1", // моно аудио
      "-ar", this.sampleRate.toString(), // частота дискретизации
      "-f", "s16le", // формат: signed 16-bit little-endian
      "-acodec", "pcm_s16le", // кодек PCM
      "-" // вывод в stdout
    ];

    console.log(`Starting FFmpeg: ffmpeg ${ffmpegArgs.join(" ")}`);

    this.ffmpeg = spawn("ffmpeg", ffmpegArgs, {
      stdio: ["ignore", "pipe", "pipe"]
    });

    this.ffmpeg.stdout.on("data", (data) => {
      this.processAudioData(data);
    });

    this.ffmpeg.stderr.on("data", (data) => {
      const message = data.toString();
      if (message.includes("error") || message.includes("Error")) {
        console.error("FFmpeg error:", message);
        this.emit("error", new Error(`FFmpeg error: ${message}`));
      } else {
        console.log("FFmpeg:", message);
      }
    });

    this.ffmpeg.on("close", (code) => {
      console.log(`FFmpeg process exited with code ${code}`);
      if (code !== 0 && this.isStreaming) {
        this.emit("error", new Error(`FFmpeg exited with code ${code}`));
      }
    });

    this.ffmpeg.on("error", (error) => {
      console.error("FFmpeg spawn error:", error);
      this.emit("error", error);
    });
  }

  /**
   * Обработать аудио данные от FFmpeg
   */
  processAudioData(data) {
    if (!this.isConnected || !this.ws) {
      return;
    }

    // Добавляем данные в буфер
    this.audioBuffer = Buffer.concat([this.audioBuffer, data]);

    // Отправляем чанки нужного размера
    while (this.audioBuffer.length >= this.chunkBytes) {
      const chunk = this.audioBuffer.subarray(0, this.chunkBytes);
      this.audioBuffer = this.audioBuffer.subarray(this.chunkBytes);

      // Отправляем чанк в Realtime API
      const audioEvent = {
        type: "input_audio_buffer.append",
        audio: chunk.toString("base64")
      };

      try {
        this.ws.send(JSON.stringify(audioEvent));
      } catch (error) {
        console.error("Error sending audio chunk:", error);
        this.emit("error", error);
      }
    }
  }

  /**
   * Добавить лог события
   */
  addLog(type, message, data = null) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type,
      message,
      data
    };
    
    this.openaiLogs.push(logEntry);
    
    // Ограничиваем количество логов
    if (this.openaiLogs.length > this.maxLogs) {
      this.openaiLogs.shift();
    }
    
    // Эмитим событие для внешних слушателей
    this.emit("log", logEntry);
  }

  /**
   * Обработать события от Realtime API
   */
  handleRealtimeEvent(event) {
    // Логируем все события
    this.addLog("realtime_event", `Event: ${event.type}`, event);
    
    switch (event.type) {
      case "session.created":
        console.log("Realtime session created:", event.session?.id);
        this.addLog("session", "Session created", event.session);
        this.emit("session_created", event.session);
        break;

      case "session.updated":
        console.log("Realtime session updated");
        this.addLog("session", "Session updated", event.session);
        this.emit("session_updated", event.session);
        break;

      case "input_audio_buffer.committed":
        console.log("Audio buffer committed");
        this.addLog("audio", "Audio buffer committed");
        this.emit("audio_committed");
        break;

      case "response.created":
        console.log("Response created:", event.response?.id);
        this.addLog("response", "Response created", event.response);
        this.emit("response_created", event.response);
        break;

      case "response.output_audio.delta":
        // Получаем аудио ответ от Realtime API
        if (event.delta) {
          this.addLog("audio", "Audio output delta received");
          this.emit("audio_output", event.delta);
        }
        break;

      case "response.output_audio.done":
        console.log("Audio output completed");
        this.addLog("audio", "Audio output completed");
        this.emit("audio_output_done");
        break;

      case "response.done":
        console.log("Response completed");
        this.addLog("response", "Response completed", event.response);
        this.emit("response_done", event.response);
        break;

      case "conversation.item.created":
        console.log("Conversation item created:", event.item?.type);
        this.addLog("conversation", "Conversation item created", event.item);
        this.emit("conversation_item_created", event.item);
        break;

      case "input_audio_buffer.speech_started":
        console.log("Speech started");
        this.addLog("speech", "Speech started");
        this.emit("speech_started");
        break;

      case "input_audio_buffer.speech_stopped":
        console.log("Speech stopped");
        this.addLog("speech", "Speech stopped");
        this.emit("speech_stopped");
        break;

      case "conversation.item.input_audio_transcription.completed":
        // Получаем результат транскрипции
        if (event.transcript) {
          const transcription = {
            id: event.item?.id,
            transcript: event.transcript,
            timestamp: new Date().toISOString(),
            duration: event.duration || null
          };
          
          this.transcriptionResults.push(transcription);
          
          // Ограничиваем количество результатов
          if (this.transcriptionResults.length > 100) {
            this.transcriptionResults.shift();
          }
          
          console.log("Transcription completed:", event.transcript);
          this.addLog("transcription", "Transcription completed", transcription);
          this.emit("transcription_completed", transcription);
        }
        break;

      case "error":
        console.error("Realtime API error:", event.error);
        this.addLog("error", "Realtime API error", event.error);
        this.emit("realtime_error", event.error);
        break;

      default:
        // Логируем неизвестные события для отладки
        this.addLog("unknown", `Unknown event: ${event.type}`, event);
        if (process.env.NODE_ENV === "development") {
          console.log("Unknown Realtime event:", event.type);
        }
    }
  }

  /**
   * Отправить команду в Realtime API
   */
  sendCommand(command) {
    if (!this.isConnected || !this.ws) {
      throw new Error("Not connected to Realtime API");
    }

    this.ws.send(JSON.stringify(command));
  }

  /**
   * Зафиксировать аудио буфер и запросить ответ
   */
  commitAndRequestResponse() {
    this.sendCommand({ type: "input_audio_buffer.commit" });
    this.sendCommand({ type: "response.create" });
  }

  /**
   * Получить статус ретранслятора
   */
  getStatus() {
    return {
      isStreaming: this.isStreaming,
      isConnected: this.isConnected,
      rtmpUrl: this.rtmpUrl,
      model: this.model,
      voice: this.voice,
      audioBufferSize: this.audioBuffer.length,
      chunkSize: this.chunkBytes,
      transcriptionCount: this.transcriptionResults.length,
      logsCount: this.openaiLogs.length
    };
  }

  /**
   * Получить результаты транскрипции
   */
  getTranscriptionResults(limit = 50) {
    return this.transcriptionResults.slice(-limit);
  }

  /**
   * Получить логи OpenAI
   */
  getLogs(limit = 100) {
    return this.openaiLogs.slice(-limit);
  }

  /**
   * Получить логи по типу
   */
  getLogsByType(type, limit = 50) {
    return this.openaiLogs
      .filter(log => log.type === type)
      .slice(-limit);
  }

  /**
   * Очистить результаты транскрипции
   */
  clearTranscriptionResults() {
    this.transcriptionResults = [];
    this.addLog("system", "Transcription results cleared");
  }

  /**
   * Очистить логи
   */
  clearLogs() {
    this.openaiLogs = [];
    this.addLog("system", "Logs cleared");
  }
}

export default RTMPRealtimeRelay;
