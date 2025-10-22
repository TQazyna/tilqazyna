import express from "express";

export function registerTranslatorRoutes(ctx) {
  const { app, translators, normalizers, OPENAI_API_KEY, TranscriptionTranslator, broadcastToTranslatorClients } = ctx;

  // Создать новый переводчик
  app.post("/api/translator", express.json(), async (req, res) => {
    try {
      const {
        normalizerId,
        model,
        prompt,
        autoTranslate,
        targetLanguage,
        sourceLanguage
      } = req.body;

      if (!normalizerId || !normalizers.has(normalizerId)) {
        res.status(400).json({ error: "Valid normalizer ID is required" });
        return;
      }

      if (!OPENAI_API_KEY) {
        res.status(500).json({ error: "OpenAI API key is not configured" });
        return;
      }

      const normalizerData = normalizers.get(normalizerId);
      const translatorId = "translator-" + Date.now();

      const translator = new TranscriptionTranslator({
        apiKey: OPENAI_API_KEY,
        normalizerId: normalizerId,
        normalizer: normalizerData.normalizer,
        model: model || "gpt-4o",
        prompt: prompt,
        autoTranslate: autoTranslate !== false,
        targetLanguage: targetLanguage || "russian",
        sourceLanguage: sourceLanguage || "kazakh"
      });

      translator.on("started", () => {
        console.log(`Translator ${translatorId} started`);
        translators.get(translatorId).status = "running";
      });

      translator.on("stopped", () => {
        console.log(`Translator ${translatorId} stopped`);
        translators.get(translatorId).status = "stopped";
      });

      translator.on("error", (error) => {
        console.error(`Translator ${translatorId} error:`, error);
        translators.get(translatorId).status = "error";
        translators.get(translatorId).lastError = error.message;
      });

      translator.on("normalization_received", (normalization) => {
        broadcastToTranslatorClients(translatorId, {
          type: "normalization_received",
          data: normalization
        });
      });

      translator.on("translation_completed", (result) => {
        console.log(`Translation completed for ${translatorId}`);
        broadcastToTranslatorClients(translatorId, {
          type: "translation_completed",
          data: result
        });
      });

      translator.on("translation_failed", (result) => {
        console.error(`Translation failed for ${translatorId}`);
        broadcastToTranslatorClients(translatorId, {
          type: "translation_failed",
          data: result
        });
      });

      translator.on("log", (logEntry) => {
        broadcastToTranslatorClients(translatorId, {
          type: "log",
          data: logEntry
        });
      });

      translators.set(translatorId, {
        translator,
        normalizerId,
        createdAt: new Date().toISOString(),
        status: "created"
      });

      await translator.start();

      res.json({
        id: translatorId,
        normalizerId,
        status: "running",
        createdAt: translators.get(translatorId).createdAt,
        settings: {
          model: translator.model,
          autoTranslate: translator.autoTranslate,
          targetLanguage: translator.targetLanguage,
          sourceLanguage: translator.sourceLanguage
        }
      });
    } catch (error) {
      console.error("Error creating translator:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/translator", (_req, res) => {
    const translatorsList = Array.from(translators.entries()).map(([id, data]) => ({
      id,
      normalizerId: data.normalizerId,
      status: data.status,
      createdAt: data.createdAt,
      lastError: data.lastError || null,
      stats: data.translator.getStats()
    }));

    res.json(translatorsList);
  });

  app.get("/api/translator/:id", (req, res) => {
    const { id } = req.params;
    const translatorData = translators.get(id);
    if (!translatorData) {
      res.status(404).json({ error: "Translator not found" });
      return;
    }
    res.json({
      id,
      normalizerId: translatorData.normalizerId,
      status: translatorData.status,
      createdAt: translatorData.createdAt,
      lastError: translatorData.lastError || null,
      stats: translatorData.translator.getStats()
    });
  });

  app.delete("/api/translator/:id", (req, res) => {
    const { id } = req.params;
    const translatorData = translators.get(id);
    if (!translatorData) {
      res.status(404).json({ error: "Translator not found" });
      return;
    }
    try {
      translatorData.translator.stop();
      translators.delete(id);
      res.json({ success: true, message: "Translator stopped and removed" });
    } catch (error) {
      console.error("Error stopping translator:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/translator/:id/translate/:normalizationId", async (req, res) => {
    const { id, normalizationId } = req.params;
    const translatorData = translators.get(id);
    if (!translatorData) {
      res.status(404).json({ error: "Translator not found" });
      return;
    }
    try {
      const result = await translatorData.translator.translateByNormalizationId(normalizationId);
      res.json({ success: true, result });
    } catch (error) {
      console.error("Error translating:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/translator/:id/results", (req, res) => {
    const { id } = req.params;
    const { limit = 50 } = req.query;
    const translatorData = translators.get(id);
    if (!translatorData) {
      res.status(404).json({ error: "Translator not found" });
      return;
    }
    try {
      const results = translatorData.translator.getResults(parseInt(limit));
      res.json({ translatorId: id, count: results.length, results });
    } catch (error) {
      console.error("Error getting results:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/translator/:id/results/:resultId", (req, res) => {
    const { id, resultId } = req.params;
    const translatorData = translators.get(id);
    if (!translatorData) {
      res.status(404).json({ error: "Translator not found" });
      return;
    }
    try {
      const result = translatorData.translator.getResult(resultId);
      if (!result) {
        res.status(404).json({ error: "Result not found" });
        return;
      }
      res.json(result);
    } catch (error) {
      console.error("Error getting result:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/translator/:id/logs", (req, res) => {
    const { id } = req.params;
    const { limit = 100, type } = req.query;
    const translatorData = translators.get(id);
    if (!translatorData) {
      res.status(404).json({ error: "Translator not found" });
      return;
    }
    try {
      let logs;
      if (type) logs = translatorData.translator.getLogsByType(type, parseInt(limit));
      else logs = translatorData.translator.getLogs(parseInt(limit));
      res.json({ translatorId: id, count: logs.length, type: type || "all", logs });
    } catch (error) {
      console.error("Error getting logs:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/translator/:id/results", async (req, res) => {
    const { id } = req.params;
    const translatorData = translators.get(id);
    if (!translatorData) {
      res.status(404).json({ error: "Translator not found" });
      return;
    }
    try {
      await translatorData.translator.clearResults();
      res.json({ success: true, message: "Results cleared" });
    } catch (error) {
      console.error("Error clearing results:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/translator/:id/logs", (req, res) => {
    const { id } = req.params;
    const translatorData = translators.get(id);
    if (!translatorData) {
      res.status(404).json({ error: "Translator not found" });
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

  app.patch("/api/translator/:id/settings", express.json(), (req, res) => {
    const { id } = req.params;
    const translatorData = translators.get(id);
    if (!translatorData) {
      res.status(404).json({ error: "Translator not found" });
      return;
    }
    try {
      translatorData.translator.updateSettings(req.body);
      res.json({
        success: true,
        message: "Settings updated",
        settings: {
          autoTranslate: translatorData.translator.autoTranslate,
          targetLanguage: translatorData.translator.targetLanguage,
          sourceLanguage: translatorData.translator.sourceLanguage
        }
      });
    } catch (error) {
      console.error("Error updating settings:", error);
      res.status(500).json({ error: error.message });
    }
  });
}


