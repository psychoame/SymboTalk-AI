// Avatar Animation Manager
class AvatarManager {
    constructor() {
        this.avatar = null;
        this.currentAction = null;
        this.isAnimating = false;
        
        // Animation definitions
        this.animations = {
            // Basic expressions
            'idle': {
                face: '😊',
                duration: 2000,
                description: 'Neutral expression'
            },
            'smile': {
                face: '😄',
                duration: 1500,
                description: 'Happy smile'
            },
            'sad': {
                face: '😢',
                duration: 2000,
                description: 'Sad expression'
            },
            'angry': {
                face: '😠',
                duration: 1500,
                description: 'Angry expression'
            },
            'surprised': {
                face: '😲',
                duration: 1000,
                description: 'Surprised expression'
            },
            'think': {
                face: '🤔',
                duration: 2000,
                description: 'Thinking'
            },
            'sleep': {
                face: '😴',
                duration: 3000,
                description: 'Sleeping'
            },
            'tired': {
                face: '😴',
                duration: 2000,
                description: 'Tired'
            },
            'hungry': {
                face: '😋',
                duration: 1500,
                description: 'Hungry'
            },
            'thirsty': {
                face: '😰',
                duration: 1500,
                description: 'Thirsty'
            },
            
            // Physical actions
            'wave': {
                face: '👋',
                duration: 1000,
                bodyClass: 'wave-animation',
                description: 'Waving hand'
            },
            'clap': {
                face: '👏',
                duration: 800,
                bodyClass: 'clap-animation',
                description: 'Clapping hands'
            },
            'dance': {
                face: '💃',
                duration: 2000,
                bodyClass: 'dance-animation',
                description: 'Dancing'
            },
            'jump': {
                face: '😃',
                duration: 600,
                bodyClass: 'jump-animation',
                description: 'Jumping'
            },
            'point': {
                face: '👉',
                duration: 1000,
                bodyClass: 'point-animation',
                description: 'Pointing'
            },
            'nod': {
                face: '👍',
                duration: 800,
                bodyClass: 'nod-animation',
                description: 'Nodding head'
            },
            'shake': {
                face: '👎',
                duration: 800,
                bodyClass: 'shake-animation',
                description: 'Shaking head'
            },
            'drink': {
                face: '🥤',
                duration: 1500,
                bodyClass: 'drink-animation',
                description: 'Drinking'
            },
            'eat': {
                face: '🍽️',
                duration: 1500,
                bodyClass: 'eat-animation',
                description: 'Eating'
            },
            'rest': {
                face: '😌',
                duration: 2000,
                bodyClass: 'rest-animation',
                description: 'Resting'
            },
            'applaud': {
                face: '👏',
                duration: 1200,
                bodyClass: 'applaud-animation',
                description: 'Applauding'
            },
            'bow': {
                face: '🙇',
                duration: 1500,
                bodyClass: 'bow-animation',
                description: 'Bowing'
            },
            'plead': {
                face: '🙏',
                duration: 1500,
                bodyClass: 'plead-animation',
                description: 'Pleading'
            },
            'help': {
                face: '🆘',
                duration: 1500,
                bodyClass: 'help-animation',
                description: 'Asking for help'
            },
            'stop': {
                face: '✋',
                duration: 1000,
                bodyClass: 'stop-animation',
                description: 'Stop'
            },
            'wait': {
                face: '⏳',
                duration: 2000,
                bodyClass: 'wait-animation',
                description: 'Waiting'
            },
            'come': {
                face: '👋',
                duration: 1000,
                bodyClass: 'come-animation',
                description: 'Come here'
            },
            'go': {
                face: '👋',
                duration: 1000,
                bodyClass: 'go-animation',
                description: 'Go away'
            }
        };
        
        this.init();
    }

    init() {
        this.avatar = document.getElementById('avatar');
        this.addAnimationStyles();
        this.reset();
    }

    addAnimationStyles() {
        if (!document.getElementById('avatar-animations')) {
            const style = document.createElement('style');
            style.id = 'avatar-animations';
            style.textContent = `
                /* Wave Animation */
                .wave-animation {
                    animation: wave 1s ease-in-out;
                }
                @keyframes wave {
                    0%, 100% { transform: rotate(0deg); }
                    25% { transform: rotate(-20deg); }
                    75% { transform: rotate(20deg); }
                }

                /* Clap Animation */
                .clap-animation {
                    animation: clap 0.8s ease-in-out;
                }
                @keyframes clap {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }

                /* Dance Animation */
                .dance-animation {
                    animation: dance 2s ease-in-out infinite;
                }
                @keyframes dance {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    25% { transform: translateY(-10px) rotate(5deg); }
                    50% { transform: translateY(-5px) rotate(-5deg); }
                    75% { transform: translateY(-10px) rotate(5deg); }
                }

                /* Jump Animation */
                .jump-animation {
                    animation: jump 0.6s ease-out;
                }
                @keyframes jump {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }

                /* Point Animation */
                .point-animation {
                    animation: point 1s ease-in-out;
                }
                @keyframes point {
                    0%, 100% { transform: translateX(0); }
                    50% { transform: translateX(10px); }
                }

                /* Nod Animation */
                .nod-animation {
                    animation: nod 0.8s ease-in-out;
                }
                @keyframes nod {
                    0%, 100% { transform: rotate(0deg); }
                    50% { transform: rotate(10deg); }
                }

                /* Shake Animation */
                .shake-animation {
                    animation: shake 0.8s ease-in-out;
                }
                @keyframes shake {
                    0%, 100% { transform: rotate(0deg); }
                    25% { transform: rotate(-10deg); }
                    75% { transform: rotate(10deg); }
                }

                /* Drink Animation */
                .drink-animation {
                    animation: drink 1.5s ease-in-out;
                }
                @keyframes drink {
                    0%, 100% { transform: rotate(0deg); }
                    50% { transform: rotate(15deg); }
                }

                /* Eat Animation */
                .eat-animation {
                    animation: eat 1.5s ease-in-out;
                }
                @keyframes eat {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }

                /* Rest Animation */
                .rest-animation {
                    animation: rest 2s ease-in-out;
                }
                @keyframes rest {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }

                /* Applaud Animation */
                .applaud-animation {
                    animation: applaud 1.2s ease-in-out;
                }
                @keyframes applaud {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }

                /* Bow Animation */
                .bow-animation {
                    animation: bow 1.5s ease-in-out;
                }
                @keyframes bow {
                    0%, 100% { transform: rotate(0deg); }
                    50% { transform: rotate(15deg); }
                }

                /* Plead Animation */
                .plead-animation {
                    animation: plead 1.5s ease-in-out;
                }
                @keyframes plead {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }

                /* Help Animation */
                .help-animation {
                    animation: help 1.5s ease-in-out;
                }
                @keyframes help {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }

                /* Stop Animation */
                .stop-animation {
                    animation: stop 1s ease-in-out;
                }
                @keyframes stop {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }

                /* Wait Animation */
                .wait-animation {
                    animation: wait 2s ease-in-out infinite;
                }
                @keyframes wait {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }

                /* Come Animation */
                .come-animation {
                    animation: come 1s ease-in-out;
                }
                @keyframes come {
                    0%, 100% { transform: translateX(0); }
                    50% { transform: translateX(-10px); }
                }

                /* Go Animation */
                .go-animation {
                    animation: go 1s ease-in-out;
                }
                @keyframes go {
                    0%, 100% { transform: translateX(0); }
                    50% { transform: translateX(10px); }
                }

                /* Avatar body animations */
                .avatar-body {
                    transition: all 0.3s ease-in-out;
                }

                /* Face transition */
                .avatar-face {
                    transition: all 0.3s ease-in-out;
                }
            `;
            document.head.appendChild(style);
        }
    }

    performAction(actionName, confidence = 1.0) {
        if (this.isAnimating) {
            // Queue the action if already animating
            setTimeout(() => this.performAction(actionName, confidence), 500);
            return;
        }

        const animation = this.animations[actionName];
        if (!animation) {
            console.warn(`Unknown action: ${actionName}`);
            return;
        }

        this.currentAction = actionName;
        this.isAnimating = true;

        // Update face
        const faceElement = this.avatar?.querySelector('.avatar-face');
        if (faceElement) {
            faceElement.textContent = animation.face;
        }

        // Add body animation class
        const bodyElement = this.avatar?.querySelector('.avatar-body');
        if (bodyElement && animation.bodyClass) {
            bodyElement.classList.add(animation.bodyClass);
        }

        // Update description
        this.updateDescription(animation.description);

        // Set timeout to reset animation
        setTimeout(() => {
            this.resetAnimation();
        }, animation.duration);

        console.log(`Avatar performing: ${actionName} (confidence: ${confidence})`);
    }

    resetAnimation() {
        this.isAnimating = false;
        this.currentAction = null;

        // Remove all animation classes
        const bodyElement = this.avatar?.querySelector('.avatar-body');
        if (bodyElement) {
            Object.values(this.animations).forEach(animation => {
                if (animation.bodyClass) {
                    bodyElement.classList.remove(animation.bodyClass);
                }
            });
        }

        // Return to idle state
        this.performAction('idle');
    }

    reset() {
        this.isAnimating = false;
        this.currentAction = null;
        
        // Reset to idle state
        const faceElement = this.avatar?.querySelector('.avatar-face');
        if (faceElement) {
            faceElement.textContent = this.animations.idle.face;
        }

        // Remove all animation classes
        const bodyElement = this.avatar?.querySelector('.avatar-body');
        if (bodyElement) {
            Object.values(this.animations).forEach(animation => {
                if (animation.bodyClass) {
                    bodyElement.classList.remove(animation.bodyClass);
                }
            });
        }

        this.updateDescription('Ready to translate your speech into actions');
    }

    updateDescription(description) {
        const actionDesc = document.getElementById('actionDescription');
        if (actionDesc) {
            actionDesc.textContent = description;
        }
    }

    // Add custom animation
    addCustomAnimation(name, face, duration, bodyClass, description) {
        this.animations[name] = {
            face,
            duration: duration || 1000,
            bodyClass,
            description: description || name
        };
    }

    // Get current action
    getCurrentAction() {
        return this.currentAction;
    }

    // Check if animating
    getIsAnimating() {
        return this.isAnimating;
    }

    // Get all available actions
    getAvailableActions() {
        return Object.keys(this.animations);
    }

    // Perform random action
    performRandomAction() {
        const actions = Object.keys(this.animations).filter(action => action !== 'idle');
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        this.performAction(randomAction);
    }

    // Perform sequence of actions
    performSequence(actions, delay = 1000) {
        if (!Array.isArray(actions) || actions.length === 0) return;

        let index = 0;
        const performNext = () => {
            if (index < actions.length) {
                this.performAction(actions[index]);
                index++;
                setTimeout(performNext, delay);
            }
        };

        performNext();
    }
}

// Initialize avatar manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.avatarManager = new AvatarManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AvatarManager;
} 