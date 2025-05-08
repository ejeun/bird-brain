class CaptionSystem {
  constructor(fontSize = '1.2em') {
    this.container = null;
    this.box = null;
    this.text = null;
    this.queue = [];
    this.isProcessing = false;
    this.currentResolve = null;
    this.waitingForClick = false;
    this.wordDelay = 150; // ms between words
    this.currentWords = [];
    this.currentWordIndex = 0;
    this.wordInterval = null;
    this.fontSize = fontSize;

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
    this.text.style.fontSize = this.fontSize;

    // Load CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/static/css/captions.css';
    document.head.appendChild(link);

    // Add global click handler
    document.addEventListener('click', (e) => {
      if (this.waitingForClick) {
        this.handleClick(e);
      }
    });
  }

  show(message, teleprompterMode = true) {
    this.queue.push({ message, teleprompterMode });

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
    const { message, teleprompterMode } = this.queue.shift();

    // Skip display for empty messages but maintain pause
    if (!message || message.trim() === '') {
      await new Promise((resolve) => {
        this.currentResolve = resolve;
        setTimeout(resolve, 3000);
      });
      this.processQueue();
      return;
    }

    // Display caption
    this.box.classList.add('visible');

    if (teleprompterMode) {
      // Split message into words and start teleprompter
      this.currentWords = message.split(' ');
      this.currentWordIndex = 0;
      this.text.textContent = '';

      // Start teleprompter
      this.startTeleprompter();

      // Wait for teleprompter to finish
      await new Promise((resolve) => {
        this.currentResolve = resolve;
        // Calculate approximate time based on word count
        const totalTime = this.currentWords.length * this.wordDelay + 1000; // Add 1s buffer
        setTimeout(resolve, totalTime);
      });
    } else {
      // Show full line immediately
      this.text.textContent = message;

      // Wait for default duration
      await new Promise((resolve) => {
        this.currentResolve = resolve;
        setTimeout(resolve, 3000);
      });
    }

    // Clear any running teleprompter
    if (this.wordInterval) {
      clearInterval(this.wordInterval);
      this.wordInterval = null;
    }

    // Hide caption
    this.box.classList.remove('visible');
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Process next in queue
    this.processQueue();
  }

  startTeleprompter() {
    if (this.wordInterval) {
      clearInterval(this.wordInterval);
    }

    this.wordInterval = setInterval(() => {
      if (this.currentWordIndex < this.currentWords.length) {
        // Add next word
        this.text.textContent +=
          (this.currentWordIndex > 0 ? ' ' : '') +
          this.currentWords[this.currentWordIndex];
        this.currentWordIndex++;
      } else {
        // Teleprompter finished
        clearInterval(this.wordInterval);
        this.wordInterval = null;
      }
    }, this.wordDelay);
  }

  handleClick(event) {
    if (this.currentResolve) {
      this.currentResolve();
      this.currentResolve = null;
    }
  }

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
      waitingForClick: this.waitingForClick,
      teleprompterMode: this.teleprompterMode,
    };
  }
}

// Create global instance
// window.captions = new CaptionSystem('1.5em');
window.captions = new CaptionSystem();
console.log('Caption system initialized');
