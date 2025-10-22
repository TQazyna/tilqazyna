import express from "express";

export function registerSpeakerRoutes(ctx) {
  const { app, speakers, translators, OPENAI_API_KEY, TranslationSpeaker, broadcastToSpeakerClients } = ctx;

  app.post("/api/speaker", express.json(), async (req, res) => {
    try {
      const { translatorId, model, voice, speed, autoSpeak } = req.body;
      if (!translatorId || !translators.has(translatorId)) {
        res.status(400).json({ error: "Valid translator ID is required" });
        return;
      }
      if (!OPENAI_API_KEY) {
        res.status(500).json({ error: "OpenAI API key is not configured" });
        return;
      }
      const translatorData = translators.get(translatorId);
      const speakerId = "speaker-" + Date.now();
      const speaker = new TranslationSpeaker({
        apiKey: OPENAI_API_KEY,
        translatorId,
        translator: translatorData.translator,
        model: model || "tts-1",
        voice: voice || "alloy",
        speed: speed || 1.0,
        autoSpeak: autoSpeak !== false
      });

      speaker.on("started", () => {
        console.log(`Speaker ${speakerId} started`);
        speakers.get(speakerId).status = "running";
      });
      speaker.on("stopped", () => {
        console.log(`Speaker ${speakerId} stopped`);
        speakers.get(speakerId).status = "stopped";
      });
      speaker.on("error", (error) => {
        console.error(`Speaker ${speakerId} error:`, error);
        speakers.get(speakerId).status = "error";
        speakers.get(speakerId).lastError = error.message;
      });
      speaker.on("translation_received", (translation) => {
        broadcastToSpeakerClients(speakerId, { type: "translation_received", data: translation });
      });
      speaker.on("speech_completed", (result) => {
        console.log(`Speech completed for ${speakerId}`);
        broadcastToSpeakerClients(speakerId, { type: "speech_completed", data: result });
      });
      speaker.on("speech_failed", (result) => {
        console.error(`Speech failed for ${speakerId}`);
        broadcastToSpeakerClients(speakerId, { type: "speech_failed", data: result });
      });
      speaker.on("log", (logEntry) => {
        broadcastToSpeakerClients(speakerId, { type: "log", data: logEntry });
      });
      speaker.on("audio_start", (meta) => {
        broadcastToSpeakerClients(speakerId, { type: "audio_start", data: meta });
      });
      speaker.on("audio_chunk", (chunk) => {
        broadcastToSpeakerClients(speakerId, { type: "audio_chunk", data: chunk });
      });
      speaker.on("audio_end", (info) => {
        broadcastToSpeakerClients(speakerId, { type: "audio_end", data: info });
      });

      speakers.set(speakerId, {
        speaker,
        translatorId,
        createdAt: new Date().toISOString(),
        status: "created"
      });
      await speaker.start();

      res.json({
        id: speakerId,
        translatorId,
        status: "running",
        createdAt: speakers.get(speakerId).createdAt,
        settings: {
          model: speaker.model,
          voice: speaker.voice,
          speed: speaker.speed,
          autoSpeak: speaker.autoSpeak
        }
      });
    } catch (error) {
      console.error("Error creating speaker:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/speaker", (_req, res) => {
    const speakersList = Array.from(speakers.entries()).map(([id, data]) => ({
      id,
      translatorId: data.translatorId,
      status: data.status,
      createdAt: data.createdAt,
      lastError: data.lastError || null,
      stats: data.speaker.getStats(),
      voice: data.speaker.voice,
      model: data.speaker.model,
      speed: data.speaker.speed,
      isRunning: data.speaker.isRunning
    }));
    res.json(speakersList);
  });

  app.get("/api/speaker/:id", (req, res) => {
    const { id } = req.params;
    const speakerData = speakers.get(id);
    if (!speakerData) {
      res.status(404).json({ error: "Speaker not found" });
      return;
    }
    res.json({
      id,
      translatorId: speakerData.translatorId,
      status: speakerData.status,
      createdAt: speakerData.createdAt,
      lastError: speakerData.lastError || null,
      stats: speakerData.speaker.getStats()
    });
  });

  app.delete("/api/speaker/:id", (req, res) => {
    const { id } = req.params;
    const speakerData = speakers.get(id);
    if (!speakerData) {
      res.status(404).json({ error: "Speaker not found" });
      return;
    }
    try {
      speakerData.speaker.stop();
      speakers.delete(id);
      res.json({ success: true, message: "Speaker stopped and removed" });
    } catch (error) {
      console.error("Error stopping speaker:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/speaker/:id/speak/:translationId", async (req, res) => {
    const { id, translationId } = req.params;
    const speakerData = speakers.get(id);
    if (!speakerData) {
      res.status(404).json({ error: "Speaker not found" });
      return;
    }
    try {
      const result = await speakerData.speaker.speakByTranslationId(translationId);
      res.json({ success: true, result });
    } catch (error) {
      console.error("Error speaking:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/speaker/:id/results", (req, res) => {
    const { id } = req.params;
    const { limit = 50 } = req.query;
    const speakerData = speakers.get(id);
    if (!speakerData) {
      res.status(404).json({ error: "Speaker not found" });
      return;
    }
    try {
      const results = speakerData.speaker.getResults(parseInt(limit));
      res.json({ speakerId: id, count: results.length, results });
    } catch (error) {
      console.error("Error getting results:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/speaker/:id/audio/:speechId", async (req, res) => {
    const { id, speechId } = req.params;
    const speakerData = speakers.get(id);
    if (!speakerData) {
      res.status(404).json({ error: "Speaker not found" });
      return;
    }
    try {
      const audioBuffer = await speakerData.speaker.getAudioFile(speechId);
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Length', audioBuffer.length);
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      res.send(audioBuffer);
    } catch (error) {
      console.error("Error getting audio file:", error);
      res.status(404).json({ error: "Audio file not found" });
    }
  });

  app.get("/api/speaker/:id/logs", (req, res) => {
    const { id } = req.params;
    const { limit = 100, type } = req.query;
    const speakerData = speakers.get(id);
    if (!speakerData) {
      res.status(404).json({ error: "Speaker not found" });
      return;
    }
    try {
      let logs;
      if (type) logs = speakerData.speaker.getLogsByType(type, parseInt(limit));
      else logs = speakerData.speaker.getLogs(parseInt(limit));
      res.json({ speakerId: id, count: logs.length, type: type || "all", logs });
    } catch (error) {
      console.error("Error getting logs:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/speaker/:id/results", async (req, res) => {
    const { id } = req.params;
    const speakerData = speakers.get(id);
    if (!speakerData) {
      res.status(404).json({ error: "Speaker not found" });
      return;
    }
    try {
      await speakerData.speaker.clearResults();
      res.json({ success: true, message: "Results cleared" });
    } catch (error) {
      console.error("Error clearing results:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/speaker/:id/logs", (req, res) => {
    const { id } = req.params;
    const speakerData = speakers.get(id);
    if (!speakerData) {
      res.status(404).json({ error: "Speaker not found" });
      return;
    }
    try {
      speakerData.speaker.clearLogs();
      res.json({ success: true, message: "Logs cleared" });
    } catch (error) {
      console.error("Error clearing logs:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/speaker/:id/settings", express.json(), (req, res) => {
    const { id } = req.params;
    const speakerData = speakers.get(id);
    if (!speakerData) {
      res.status(404).json({ error: "Speaker not found" });
      return;
    }
    try {
      speakerData.speaker.updateSettings(req.body);
      res.json({
        success: true,
        message: "Settings updated",
        settings: {
          autoSpeak: speakerData.speaker.autoSpeak,
          voice: speakerData.speaker.voice,
          model: speakerData.speaker.model,
          speed: speakerData.speaker.speed
        }
      });
    } catch (error) {
      console.error("Error updating settings:", error);
      res.status(500).json({ error: error.message });
    }
  });
}


