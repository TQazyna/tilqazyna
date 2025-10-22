import express from "express";

export function registerNormalizerRoutes(ctx) {
  const { app, normalizers, rtmpRelays, OPENAI_API_KEY, TranscriptionNormalizer, broadcastToNormalizerClients } = ctx;

  // Создать новый нормализатор
  app.post("/api/normalizer", express.json(), async (req, res) => {
    try {
      const {
        relayId,
        model,
        prompt,
        batchSize,
        autoNormalize,
        normalizeInterval
      } = req.body;

      if (!relayId || !rtmpRelays.has(relayId)) {
        res.status(400).json({ error: "Valid relay ID is required" });
        return;
      }

      if (!OPENAI_API_KEY) {
        res.status(500).json({ error: "OpenAI API key is not configured" });
        return;
      }

      const relayData = rtmpRelays.get(relayId);
      const normalizerId = "normalizer-" + Date.now();

      const normalizer = new TranscriptionNormalizer({
        apiKey: OPENAI_API_KEY,
        relayId: relayId,
        relay: relayData.relay,
        model: model || "gpt-4",
        prompt: prompt,
        batchSize: batchSize || 10,
        autoNormalize: autoNormalize !== false,
        normalizeInterval: normalizeInterval || 30000
      });

      // Настройка обработчиков событий
      normalizer.on("started", () => {
        console.log(`Normalizer ${normalizerId} started`);
        normalizers.get(normalizerId).status = "running";
      });

      normalizer.on("stopped", () => {
        console.log(`Normalizer ${normalizerId} stopped`);
        normalizers.get(normalizerId).status = "stopped";
      });

      normalizer.on("error", (error) => {
        console.error(`Normalizer ${normalizerId} error:`, error);
        normalizers.get(normalizerId).status = "error";
        normalizers.get(normalizerId).lastError = error.message;
      });

      normalizer.on("transcription_received", (transcription) => {
        broadcastToNormalizerClients(normalizerId, {
          type: "transcription_received",
          data: transcription
        });
      });

      normalizer.on("normalization_completed", (result) => {
        console.log(`Normalization completed for ${normalizerId}`);
        broadcastToNormalizerClients(normalizerId, {
          type: "normalization_completed",
          data: result
        });
      });

      normalizer.on("normalization_failed", (result) => {
        console.error(`Normalization failed for ${normalizerId}`);
        broadcastToNormalizerClients(normalizerId, {
          type: "normalization_failed",
          data: result
        });
      });

      normalizer.on("log", (logEntry) => {
        broadcastToNormalizerClients(normalizerId, {
          type: "log",
          data: logEntry
        });
      });

      // Сохраняем нормализатор
      normalizers.set(normalizerId, {
        normalizer,
        relayId,
        createdAt: new Date().toISOString(),
        status: "created"
      });

      // Запускаем нормализатор
      await normalizer.start();

      res.json({
        id: normalizerId,
        relayId,
        status: "running",
        createdAt: normalizers.get(normalizerId).createdAt,
        settings: {
          model: normalizer.model,
          batchSize: normalizer.batchSize,
          autoNormalize: normalizer.autoNormalize,
          normalizeInterval: normalizer.normalizeInterval
        }
      });

    } catch (error) {
      console.error("Error creating normalizer:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Получить список всех нормализаторов
  app.get("/api/normalizer", (_req, res) => {
    const normalizersList = Array.from(normalizers.entries()).map(([id, data]) => ({
      id,
      relayId: data.relayId,
      status: data.status,
      createdAt: data.createdAt,
      lastError: data.lastError || null,
      stats: data.normalizer.getStats()
    }));

    res.json(normalizersList);
  });

  // Получить конкретный нормализатор
  app.get("/api/normalizer/:id", (req, res) => {
    const { id } = req.params;
    const normalizerData = normalizers.get(id);

    if (!normalizerData) {
      res.status(404).json({ error: "Normalizer not found" });
      return;
    }

    res.json({
      id,
      relayId: normalizerData.relayId,
      status: normalizerData.status,
      createdAt: normalizerData.createdAt,
      lastError: normalizerData.lastError || null,
      stats: normalizerData.normalizer.getStats()
    });
  });

  // Остановить нормализатор
  app.delete("/api/normalizer/:id", (req, res) => {
    const { id } = req.params;
    const normalizerData = normalizers.get(id);

    if (!normalizerData) {
      res.status(404).json({ error: "Normalizer not found" });
      return;
    }

    try {
      normalizerData.normalizer.stop();
      normalizers.delete(id);

      res.json({ success: true, message: "Normalizer stopped and removed" });
    } catch (error) {
      console.error("Error stopping normalizer:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Запустить нормализацию вручную
  app.post("/api/normalizer/:id/normalize", async (req, res) => {
    const { id } = req.params;
    const normalizerData = normalizers.get(id);

    if (!normalizerData) {
      res.status(404).json({ error: "Normalizer not found" });
      return;
    }

    try {
      const result = await normalizerData.normalizer.normalizeNow();
      res.json({ success: true, result });
    } catch (error) {
      console.error("Error normalizing:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Получить результаты нормализации
  app.get("/api/normalizer/:id/results", (req, res) => {
    const { id } = req.params;
    const { limit = 50 } = req.query;
    const normalizerData = normalizers.get(id);

    if (!normalizerData) {
      res.status(404).json({ error: "Normalizer not found" });
      return;
    }

    try {
      const results = normalizerData.normalizer.getResults(parseInt(limit));
      res.json({
        normalizerId: id,
        count: results.length,
        results
      });
    } catch (error) {
      console.error("Error getting results:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Получить конкретный результат нормализации
  app.get("/api/normalizer/:id/results/:resultId", (req, res) => {
    const { id, resultId } = req.params;
    const normalizerData = normalizers.get(id);

    if (!normalizerData) {
      res.status(404).json({ error: "Normalizer not found" });
      return;
    }

    try {
      const result = normalizerData.normalizer.getResult(resultId);
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

  // Получить транскрипции
  app.get("/api/normalizer/:id/transcriptions", (req, res) => {
    const { id } = req.params;
    const { limit = 50 } = req.query;
    const normalizerData = normalizers.get(id);

    if (!normalizerData) {
      res.status(404).json({ error: "Normalizer not found" });
      return;
    }

    try {
      const results = normalizerData.normalizer.getTranscriptions(parseInt(limit));
      res.json({
        normalizerId: id,
        count: results.length,
        transcriptions: results
      });
    } catch (error) {
      console.error("Error getting transcriptions:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Получить логи
  app.get("/api/normalizer/:id/logs", (req, res) => {
    const { id } = req.params;
    const { limit = 100, type } = req.query;
    const normalizerData = normalizers.get(id);

    if (!normalizerData) {
      res.status(404).json({ error: "Normalizer not found" });
      return;
    }

    try {
      let logs;
      if (type) {
        logs = normalizerData.normalizer.getLogsByType(type, parseInt(limit));
      } else {
        logs = normalizerData.normalizer.getLogs(parseInt(limit));
      }

      res.json({
        normalizerId: id,
        count: logs.length,
        type: type || "all",
        logs
      });
    } catch (error) {
      console.error("Error getting logs:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Очистить результаты
  app.delete("/api/normalizer/:id/results", async (req, res) => {
    const { id } = req.params;
    const normalizerData = normalizers.get(id);

    if (!normalizerData) {
      res.status(404).json({ error: "Normalizer not found" });
      return;
    }

    try {
      await normalizerData.normalizer.clearResults();
      res.json({ success: true, message: "Results cleared" });
    } catch (error) {
      console.error("Error clearing results:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Очистить логи
  app.delete("/api/normalizer/:id/logs", (req, res) => {
    const { id } = req.params;
    const normalizerData = normalizers.get(id);

    if (!normalizerData) {
      res.status(404).json({ error: "Normalizer not found" });
      return;
    }

    try {
      normalizerData.normalizer.clearLogs();
      res.json({ success: true, message: "Logs cleared" });
    } catch (error) {
      console.error("Error clearing logs:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Обновить настройки
  app.patch("/api/normalizer/:id/settings", express.json(), (req, res) => {
    const { id } = req.params;
    const normalizerData = normalizers.get(id);

    if (!normalizerData) {
      res.status(404).json({ error: "Normalizer not found" });
      return;
    }

    try {
      normalizerData.normalizer.updateSettings(req.body);
      res.json({
        success: true,
        message: "Settings updated",
        settings: {
          model: normalizerData.normalizer.model,
          batchSize: normalizerData.normalizer.batchSize,
          autoNormalize: normalizerData.normalizer.autoNormalize,
          normalizeInterval: normalizerData.normalizer.normalizeInterval
        }
      });
    } catch (error) {
      console.error("Error updating settings:", error);
      res.status(500).json({ error: error.message });
    }
  });
}


