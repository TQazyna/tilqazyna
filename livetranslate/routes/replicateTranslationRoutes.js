import express from "express";

export function registerReplicateTranslationRoutes(ctx) {
  const { app, replicateTranslators, whisperxRelays, REPLICATE_API_TOKEN, ReplicateTranslation, broadcastToReplicateTranslatorClients } = ctx;

  app.post("/api/replicate-translation", express.json(), async (req, res) => {
    try {
      const { whisperxId, model, temperature, maxTokens, autoTranslate, contextSize, sourceLanguage, targetLanguage, systemPrompt } = req.body;
      if (!whisperxId) {
        res.status(400).json({ error: "WhisperX relay ID is required" });
        return;
      }
      if (!REPLICATE_API_TOKEN) {
        res.status(500).json({ error: "Replicate API token is not configured" });
        return;
      }
      const whisperxRelayData = whisperxRelays.get(whisperxId);
      if (!whisperxRelayData) {
        res.status(404).json({ error: "WhisperX relay not found" });
        return;
      }
      const translatorId = "replicate-translator-" + Date.now();
      const translator = new ReplicateTranslation({
        apiToken: REPLICATE_API_TOKEN,
        whisperxRelay: whisperxRelayData.relay,
        relayId: translatorId,
        model: model || "openai/gpt-oss-20b",
        temperature: temperature || 0.3,
        maxTokens: maxTokens || 2000,
        autoTranslate: autoTranslate !== false,
        contextSize: contextSize || 10,
        sourceLanguage: sourceLanguage || "kazakh",
        targetLanguage: targetLanguage || "russian",
        systemPrompt
      });

      translator.on("started", () => {
        console.log(`Replicate Translator ${translatorId} started`);
        const translatorData = replicateTranslators.get(translatorId);
        if (translatorData) translatorData.status = "running";
      });
      translator.on("stopped", () => {
        console.log(`Replicate Translator ${translatorId} stopped`);
        const translatorData = replicateTranslators.get(translatorId);
        if (translatorData) translatorData.status = "stopped";
      });
      translator.on("error", (error) => {
        console.error(`Replicate Translator ${translatorId} error:`, error);
        const translatorData = replicateTranslators.get(translatorId);
        if (translatorData) {
          translatorData.status = "error";
          translatorData.lastError = error.message || error;
        }
      });
      translator.on("translation_start", (data) => {
        broadcastToReplicateTranslatorClients(translatorId, { type: "translation_start", data });
      });
      translator.on("translation_completed", (translation) => {
        console.log(`Replicate translation for ${translatorId}:`, translation.translatedText);
        broadcastToReplicateTranslatorClients(translatorId, { type: "translation_completed", data: translation });
      });
      translator.on("translation_failed", (error) => {
        broadcastToReplicateTranslatorClients(translatorId, { type: "translation_failed", data: error });
      });
      translator.on("log", (logEntry) => {
        broadcastToReplicateTranslatorClients(translatorId, { type: "log", data: logEntry });
      });

      replicateTranslators.set(translatorId, {
        translator,
        whisperxId,
        createdAt: new Date().toISOString(),
        status: "created",
        model: model || "openai/gpt-oss-20b",
        autoTranslate: autoTranslate !== false
      });

      await translator.start();
      res.json({ id: translatorId, whisperxId, model: model || "openai/gpt-oss-20b", autoTranslate: autoTranslate !== false, contextSize: contextSize || 10, status: "running", createdAt: replicateTranslators.get(translatorId).createdAt });
    } catch (error) {
      console.error("Error creating Replicate Translator:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/replicate-translation", (_req, res) => {
    const translators = Array.from(replicateTranslators.entries()).map(([id, data]) => ({
      id,
      whisperxId: data.whisperxId,
      model: data.model,
      autoTranslate: data.autoTranslate,
      status: data.status,
      createdAt: data.createdAt,
      lastError: data.lastError || null
    }));
    res.json(translators);
  });

  app.get("/api/replicate-translation/:id", (req, res) => {
    const { id } = req.params;
    const translatorData = replicateTranslators.get(id);
    if (!translatorData) {
      res.status(404).json({ error: "Replicate Translator not found" });
      return;
    }
    const status = translatorData.translator.getStatus();
    res.json({ id, whisperxId: translatorData.whisperxId, model: translatorData.model, status: translatorData.status, createdAt: translatorData.createdAt, lastError: translatorData.lastError || null, details: status });
  });

  app.delete("/api/replicate-translation/:id", async (req, res) => {
    const { id } = req.params;
    const translatorData = replicateTranslators.get(id);
    if (!translatorData) {
      res.status(404).json({ error: "Replicate Translator not found" });
      return;
    }
    try {
      await translatorData.translator.stop();
      replicateTranslators.delete(id);
      res.json({ success: true, message: "Replicate Translator stopped and removed" });
    } catch (error) {
      console.error("Error stopping Replicate Translator:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/replicate-translation/:id/results", (req, res) => {
    const { id } = req.params;
    const translatorData = replicateTranslators.get(id);
    if (!translatorData) {
      res.status(404).json({ error: "Replicate Translator not found" });
      return;
    }
    const limit = parseInt(req.query.limit) || 50;
    const results = translatorData.translator.getTranslationResults(limit);
    res.json({ translatorId: id, count: results.length, results });
  });

  app.get("/api/replicate-translation/:id/results/:resultId", (req, res) => {
    const { id, resultId } = req.params;
    const translatorData = replicateTranslators.get(id);
    if (!translatorData) {
      res.status(404).json({ error: "Replicate Translator not found" });
      return;
    }
    const results = translatorData.translator.getTranslationResults();
    const result = results.find(r => r.id === resultId);
    if (!result) {
      res.status(404).json({ error: "Translation result not found" });
      return;
    }
    res.json(result);
  });

  app.get("/api/replicate-translation/:id/context", (req, res) => {
    const { id } = req.params;
    const translatorData = replicateTranslators.get(id);
    if (!translatorData) {
      res.status(404).json({ error: "Replicate Translator not found" });
      return;
    }
    const limit = parseInt(req.query.limit) || 10;
    const context = translatorData.translator.getContextHistory(limit);
    res.json({ translatorId: id, count: context.length, context });
  });

  app.get("/api/replicate-translation/:id/logs", (req, res) => {
    const { id } = req.params;
    const translatorData = replicateTranslators.get(id);
    if (!translatorData) {
      res.status(404).json({ error: "Replicate Translator not found" });
      return;
    }
    const limit = parseInt(req.query.limit) || 100;
    const type = req.query.type;
    let logs;
    if (type) logs = translatorData.translator.getLogsByType(type, limit);
    else logs = translatorData.translator.getLogs(limit);
    res.json({ translatorId: id, count: logs.length, logs });
  });

  app.delete("/api/replicate-translation/:id/results", async (req, res) => {
    const { id } = req.params;
    const translatorData = replicateTranslators.get(id);
    if (!translatorData) {
      res.status(404).json({ error: "Replicate Translator not found" });
      return;
    }
    try {
      translatorData.translator.clearTranslationResults();
      res.json({ success: true, message: "Translation results cleared" });
    } catch (error) {
      console.error("Error clearing translation results:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/replicate-translation/:id/context", (req, res) => {
    const { id } = req.params;
    const translatorData = replicateTranslators.get(id);
    if (!translatorData) {
      res.status(404).json({ error: "Replicate Translator not found" });
      return;
    }
    try {
      translatorData.translator.clearContextHistory();
      res.json({ success: true, message: "Context history cleared" });
    } catch (error) {
      console.error("Error clearing context history:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/replicate-translation/:id/logs", (req, res) => {
    const { id } = req.params;
    const translatorData = replicateTranslators.get(id);
    if (!translatorData) {
      res.status(404).json({ error: "Replicate Translator not found" });
      return;
    }
    try {
      translatorData.translator.clearLogs();
      res.json({ success: true, message: "Logs cleared" });
    } catch (error) {
      console.error("Error clearing logs:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/replicate-translation/:id/manual-translate", express.json(), async (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
    if (!text) {
      res.status(400).json({ error: "Text is required" });
      return;
    }
    const translatorData = replicateTranslators.get(id);
    if (!translatorData) {
      res.status(404).json({ error: "Replicate Translator not found" });
      return;
    }
    try {
      const result = await translatorData.translator.manualTranslate(text);
      res.json(result);
    } catch (error) {
      console.error("Error in manual translation:", error);
      res.status(500).json({ error: error.message });
    }
  });
}


