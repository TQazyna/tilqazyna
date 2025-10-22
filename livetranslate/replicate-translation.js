import { EventEmitter } from "events";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Replicate from "replicate";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Сервис перевода транскрипций через Replicate GPT-OSS-20B
 *
 * Получает транскрипции от WhisperX relay,
 * переводит и нормализует их с помощью openai/gpt-oss-20b через Replicate,
 * с поддержкой контекста предыдущих сообщений
 */
export class ReplicateTranslation extends EventEmitter {
  constructor(options = {}) {
    super();

    this.apiToken = options.apiToken;
    this.whisperxRelay = options.whisperxRelay;
    this.relayId = options.relayId || "default";
    this.model = options.model || "openai/gpt-oss-20b";
    this.temperature = options.temperature || 0.3;
    this.maxTokens = options.maxTokens || 2000;
    this.autoTranslate = options.autoTranslate !== false; // По умолчанию включено
    this.contextSize = options.contextSize || 10; // Количество предыдущих сообщений для контекста

    this.sourceLanguage = options.sourceLanguage || "kazakh";
    this.targetLanguage = options.targetLanguage || "russian";

    // Системный промпт для перевода и нормализации
    this.systemPrompt = options.systemPrompt || `Ты профессиональный переводчик с казахского на русский язык.

Твоя задача - перевести казахский текст на русский язык и одновременно нормализовать его.

Требования:
1. Исправь ошибки транскрипции и орфографии в исходном тексте
2. Переведи с казахского на русский язык точно передавая смысл
3. Используй естественный грамотный русский язык
4. Сохраняй стиль и тон оригинального текста
5. Если в тексте есть имена или специальные термины, сохраняй их
6. Учитывай контекст предыдущих сообщений для лучшего перевода

Верни только перевод без дополнительных комментариев или пояснений.`;

    this.isRunning = false;
    this.translationResults = []; // Результаты перевода
    this.contextHistory = []; // История для контекста (оригинал + перевод)
    this.logs = [];
    this.maxLogs = 1000;
    this.maxResults = 100;

    this.stats = {
      translationsCompleted: 0,
      translationsFailed: 0,
      totalTokensUsed: 0,
      averageLatency: 0
    };

    // Директория для сохранения результатов
    this.dataDir = path.join(__dirname, "replicate-translation-data", this.relayId);

    // Кэш обработанных транскрипций (чтобы не переводить дважды)
    this.processedTranscriptions = new Set();

    // Replicate SDK клиент
    this.replicate = null;

    // Очередь переводов
    this.translationQueue = [];
    this.isProcessingQueue = false;
  }

  /**
   * Запустить сервис перевода
   */
  async start() {
    if (this.isRunning) {
      throw new Error("Translation service is already running");
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
      this.addLog("info", "Replicate Translation service started", {
        relayId: this.relayId,
        autoTranslate: this.autoTranslate,
        model: this.model,
        contextSize: this.contextSize
      });

      this.emit("started");
      console.log(`Replicate Translation service started for relay: ${this.relayId}`);
    } catch (error) {
      this.addLog("error", "Failed to start translation service", error.message);
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

    this.addLog("info", "Replicate Translation service stopped");
    this.emit("stopped");
    console.log("Replicate Translation service stopped");
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
        await this.translateTranscription(transcription);
      } catch (error) {
        console.error("Error translating transcription:", error);
        this.addLog("error", "Translation failed", {
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
   * Перевести транскрипцию
   */
  async translateTranscription(transcription) {
    const text = transcription.fullText || transcription.text || "";
    const transcriptionId = transcription.id;

    this.addLog("translation_start", "Starting translation", {
      transcriptionId,
      textLength: text.length
    });

    this.emit("translation_start", { transcriptionId, text });

    try {
      const startTime = Date.now();

      // Формируем контекст из предыдущих сообщений
      const contextMessages = this.buildContextMessages();

      // Формируем промпт с контекстом
      const userPrompt = this.buildPromptWithContext(text, contextMessages);

      // Вызываем Replicate GPT-OSS-20B
      const translation = await this.callReplicateTranslation(userPrompt);

      const duration = Date.now() - startTime;

      // Обновляем статистику
      this.stats.translationsCompleted++;
      this.stats.averageLatency =
        (this.stats.averageLatency * (this.stats.translationsCompleted - 1) + duration) /
        this.stats.translationsCompleted;

      // Сохраняем результат
      const result = {
        id: `translation-${transcriptionId}`,
        transcriptionId: transcriptionId,
        originalText: text,
        translatedText: translation,
        timestamp: new Date().toISOString(),
        duration: duration,
        model: this.model,
        success: true,
        metadata: {
          segments: transcription.segments || [],
          wordSegments: transcription.wordSegments || [],
          language: transcription.language || this.sourceLanguage
        }
      };

      this.translationResults.push(result);

      // Ограничиваем количество результатов
      if (this.translationResults.length > this.maxResults) {
        this.translationResults.shift();
      }

      // Добавляем в историю контекста
      this.addToContext(text, translation);

      // Сохраняем в файл
      await this.saveTranslationResult(result);

      this.addLog("translation_success", "Translation completed", {
        transcriptionId,
        originalLength: text.length,
        translatedLength: translation.length,
        duration
      });

      console.log(`Translation completed: ${transcriptionId}`);
      console.log(`Original: ${text}`);
      console.log(`Translation: ${translation}`);

      this.emit("translation_completed", result);

      return result;

    } catch (error) {
      console.error(`Translation failed for ${transcriptionId}:`, error);

      const errorResult = {
        id: `translation-${transcriptionId}`,
        transcriptionId: transcriptionId,
        originalText: text,
        timestamp: new Date().toISOString(),
        error: error.message,
        success: false
      };

      this.translationResults.push(errorResult);
      this.addLog("error", "Translation failed", {
        transcriptionId,
        error: error.message
      });

      throw error;
    }
  }

  /**
   * Вызвать Replicate для перевода
   */
  async callReplicateTranslation(prompt) {
    try {
      // Используем Replicate SDK для вызова модели openai/gpt-oss-20b
      const output = await this.replicate.run(
        this.model,
        {
          input: {
            prompt: prompt,
            max_new_tokens: this.maxTokens,
            temperature: this.temperature,
            top_p: 0.95,
            repetition_penalty: 1.1
          }
        }
      );

      // Output может быть массивом строк или одной строкой
      let translation = "";
      if (Array.isArray(output)) {
        translation = output.join("");
      } else if (typeof output === "string") {
        translation = output;
      } else {
        translation = String(output);
      }

      // Очищаем перевод от лишних пробелов
      translation = translation.trim();

      // Подсчитываем использованные токены (примерно)
      const tokensUsed = Math.ceil((prompt.length + translation.length) / 4);
      this.stats.totalTokensUsed += tokensUsed;

      return translation;

    } catch (error) {
      console.error("Replicate API error:", error);
      throw new Error(`Replicate translation failed: ${error.message}`);
    }
  }

  /**
   * Построить сообщения контекста
   */
  buildContextMessages() {
    // Берем последние N сообщений из истории
    const recentContext = this.contextHistory.slice(-this.contextSize);
    return recentContext;
  }

  /**
   * Построить промпт с контекстом
   */
  buildPromptWithContext(currentText, contextMessages) {
    let prompt = this.systemPrompt + "\n\n";

    // Добавляем контекст предыдущих сообщений
    if (contextMessages.length > 0) {
      prompt += "Контекст предыдущих сообщений:\n";
      contextMessages.forEach((ctx, index) => {
        prompt += `${index + 1}. Казахский: "${ctx.original}"\n`;
        prompt += `   Русский: "${ctx.translation}"\n\n`;
      });
    }

    // Добавляем текущее сообщение для перевода
    prompt += `Переведи следующий текст с казахского на русский:\n"${currentText}"\n\n`;
    prompt += "Перевод:";

    return prompt;
  }

  /**
   * Добавить в историю контекста
   */
  addToContext(original, translation) {
    this.contextHistory.push({
      original: original,
      translation: translation,
      timestamp: new Date().toISOString()
    });

    // Ограничиваем размер истории (храним максимум contextSize * 2)
    const maxHistory = this.contextSize * 2;
    if (this.contextHistory.length > maxHistory) {
      this.contextHistory = this.contextHistory.slice(-maxHistory);
    }
  }

  /**
   * Сохранить результат перевода в файл
   */
  async saveTranslationResult(result) {
    try {
      const filename = `translation-${result.transcriptionId}.json`;
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
      const translationFiles = files.filter(f => f.startsWith("translation-") && f.endsWith(".json"));

      for (const file of translationFiles.slice(-this.maxResults)) {
        try {
          const filepath = path.join(this.dataDir, file);
          const content = await fs.readFile(filepath, "utf-8");
          const result = JSON.parse(content);
          this.translationResults.push(result);

          // Добавляем в историю контекста если успешный
          if (result.success) {
            this.addToContext(result.originalText, result.translatedText);
          }
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
        translationsLoaded: this.translationResults.length,
        contextSize: this.contextHistory.length
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
      contextSize: this.contextHistory.length,
      queueLength: this.translationQueue.length,
      isProcessing: this.isProcessingQueue,
      stats: this.stats,
      autoTranslate: this.autoTranslate
    };
  }

  /**
   * Получить результаты переводов
   */
  getTranslationResults(limit = 50) {
    return this.translationResults.slice(-limit);
  }

  /**
   * Получить историю контекста
   */
  getContextHistory(limit = 10) {
    return this.contextHistory.slice(-limit);
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
   * Очистить результаты переводов
   */
  clearTranslationResults() {
    this.translationResults = [];
    this.processedTranscriptions.clear();
    this.addLog("system", "Translation results cleared");
  }

  /**
   * Очистить историю контекста
   */
  clearContextHistory() {
    this.contextHistory = [];
    this.addLog("system", "Context history cleared");
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
   * Ручной перевод текста (для тестирования или ручного вызова)
   */
  async manualTranslate(text) {
    const mockTranscription = {
      id: `manual-${Date.now()}`,
      fullText: text,
      timestamp: new Date().toISOString()
    };

    return await this.translateTranscription(mockTranscription);
  }
}

export default ReplicateTranslation;
