import express from "express";

export function registerUnifiedRelayRoutes(ctx) {
  const { app, unifiedRelays, OPENAI_API_KEY, REPLICATE_API_TOKEN, UnifiedRelay, broadcastToUnifiedClients } = ctx;

  app.post("/api/unified-relay", express.json(), async (req, res) => {
    try {
      const { type, rtmpUrl, projectId, model, voice, instructions, language, chunkDuration, batchSize, whisperModel } = req.body;
      if (!type) { res.status(400).json({ error: "Relay type is required (openai-realtime or whisperx)" }); return; }
      if (!rtmpUrl) { res.status(400).json({ error: "RTMP URL is required" }); return; }
      if (type === "openai-realtime" && !OPENAI_API_KEY) { res.status(500).json({ error: "OpenAI API key is not configured" }); return; }
      if (type === "whisperx" && !REPLICATE_API_TOKEN) { res.status(500).json({ error: "Replicate API token is not configured" }); return; }

      const unifiedId = "unified-" + Date.now();
      const config = { type, rtmpUrl };
      if (type === "openai-realtime") {
        config.openaiApiKey = OPENAI_API_KEY;
        config.model = model || "gpt-realtime";
        config.voice = voice || "verse";
        config.instructions = instructions || "Ты синхронный переводчик с казахского на русский язык. Слушай казахскую речь и сразу озвучивай её дословный перевод на русском языке. Говори четко и естественно.";
      } else if (type === "whisperx") {
        config.replicateApiToken = REPLICATE_API_TOKEN;
        config.language = language || "kk";
        config.chunkDuration = chunkDuration || 10;
        config.batchSize = batchSize || 8;
        config.whisperModel = whisperModel || "whisperx";
      }

      const relay = new UnifiedRelay(config);

      relay.on("started", () => {
        console.log(`Unified relay ${unifiedId} (${type}) started`);
        const relayData = unifiedRelays.get(unifiedId);
        if (relayData) relayData.status = "running";
      });
      relay.on("stopped", () => {
        console.log(`Unified relay ${unifiedId} (${type}) stopped`);
        const relayData = unifiedRelays.get(unifiedId);
        if (relayData) relayData.status = "stopped";
      });
      relay.on("error", (error) => {
        console.error(`Unified relay ${unifiedId} (${type}) error:`, error);
        const relayData = unifiedRelays.get(unifiedId);
        if (relayData) {
          relayData.status = "error";
          relayData.lastError = error.error || error.message || String(error);
        }
      });
      relay.on("transcription", (data) => {
        console.log(`Broadcasting transcription for unified relay ${unifiedId}:`, data.text);
        broadcastToUnifiedClients(unifiedId, { type: "transcription", data });
      });
      relay.on("log", (logEntry) => {
        broadcastToUnifiedClients(unifiedId, { type: "log", data: logEntry });
      });
      if (type === "openai-realtime") {
        relay.on("audio_chunk", (audioData) => {
          broadcastToUnifiedClients(unifiedId, { type: "audio_chunk", data: audioData });
        });
        relay.on("audio_output", (audioData) => {
          broadcastToUnifiedClients(unifiedId, { type: "audio_output", data: audioData });
        });
      }
      if (type === "whisperx") {
        relay.on("word", (wordData) => {
          broadcastToUnifiedClients(unifiedId, { type: "word", data: wordData });
        });
        relay.on("char", (charData) => {
          broadcastToUnifiedClients(unifiedId, { type: "char", data: charData });
        });
      }

      unifiedRelays.set(unifiedId, { relay, projectId: projectId || null, createdAt: new Date().toISOString(), status: "created", type, config: relay.getConfig() });
      await relay.start();
      res.json({ id: unifiedId, projectId: projectId || null, type, rtmpUrl, status: "running", capabilities: relay.getCapabilities(), createdAt: unifiedRelays.get(unifiedId).createdAt });
    } catch (error) {
      console.error("Error creating unified relay:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/unified-relay", (_req, res) => {
    const relays = Array.from(unifiedRelays.entries()).map(([id, data]) => ({
      id,
      projectId: data.projectId,
      type: data.type,
      status: data.status,
      capabilities: data.relay.getCapabilities(),
      createdAt: data.createdAt,
      lastError: data.lastError || null
    }));
    res.json(relays);
  });

  app.get("/api/unified-relay/:id", (req, res) => {
    const { id } = req.params;
    const relayData = unifiedRelays.get(id);
    if (!relayData) { res.status(404).json({ error: "Unified relay not found" }); return; }
    const status = relayData.relay.getStatus();
    res.json({ id, projectId: relayData.projectId, type: relayData.type, status: relayData.status, capabilities: relayData.relay.getCapabilities(), config: relayData.config, createdAt: relayData.createdAt, lastError: relayData.lastError || null, details: status });
  });

  app.delete("/api/unified-relay/:id", async (req, res) => {
    const { id } = req.params;
    const relayData = unifiedRelays.get(id);
    if (!relayData) { res.status(404).json({ error: "Unified relay not found" }); return; }
    try {
      await relayData.relay.stop();
      unifiedRelays.delete(id);
      res.json({ success: true, message: "Unified relay stopped and removed" });
    } catch (error) {
      console.error("Error stopping unified relay:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/unified-relay/:id/restart", async (req, res) => {
    const { id } = req.params;
    const relayData = unifiedRelays.get(id);
    if (!relayData) { res.status(404).json({ error: "Unified relay not found" }); return; }
    try {
      await relayData.relay.stop();
      await relayData.relay.start();
      res.json({ success: true, message: "Unified relay restarted" });
    } catch (error) {
      console.error("Error restarting unified relay:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/unified-relay/:id/transcription", (req, res) => {
    const { id } = req.params;
    const { limit = 50 } = req.query;
    const relayData = unifiedRelays.get(id);
    if (!relayData) { res.status(404).json({ error: "Unified relay not found" }); return; }
    try {
      const results = relayData.relay.getTranscriptionResults(parseInt(limit));
      res.json({ unifiedId: id, type: relayData.type, count: results.length, results });
    } catch (error) {
      console.error("Error getting transcription results:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/unified-relay/:id/logs", (req, res) => {
    const { id } = req.params;
    const { limit = 100, type } = req.query;
    const relayData = unifiedRelays.get(id);
    if (!relayData) { res.status(404).json({ error: "Unified relay not found" }); return; }
    try {
      let logs;
      if (type) logs = relayData.relay.getLogsByType(type, parseInt(limit));
      else logs = relayData.relay.getLogs(parseInt(limit));
      res.json({ unifiedId: id, relayType: relayData.type, count: logs.length, filterType: type || "all", logs });
    } catch (error) {
      console.error("Error getting logs:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/unified-relay/:id/transcription", (req, res) => {
    const { id } = req.params;
    const relayData = unifiedRelays.get(id);
    if (!relayData) { res.status(404).json({ error: "Unified relay not found" }); return; }
    try {
      relayData.relay.clearTranscriptionResults();
      res.json({ success: true, message: "Transcription results cleared" });
    } catch (error) {
      console.error("Error clearing transcription results:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/unified-relay/:id/logs", (req, res) => {
    const { id } = req.params;
    const relayData = unifiedRelays.get(id);
    if (!relayData) { res.status(404).json({ error: "Unified relay not found" }); return; }
    try {
      relayData.relay.clearLogs();
      res.json({ success: true, message: "Logs cleared" });
    } catch (error) {
      console.error("Error clearing logs:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/unified-relay/:id/capabilities", (req, res) => {
    const { id } = req.params;
    const relayData = unifiedRelays.get(id);
    if (!relayData) { res.status(404).json({ error: "Unified relay not found" }); return; }
    try {
      const capabilities = relayData.relay.getCapabilities();
      res.json({ unifiedId: id, capabilities });
    } catch (error) {
      console.error("Error getting capabilities:", error);
      res.status(500).json({ error: error.message });
    }
  });
}


