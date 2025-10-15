// ============================================
// TalkSync Dashboard - Shadcn Style
// ============================================

// DOM Elements
const startWorkflowBtn = document.getElementById('startWorkflow');
const btnText = document.getElementById('btnText');
const loadingModal = document.getElementById('loadingModal');
const workflowsTable = document.getElementById('workflowsTable');
const activityLog = document.getElementById('activityLog');
const toastContainer = document.getElementById('toastContainer');

// Stats Elements
const statActiveWorkflows = document.getElementById('statActiveWorkflows');
const statNormalizations = document.getElementById('statNormalizations');
const statTranslations = document.getElementById('statTranslations');
const statSpeech = document.getElementById('statSpeech');

// State
let currentWorkflowId = null;
let isCreating = false;
let activityItems = [];

// ============================================
// Utility Functions
// ============================================

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    toast.innerHTML = `
        <div class="toast-content">
            <svg class="toast-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                ${type === 'success' ?
                    '<path d="M8 12L4 8L5.5 6.5L8 9L14.5 2.5L16 4L8 12Z" fill="currentColor"/>' :
                    '<circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2"/><path d="M10 6V10M10 14H10.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
                }
            </svg>
            <span class="toast-message">${message}</span>
        </div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

function formatTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatTimeShort(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'только что';
    if (diff < 3600) return `${Math.floor(diff / 60)} мин назад`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ч назад`;
    return date.toLocaleDateString('ru-RU');
}

function setStepActive(stepNumber) {
    const steps = document.querySelectorAll('.progress-step');
    steps.forEach((step, index) => {
        if (index + 1 < stepNumber) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (index + 1 === stepNumber) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
}

function addActivity(title, type = 'info') {
    const activity = {
        title,
        type,
        time: new Date().toISOString()
    };

    activityItems.unshift(activity);
    if (activityItems.length > 10) {
        activityItems = activityItems.slice(0, 10);
    }

    renderActivityLog();
}

function renderActivityLog() {
    if (activityItems.length === 0) {
        activityLog.innerHTML = `
            <div class="empty-state-small">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="18" stroke="currentColor" stroke-width="2" opacity="0.3"/>
                    <path d="M24 16V24L30 28" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.3"/>
                </svg>
                <p>Нет активности</p>
            </div>
        `;
        return;
    }

    activityLog.innerHTML = activityItems.map(item => `
        <div class="activity-item">
            <div class="activity-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6" fill="currentColor"/>
                </svg>
            </div>
            <div class="activity-content">
                <div class="activity-title">${item.title}</div>
                <div class="activity-time">${formatTimeShort(item.time)}</div>
            </div>
        </div>
    `).join('');
}

function closeModal() {
    loadingModal.style.display = 'none';
}

// ============================================
// Workflow Creation
// ============================================

async function createWorkflow() {
    if (isCreating) return;

    isCreating = true;
    startWorkflowBtn.disabled = true;
    btnText.textContent = 'Создание...';

    // Show modal
    loadingModal.style.display = 'flex';

    try {
        const config = {
            rtmpUrl: 'rtmp://talksync.tilqazyna.kz:1935/steppe-games',
            projectId: 'steppe-games',
            normalizerInterval: 10000,
            speakerSpeed: 1.3,
            speakerModel: 'tts-1-hd'
        };

        console.log('Starting workflow with config:', config);

        // Animate steps
        const steps = [
            { number: 1, delay: 500 },
            { number: 2, delay: 2500 },
            { number: 3, delay: 3500 },
            { number: 4, delay: 4500 }
        ];

        steps.forEach(({ number, delay }) => {
            setTimeout(() => setStepActive(number), delay);
        });

        // API request
        const response = await fetch('/api/workflow/start', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(config)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to create workflow');
        }

        console.log('Workflow created:', data);
        currentWorkflowId = data.workflow.workflowId;

        // Complete all steps
        setTimeout(() => {
            document.querySelectorAll('.progress-step').forEach(step => {
                step.classList.add('completed');
                step.classList.remove('active');
            });
        }, 5000);

        // Close modal and show success
        setTimeout(() => {
            closeModal();
            showToast('Трансляция успешно запущена!', 'success');
            addActivity('Новая трансляция создана', 'success');

            // Update UI
            loadWorkflows();
            updateStats();

            // Reset button
            startWorkflowBtn.disabled = false;
            btnText.textContent = 'Запустить трансляцию';
            isCreating = false;
        }, 6000);

    } catch (error) {
        console.error('Error creating workflow:', error);
        showToast(`Ошибка: ${error.message}`, 'error');
        addActivity(`Ошибка создания: ${error.message}`, 'error');

        closeModal();
        startWorkflowBtn.disabled = false;
        btnText.textContent = 'Запустить трансляцию';
        isCreating = false;
    }
}

// ============================================
// Workflow Management
// ============================================

async function loadWorkflows() {
    try {
        const response = await fetch('/api/workflow/status');
        const data = await response.json();

        console.log('Workflows loaded:', data);

        if (!data.workflows || data.workflows.length === 0) {
            workflowsTable.innerHTML = `
                <div class="empty-state-small">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                        <circle cx="24" cy="24" r="18" stroke="currentColor" stroke-width="2" opacity="0.3"/>
                        <path d="M24 16V24L30 28" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.3"/>
                    </svg>
                    <p>Нет активных трансляций</p>
                </div>
            `;
            return;
        }

        // Render table
        workflowsTable.innerHTML = `
            <table class="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Создано</th>
                        <th>Компоненты</th>
                        <th>Статус</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.workflows.map(workflow => {
                        const components = workflow.components || {};
                        const hasError = Object.values(components).some(c => c.status === 'error');
                        const workflowId = workflow.id;

                        return `
                            <tr>
                                <td><code style="font-size: 12px;">${workflowId.substring(0, 12)}...</code></td>
                                <td>${formatTime(workflow.createdAt)}</td>
                                <td>
                                    <div style="display: flex; gap: 4px;">
                                        ${components.relay ? '<span class="badge badge-success">Relay</span>' : ''}
                                        ${components.normalizer ? '<span class="badge badge-success">Normalizer</span>' : ''}
                                        ${components.translator ? '<span class="badge badge-success">Translator</span>' : ''}
                                        ${components.speaker ? '<span class="badge badge-success">Speaker</span>' : ''}
                                    </div>
                                </td>
                                <td>
                                    <span class="badge ${hasError ? 'badge-error' : 'badge-success'}">
                                        ${hasError ? 'Ошибка' : 'Активна'}
                                    </span>
                                </td>
                                <td>
                                    <div class="table-actions">
                                        <button class="btn btn-ghost btn-sm" onclick="openListenerPage()">Слушать</button>
                                        <button class="btn btn-ghost btn-sm btn-danger" onclick="stopWorkflow('${workflowId}')">Остановить</button>
                                    </div>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;

    } catch (error) {
        console.error('Error loading workflows:', error);
        showToast('Ошибка загрузки трансляций', 'error');
    }
}

async function stopWorkflow(workflowId) {
    if (!confirm('Вы уверены, что хотите остановить трансляцию?')) {
        return;
    }

    try {
        const response = await fetch(`/api/workflow/${workflowId}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to stop workflow');
        }

        showToast('Трансляция остановлена', 'success');
        addActivity('Трансляция остановлена', 'info');
        loadWorkflows();
        updateStats();

    } catch (error) {
        console.error('Error stopping workflow:', error);
        showToast(`Ошибка: ${error.message}`, 'error');
    }
}

function openListenerPage() {
    window.open('/', '_blank');
}

// ============================================
// Stats Update
// ============================================

async function updateStats() {
    try {
        const response = await fetch('/api/workflow/status');
        const data = await response.json();

        if (!data.workflows) return;

        // Count active workflows
        statActiveWorkflows.textContent = data.workflows.length;

        // Aggregate stats
        let totalNormalizations = 0;
        let totalTranslations = 0;
        let totalSpeech = 0;

        data.workflows.forEach(workflow => {
            const components = workflow.components || {};

            if (components.normalizer?.stats) {
                totalNormalizations += components.normalizer.stats.normalizationsCompleted || 0;
            }
            if (components.translator?.stats) {
                totalTranslations += components.translator.stats.translationsCompleted || 0;
            }
            if (components.speaker?.stats) {
                totalSpeech += components.speaker.stats.speechCompleted || 0;
            }
        });

        statNormalizations.textContent = totalNormalizations;
        statTranslations.textContent = totalTranslations;
        statSpeech.textContent = totalSpeech;

    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

// ============================================
// Event Listeners
// ============================================

startWorkflowBtn.addEventListener('click', createWorkflow);

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('TalkSync Dashboard initialized (Shadcn style)');

    // Load workflows
    loadWorkflows();
    updateStats();

    // Update every 5 seconds
    setInterval(() => {
        loadWorkflows();
        updateStats();
    }, 5000);

    // Initial activity
    addActivity('Dashboard загружен', 'info');
});

// ============================================
// Keyboard Shortcuts
// ============================================

document.addEventListener('keydown', (e) => {
    // Cmd/Ctrl + Enter для быстрого запуска
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        if (!isCreating) {
            createWorkflow();
        }
    }
});
