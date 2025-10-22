/**
 * UnifiedRelay - единая обертка для rtmp-realtime-relay и replicate-whisperx-relay
 *
 * Предоставляет унифицированный интерфейс для работы с двумя типами релеев:
 * - OpenAI Realtime (real-time streaming, <100ms latency, bidirectional)
 * - Replicate WhisperX (batch processing, 2-10s latency, high accuracy)
 *
 * Использует паттерн Factory для создания соответствующего релея
 * и унифицирует события от обоих типов релеев.
 */

import { EventEmitter } from "events";
import RTMPRealtimeRelay from "./rtmp-realtime-relay.js";
import ReplicateWhisperXRelay from "./replicate-whisperx-relay.js";

/**
 * Типы релеев
 */
const RelayType = {
  OPENAI_REALTIME: "openai-realtime",
  WHISPERX: "whisperx"
};

/**
 * Унифицированные события
 * Маппинг событий от разных релеев в единый формат
 */
const UnifiedEvents = {
  STARTED: "started",
  STOPPED: "stopped",
  ERROR: "error",
  TRANSCRIPTION: "transcription",           // Унифицированное событие транскрипции
  AUDIO_OUTPUT: "audio_output",             // Только для OpenAI Realtime
  AUDIO_CHUNK: "audio_chunk",               // Только для OpenAI Realtime
  WORD: "word",                             // Только для WhisperX (word-level timing)
  CHAR: "char",                             // Только для WhisperX (character-level)
  LOG: "log",
  STATUS_CHANGE: "status_change"
};

/**
 * UnifiedRelay класс
 *
 * @extends EventEmitter
 */
class UnifiedRelay extends EventEmitter {
  /**
   * @param {Object} config - Конфигурация релея
   * @param {string} config.type - Тип релея: 'openai-realtime' или 'whisperx'
   * @param {string} config.rtmpUrl - URL RTMP потока (обязательно)
   *
   * OpenAI Realtime специфичные параметры:
   * @param {string} [config.openaiApiKey] - OpenAI API ключ
   * @param {string} [config.model] - Модель (default: 'gpt-realtime')
   * @param {string} [config.voice] - Голос TTS (alloy|echo|fable|onyx|shimmer|verse)
   * @param {string} [config.instructions] - Системный промпт
   *
   * WhisperX специфичные параметры:
   * @param {string} [config.replicateApiToken] - Replicate API токен
   * @param {string} [config.language] - Язык ISO 639-1 (default: 'kk')
   * @param {number} [config.chunkDuration] - Длительность чанка в секундах (default: 10)
   * @param {number} [config.batchSize] - Размер батча (default: 8)
   * @param {string} [config.whisperModel] - Whisper модель (whisperx|whisperx-a100|fast-whisper|openai-whisper)
   */
  constructor(config) {
    super();

    // Валидация конфигурации
    if (!config || !config.type) {
      throw new Error("UnifiedRelay: config.type is required (openai-realtime or whisperx)");
    }

    if (!config.rtmpUrl) {
      throw new Error("UnifiedRelay: config.rtmpUrl is required");
    }

    this.config = config;
    this.type = config.type;
    this.relay = null;
    this.isRunning = false;

    // Создаем соответствующий релей
    this._createRelay();
  }

  /**
   * Создает внутренний релей в зависимости от типа
   * @private
   */
  _createRelay() {
    switch (this.type) {
      case RelayType.OPENAI_REALTIME:
        this._createOpenAIRelay();
        break;

      case RelayType.WHISPERX:
        this._createWhisperXRelay();
        break;

      default:
        throw new Error(
          `UnifiedRelay: Unknown relay type '${this.type}'. ` +
          `Use '${RelayType.OPENAI_REALTIME}' or '${RelayType.WHISPERX}'`
        );
    }
  }

  /**
   * Создает OpenAI Realtime релей
   * @private
   */
  _createOpenAIRelay() {
    const openaiConfig = {
      apiKey: this.config.openaiApiKey || process.env.OPENAI_API_KEY,
      rtmpUrl: this.config.rtmpUrl,
      model: this.config.model || "gpt-realtime",
      voice: this.config.voice || "verse",
      instructions: this.config.instructions
    };

    this.relay = new RTMPRealtimeRelay(openaiConfig);

    // Маппинг событий
    this._mapOpenAIEvents();
  }

  /**
   * Создает WhisperX релей
   * @private
   */
  _createWhisperXRelay() {
    const whisperxConfig = {
      apiToken: this.config.replicateApiToken || process.env.REPLICATE_API_TOKEN,
      rtmpUrl: this.config.rtmpUrl,
      language: this.config.language || "kk",
      chunkDuration: this.config.chunkDuration || 10,
      batchSize: this.config.batchSize || 8,
      model: this.config.whisperModel || "whisperx"
    };

    this.relay = new ReplicateWhisperXRelay(whisperxConfig);

    // Маппинг событий
    this._mapWhisperXEvents();
  }

  /**
   * Маппинг событий от OpenAI Realtime релея
   * @private
   */
  _mapOpenAIEvents() {
    // Базовые события
    this.relay.on("started", () => {
      this.isRunning = true;
      this.emit(UnifiedEvents.STARTED, { type: this.type });
      this.emit(UnifiedEvents.STATUS_CHANGE, { status: "running", type: this.type });
    });

    this.relay.on("stopped", () => {
      this.isRunning = false;
      this.emit(UnifiedEvents.STOPPED, { type: this.type });
      this.emit(UnifiedEvents.STATUS_CHANGE, { status: "stopped", type: this.type });
    });

    this.relay.on("error", (error) => {
      this.emit(UnifiedEvents.ERROR, { type: this.type, error });
    });

    // Транскрипция - унифицируем формат
    this.relay.on("transcription_completed", (data) => {
      const unifiedData = {
        type: this.type,
        text: data.transcript || data.text || "",
        timestamp: data.timestamp || Date.now(),
        metadata: {
          source: "openai-realtime",
          itemId: data.itemId,
          confidence: data.confidence
        },
        raw: data
      };
      this.emit(UnifiedEvents.TRANSCRIPTION, unifiedData);
    });

    // GPT транскрипт (ответ от GPT)
    this.relay.on("gpt_transcript", (data) => {
      const unifiedData = {
        type: this.type,
        text: data.transcript || data.text || "",
        timestamp: data.timestamp || Date.now(),
        isGPTResponse: true,
        metadata: {
          source: "openai-realtime-gpt",
          itemId: data.itemId
        },
        raw: data
      };
      this.emit(UnifiedEvents.TRANSCRIPTION, unifiedData);
    });

    // Аудио события (специфичны для OpenAI Realtime)
    this.relay.on("audio_chunk", (data) => {
      this.emit(UnifiedEvents.AUDIO_CHUNK, {
        type: this.type,
        data,
        timestamp: Date.now()
      });
    });

    this.relay.on("audio_output", (data) => {
      this.emit(UnifiedEvents.AUDIO_OUTPUT, {
        type: this.type,
        data,
        timestamp: Date.now()
      });
    });

    // Логи
    this.relay.on("log", (logEntry) => {
      this.emit(UnifiedEvents.LOG, {
        ...logEntry,
        relayType: this.type
      });
    });
  }

  /**
   * Маппинг событий от WhisperX релея
   * @private
   */
  _mapWhisperXEvents() {
    // Базовые события
    this.relay.on("started", () => {
      this.isRunning = true;
      this.emit(UnifiedEvents.STARTED, { type: this.type });
      this.emit(UnifiedEvents.STATUS_CHANGE, { status: "running", type: this.type });
    });

    this.relay.on("stopped", () => {
      this.isRunning = false;
      this.emit(UnifiedEvents.STOPPED, { type: this.type });
      this.emit(UnifiedEvents.STATUS_CHANGE, { status: "stopped", type: this.type });
    });

    this.relay.on("error", (error) => {
      this.emit(UnifiedEvents.ERROR, { type: this.type, error });
    });

    // Транскрипция - унифицируем формат
    this.relay.on("transcription_completed", (data) => {
      const unifiedData = {
        type: this.type,
        text: data.text || "",
        timestamp: data.timestamp || Date.now(),
        metadata: {
          source: "whisperx",
          chunkId: data.chunkId,
          segments: data.segments,
          wordSegments: data.word_segments,
          language: data.language
        },
        raw: data
      };
      this.emit(UnifiedEvents.TRANSCRIPTION, unifiedData);
    });

    // Word-level события (специфичны для WhisperX)
    this.relay.on("word", (wordData) => {
      this.emit(UnifiedEvents.WORD, {
        type: this.type,
        word: wordData.word,
        start: wordData.start,
        end: wordData.end,
        score: wordData.score,
        index: wordData.index,
        chunkId: wordData.chunkId,
        timestamp: Date.now()
      });
    });

    // Character-level события (специфичны для WhisperX)
    this.relay.on("char", (charData) => {
      this.emit(UnifiedEvents.CHAR, {
        type: this.type,
        char: charData.char,
        timestamp: Date.now()
      });
    });

    // Логи
    this.relay.on("log", (logEntry) => {
      this.emit(UnifiedEvents.LOG, {
        ...logEntry,
        relayType: this.type
      });
    });

    // Дополнительные события для отслеживания прогресса
    this.relay.on("transcription_start", (data) => {
      this.emit(UnifiedEvents.LOG, {
        type: "info",
        message: "Transcription started",
        data,
        relayType: this.type,
        timestamp: new Date().toISOString()
      });
    });

    this.relay.on("transcription_failed", (data) => {
      this.emit(UnifiedEvents.ERROR, {
        type: this.type,
        error: data.error || "Transcription failed",
        chunkId: data.chunkId
      });
    });
  }

  /**
   * Запускает релей
   * @returns {Promise<void>}
   */
  async start() {
    if (this.isRunning) {
      throw new Error("UnifiedRelay: Relay is already running");
    }

    await this.relay.start();
  }

  /**
   * Останавливает релей
   * @returns {Promise<void>}
   */
  async stop() {
    if (!this.isRunning) {
      return;
    }

    await this.relay.stop();
  }

  /**
   * Получает статус релея
   * @returns {Object} Статус релея
   */
  getStatus() {
    const baseStatus = this.relay.getStatus();
    return {
      ...baseStatus,
      unifiedType: this.type,
      isUnified: true
    };
  }

  /**
   * Получает результаты транскрипции
   * @param {number} [limit] - Лимит результатов
   * @returns {Array} Массив результатов транскрипции
   */
  getTranscriptionResults(limit) {
    return this.relay.getTranscriptionResults(limit);
  }

  /**
   * Получает логи
   * @param {number} [limit] - Лимит логов
   * @returns {Array} Массив логов
   */
  getLogs(limit) {
    return this.relay.getLogs ? this.relay.getLogs(limit) : [];
  }

  /**
   * Получает логи по типу
   * @param {string} type - Тип лога
   * @param {number} [limit] - Лимит логов
   * @returns {Array} Массив логов
   */
  getLogsByType(type, limit) {
    if (this.relay.getLogsByType) {
      return this.relay.getLogsByType(type, limit);
    }
    return this.getLogs(limit).filter(log => log.type === type);
  }

  /**
   * Очищает результаты транскрипции
   */
  clearTranscriptionResults() {
    if (this.relay.clearTranscriptionResults) {
      this.relay.clearTranscriptionResults();
    } else if (this.relay.transcriptionResults) {
      this.relay.transcriptionResults = [];
    }
  }

  /**
   * Очищает логи
   */
  clearLogs() {
    if (this.relay.clearLogs) {
      this.relay.clearLogs();
    } else if (this.relay.logs) {
      this.relay.logs = [];
    }
  }

  /**
   * Получает тип релея
   * @returns {string} Тип релея
   */
  getType() {
    return this.type;
  }

  /**
   * Получает конфигурацию релея
   * @returns {Object} Конфигурация (без секретных ключей)
   */
  getConfig() {
    const config = { ...this.config };

    // Скрываем секретные ключи
    if (config.openaiApiKey) {
      config.openaiApiKey = "***" + config.openaiApiKey.slice(-4);
    }
    if (config.replicateApiToken) {
      config.replicateApiToken = "***" + config.replicateApiToken.slice(-4);
    }

    return config;
  }

  /**
   * Проверяет, поддерживает ли текущий релей аудио вывод
   * @returns {boolean}
   */
  supportsAudioOutput() {
    return this.type === RelayType.OPENAI_REALTIME;
  }

  /**
   * Проверяет, поддерживает ли текущий релей word-level timing
   * @returns {boolean}
   */
  supportsWordTiming() {
    return this.type === RelayType.WHISPERX;
  }

  /**
   * Получает возможности текущего релея
   * @returns {Object} Объект с возможностями
   */
  getCapabilities() {
    return {
      type: this.type,
      audioOutput: this.supportsAudioOutput(),
      wordTiming: this.supportsWordTiming(),
      realtime: this.type === RelayType.OPENAI_REALTIME,
      bidirectional: this.type === RelayType.OPENAI_REALTIME,
      averageLatency: this.type === RelayType.OPENAI_REALTIME ? "< 100ms" : "2-10s",
      features: this._getFeatures()
    };
  }

  /**
   * Получает список фич текущего релея
   * @private
   * @returns {Array<string>} Массив фич
   */
  _getFeatures() {
    if (this.type === RelayType.OPENAI_REALTIME) {
      return [
        "Real-time streaming",
        "Bidirectional audio",
        "GPT responses",
        "Voice synthesis (TTS)",
        "Server VAD (Voice Activity Detection)",
        "Low latency (< 100ms)"
      ];
    } else {
      return [
        "High accuracy transcription",
        "Word-level timestamps",
        "Multiple language support",
        "Speaker diarization (optional)",
        "Batch processing",
        "Multiple Whisper models"
      ];
    }
  }
}

// Экспортируем класс и константы
export default UnifiedRelay;
export { RelayType, UnifiedEvents };
