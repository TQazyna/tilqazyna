// Translation Speaker - Shadcn style integration

let ws = null;
let currentSpeakerId = null;
let speakers = new Map();

function connectWebSocket(speakerId) {
  if (ws) ws.close();
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = `${protocol}//${window.location.host}/speaker?id=${speakerId}`;
  ws = new WebSocket(wsUrl);
  currentSpeakerId = speakerId;
  ws.onopen = () => updateConnectionStatus(true);
  ws.onmessage = (event) => handleWebSocketMessage(JSON.parse(event.data));
  ws.onclose = () => {
    updateConnectionStatus(false);
    setTimeout(() => { if (currentSpeakerId) connectWebSocket(currentSpeakerId); }, 3000);
  };
  ws.onerror = () => updateConnectionStatus(false);
}

function handleWebSocketMessage(msg) {
  if (msg.type === 'initial_data') {
    updateStats(msg.data.stats);
    updateResults(msg.data.results);
    updateLogs(msg.data.logs);
  } else if (msg.type === 'audio_start') {
    speakerAudio.start(msg.data);
  } else if (msg.type === 'audio_chunk') {
    speakerAudio.appendChunk(msg.data);
  } else if (msg.type === 'audio_end') {
    speakerAudio.end(msg.data);
  } else if (msg.type === 'speech_completed') {
    addResult(msg.data);
    if (msg.data.stats) updateStats(msg.data.stats);
  } else if (msg.type === 'log') {
    addLog(msg.data);
  } else if (msg.type === 'stats_update') {
    updateStats(msg.data);
  }
}

function updateConnectionStatus(connected) {
  const indicator = document.getElementById('wsStatus');
  const text = document.getElementById('wsStatusText');
  indicator.className = connected ? 'status-indicator status-connected' : 'status-indicator status-disconnected';
  text.textContent = connected ? 'Подключено' : 'Отключено';
}

async function loadTranslators() {
  try {
    const response = await fetch('/api/translator');
    const data = await response.json();
    const select = document.getElementById('translatorSelect');
    select.innerHTML = '<option value="">Выберите translator</option>';
    data.forEach((translator) => {
      const option = document.createElement('option');
      option.value = translator.id;
      option.textContent = `${translator.id} (${translator.status})`;
      select.appendChild(option);
    });
  } catch {}
}

async function loadSpeakers() {
  try {
    const response = await fetch('/api/speaker');
    const data = await response.json();
    speakers.clear();
    data.forEach((speaker) => { speakers.set(speaker.id, speaker); });
    renderSpeakers();
  } catch {}
}

function renderSpeakers() {
  const container = document.getElementById('speakersList');
  if (speakers.size === 0) {
    container.innerHTML = `
      <div class="empty-state-small">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="18" stroke="currentColor" stroke-width="2" opacity="0.3"/>
          <path d="M24 16V24L30 28" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.3"/>
        </svg>
        <p>Нет активных speakers. Создайте новый speaker выше.</p>
      </div>`;
    return;
  }
  container.innerHTML = '';
  speakers.forEach((speaker, id) => {
    const speakerEl = document.createElement('div');
    speakerEl.className = 'speaker-item';
    speakerEl.innerHTML = `
      <div class="speaker-header">
        <div class="speaker-id">${id}</div>
        <span class="speaker-status ${speaker.isRunning ? 'status-running' : 'status-stopped'}">${speaker.isRunning ? 'Работает' : 'Остановлен'}</span>
      </div>
      <div class="speaker-info">
        <div><strong>Translator:</strong> ${speaker.translatorId}</div>
        <div><strong>Голос:</strong> ${speaker.voice}</div>
        <div><strong>Модель:</strong> ${speaker.model}</div>
        <div><strong>Скорость:</strong> ${speaker.speed}x</div>
        <div><strong>Озвучено:</strong> ${speaker.stats.speechCompleted}</div>
        <div><strong>В очереди:</strong> ${speaker.stats.queueLength}</div>
      </div>
      <div class="speaker-actions">
        <button class="btn btn-ghost btn-sm" onclick="viewSpeaker('${id}')">Открыть</button>
        ${speaker.isRunning ?
          `<button class="btn btn-ghost btn-sm btn-danger" onclick="stopSpeaker('${id}')">Остановить</button>` :
          `<button class="btn btn-ghost btn-sm" onclick="startSpeaker('${id}')">Запустить</button>`}
        <button class="btn btn-ghost btn-sm btn-danger" onclick="deleteSpeaker('${id}')">Удалить</button>
      </div>`;
    container.appendChild(speakerEl);
  });
}

async function createSpeaker() {
  const translatorId = document.getElementById('translatorSelect').value;
  const voice = document.getElementById('voiceSelect').value;
  const model = document.getElementById('modelSelect').value;
  const speed = parseFloat(document.getElementById('speedInput').value);
  const autoSpeak = document.getElementById('autoSpeakCheck').checked;
  if (!translatorId) { alert('Выберите translator'); return; }
  const btn = document.getElementById('createSpeakerBtn');
  btn.disabled = true; btn.textContent = 'Создание...';
  try {
    const response = await fetch('/api/speaker', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ translatorId, voice, model, speed, autoSpeak })
    });
    const data = await response.json();
    if (response.ok) { await loadSpeakers(); viewSpeaker(data.id); } else { alert(`Ошибка: ${data.error}`); }
  } catch { alert('Ошибка при создании speaker'); }
  finally { btn.disabled = false; btn.textContent = 'Создать Speaker'; }
}

function viewSpeaker(speakerId) {
  currentSpeakerId = speakerId;
  connectWebSocket(speakerId);
  document.getElementById('statsContainer').style.display = 'grid';
  document.getElementById('resultsSection').style.display = 'block';
  document.getElementById('logsSection').style.display = 'block';
  document.getElementById('statsContainer').scrollIntoView({ behavior: 'smooth' });
}

async function stopSpeaker(speakerId) { try { const r = await fetch(`/api/speaker/${speakerId}/stop`, { method: 'POST' }); if (r.ok) await loadSpeakers(); else alert(`Ошибка: ${(await r.json()).error}`); } catch { alert('Ошибка при остановке speaker'); } }
async function startSpeaker(speakerId) { try { const r = await fetch(`/api/speaker/${speakerId}/start`, { method: 'POST' }); if (r.ok) await loadSpeakers(); else alert(`Ошибка: ${(await r.json()).error}`); } catch { alert('Ошибка при запуске speaker'); } }
async function deleteSpeaker(speakerId) { if (!confirm('Удалить speaker?')) return; try { const r = await fetch(`/api/speaker/${speakerId}`, { method: 'DELETE' }); if (r.ok) { if (currentSpeakerId === speakerId) { if (ws) ws.close(); currentSpeakerId = null; document.getElementById('statsContainer').style.display = 'none'; document.getElementById('resultsSection').style.display = 'none'; document.getElementById('logsSection').style.display = 'none'; } await loadSpeakers(); } else alert(`Ошибка: ${(await r.json()).error}`); } catch { alert('Ошибка при удалении speaker'); } }

function updateStats(stats) {
  if (!stats) return;
  document.getElementById('statSpeechCompleted').textContent = stats.speechCompleted || 0;
  document.getElementById('statSpeechFailed').textContent = stats.speechFailed || 0;
  document.getElementById('statTotalCharacters').textContent = stats.totalCharacters || 0;
  document.getElementById('statQueueLength').textContent = stats.queueLength || 0;
}

function updateResults(results) {
  if (!results) return;
  const container = document.getElementById('resultsList');
  container.innerHTML = '';
  if (results.length === 0) {
    container.innerHTML = '<div class="empty-state-small"><p>Результатов пока нет</p></div>';
    return;
  }
  results.forEach((result) => addResultElement(container, result));
}

function addResult(result) {
  if (!result) return;
  const container = document.getElementById('resultsList');
  const empty = container.querySelector('.empty-state-small');
  if (empty) empty.remove();
  addResultElement(container, result, true);
}

function addResultElement(container, result, prepend = false) {
  const resultEl = document.createElement('div');
  resultEl.className = `result-item ${result.success ? '' : 'error'}`;
  const time = new Date(result.timestamp).toLocaleString('ru-RU');
  if (result.success) {
    resultEl.innerHTML = `
      <div class="result-header"><strong>${result.id}</strong><span class="result-time">${time}</span></div>
      <div class="result-text">${result.text}</div>
      <div class="audio-player">
        <audio controls>
          <source src="/api/speaker/${currentSpeakerId}/audio/${result.id}" type="audio/mpeg">
        </audio>
      </div>
      <div class="result-meta">
        <span><strong>Голос:</strong> ${result.voice}</span>
        <span><strong>Модель:</strong> ${result.model}</span>
        <span><strong>Скорость:</strong> ${result.speed}x</span>
        <span><strong>Размер:</strong> ${(result.audioSize / 1024).toFixed(1)} KB</span>
        <span><strong>Время:</strong> ${result.duration}ms</span>
      </div>`;
  } else {
    resultEl.innerHTML = `
      <div class="result-header"><strong>${result.id}</strong><span class="result-time">${time}</span></div>
      <div class="result-text">${result.text}</div>
      <div class="result-meta" style="color: hsl(var(--destructive)); margin-top: 10px;"><strong>Ошибка:</strong> ${result.error}</div>`;
  }
  if (prepend) container.insertBefore(resultEl, container.firstChild); else container.appendChild(resultEl);
}

function updateLogs(logs) {
  if (!logs) return;
  const container = document.getElementById('logsList');
  container.innerHTML = '';
  logs.forEach((log) => addLogElement(container, log));
}

function addLog(log) {
  if (!log) return;
  const container = document.getElementById('logsList');
  addLogElement(container, log, true);
  while (container.children.length > 100) container.removeChild(container.lastChild);
}

function addLogElement(container, log, prepend = false) {
  const logEl = document.createElement('div');
  const logType = getLogType(log.type);
  logEl.className = `log-item log-${logType}`;
  const time = new Date(log.timestamp).toLocaleString('ru-RU');
  logEl.textContent = `[${time}] ${log.message}${log.data ? ` | ${JSON.stringify(log.data)}` : ''}`;
  if (prepend) container.insertBefore(logEl, container.firstChild); else container.appendChild(logEl);
}

function getLogType(type) {
  if (type === 'error' || type === 'speech_error') return 'error';
  if (type === 'warning') return 'warning';
  if (type === 'speech_success' || type === 'translation_received') return 'success';
  return 'info';
}

window.addEventListener('load', () => { loadTranslators(); loadSpeakers(); updateConnectionStatus(false); });

// Simple audio chunk player (MP3 base64)
const speakerAudio = (() => {
  const audio = new Audio();
  audio.autoplay = true;
  let currentSpeechId = null;
  let collecting = false;
  let buffers = [];
  function start(meta) { currentSpeechId = meta.speechId; buffers = []; collecting = true; }
  function appendChunk(chunk) {
    if (!collecting || chunk.speechId !== currentSpeechId) return;
    try {
      const binary = atob(chunk.chunkBase64);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
      buffers.push(bytes);
    } catch {}
  }
  function end(info) {
    if (!collecting || info.speechId !== currentSpeechId) return;
    collecting = false;
    const totalLen = buffers.reduce((acc, b) => acc + b.byteLength, 0);
    const out = new Uint8Array(totalLen);
    let offset = 0; buffers.forEach((b) => { out.set(b, offset); offset += b.byteLength; });
    const blob = new Blob([out], { type: 'audio/mpeg' });
    const url = URL.createObjectURL(blob);
    audio.src = url; audio.play().catch(() => {});
    buffers = [];
  }
  return { start, appendChunk, end };
})();


