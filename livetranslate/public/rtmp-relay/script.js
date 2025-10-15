// RTMP Relay Manager - Shadcn Style

class RTMPRelayManager {
    constructor() {
        this.relays = [];
        this.projects = [];
        this.init();
    }

    async init() {
        await this.loadProjects();
        await this.loadRelays();
        this.setupEventListeners();

        // Auto-refresh every 5 seconds
        setInterval(() => this.loadRelays(), 5000);
    }

    setupEventListeners() {
        const form = document.getElementById('relayForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createRelay();
            });
        }
    }

    async loadProjects() {
        try {
            const response = await fetch('/api/projects');
            this.projects = await response.json();

            const projectSelect = document.getElementById('projectId');
            if (projectSelect) {
                projectSelect.innerHTML = '<option value="">Выберите проект...</option>';

                this.projects.forEach(project => {
                    const option = document.createElement('option');
                    option.value = project.id;
                    option.textContent = `${project.name}${project.isLive ? ' (Live)' : ''}`;
                    projectSelect.appendChild(option);
                });
            }
        } catch (error) {
            this.showToast('Ошибка загрузки проектов: ' + error.message, 'error');
        }
    }

    async loadRelays() {
        try {
            const response = await fetch('/api/rtmp-relay');
            this.relays = await response.json();
            this.renderRelays();
        } catch (error) {
            console.error('Error loading relays:', error);
        }
    }

    async createRelay() {
        const form = document.getElementById('relayForm');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const createBtn = document.getElementById('createBtn');
        const createBtnText = document.getElementById('createBtnText');
        const createLoading = document.getElementById('createLoading');

        createBtn.disabled = true;
        createBtnText.style.display = 'none';
        createLoading.style.display = 'inline-block';

        try {
            const response = await fetch('/api/rtmp-relay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Ошибка создания ретранслятора');
            }

            const result = await response.json();
            this.showToast(`Relay ${result.id} успешно создан`, 'success');
            form.reset();
            toggleCreateForm();
            await this.loadRelays();

        } catch (error) {
            this.showToast('Ошибка: ' + error.message, 'error');
        } finally {
            createBtn.disabled = false;
            createBtnText.style.display = 'inline';
            createLoading.style.display = 'none';
        }
    }

    async deleteRelay(relayId) {
        if (!confirm('Вы уверены, что хотите удалить этот relay?')) {
            return;
        }

        try {
            const response = await fetch(`/api/rtmp-relay/${relayId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Ошибка удаления');
            }

            this.showToast('Relay успешно удален', 'success');
            await this.loadRelays();

        } catch (error) {
            this.showToast('Ошибка: ' + error.message, 'error');
        }
    }

    async restartRelay(relayId) {
        try {
            const response = await fetch(`/api/rtmp-relay/${relayId}/restart`, {
                method: 'POST'
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Ошибка перезапуска');
            }

            this.showToast('Relay успешно перезапущен', 'success');
            await this.loadRelays();

        } catch (error) {
            this.showToast('Ошибка: ' + error.message, 'error');
        }
    }

    renderRelays() {
        const container = document.getElementById('relaysList');
        const countEl = document.getElementById('relayCount');

        if (!container) return;

        // Update count
        if (countEl) {
            countEl.textContent = this.relays.length;
        }

        if (this.relays.length === 0) {
            container.innerHTML = `
                <div class="empty-state-small">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                        <circle cx="24" cy="24" r="18" stroke="currentColor" stroke-width="2" opacity="0.3"/>
                        <path d="M24 16V24L30 28" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.3"/>
                    </svg>
                    <p>Нет активных relays</p>
                </div>
            `;
            return;
        }

        // Render table
        container.innerHTML = `
            <table class="table relay-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Проект</th>
                        <th>Статус</th>
                        <th>Детали</th>
                        <th style="text-align: right;">Действия</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.relays.map(relay => this.renderRelayRow(relay)).join('')}
                </tbody>
            </table>
        `;
    }

    renderRelayRow(relay) {
        const project = this.projects.find(p => p.id === relay.projectId);
        const projectName = project ? project.name : 'Неизвестный';

        const statusClass = relay.status === 'running' ? 'running' :
                           relay.status === 'error' ? 'error' : 'stopped';

        const statusText = relay.status === 'running' ? 'Работает' :
                          relay.status === 'error' ? 'Ошибка' : 'Остановлен';

        return `
            <tr class="relay-row">
                <td class="relay-cell">
                    <code class="relay-cell-id">${relay.id.substring(0, 12)}...</code>
                </td>
                <td class="relay-cell">
                    <div class="relay-detail-label">${projectName}</div>
                    <div class="relay-detail-row">${new Date(relay.createdAt).toLocaleString('ru-RU')}</div>
                </td>
                <td class="relay-cell">
                    <div class="relay-cell-status">
                        <div class="status-dot status-dot-${statusClass}"></div>
                        <span>${statusText}</span>
                    </div>
                </td>
                <td class="relay-cell">
                    <div class="relay-cell-details">
                        <div class="relay-detail-row">
                            <span class="relay-detail-label">URL:</span> ${relay.rtmpUrl}
                        </div>
                        <div class="relay-detail-row">
                            <span class="relay-detail-label">Модель:</span> ${relay.model} |
                            <span class="relay-detail-label">Голос:</span> ${relay.voice}
                        </div>
                        ${relay.lastError ? `
                            <div class="relay-detail-row" style="color: hsl(var(--destructive));">
                                <span class="relay-detail-label">Ошибка:</span> ${relay.lastError}
                            </div>
                        ` : ''}
                    </div>
                </td>
                <td class="relay-cell relay-actions-cell">
                    <div class="relay-actions-group">
                        <button class="btn btn-ghost btn-sm" onclick="relayManager.restartRelay('${relay.id}')">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M13 7C13 10.3137 10.3137 13 7 13C3.68629 13 1 10.3137 1 7C1 3.68629 3.68629 1 7 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                                <path d="M13 3L7 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                            </svg>
                            Перезапуск
                        </button>
                        <button class="btn btn-ghost btn-sm btn-danger" onclick="relayManager.deleteRelay('${relay.id}')">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M11 3L3 11M3 3L11 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                            </svg>
                            Удалить
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;

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
}

// Toggle create form
function toggleCreateForm() {
    const formSection = document.getElementById('createFormSection');
    if (formSection) {
        if (formSection.style.display === 'none') {
            formSection.style.display = 'block';
            formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            formSection.style.display = 'none';
        }
    }
}

// Initialize manager
const relayManager = new RTMPRelayManager();
