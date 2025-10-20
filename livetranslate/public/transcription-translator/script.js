// Transcription Translator - Shadcn style integration

const app = {
  translators: [],
  currentTranslatorId: null,
  ws: null,
  data: { results: [], logs: [], stats: null },

  async init() {
    await this.loadNormalizers();
    await this.loadTranslators();
    this.setupEvents();

    const savedPrompt = localStorage.getItem('translator_prompt');
    if (savedPrompt) document.getElementById('promptInput').value = savedPrompt;

    setInterval(() => this.loadTranslators(), 5000);
  },

  setupEvents() {
    const headerBtn = document.getElementById('createTranslatorBtnHeader');
    if (headerBtn) headerBtn.onclick = () => this.create();

    const createBtn = document.getElementById('createTranslatorBtn');
    if (createBtn) createBtn.onclick = () => this.create();

    const promptInput = document.getElementById('promptInput');
    if (promptInput) {
      promptInput.onchange = () => {
        localStorage.setItem('translator_prompt', promptInput.value);
      };
    }
  },

  async loadNormalizers() {
    try {
      const normalizers = await (await fetch('/api/normalizer')).json();
      const normalizerSelect = document.getElementById('normalizerSelect');
      if (!normalizerSelect) return;
      normalizerSelect.innerHTML = '<option value="">Выберите...</option>';
      normalizers.forEach((n) => {
        const option = document.createElement('option');
        option.value = n.id;
        option.textContent = `${n.id} (${n.status})`;
        normalizerSelect.appendChild(option);
      });
    } catch (err) {
      console.error('Load normalizers error:', err);
    }
  },

  async loadTranslators() {
    try {
      const resp = await fetch('/api/translator');
      this.translators = await resp.json();
      this.renderTranslators();
    } catch (err) {
      console.error('Load translators error:', err);
    }
  },

  renderTranslators() {
    const list = document.getElementById('translatorsList');
    if (!list) return;
    if (this.translators.length === 0) {
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
    list.innerHTML = this.translators.map((trans) => `
      <div class="translator-item ${trans.id === this.currentTranslatorId ? 'active' : ''}">
        <div class="translator-info">
          <div class="translator-id">${trans.id}</div>
          <div class="translator-stats">
            Normalizer: ${trans.normalizerId} | ${trans.status} | OK: ${trans.stats.translationsCompleted} | Err: ${trans.stats.translationsFailed} | ${trans.stats.sourceLanguage} → ${trans.stats.targetLanguage}
          </div>
        </div>
        <div class="translator-actions">
          <button class="btn btn-ghost btn-sm" onclick="app.select('${trans.id}')">Открыть</button>
          <button class="btn btn-ghost btn-sm btn-danger" onclick="app.delete('${trans.id}')">Удалить</button>
        </div>
      </div>
    `).join('');
  },

  async create() {
    const normalizerId = document.getElementById('normalizerSelect').value;
    if (!normalizerId) { alert('Выберите нормализатор'); return; }
    try {
      const resp = await fetch('/api/translator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          normalizerId,
          model: 'gpt-4o',
          prompt: document.getElementById('promptInput').value,
          autoTranslate: document.getElementById('autoTranslateCheck').checked,
          sourceLanguage: document.getElementById('sourceLanguage').value,
          targetLanguage: document.getElementById('targetLanguage').value
        }),
      });
      if (!resp.ok) throw new Error((await resp.json()).error);
      const newTrans = await resp.json();
      await this.loadTranslators();
      this.select(newTrans.id);
    } catch (err) {
      alert('Ошибка: ' + err.message);
    }
  },

  async delete(id) {
    if (!confirm('Удалить?')) return;
    try {
      await fetch(`/api/translator/${id}`, { method: 'DELETE' });
      if (this.currentTranslatorId === id) {
        this.disconnect();
        this.currentTranslatorId = null;
        document.getElementById('stats').style.display = 'none';
        document.getElementById('translationsSection').style.display = 'none';
        document.getElementById('logsSection').style.display = 'none';
      }
      await this.loadTranslators();
    } catch (err) { alert('Ошибка удаления'); }
  },

  select(id) {
    this.currentTranslatorId = id;
    this.renderTranslators();
    this.connect();
    document.getElementById('stats').style.display = 'grid';
    document.getElementById('translationsSection').style.display = 'block';
    document.getElementById('logsSection').style.display = 'block';
  },

  connect() {
    this.disconnect();
    if (!this.currentTranslatorId) return;
    this.ws = new WebSocket(`${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${location.host}/translator?id=${this.currentTranslatorId}`);
    this.ws.onopen = () => (document.getElementById('connectionStatus').textContent = 'Подключено');
    this.ws.onmessage = (evt) => this.handleMsg(JSON.parse(evt.data));
    this.ws.onclose = () => (document.getElementById('connectionStatus').textContent = 'Отключено');
  },

  disconnect() { if (this.ws) { this.ws.close(); this.ws = null; } },

  handleMsg(msg) {
    switch (msg.type) {
      case 'initial_data':
        this.data.results = msg.data.results || [];
        this.data.logs = msg.data.logs || [];
        this.data.stats = msg.data.stats;
        this.renderAll();
        break;
      case 'normalization_received':
        // Optional: show notification
        break;
      case 'translation_completed':
      case 'translation_failed':
        this.data.results.unshift(msg.data);
        if (this.data.results.length > 20) this.data.results = this.data.results.slice(0, 20);
        this.renderResults();
        this.loadTranslators();
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

  renderAll() { this.renderResults(); this.renderLogs(); this.updateStats(); },

  renderResults() {
    const list = document.getElementById('translationsList');
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
      <div class="translation-item">
        <div class="translation-header">
          <div class="translation-time">${new Date(res.timestamp).toLocaleString('ru-RU')}</div>
          <div class="translation-status ${res.success ? 'success' : 'error'}">${res.success ? 'OK' : 'ERR'}</div>
        </div>
        ${res.success ? `
          <div class="translation-content">
            <div class="translation-source">
              <div class="translation-label">${res.sourceLanguage || 'Исходный'}</div>
              <div class="translation-text">${res.sourceText}</div>
            </div>
            <div class="translation-target">
              <div class="translation-label">${res.targetLanguage || 'Перевод'}</div>
              <div class="translation-text">${res.translatedText}</div>
            </div>
          </div>
          <div class="translation-meta">Токенов: ${res.tokensUsed || 0} | ${res.duration || 0}мс</div>
        ` : `
          <div class="translation-error">${res.error}</div>
        `}
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
    document.getElementById('translatedCount').textContent = s.translationsCompleted || 0;
    document.getElementById('errorCount').textContent = s.translationsFailed || 0;
    document.getElementById('tokensUsed').textContent = s.totalTokensUsed || 0;
  },
};

document.addEventListener('DOMContentLoaded', () => app.init());


