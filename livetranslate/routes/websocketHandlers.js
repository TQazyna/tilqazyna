export function registerWebSocketHandlers(ctx) {
  const {
    wss,
    projects,
    MAX_LISTENERS_PER_PROJECT,
    rtmpRelays,
    normalizers,
    translators,
    speakers,
    whisperxRelays,
    unifiedRelays,
    transcriptionClients,
    normalizerClients,
    translatorClients,
    speakerClients,
    whisperxClients,
    unifiedClients
  } = ctx;

  // WebSocket обработчик
  wss.on("connection", (ws, req) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;
    const projectId = url.searchParams.get("project");

    if (pathname === "/broadcast") {
      // Это вещатель (основная страница)
      if (!projectId || !projects.has(projectId)) {
        ws.close(1008, "Invalid project ID");
        return;
      }

      const project = projects.get(projectId);
      console.log(`Broadcaster connected to project: ${project.name}`);
      project.broadcaster = ws;

      ws.on("message", (data) => {
        // Транслируем аудио всем слушателям этого проекта
        project.listeners.forEach((listener, id) => {
          if (listener.readyState === 1) { // WebSocket.OPEN
            try {
              listener.send(data);
            } catch (error) {
              console.error(`Error sending to listener ${id}:`, error);
            }
          }
        });
      });

      ws.on("close", () => {
        console.log(`Broadcaster disconnected from project: ${project.name}`);
        project.broadcaster = null;
      });

    } else if (pathname === "/listen") {
      // Это слушатель
      if (!projectId || !projects.has(projectId)) {
        ws.close(1008, "Invalid project ID");
        return;
      }

      const project = projects.get(projectId);

      // Проверка лимита слушателей
      if (project.listeners.size >= MAX_LISTENERS_PER_PROJECT) {
        console.log(`Project ${project.name} has reached max listeners limit (${MAX_LISTENERS_PER_PROJECT})`);
        ws.close(1008, `Maximum listeners limit reached (${MAX_LISTENERS_PER_PROJECT})`);
        return;
      }

      const listenerId = Date.now() + Math.random();
      const language = url.searchParams.get("lang") || "ru";

      console.log(`Listener connected to project: ${project.name} (ID: ${listenerId}, Language: ${language}) [${project.listeners.size + 1}/${MAX_LISTENERS_PER_PROJECT}]`);
      project.listeners.set(listenerId, ws);

      ws.on("close", () => {
        console.log(`Listener disconnected (ID: ${listenerId})`);
        project.listeners.delete(listenerId);
      });

      ws.on("error", (error) => {
        console.error(`Listener error (ID: ${listenerId}):`, error);
        project.listeners.delete(listenerId);
      });

    } else if (pathname === "/transcription") {
      // Это клиент для просмотра транскрипции
      const relayId = url.searchParams.get("relay");
      
      if (!relayId || !rtmpRelays.has(relayId)) {
        ws.close(1008, "Invalid relay ID");
        return;
      }

      console.log(`Transcription client connected to relay: ${relayId}`);

      // Добавляем клиента в список
      if (!transcriptionClients.has(relayId)) {
        transcriptionClients.set(relayId, new Set());
      }
      transcriptionClients.get(relayId).add(ws);

      // Отправляем текущие данные
      const relayData = rtmpRelays.get(relayId);
      if (relayData) {
        try {
          const transcriptionResults = relayData.relay.getTranscriptionResults(20);
          const logs = relayData.relay.getLogs(50);
          
          ws.send(JSON.stringify({
            type: "initial_data",
            data: {
              transcription: transcriptionResults,
              logs: logs,
              status: relayData.relay.getStatus()
            }
          }));
        } catch (error) {
          console.error("Error sending initial data:", error);
        }
      }

      ws.on("close", () => {
        console.log(`Transcription client disconnected from relay: ${relayId}`);
        const clients = transcriptionClients.get(relayId);
        if (clients) {
          clients.delete(ws);
          if (clients.size === 0) {
            transcriptionClients.delete(relayId);
          }
        }
      });

      ws.on("error", (error) => {
        console.error(`Transcription client error:`, error);
        const clients = transcriptionClients.get(relayId);
        if (clients) {
          clients.delete(ws);
          if (clients.size === 0) {
            transcriptionClients.delete(relayId);
          }
        }
      });

    } else if (pathname === "/normalizer") {
      // Это клиент для просмотра нормализатора
      const normalizerId = url.searchParams.get("id");

      if (!normalizerId || !normalizers.has(normalizerId)) {
        ws.close(1008, "Invalid normalizer ID");
        return;
      }

      console.log(`Normalizer client connected to: ${normalizerId}`);

      // Добавляем клиента в список
      if (!normalizerClients.has(normalizerId)) {
        normalizerClients.set(normalizerId, new Set());
      }
      normalizerClients.get(normalizerId).add(ws);

      // Отправляем текущие данные
      const normalizerData = normalizers.get(normalizerId);
      if (normalizerData) {
        try {
          const transcriptions = normalizerData.normalizer.getTranscriptions();
          const results = normalizerData.normalizer.getResults(20);
          const logs = normalizerData.normalizer.getLogs(50);
          const stats = normalizerData.normalizer.getStats();

          ws.send(JSON.stringify({
            type: "initial_data",
            data: {
              transcriptions: transcriptions,
              results: results,
              logs: logs,
              stats: stats,
              settings: {
                autoNormalize: normalizerData.normalizer.autoNormalize,
                normalizeInterval: normalizerData.normalizer.normalizeInterval,
                batchSize: normalizerData.normalizer.batchSize
              }
            }
          }));
        } catch (error) {
          console.error("Error sending initial data:", error);
        }
      }

      ws.on("close", () => {
        console.log(`Normalizer client disconnected from: ${normalizerId}`);
        const clients = normalizerClients.get(normalizerId);
        if (clients) {
          clients.delete(ws);
          if (clients.size === 0) {
            normalizerClients.delete(normalizerId);
          }
        }
      });

      ws.on("error", (error) => {
        console.error(`Normalizer client error:`, error);
        const clients = normalizerClients.get(normalizerId);
        if (clients) {
          clients.delete(ws);
          if (clients.size === 0) {
            normalizerClients.delete(normalizerId);
          }
        }
      });

    } else if (pathname === "/translator") {
      // Это клиент для просмотра переводчика
      const translatorId = url.searchParams.get("id");

      if (!translatorId || !translators.has(translatorId)) {
        ws.close(1008, "Invalid translator ID");
        return;
      }

      console.log(`Translator client connected to: ${translatorId}`);

      // Добавляем клиента в список
      if (!translatorClients.has(translatorId)) {
        translatorClients.set(translatorId, new Set());
      }
      translatorClients.get(translatorId).add(ws);

      // Отправляем текущие данные
      const translatorData = translators.get(translatorId);
      if (translatorData) {
        try {
          const results = translatorData.translator.getResults(20);
          const logs = translatorData.translator.getLogs(50);
          const stats = translatorData.translator.getStats();

          ws.send(JSON.stringify({
            type: "initial_data",
            data: {
              results: results,
              logs: logs,
              stats: stats,
              settings: {
                autoTranslate: translatorData.translator.autoTranslate,
                targetLanguage: translatorData.translator.targetLanguage,
                sourceLanguage: translatorData.translator.sourceLanguage
              }
            }
          }));
        } catch (error) {
          console.error("Error sending initial data:", error);
        }
      }

      ws.on("close", () => {
        console.log(`Translator client disconnected from: ${translatorId}`);
        const clients = translatorClients.get(translatorId);
        if (clients) {
          clients.delete(ws);
          if (clients.size === 0) {
            translatorClients.delete(translatorId);
          }
        }
      });

      ws.on("error", (error) => {
        console.error(`Translator client error:`, error);
        const clients = translatorClients.get(translatorId);
        if (clients) {
          clients.delete(ws);
          if (clients.size === 0) {
            translatorClients.delete(translatorId);
          }
        }
      });

    } else if (pathname === "/speaker") {
      // Это клиент для просмотра озвучивателя
      const speakerId = url.searchParams.get("id");

      if (!speakerId || !speakers.has(speakerId)) {
        ws.close(1008, "Invalid speaker ID");
        return;
      }

      console.log(`Speaker client connected to: ${speakerId}`);

      // Добавляем клиента в список
      if (!speakerClients.has(speakerId)) {
        speakerClients.set(speakerId, new Set());
      }
      speakerClients.get(speakerId).add(ws);

      // Отправляем текущие данные
      const speakerData = speakers.get(speakerId);
      if (speakerData) {
        try {
          const results = speakerData.speaker.getResults(20);
          const logs = speakerData.speaker.getLogs(50);
          const stats = speakerData.speaker.getStats();

          ws.send(JSON.stringify({
            type: "initial_data",
            data: {
              results: results,
              logs: logs,
              stats: stats,
              settings: {
                autoSpeak: speakerData.speaker.autoSpeak,
                voice: speakerData.speaker.voice,
                model: speakerData.speaker.model,
                speed: speakerData.speaker.speed
              }
            }
          }));
        } catch (error) {
          console.error("Error sending initial data:", error);
        }
      }

      ws.on("close", () => {
        console.log(`Speaker client disconnected from: ${speakerId}`);
        const clients = speakerClients.get(speakerId);
        if (clients) {
          clients.delete(ws);
          if (clients.size === 0) {
            speakerClients.delete(speakerId);
          }
        }
      });

      ws.on("error", (error) => {
        console.error(`Speaker client error:`, error);
        const clients = speakerClients.get(speakerId);
        if (clients) {
          clients.delete(ws);
          if (clients.size === 0) {
            speakerClients.delete(speakerId);
          }
        }
      });

    } else if (pathname === "/whisperx") {
      // Это клиент для просмотра WhisperX транскрипции
      const whisperxId = url.searchParams.get("id");

      if (!whisperxId || !whisperxRelays.has(whisperxId)) {
        ws.close(1008, "Invalid WhisperX relay ID");
        return;
      }

      console.log(`WhisperX client connected to: ${whisperxId}`);

      // Добавляем клиента в список
      if (!whisperxClients.has(whisperxId)) {
        whisperxClients.set(whisperxId, new Set());
      }
      whisperxClients.get(whisperxId).add(ws);

      // Отправляем текущие данные
      const relayData = whisperxRelays.get(whisperxId);
      if (relayData) {
        try {
          const transcriptionResults = relayData.relay.getTranscriptionResults(20);
          const logs = relayData.relay.getLogs(50);
          const status = relayData.relay.getStatus();

          ws.send(JSON.stringify({
            type: "initial_data",
            data: {
              transcription: transcriptionResults,
              logs: logs,
              status: status
            }
          }));
        } catch (error) {
          console.error("Error sending initial data:", error);
        }
      }

      ws.on("close", () => {
        console.log(`WhisperX client disconnected from: ${whisperxId}`);
        const clients = whisperxClients.get(whisperxId);
        if (clients) {
          clients.delete(ws);
          if (clients.size === 0) {
            whisperxClients.delete(whisperxId);
          }
        }
      });

      ws.on("error", (error) => {
        console.error(`WhisperX client error:`, error);
        const clients = whisperxClients.get(whisperxId);
        if (clients) {
          clients.delete(ws);
          if (clients.size === 0) {
            whisperxClients.delete(whisperxId);
          }
        }
      });

    } else if (pathname === "/unified") {
      // Это клиент для просмотра unified relay транскрипции
      const unifiedId = url.searchParams.get("id");

      if (!unifiedId || !unifiedRelays.has(unifiedId)) {
        ws.close(1008, "Invalid unified relay ID");
        return;
      }

      console.log(`Unified relay client connected to: ${unifiedId}`);

      // Добавляем клиента в список
      if (!unifiedClients.has(unifiedId)) {
        unifiedClients.set(unifiedId, new Set());
      }
      unifiedClients.get(unifiedId).add(ws);

      // Отправляем текущие данные
      const relayData = unifiedRelays.get(unifiedId);
      if (relayData) {
        try {
          const transcriptionResults = relayData.relay.getTranscriptionResults(20);
          const logs = relayData.relay.getLogs(50);
          const status = relayData.relay.getStatus();
          const capabilities = relayData.relay.getCapabilities();

          ws.send(JSON.stringify({
            type: "initial_data",
            data: {
              transcription: transcriptionResults,
              logs: logs,
              status: status,
              capabilities: capabilities,
              relayType: relayData.type
            }
          }));
        } catch (error) {
          console.error("Error sending initial data:", error);
        }
      }

      ws.on("close", () => {
        console.log(`Unified relay client disconnected from: ${unifiedId}`);
        const clients = unifiedClients.get(unifiedId);
        if (clients) {
          clients.delete(ws);
          if (clients.size === 0) {
            unifiedClients.delete(unifiedId);
          }
        }
      });

      ws.on("error", (error) => {
        console.error(`Unified relay client error:`, error);
        const clients = unifiedClients.get(unifiedId);
        if (clients) {
          clients.delete(ws);
          if (clients.size === 0) {
            unifiedClients.delete(unifiedId);
          }
        }
      });
    }
  });
}


