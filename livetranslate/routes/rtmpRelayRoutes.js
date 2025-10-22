import express from "express";

export function registerRtmpRelayRoutes(ctx) {
  const { app, rtmpRelays, projects, OPENAI_API_KEY, RTMPRealtimeRelay, broadcastToTranscriptionClients } = ctx;

  // Создать новый RTMP→Realtime ретранслятор
  app.post("/api/rtmp-relay", express.json(), async (req, res) => {
    try {
      const { rtmpUrl, projectId, model, voice, instructions } = req.body;

      if (!rtmpUrl) {
        res.status(400).json({ error: "RTMP URL is required" });
        return;
      }

      if (!projectId || !projects.has(projectId)) {
        res.status(400).json({ error: "Valid project ID is required" });
        return;
      }

      if (!OPENAI_API_KEY) {
        res.status(500).json({ error: "OpenAI API key is not configured" });
        return;
      }

      const relayId = "relay-" + Date.now();
      
      const relay = new RTMPRealtimeRelay({
        apiKey: OPENAI_API_KEY,
        rtmpUrl,
        model: model || "gpt-realtime",
        voice: voice || "verse",
        instructions: instructions || "Ты синхронный переводчик с казахского на русский язык. Слушай казахскую речь и сразу озвучивай её дословный перевод на русском языке. Говори четко и естественно."
      });

      // Настройка обработчиков событий
      relay.on("started", () => {
        console.log(`RTMP relay ${relayId} started`);
        rtmpRelays.get(relayId).status = "running";
      });

      relay.on("stopped", () => {
        console.log(`RTMP relay ${relayId} stopped`);
        rtmpRelays.get(relayId).status = "stopped";
      });

      relay.on("error", (error) => {
        console.error(`RTMP relay ${relayId} error:`, error);
        rtmpRelays.get(relayId).status = "error";
        rtmpRelays.get(relayId).lastError = error.message;
      });

      // Убираем обработку audio_output - в режиме только транскрипции аудио ответы не генерируются

      relay.on("transcription_completed", (transcription) => {
        // Отправляем результат транскрипции всем WebSocket клиентам, слушающим этот ретранслятор
        console.log(`Broadcasting transcription for ${relayId}:`, transcription.transcript);
        broadcastToTranscriptionClients(relayId, {
          type: "transcription",
          data: transcription
        });
      });

      relay.on("log", (logEntry) => {
        // Отправляем лог всем WebSocket клиентам, слушающим этот ретранслятор
        broadcastToTranscriptionClients(relayId, {
          type: "log",
          data: logEntry
        });
      });

      relay.on("audio_chunk", (audioData) => {
        // Отправляем аудио чанк всем WebSocket клиентам для preview входящего аудио
        broadcastToTranscriptionClients(relayId, {
          type: "audio_chunk",
          data: audioData
        });
      });

      relay.on("audio_output", (audioData) => {
        // Отправляем аудио ответ от GPT всем WebSocket клиентам для preview GPT аудио
        broadcastToTranscriptionClients(relayId, {
          type: "audio_output",
          data: audioData
        });
      });

      relay.on("gpt_transcript", (transcriptData) => {
        // Отправляем транскрипт GPT ответа всем WebSocket клиентам
        broadcastToTranscriptionClients(relayId, {
          type: "gpt_transcript",
          data: transcriptData
        });
      });

      // Сохраняем ретранслятор
      rtmpRelays.set(relayId, {
        relay,
        projectId,
        createdAt: new Date().toISOString(),
        status: "created",
        rtmpUrl,
        model: model || "gpt-realtime",
        voice: voice || "verse"
      });

      // Запускаем ретранслятор
      await relay.start();

      res.json({
        id: relayId,
        projectId,
        rtmpUrl,
        model: model || "gpt-realtime",
        voice: voice || "verse",
        status: "running",
        createdAt: rtmpRelays.get(relayId).createdAt
      });

    } catch (error) {
      console.error("Error creating RTMP relay:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Получить список всех RTMP ретрансляторов
  app.get("/api/rtmp-relay", (_req, res) => {
    const relays = Array.from(rtmpRelays.entries()).map(([id, data]) => ({
      id,
      projectId: data.projectId,
      rtmpUrl: data.rtmpUrl,
      model: data.model,
      voice: data.voice,
      status: data.status,
      createdAt: data.createdAt,
      lastError: data.lastError || null
    }));
    
    res.json(relays);
  });

  // Получить статус конкретного ретранслятора
  app.get("/api/rtmp-relay/:id", (req, res) => {
    const { id } = req.params;
    const relayData = rtmpRelays.get(id);

    if (!relayData) {
      res.status(404).json({ error: "Relay not found" });
      return;
    }

    const status = relayData.relay.getStatus();
    
    res.json({
      id,
      projectId: relayData.projectId,
      rtmpUrl: relayData.rtmpUrl,
      model: relayData.model,
      voice: relayData.voice,
      status: relayData.status,
      createdAt: relayData.createdAt,
      lastError: relayData.lastError || null,
      details: status
    });
  });

  // Остановить RTMP ретранслятор
  app.delete("/api/rtmp-relay/:id", (req, res) => {
    const { id } = req.params;
    const relayData = rtmpRelays.get(id);

    if (!relayData) {
      res.status(404).json({ error: "Relay not found" });
      return;
    }

    try {
      relayData.relay.stop();
      rtmpRelays.delete(id);
      
      res.json({ success: true, message: "Relay stopped and removed" });
    } catch (error) {
      console.error("Error stopping relay:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Перезапустить RTMP ретранслятор
  app.post("/api/rtmp-relay/:id/restart", async (req, res) => {
    const { id } = req.params;
    const relayData = rtmpRelays.get(id);

    if (!relayData) {
      res.status(404).json({ error: "Relay not found" });
      return;
    }

    try {
      relayData.relay.stop();
      await relayData.relay.start();
      
      res.json({ success: true, message: "Relay restarted" });
    } catch (error) {
      console.error("Error restarting relay:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Получить результаты транскрипции ретранслятора
  app.get("/api/rtmp-relay/:id/transcription", (req, res) => {
    const { id } = req.params;
    const { limit = 50 } = req.query;
    const relayData = rtmpRelays.get(id);

    if (!relayData) {
      res.status(404).json({ error: "Relay not found" });
      return;
    }

    try {
      const results = relayData.relay.getTranscriptionResults(parseInt(limit));
      res.json({
        relayId: id,
        count: results.length,
        results: results
      });
    } catch (error) {
      console.error("Error getting transcription results:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Получить логи ретранслятора
  app.get("/api/rtmp-relay/:id/logs", (req, res) => {
    const { id } = req.params;
    const { limit = 100, type } = req.query;
    const relayData = rtmpRelays.get(id);

    if (!relayData) {
      res.status(404).json({ error: "Relay not found" });
      return;
    }

    try {
      let logs;
      if (type) {
        logs = relayData.relay.getLogsByType(type, parseInt(limit));
      } else {
        logs = relayData.relay.getLogs(parseInt(limit));
      }
      
      res.json({
        relayId: id,
        count: logs.length,
        type: type || "all",
        logs: logs
      });
    } catch (error) {
      console.error("Error getting logs:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Очистить результаты транскрипции ретранслятора
  app.delete("/api/rtmp-relay/:id/transcription", (req, res) => {
    const { id } = req.params;
    const relayData = rtmpRelays.get(id);

    if (!relayData) {
      res.status(404).json({ error: "Relay not found" });
      return;
    }

    try {
      relayData.relay.clearTranscriptionResults();
      res.json({ success: true, message: "Transcription results cleared" });
    } catch (error) {
      console.error("Error clearing transcription results:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Очистить логи ретранслятора
  app.delete("/api/rtmp-relay/:id/logs", (req, res) => {
    const { id } = req.params;
    const relayData = rtmpRelays.get(id);

    if (!relayData) {
      res.status(404).json({ error: "Relay not found" });
      return;
    }

    try {
      relayData.relay.clearLogs();
      res.json({ success: true, message: "Logs cleared" });
    } catch (error) {
      console.error("Error clearing logs:", error);
      res.status(500).json({ error: error.message });
    }
  });
}


