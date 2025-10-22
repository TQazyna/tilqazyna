import express from "express";

export function registerWorkflowRoutes(ctx) {
  const { app, OPENAI_API_KEY, RTMPRealtimeRelay, TranscriptionNormalizer, TranscriptionTranslator, TranslationSpeaker, rtmpRelays, normalizers, translators, speakers, broadcastToTranscriptionClients, broadcastToNormalizerClients, broadcastToTranslatorClients, broadcastToSpeakerClients } = ctx;

  app.post("/api/workflow/start", express.json(), async (req, res) => {
    try {
      const { rtmpUrl, projectId, normalizerInterval, speakerSpeed, speakerModel } = req.body;
      const config = {
        rtmpUrl: rtmpUrl || "rtmp://talksync.tilqazyna.kz:1935/steppe-games",
        projectId: projectId || "steppe-games",
        model: "gpt-realtime",
        voice: "verse",
        normalizerInterval: normalizerInterval || 10000,
        speakerSpeed: speakerSpeed || 1.3,
        speakerModel: speakerModel || "tts-1-hd"
      };
      if (!OPENAI_API_KEY) { res.status(500).json({ error: "OpenAI API key is not configured" }); return; }

      const workflowId = `workflow-${Date.now()}`;
      const results = { workflowId, timestamp: new Date().toISOString(), config, steps: {} };

      // Step 1: RTMP Relay
      const relayId = "relay-" + Date.now();
      const relay = new RTMPRealtimeRelay({ apiKey: OPENAI_API_KEY, rtmpUrl: config.rtmpUrl, model: config.model, voice: config.voice, instructions: "Ты синхронный переводчик с казахского на русский язык. Слушай казахскую речь и сразу озвучивай её дословный перевод на русском языке. Говори четко и естественно." });
      relay.on("started", () => { rtmpRelays.get(relayId).status = "running"; });
      relay.on("stopped", () => { rtmpRelays.get(relayId).status = "stopped"; });
      relay.on("error", (error) => { rtmpRelays.get(relayId).status = "error"; rtmpRelays.get(relayId).lastError = error.message; });
      relay.on("transcription_completed", (t) => { broadcastToTranscriptionClients(relayId, { type: "transcription", data: t }); });
      relay.on("log", (log) => { broadcastToTranscriptionClients(relayId, { type: "log", data: log }); });
      relay.on("audio_chunk", (a) => { broadcastToTranscriptionClients(relayId, { type: "audio_chunk", data: a }); });
      relay.on("audio_output", (a) => { broadcastToTranscriptionClients(relayId, { type: "audio_output", data: a }); });
      relay.on("gpt_transcript", (tr) => { broadcastToTranscriptionClients(relayId, { type: "gpt_transcript", data: tr }); });
      rtmpRelays.set(relayId, { relay, projectId: config.projectId, createdAt: new Date().toISOString(), status: "created", rtmpUrl: config.rtmpUrl, model: config.model, voice: config.voice, workflowId });
      await relay.start();
      results.steps.relay = { id: relayId, status: "running" };
      await new Promise(r => setTimeout(r, 2000));

      // Step 2: Normalizer
      const normalizerId = "normalizer-" + Date.now();
      const normalizer = new TranscriptionNormalizer({ apiKey: OPENAI_API_KEY, relayId: relayId, relay: relay, model: "gpt-4o", batchSize: 10, autoNormalize: true, normalizeInterval: config.normalizerInterval });
      normalizer.on("started", () => { normalizers.get(normalizerId).status = "running"; });
      normalizer.on("stopped", () => { normalizers.get(normalizerId).status = "stopped"; });
      normalizer.on("error", (error) => { normalizers.get(normalizerId).status = "error"; normalizers.get(normalizerId).lastError = error.message; });
      normalizer.on("transcription_received", (t) => { broadcastToNormalizerClients(normalizerId, { type: "transcription_received", data: t }); });
      normalizer.on("normalization_completed", (r) => { broadcastToNormalizerClients(normalizerId, { type: "normalization_completed", data: r }); });
      normalizer.on("normalization_failed", (r) => { broadcastToNormalizerClients(normalizerId, { type: "normalization_failed", data: r }); });
      normalizer.on("log", (log) => { broadcastToNormalizerClients(normalizerId, { type: "log", data: log }); });
      normalizers.set(normalizerId, { normalizer, relayId, createdAt: new Date().toISOString(), status: "created", workflowId });
      await normalizer.start();
      results.steps.normalizer = { id: normalizerId, status: "running" };
      await new Promise(r => setTimeout(r, 1000));

      // Step 3: Translator
      const translatorId = "translator-" + Date.now();
      const translator = new TranscriptionTranslator({ apiKey: OPENAI_API_KEY, normalizerId: normalizerId, normalizer: normalizer, model: "gpt-4o", autoTranslate: true, targetLanguage: "russian", sourceLanguage: "kazakh" });
      translator.on("started", () => { translators.get(translatorId).status = "running"; });
      translator.on("stopped", () => { translators.get(translatorId).status = "stopped"; });
      translator.on("error", (error) => { translators.get(translatorId).status = "error"; translators.get(translatorId).lastError = error.message; });
      translator.on("normalization_received", (n) => { broadcastToTranslatorClients(translatorId, { type: "normalization_received", data: n }); });
      translator.on("translation_completed", (r) => { broadcastToTranslatorClients(translatorId, { type: "translation_completed", data: r }); });
      translator.on("translation_failed", (r) => { broadcastToTranslatorClients(translatorId, { type: "translation_failed", data: r }); });
      translator.on("log", (l) => { broadcastToTranslatorClients(translatorId, { type: "log", data: l }); });
      translators.set(translatorId, { translator, normalizerId, createdAt: new Date().toISOString(), status: "created", workflowId });
      await translator.start();
      results.steps.translator = { id: translatorId, status: "running" };
      await new Promise(r => setTimeout(r, 1000));

      // Step 4: Speaker
      const speakerId = "speaker-" + Date.now();
      const speaker = new TranslationSpeaker({ apiKey: OPENAI_API_KEY, translatorId: translatorId, translator: translator, model: config.speakerModel, voice: "alloy", speed: config.speakerSpeed, autoSpeak: true });
      speaker.on("started", () => { speakers.get(speakerId).status = "running"; });
      speaker.on("stopped", () => { speakers.get(speakerId).status = "stopped"; });
      speaker.on("error", (error) => { speakers.get(speakerId).status = "error"; speakers.get(speakerId).lastError = error.message; });
      speaker.on("translation_received", (t) => { broadcastToSpeakerClients(speakerId, { type: "translation_received", data: t }); });
      speaker.on("speech_completed", (r) => { broadcastToSpeakerClients(speakerId, { type: "speech_completed", data: r }); });
      speaker.on("speech_failed", (r) => { broadcastToSpeakerClients(speakerId, { type: "speech_failed", data: r }); });
      speaker.on("log", (l) => { broadcastToSpeakerClients(speakerId, { type: "log", data: l }); });
      speaker.on("audio_start", (m) => { broadcastToSpeakerClients(speakerId, { type: "audio_start", data: m }); });
      speaker.on("audio_chunk", (c) => { broadcastToSpeakerClients(speakerId, { type: "audio_chunk", data: c }); });
      speaker.on("audio_end", (i) => { broadcastToSpeakerClients(speakerId, { type: "audio_end", data: i }); });
      speakers.set(speakerId, { speaker, translatorId, createdAt: new Date().toISOString(), status: "created", workflowId });
      await speaker.start();
      results.steps.speaker = { id: speakerId, status: "running" };

      res.json({ success: true, message: "Workflow created successfully", workflow: results });
    } catch (error) {
      console.error("Error creating workflow:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/workflow/status", (_req, res) => {
    const workflows = [];
    rtmpRelays.forEach((data, id) => { if (data.workflowId) { let w = workflows.find(w => w.id === data.workflowId); if (!w) { w = { id: data.workflowId, createdAt: data.createdAt, components: {} }; workflows.push(w); } w.components.relay = { id, status: data.status, rtmpUrl: data.rtmpUrl }; } });
    normalizers.forEach((data, id) => { if (data.workflowId) { let w = workflows.find(w => w.id === data.workflowId); if (!w) { w = { id: data.workflowId, createdAt: data.createdAt, components: {} }; workflows.push(w); } w.components.normalizer = { id, status: data.status, stats: data.normalizer.getStats() }; } });
    translators.forEach((data, id) => { if (data.workflowId) { let w = workflows.find(w => w.id === data.workflowId); if (!w) { w = { id: data.workflowId, createdAt: data.createdAt, components: {} }; workflows.push(w); } w.components.translator = { id, status: data.status, stats: data.translator.getStats() }; } });
    speakers.forEach((data, id) => { if (data.workflowId) { let w = workflows.find(w => w.id === data.workflowId); if (!w) { w = { id: data.workflowId, createdAt: data.createdAt, components: {} }; workflows.push(w); } w.components.speaker = { id, status: data.status, stats: data.speaker.getStats() }; } });
    res.json({ workflows });
  });

  app.delete("/api/workflow/:workflowId", (req, res) => {
    const { workflowId } = req.params;
    let stoppedComponents = 0;
    try {
      speakers.forEach((data, id) => { if (data.workflowId === workflowId) { data.speaker.stop(); speakers.delete(id); stoppedComponents++; } });
      translators.forEach((data, id) => { if (data.workflowId === workflowId) { data.translator.stop(); translators.delete(id); stoppedComponents++; } });
      normalizers.forEach((data, id) => { if (data.workflowId === workflowId) { data.normalizer.stop(); normalizers.delete(id); stoppedComponents++; } });
      rtmpRelays.forEach((data, id) => { if (data.workflowId === workflowId) { data.relay.stop(); rtmpRelays.delete(id); stoppedComponents++; } });
      res.json({ success: true, message: `Workflow stopped, ${stoppedComponents} components removed` });
    } catch (error) {
      console.error("Error stopping workflow:", error);
      res.status(500).json({ error: error.message });
    }
  });
}


