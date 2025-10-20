import { EventEmitter } from "events";
import { spawn } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Replicate from "replicate";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * RTMP → Replicate WhisperX транскрибер
 *
 * Принимает RTMP поток, нарезает на аудио чанки,
 * и отправляет в Replicate WhisperX API для транскрипции
 */
export class ReplicateWhisperXRelay extends EventEmitter {
  constructor(options = {}) {
    super();

    this.apiToken = options.apiToken;
    this.rtmpUrl = options.rtmpUrl;
    this.language = options.language || "kk"; // Казахский по умолчанию
    this.chunkDuration = options.chunkDuration || 10; // Секунды на чанк
    this.batchSize = options.batchSize || 8; // batch_size для WhisperX
    this.model = options.model || "whisperx"; // модель: whisperx | whisperx-a100 | fast-whisper

    this.ffmpeg = null;
    this.isStreaming = false;

    // Хранилище для транскрипции и логов
    this.transcriptionResults = [];
    this.logs = [];
    this.maxLogs = 1000;
    this.maxResults = 100;

    // Временная директория для аудио чанков
    this.tempDir = path.join(__dirname, "temp-whisperx");

    // Счетчик чанков
    this.chunkCounter = 0;

    // Очередь обработки чанков
    this.processingQueue = [];
    this.isProcessing = false;

    // Текущий чанк (буфер)
    this.currentChunk = {
      buffer: Buffer.alloc(0),
      startTime: Date.now()
    };

    // Настройки аудио для FFmpeg
    this.sampleRate = 16000; // 16kHz для Whisper
    this.channels = 1; // моно

    // Replicate SDK клиент (инициализируется при старте)
    this.replicate = null;
  }

  /**
   * Начать ретрансляцию RTMP → WhisperX
   */
  async start() {
    if (this.isStreaming) {
      throw new Error("Relay is already streaming");
    }

    if (!this.apiToken) {
      throw new Error("Replicate API token is required");
    }

    if (!this.rtmpUrl) {
      throw new Error("RTMP URL is required");
    }

    try {
      // Инициализируем Replicate SDK
      this.replicate = new Replicate({ auth: this.apiToken });

      // Создаем временную директорию
      await fs.mkdir(this.tempDir, { recursive: true });

      this.startFFmpeg();
      this.isStreaming = true;
      this.emit("started");
      this.addLog("info", "RTMP→WhisperX relay started", { rtmpUrl: this.rtmpUrl });
      console.log(`RTMP→WhisperX relay started: ${this.rtmpUrl}`);
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

    // Обрабатываем последний чанк если есть
    if (this.currentChunk.buffer.length > 0) {
      this.saveAndProcessChunk();
    }

    this.emit("stopped");
    this.addLog("info", "RTMP→WhisperX relay stopped");
    console.log("RTMP→WhisperX relay stopped");
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
      "-ar", String(this.sampleRate), // частота дискретизации 16kHz
      "-f", "s16le", // формат: signed 16-bit little-endian
      "-acodec", "pcm_s16le", // кодек PCM 16-bit
      "-" // вывод в stdout
    ];

    console.log(`Starting FFmpeg: ffmpeg ${ffmpegArgs.join(" ")}`);
    this.addLog("ffmpeg", "FFmpeg started", { args: ffmpegArgs.join(" ") });

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
        this.addLog("error", "FFmpeg error", message);
        this.emit("error", new Error(`FFmpeg error: ${message}`));
      }
    });

    this.ffmpeg.on("close", (code) => {
      console.log(`FFmpeg process exited with code ${code}`);
      this.addLog("ffmpeg", "FFmpeg process exited", { code });
      if (code !== 0 && this.isStreaming) {
        this.emit("error", new Error(`FFmpeg exited with code ${code}`));
      }
    });

    this.ffmpeg.on("error", (error) => {
      console.error("FFmpeg spawn error:", error);
      this.addLog("error", "FFmpeg spawn error", error.message);
      this.emit("error", error);
    });
  }

  /**
   * Обработать аудио данные от FFmpeg
   */
  processAudioData(data) {
    if (!this.isStreaming) {
      return;
    }

    // Добавляем данные в буфер текущего чанка
    this.currentChunk.buffer = Buffer.concat([this.currentChunk.buffer, data]);

    // Проверяем, прошло ли достаточно времени для создания чанка
    const elapsed = (Date.now() - this.currentChunk.startTime) / 1000;

    if (elapsed >= this.chunkDuration) {
      this.saveAndProcessChunk();
    }
  }

  /**
   * Сохранить текущий чанк и отправить на обработку
   */
  async saveAndProcessChunk() {
    if (this.currentChunk.buffer.length === 0) {
      return;
    }

    const chunkId = `chunk-${Date.now()}-${this.chunkCounter++}`;
    const chunkPath = path.join(this.tempDir, `${chunkId}.wav`);

    try {
      // Создаем WAV файл из PCM данных
      const wavBuffer = this.createWavBuffer(this.currentChunk.buffer);
      await fs.writeFile(chunkPath, wavBuffer);

      this.addLog("chunk", "Audio chunk saved", {
        chunkId,
        size: wavBuffer.length,
        duration: this.chunkDuration
      });

      // Добавляем в очередь обработки
      this.processingQueue.push({ chunkId, chunkPath });

      // Сбрасываем текущий чанк
      this.currentChunk = {
        buffer: Buffer.alloc(0),
        startTime: Date.now()
      };

      // Запускаем обработку очереди
      if (!this.isProcessing) {
        this.processQueue();
      }

    } catch (error) {
      console.error("Error saving chunk:", error);
      this.addLog("error", "Failed to save chunk", error.message);
      this.emit("error", error);
    }
  }

  /**
   * Создать WAV буфер из PCM данных
   */
  createWavBuffer(pcmBuffer) {
    const wavHeaderSize = 44;
    const wavBuffer = Buffer.alloc(wavHeaderSize + pcmBuffer.length);

    // WAV заголовок
    wavBuffer.write('RIFF', 0);
    wavBuffer.writeUInt32LE(36 + pcmBuffer.length, 4);
    wavBuffer.write('WAVE', 8);
    wavBuffer.write('fmt ', 12);
    wavBuffer.writeUInt32LE(16, 16); // размер fmt chunk
    wavBuffer.writeUInt16LE(1, 20); // аудио формат (1 = PCM)
    wavBuffer.writeUInt16LE(this.channels, 22); // количество каналов
    wavBuffer.writeUInt32LE(this.sampleRate, 24); // sample rate
    wavBuffer.writeUInt32LE(this.sampleRate * this.channels * 2, 28); // byte rate
    wavBuffer.writeUInt16LE(this.channels * 2, 32); // block align
    wavBuffer.writeUInt16LE(16, 34); // bits per sample
    wavBuffer.write('data', 36);
    wavBuffer.writeUInt32LE(pcmBuffer.length, 40);

    // Копируем PCM данные
    pcmBuffer.copy(wavBuffer, wavHeaderSize);

    return wavBuffer;
  }

  /**
   * Обработать очередь чанков
   */
  async processQueue() {
    if (this.isProcessing || this.processingQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.processingQueue.length > 0) {
      const chunk = this.processingQueue.shift();

      try {
        await this.transcribeChunk(chunk);

        // Удаляем временный файл
        await fs.unlink(chunk.chunkPath).catch(() => {});

      } catch (error) {
        console.error("Error processing chunk:", error);
        this.addLog("error", "Failed to process chunk", {
          chunkId: chunk.chunkId,
          error: error.message
        });
      }
    }

    this.isProcessing = false;
  }

  /**
   * Транскрибировать аудио чанк через Replicate WhisperX
   */
  async transcribeChunk(chunk) {
    const { chunkId, chunkPath } = chunk;

    this.addLog("transcription_start", "Starting transcription", { chunkId });
    this.emit("transcription_start", { chunkId });

    try {
      const startTime = Date.now();

      // Читаем аудио файл
      const audioBuffer = await fs.readFile(chunkPath);
      const audioBase64 = audioBuffer.toString('base64');
      const audioDataUri = `data:audio/wav;base64,${audioBase64}`;

      // Подготовка версии модели и входных параметров в зависимости от выбранной модели
      const modelChoice = this.model;
      let modelVersion;
      let modelInput;

      // Подготовка языка в формате ожидаемом моделью
      const mapToWhisperXLanguage = (lang) => {
        const map = {
          kk: "kazakh",
          ru: "russian",
          en: "english",
          zh: "chinese",
          es: "spanish",
          fr: "french",
        };
        return map[lang] || null;
      };

      if (modelChoice === "whisperx") {
        // Версия victor-upmeet/whisperx (идентификатор версии)
        modelVersion = "826801120720e563620006b99e412f7ed7b991dd4477e9160473d44a405ef9d9";
        modelInput = {
          audio_file: audioDataUri,
          debug: false,
          vad_onset: 0.5,
          batch_size: 64,
          vad_offset: 0.363,
          diarization: false,
          temperature: 0.7,
          align_output: false,
          return_char_alignments: true
        };
        const whxLang = mapToWhisperXLanguage(this.language);
        if (whxLang) modelInput.language = whxLang;
      } else if (modelChoice === "whisperx-a100") {
        // Версия модели для A100 с полным идентификатором owner/model:hash
        modelVersion = "victor-upmeet/whisperx-a100-80gb:3460db5b5eb7ce88f12458afcb541a5828189f73e11e46284299072973947dff";
        modelInput = {
          audio_file: audioDataUri,
          debug: false,
          vad_onset: 0.5,
          batch_size: 64,
          vad_offset: 0.363,
          diarization: false,
          temperature: 0.7,
          align_output: false,
          return_char_alignments: true
        };
        const whxLang = mapToWhisperXLanguage(this.language);
        if (whxLang) modelInput.language = whxLang;
      } else if (modelChoice === "fast-whisper") {
        // Faster Whisper (vaibhavs10) использует иную схему входа (обычно ключ audio)
        modelVersion = "vaibhavs10/incredibly-fast-whisper:3ab86df6c8f54c11309d4d1f930ac292bad43ace52d10c80d87eb258b3c9f79c";
        modelInput = {
          audio: audioDataUri,
          language: this.language || "auto"
        };
      } else if (modelChoice === "openai-whisper") {
        // OpenAI Whisper (Replicate) - принимает audio_file и language (ISO или имя?), лучше как имена
        modelVersion = "openai/whisper:8099696689d249cf8b122d833c36ac3f75505c666a395ca40ef26f68e7d3d16e";
        modelInput = {
          audio: audioDataUri,
          language: this.language || "auto"
        };
      } else {
        // Fallback к whisperx
        modelVersion = "826801120720e563620006b99e412f7ed7b991dd4477e9160473d44a405ef9d9";
        modelInput = {
          audio_file: audioDataUri,
          language: this.language,
          debug: false,
          vad_onset: 0.5,
          batch_size: 64,
          vad_offset: 0.363,
          diarization: false,
          temperature: 0.7,
          align_output: false,
          return_char_alignments: true
        };
      }

      this.addLog("model", "Using model", { model: modelChoice, version: modelVersion });

      // Создаем prediction через официальный SDK
      const prediction = await this.replicate.predictions.create({
        version: modelVersion,
        input: modelInput
      });
      const predictionId = prediction.id;

      this.addLog("prediction", "Prediction created", {
        chunkId,
        predictionId,
        status: prediction.status
      });

      // Ждем завершения prediction
      const result = await this.waitForPrediction(predictionId, chunkId);

      const duration = Date.now() - startTime;

      // Обрабатываем результат
      if (result && result.output) {
        this.processTranscriptionResult(chunkId, result.output, duration);
      }

    } catch (error) {
      console.error(`Transcription failed for ${chunkId}:`, error);

      const errorResult = {
        id: chunkId,
        timestamp: new Date().toISOString(),
        error: error.message,
        success: false
      };

      this.transcriptionResults.push(errorResult);
      this.addLog("error", "Transcription failed", {
        chunkId,
        error: error.message
      });

      this.emit("transcription_failed", errorResult);
      throw error;
    }
  }

  /**
   * Ждать завершения prediction
   */
  async waitForPrediction(predictionId, chunkId) {
    const maxAttempts = 60; // 60 * 2 = 120 секунд максимум
    let attempts = 0;

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Проверяем каждые 2 секунды

      const prediction = await this.replicate.predictions.get(predictionId);

      this.addLog("prediction_status", "Prediction status update", {
        chunkId,
        predictionId,
        status: prediction.status
      });

      if (prediction.status === "succeeded") {
        return prediction;
      } else if (prediction.status === "failed") {
        throw new Error(`Prediction failed: ${prediction.error || 'Unknown error'}`);
      } else if (prediction.status === "canceled") {
        throw new Error("Prediction was canceled");
      }

      attempts++;
    }

    throw new Error("Prediction timeout");
  }

  /**
   * Обработать результат транскрипции
   */
  processTranscriptionResult(chunkId, output, duration) {
    // Унификация выхода разных моделей
    // WhisperX: { segments, word_segments, language }
    // OpenAI Whisper / Faster Whisper: могут вернуть { text } или массив
    let segments = Array.isArray(output.segments) ? output.segments : [];
    let wordSegments = Array.isArray(output.word_segments) ? output.word_segments : [];

    // Если сегментов нет, но есть текст — создаем один сегмент
    if ((!segments || segments.length === 0) && typeof output.text === 'string') {
      segments = [{ text: output.text, start: 0, end: 0 }];
    }

    // Формируем полный текст из сегментов или из text
    const fullText = (segments && segments.length > 0)
      ? segments.map(s => s.text || '').join(' ').trim()
      : (typeof output.text === 'string' ? output.text : '').trim();

    const result = {
      id: chunkId,
      timestamp: new Date().toISOString(),
      segments: segments,
      wordSegments: wordSegments,
      fullText: fullText,
      language: output.language || this.language,
      duration: duration,
      success: true
    };

    this.transcriptionResults.push(result);

    // Ограничиваем количество результатов
    if (this.transcriptionResults.length > this.maxResults) {
      this.transcriptionResults.shift();
    }

    this.addLog("transcription_success", "Transcription completed", {
      chunkId,
      segmentsCount: segments.length,
      wordsCount: wordSegments.length,
      duration
    });

    console.log(`Transcription completed: ${chunkId} - "${result.fullText}"`);

    // Эмитим события для стриминга
    // Сначала отправляем полный результат
    this.emit("transcription_completed", result);

    // Затем стримим слова по одному для real-time эффекта
    wordSegments.forEach((word, index) => {
      this.emit("word", {
        chunkId,
        word: word.word,
        start: word.start,
        end: word.end,
        score: word.score,
        index
      });
    });

    // Стримим символы из сегментов
    segments.forEach((segment, segmentIndex) => {
      const text = segment.text;
      const chars = text.split('');

      chars.forEach((char, charIndex) => {
        this.emit("char", {
          chunkId,
          char,
          segmentIndex,
          charIndex
        });
      });
    });
  }

  /**
   * Получить статус ретранслятора
   */
  getStatus() {
    return {
      isStreaming: this.isStreaming,
      rtmpUrl: this.rtmpUrl,
      language: this.language,
      chunkDuration: this.chunkDuration,
      transcriptionCount: this.transcriptionResults.length,
      logsCount: this.logs.length,
      queueLength: this.processingQueue.length,
      isProcessing: this.isProcessing,
      chunksProcessed: this.chunkCounter
    };
  }

  /**
   * Получить результаты транскрипции
   */
  getTranscriptionResults(limit = 50) {
    return this.transcriptionResults.slice(-limit);
  }

  /**
   * Получить логи
   */
  getLogs(limit = 100) {
    return this.logs.slice(-limit);
  }

  /**
   * Получить логи по типу
   */
  getLogsByType(type, limit = 50) {
    return this.logs
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
    this.logs = [];
    this.addLog("system", "Logs cleared");
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

    this.logs.push(logEntry);

    // Ограничиваем количество логов
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Эмитим событие для внешних слушателей
    this.emit("log", logEntry);
  }
}

export default ReplicateWhisperXRelay;
