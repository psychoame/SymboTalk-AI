// Service Worker Registration
class ServiceWorkerManager {
    constructor() {
        this.swRegistration = null;
        this.isSupported = 'serviceWorker' in navigator;
        
        this.init();
    }

    async init() {
        if (!this.isSupported) {
            console.warn('Service Worker not supported');
            return;
        }

        try {
            await this.registerServiceWorker();
            this.setupEventListeners();
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }

    async registerServiceWorker() {
        try {
            this.swRegistration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });
            
            console.log('Service Worker registered successfully:', this.swRegistration);
            
            // Check for updates
            this.checkForUpdates();
            
        } catch (error) {
            console.error('Service Worker registration failed:', error);
            throw error;
        }
    }

    setupEventListeners() {
        if (!this.swRegistration) return;

        // Handle service worker updates
        this.swRegistration.addEventListener('updatefound', () => {
            const newWorker = this.swRegistration.installing;
            
            newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    this.showUpdateNotification();
                }
            });
        });

        // Handle service worker messages
        navigator.serviceWorker.addEventListener('message', (event) => {
            this.handleServiceWorkerMessage(event.data);
        });
    }

    checkForUpdates() {
        if (this.swRegistration) {
            this.swRegistration.update();
        }
    }

    showUpdateNotification() {
        if (window.symboTalkApp) {
            window.symboTalkApp.showNotification(
                'New version available! Refresh to update.',
                'info'
            );
        }
    }

    handleServiceWorkerMessage(data) {
        switch (data.type) {
            case 'CACHE_UPDATED':
                console.log('Cache updated:', data.payload);
                break;
            case 'OFFLINE_MODE':
                console.log('App is now offline');
                break;
            case 'ONLINE_MODE':
                console.log('App is now online');
                break;
            default:
                console.log('Service Worker message:', data);
        }
    }

    // Send message to service worker
    sendMessage(message) {
        if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage(message);
        }
    }

    // Get service worker registration
    getRegistration() {
        return this.swRegistration;
    }

    // Check if service worker is active
    isActive() {
        return this.swRegistration && this.swRegistration.active;
    }
}

// Initialize service worker manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.serviceWorkerManager = new ServiceWorkerManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ServiceWorkerManager;
} 