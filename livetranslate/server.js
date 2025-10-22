import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { promises as fs } from "fs";
import { WebSocketServer } from "ws";
import { createServer } from "http";
import RTMPRealtimeRelay from "./rtmp-realtime-relay.js";
import TranscriptionNormalizer from "./transcription-normalizer.js";
import TranscriptionTranslator from "./transcription-translator.js";
import TranslationSpeaker from "./translation-speaker.js";
import ReplicateWhisperXRelay from "./replicate-whisperx-relay.js";
import UnifiedRelay from "./unified-relay.js";
import ReplicateTranslation from "./replicate-translation.js";
import SeamlessSpeechTranslation from "./seamless-speech-translation.js";
import { registerMediaMtxRoutes } from "./routes/mediamtxRoutes.js";
import { registerRtmpRelayRoutes } from "./routes/rtmpRelayRoutes.js";
import { registerSessionRoutes } from "./routes/sessionRoutes.js";
import { registerProjectRoutes } from "./routes/projectRoutes.js";
import { registerNormalizerRoutes } from "./routes/normalizerRoutes.js";
import { registerTranslatorRoutes } from "./routes/translatorRoutes.js";
import { registerSpeakerRoutes } from "./routes/speakerRoutes.js";
import { registerWhisperxRoutes } from "./routes/whisperxRoutes.js";
import { registerReplicateTranslationRoutes } from "./routes/replicateTranslationRoutes.js";
import { registerSeamlessSpeechRoutes } from "./routes/seamlessSpeechRoutes.js";
import { registerUnifiedRelayRoutes } from "./routes/unifiedRelayRoutes.js";
import { registerWorkflowRoutes } from "./routes/workflowRoutes.js";
import { registerWebSocketHandlers } from "./routes/websocketHandlers.js";

dotenv.config();

const app = express();
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
const server = createServer(app);
const wss = new WebSocketServer({ server });

const port = process.env.PORT ?? 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const MAX_LISTENERS_PER_PROJECT = parseInt(process.env.MAX_LISTENERS_PER_PROJECT ?? "100");

if (!OPENAI_API_KEY) {
  console.warn("OPENAI_API_KEY is not set. Remember to configure your .env file.");
}

if (!REPLICATE_API_TOKEN) {
  console.warn("REPLICATE_API_TOKEN is not set. WhisperX service will not be available.");
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "public");
const sessionFile = path.join(__dirname, "session.json");

app.use(express.static(publicDir));
registerSessionRoutes({ app, OPENAI_API_KEY, fetch, fs, sessionFile });

// Хранилище проектов и их трансляций
const projects = new Map(); // projectId -> { name, createdAt, broadcaster, listeners: Map }
const projectsFile = path.join(__dirname, "projects.json");

// Хранилище RTMP→Realtime ретрансляторов
const rtmpRelays = new Map(); // relayId -> { relay, projectId, createdAt, status }

// Хранилище нормализаторов транскрипций
const normalizers = new Map(); // normalizerId -> { normalizer, relayId, createdAt, status }

// Хранилище переводчиков транскрипций
const translators = new Map(); // translatorId -> { translator, normalizerId, createdAt, status }

// Хранилище озвучивателей переводов
const speakers = new Map(); // speakerId -> { speaker, translatorId, createdAt, status }

// Хранилище Replicate WhisperX ретрансляторов
const whisperxRelays = new Map(); // whisperxId -> { relay, projectId, createdAt, status }

// Хранилище унифицированных релеев (unified-relay)
const unifiedRelays = new Map(); // unifiedId -> { relay, projectId, createdAt, status, type }

// Хранилище Replicate Translation сервисов
const replicateTranslators = new Map(); // replicateTranslatorId -> { translator, whisperxId, createdAt, status }

// Хранилище SeamlessSpeech сервисов
const seamlessSpeechServices = new Map(); // seamlessSpeechId -> { service, whisperxId, createdAt, status }

// Хранилище WebSocket клиентов для просмотра транскрипции
const transcriptionClients = new Map(); // relayId -> Set of WebSocket clients

// Хранилище WebSocket клиентов для WhisperX транскрипции
const whisperxClients = new Map(); // whisperxId -> Set of WebSocket clients

// Хранилище WebSocket клиентов для unified relay
const unifiedClients = new Map(); // unifiedId -> Set of WebSocket clients

// Хранилище WebSocket клиентов для просмотра нормализации
const normalizerClients = new Map(); // normalizerId -> Set of WebSocket clients

// Хранилище WebSocket клиентов для просмотра перевода
const translatorClients = new Map(); // translatorId -> Set of WebSocket clients

// Хранилище WebSocket клиентов для просмотра озвучивания
const speakerClients = new Map(); // speakerId -> Set of WebSocket clients

// Хранилище WebSocket клиентов для просмотра Replicate Translation
const replicateTranslatorClients = new Map(); // replicateTranslatorId -> Set of WebSocket clients

// Хранилище WebSocket клиентов для просмотра SeamlessSpeech
const seamlessSpeechClients = new Map(); // seamlessSpeechId -> Set of WebSocket clients

// Функция для трансляции сообщений клиентам транскрипции
function broadcastToTranscriptionClients(relayId, message) {
  const clients = transcriptionClients.get(relayId);
  if (clients) {
    clients.forEach(client => {
      if (client.readyState === 1) { // WebSocket.OPEN
        try {
          client.send(JSON.stringify(message));
        } catch (error) {
          console.error(`Error sending to transcription client:`, error);
        }
      }
    });
  }
}

// Функция для трансляции сообщений клиентам unified relay
function broadcastToUnifiedClients(unifiedId, message) {
  const clients = unifiedClients.get(unifiedId);
  if (clients) {
    clients.forEach(client => {
      if (client.readyState === 1) { // WebSocket.OPEN
        try {
          client.send(JSON.stringify(message));
        } catch (error) {
          console.error(`Error sending to unified client:`, error);
        }
      }
    });
  }
}

// Загрузка проектов из файла
async function loadProjects() {
  try {
    const data = await fs.readFile(projectsFile, "utf-8");
    const projectsArray = JSON.parse(data);
    projectsArray.forEach(p => {
      projects.set(p.id, {
        id: p.id,
        name: p.name,
        createdAt: p.createdAt,
        broadcaster: null,
        listeners: new Map()
      });
    });
    console.log(`Загружено ${projects.size} проектов`);
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log("Файл проектов не найден, создаём первый проект");
      // Создаём первый проект по умолчанию
      const defaultProject = {
        id: "project-" + Date.now(),
        name: "Моя первая трансляция",
        createdAt: new Date().toISOString()
      };
      projects.set(defaultProject.id, {
        ...defaultProject,
        broadcaster: null,
        listeners: new Map()
      });
      await saveProjects();
    } else {
      console.error("Ошибка загрузки проектов:", error);
    }
  }
}

// Сохранение проектов в файл
async function saveProjects() {
  const projectsArray = Array.from(projects.values()).map(p => ({
    id: p.id,
    name: p.name,
    createdAt: p.createdAt
  }));
  try {
    await fs.writeFile(projectsFile, JSON.stringify(projectsArray, null, 2));
  } catch (error) {
    console.error("Ошибка сохранения проектов:", error);
  }
}

registerProjectRoutes({ app, projects, saveProjects });

// Хранилище логов событий MediaMTX
const mediamtxLogs = [];
const maxLogs = 100;

// Регистрация вынесенных роутов
registerMediaMtxRoutes({ app, projects, mediamtxLogs, maxLogs });

// Регистрация вынесенных роутов
registerRtmpRelayRoutes({ app, rtmpRelays, projects, OPENAI_API_KEY, RTMPRealtimeRelay, broadcastToTranscriptionClients });
registerNormalizerRoutes({ app, normalizers, rtmpRelays, OPENAI_API_KEY, TranscriptionNormalizer, broadcastToNormalizerClients });
registerTranslatorRoutes({ app, translators, normalizers, OPENAI_API_KEY, TranscriptionTranslator, broadcastToTranslatorClients });
registerSpeakerRoutes({ app, speakers, translators, OPENAI_API_KEY, TranslationSpeaker, broadcastToSpeakerClients });
registerWhisperxRoutes({ app, whisperxRelays, REPLICATE_API_TOKEN, ReplicateWhisperXRelay, broadcastToWhisperXClients });
registerReplicateTranslationRoutes({ app, replicateTranslators, whisperxRelays, REPLICATE_API_TOKEN, ReplicateTranslation, broadcastToReplicateTranslatorClients });
registerSeamlessSpeechRoutes({ app, seamlessSpeechServices, whisperxRelays, REPLICATE_API_TOKEN, SeamlessSpeechTranslation, broadcastToSeamlessSpeechClients });
registerUnifiedRelayRoutes({ app, unifiedRelays, OPENAI_API_KEY, REPLICATE_API_TOKEN, UnifiedRelay, broadcastToUnifiedClients });
registerWorkflowRoutes({ app, OPENAI_API_KEY, RTMPRealtimeRelay, TranscriptionNormalizer, TranscriptionTranslator, TranslationSpeaker, rtmpRelays, normalizers, translators, speakers, broadcastToTranscriptionClients, broadcastToNormalizerClients, broadcastToTranslatorClients, broadcastToSpeakerClients });
registerWebSocketHandlers({ wss, projects, MAX_LISTENERS_PER_PROJECT, rtmpRelays, normalizers, translators, speakers, whisperxRelays, unifiedRelays, seamlessSpeechServices, transcriptionClients, normalizerClients, translatorClients, speakerClients, whisperxClients, unifiedClients, seamlessSpeechClients });

// ============================================
// Transcription Normalizer API endpoints
// ============================================

// Функция для трансляции сообщений клиентам нормализатора
function broadcastToNormalizerClients(normalizerId, message) {
  const clients = normalizerClients.get(normalizerId);
  if (clients) {
    clients.forEach(client => {
      if (client.readyState === 1) { // WebSocket.OPEN
        try {
          client.send(JSON.stringify(message));
        } catch (error) {
          console.error(`Error sending to normalizer client:`, error);
        }
      }
    });
  }
}

// ============================================
// Transcription Translator API endpoints
// ============================================

// Функция для трансляции сообщений клиентам переводчика
function broadcastToTranslatorClients(translatorId, message) {
  const clients = translatorClients.get(translatorId);
  if (clients) {
    clients.forEach(client => {
      if (client.readyState === 1) { // WebSocket.OPEN
        try {
          client.send(JSON.stringify(message));
        } catch (error) {
          console.error(`Error sending to translator client:`, error);
        }
      }
    });
  }
}

// Роуты переводчика вынесены в routes/translatorRoutes.js

// ============================================
// Translation Speaker API endpoints (TTS)
// ============================================

// Функция для трансляции сообщений клиентам озвучивателя
function broadcastToSpeakerClients(speakerId, message) {
  const clients = speakerClients.get(speakerId);
  if (clients) {
    clients.forEach(client => {
      if (client.readyState === 1) { // WebSocket.OPEN
        try {
          client.send(JSON.stringify(message));
        } catch (error) {
          console.error(`Error sending to speaker client:`, error);
        }
      }
    });
  }
}

// ============================================
// Replicate WhisperX API endpoints
// ============================================

// Функция для трансляции сообщений клиентам WhisperX
function broadcastToWhisperXClients(whisperxId, message) {
  const clients = whisperxClients.get(whisperxId);
  if (clients) {
    clients.forEach(client => {
      if (client.readyState === 1) { // WebSocket.OPEN
        try {
          client.send(JSON.stringify(message));
        } catch (error) {
          console.error(`Error sending to WhisperX client:`, error);
        }
      }
    });
  }
}

// Функция для трансляции сообщений клиентам Replicate Translation
function broadcastToReplicateTranslatorClients(translatorId, message) {
  const clients = replicateTranslatorClients.get(translatorId);
  if (clients) {
    clients.forEach(client => {
      if (client.readyState === 1) { // WebSocket.OPEN
        try {
          client.send(JSON.stringify(message));
        } catch (error) {
          console.error(`Error sending to Replicate Translator client:`, error);
        }
      }
    });
  }
}

// Функция для трансляции сообщений клиентам SeamlessSpeech
function broadcastToSeamlessSpeechClients(serviceId, message) {
  const clients = seamlessSpeechClients.get(serviceId);
  if (clients) {
    clients.forEach(client => {
      if (client.readyState === 1) { // WebSocket.OPEN
        try {
          client.send(JSON.stringify(message));
        } catch (error) {
          console.error(`Error sending to SeamlessSpeech client:`, error);
        }
      }
    });
  }
}

// Workflow HTTP routes are registered via routes/workflowRoutes.js

// WebSocket handlers are registered via routes/websocketHandlers.js

// Загружаем проекты и запускаем сервер
loadProjects().then(() => {
  server.listen(port, () => {
    console.log(`Realtime demo server running on http://localhost:${port}`);
  });
});

