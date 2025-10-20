// Transcription Normalizer - Shadcn style integration

const app = {
  normalizers: [],
  currentNormalizerId: null,
  ws: null,
  data: { transcriptions: [], results: [], logs: [], stats: null },

  async init() {
    await this.loadRelays();
    await this.loadNormalizers();
    this.setupEvents();

    const savedPrompt = localStorage.getItem('normalizer_prompt');
    if (savedPrompt) {
      document.getElementById('promptInput').value = savedPrompt;
    }

    setInterval(() => this.loadNormalizers(), 5000);
  },

  setupEvents() {
    const headerBtn = document.getElementById('createNormalizerBtnHeader');
    if (headerBtn) headerBtn.onclick = () => this.create();

    const createBtn = document.getElementById('createNormalizerBtn');
    if (createBtn) createBtn.onclick = () => this.create();

    const promptInput = document.getElementById('promptInput');
    if (promptInput) {
      promptInput.onchange = () => {
        localStorage.setItem('normalizer_prompt', promptInput.value);
      };
    }
  },

  async loadRelays() {
    try {
      const relays = await (await fetch('/api/rtmp-relay')).json();
      const relaySelect = document.getElementById('relaySelect');
      if (!relaySelect) return;
      relaySelect.innerHTML = '<option value="">Выберите ретранслятор...</option>';
      relays.forEach((relay) => {
        const option = document.createElement('option');
        option.value = relay.id;
        option.textContent = `${relay.id} (${relay.status})`;
        relaySelect.appendChild(option);
      });
    } catch (err) {
      console.error('Load relays error:', err);
    }
  },

  async loadNormalizers() {
    try {
      const resp = await fetch('/api/normalizer');
      this.normalizers = await resp.json();
      this.renderNormalizers();
    } catch (err) {
      console.error('Load normalizers error:', err);
    }
  },

  renderNormalizers() {
    const list = document.getElementById('normalizersList');
    if (!list) return;

    if (this.normalizers.length === 0) {
      list.innerHTML = `
        <div class="empty-state-small">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="18" stroke="currentColor" stroke-width="2" opacity="0.3"/>
            <path d="M24 16V24L30 28" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.3"/>
          </svg>
          <p>Нет</p>
        </div>`;
      return;
    }

    list.innerHTML = this.normalizers.map((norm) => `
      <div class="normalizer-item ${norm.id === this.currentNormalizerId ? 'active' : ''}">
        <div class="normalizer-info">
          <div class="normalizer-id">${norm.id}</div>
          <div class="normalizer-stats">
            Relay: ${norm.relayId} | ${norm.status} | Буфер: ${norm.stats.transcriptionsInBuffer} | OK: ${norm.stats.normalizationsCompleted} | Err: ${norm.stats.normalizationsFailed}
          </div>
        </div>
        <div class="normalizer-actions">
          <button class="btn btn-ghost btn-sm" onclick="app.select('${norm.id}')">Открыть</button>
          <button class="btn btn-ghost btn-sm" onclick="app.normalize('${norm.id}')">Запустить</button>
          <button class="btn btn-ghost btn-sm btn-danger" onclick="app.delete('${norm.id}')">Удалить</button>
        </div>
      </div>
    `).join('');
  },

  async create() {
    const relayId = document.getElementById('relaySelect').value;
    if (!relayId) {
      alert('Выберите ретранслятор');
      return;
    }
    try {
      const resp = await fetch('/api/normalizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          relayId,
          model: 'gpt-4o',
          prompt: document.getElementById('promptInput').value,
          batchSize: parseInt(document.getElementById('batchSizeInput').value, 10),
          autoNormalize: document.getElementById('autoNormalizeCheck').checked,
          normalizeInterval: 1000 * parseInt(document.getElementById('intervalInput').value, 10),
        }),
      });
      if (!resp.ok) {
        throw new Error((await resp.json()).error);
      }
      const newNorm = await resp.json();
      await this.loadNormalizers();
      this.select(newNorm.id);
    } catch (err) {
      alert('Ошибка: ' + err.message);
    }
  },

  async delete(id) {
    if (!confirm('Удалить?')) return;
    try {
      await fetch(`/api/normalizer/${id}`, { method: 'DELETE' });
      if (this.currentNormalizerId === id) {
        this.disconnect();
        this.currentNormalizerId = null;
        document.getElementById('stats').style.display = 'none';
        document.getElementById('sectionsContainer').style.display = 'none';
        document.getElementById('logsSection').style.display = 'none';
      }
      await this.loadNormalizers();
    } catch (err) {
      alert('Ошибка удаления');
    }
  },

  async normalize(id) {
    try {
      await fetch(`/api/normalizer/${id}/normalize`, { method: 'POST' });
    } catch (err) {
      alert('Ошибка нормализации');
    }
  },

  select(id) {
    this.currentNormalizerId = id;
    this.renderNormalizers();
    this.connect();
    document.getElementById('stats').style.display = 'grid';
    document.getElementById('sectionsContainer').style.display = 'grid';
    document.getElementById('logsSection').style.display = 'block';
  },

  connect() {
    this.disconnect();
    if (!this.currentNormalizerId) return;
    this.ws = new WebSocket(`${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${location.host}/normalizer?id=${this.currentNormalizerId}`);
    this.ws.onopen = () => (document.getElementById('connectionStatus').textContent = 'Подключено');
    this.ws.onmessage = (evt) => this.handleMsg(JSON.parse(evt.data));
    this.ws.onclose = () => (document.getElementById('connectionStatus').textContent = 'Отключено');
  },

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  },

  handleMsg(msg) {
    switch (msg.type) {
      case 'initial_data':
        this.data.transcriptions = msg.data.transcriptions || [];
        this.data.results = msg.data.results || [];
        this.data.logs = msg.data.logs || [];
        this.data.stats = msg.data.stats;
        this.renderAll();
        break;
      case 'transcription_received':
        this.data.transcriptions.unshift(msg.data);
        if (this.data.transcriptions.length > 10) this.data.transcriptions = this.data.transcriptions.slice(0, 10);
        this.renderTranscriptions();
        break;
      case 'normalization_completed':
      case 'normalization_failed':
        this.data.results.unshift(msg.data);
        if (this.data.results.length > 20) this.data.results = this.data.results.slice(0, 20);
        this.renderResults();
        this.loadNormalizers();
        break;
      case 'log':
        this.data.logs.unshift(msg.data);
        if (this.data.logs.length > 50) this.data.logs = this.data.logs.slice(0, 50);
        this.renderLogs();
        break;
    }
    if (msg.data && msg.data.stats) {
      this.data.stats = msg.data.stats;
      this.updateStats();
    }
  },

  renderAll() {
    this.renderTranscriptions();
    this.renderResults();
    this.renderLogs();
    this.updateStats();
  },

  renderTranscriptions() {
    const list = document.getElementById('transcriptionList');
    if (!list) return;
    if (this.data.transcriptions.length === 0) {
      list.innerHTML = `
        <div class="empty-state-small">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="18" stroke="currentColor" stroke-width="2" opacity="0.3"/>
            <path d="M24 16V24L30 28" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.3"/>
          </svg>
          <p>Нет</p>
        </div>`;
      return;
    }
    list.innerHTML = this.data.transcriptions.map((tr, idx) => `
      <div class="transcription-item ${idx === 0 ? 'latest' : ''}">
        <div class="transcription-time">${new Date(tr.timestamp).toLocaleString('ru-RU')}</div>
        <div class="transcription-text">${tr.transcript}</div>
      </div>
    `).join('');
  },

  renderResults() {
    const list = document.getElementById('normalizedList');
    if (!list) return;
    if (this.data.results.length === 0) {
      list.innerHTML = `
        <div class="empty-state-small">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="18" stroke="currentColor" stroke-width="2" opacity="0.3"/>
            <path d="M24 16V24L30 28" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.3"/>
          </svg>
          <p>Нет</p>
        </div>`;
      return;
    }
    list.innerHTML = this.data.results.map((res) => `
      <div class="normalized-item">
        <div class="normalized-header">
          <div class="normalized-time">${new Date(res.timestamp).toLocaleString('ru-RU')}</div>
          <div class="normalized-status ${res.success ? 'success' : 'error'}">${res.success ? 'OK' : 'ERR'}</div>
        </div>
        ${res.success
          ? `<div class="normalized-text">${res.normalizedText}</div>
             <div class="normalized-meta">Токенов: ${res.tokensUsed || 0} | ${res.duration || 0}мс | Текстов: ${res.originalTexts ? res.originalTexts.length : 1}${typeof res.contextNormalizedTexts !== 'undefined' ? ` | Контекст: ${res.contextNormalizedTexts.length}` : ''}</div>`
          : `<div class="normalized-error">${res.error}</div>`}
      </div>
    `).join('');
  },

  renderLogs() {
    const list = document.getElementById('logsList');
    if (!list) return;
    if (this.data.logs.length === 0) {
      list.innerHTML = `
        <div class="empty-state-small">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="18" stroke="currentColor" stroke-width="2" opacity="0.3"/>
            <path d="M24 16V24L30 28" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.3"/>
          </svg>
          <p>Нет</p>
        </div>`;
      return;
    }
    list.innerHTML = this.data.logs.map((log) => `
      <div class="log-item">
        <span class="log-timestamp">${new Date(log.timestamp).toLocaleString('ru-RU')}</span>
        <span class="log-type">[${log.type}]</span>
        <span class="log-message">${log.message}</span>
      </div>
    `).join('');
  },

  updateStats() {
    if (!this.data.stats) return;
    const s = this.data.stats;
    document.getElementById('transcriptionCount').textContent = s.transcriptionsInBuffer || 0;
    document.getElementById('normalizedCount').textContent = s.normalizationsCompleted || 0;
    document.getElementById('errorCount').textContent = s.normalizationsFailed || 0;
    document.getElementById('tokensUsed').textContent = s.totalTokensUsed || 0;
  },
};

document.addEventListener('DOMContentLoaded', () => app.init());


