      const connectBtn = document.getElementById("connect");
      const statusEl = document.getElementById("status");
      const feedback = document.getElementById("feedback");
      const audioPlayer = document.getElementById("audioPlayer");
      // Убраны элементы выбора языка из интерфейса

      let ws = null;
      let isConnected = false;
      let mediaSource = null;
      let sourceBuffer = null;
      let audioQueue = [];
      let isSourceBufferReady = false;
      let currentLang = 'ru';

      // Объект переводов для интерфейса (только русский)
      const translations = {
        ru: {
          title: "Слушать перевод",
          subtitle: "Начните слушать синхронный перевод",
          translationLanguage: "Язык перевода",
          connect: "Подключиться",
          disconnect: "Отключиться",
          connecting: "Подключаемся...",
          statusLabel: "Статус подключения",
          waiting: "Ожидание",
          connectingStatus: "Подключаемся",
          connected: "Подключено",
          connectionError: "Ошибка подключения",
          connectionFailed: "Не удалось подключиться",
          audioTitle: "Аудио перевода",
          audioHint: "Перевод воспроизводится автоматически при подключении",
          listeningMessage: "Слушаем перевод в реальном времени",
          projectDefault: "Подключение к проекту по умолчанию: Steppe Games",
          projectConnection: "Подключение к проекту:",
          languageChangeWarning: "Для смены языка отключитесь от трансляции",
          audioInitError: "Ошибка инициализации аудио",
          mediaSourceClosed: "MediaSource закрыт, очищаем очередь"
        }
      };

      function log(message) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ${message}`);
      }

      // Инициализация интерфейса (только русский)
      function updateInterface() {
        currentLang = 'ru';
        const t = translations[currentLang];

        // Обновляем заголовок и подзаголовок
        document.querySelector('h1').textContent = t.title;
        document.querySelector('.subtitle').textContent = t.subtitle;

        // Блоки выбора языка удалены, ничего не обновляем

        // Обновляем кнопку подключения (если не в процессе подключения)
        if (!connectBtn.classList.contains('connecting') && !isConnected) {
          connectBtn.textContent = t.connect;
        }

        // Обновляем лейбл статуса
        document.querySelector('.status__label').textContent = t.statusLabel;

        // Обновляем заголовок аудио секции
        document.querySelector('#audio-output-title').textContent = t.audioTitle;

        // Обновляем подсказку аудио
        document.querySelector('.hint').textContent = t.audioHint;

        // Обновляем атрибут lang у html элемента
        document.documentElement.setAttribute('lang', currentLang);

        // Вкладки и селектор языка отсутствуют
      }

      // Переключение языка не требуется (только русский)

      function appendAudioChunk() {
        if (!sourceBuffer || sourceBuffer.updating || audioQueue.length === 0) {
          return;
        }

        // Проверяем, что MediaSource всё ещё открыт
        if (!mediaSource || mediaSource.readyState !== 'open') {
          log(translations[currentLang].mediaSourceClosed);
          audioQueue = [];
          return;
        }

        const chunk = audioQueue.shift();
        try {
          sourceBuffer.appendBuffer(chunk);
        } catch (e) {
          log(`Ошибка добавления аудио: ${e.message}`);
          // Очищаем очередь при ошибке
          audioQueue = [];
        }
      }

      function setStatus(statusKey, tone = "idle") {
        const t = translations[currentLang];
        let text = t.waiting;

        switch (statusKey) {
          case "connecting":
            text = t.connectingStatus;
            break;
          case "connected":
            text = t.connected;
            break;
          case "error":
            text = t.connectionError;
            break;
          case "failed":
            text = t.connectionFailed;
            break;
          default:
            text = t.waiting;
        }

        statusEl.innerHTML = "";
        const dot = document.createElement("span");
        dot.className = "status__dot";
        dot.setAttribute("aria-hidden", "true");

        if (tone === "busy") dot.classList.add("status__dot--busy");
        if (tone === "ready") dot.classList.add("status__dot--ready");
        if (tone === "error") dot.classList.add("status__dot--error");

        const capitalizedText = text.charAt(0).toUpperCase() + text.slice(1);
        statusEl.append(dot, document.createTextNode(" " + capitalizedText));
      }

      function showMessage(messageKey = "", tone = "info") {
        if (!messageKey) {
          feedback.style.display = "none";
          feedback.textContent = "";
          return;
        }

        const t = translations[currentLang];
        let text = "";

        switch (messageKey) {
          case "listening":
            text = t.listeningMessage;
            break;
          case "projectDefault":
            text = t.projectDefault;
            break;
          case "projectConnection":
            const projectId = window.location.search.includes('project=') ?
              new URLSearchParams(window.location.search).get('project') : 'steppe-games';
            text = `${t.projectConnection} ${projectId}`;
            break;
          case "languageChangeWarning":
            text = t.languageChangeWarning;
            break;
          case "audioInitError":
            text = t.audioInitError;
            break;
          case "connectionError":
            text = t.connectionError;
            break;
          case "connectionFailed":
            text = t.connectionFailed;
            break;
          default:
            text = messageKey;
        }

        feedback.className = `alert alert--${tone}`;
        feedback.textContent = text;
        feedback.style.display = "block";
      }

      function disconnect() {
        log("Отключение от трансляции");
        if (ws) {
          ws.close();
          ws = null;
        }

        if (mediaSource && mediaSource.readyState === 'open') {
          mediaSource.endOfStream();
        }

        isConnected = false;
        isSourceBufferReady = false;
        audioQueue = [];
        mediaSource = null;
        sourceBuffer = null;
        audioPlayer.src = "";

        setStatus("waiting", "idle");
        showMessage("", "info");
        connectBtn.textContent = translations[currentLang].connect;
        connectBtn.disabled = false;
        connectBtn.classList.remove("disconnect", "connecting");
        connectBtn.setAttribute("aria-label", translations[currentLang].connect);
      }

      function connect() {
        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('project') || 'steppe-games';

        const selectedLanguage = 'ru';
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const wsUrl = `${protocol}//${window.location.host}/listen?project=${projectId}&lang=${selectedLanguage}`;

        log(`Подключение к трансляции на языке: ${selectedLanguage}`);

        const t = translations[currentLang];
        connectBtn.disabled = true;
        connectBtn.classList.add("connecting");
        connectBtn.textContent = t.connecting;
        setStatus("connecting", "busy");

        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          log("WebSocket соединение установлено");

          // Инициализируем MediaSource
          mediaSource = new MediaSource();
          audioPlayer.src = URL.createObjectURL(mediaSource);

          mediaSource.addEventListener('sourceopen', () => {
            log("MediaSource открыт");
            try {
              sourceBuffer = mediaSource.addSourceBuffer('audio/webm; codecs="opus"');

              sourceBuffer.addEventListener('updateend', () => {
                appendAudioChunk();
              });

              isSourceBufferReady = true;
              log(`SourceBuffer готов, начинаем воспроизведение ${audioQueue.length} накопленных чанков`);

              // Начинаем воспроизводить накопленные данные
              if (audioQueue.length > 0) {
                appendAudioChunk();
              }
            } catch (e) {
              log(`Ошибка создания SourceBuffer: ${e.message}`);
              showMessage("audioInitError", "error");
            }
          });

          setStatus("connected", "ready");
          showMessage("listening", "info");
          connectBtn.textContent = t.disconnect;
          connectBtn.disabled = false;
          connectBtn.classList.remove("connecting");
          connectBtn.classList.add("disconnect");
          connectBtn.setAttribute("aria-label", t.disconnect);
          isConnected = true;
        };

        ws.onmessage = async (event) => {
          // Получаем аудио данные как Blob
          if (event.data instanceof Blob) {
            const arrayBuffer = await event.data.arrayBuffer();

            // Добавляем в очередь независимо от готовности SourceBuffer
            audioQueue.push(arrayBuffer);

            // Пытаемся воспроизвести, если SourceBuffer готов
            if (isSourceBufferReady && sourceBuffer && mediaSource?.readyState === 'open') {
              appendAudioChunk();
            } else {
              log(`Данные в очереди: ${audioQueue.length}, SourceBuffer готов: ${isSourceBufferReady}`);
            }
          }
        };

        ws.onerror = (error) => {
          log(`WebSocket ошибка: ${error}`);
          setStatus("error", "error");
          showMessage("connectionError", "error");
        };

        ws.onclose = () => {
          log("WebSocket соединение закрыто");
          if (isConnected) {
            disconnect();
          } else {
            setStatus("failed", "error");
            showMessage("connectionFailed", "error");
            connectBtn.textContent = t.connect;
            connectBtn.disabled = false;
            connectBtn.classList.remove("connecting");
          }
        };
      }

      connectBtn.addEventListener("click", () => {
        if (isConnected) {
          disconnect();
        } else {
          connect();
        }
      });

      // Элементы выбора языка удалены, обработчики не требуются

      // Автоматическое подключение к проекту по умолчанию при загрузке страницы
      window.addEventListener('DOMContentLoaded', () => {
        // Инициализируем интерфейс (русский по умолчанию)
        updateInterface();

        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('project');

        // Показываем информацию о проекте в статусе
        if (projectId) {
          showMessage("projectConnection", "info");
        } else {
          showMessage("projectDefault", "info");
        }

        // Автовещание TTS (Speaker): как только включится speaker, начинаем играть звук без лишней информации
        startAutoSpeakerListen();
      });

      // ==========================
      // Автопрослушивание Speaker
      // ==========================
      let speakerWs = null;
      let currentSpeakerId = null;
      const speakerAudio = (() => {
        const audio = document.getElementById('audioPlayer');
        let activeSpeechId = null;
        let collecting = false;
        let buffers = [];

        function start(meta) {
          activeSpeechId = meta && meta.speechId ? meta.speechId : null;
          buffers = [];
          collecting = true;
        }

        function appendChunk(data) {
          if (!collecting) return;
          if (activeSpeechId && data.speechId && data.speechId !== activeSpeechId) return;
          try {
            const binary = atob(data.chunkBase64);
            const len = binary.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
            buffers.push(bytes);
          } catch (e) {
            // Игнорируем ошибку декодирования
          }
        }

        function end(info) {
          if (!collecting) return;
          if (activeSpeechId && info.speechId && info.speechId !== activeSpeechId) return;
          collecting = false;
          const totalLen = buffers.reduce((acc, b) => acc + b.byteLength, 0);
          const out = new Uint8Array(totalLen);
          let offset = 0;
          buffers.forEach(b => { out.set(b, offset); offset += b.byteLength; });
          const blob = new Blob([out], { type: 'audio/mpeg' });
          const url = URL.createObjectURL(blob);
          audio.src = url;
          audio.play().catch(() => {});
          buffers = [];
        }

        return { start, appendChunk, end };
      })();

      async function connectSpeakerWebSocket(id) {
        if (speakerWs) {
          try { speakerWs.close(); } catch (_) {}
          speakerWs = null;
        }
        currentSpeakerId = id;
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/speaker?id=${id}`;
        speakerWs = new WebSocket(wsUrl);
        speakerWs.onmessage = (evt) => {
          try {
            const msg = JSON.parse(evt.data);
            if (msg.type === 'audio_start') speakerAudio.start(msg.data);
            else if (msg.type === 'audio_chunk') speakerAudio.appendChunk(msg.data);
            else if (msg.type === 'audio_end') speakerAudio.end(msg.data);
          } catch (_) {}
        };
        speakerWs.onclose = () => {
          speakerWs = null;
        };
        speakerWs.onerror = () => {
          try { speakerWs.close(); } catch (_) {}
          speakerWs = null;
        };
      }

      async function startAutoSpeakerListen() {
        // Периодически ищем активный speaker и подключаемся к нему
        async function tick() {
          try {
            const resp = await fetch('/api/speaker');
            if (!resp.ok) return;
            const list = await resp.json();
            const running = list.find(s => s.isRunning === true) || list[0];
            if (running && running.id && running.id !== currentSpeakerId) {
              await connectSpeakerWebSocket(running.id);
            }
          } catch (_) {}
        }
        // Первый запуск сразу
        tick();
        // Затем каждые 3 секунды
        setInterval(tick, 3000);
      }
