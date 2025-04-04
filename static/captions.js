class CaptionSystem {
    constructor() {
        this.container = null;
        this.box = null;
        this.text = null;
        this.queue = [];
        this.isProcessing = false;
        this.currentResolve = null;
        this.waitingForClick = false;
        this.clickHandler = null;
        
        this.init();
    }

    init() {
        // Create and inject HTML
        const container = document.createElement('div');
        container.innerHTML = `
            <div id="caption-container">
                <div id="caption-box">
                    <p id="caption-text"></p>
                </div>
            </div>
        `;
        document.body.appendChild(container.firstElementChild);

        // Store elements
        this.container = document.getElementById('caption-container');
        this.box = document.getElementById('caption-box');
        this.text = document.getElementById('caption-text');

        // Load CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/static/captions.css';
        document.head.appendChild(link);

        // Add global click handler
        document.addEventListener('click', (e) => {
            if (this.waitingForClick) {
                this.handleClick(e);
            }
        });
    }

    show(message, waitForClick = false) {
        this.queue.push({ message, waitForClick });
        
        if (!this.isProcessing) {
            this.processQueue();
        }
    }

    async processQueue() {
        if (this.queue.length === 0) {
            this.isProcessing = false;
            return;
        }

        this.isProcessing = true;
        const { message, waitForClick } = this.queue.shift();

        // Display caption
        this.text.textContent = message;
        this.box.classList.add('visible');

        if (waitForClick) {
            this.waitingForClick = true;
            this.box.classList.add('waiting-for-click');
            await new Promise(resolve => {
                this.currentResolve = resolve;
            });
            this.waitingForClick = false;
            this.box.classList.remove('waiting-for-click');
        } else {
            // Wait for default duration
            await new Promise(resolve => {
                this.currentResolve = resolve;
                setTimeout(resolve, 3000);
            });
        }

        // Hide caption
        this.box.classList.remove('visible');
        await new Promise(resolve => setTimeout(resolve, 300));

        // Process next in queue
        this.processQueue();
    }

    handleClick(event) {
        if (this.currentResolve) {
            this.currentResolve();
            this.currentResolve = null;
        }
    }

    // Optional: Add method to skip current caption
    next() {
        if (this.currentResolve) {
            this.currentResolve();
            this.currentResolve = null;
        }
    }

    hasQueuedCaptions() {
        return this.queue.length > 0 || this.isProcessing;
    }

    getQueueLength() {
        return this.queue.length;
    }

    getCurrentCaption() {
        return this.isProcessing ? this.text.textContent : null;
    }

    getQueueStatus() {
        return {
            queueLength: this.queue.length,
            isProcessing: this.isProcessing,
            currentCaption: this.getCurrentCaption(),
            waitingForClick: this.waitingForClick
        };
    }
}

// Create global instance
window.captions = new CaptionSystem(); 
console.log("Caption system initialized");