import express from "express";

export function registerProjectRoutes(ctx) {
  const { app, projects, saveProjects } = ctx;

  // HTTP Audio Streaming endpoint
  app.get("/stream/:projectId", (req, res) => {
    const { projectId } = req.params;
    const project = projects.get(projectId);

    if (!project) {
      res.status(404).send("Project not found");
      return;
    }

    console.log(`HTTP stream client connected to project: ${project.name}`);

    // Set headers for audio streaming
    res.setHeader('Content-Type', 'audio/webm');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Create a unique listener ID
    const listenerId = Date.now() + Math.random();

    // Store the response object to send audio chunks
    project.listeners.set(listenerId, { type: 'http', res });

    req.on('close', () => {
      console.log(`HTTP stream client disconnected (ID: ${listenerId})`);
      project.listeners.delete(listenerId);
    });
  });

  // API для работы с проектами
  app.get("/api/projects", (_req, res) => {
    const projectsList = Array.from(projects.values()).map(p => ({
      id: p.id,
      name: p.name,
      createdAt: p.createdAt,
      isLive: p.broadcaster !== null,
      listenersCount: p.listeners.size
    }));
    res.json(projectsList);
  });

  app.post("/api/projects", express.json(), async (req, res) => {
    const { name } = req.body;
    if (!name || name.trim() === "") {
      res.status(400).json({ error: "Project name is required" });
      return;
    }

    const newProject = {
      id: "project-" + Date.now(),
      name: name.trim(),
      createdAt: new Date().toISOString(),
      broadcaster: null,
      listeners: new Map()
    };

    projects.set(newProject.id, newProject);
    await saveProjects();

    res.json({
      id: newProject.id,
      name: newProject.name,
      createdAt: newProject.createdAt
    });
  });

  app.delete("/api/projects/:id", async (req, res) => {
    const { id } = req.params;
    const project = projects.get(id);

    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    // Отключаем всех слушателей
    project.listeners.forEach(listener => {
      if (listener.readyState === 1) {
        listener.close();
      }
    });

    // Отключаем вещателя
    if (project.broadcaster && project.broadcaster.readyState === 1) {
      project.broadcaster.close();
    }

    projects.delete(id);
    await saveProjects();

    res.json({ success: true });
  });
}


