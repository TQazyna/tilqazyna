// State
let currentRelayId = null;
let ws = null;
let isConnected = false;

// DOM Elements
const rtmpUrlInput = document.getElementById('rtmpUrl');
const modelSelect = document.getElementById('model');
const languageSelect = document.getElementById('language');
const chunkDurationInput = document.getElementById('chunkDuration');
const batchSizeInput = document.getElementById('batchSize');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const clearBtn = document.getElementById('clearBtn');
const clearLogsBtn = document.getElementById('clearLogsBtn');

const statusSpan = document.getElementById('status');
const relayIdSpan = document.getElementById('relayId');
const chunksProcessedSpan = document.getElementById('chunksProcessed');
const queueLengthSpan = document.getElementById('queueLength');

const liveTextDiv = document.getElementById('liveText');
const wordsDisplayDiv = document.getElementById('wordsDisplay');
const resultsCountSpan = document.getElementById('resultsCount');
const resultsContainer = document.getElementById('resultsContainer');
const logsContainer = document.getElementById('logsContainer');

// Event Listeners
startBtn.addEventListener('click', startRelay);
stopBtn.addEventListener('click', stopRelay);
clearBtn.addEventListener('click', clearResults);
clearLogsBtn.addEventListener('click', clearLogs);

// Start Relay
async function startRelay() {
    const rtmpUrl = rtmpUrlInput.value.trim();
    const language = languageSelect.value;
    const model = modelSelect.value;
    const chunkDuration = parseInt(chunkDurationInput.value);
    const batchSize = parseInt(batchSizeInput.value);

    if (!rtmpUrl) {
        alert('Please enter RTMP URL');
        return;
    }

    try {
        startBtn.disabled = true;
        updateStatus('Creating relay...', '#f39c12');

        const response = await fetch('/api/whisperx-relay', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                rtmpUrl,
                language,
                chunkDuration,
                batchSize,
                model
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create relay');
        }

        const data = await response.json();
        currentRelayId = data.id;
        relayIdSpan.textContent = data.id;

        addLog('success', 'Relay created successfully', { id: data.id });
        updateStatus('Connecting...', '#f39c12');

        // Connect WebSocket
        connectWebSocket();

        startBtn.disabled = true;
        stopBtn.disabled = false;

    } catch (error) {
        console.error('Error starting relay:', error);
        alert(`Error: ${error.message}`);
        updateStatus('Error', '#e74c3c');
        startBtn.disabled = false;
    }
}

// Stop Relay
async function stopRelay() {
    if (!currentRelayId) {
        return;
    }

    try {
        stopBtn.disabled = true;
        updateStatus('Stopping...', '#f39c12');

        const response = await fetch(`/api/whisperx-relay/${currentRelayId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to stop relay');
        }

        addLog('info', 'Relay stopped');
        updateStatus('Stopped', '#95a5a6');

        // Close WebSocket
        if (ws) {
            ws.close();
            ws = null;
        }

        currentRelayId = null;
        relayIdSpan.textContent = '-';
        startBtn.disabled = false;
        stopBtn.disabled = true;

    } catch (error) {
        console.error('Error stopping relay:', error);
        alert(`Error: ${error.message}`);
        stopBtn.disabled = false;
    }
}

// Connect WebSocket
function connectWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/whisperx?id=${currentRelayId}`;

    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
        console.log('WebSocket connected');
        isConnected = true;
        updateStatus('Connected - Transcribing', '#2ecc71');
        addLog('success', 'WebSocket connected');
    };

    ws.onmessage = (event) => {
        try {
            const message = JSON.parse(event.data);
            handleWebSocketMessage(message);
        } catch (error) {
            console.error('Error parsing WebSocket message:', error);
        }
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        addLog('error', 'WebSocket error');
        updateStatus('WebSocket Error', '#e74c3c');
    };

    ws.onclose = () => {
        console.log('WebSocket closed');
        isConnected = false;
        updateStatus('Disconnected', '#95a5a6');
        addLog('info', 'WebSocket disconnected');
    };
}

// Handle WebSocket Messages
function handleWebSocketMessage(message) {
    const { type, data } = message;

    switch (type) {
        case 'initial_data':
            handleInitialData(data);
            break;

        case 'transcription_completed':
            handleTranscriptionCompleted(data);
            break;

        case 'word':
            handleWord(data);
            break;

        case 'char':
            handleChar(data);
            break;

        case 'log':
            addLog(data.type, data.message, data.data);
            break;

        case 'transcription_start':
            addLog('info', 'Transcription started', data);
            break;

        case 'transcription_failed':
            addLog('error', 'Transcription failed', data);
            break;

        default:
            console.log('Unknown message type:', type, data);
    }
}

// Handle Initial Data
function handleInitialData(data) {
    console.log('Initial data received:', data);

    // Update status
    if (data.status) {
        chunksProcessedSpan.textContent = data.status.chunksProcessed || 0;
        queueLengthSpan.textContent = data.status.queueLength || 0;
    }

    // Display transcription results
    if (data.transcription && data.transcription.length > 0) {
        data.transcription.reverse().forEach(result => {
            displayTranscriptionResult(result);
        });
        resultsCountSpan.textContent = data.transcription.length;
    }

    // Display logs
    if (data.logs && data.logs.length > 0) {
        data.logs.forEach(log => {
            addLog(log.type, log.message, log.data);
        });
    }
}

// Handle Transcription Completed
function handleTranscriptionCompleted(result) {
    console.log('Transcription completed:', result);

    // Update status
    const currentCount = parseInt(resultsCountSpan.textContent) || 0;
    resultsCountSpan.textContent = currentCount + 1;

    // Update chunks processed
    const currentChunks = parseInt(chunksProcessedSpan.textContent) || 0;
    chunksProcessedSpan.textContent = currentChunks + 1;

    // Display result
    displayTranscriptionResult(result);

    // Update live text
    if (result.fullText) {
        liveTextDiv.textContent = result.fullText;
    }
}

// Handle Word
function handleWord(wordData) {
    console.log('Word received:', wordData);

    // Add word chip to display
    const wordChip = document.createElement('div');
    wordChip.className = 'word-chip';

    const wordText = document.createElement('span');
    wordText.textContent = wordData.word;

    const wordScore = document.createElement('span');
    wordScore.className = 'word-score';
    wordScore.textContent = wordData.score ? `(${(wordData.score * 100).toFixed(0)}%)` : '';

    wordChip.appendChild(wordText);
    if (wordData.score) {
        wordChip.appendChild(wordScore);
    }

    wordsDisplayDiv.appendChild(wordChip);

    // Keep only last 20 words
    while (wordsDisplayDiv.children.length > 20) {
        wordsDisplayDiv.removeChild(wordsDisplayDiv.firstChild);
    }

    // Scroll to bottom
    wordsDisplayDiv.scrollLeft = wordsDisplayDiv.scrollWidth;
}

// Handle Char
function handleChar(charData) {
    // Add character to live text with animation
    const charSpan = document.createElement('span');
    charSpan.className = 'char';
    charSpan.textContent = charData.char;

    liveTextDiv.appendChild(charSpan);
}

// Display Transcription Result
function displayTranscriptionResult(result) {
    const resultItem = document.createElement('div');
    resultItem.className = 'result-item';
    resultItem.id = `result-${result.id}`;

    const resultHeader = document.createElement('div');
    resultHeader.className = 'result-header';

    const resultId = document.createElement('div');
    resultId.className = 'result-id';
    resultId.textContent = result.id;

    const resultTime = document.createElement('div');
    resultTime.className = 'result-time';
    resultTime.textContent = new Date(result.timestamp).toLocaleTimeString();

    resultHeader.appendChild(resultId);
    resultHeader.appendChild(resultTime);

    const resultText = document.createElement('div');
    resultText.className = 'result-text';
    resultText.textContent = result.fullText || 'No text';

    const resultMeta = document.createElement('div');
    resultMeta.className = 'result-meta';
    resultMeta.innerHTML = `
        <span>Language: ${result.language || 'Unknown'}</span>
        <span>Duration: ${result.duration || 0}ms</span>
        <span>Segments: ${result.segments?.length || 0}</span>
        <span>Words: ${result.wordSegments?.length || 0}</span>
    `;

    resultItem.appendChild(resultHeader);
    resultItem.appendChild(resultText);
    resultItem.appendChild(resultMeta);

    // Add segments details
    if (result.segments && result.segments.length > 0) {
        const segmentsDetails = document.createElement('details');
        segmentsDetails.className = 'result-segments';

        const segmentsSummary = document.createElement('summary');
        segmentsSummary.textContent = `View ${result.segments.length} segments`;
        segmentsDetails.appendChild(segmentsSummary);

        result.segments.forEach(segment => {
            const segmentItem = document.createElement('div');
            segmentItem.className = 'segment-item';
            segmentItem.innerHTML = `
                <span class="segment-time">[${segment.start?.toFixed(2) || '0.00'}s - ${segment.end?.toFixed(2) || '0.00'}s]</span>
                ${segment.text}
            `;
            segmentsDetails.appendChild(segmentItem);
        });

        resultItem.appendChild(segmentsDetails);
    }

    // Add to top of container
    if (resultsContainer.firstChild) {
        resultsContainer.insertBefore(resultItem, resultsContainer.firstChild);
    } else {
        resultsContainer.appendChild(resultItem);
    }

    // Keep only last 50 results
    while (resultsContainer.children.length > 50) {
        resultsContainer.removeChild(resultsContainer.lastChild);
    }
}

// Add Log
function addLog(type, message, data = null) {
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';

    const logTime = document.createElement('span');
    logTime.className = 'log-time';
    logTime.textContent = new Date().toLocaleTimeString();

    const logType = document.createElement('span');
    logType.className = `log-type ${type}`;
    logType.textContent = type;

    const logMessage = document.createElement('span');
    logMessage.className = 'log-message';
    logMessage.textContent = message;

    if (data) {
        logMessage.textContent += ` - ${JSON.stringify(data)}`;
    }

    logEntry.appendChild(logTime);
    logEntry.appendChild(logType);
    logEntry.appendChild(logMessage);

    logsContainer.appendChild(logEntry);

    // Keep only last 100 logs
    while (logsContainer.children.length > 100) {
        logsContainer.removeChild(logsContainer.firstChild);
    }

    // Scroll to bottom
    logsContainer.scrollTop = logsContainer.scrollHeight;
}

// Update Status
function updateStatus(text, color) {
    statusSpan.textContent = text;
    statusSpan.style.color = color;
}

// Clear Results
async function clearResults() {
    if (!currentRelayId) {
        return;
    }

    try {
        const response = await fetch(`/api/whisperx-relay/${currentRelayId}/transcription`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to clear results');
        }

        resultsContainer.innerHTML = '';
        liveTextDiv.textContent = '';
        wordsDisplayDiv.innerHTML = '';
        resultsCountSpan.textContent = '0';
        addLog('info', 'Results cleared');

    } catch (error) {
        console.error('Error clearing results:', error);
        alert(`Error: ${error.message}`);
    }
}

// Clear Logs
async function clearLogs() {
    if (!currentRelayId) {
        logsContainer.innerHTML = '';
        return;
    }

    try {
        const response = await fetch(`/api/whisperx-relay/${currentRelayId}/logs`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to clear logs');
        }

        logsContainer.innerHTML = '';
        addLog('info', 'Logs cleared');

    } catch (error) {
        console.error('Error clearing logs:', error);
        alert(`Error: ${error.message}`);
    }
}

// Update status periodically
setInterval(async () => {
    if (currentRelayId && isConnected) {
        try {
            const response = await fetch(`/api/whisperx-relay/${currentRelayId}`);
            if (response.ok) {
                const data = await response.json();
                if (data.details) {
                    chunksProcessedSpan.textContent = data.details.chunksProcessed || 0;
                    queueLengthSpan.textContent = data.details.queueLength || 0;
                }
            }
        } catch (error) {
            console.error('Error fetching status:', error);
        }
    }
}, 5000);

// Initial status
updateStatus('Not Connected', '#95a5a6');
addLog('info', 'Page loaded - Ready to start');
