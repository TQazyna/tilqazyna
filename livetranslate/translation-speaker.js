import { EventEmitter } from "events";
import fetch from "node-fetch";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Сервис озвучивания переведенных текстов через OpenAI TTS
 *
 * Получает переводы от Translator и автоматически озвучивает их
 * через OpenAI Text-to-Speech API
 */
export class TranslationSpeaker extends EventEmitter {
  constructor(options = {}) {
    super();

    this.apiKey = options.apiKey;
    this.translatorId = options.translatorId;
    this.translator = options.translator;
    this.model = options.model || "tts-1"; // tts-1 или tts-1-hd
    this.voice = options.voice || "alloy"; // alloy, echo, fable, onyx, nova, shimmer
    this.autoSpeak = options.autoSpeak !== false; // По умолчанию включено
    this.speed = options.speed || 2.0; // 0.25 - 4.0

    this.isRunning = false;
    this.speechResults = []; // Результаты озвучивания
    this.logs = [];
    this.maxLogs = 1000;

    this.stats = {
      speechCompleted: 0,
      speechFailed: 0,
      totalCharacters: 0,
      totalAudioDuration: 0
    };

    // Директория для сохранения аудио файлов
    this.dataDir = path.join(__dirname, "speaker-data", this.translatorId);

    // Кэш обработанных переводов (чтобы не озвучивать дважды)
    this.processedTranslations = new Set();

    // Очередь переводов для озвучивания
    this.translationQueue = [];
    this.isProcessingQueue = false;
  }

  /**
   * Запустить озвучиватель
   */
  async start() {
    if (this.isRunning) {
      throw new Error("Speaker is already running");
    }

    if (!this.apiKey) {
      throw new Error("OpenAI API key is required");
    }

    if (!this.translator) {
      throw new Error("Translator instance is required");
    }

    try {
      // Создаем директорию для данных
      await fs.mkdir(this.dataDir, { recursive: true });

      // Загружаем существующие данные
      await this.loadData();

      // Подписываемся на события translator
      this.translator.on("translation_completed", (result) => {
        if (this.autoSpeak) {
          this.handleNewTranslation(result);
        }
      });

      this.isRunning = true;
      this.addLog("info", "Speaker started", {
        translatorId: this.translatorId,
        autoSpeak: this.autoSpeak,
        voice: this.voice,
        model: this.model
      });

      this.emit("started");
      console.log(`Translation Speaker started for translator: ${this.translatorId}`);
    } catch (error) {
      this.addLog("error", "Failed to start speaker", error.message);
      this.emit("error", error);
      throw error;
    }
  }

  /**
   * Остановить озвучиватель
   */
  stop() {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;

    this.addLog("info", "Speaker stopped");
    this.emit("stopped");
    console.log("Translation Speaker stopped");
  }

  /**
   * Обработать новый перевод
   */
  async handleNewTranslation(translation) {
    // Проверяем, не обрабатывали ли мы уже этот перевод
    if (this.processedTranslations.has(translation.id)) {
      return;
    }

    this.processedTranslations.add(translation.id);

    this.addLog("translation_received", "New translation received", {
      id: translation.id,
      text: translation.translatedText
    });

    this.emit("translation_received", translation);

    // ВАЖНО: Очищаем очередь - нам нужен только последний перевод
    this.translationQueue = [translation];

    // Запускаем обработку очереди если она не запущена
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

    while (this.translationQueue.length > 0) {
      const translation = this.translationQueue.shift();

      try {
        await this.speak(translation);

        // Небольшая задержка между озвучиваниями
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error("Error processing translation:", error);
      }
    }

    this.isProcessingQueue = false;
  }

  /**
   * Озвучить переведенный текст
   */
  async speak(translation) {
    if (!translation || !translation.translatedText) {
      this.addLog("warning", "No text to speak");
      return null;
    }

    const speechId = `speech-${Date.now()}`;
    const translationId = translation.id;
    const text = translation.translatedText;

    this.addLog("speech_start", "Starting speech synthesis", {
      speechId,
      translationId,
      textLength: text.length
    });

    try {
      const startTime = Date.now();

      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          voice: this.voice,
          input: text,
          speed: this.speed
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`API request failed with status ${response.status}: ${errorData}`);
      }

      // Получаем аудио данные
      const audioBuffer = await response.buffer();
      const duration = Date.now() - startTime;

      // Сохраняем аудио файл
      const audioFilename = `${speechId}.mp3`;
      const audioFilepath = path.join(this.dataDir, audioFilename);
      await fs.writeFile(audioFilepath, audioBuffer);

      // Создаем результат озвучивания
      const result = {
        id: speechId,
        timestamp: new Date().toISOString(),
        translationId: translationId,
        text: text,
        audioFile: audioFilename,
        audioSize: audioBuffer.length,
        model: this.model,
        voice: this.voice,
        speed: this.speed,
        duration: duration,
        success: true
      };

      // Сохраняем результат
      this.speechResults.unshift(result);

      // Ограничиваем количество результатов в памяти
      if (this.speechResults.length > 100) {
        this.speechResults = this.speechResults.slice(0, 100);
      }

      // Обновляем статистику
      this.stats.speechCompleted++;
      this.stats.totalCharacters += text.length;
      this.stats.totalAudioDuration += duration;

      // Сохраняем метаданные в JSON
      await this.saveResult(result);

      this.addLog("speech_success", "Speech synthesis completed", {
        speechId,
        audioSize: audioBuffer.length,
        duration
      });

      this.emit("speech_completed", result);

      console.log(`Speech completed: ${speechId} (${audioBuffer.length} bytes, ${duration}ms)`);

      return result;

    } catch (error) {
      const errorResult = {
        id: speechId,
        timestamp: new Date().toISOString(),
        translationId: translationId,
        text: text,
        error: error.message,
        success: false
      };

      this.speechResults.unshift(errorResult);
      this.stats.speechFailed++;

      await this.saveResult(errorResult);

      this.addLog("speech_error", "Speech synthesis failed", {
        speechId,
        error: error.message
      });

      this.emit("speech_failed", errorResult);

      console.error(`Speech failed: ${speechId}`, error);

      throw error;
    }
  }

  /**
   * Озвучить по ID перевода
   */
  async speakByTranslationId(translationId) {
    const translation = this.translator.getResult(translationId);
    if (!translation) {
      throw new Error("Translation not found");
    }

    return await this.speak(translation);
  }

  /**
   * Сохранить результат в файл (только метаданные)
   */
  async saveResult(result) {
    const filename = `${result.id}.json`;
    const filepath = path.join(this.dataDir, filename);

    try {
      await fs.writeFile(filepath, JSON.stringify(result, null, 2));
      this.addLog("file", "Result saved to file", { filename });
    } catch (error) {
      this.addLog("error", "Failed to save result to file", error.message);
      console.error("Failed to save result:", error);
    }
  }

  /**
   * Загрузить существующие данные
   */
  async loadData() {
    try {
      const files = await fs.readdir(this.dataDir);
      const jsonFiles = files.filter(f => f.endsWith('.json'));

      for (const file of jsonFiles.slice(-100)) { // Загружаем последние 100
        try {
          const filepath = path.join(this.dataDir, file);
          const content = await fs.readFile(filepath, 'utf-8');
          const result = JSON.parse(content);
          this.speechResults.push(result);

          // Добавляем в кэш обработанных
          if (result.translationId) {
            this.processedTranslations.add(result.translationId);
          }
        } catch (error) {
          console.error(`Failed to load file ${file}:`, error);
        }
      }

      // Сортируем по timestamp
      this.speechResults.sort((a, b) =>
        new Date(b.timestamp) - new Date(a.timestamp)
      );

      this.addLog("info", "Data loaded", {
        resultsCount: this.speechResults.length
      });

    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error("Failed to load data:", error);
      }
    }
  }

  /**
   * Получить аудио файл
   */
  async getAudioFile(speechId) {
    const result = this.speechResults.find(r => r.id === speechId);
    if (!result || !result.audioFile) {
      throw new Error("Audio file not found");
    }

    const filepath = path.join(this.dataDir, result.audioFile);
    return await fs.readFile(filepath);
  }

  /**
   * Получить все результаты озвучивания
   */
  getResults(limit = 50) {
    return this.speechResults.slice(0, limit);
  }

  /**
   * Получить конкретный результат по ID
   */
  getResult(id) {
    return this.speechResults.find(r => r.id === id);
  }

  /**
   * Получить статистику
   */
  getStats() {
    return {
      ...this.stats,
      isRunning: this.isRunning,
      autoSpeak: this.autoSpeak,
      resultsCount: this.speechResults.length,
      queueLength: this.translationQueue.length,
      voice: this.voice,
      model: this.model
    };
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
   * Очистить результаты
   */
  async clearResults() {
    this.speechResults = [];
    this.processedTranslations.clear();

    try {
      const files = await fs.readdir(this.dataDir);
      for (const file of files) {
        await fs.unlink(path.join(this.dataDir, file));
      }
      this.addLog("info", "All results cleared");
    } catch (error) {
      this.addLog("error", "Failed to clear results", error.message);
      throw error;
    }
  }

  /**
   * Очистить логи
   */
  clearLogs() {
    this.logs = [];
    this.addLog("info", "Logs cleared");
  }

  /**
   * Добавить лог
   */
  addLog(type, message, data = null) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type,
      message,
      data
    };

    this.logs.push(logEntry);

    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    this.emit("log", logEntry);
  }

  /**
   * Обновить настройки
   */
  updateSettings(settings) {
    if (settings.voice !== undefined) {
      this.voice = settings.voice;
      this.addLog("settings", "Voice updated", { voice: this.voice });
    }

    if (settings.model !== undefined) {
      this.model = settings.model;
      this.addLog("settings", "Model updated", { model: this.model });
    }

    if (settings.speed !== undefined) {
      this.speed = settings.speed;
      this.addLog("settings", "Speed updated", { speed: this.speed });
    }

    if (settings.autoSpeak !== undefined) {
      this.autoSpeak = settings.autoSpeak;
      this.addLog("settings", "Auto-speak updated", {
        autoSpeak: this.autoSpeak
      });
    }

    this.emit("settings_updated", settings);
  }
}

export default TranslationSpeaker;
