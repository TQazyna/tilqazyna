import { EventEmitter } from "events";
import fetch from "node-fetch";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Сервис перевода нормализованных транскрипций через ChatGPT
 *
 * Получает нормализованные тексты от Normalizer,
 * переводит их на русский язык через ChatGPT,
 * и сохраняет результаты в файлы
 */
export class TranscriptionTranslator extends EventEmitter {
  constructor(options = {}) {
    super();
    this.apiKey = options.apiKey;
    this.normalizerId = options.normalizerId;
    this.normalizer = options.normalizer;
    this.model = options.model || "gpt-4o";
    this.temperature = options.temperature || 0.3;
    this.maxTokens = options.maxTokens || 2000;
    this.autoTranslate = options.autoTranslate !== false; // По умолчанию включено
    this.targetLanguage = options.targetLanguage || "russian"; // Целевой язык
    this.sourceLanguage = options.sourceLanguage || "kazakh"; // Исходный язык

    this.prompt = options.prompt || `Ты профессиональный переводчик с казахского на русский язык.

Твоя задача - перевести нормализованный казахский текст на русский язык.

Требования:
1. Перевод должен быть точным и передавать смысл оригинала
2. Используй естественный русский язык
3. Сохраняй стиль и тон оригинального текста
4. Если в тексте есть имена или специальные термины, сохраняй их
5. Верни только перевод без дополнительных комментариев`;

    this.isRunning = false;
    this.translationResults = []; // Результаты перевода
    this.logs = [];
    this.maxLogs = 1000;

    this.stats = {
      translationsCompleted: 0,
      translationsFailed: 0,
      totalTokensUsed: 0
    };

    // Директория для сохранения результатов
    this.dataDir = path.join(__dirname, "translator-data", this.normalizerId);

    // Кэш обработанных нормализаций (чтобы не переводить дважды)
    this.processedNormalizations = new Set();
  }

  /**
   * Запустить переводчик
   */
  async start() {
    if (this.isRunning) {
      throw new Error("Translator is already running");
    }

    if (!this.apiKey) {
      throw new Error("OpenAI API key is required");
    }

    if (!this.normalizer) {
      throw new Error("Normalizer instance is required");
    }

    try {
      // Создаем директорию для данных
      await fs.mkdir(this.dataDir, { recursive: true });

      // Загружаем существующие данные
      await this.loadData();

      // Подписываемся на события normalizer
      this.normalizer.on("normalization_completed", (result) => {
        if (this.autoTranslate) {
          this.handleNewNormalization(result);
        }
      });

      this.isRunning = true;
      this.addLog("info", "Translator started", {
        normalizerId: this.normalizerId,
        autoTranslate: this.autoTranslate,
        targetLanguage: this.targetLanguage
      });

      this.emit("started");
      console.log(`Transcription Translator started for normalizer: ${this.normalizerId}`);
    } catch (error) {
      this.addLog("error", "Failed to start translator", error.message);
      this.emit("error", error);
      throw error;
    }
  }

  /**
   * Остановить переводчик
   */
  stop() {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;

    this.addLog("info", "Translator stopped");
    this.emit("stopped");
    console.log("Transcription Translator stopped");
  }

  /**
   * Обработать новую нормализацию
   */
  async handleNewNormalization(normalization) {
    // Проверяем, не обрабатывали ли мы уже эту нормализацию
    if (this.processedNormalizations.has(normalization.id)) {
      return;
    }

    this.processedNormalizations.add(normalization.id);

    this.addLog("normalization_received", "New normalization received", {
      id: normalization.id,
      text: normalization.normalizedText
    });

    this.emit("normalization_received", normalization);

    // Переводим автоматически
    try {
      await this.translate(normalization);
    } catch (error) {
      console.error("Auto-translate error:", error);
    }
  }

  /**
   * Перевести нормализованный текст
   */
  async translate(normalization) {
    if (!normalization || !normalization.normalizedText) {
      this.addLog("warning", "No text to translate");
      return null;
    }

    const translationId = `translation-${Date.now()}`;
    const normalizationId = normalization.id;

    this.addLog("translation_start", "Starting translation", {
      translationId,
      normalizationId
    });

    try {
      const startTime = Date.now();

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: this.prompt
            },
            {
              role: 'user',
              content: normalization.normalizedText
            }
          ],
          temperature: this.temperature,
          max_tokens: this.maxTokens
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const translatedText = data.choices[0].message.content;
      const tokensUsed = data.usage?.total_tokens || 0;

      const duration = Date.now() - startTime;

      // Создаем результат перевода
      const result = {
        id: translationId,
        timestamp: new Date().toISOString(),
        normalizationId: normalizationId,
        sourceText: normalization.normalizedText,
        originalTexts: normalization.originalTexts, // Сохраняем исходные транскрипции
        translatedText: translatedText,
        sourceLanguage: this.sourceLanguage,
        targetLanguage: this.targetLanguage,
        model: this.model,
        tokensUsed: tokensUsed,
        duration: duration,
        success: true
      };

      // Сохраняем результат
      this.translationResults.unshift(result);

      // Ограничиваем количество результатов в памяти
      if (this.translationResults.length > 100) {
        this.translationResults = this.translationResults.slice(0, 100);
      }

      // Обновляем статистику
      this.stats.translationsCompleted++;
      this.stats.totalTokensUsed += tokensUsed;

      // Сохраняем в файл
      await this.saveResult(result);

      this.addLog("translation_success", "Translation completed", {
        translationId,
        tokensUsed,
        duration
      });

      this.emit("translation_completed", result);

      console.log(`Translation completed: ${translationId} (${tokensUsed} tokens, ${duration}ms)`);

      return result;

    } catch (error) {
      const errorResult = {
        id: translationId,
        timestamp: new Date().toISOString(),
        normalizationId: normalizationId,
        sourceText: normalization.normalizedText,
        error: error.message,
        success: false
      };

      this.translationResults.unshift(errorResult);
      this.stats.translationsFailed++;

      await this.saveResult(errorResult);

      this.addLog("translation_error", "Translation failed", {
        translationId,
        error: error.message
      });

      this.emit("translation_failed", errorResult);

      console.error(`Translation failed: ${translationId}`, error);

      throw error;
    }
  }

  /**
   * Перевести по ID нормализации
   */
  async translateByNormalizationId(normalizationId) {
    const normalization = this.normalizer.getResult(normalizationId);
    if (!normalization) {
      throw new Error("Normalization not found");
    }

    return await this.translate(normalization);
  }

  /**
   * Сохранить результат перевода в файл
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
          this.translationResults.push(result);

          // Добавляем в кэш обработанных
          if (result.normalizationId) {
            this.processedNormalizations.add(result.normalizationId);
          }
        } catch (error) {
          console.error(`Failed to load file ${file}:`, error);
        }
      }

      // Сортируем по timestamp
      this.translationResults.sort((a, b) =>
        new Date(b.timestamp) - new Date(a.timestamp)
      );

      this.addLog("info", "Data loaded", {
        resultsCount: this.translationResults.length
      });

    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error("Failed to load data:", error);
      }
    }
  }

  /**
   * Получить все результаты перевода
   */
  getResults(limit = 50) {
    return this.translationResults.slice(0, limit);
  }

  /**
   * Получить конкретный результат по ID
   */
  getResult(id) {
    return this.translationResults.find(r => r.id === id);
  }

  /**
   * Получить статистику
   */
  getStats() {
    return {
      ...this.stats,
      isRunning: this.isRunning,
      autoTranslate: this.autoTranslate,
      resultsCount: this.translationResults.length,
      targetLanguage: this.targetLanguage,
      sourceLanguage: this.sourceLanguage
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
    this.translationResults = [];
    this.processedNormalizations.clear();

    try {
      const files = await fs.readdir(this.dataDir);
      for (const file of files) {
        if (file.endsWith('.json')) {
          await fs.unlink(path.join(this.dataDir, file));
        }
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
    if (settings.prompt !== undefined) {
      this.prompt = settings.prompt;
      this.addLog("settings", "Prompt updated");
    }

    if (settings.autoTranslate !== undefined) {
      this.autoTranslate = settings.autoTranslate;
      this.addLog("settings", "Auto-translate updated", {
        autoTranslate: this.autoTranslate
      });
    }

    if (settings.targetLanguage !== undefined) {
      this.targetLanguage = settings.targetLanguage;
      this.addLog("settings", "Target language updated", {
        targetLanguage: this.targetLanguage
      });
    }

    if (settings.sourceLanguage !== undefined) {
      this.sourceLanguage = settings.sourceLanguage;
      this.addLog("settings", "Source language updated", {
        sourceLanguage: this.sourceLanguage
      });
    }

    this.emit("settings_updated", settings);
  }
}

export default TranscriptionTranslator;
