// Gesture Recognition Manager
class GestureManager {
    constructor() {
        this.video = null;
        this.canvas = null;
        this.ctx = null;
        this.stream = null;
        this.isActive = false;
        this.currentGesture = null;
        this.gestureTimeout = null;
        
        // Gesture definitions
        this.gestures = {
            'wave': {
                keywords: ['hello', 'hi', 'goodbye', 'bye'],
                description: 'Waving hand',
                confidence: 0.8
            },
            'point': {
                keywords: ['point', 'there', 'look', 'see'],
                description: 'Pointing',
                confidence: 0.7
            },
            'thumbs_up': {
                keywords: ['yes', 'good', 'okay', 'great'],
                description: 'Thumbs up',
                confidence: 0.9
            },
            'thumbs_down': {
                keywords: ['no', 'bad', 'wrong', 'stop'],
                description: 'Thumbs down',
                confidence: 0.9
            },
            'clap': {
                keywords: ['clap', 'applaud', 'good job', 'bravo'],
                description: 'Clapping hands',
                confidence: 0.8
            },
            'nod': {
                keywords: ['yes', 'agree', 'understand', 'okay'],
                description: 'Nodding head',
                confidence: 0.7
            },
            'shake': {
                keywords: ['no', 'disagree', 'don\'t know', 'maybe'],
                description: 'Shaking head',
                confidence: 0.7
            },
            'drink': {
                keywords: ['thirsty', 'water', 'drink', 'beverage'],
                description: 'Drinking gesture',
                confidence: 0.6
            },
            'eat': {
                keywords: ['hungry', 'food', 'eat', 'meal'],
                description: 'Eating gesture',
                confidence: 0.6
            },
            'help': {
                keywords: ['help', 'assist', 'support', 'please'],
                description: 'Asking for help',
                confidence: 0.7
            }
        };
        
        this.init();
    }

    init() {
        this.video = document.getElementById('camera');
        this.canvas = document.getElementById('gestureCanvas');
        this.ctx = this.canvas?.getContext('2d');
        
        this.setupEventListeners();
        this.setupGestureDetection();
    }

    setupEventListeners() {
        const cameraBtn = document.getElementById('cameraBtn');
        const speakBtn = document.getElementById('speakBtn');
        
        if (cameraBtn) {
            cameraBtn.addEventListener('click', () => {
                this.toggleCamera();
            });
        }
        
        if (speakBtn) {
            speakBtn.addEventListener('click', () => {
                this.speakCurrentGesture();
            });
        }
    }

    setupGestureDetection() {
        // Simple gesture detection using pose estimation
        // In a real implementation, you would use TensorFlow.js or MediaPipe
        this.detectGestures();
    }

    async toggleCamera() {
        if (this.isActive) {
            this.stopCamera();
        } else {
            await this.startCamera();
        }
    }

    async startCamera() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'user'
                }
            });
            
            this.video.srcObject = this.stream;
            this.isActive = true;
            
            // Update UI
            this.updateCameraUI('active');
            this.updateStatus('Camera active - perform gestures');
            
            // Start gesture detection
            this.startGestureDetection();
            
        } catch (error) {
            console.error('Error accessing camera:', error);
            this.showError('Camera access denied. Please allow camera access.');
        }
    }

    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        
        this.isActive = false;
        this.currentGesture = null;
        
        // Update UI
        this.updateCameraUI('inactive');
        this.updateStatus('Camera stopped');
        
        // Stop gesture detection
        this.stopGestureDetection();
    }

    updateCameraUI(state) {
        const cameraBtn = document.getElementById('cameraBtn');
        const cameraOverlay = document.querySelector('.camera-overlay');
        const speakBtn = document.getElementById('speakBtn');
        
        if (cameraBtn) {
            if (state === 'active') {
                cameraBtn.innerHTML = '<span class="camera-icon">📷</span><span>Stop Camera</span>';
                cameraBtn.style.background = '#ef4444';
            } else {
                cameraBtn.innerHTML = '<span class="camera-icon">📷</span><span>Start Camera</span>';
                cameraBtn.style.background = '#6366f1';
            }
        }
        
        if (cameraOverlay) {
            cameraOverlay.style.display = state === 'active' ? 'none' : 'flex';
        }
        
        if (speakBtn) {
            speakBtn.disabled = !this.currentGesture;
        }
    }

    startGestureDetection() {
        if (!this.isActive) return;
        
        // Simulate gesture detection for demo purposes
        // In a real implementation, this would use computer vision
        this.simulateGestureDetection();
    }

    stopGestureDetection() {
        if (this.gestureTimeout) {
            clearTimeout(this.gestureTimeout);
            this.gestureTimeout = null;
        }
    }

    simulateGestureDetection() {
        // Simulate random gesture detection for demo
        const gestureNames = Object.keys(this.gestures);
        const randomGesture = gestureNames[Math.floor(Math.random() * gestureNames.length)];
        
        // Simulate detection after a random delay
        const delay = Math.random() * 3000 + 2000; // 2-5 seconds
        
        this.gestureTimeout = setTimeout(() => {
            if (this.isActive) {
                this.detectGesture(randomGesture);
                // Continue detection
                this.simulateGestureDetection();
            }
        }, delay);
    }

    detectGesture(gestureName) {
        const gesture = this.gestures[gestureName];
        if (!gesture) return;
        
        this.currentGesture = {
            name: gestureName,
            description: gesture.description,
            keywords: gesture.keywords,
            confidence: gesture.confidence
        };
        
        // Update UI
        this.updateGestureDisplay();
        this.updateStatus(`Detected: ${gesture.description}`);
        
        // Enable speak button
        const speakBtn = document.getElementById('speakBtn');
        if (speakBtn) {
            speakBtn.disabled = false;
        }
        
        console.log(`Gesture detected: ${gestureName} (confidence: ${gesture.confidence})`);
    }

    updateGestureDisplay() {
        const outputText = document.getElementById('outputText');
        if (outputText && this.currentGesture) {
            outputText.textContent = this.currentGesture.description;
        }
    }

    speakCurrentGesture() {
        if (!this.currentGesture) return;
        
        // Select a random keyword for the gesture
        const keyword = this.currentGesture.keywords[
            Math.floor(Math.random() * this.currentGesture.keywords.length)
        ];
        
        this.speakText(keyword);
    }

    speakText(text) {
        if (!window.speechSynthesis) {
            this.showError('Speech synthesis not supported');
            return;
        }
        
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Get settings from app
        if (window.symboTalkApp) {
            const settings = window.symboTalkApp.settings;
            utterance.rate = settings.speed || 1;
            utterance.lang = settings.language || 'en-US';
            
            if (settings.voice) {
                const voices = speechSynthesis.getVoices();
                const selectedVoice = voices.find(voice => voice.name === settings.voice);
                if (selectedVoice) {
                    utterance.voice = selectedVoice;
                }
            }
        }
        
        utterance.onstart = () => {
            this.updateStatus('Speaking...');
        };
        
        utterance.onend = () => {
            this.updateStatus('Gesture recognition ready');
        };
        
        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            this.showError('Error speaking text');
        };
        
        window.speechSynthesis.speak(utterance);
        
        // Show notification
        this.showSuccess(`Speaking: "${text}"`);
    }

    // Real gesture detection would go here
    detectGestures() {
        // This is a placeholder for real gesture detection
        // In a real implementation, you would:
        // 1. Use TensorFlow.js or MediaPipe for pose estimation
        // 2. Track hand and body keypoints
        // 3. Classify gestures based on keypoint positions
        // 4. Calculate confidence scores
        
        console.log('Gesture detection system initialized (simulation mode)');
    }

    // Add custom gesture
    addCustomGesture(name, keywords, description, confidence = 0.7) {
        this.gestures[name] = {
            keywords: Array.isArray(keywords) ? keywords : [keywords],
            description: description || name,
            confidence: confidence
        };
    }

    // Get current gesture
    getCurrentGesture() {
        return this.currentGesture;
    }

    // Get all available gestures
    getAvailableGestures() {
        return Object.keys(this.gestures);
    }

    // Reset gesture detection
    reset() {
        this.currentGesture = null;
        this.updateGestureDisplay();
        
        const speakBtn = document.getElementById('speakBtn');
        if (speakBtn) {
            speakBtn.disabled = true;
        }
        
        this.updateStatus('Gesture recognition ready');
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
}

// Initialize gesture manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.gestureManager = new GestureManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GestureManager;
} 