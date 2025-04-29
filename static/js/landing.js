let clicks = 0;
const portalContainer = document.getElementById('portalContainer');
const portal = document.querySelector('.portal');
const overlay = document.querySelector('.overlay');

// Initialize audio elements
const backgroundAudio = new Audio('/static/media/background.mp3');
backgroundAudio.loop = true;
backgroundAudio.volume = 0.9;
const portalAudio = new Audio('/static/media/portal.wav');
portalAudio.volume = 0.5;

// Initialize Web Audio API context and nodes for shuffle sound
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let shuffleBuffer = null;
let shuffleSource = null;
const shuffleGain = audioContext.createGain();
shuffleGain.gain.value = 3.0; // Set gain to 2.0 (200% volume)
shuffleGain.connect(audioContext.destination);

fetch('/static/media/shuffle.wav')
  .then((response) => response.arrayBuffer())
  .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
  .then((audioBuffer) => {
    shuffleBuffer = audioBuffer;
  })
  .catch((e) => console.error('Error loading shuffle sound:', e));

// Function to play shuffle sound with increased volume
function playShuffleSound() {
  if (shuffleBuffer) {
    // Stop any existing playback
    if (shuffleSource) {
      shuffleSource.stop();
    }

    // Create new source and connect to gain node
    shuffleSource = audioContext.createBufferSource();
    shuffleSource.buffer = shuffleBuffer;
    shuffleSource.connect(shuffleGain);
    shuffleSource.loop = true; // Enable looping
    shuffleSource.start(0);
  }
}

// Show initial caption
window.captions.show('[Closed captioning sponsored by the Keki Fund]', false);

// Show a caption for 5 seconds
window.captions.show('Are you ready to move on?');

const isShowingCaptions = () => {
  if (window.captions.hasQueuedCaptions()) {
    return true;
  }
  return false;
};

const checkInterval = setInterval(() => {
  if (isShowingCaptions()) {
    portal.style.pointerEvents = 'none';
  } else {
    portal.style.pointerEvents = 'auto';
  }
}, 100);

// Add click handler to the entire document for background audio
document.addEventListener('click', () => {
  if (clicks === 0) {
    backgroundAudio
      .play()
      .catch((e) => console.error('Background audio playback failed:', e));
  }
});

portal.addEventListener('click', () => {
  clicks++;
  if (clicks === 1) {
    portalAudio.play();
    window.captions.show('Welcome to the Decompositor.');
    window.captions.show('Your biometric access has been confirmed.');
  }
  if (clicks === 2) {
    portalAudio.currentTime = 0;
    portalAudio.play();
    if (window.captions.waitingForClick) {
      window.captions.next();
    }
    window.captions.show(
      'I am Ejeun, the inventor of this machine and I will be your guide.',
    );
    window.captions.show('The process will take approximately 10 minutes.');
  }
  if (clicks === 3) {
    if (window.captions.waitingForClick) {
      window.captions.next();
    }
    playShuffleSound(); // Play shuffle sound with increased volume
    clearInterval(checkInterval);
    portal.style.cursor = 'pointer';
    portal.style.animation = 'pulseGlowRed 0.5s infinite alternate ease-in-out';
    window.captions.show('Please keep still and do not move.');
    window.captions.show('You may hear a loud noise.');
  }
  if (clicks === 4) {
    if (window.captions.waitingForClick) {
      window.captions.next();
    }
    window.captions.show('Let\'s dissolve you.');
    overlay.classList.add('fade-out');
    setTimeout(() => {
      window.location.href = '/intake';
    }, 3000);
  }
});

// Increase volume gradually over time
const increaseVolume = (audio, targetVolume = 1.0, duration = 2000) => {
  const startVolume = audio.volume;
  const startTime = Date.now();

  function updateVolume() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    audio.volume = startVolume + (targetVolume - startVolume) * progress;

    if (progress < 1) {
      requestAnimationFrame(updateVolume);
    }
  }

  updateVolume();
};
