import express from "express";

export function registerWhisperxRoutes(ctx) {
  const { app, whisperxRelays, REPLICATE_API_TOKEN, ReplicateWhisperXRelay, broadcastToWhisperXClients } = ctx;

  app.post("/api/whisperx-relay", express.json(), async (req, res) => {
    try {
      const { rtmpUrl, projectId, language, chunkDuration, batchSize, model } = req.body;
      if (!rtmpUrl) {
        res.status(400).json({ error: "RTMP URL is required" });
        return;
      }
      if (!REPLICATE_API_TOKEN) {
        res.status(500).json({ error: "Replicate API token is not configured" });
        return;
      }
      const whisperxId = "whisperx-" + Date.now();
      const relay = new ReplicateWhisperXRelay({
        apiToken: REPLICATE_API_TOKEN,
        rtmpUrl,
        language: language || "kk",
        chunkDuration: chunkDuration || 10,
        batchSize: batchSize || 8,
        model: model || "whisperx"
      });

      relay.on("started", () => {
        console.log(`WhisperX relay ${whisperxId} started`);
        whisperxRelays.get(whisperxId).status = "running";
      });
      relay.on("stopped", () => {
        console.log(`WhisperX relay ${whisperxId} stopped`);
        whisperxRelays.get(whisperxId).status = "stopped";
      });
      relay.on("error", (error) => {
        console.error(`WhisperX relay ${whisperxId} error:`, error);
        whisperxRelays.get(whisperxId).status = "error";
        whisperxRelays.get(whisperxId).lastError = error.message;
      });
      relay.on("transcription_completed", (transcription) => {
        console.log(`WhisperX transcription for ${whisperxId}:`, transcription.fullText);
        broadcastToWhisperXClients(whisperxId, { type: "transcription_completed", data: transcription });
      });
      relay.on("word", (word) => {
        broadcastToWhisperXClients(whisperxId, { type: "word", data: word });
      });
      relay.on("char", (char) => {
        broadcastToWhisperXClients(whisperxId, { type: "char", data: char });
      });
      relay.on("log", (logEntry) => {
        broadcastToWhisperXClients(whisperxId, { type: "log", data: logEntry });
      });
      relay.on("transcription_start", (data) => {
        broadcastToWhisperXClients(whisperxId, { type: "transcription_start", data });
      });
      relay.on("transcription_failed", (error) => {
        broadcastToWhisperXClients(whisperxId, { type: "transcription_failed", data: error });
      });

      whisperxRelays.set(whisperxId, {
        relay,
        projectId: projectId || null,
        createdAt: new Date().toISOString(),
        status: "created",
        rtmpUrl,
        language: language || "kk",
        model: model || "whisperx"
      });

      await relay.start();
      res.json({
        id: whisperxId,
        projectId: projectId || null,
        rtmpUrl,
        language: language || "kk",
        chunkDuration: chunkDuration || 10,
        batchSize: batchSize || 8,
        model: model || "whisperx",
        status: "running",
        createdAt: whisperxRelays.get(whisperxId).createdAt
      });
    } catch (error) {
      console.error("Error creating WhisperX relay:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/whisperx-relay", (_req, res) => {
    const relays = Array.from(whisperxRelays.entries()).map(([id, data]) => ({
      id,
      projectId: data.projectId,
      rtmpUrl: data.rtmpUrl,
      language: data.language,
      status: data.status,
      createdAt: data.createdAt,
      lastError: data.lastError || null
    }));
    res.json(relays);
  });

  app.get("/api/whisperx-relay/:id", (req, res) => {
    const { id } = req.params;
    const relayData = whisperxRelays.get(id);
    if (!relayData) {
      res.status(404).json({ error: "WhisperX relay not found" });
      return;
    }
    const status = relayData.relay.getStatus();
    res.json({
      id,
      projectId: relayData.projectId,
      rtmpUrl: relayData.rtmpUrl,
      language: relayData.language,
      status: relayData.status,
      createdAt: relayData.createdAt,
      lastError: relayData.lastError || null,
      details: status
    });
  });

  app.delete("/api/whisperx-relay/:id", (req, res) => {
    const { id } = req.params;
    const relayData = whisperxRelays.get(id);
    if (!relayData) {
      res.status(404).json({ error: "WhisperX relay not found" });
      return;
    }
    try {
      relayData.relay.stop();
      whisperxRelays.delete(id);
      res.json({ success: true, message: "WhisperX relay stopped and removed" });
    } catch (error) {
      console.error("Error stopping WhisperX relay:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/whisperx-relay/:id/transcription", (req, res) => {
    const { id } = req.params;
    const { limit = 50 } = req.query;
    const relayData = whisperxRelays.get(id);
    if (!relayData) {
      res.status(404).json({ error: "WhisperX relay not found" });
      return;
    }
    try {
      const results = relayData.relay.getTranscriptionResults(parseInt(limit));
      res.json({ whisperxId: id, count: results.length, results });
    } catch (error) {
      console.error("Error getting transcription results:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/whisperx-relay/:id/logs", (req, res) => {
    const { id } = req.params;
    const { limit = 100, type } = req.query;
    const relayData = whisperxRelays.get(id);
    if (!relayData) {
      res.status(404).json({ error: "WhisperX relay not found" });
      return;
    }
    try {
      let logs;
      if (type) logs = relayData.relay.getLogsByType(type, parseInt(limit));
      else logs = relayData.relay.getLogs(parseInt(limit));
      res.json({ whisperxId: id, count: logs.length, type: type || "all", logs });
    } catch (error) {
      console.error("Error getting logs:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/whisperx-relay/:id/transcription", (req, res) => {
    const { id } = req.params;
    const relayData = whisperxRelays.get(id);
    if (!relayData) {
      res.status(404).json({ error: "WhisperX relay not found" });
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

  app.delete("/api/whisperx-relay/:id/logs", (req, res) => {
    const { id } = req.params;
    const relayData = whisperxRelays.get(id);
    if (!relayData) {
      res.status(404).json({ error: "WhisperX relay not found" });
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


