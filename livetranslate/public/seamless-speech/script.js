// State
let currentServiceId = null;
let ws = null;
let autoScrollEnabled = true;
let autoPlayEnabled = true;

// Cache for audio blob URLs (transcriptionId -> blob URL)
const audioBlobCache = new Map();

// DOM Elements
const whisperxSelect = document.getElementById('whisperx-select');
const refreshWhisperxBtn = document.getElementById('refresh-whisperx-btn');
const autoTranslateCheckbox = document.getElementById('auto-translate-checkbox');
const createServiceBtn = document.getElementById('create-service-btn');
const stopServiceBtn = document.getElementById('stop-service-btn');
const deleteServiceBtn = document.getElementById('delete-service-btn');
const statusDisplay = document.getElementById('status-display');
const resultsContainer = document.getElementById('results-container');
const logsContainer = document.getElementById('logs-container');
const clearResultsBtn = document.getElementById('clear-results-btn');
const clearLogsBtn = document.getElementById('clear-logs-btn');
const autoScrollCheckbox = document.getElementById('auto-scroll-checkbox');
const autoPlayCheckbox = document.getElementById('auto-play-checkbox');
const testText = document.getElementById('test-text');
const manualTranslateBtn = document.getElementById('manual-translate-btn');

// Modal
const audioModal = document.getElementById('audio-modal');
const audioText = document.getElementById('audio-text');
const audioPlayer = document.getElementById('audio-player');
const closeModal = document.querySelector('.close');

// Initialize
init();

async function init() {
  await loadWhisperXRelays();

  // Event listeners
  refreshWhisperxBtn.addEventListener('click', loadWhisperXRelays);
  createServiceBtn.addEventListener('click', createService);
  stopServiceBtn.addEventListener('click', stopService);
  deleteServiceBtn.addEventListener('click', deleteService);
  clearResultsBtn.addEventListener('click', clearResults);
  clearLogsBtn.addEventListener('click', clearLogs);
  manualTranslateBtn.addEventListener('click', manualTranslate);
  autoScrollCheckbox.addEventListener('change', (e) => {
    autoScrollEnabled = e.target.checked;
  });
  autoPlayCheckbox.addEventListener('change', (e) => {
    autoPlayEnabled = e.target.checked;
  });

  // Modal controls
  closeModal.addEventListener('click', () => {
    audioModal.style.display = 'none';
    audioPlayer.pause();
  });

  window.addEventListener('click', (e) => {
    if (e.target === audioModal) {
      audioModal.style.display = 'none';
      audioPlayer.pause();
    }
  });

  // Check if there's a service ID in URL
  const urlParams = new URLSearchParams(window.location.search);
  const serviceId = urlParams.get('id');
  if (serviceId) {
    currentServiceId = serviceId;
    connectWebSocket();
    await loadServiceData();
    enableServiceButtons();
  }
}

async function loadWhisperXRelays() {
  try {
    const response = await fetch('/api/whisperx-relay');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();

    whisperxSelect.innerHTML = '<option value="">Выберите WhisperX Relay</option>';

    if (Array.isArray(data) && data.length > 0) {
      data.forEach(relay => {
        const option = document.createElement('option');
        option.value = relay.id;
        const statusLabel = relay.status === 'running' ? 'активен' : (relay.status || 'остановлен');
        option.textContent = `${relay.id} (${statusLabel})`;
        whisperxSelect.appendChild(option);
      });
    } else {
      whisperxSelect.innerHTML = '<option value="">Нет доступных WhisperX релеев</option>';
    }
  } catch (error) {
    console.error('Error loading WhisperX relays:', error);
    addLog('error', 'Ошибка загрузки WhisperX релеев', error.message);
  }
}

async function createService() {
  const whisperxId = whisperxSelect.value;

  if (!whisperxId) {
    alert('Выберите WhisperX Relay');
    return;
  }

  try {
    createServiceBtn.disabled = true;
    createServiceBtn.textContent = '⏳ Создание...';

    const response = await fetch('/api/seamless-speech', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        whisperxId,
        autoTranslate: autoTranslateCheckbox.checked
        // Языки жестко зафиксированы: Kazakh → Russian
      })
    });

    const data = await response.json();

    if (response.ok) {
      currentServiceId = data.id;
      addLog('info', 'Сервис создан', `ID: ${data.id}`);

      // Update URL
      const url = new URL(window.location);
      url.searchParams.set('id', data.id);
      window.history.pushState({}, '', url);

      connectWebSocket();
      await loadServiceData();
      enableServiceButtons();
    } else {
      throw new Error(data.error || 'Failed to create service');
    }
  } catch (error) {
    console.error('Error creating service:', error);
    alert('Ошибка создания сервиса: ' + error.message);
    addLog('error', 'Ошибка создания сервиса', error.message);
  } finally {
    createServiceBtn.disabled = false;
    createServiceBtn.textContent = '▶️ Создать сервис';
  }
}

async function stopService() {
  if (!currentServiceId) return;

  try {
    const response = await fetch(`/api/seamless-speech/${currentServiceId}/stop`, {
      method: 'POST'
    });

    const data = await response.json();

    if (response.ok) {
      addLog('info', 'Сервис остановлен', data.message);
      await loadServiceData();
    } else {
      throw new Error(data.error || 'Failed to stop service');
    }
  } catch (error) {
    console.error('Error stopping service:', error);
    alert('Ошибка остановки сервиса: ' + error.message);
  }
}

async function deleteService() {
  if (!currentServiceId) return;

  if (!confirm('Вы уверены, что хотите удалить сервис?')) {
    return;
  }

  try {
    const response = await fetch(`/api/seamless-speech/${currentServiceId}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (response.ok) {
      addLog('info', 'Сервис удален', data.message);
      disconnectWebSocket();
      currentServiceId = null;
      disableServiceButtons();

      // Clear URL
      const url = new URL(window.location);
      url.searchParams.delete('id');
      window.history.pushState({}, '', url);

      statusDisplay.innerHTML = '<p>Сервис не запущен</p>';
      resultsContainer.innerHTML = '<p class="empty-state">Результаты появятся здесь после перевода</p>';
    } else {
      throw new Error(data.error || 'Failed to delete service');
    }
  } catch (error) {
    console.error('Error deleting service:', error);
    alert('Ошибка удаления сервиса: ' + error.message);
  }
}

async function manualTranslate() {
  if (!currentServiceId) return;

  const text = testText.value.trim();
  if (!text) {
    alert('Введите текст для перевода');
    return;
  }

  try {
    manualTranslateBtn.disabled = true;
    manualTranslateBtn.textContent = '⏳ Перевод...';

    const response = await fetch(`/api/seamless-speech/${currentServiceId}/manual-translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    const data = await response.json();

    if (response.ok) {
      addLog('info', 'Ручной перевод выполнен', `ID: ${data.result.id}`);
      await loadServiceData();
    } else {
      throw new Error(data.error || 'Failed to translate');
    }
  } catch (error) {
    console.error('Error in manual translation:', error);
    alert('Ошибка перевода: ' + error.message);
  } finally {
    manualTranslateBtn.disabled = false;
    manualTranslateBtn.textContent = '🔄 Перевести';
  }
}

async function loadServiceData() {
  if (!currentServiceId) return;

  try {
    const response = await fetch(`/api/seamless-speech/${currentServiceId}`);
    const data = await response.json();

    if (response.ok) {
      updateStatus(data.status);
      displayResults(data.results);
      displayLogs(data.logs);
    }
  } catch (error) {
    console.error('Error loading service data:', error);
  }
}

function connectWebSocket() {
  if (!currentServiceId) return;

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = `${protocol}//${window.location.host}/seamless-speech?id=${currentServiceId}`;

  ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    console.log('WebSocket connected');
    addLog('info', 'WebSocket подключен', 'Получение данных в реальном времени');
  };

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    handleWebSocketMessage(message);
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    addLog('error', 'WebSocket ошибка', 'Проверьте подключение');
  };

  ws.onclose = () => {
    console.log('WebSocket disconnected');
    addLog('info', 'WebSocket отключен', '');
  };
}

function disconnectWebSocket() {
  if (ws) {
    ws.close();
    ws = null;
  }
}

function handleWebSocketMessage(message) {
  switch (message.type) {
    case 'initial_data':
      updateStatus(message.data.status);
      displayResults(message.data.results);
      displayLogs(message.data.logs);
      break;

    case 'translation_completed':
      addResultItem(message.data);
      loadServiceData(); // Refresh status
      break;

    case 'audio_ready':
      handleAudioReady(message.data);
      break;

    case 'translation_start':
      addLog('translation_start', 'Начало перевода', `ID: ${message.data.transcriptionId}`);
      break;

    case 'log':
      addLogEntry(message.data);
      break;

    case 'error':
      addLog('error', 'Ошибка', message.data.message || JSON.stringify(message.data));
      break;
  }
}

function handleAudioReady(data) {
  console.log('Audio ready received:', {
    filename: data.audioFilename,
    size: data.size,
    format: data.audioFormat,
    hasData: !!data.audioData
  });
  
  addLog('audio_ready', 'Аудио готово', `Файл: ${data.audioFilename}, Размер: ${data.size} bytes`);

  // Если есть base64 данные, создаем blob URL
  if (data.audioData) {
    try {
      // Декодируем base64 в бинарные данные
      const binaryString = atob(data.audioData);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Создаем blob
      const mimeType = data.audioFormat === 'wav' ? 'audio/wav' : 'audio/mpeg';
      const blob = new Blob([bytes], { type: mimeType });
      const audioUrl = URL.createObjectURL(blob);
      
      console.log('Audio blob created:', audioUrl);
      addLog('audio_blob', 'Создан audio blob', `URL: ${audioUrl}`);
      
      // Сохраняем в кэш для использования в результатах
      if (data.transcriptionId) {
        audioBlobCache.set(data.transcriptionId, audioUrl);
        console.log(`Cached audio blob for ${data.transcriptionId}`);
      }
      
      // Auto-play if enabled
      if (autoPlayEnabled) {
        playAudio(audioUrl, data.originalText, data.translatedText);
      }
    } catch (error) {
      console.error('Error creating audio blob:', error);
      addLog('error', 'Ошибка создания audio blob', error.message);
    }
  } else if (data.audioUrl) {
    // Fallback на старый метод с URL
    addLog('audio_url', 'Аудио URL получен', `URL: ${data.audioUrl}`);
    if (autoPlayEnabled) {
      playAudio(data.audioUrl, data.originalText, data.translatedText);
    }
  }
}

function playAudio(url, originalText, translatedText) {
  console.log('Playing audio from URL:', url);
  
  // Создаем временный audio элемент для воспроизведения
  const audio = new Audio(url);
  
  // Логируем текст для отладки
  if (translatedText) {
    console.log(`Исходный текст: ${originalText}`);
    console.log(`Переведённый текст: ${translatedText}`);
  }
  
  audio.play().catch(error => {
    console.error('Error playing audio:', error);
    addLog('error', 'Ошибка воспроизведения', error.message);
  });
  
  // Показываем уведомление
  addLog('audio_play', '🔊 Воспроизведение', originalText || 'Аудио перевода');
}

function updateStatus(status) {
  statusDisplay.innerHTML = `
    <p><strong>Статус:</strong> ${status.isRunning ? '🟢 Запущен' : '🔴 Остановлен'}</p>
    <p><strong>Relay ID:</strong> ${status.relayId}</p>
    <p><strong>Модель:</strong> ${status.model}</p>
    <p><strong>Переводов:</strong> ${status.translationCount}</p>
    <p><strong>Очередь:</strong> ${status.queueLength}</p>
    <p><strong>Язык:</strong> ${status.sourceLanguage} → ${status.targetLanguage}</p>
    <p><strong>Автоперевод:</strong> ${status.autoTranslate ? '✅' : '❌'}</p>
    <hr style="margin: 10px 0; border-color: rgba(255,255,255,0.3);">
    <p><strong>Статистика:</strong></p>
    <p>✅ Успешно: ${status.stats.translationsCompleted}</p>
    <p>❌ Ошибок: ${status.stats.translationsFailed}</p>
    <p>⏱️ Среднее время: ${Math.round(status.stats.averageLatency)}ms</p>
  `;
}

function displayResults(results) {
  if (!results || results.length === 0) {
    resultsContainer.innerHTML = '<p class="empty-state">Результаты появятся здесь после перевода</p>';
    return;
  }

  resultsContainer.innerHTML = '';
  results.reverse().forEach(result => {
    addResultItem(result, false);
  });
}

function addResultItem(result, prepend = true) {
  const resultDiv = document.createElement('div');
  resultDiv.className = `result-item ${result.success ? 'success' : 'error'}`;

  if (result.success) {
    // Формируем URL для аудио (проверяем кэш blob URLs сначала)
    let audioUrl = null;
    
    // Сначала проверяем кэш blob URLs
    if (result.transcriptionId && audioBlobCache.has(result.transcriptionId)) {
      audioUrl = audioBlobCache.get(result.transcriptionId);
      console.log(`Using cached blob URL for ${result.transcriptionId}:`, audioUrl);
    }
    // Затем проверяем прямой URL
    else if (result.translatedAudioUrl) {
      audioUrl = result.translatedAudioUrl;
    }
    // В крайнем случае используем HTTP endpoint
    else if (result.translatedAudioFilename) {
      audioUrl = `/api/seamless-speech/${currentServiceId}/audio/${result.translatedAudioFilename}`;
    }
    
    const translatedText = result.translatedText ? `<div class="result-text"><strong>Переведённый текст:</strong> ${result.translatedText}</div>` : '';
    
    resultDiv.innerHTML = `
      <div class="result-header">
        <span class="result-id">${result.id}</span>
        <span class="result-timestamp">${new Date(result.timestamp).toLocaleString()}</span>
      </div>
      <div class="result-text">
        <strong>Исходный текст:</strong>
        ${result.originalText}
      </div>
      ${translatedText}
      ${audioUrl ? `
        <div class="audio-player-wrapper">
          <button class="play-btn" onclick="playAudio('${audioUrl}', '${escapeHtml(result.originalText)}', '${escapeHtml(result.translatedText || '')}')">
            🔊 Воспроизвести перевод
          </button>
          <audio controls>
            <source src="${audioUrl}" type="audio/wav">
            Ваш браузер не поддерживает аудио элемент.
          </audio>
        </div>
      ` : '<div class="result-text"><em>Аудио не доступно</em></div>'}
      <div class="result-duration">
        ⏱️ Время обработки: ${result.duration}ms |
        🌍 ${result.sourceLanguage} → ${result.targetLanguage}
      </div>
    `;
  } else {
    resultDiv.innerHTML = `
      <div class="result-header">
        <span class="result-id">${result.id}</span>
        <span class="result-timestamp">${new Date(result.timestamp).toLocaleString()}</span>
      </div>
      <div class="result-text">
        <strong>Ошибка:</strong>
        ${result.error}
      </div>
      <div class="result-text">
        <strong>Текст:</strong>
        ${result.originalText}
      </div>
    `;
  }

  if (prepend) {
    resultsContainer.insertBefore(resultDiv, resultsContainer.firstChild);
  } else {
    resultsContainer.appendChild(resultDiv);
  }
}

function displayLogs(logs) {
  if (!logs || logs.length === 0) {
    logsContainer.innerHTML = '<div style="color: #666;">Логи появятся здесь</div>';
    return;
  }

  logsContainer.innerHTML = '';
  logs.forEach(log => {
    addLogEntry(log, false);
  });

  if (autoScrollEnabled) {
    logsContainer.scrollTop = logsContainer.scrollHeight;
  }
}

function addLogEntry(log, prepend = true) {
  const logDiv = document.createElement('div');
  logDiv.className = `log-entry ${log.type}`;

  const timestamp = new Date(log.timestamp).toLocaleTimeString();
  const dataStr = log.data ? JSON.stringify(log.data) : '';

  logDiv.innerHTML = `
    <span class="log-timestamp">[${timestamp}]</span>
    <span class="log-type">[${log.type}]</span>
    ${log.message}
    ${dataStr ? `<br><span style="color: #666;">${dataStr}</span>` : ''}
  `;

  if (prepend) {
    logsContainer.insertBefore(logDiv, logsContainer.firstChild);
  } else {
    logsContainer.appendChild(logDiv);
  }

  if (autoScrollEnabled) {
    logsContainer.scrollTop = logsContainer.scrollHeight;
  }
}

function addLog(type, message, data) {
  addLogEntry({
    timestamp: new Date().toISOString(),
    type,
    message,
    data
  }, true);
}

async function clearResults() {
  if (!currentServiceId) return;

  try {
    const response = await fetch(`/api/seamless-speech/${currentServiceId}/clear-results`, {
      method: 'POST'
    });

    if (response.ok) {
      resultsContainer.innerHTML = '<p class="empty-state">Результаты очищены</p>';
      addLog('info', 'Результаты очищены', '');
    }
  } catch (error) {
    console.error('Error clearing results:', error);
  }
}

async function clearLogs() {
  if (!currentServiceId) return;

  try {
    const response = await fetch(`/api/seamless-speech/${currentServiceId}/clear-logs`, {
      method: 'POST'
    });

    if (response.ok) {
      logsContainer.innerHTML = '<div style="color: #666;">Логи очищены</div>';
    }
  } catch (error) {
    console.error('Error clearing logs:', error);
  }
}

function enableServiceButtons() {
  stopServiceBtn.disabled = false;
  deleteServiceBtn.disabled = false;
  manualTranslateBtn.disabled = false;
  createServiceBtn.disabled = true;
}

function disableServiceButtons() {
  stopServiceBtn.disabled = true;
  deleteServiceBtn.disabled = true;
  manualTranslateBtn.disabled = true;
  createServiceBtn.disabled = false;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Make playAudio available globally
window.playAudio = playAudio;
