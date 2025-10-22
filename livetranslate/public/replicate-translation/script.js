// Replicate Translation Frontend

let currentTranslatorId = null;
let isRunning = false;

// DOM Elements
const whisperxIdSelect = document.getElementById('whisperxId');
const modelInput = document.getElementById('model');
const contextSizeInput = document.getElementById('contextSize');
const temperatureInput = document.getElementById('temperature');
const maxTokensInput = document.getElementById('maxTokens');
const autoTranslateCheckbox = document.getElementById('autoTranslate');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const clearBtn = document.getElementById('clearBtn');

const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('status');
const translatorIdSpan = document.getElementById('translatorId');
const connectedWhisperxSpan = document.getElementById('connectedWhisperx');
const translationCountSpan = document.getElementById('translationCount');
const contextCountSpan = document.getElementById('contextCount');
const avgLatencySpan = document.getElementById('avgLatency');

const translationsCompletedSpan = document.getElementById('translationsCompleted');
const translationsFailedSpan = document.getElementById('translationsFailed');
const totalTokensSpan = document.getElementById('totalTokens');

const translationsList = document.getElementById('translationsList');
const contextList = document.getElementById('contextList');
const logsList = document.getElementById('logsList');
const logTypeFilter = document.getElementById('logTypeFilter');

// Event Listeners
startBtn.addEventListener('click', startTranslation);
stopBtn.addEventListener('click', stopTranslation);
clearBtn.addEventListener('click', clearResults);

// Load WhisperX relays on page load
window.addEventListener('load', () => {
    loadWhisperXRelays();
    loadExistingTranslators();
});

// Load available WhisperX relays
async function loadWhisperXRelays() {
    try {
        const response = await fetch('/api/whisperx-relay');
        const relays = await response.json();

        whisperxIdSelect.innerHTML = '<option value="">Выберите WhisperX relay...</option>';

        relays.forEach(relay => {
            const option = document.createElement('option');
            option.value = relay.id;
            option.textContent = `${relay.id} (${relay.status}) - ${relay.rtmpUrl}`;
            option.disabled = relay.status !== 'running';
            whisperxIdSelect.appendChild(option);
        });

        if (relays.length === 0) {
            showNotification('Нет доступных WhisperX relay. Создайте relay на странице WhisperX Relay.', 'warning');
        }
    } catch (error) {
        console.error('Error loading WhisperX relays:', error);
        showNotification('Ошибка загрузки WhisperX relays', 'error');
    }
}

// Load existing translators
async function loadExistingTranslators() {
    try {
        const response = await fetch('/api/replicate-translation');
        const translators = await response.json();

        if (translators.length > 0) {
            // Используем последний созданный переводчик
            const latestTranslator = translators[translators.length - 1];
            currentTranslatorId = latestTranslator.id;
            isRunning = latestTranslator.status === 'running';

            updateUIState();
            await loadTranslatorStatus();
            await loadTranslations();
            await loadContext();
            await loadLogs();
        }
    } catch (error) {
        console.error('Error loading existing translators:', error);
    }
}

// Start translation
async function startTranslation() {
    const whisperxId = whisperxIdSelect.value;

    if (!whisperxId) {
        showNotification('Выберите WhisperX relay', 'error');
        return;
    }

    const config = {
        whisperxId: whisperxId,
        model: modelInput.value,
        contextSize: parseInt(contextSizeInput.value),
        temperature: parseFloat(temperatureInput.value),
        maxTokens: parseInt(maxTokensInput.value),
        autoTranslate: autoTranslateCheckbox.checked
    };

    try {
        startBtn.disabled = true;
        startBtn.textContent = 'Запуск...';

        const response = await fetch('/api/replicate-translation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to start translator');
        }

        const result = await response.json();
        currentTranslatorId = result.id;
        isRunning = true;

        updateUIState();
        showNotification('Переводчик успешно запущен!', 'success');

        // Start polling for updates
        startPolling();

    } catch (error) {
        console.error('Error starting translator:', error);
        showNotification(`Ошибка: ${error.message}`, 'error');
        startBtn.disabled = false;
        startBtn.textContent = 'Начать перевод';
    }
}

// Stop translation
async function stopTranslation() {
    if (!currentTranslatorId) return;

    try {
        stopBtn.disabled = true;
        stopBtn.textContent = 'Остановка...';

        const response = await fetch(`/api/replicate-translation/${currentTranslatorId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to stop translator');
        }

        isRunning = false;
        currentTranslatorId = null;
        updateUIState();
        showNotification('Переводчик остановлен', 'info');
        stopPolling();

    } catch (error) {
        console.error('Error stopping translator:', error);
        showNotification(`Ошибка: ${error.message}`, 'error');
        stopBtn.disabled = false;
        stopBtn.textContent = 'Остановить';
    }
}

// Clear results
async function clearResults() {
    if (!currentTranslatorId) return;

    if (!confirm('Очистить все результаты переводов?')) return;

    try {
        const response = await fetch(`/api/replicate-translation/${currentTranslatorId}/results`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to clear results');
        }

        translationsList.innerHTML = '';
        showNotification('Результаты очищены', 'success');

    } catch (error) {
        console.error('Error clearing results:', error);
        showNotification(`Ошибка: ${error.message}`, 'error');
    }
}

// Clear translations from UI
function clearTranslations() {
    translationsList.innerHTML = '';
}

// Clear logs
async function clearLogs() {
    if (!currentTranslatorId) return;

    try {
        const response = await fetch(`/api/replicate-translation/${currentTranslatorId}/logs`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to clear logs');
        }

        logsList.innerHTML = '';
        showNotification('Логи очищены', 'success');

    } catch (error) {
        console.error('Error clearing logs:', error);
        showNotification(`Ошибка: ${error.message}`, 'error');
    }
}

// Update UI state
function updateUIState() {
    if (isRunning) {
        statusDot.className = 'status-indicator status-success';
        statusText.textContent = 'Running';
        translatorIdSpan.textContent = currentTranslatorId;
        startBtn.disabled = true;
        stopBtn.disabled = false;
        whisperxIdSelect.disabled = true;
        modelInput.disabled = true;
        contextSizeInput.disabled = true;
        temperatureInput.disabled = true;
        maxTokensInput.disabled = true;
        autoTranslateCheckbox.disabled = true;
    } else {
        statusDot.className = 'status-indicator';
        statusText.textContent = 'Not Running';
        translatorIdSpan.textContent = '-';
        startBtn.disabled = false;
        startBtn.textContent = 'Начать перевод';
        stopBtn.disabled = true;
        stopBtn.textContent = 'Остановить';
        whisperxIdSelect.disabled = false;
        modelInput.disabled = false;
        contextSizeInput.disabled = false;
        temperatureInput.disabled = false;
        maxTokensInput.disabled = false;
        autoTranslateCheckbox.disabled = false;
    }
}

// Polling
let pollingInterval = null;

function startPolling() {
    stopPolling();
    pollingInterval = setInterval(async () => {
        await loadTranslatorStatus();
        await loadTranslations();
        await loadContext();
        await loadLogs();
    }, 2000); // Poll every 2 seconds
}

function stopPolling() {
    if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
    }
}

// Load translator status
async function loadTranslatorStatus() {
    if (!currentTranslatorId) return;

    try {
        const response = await fetch(`/api/replicate-translation/${currentTranslatorId}`);

        if (!response.ok) {
            throw new Error('Failed to load status');
        }

        const data = await response.json();

        connectedWhisperxSpan.textContent = data.whisperxId;
        translationCountSpan.textContent = data.details.translationCount;
        contextCountSpan.textContent = data.details.contextSize;

        const avgLatency = data.details.stats.averageLatency;
        avgLatencySpan.textContent = avgLatency > 0 ? `${Math.round(avgLatency)}ms` : '-';

        translationsCompletedSpan.textContent = data.details.stats.translationsCompleted;
        translationsFailedSpan.textContent = data.details.stats.translationsFailed;
        totalTokensSpan.textContent = data.details.stats.totalTokensUsed.toLocaleString();

    } catch (error) {
        console.error('Error loading status:', error);
    }
}

// Load translations
async function loadTranslations() {
    if (!currentTranslatorId) return;

    try {
        const response = await fetch(`/api/replicate-translation/${currentTranslatorId}/results?limit=20`);

        if (!response.ok) {
            throw new Error('Failed to load translations');
        }

        const data = await response.json();
        displayTranslations(data.results);

    } catch (error) {
        console.error('Error loading translations:', error);
    }
}

// Display translations
function displayTranslations(translations) {
    if (translations.length === 0) {
        translationsList.innerHTML = `
            <div class="empty-state">
                <p>Нет результатов перевода. Ожидание транскрипций...</p>
            </div>
        `;
        return;
    }

    // Показываем только новые переводы (последние 20)
    const existingIds = new Set(
        Array.from(translationsList.querySelectorAll('.translation-item'))
            .map(el => el.dataset.id)
    );

    translations.reverse().forEach(translation => {
        if (!existingIds.has(translation.id)) {
            const element = createTranslationElement(translation);
            translationsList.insertBefore(element, translationsList.firstChild);
        }
    });

    // Ограничиваем количество отображаемых элементов
    while (translationsList.children.length > 20) {
        translationsList.removeChild(translationsList.lastChild);
    }
}

// Create translation element
function createTranslationElement(translation) {
    const div = document.createElement('div');
    div.className = `translation-item ${translation.success ? 'new' : 'error'}`;
    div.dataset.id = translation.id;

    const timestamp = new Date(translation.timestamp).toLocaleString('ru-RU');
    const duration = translation.duration ? `${Math.round(translation.duration)}ms` : '-';

    if (translation.success) {
        div.innerHTML = `
            <div class="translation-header">
                <span class="translation-id">${translation.transcriptionId}</span>
                <div class="translation-timestamp">
                    <span>${timestamp}</span>
                    <span class="translation-duration">${duration}</span>
                </div>
            </div>
            <div class="translation-content">
                <div class="translation-text-box translation-original">
                    <div class="translation-label">Оригинал (Казахский)</div>
                    <div class="translation-text original">${escapeHtml(translation.originalText)}</div>
                </div>
                <div class="translation-text-box translation-translated">
                    <div class="translation-label">Перевод (Русский)</div>
                    <div class="translation-text translated">${escapeHtml(translation.translatedText)}</div>
                </div>
            </div>
        `;
    } else {
        div.innerHTML = `
            <div class="translation-header">
                <span class="translation-id">${translation.transcriptionId}</span>
                <span class="translation-timestamp">${timestamp}</span>
            </div>
            <div class="translation-content">
                <div class="translation-text-box translation-original">
                    <div class="translation-label">Оригинал</div>
                    <div class="translation-text">${escapeHtml(translation.originalText || '')}</div>
                </div>
                <div class="translation-text-box" style="border-left-color: var(--danger);">
                    <div class="translation-label">Ошибка</div>
                    <div class="translation-text">${escapeHtml(translation.error || 'Unknown error')}</div>
                </div>
            </div>
        `;
    }

    // Remove 'new' class after animation
    setTimeout(() => {
        div.classList.remove('new');
    }, 3000);

    return div;
}

// Load context
async function loadContext() {
    if (!currentTranslatorId) return;

    try {
        const response = await fetch(`/api/replicate-translation/${currentTranslatorId}/context?limit=10`);

        if (!response.ok) {
            throw new Error('Failed to load context');
        }

        const data = await response.json();
        displayContext(data.context);

    } catch (error) {
        console.error('Error loading context:', error);
    }
}

// Display context
function displayContext(context) {
    if (context.length === 0) {
        contextList.innerHTML = `
            <div class="empty-state">
                <p>История контекста пуста</p>
            </div>
        `;
        return;
    }

    contextList.innerHTML = context.reverse().map(ctx => {
        const timestamp = new Date(ctx.timestamp).toLocaleString('ru-RU');
        return `
            <div class="context-item">
                <div class="context-timestamp">${timestamp}</div>
                <div class="context-pair">
                    <div class="context-original">${escapeHtml(ctx.original)}</div>
                    <div class="context-translation">${escapeHtml(ctx.translation)}</div>
                </div>
            </div>
        `;
    }).join('');
}

// Load logs
async function loadLogs() {
    if (!currentTranslatorId) return;

    try {
        const type = logTypeFilter.value;
        const url = `/api/replicate-translation/${currentTranslatorId}/logs?limit=50${type ? `&type=${type}` : ''}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to load logs');
        }

        const data = await response.json();
        displayLogs(data.logs);

    } catch (error) {
        console.error('Error loading logs:', error);
    }
}

// Display logs
function displayLogs(logs) {
    if (logs.length === 0) {
        logsList.innerHTML = `
            <div class="empty-state">
                <p>Нет логов</p>
            </div>
        `;
        return;
    }

    logsList.innerHTML = logs.reverse().map(log => {
        const timestamp = new Date(log.timestamp).toLocaleTimeString('ru-RU');
        return `
            <div class="log-entry">
                <span class="log-timestamp">${timestamp}</span>
                <span class="log-type ${log.type}">${log.type}</span>
                <span class="log-message">${escapeHtml(log.message)}</span>
            </div>
        `;
    }).join('');
}

// Filter logs
function filterLogs() {
    loadLogs();
}

// Show notification
function showNotification(message, type = 'info') {
    // Simple notification - you can enhance this
    console.log(`[${type.toUpperCase()}] ${message}`);

    // You could implement a toast notification here
    alert(message);
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    stopPolling();
});
