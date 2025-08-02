// Speech Recognition Manager
class SpeechManager {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.currentText = '';
        this.actionMap = {
            // Basic actions
            'hello': { action: 'wave', description: 'Waving hello' },
            'hi': { action: 'wave', description: 'Waving hello' },
            'goodbye': { action: 'wave', description: 'Waving goodbye' },
            'bye': { action: 'wave', description: 'Waving goodbye' },
            
            // Emotions
            'happy': { action: 'smile', description: 'Showing happiness' },
            'sad': { action: 'sad', description: 'Showing sadness' },
            'angry': { action: 'angry', description: 'Showing anger' },
            'surprised': { action: 'surprised', description: 'Showing surprise' },
            
            // Physical actions
            'dance': { action: 'dance', description: 'Dancing' },
            'jump': { action: 'jump', description: 'Jumping' },
            'clap': { action: 'clap', description: 'Clapping hands' },
            'wave': { action: 'wave', description: 'Waving' },
            'point': { action: 'point', description: 'Pointing' },
            'nod': { action: 'nod', description: 'Nodding head' },
            'shake': { action: 'shake', description: 'Shaking head' },
            
            // Communication
            'yes': { action: 'nod', description: 'Saying yes' },
            'no': { action: 'shake', description: 'Saying no' },
            'maybe': { action: 'think', description: 'Thinking' },
            'think': { action: 'think', description: 'Thinking' },
            
            // Basic needs
            'hungry': { action: 'hungry', description: 'Feeling hungry' },
            'thirsty': { action: 'thirsty', description: 'Feeling thirsty' },
            'tired': { action: 'tired', description: 'Feeling tired' },
            'sleep': { action: 'sleep', description: 'Going to sleep' },
            
            // Help and support
            'help': { action: 'help', description: 'Asking for help' },
            'stop': { action: 'stop', description: 'Stop action' },
            'wait': { action: 'wait', description: 'Waiting' },
            'come': { action: 'come', description: 'Come here' },
            'go': { action: 'go', description: 'Go away' },
            
            // Complex actions (combinations)
            'drink water': { action: 'drink', description: 'Drinking water' },
            'eat food': { action: 'eat', description: 'Eating food' },
            'take a break': { action: 'rest', description: 'Taking a break' },
            'good job': { action: 'applaud', description: 'Applauding' },
            'thank you': { action: 'bow', description: 'Bowing in thanks' },
            'please': { action: 'plead', description: 'Making a request' }
        };
        
        this.init();
    }

    init() {
        this.setupSpeechRecognition();
        this.setupEventListeners();
    }

    setupSpeechRecognition() {
        // Check for browser support
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            console.error('Speech recognition not supported');
            this.showError('Speech recognition is not supported in this browser');
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        // Event handlers
        this.recognition.onstart = () => {
            this.isListening = true;
            this.updateUI('listening');
            this.updateStatus('Listening...');
        };

        this.recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            this.currentText = finalTranscript || interimTranscript;
            this.updateTextDisplay();
            
            if (finalTranscript) {
                this.processSpeech(finalTranscript);
            }
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.isListening = false;
            this.updateUI('error');
            this.updateStatus(`Error: ${event.error}`);
            
            if (event.error === 'not-allowed') {
                this.showError('Microphone access denied. Please allow microphone access.');
            }
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.updateUI('idle');
            this.updateStatus('Ready to listen');
        };
    }

    setupEventListeners() {
        const speechBtn = document.getElementById('speechBtn');
        if (speechBtn) {
            speechBtn.addEventListener('click', () => {
                this.toggleListening();
            });
        }
    }

    toggleListening() {
        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
    }

    startListening() {
        if (!this.recognition) {
            this.showError('Speech recognition not available');
            return;
        }

        try {
            this.recognition.start();
        } catch (error) {
            console.error('Error starting speech recognition:', error);
            this.showError('Error starting speech recognition');
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
    }

    processSpeech(text) {
        const lowerText = text.toLowerCase().trim();
        console.log('Processing speech:', lowerText);

        // Find matching action
        let action = null;
        let confidence = 0;

        // Check for exact matches first
        if (this.actionMap[lowerText]) {
            action = this.actionMap[lowerText];
            confidence = 1.0;
        } else {
            // Check for partial matches
            for (const [key, value] of Object.entries(this.actionMap)) {
                if (lowerText.includes(key) || key.includes(lowerText)) {
                    const matchConfidence = this.calculateSimilarity(lowerText, key);
                    if (matchConfidence > confidence) {
                        confidence = matchConfidence;
                        action = value;
                    }
                }
            }
        }

        if (action && confidence > 0.3) {
            this.executeAction(action, text, confidence);
        } else {
            this.handleUnknownSpeech(text);
        }
    }

    calculateSimilarity(str1, str2) {
        // Simple similarity calculation using Levenshtein distance
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;
        
        if (longer.length === 0) return 1.0;
        
        const distance = this.levenshteinDistance(longer, shorter);
        return (longer.length - distance) / longer.length;
    }

    levenshteinDistance(str1, str2) {
        const matrix = [];
        
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        return matrix[str2.length][str1.length];
    }

    executeAction(action, originalText, confidence) {
        console.log(`Executing action: ${action.action} (confidence: ${confidence})`);
        
        // Update action description
        this.updateActionDescription(action.description);
        
        // Trigger avatar animation
        if (window.avatarManager) {
            window.avatarManager.performAction(action.action, confidence);
        }
        
        // Show success notification
        this.showSuccess(`Recognized: "${originalText}" → ${action.description}`);
        
        // Update status
        this.updateStatus(`Action: ${action.description}`);
    }

    handleUnknownSpeech(text) {
        console.log('Unknown speech:', text);
        this.updateActionDescription(`I heard: "${text}" but I'm not sure what to do with that.`);
        this.showWarning(`I heard "${text}" but I'm not sure what action to take.`);
        this.updateStatus('Unknown command');
    }

    updateUI(state) {
        const speechBtn = document.getElementById('speechBtn');
        const micIcon = speechBtn?.querySelector('.mic-icon');
        const micText = speechBtn?.querySelector('.mic-text');
        
        if (!speechBtn) return;

        speechBtn.classList.remove('recording', 'error');
        
        switch (state) {
            case 'listening':
                speechBtn.classList.add('recording');
                micText.textContent = 'Listening...';
                break;
            case 'error':
                speechBtn.classList.add('error');
                micText.textContent = 'Error';
                break;
            default:
                micText.textContent = 'Tap to Speak';
                break;
        }
    }

    updateTextDisplay() {
        const textDisplay = document.getElementById('textDisplay');
        if (textDisplay) {
            textDisplay.textContent = this.currentText;
        }
    }

    updateActionDescription(description) {
        const actionDesc = document.getElementById('actionDescription');
        if (actionDesc) {
            actionDesc.textContent = description;
        }
    }

    updateStatus(message) {
        if (window.symboTalkApp) {
            window.symboTalkApp.updateStatus(message);
        }
    }

    showError(message) {
        if (window.symboTalkApp) {
            window.symboTalkApp.showNotification(message, 'error');
        }
    }

    showSuccess(message) {
        if (window.symboTalkApp) {
            window.symboTalkApp.showNotification(message, 'success');
        }
    }

    showWarning(message) {
        if (window.symboTalkApp) {
            window.symboTalkApp.showNotification(message, 'warning');
        }
    }

    // Add custom action to the action map
    addCustomAction(trigger, action, description) {
        this.actionMap[trigger.toLowerCase()] = { action, description };
    }

    // Get all available actions
    getAvailableActions() {
        return Object.keys(this.actionMap);
    }

    // Reset the speech manager
    reset() {
        this.currentText = '';
        this.updateTextDisplay();
        this.updateActionDescription('Ready to translate your speech into actions');
        this.updateStatus('Ready');
    }
}

// Initialize speech manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.speechManager = new SpeechManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpeechManager;
} 