import { EventEmitter } from "events";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Replicate from "replicate";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Сервис речевого перевода через SeamlessM4T (Replicate)
 *
 * Получает транскрипции от WhisperX relay,
 * переводит казахский текст в русскую речь через
 * cjwbw/seamless_communication (text-to-speech translation)
 */
export class SeamlessSpeechTranslation extends EventEmitter {
  constructor(options = {}) {
    super();

    this.apiToken = options.apiToken;
    this.whisperxRelay = options.whisperxRelay;
    this.relayId = options.relayId || "default";
    this.model = options.model || "cjwbw/seamless_communication:668a4fec05a887143e5fe8d45df25ec4c794dd43169b9a11562309b2d45873b0";
    this.autoTranslate = options.autoTranslate !== false; // По умолчанию включено

    // Языковые настройки - ЖЕСТКО ЗАФИКСИРОВАНЫ
    this.sourceLanguage = "Kazakh";   // ТОЛЬКО КАЗАХСКИЙ
    this.targetLanguage = "Russian";  // ТОЛЬКО РУССКИЙ
    
    console.log(`[SeamlessSpeech] Languages FIXED: Kazakh → Russian`);

    // Настройки модели
    this.taskName = this.normalizeTaskName(options.taskName || "T2ST"); // Text-to-Speech Translation
    this.maxInputAudioLength = options.maxInputAudioLength || 60; // секунды

    this.isRunning = false;
    this.translationResults = []; // Результаты перевода с аудио
    this.logs = [];
    this.maxLogs = 1000;
    this.maxResults = 100;

    this.stats = {
      translationsCompleted: 0,
      translationsFailed: 0,
      totalProcessingTime: 0,
      averageLatency: 0
    };

    // Директория для сохранения результатов
    this.dataDir = path.join(__dirname, "seamless-speech-data", this.relayId);

    // Кэш обработанных транскрипций (чтобы не переводить дважды)
    this.processedTranscriptions = new Set();

    // Replicate SDK клиент
    this.replicate = null;

    // Очередь переводов
    this.translationQueue = [];
    this.isProcessingQueue = false;
  }

  normalizeTaskName(taskName) {
    const key = String(taskName || "").toLowerCase();
    // Replicate model expects full labels including descriptions
    const map = {
      "s2st": "S2ST (Speech to Speech translation)",
      "s2tt": "S2TT (Speech to Text translation)",
      "t2st": "T2ST (Text to Speech translation)",
      "t2tt": "T2TT (Text to Text translation)",
      "asr": "ASR (Automatic Speech Recognition)"
    };
    if (map[key]) return map[key];
    // If already a full label or unknown string, return as-is; default to T2ST full label
    if (typeof taskName === "string" && taskName.trim()) return taskName;
    return "T2ST (Text to Speech translation)";
  }

  /**
   * Запустить сервис перевода
   */
  async start() {
    if (this.isRunning) {
      throw new Error("SeamlessSpeechTranslation service is already running");
    }

    if (!this.apiToken) {
      throw new Error("Replicate API token is required");
    }

    if (!this.whisperxRelay) {
      throw new Error("WhisperX relay instance is required");
    }

    try {
      // Инициализируем Replicate SDK
      this.replicate = new Replicate({ auth: this.apiToken });

      // Создаем директорию для данных
      await fs.mkdir(this.dataDir, { recursive: true });

      // Загружаем существующие данные
      await this.loadData();

      // Подписываемся на события whisperx relay
      this.whisperxRelay.on("transcription_completed", (transcription) => {
        if (this.autoTranslate) {
          this.handleNewTranscription(transcription);
        }
      });

      this.isRunning = true;
      this.addLog("info", "SeamlessSpeechTranslation service started", {
        relayId: this.relayId,
        autoTranslate: this.autoTranslate,
        model: this.model,
        sourceLanguage: this.sourceLanguage,
        targetLanguage: this.targetLanguage
      });

      this.emit("started");
      console.log(`SeamlessSpeechTranslation service started for relay: ${this.relayId}`);
    } catch (error) {
      this.addLog("error", "Failed to start speech translation service", error.message);
      this.emit("error", error);
      throw error;
    }
  }

  /**
   * Остановить сервис перевода
   */
  async stop() {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;

    // Сохраняем данные перед остановкой
    await this.saveData();

    this.addLog("info", "SeamlessSpeechTranslation service stopped");
    this.emit("stopped");
    console.log("SeamlessSpeechTranslation service stopped");
  }

  /**
   * Обработать новую транскрипцию
   */
  handleNewTranscription(transcription) {
    // Проверяем, не обработали ли мы уже эту транскрипцию
    if (this.processedTranscriptions.has(transcription.id)) {
      return;
    }

    // Проверяем наличие текста
    const text = transcription.fullText || transcription.text || "";
    if (!text || text.trim().length === 0) {
      this.addLog("warning", "Received transcription with empty text", { id: transcription.id });
      return;
    }

    this.addLog("info", "New transcription received", {
      id: transcription.id,
      textLength: text.length,
      preview: text.substring(0, 50)
    });

    // Добавляем в очередь
    this.translationQueue.push(transcription);
    this.processedTranscriptions.add(transcription.id);

    // Запускаем обработку очереди
    if (!this.isProcessingQueue) {
      this.processQueue();
    }
  }

  /**
   * Обработать очередь переводов
   */
  async processQueue() {
    if (this.isProcessingQueue || this.translationQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.translationQueue.length > 0 && this.isRunning) {
      const transcription = this.translationQueue.shift();

      try {
        await this.translateToSpeech(transcription);
      } catch (error) {
        console.error("Error translating transcription:", error);
        this.addLog("error", "Speech translation failed", {
          transcriptionId: transcription.id,
          error: error.message
        });

        this.stats.translationsFailed++;

        this.emit("translation_failed", {
          transcriptionId: transcription.id,
          error: error.message
        });
      }
    }

    this.isProcessingQueue = false;
  }

  /**
   * Перевести текст в речь на другом языке
   */
  async translateToSpeech(transcription) {
    const text = transcription.fullText || transcription.text || "";
    const transcriptionId = transcription.id;

    this.addLog("translation_start", "Starting speech translation", {
      transcriptionId,
      textLength: text.length,
      sourceLanguage: this.sourceLanguage,
      targetLanguage: this.targetLanguage
    });

    this.emit("translation_start", { transcriptionId, text });

    try {
      const startTime = Date.now();

      // Вызываем SeamlessM4T через Replicate
      const result = await this.callSeamlessM4T(text);

      const duration = Date.now() - startTime;

      // Обновляем статистику
      this.stats.translationsCompleted++;
      this.stats.totalProcessingTime += duration;
      this.stats.averageLatency =
        this.stats.totalProcessingTime / this.stats.translationsCompleted;

      // Сохраняем результат
      const translationResult = {
        id: `speech-translation-${transcriptionId}`,
        transcriptionId: transcriptionId,
        originalText: text,
        translatedAudioUrl: result.audioUrl || null,
        translatedAudioPath: result.audioPath || null,
        translatedAudioFilename: result.audioFilename || null,
        translatedText: result.textOutput || null,
        timestamp: new Date().toISOString(),
        duration: duration,
        model: this.model,
        sourceLanguage: this.sourceLanguage,
        targetLanguage: this.targetLanguage,
        success: true,
        metadata: {
          segments: transcription.segments || [],
          wordSegments: transcription.wordSegments || [],
          language: transcription.language || this.sourceLanguage
        }
      };

      this.translationResults.push(translationResult);

      // Ограничиваем количество результатов
      if (this.translationResults.length > this.maxResults) {
        this.translationResults.shift();
      }

      // Сохраняем в файл
      await this.saveTranslationResult(translationResult);

      this.addLog("translation_success", "Speech translation completed", {
        transcriptionId,
        audioPath: result.audioPath,
        audioFilename: result.audioFilename,
        duration
      });

      console.log(`Speech translation completed: ${transcriptionId}`);
      console.log(`Original text: ${text}`);
      console.log(`Translated audio path: ${result.audioPath}`);

      this.emit("translation_completed", translationResult);

      // Читаем аудио файл и отправляем через WebSocket
      if (result.audioPath) {
        try {
          const audioBuffer = await fs.readFile(result.audioPath);
          const audioBase64 = audioBuffer.toString('base64');
          
          console.log(`Audio file read, size: ${audioBuffer.length} bytes, base64 length: ${audioBase64.length}`);
          
          // Эмитим событие для воспроизведения аудио с данными
          this.emit("audio_ready", {
            transcriptionId,
            audioFilename: result.audioFilename,
            audioData: audioBase64,
            audioFormat: 'wav',
            originalText: text,
            translatedText: result.textOutput,
            size: audioBuffer.length
          });
        } catch (readError) {
          console.error("Error reading audio file for WebSocket:", readError);
          this.addLog("error", "Failed to read audio for WebSocket", readError.message);
        }
      }

      return translationResult;

    } catch (error) {
      console.error(`Speech translation failed for ${transcriptionId}:`, error);

      const errorResult = {
        id: `speech-translation-${transcriptionId}`,
        transcriptionId: transcriptionId,
        originalText: text,
        timestamp: new Date().toISOString(),
        error: error.message,
        success: false
      };

      this.translationResults.push(errorResult);
      this.addLog("error", "Speech translation failed", {
        transcriptionId,
        error: error.message
      });

      throw error;
    }
  }

  /**
   * Вызвать SeamlessM4T для текст-в-речь перевода
   */
  async callSeamlessM4T(text) {
    try {
      const apiInput = {
        task_name: "T2ST (Text to Speech translation)",
        input_text: text,
        input_text_language: "Kazakh",  // ЖЕСТКО: КАЗАХСКИЙ
        max_input_audio_length: 60,
        target_language: "Russian",     // ЖЕСТКО: РУССКИЙ (текст)
        target_language_with_speech: "Russian",  // ЖЕСТКО: РУССКИЙ (речь) ← ВАЖНО!
        generate_speech: true
      };

      console.log("=== SEAMLESSM4T INPUT DEBUG ===");
      console.log("API Input:", JSON.stringify(apiInput, null, 2));
      console.log("=== END INPUT DEBUG ===");

      this.addLog("api_call", "Calling SeamlessM4T API", {
        model: this.model,
        textLength: text.length,
        task: this.taskName,
        sourceLanguage: this.sourceLanguage,
        targetLanguage: this.targetLanguage,
        apiInput
      });

      // Используем Replicate SDK для вызова модели seamless_communication
      const output = await this.replicate.run(
        this.model,
        {
          input: apiInput
        }
      );

      this.addLog("api_response", "SeamlessM4T API response received", {
        outputType: typeof output
      });

      // Логируем форму выхода для диагностики
      this.addLog("api_response_raw", "SeamlessM4T raw output", {
        typeof: Array.isArray(output) ? "array" : typeof output,
        preview: Array.isArray(output) ? JSON.stringify(output.slice(0, 2)) : JSON.stringify(output)
      });

      // Детальное логирование для отладки
      console.log("=== SEAMLESSM4T OUTPUT DEBUG ===");
      console.log("Type:", Array.isArray(output) ? "array" : typeof output);
      console.log("Full output:", JSON.stringify(output, null, 2));
      if (Array.isArray(output)) {
        console.log("Array length:", output.length);
        output.forEach((item, idx) => {
          console.log(`Array[${idx}]:`, typeof item, item);
        });
      } else if (typeof output === "object" && output !== null) {
        console.log("Object keys:", Object.keys(output));
        for (const [key, value] of Object.entries(output)) {
          console.log(`  ${key}:`, typeof value, value);
        }
      }
      console.log("=== END DEBUG ===");

      // Проверяем, есть ли audio_output stream
      if (output && typeof output === "object" && output.audio_output) {
        console.log("Found audio_output stream, processing...");
        
        // Если audio_output - это ReadableStream, читаем его
        if (output.audio_output instanceof ReadableStream || 
            (output.audio_output && typeof output.audio_output.getReader === "function")) {
          
          try {
            // Читаем stream в буфер
            const reader = output.audio_output.getReader();
            const chunks = [];
            
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              chunks.push(value);
            }
            
            // Объединяем chunks в один буфер
            const audioBuffer = Buffer.concat(chunks);
            console.log(`Audio buffer size: ${audioBuffer.length} bytes`);
            
            // Сохраняем аудио во временный файл
            const timestamp = Date.now();
            const audioFilename = `seamless-audio-${timestamp}.wav`;
            const audioPath = path.join(this.dataDir, audioFilename);
            
            await fs.writeFile(audioPath, audioBuffer);
            console.log(`Audio saved to: ${audioPath}`);
            
            // Логируем текстовый вывод для проверки языка
            if (output.text_output) {
              console.log("=== TRANSLATED TEXT OUTPUT ===");
              console.log("Text:", output.text_output);
              console.log("Expected target language:", this.targetLanguage);
              console.log("==============================");
            }
            
            this.addLog("audio_saved", "Audio stream saved to file", { 
              audioPath,
              audioFilename,
              size: audioBuffer.length,
              textOutput: output.text_output 
            });
            
            // Возвращаем путь к файлу
            return { 
              audioPath, 
              audioFilename,
              textOutput: output.text_output 
            };
            
          } catch (streamError) {
            console.error("Error reading audio stream:", streamError);
            throw new Error(`Failed to read audio stream: ${streamError.message}`);
          }
        }
      }

      // Fallback: пытаемся извлечь URL (старая логика)
      const urlRegex = /(https?:\/\/[^\s"']+\.(?:mp3|wav|m4a|aac|ogg|opus)(?:\?[^\s"']*)?)/i;

      const tryExtractFrom = (val) => {
        if (!val) return null;
        if (typeof val === "string") return val;
        if (typeof val === "object") {
          // common keys where URLs might be provided
          if (typeof val.audio === "string") return val.audio;
          if (typeof val.audio_url === "string") return val.audio_url;
          if (typeof val.output === "string") return val.output;
          if (Array.isArray(val.output) && val.output.length > 0 && typeof val.output[0] === "string") return val.output[0];
          // nested typical
          if (val.result && typeof val.result.audio === "string") return val.result.audio;
          // scan known keys for url
          for (const k of Object.keys(val)) {
            const v = val[k];
            if (typeof v === "string") {
              const m = v.match(urlRegex);
              if (m) return m[1];
            }
          }
        }
        return null;
      };

      let audioUrl = "";
      if (Array.isArray(output)) {
        audioUrl = tryExtractFrom(output[0]) || tryExtractFrom(output.find(v => v)) || "";
      } else {
        audioUrl = tryExtractFrom(output) || "";
      }

      if ((!audioUrl || typeof audioUrl !== "string") && typeof output === "string") {
        const m = output.match(urlRegex);
        if (m) audioUrl = m[1];
      }

      if (!audioUrl || typeof audioUrl !== "string") {
        throw new Error("Unexpected output format from SeamlessM4T");
      }

      if (!audioUrl) {
        throw new Error("No audio URL received from SeamlessM4T");
      }

      this.addLog("audio_url", "Audio URL received", { audioUrl });

      return { audioUrl };

    } catch (error) {
      console.error("SeamlessM4T API error:", error);
      this.addLog("error", "SeamlessM4T API call failed", error.message);
      throw new Error(`SeamlessM4T translation failed: ${error.message}`);
    }
  }

  /**
   * Сохранить результат перевода в файл
   */
  async saveTranslationResult(result) {
    try {
      const filename = `speech-translation-${result.transcriptionId}.json`;
      const filepath = path.join(this.dataDir, filename);

      await fs.writeFile(filepath, JSON.stringify(result, null, 2));

      this.addLog("file", "Translation result saved to file", { filename });
    } catch (error) {
      console.error("Error saving translation result:", error);
      this.addLog("error", "Failed to save translation result", error.message);
    }
  }

  /**
   * Загрузить существующие данные
   */
  async loadData() {
    try {
      // Загружаем результаты перевода
      const files = await fs.readdir(this.dataDir).catch(() => []);
      const translationFiles = files.filter(f => f.startsWith("speech-translation-") && f.endsWith(".json"));

      for (const file of translationFiles.slice(-this.maxResults)) {
        try {
          const filepath = path.join(this.dataDir, file);
          const content = await fs.readFile(filepath, "utf-8");
          const result = JSON.parse(content);
          this.translationResults.push(result);
        } catch (err) {
          console.error(`Error loading translation file ${file}:`, err);
        }
      }

      // Загружаем статистику
      const statsFile = path.join(this.dataDir, "stats.json");
      try {
        const statsContent = await fs.readFile(statsFile, "utf-8");
        const savedStats = JSON.parse(statsContent);
        this.stats = { ...this.stats, ...savedStats };
      } catch (err) {
        // Файл статистики не существует - это нормально при первом запуске
      }

      this.addLog("info", "Data loaded", {
        translationsLoaded: this.translationResults.length
      });

    } catch (error) {
      console.error("Error loading data:", error);
      this.addLog("error", "Failed to load data", error.message);
    }
  }

  /**
   * Сохранить данные
   */
  async saveData() {
    try {
      // Сохраняем статистику
      const statsFile = path.join(this.dataDir, "stats.json");
      await fs.writeFile(statsFile, JSON.stringify(this.stats, null, 2));

      this.addLog("info", "Data saved", { stats: this.stats });
    } catch (error) {
      console.error("Error saving data:", error);
      this.addLog("error", "Failed to save data", error.message);
    }
  }

  /**
   * Получить статус сервиса
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      relayId: this.relayId,
      model: this.model,
      translationCount: this.translationResults.length,
      queueLength: this.translationQueue.length,
      isProcessing: this.isProcessingQueue,
      stats: this.stats,
      autoTranslate: this.autoTranslate,
      sourceLanguage: this.sourceLanguage,
      targetLanguage: this.targetLanguage
    };
  }

  /**
   * Получить результаты переводов
   */
  getTranslationResults(limit = 50) {
    return this.translationResults.slice(-limit);
  }

  /**
   * Получить логи
   */
  getLogs(limit = 100) {
    return this.logs.slice(-limit);
  }

  /**
   * Получить путь к аудио файлу
   */
  getAudioFilePath(filename) {
    const audioPath = path.join(this.dataDir, filename);
    return audioPath;
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
   * Очистить результаты переводов
   */
  clearTranslationResults() {
    this.translationResults = [];
    this.processedTranscriptions.clear();
    this.addLog("system", "Translation results cleared");
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

  /**
   * Ручной перевод текста в речь (для тестирования или ручного вызова)
   */
  async manualTranslate(text) {
    const mockTranscription = {
      id: `manual-${Date.now()}`,
      fullText: text,
      timestamp: new Date().toISOString()
    };

    return await this.translateToSpeech(mockTranscription);
  }
}

export default SeamlessSpeechTranslation;
