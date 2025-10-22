export function registerMediaMtxRoutes(ctx) {
  const { app, projects, mediamtxLogs, maxLogs } = ctx;

  // MediaMTX webhook endpoint (GET requests)
  app.get("/api/mediamtx/hook", (req, res) => {
    const {
      MTX_PATH,
      MTX_SOURCE_TYPE,
      MTX_SOURCE_ID,
      MTX_CONN_TYPE,
      MTX_CONN_ID,
      MTX_READER_TYPE,
      MTX_READER_ID,
      MTX_SEGMENT_PATH,
      MTX_SEGMENT_DURATION
    } = process.env;

    const { event } = req.query;

    // Логируем все полученные переменные окружения и query параметры для отладки
    console.log("MediaMTX Hook called with:", {
      query: req.query,
      env: {
        MTX_PATH,
        MTX_SOURCE_TYPE,
        MTX_SOURCE_ID,
        MTX_CONN_TYPE,
        MTX_CONN_ID,
        MTX_READER_TYPE,
        MTX_READER_ID,
        MTX_SEGMENT_PATH,
        MTX_SEGMENT_DURATION
      }
    });

    let logMessage = '';
    let logType = 'info';

    // Обрабатываем события на основе event параметра (точно как в server.js)
    switch (event) {
      case 'connect':
        logMessage = `Клиент подключился к серверу`;
        logType = 'connect';
        break;
      case 'disconnect':
        logMessage = `Клиент отключился от сервера`;
        logType = 'disconnect';
        break;
      case 'stream_ready':
        logMessage = `Трансляция готова к просмотру`;
        logType = 'stream';
        break;
      case 'stream_not_ready':
        logMessage = `Трансляция недоступна`;
        logType = 'stream';
        break;
      case 'read_start':
        logMessage = `Клиент начал просмотр трансляции`;
        logType = 'connect';
        break;
      case 'read_stop':
        logMessage = `Клиент остановил просмотр трансляции`;
        logType = 'disconnect';
        break;
      case 'record_create':
        logMessage = `Создан сегмент записи`;
        logType = 'record';
        break;
      case 'record_complete':
        logMessage = `Завершен сегмент записи`;
        logType = 'record';
        break;
      default:
        logMessage = `Неизвестное событие: ${event}`;
        logType = 'info';
    }

    // Добавляем лог в хранилище
    if (logMessage) {
      const logEntry = {
        timestamp: new Date().toISOString(),
        message: logMessage,
        type: logType,
        path: MTX_PATH,
        sourceType: MTX_SOURCE_TYPE,
        connType: MTX_CONN_TYPE,
        event: event
      };
      mediamtxLogs.push(logEntry);

      // Ограничиваем размер массива логов
      if (mediamtxLogs.length > maxLogs) {
        mediamtxLogs.shift();
      }

      console.log(`📋 ${logMessage}`);
    }

    // Возвращаем простой ответ для MediaMTX
    res.status(200).send('OK');
  });

  // Status endpoint для мониторинга
  app.get("/api/mediamtx/status", (_req, res) => {
    try {
      // Подсчитываем активные трансляции
      const activeStreams = projects.size; // Используем количество проектов как индикатор активных трансляций
      const connectedClients = Array.from(projects.values()).reduce((total, project) => {
        return total + project.listeners.size;
      }, 0);

      // Последние события за сегодня
      const today = new Date().toDateString();
      const eventsToday = mediamtxLogs.filter(log => {
        return new Date(log.timestamp).toDateString() === today;
      }).length;

      // Последнее событие
      const lastEvent = mediamtxLogs.length > 0
        ? new Date(mediamtxLogs[mediamtxLogs.length - 1].timestamp).toLocaleString('ru-RU')
        : null;

      res.json({
        mediamtx: {
          running: true // Предполагаем, что если сервер отвечает, то MediaMTX работает
        },
        livetranslate: {
          running: true, // Сервер отвечает, значит работает
          uptime: process.uptime()
        },
        metrics: {
          activeStreams,
          connectedClients,
          eventsToday,
          lastEvent
        },
        logs: mediamtxLogs.slice(-20) // Последние 20 логов
      });
    } catch (error) {
      console.error('Ошибка получения статуса:', error);
      res.status(500).json({ error: 'Ошибка получения статуса' });
    }
  });
}


