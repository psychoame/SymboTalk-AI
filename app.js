// SymboTalk AI - Main Application
class SymboTalkApp {
    constructor() {
        this.currentMode = 'speech-to-action';
        this.settings = {
            voice: null,
            speed: 1,
            language: 'en-US'
        };
        this.isOnline = navigator.onLine;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSettings();
        this.updateConnectionStatus();
        this.setupOnlineOfflineHandling();
    }

    setupEventListeners() {
        // Mode switching
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchMode(e.target.closest('.mode-btn').dataset.mode);
            });
        });

        // Settings panel
        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.toggleSettings();
        });

        document.getElementById('closeSettings').addEventListener('click', () => {
            this.toggleSettings();
        });

        // Settings form
        document.getElementById('voiceSelect').addEventListener('change', (e) => {
            this.settings.voice = e.target.value;
            this.saveSettings();
        });

        document.getElementById('speedSelect').addEventListener('change', (e) => {
            this.settings.speed = parseFloat(e.target.value);
            this.saveSettings();
        });

        document.getElementById('languageSelect').addEventListener('change', (e) => {
            this.settings.language = e.target.value;
            this.saveSettings();
        });

        // Close settings on outside click
        document.addEventListener('click', (e) => {
            const settingsPanel = document.getElementById('settingsPanel');
            const settingsBtn = document.getElementById('settingsBtn');
            
            if (settingsPanel.classList.contains('open') && 
                !settingsPanel.contains(e.target) && 
                !settingsBtn.contains(e.target)) {
                this.toggleSettings();
            }
        });
    }

    switchMode(mode) {
        // Update mode buttons
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-mode="${mode}"]`).classList.add('active');

        // Update mode content
        document.querySelectorAll('.mode-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(mode).classList.add('active');

        this.currentMode = mode;
        this.updateStatus(`Switched to ${mode.replace('-', ' ')} mode`);

        // Initialize mode-specific features
        if (mode === 'speech-to-action') {
            this.initSpeechToAction();
        } else if (mode === 'action-to-speech') {
            this.initActionToSpeech();
        }
    }

    initSpeechToAction() {
        // Initialize speech recognition and avatar
        if (window.speechManager) {
            window.speechManager.init();
        }
        if (window.avatarManager) {
            window.avatarManager.reset();
        }
    }

    initActionToSpeech() {
        // Initialize camera and gesture recognition
        if (window.gestureManager) {
            window.gestureManager.init();
        }
    }

    toggleSettings() {
        const settingsPanel = document.getElementById('settingsPanel');
        settingsPanel.classList.toggle('open');
        
        if (settingsPanel.classList.contains('open')) {
            this.populateVoiceSelect();
        }
    }

    async populateVoiceSelect() {
        const voiceSelect = document.getElementById('voiceSelect');
        voiceSelect.innerHTML = '<option value="">Loading voices...</option>';

        try {
            const voices = await this.getVoices();
            voiceSelect.innerHTML = '';
            
            voices.forEach(voice => {
                const option = document.createElement('option');
                option.value = voice.name;
                option.textContent = `${voice.name} (${voice.lang})`;
                voiceSelect.appendChild(option);
            });

            // Set current voice
            if (this.settings.voice) {
                voiceSelect.value = this.settings.voice;
            }
        } catch (error) {
            console.error('Error loading voices:', error);
            voiceSelect.innerHTML = '<option value="">Error loading voices</option>';
        }
    }

    getVoices() {
        return new Promise((resolve) => {
            let voices = speechSynthesis.getVoices();
            
            if (voices.length > 0) {
                resolve(voices);
            } else {
                speechSynthesis.onvoiceschanged = () => {
                    voices = speechSynthesis.getVoices();
                    resolve(voices);
                };
            }
        });
    }

    loadSettings() {
        const saved = localStorage.getItem('symbotalk-settings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
    }

    saveSettings() {
        localStorage.setItem('symbotalk-settings', JSON.stringify(this.settings));
    }

    setupOnlineOfflineHandling() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.updateConnectionStatus();
            this.updateStatus('Connection restored');
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.updateConnectionStatus();
            this.updateStatus('Working offline');
        });
    }

    updateConnectionStatus() {
        const statusElement = document.getElementById('connectionStatus');
        if (this.isOnline) {
            statusElement.textContent = '🟢 Online';
            statusElement.style.color = '#10b981';
        } else {
            statusElement.textContent = '🔴 Offline';
            statusElement.style.color = '#ef4444';
        }
    }

    updateStatus(message) {
        const statusText = document.getElementById('statusText');
        statusText.textContent = message;
        
        // Clear status after 3 seconds
        setTimeout(() => {
            if (statusText.textContent === message) {
                statusText.textContent = 'Ready';
            }
        }, 3000);
    }

    // Utility methods
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            max-width: 300px;
        `;

        // Set background color based on type
        const colors = {
            info: '#6366f1',
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(notification);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    // Add CSS animations for notifications
    addNotificationStyles() {
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.symboTalkApp = new SymboTalkApp();
    window.symboTalkApp.addNotificationStyles();
    
    // Show welcome message
    setTimeout(() => {
        window.symboTalkApp.showNotification('Welcome to SymboTalk AI! 🚀', 'success');
    }, 1000);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SymboTalkApp;
} 