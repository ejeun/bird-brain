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
    this.audioContext = null;

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

  async generateMuffledSpeech(text) {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
    }

    // Calculate number of sounds based on text length
    const numSounds = Math.max(3, Math.min(8, Math.floor(text.length / 5)));
    const baseDuration = Math.min(text.length * 30, 1500); // Shorter base duration for overlap

    // Create multiple overlapping sounds
    for (let i = 0; i < numSounds; i++) {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      const filter = this.audioContext.createBiquadFilter();

      // Configure filter for deeper muffled effect
      filter.type = 'lowpass';
      filter.frequency.value = 400 + Math.random() * 200; // Lower filter frequency
      filter.Q.value = 0.8 + Math.random() * 0.4;

      // Configure gain for volume control
      gainNode.gain.value = 0.05 + Math.random() * 0.05;

      // Connect nodes
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Generate random frequency between 80-200 Hz for deep male voice
      oscillator.frequency.value = 80 + Math.random() * 120;

      // Add slower frequency modulation for deeper voice
      const modulator = this.audioContext.createOscillator();
      const modGain = this.audioContext.createGain();
      modulator.frequency.value = 3 + Math.random() * 3; // Exactly 3-6 Hz modulation
      modGain.gain.value = 3 + Math.random() * 3; // Less modulation depth for stability
      modulator.connect(modGain);
      modGain.connect(oscillator.frequency);

      // Start oscillators with slight delay between each
      const startDelay = (i * (baseDuration / numSounds)) / 1000;
      oscillator.start(this.audioContext.currentTime + startDelay);
      modulator.start(this.audioContext.currentTime + startDelay);

      // Calculate duration with some randomness
      const duration = baseDuration + (Math.random() * 500 - 250);

      // Create envelope for natural fade
      gainNode.gain.setValueAtTime(
        0,
        this.audioContext.currentTime + startDelay,
      );
      gainNode.gain.linearRampToValueAtTime(
        gainNode.gain.value,
        this.audioContext.currentTime + startDelay + 0.1,
      );
      gainNode.gain.linearRampToValueAtTime(
        0,
        this.audioContext.currentTime + startDelay + duration / 1000,
      );

      // Stop oscillators after duration
      setTimeout(
        () => {
          oscillator.stop();
          modulator.stop();
        },
        duration + startDelay * 1000,
      );
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

    // Generate muffled speech for the message
    this.generateMuffledSpeech(message);

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
