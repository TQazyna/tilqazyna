import { EventEmitter } from "events";
import fetch from "node-fetch";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Сервис нормализации транскрипций через ChatGPT
 *
 * Получает транскрипции от RTMP relay, накапливает последние 10,
 * отправляет в ChatGPT для нормализации текста на казахском языке,
 * и сохраняет результаты в файлы
 */
export class TranscriptionNormalizer extends EventEmitter {
  constructor(options = {}) {
    super();

    this.apiKey = options.apiKey;
    this.relayId = options.relayId;
    this.relay = options.relay;
    this.model = options.model || "gpt-4o";
    this.temperature = options.temperature || 0.3;
    this.maxTokens = options.maxTokens || 2000;
    this.batchSize = options.batchSize || 10; // Количество транскрипций для нормализации
    this.autoNormalize = options.autoNormalize !== false; // По умолчанию включено
    this.normalizeInterval = options.normalizeInterval || 30000; // 30 секунд

    this.prompt = options.prompt || `Ты эксперт по казахскому языку. Твоя задача - исправить ошибки транскрипции казахской речи и привести текст в правильный, читаемый формат.

Исходная транскрипция может содержать:
- Ошибки распознавания речи
- Неправильно написанные слова
- Отсутствие знаков препинания

Твоя задача:
1. Исправить все ошибки казахского языка
2. Добавить необходимые знаки препинания
3. Сделать текст максимально понятным и грамотным
4. Сохранить смысл исходного текста

Верни только исправленный текст без дополнительных комментариев.`;

    this.isRunning = false;
    this.transcriptions = []; // Последние транскрипции
    this.normalizedResults = []; // Результаты нормализации
    this.logs = [];
    this.maxLogs = 1000;

    this.stats = {
      transcriptionsReceived: 0,
      normalizationsCompleted: 0,
      normalizationsFailed: 0,
      totalTokensUsed: 0
    };

    this.autoNormalizeTimer = null;

    // Директория для сохранения результатов
    this.dataDir = path.join(__dirname, "normalizer-data", this.relayId);
  }

  /**
   * Запустить нормализатор
   */
  async start() {
    if (this.isRunning) {
      throw new Error("Normalizer is already running");
    }

    if (!this.apiKey) {
      throw new Error("OpenAI API key is required");
    }

    if (!this.relay) {
      throw new Error("Relay instance is required");
    }

    try {
      // Создаем директорию для данных
      await fs.mkdir(this.dataDir, { recursive: true });

      // Загружаем существующие данные
      await this.loadData();

      // Подписываемся на события relay
      this.relay.on("transcription_completed", (transcription) => {
        this.handleNewTranscription(transcription);
      });

      // Запускаем автоматическую нормализацию если включена
      if (this.autoNormalize) {
        this.startAutoNormalize();
      }

      this.isRunning = true;
      this.addLog("info", "Normalizer started", {
        relayId: this.relayId,
        autoNormalize: this.autoNormalize,
        batchSize: this.batchSize
      });

      this.emit("started");
      console.log(`Transcription Normalizer started for relay: ${this.relayId}`);
    } catch (error) {
      this.addLog("error", "Failed to start normalizer", error.message);
      this.emit("error", error);
      throw error;
    }
  }

  /**
   * Остановить нормализатор
   */
  stop() {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;

    // Останавливаем автоматическую нормализацию
    if (this.autoNormalizeTimer) {
      clearInterval(this.autoNormalizeTimer);
      this.autoNormalizeTimer = null;
    }

    this.addLog("info", "Normalizer stopped");
    this.emit("stopped");
    console.log("Transcription Normalizer stopped");
  }

  /**
   * Обработать новую транскрипцию
   */
  handleNewTranscription(transcription) {
    this.transcriptions.unshift(transcription);

    // Ограничиваем до batchSize
    if (this.transcriptions.length > this.batchSize) {
      this.transcriptions = this.transcriptions.slice(0, this.batchSize);
    }

    this.stats.transcriptionsReceived++;

    this.addLog("transcription", "New transcription received", {
      id: transcription.id,
      text: transcription.transcript
    });

    this.emit("transcription_received", transcription);
  }

  /**
   * Запустить автоматическую нормализацию
   */
  startAutoNormalize() {
    if (this.autoNormalizeTimer) {
      return;
    }

    this.autoNormalizeTimer = setInterval(() => {
      if (this.transcriptions.length > 0) {
        this.normalize().catch(error => {
          console.error("Auto-normalize error:", error);
        });
      }
    }, this.normalizeInterval);

    this.addLog("info", "Auto-normalize started", {
      interval: this.normalizeInterval
    });
  }

  /**
   * Остановить автоматическую нормализацию
   */
  stopAutoNormalize() {
    if (this.autoNormalizeTimer) {
      clearInterval(this.autoNormalizeTimer);
      this.autoNormalizeTimer = null;
      this.addLog("info", "Auto-normalize stopped");
    }
  }

  /**
   * Нормализовать только последнее сообщение, используя до 9 предыдущих нормализованных как контекст
   */
  async normalize() {
    if (this.transcriptions.length === 0) {
      this.addLog("warning", "No transcriptions to normalize");
      return null;
    }

    // Целимся на самую свежую транскрипцию
    const targetTranscription = this.transcriptions[0];

    // Формируем контекст из предыдущих нормализованных результатов
    const maxContext = Math.max(0, Math.min((this.batchSize || 10) - 1, this.normalizedResults.length));
    const contextNormalizedTexts = this.normalizedResults
      .slice(0, maxContext)
      .map(r => r.normalizedText)
      .filter(Boolean)
      .reverse(); // от старых к новым в тексте

    const batchId = `norm-${Date.now()}`;

    this.addLog("normalization_start", "Starting single-message normalization", {
      batchId,
      contextCount: contextNormalizedTexts.length,
      targetId: targetTranscription.id
    });

    try {
      const startTime = Date.now();

      // Готовим подсказку: строгая инструкция вернуть только нормализованный текст текущего сообщения
      const systemPrompt = `${this.prompt}\n\nКонтекстные правила:\n- Используй список ранее нормализованных сообщений только как контекст для стиля, терминов и согласованности.\n- Нормализуй ТОЛЬКО текущее новое сообщение.\n- В ответе верни ТОЛЬКО нормализованный текст без каких-либо префиксов, нумерации и комментариев.`;

      const contextBlock = contextNormalizedTexts.length > 0
        ? `Предыдущие нормализованные сообщения (контекст, не нужно переписывать):\n${contextNormalizedTexts.map((t, i) => `${i + 1}) ${t}`).join("\n")}\n\n`
        : "";

      const userContent = `${contextBlock}Новое сообщение для нормализации:\n${targetTranscription.transcript}`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userContent }
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
      const normalizedText = (data.choices?.[0]?.message?.content || "").trim();
      const tokensUsed = data.usage?.total_tokens || 0;
      const duration = Date.now() - startTime;

      const result = {
        id: batchId,
        timestamp: new Date().toISOString(),
        original: {
          id: targetTranscription.id,
          transcript: targetTranscription.transcript,
          timestamp: targetTranscription.timestamp
        },
        contextNormalizedTexts,
        normalizedText,
        model: this.model,
        tokensUsed,
        duration,
        success: true
      };

      // Сохраняем результат
      this.normalizedResults.unshift(result);
      if (this.normalizedResults.length > 100) {
        this.normalizedResults = this.normalizedResults.slice(0, 100);
      }

      // Удаляем обработанную транскрипцию из буфера
      this.transcriptions = this.transcriptions.filter(t => t.id !== targetTranscription.id);

      // Обновляем статистику
      this.stats.normalizationsCompleted++;
      this.stats.totalTokensUsed += tokensUsed;

      await this.saveResult(result);

      this.addLog("normalization_success", "Single-message normalization completed", {
        batchId,
        tokensUsed,
        duration
      });

      this.emit("normalization_completed", result);

      console.log(`Normalization completed: ${batchId} (${tokensUsed} tokens, ${duration}ms)`);

      return result;
    } catch (error) {
      const errorResult = {
        id: batchId,
        timestamp: new Date().toISOString(),
        original: {
          id: this.transcriptions[0]?.id,
          transcript: this.transcriptions[0]?.transcript,
          timestamp: this.transcriptions[0]?.timestamp
        },
        contextNormalizedTexts: contextNormalizedTexts || [],
        error: error.message,
        success: false
      };

      this.normalizedResults.unshift(errorResult);
      this.stats.normalizationsFailed++;

      await this.saveResult(errorResult);

      this.addLog("normalization_error", "Single-message normalization failed", {
        batchId,
        error: error.message
      });

      this.emit("normalization_failed", errorResult);

      console.error(`Normalization failed: ${batchId}`, error);
      throw error;
    }
  }

  /**
   * Сохранить результат нормализации в файл
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
          this.normalizedResults.push(result);
        } catch (error) {
          console.error(`Failed to load file ${file}:`, error);
        }
      }

      // Сортируем по timestamp
      this.normalizedResults.sort((a, b) =>
        new Date(b.timestamp) - new Date(a.timestamp)
      );

      this.addLog("info", "Data loaded", {
        resultsCount: this.normalizedResults.length
      });

    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error("Failed to load data:", error);
      }
    }
  }

  /**
   * Получить все результаты нормализации
   */
  getResults(limit = 50) {
    return this.normalizedResults.slice(0, limit);
  }

  /**
   * Получить конкретный результат по ID
   */
  getResult(id) {
    return this.normalizedResults.find(r => r.id === id);
  }

  /**
   * Получить последние транскрипции
   */
  getTranscriptions() {
    return this.transcriptions;
  }

  /**
   * Получить статистику
   */
  getStats() {
    return {
      ...this.stats,
      isRunning: this.isRunning,
      autoNormalize: this.autoNormalize,
      transcriptionsInBuffer: this.transcriptions.length,
      resultsCount: this.normalizedResults.length
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
    this.normalizedResults = [];

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

    if (settings.autoNormalize !== undefined) {
      const wasAutoNormalize = this.autoNormalize;
      this.autoNormalize = settings.autoNormalize;

      if (this.autoNormalize && !wasAutoNormalize) {
        this.startAutoNormalize();
      } else if (!this.autoNormalize && wasAutoNormalize) {
        this.stopAutoNormalize();
      }

      this.addLog("settings", "Auto-normalize updated", {
        autoNormalize: this.autoNormalize
      });
    }

    if (settings.normalizeInterval !== undefined) {
      this.normalizeInterval = settings.normalizeInterval;
      if (this.autoNormalize) {
        this.stopAutoNormalize();
        this.startAutoNormalize();
      }
      this.addLog("settings", "Normalize interval updated", {
        interval: this.normalizeInterval
      });
    }

    if (settings.batchSize !== undefined) {
      this.batchSize = settings.batchSize;
      this.addLog("settings", "Batch size updated", {
        batchSize: this.batchSize
      });
    }

    this.emit("settings_updated", settings);
  }
}

export default TranscriptionNormalizer;
