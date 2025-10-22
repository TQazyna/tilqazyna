/**
 * API routes для SeamlessSpeechTranslation
 * Управление сервисами речевого перевода через SeamlessM4T
 */

export function registerSeamlessSpeechRoutes({
  app,
  seamlessSpeechServices,
  whisperxRelays,
  REPLICATE_API_TOKEN,
  SeamlessSpeechTranslation,
  broadcastToSeamlessSpeechClients
}) {

  // ============================================
  // GET /api/seamless-speech - получить список всех сервисов
  // ============================================
  app.get("/api/seamless-speech", (req, res) => {
    const services = Array.from(seamlessSpeechServices.entries()).map(([id, data]) => ({
      id,
      relayId: data.relayId,
      status: data.service.getStatus(),
      createdAt: data.createdAt
    }));

    res.json({ services });
  });

  // ============================================
  // GET /api/seamless-speech/:id - получить информацию о сервисе
  // ============================================
  app.get("/api/seamless-speech/:id", (req, res) => {
    const serviceId = req.params.id;
    const serviceData = seamlessSpeechServices.get(serviceId);

    if (!serviceData) {
      return res.status(404).json({ error: "Service not found" });
    }

    const status = serviceData.service.getStatus();
    const results = serviceData.service.getTranslationResults(50);
    const logs = serviceData.service.getLogs(100);

    res.json({
      id: serviceId,
      relayId: serviceData.relayId,
      status,
      results,
      logs,
      createdAt: serviceData.createdAt
    });
  });

  // ============================================
  // POST /api/seamless-speech - создать новый сервис
  // ============================================
  app.post("/api/seamless-speech", async (req, res) => {
    try {
      const { whisperxId, autoTranslate } = req.body;

      if (!whisperxId) {
        return res.status(400).json({ error: "whisperxId is required" });
      }

      // Проверяем, что WhisperX relay существует
      const whisperxData = whisperxRelays.get(whisperxId);
      if (!whisperxData) {
        return res.status(404).json({ error: "WhisperX relay not found" });
      }

      const whisperxRelay = whisperxData.relay;

      // Создаем уникальный ID для сервиса
      const serviceId = `seamless-speech-${Date.now()}`;

      // Создаем сервис (языки жестко зафиксированы: Kazakh → Russian)
      const service = new SeamlessSpeechTranslation({
        apiToken: REPLICATE_API_TOKEN,
        whisperxRelay: whisperxRelay,
        relayId: serviceId,
        autoTranslate: autoTranslate !== false
      });

      // Подписываемся на события
      service.on("translation_completed", (result) => {
        console.log(`[SeamlessSpeech ${serviceId}] Translation completed:`, result.id);
        broadcastToSeamlessSpeechClients(serviceId, {
          type: "translation_completed",
          data: result
        });
      });

      service.on("audio_ready", (data) => {
        console.log(`[SeamlessSpeech ${serviceId}] Audio ready:`, data.audioFilename, `size: ${data.size} bytes`);
        broadcastToSeamlessSpeechClients(serviceId, {
          type: "audio_ready",
          data: data
        });
      });

      service.on("translation_start", (data) => {
        broadcastToSeamlessSpeechClients(serviceId, {
          type: "translation_start",
          data: data
        });
      });

      service.on("log", (logEntry) => {
        broadcastToSeamlessSpeechClients(serviceId, {
          type: "log",
          data: logEntry
        });
      });

      service.on("error", (error) => {
        console.error(`[SeamlessSpeech ${serviceId}] Error:`, error);
        broadcastToSeamlessSpeechClients(serviceId, {
          type: "error",
          data: { message: error.message || String(error) }
        });
      });

      // Запускаем сервис
      await service.start();

      // Сохраняем в Map
      seamlessSpeechServices.set(serviceId, {
        service,
        whisperxId,
        relayId: serviceId,
        createdAt: new Date().toISOString(),
        status: "running"
      });

      console.log(`SeamlessSpeech service created: ${serviceId} for WhisperX: ${whisperxId}`);

      res.json({
        id: serviceId,
        whisperxId,
        status: service.getStatus(),
        message: "SeamlessSpeech service started successfully"
      });

    } catch (error) {
      console.error("Error creating SeamlessSpeech service:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // ============================================
  // POST /api/seamless-speech/:id/stop - остановить сервис
  // ============================================
  app.post("/api/seamless-speech/:id/stop", async (req, res) => {
    try {
      const serviceId = req.params.id;
      const serviceData = seamlessSpeechServices.get(serviceId);

      if (!serviceData) {
        return res.status(404).json({ error: "Service not found" });
      }

      await serviceData.service.stop();
      serviceData.status = "stopped";

      res.json({
        id: serviceId,
        status: "stopped",
        message: "SeamlessSpeech service stopped successfully"
      });

    } catch (error) {
      console.error("Error stopping SeamlessSpeech service:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // ============================================
  // DELETE /api/seamless-speech/:id - удалить сервис
  // ============================================
  app.delete("/api/seamless-speech/:id", async (req, res) => {
    try {
      const serviceId = req.params.id;
      const serviceData = seamlessSpeechServices.get(serviceId);

      if (!serviceData) {
        return res.status(404).json({ error: "Service not found" });
      }

      // Останавливаем сервис если запущен
      if (serviceData.service.isRunning) {
        await serviceData.service.stop();
      }

      // Удаляем из Map
      seamlessSpeechServices.delete(serviceId);

      res.json({
        id: serviceId,
        message: "SeamlessSpeech service deleted successfully"
      });

    } catch (error) {
      console.error("Error deleting SeamlessSpeech service:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // ============================================
  // GET /api/seamless-speech/:id/results - получить результаты
  // ============================================
  app.get("/api/seamless-speech/:id/results", (req, res) => {
    const serviceId = req.params.id;
    const serviceData = seamlessSpeechServices.get(serviceId);

    if (!serviceData) {
      return res.status(404).json({ error: "Service not found" });
    }

    const limit = parseInt(req.query.limit) || 50;
    const results = serviceData.service.getTranslationResults(limit);

    res.json({ results });
  });

  // ============================================
  // GET /api/seamless-speech/:id/logs - получить логи
  // ============================================
  app.get("/api/seamless-speech/:id/logs", (req, res) => {
    const serviceId = req.params.id;
    const serviceData = seamlessSpeechServices.get(serviceId);

    if (!serviceData) {
      return res.status(404).json({ error: "Service not found" });
    }

    const limit = parseInt(req.query.limit) || 100;
    const type = req.query.type;

    const logs = type
      ? serviceData.service.getLogsByType(type, limit)
      : serviceData.service.getLogs(limit);

    res.json({ logs });
  });

  // ============================================
  // POST /api/seamless-speech/:id/clear-results - очистить результаты
  // ============================================
  app.post("/api/seamless-speech/:id/clear-results", (req, res) => {
    const serviceId = req.params.id;
    const serviceData = seamlessSpeechServices.get(serviceId);

    if (!serviceData) {
      return res.status(404).json({ error: "Service not found" });
    }

    serviceData.service.clearTranslationResults();

    res.json({
      id: serviceId,
      message: "Results cleared successfully"
    });
  });

  // ============================================
  // POST /api/seamless-speech/:id/clear-logs - очистить логи
  // ============================================
  app.post("/api/seamless-speech/:id/clear-logs", (req, res) => {
    const serviceId = req.params.id;
    const serviceData = seamlessSpeechServices.get(serviceId);

    if (!serviceData) {
      return res.status(404).json({ error: "Service not found" });
    }

    serviceData.service.clearLogs();

    res.json({
      id: serviceId,
      message: "Logs cleared successfully"
    });
  });

  // ============================================
  // POST /api/seamless-speech/:id/manual-translate - ручной перевод
  // ============================================
  app.post("/api/seamless-speech/:id/manual-translate", async (req, res) => {
    try {
      const serviceId = req.params.id;
      const serviceData = seamlessSpeechServices.get(serviceId);

      if (!serviceData) {
        return res.status(404).json({ error: "Service not found" });
      }

      const { text } = req.body;

      if (!text) {
        return res.status(400).json({ error: "text is required" });
      }

      const result = await serviceData.service.manualTranslate(text);

      res.json({
        id: serviceId,
        result,
        message: "Manual translation completed"
      });

    } catch (error) {
      console.error("Error in manual translation:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // ============================================
  // GET /api/seamless-speech/:id/audio/:filename - получить аудио файл
  // ============================================
  app.get("/api/seamless-speech/:id/audio/:filename", (req, res) => {
    const serviceId = req.params.id;
    const filename = req.params.filename;
    const serviceData = seamlessSpeechServices.get(serviceId);

    if (!serviceData) {
      return res.status(404).json({ error: "Service not found" });
    }

    try {
      const audioPath = serviceData.service.getAudioFilePath(filename);
      res.sendFile(audioPath);
    } catch (error) {
      console.error("Error serving audio file:", error);
      res.status(404).json({ error: "Audio file not found" });
    }
  });

  console.log("SeamlessSpeech routes registered");
}
