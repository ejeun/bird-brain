import { DataVisualizer } from './utils/dataviz.js';
import {
  LINES,
  COLLAGE_IMAGES,
  ANIMATION_TIMING,
  CANVAS_CONFIG,
} from './constants.js';

const body = document.body;
const collage = document.getElementById('collage');
const nameForm = document.getElementById('nameForm');
const canvas = document.getElementById('visualization');
let selectedCount = 0;

// Create virtual keyboard
const createVirtualKeyboard = () => {
  const keyboard = document.createElement('div');
  keyboard.className = 'virtual-keyboard';

  const keys = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    '⌫',
    '↵',
  ];

  keys.forEach((key) => {
    const keyButton = document.createElement('button');
    keyButton.textContent = key;

    keyButton.addEventListener('click', () => {
      const nameInput = document.getElementById('nameInput');
      if (key === '⌫') {
        nameInput.value = nameInput.value.slice(0, -1);
      } else if (key === '↵') {
        if (nameInput.value.length > 0) {
          nameForm.dispatchEvent(new Event('submit'));
        }
      } else {
        if (nameInput.value.length < 20) {
          nameInput.value += key;
        }
      }
    });

    keyboard.appendChild(keyButton);
  });

  return keyboard;
};

const backgroundAudio = new Audio('/static/media/ocean.wav');
backgroundAudio.loop = true;
backgroundAudio.volume = 0.6;
backgroundAudio.play();

const onLoad = async () => {
  const intro =
    'First we will locate the life processes that match your signature.';
  const follow = 'Do not analyze. Locate.';
  window.captions.show(intro);
  window.captions.show(follow, false);

  if (!canvas) {
    console.error('Canvas element with id \'visualization\' not found');
  }
  const dataviz = new DataVisualizer(canvas, CANVAS_CONFIG);
  dataviz.setupNodes();
  dataviz.animate();

  function fadeOutCanvas(resolve) {
    setTimeout(() => {
      window.captions.show(LINES[0]);
      canvas.style.opacity = '0';
      canvas.style.transition = 'opacity 1s ease';
      // dataviz.radialScatter();
      setTimeout(() => {
        canvas.remove();
        resolve();
      }, ANIMATION_TIMING.CANVAS_FADE_OUT_DURATION);
    }, ANIMATION_TIMING.CANVAS_FADE_OUT_DELAY);
  }

  // Fade out the canvas after the delay.
  await new Promise((resolve) => fadeOutCanvas(resolve));

  if (!collage) {
    console.error('Collage element with id \'collage\' not found');
  }
  // Fade in the collage after the delay.
  setTimeout(() => {
    collage.style.opacity = '1';
    body.style.height = '13500px';
  }, ANIMATION_TIMING.COLLAGE_FADE_IN_DELAY);
  setTimeout(() => {
    collage.classList.remove('inactive');
  }, ANIMATION_TIMING.COLLAGE_FADE_IN_DELAY + 3000);
};

document.addEventListener('DOMContentLoaded', onLoad);
// Create and position images
const articles = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
];

// Helper function to shuffle array
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Possible positions
const POSITIONS = [
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
  'center',
];

// Shuffle the images and take only as many as we have articles
const shuffledImages = shuffleArray(COLLAGE_IMAGES).slice(0, articles.length);

// Place one unique image in each article
articles.forEach((articleClass, index) => {
  const article = document.querySelector(`.${articleClass}`);
  if (article && shuffledImages[index]) {
    const img = shuffledImages[index];
    const image = document.createElement('img');
    image.src = img.src;
    image.style.maxWidth = img.width;
    image.style.height = 'auto';
    image.style.position = 'absolute';
    image.classList.add('collage-item');

    // Wait for image to load to get its dimensions
    image.onload = () => {
      // Randomly select a position
      const position = POSITIONS[Math.floor(Math.random() * POSITIONS.length)];
      const jiggleAmount = 50; // Maximum pixels to jiggle in any direction
      const jiggleX = (Math.random() + 0.5) * jiggleAmount;
      const jiggleY = (Math.random() + 0.5) * jiggleAmount;

      if (position === 'center') {
        image.style.left = '50%';
        image.style.top = '50%';
      } else if (position === 'top-left') {
        image.style.left = `${jiggleX}px`;
        image.style.top = `${jiggleY}px`;
      } else if (position === 'top-right') {
        image.style.right = `${jiggleX}px`;
        image.style.top = `${jiggleY}px`;
      } else if (position === 'bottom-left') {
        image.style.bottom = `${jiggleX}px`;
        image.style.left = `${jiggleY}px`;
      } else if (position === 'bottom-right') {
        image.style.right = `${jiggleX}px`;
        image.style.bottom = `${jiggleY}px`;
      }

      article.appendChild(image);
    };

    const onImageClick = () => {
      if (!image.classList.contains('selected') && selectedCount < 3) {
        image.classList.add('selected');
      }
      if (selectedCount === 3) {
        // Add a class to the collage container to disable hover effects
        collage.classList.add('inactive');
        // Fade out the collage.
        setTimeout(() => {
          collage.style.opacity = '0.35';
          collage.style.transition = 'opacity 1s ease';
        }, ANIMATION_TIMING.COLLAGE_FADE_OUT_DELAY);

        window.captions.show('Understood.');
        window.captions.show(LINES[1]);
        setTimeout(() => {
          nameForm.classList.add('visible');
        }, ANIMATION_TIMING.FORM_DELAY);
      }
      selectedCount++;
    };
    image.addEventListener('click', onImageClick);
  }
});

// Handle name submission
nameForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('nameInput').value.trim();

  // Validate name input
  if (!name) {
    // Add visual feedback for empty input
    const nameInput = document.getElementById('nameInput');
    nameInput.style.borderColor = 'red';
    nameInput.style.animation = 'shake 0.5s';

    // Remove animation after it completes
    setTimeout(() => {
      nameInput.style.animation = '';
      nameInput.style.borderColor = '';
    }, 500);

    return;
  }

  const collage = document.getElementById('collage');
  const keyboard = document.querySelector('.virtual-keyboard');

  // Save name to localStorage
  localStorage.setItem('userName', name);

  // Remove keyboard
  if (keyboard) {
    keyboard.style.opacity = '0';
    setTimeout(() => keyboard.remove(), 500);
  }

  setTimeout(() => {
    nameForm.classList.remove('visible');
  }, 100);

  setTimeout(() => {
    collage.style.opacity = '0';
    // Fade out the collage.
    setTimeout(() => {
      collage.style.display = 'none';
    }, ANIMATION_TIMING.COLLAGE_FADE_IN_DELAY);
  }, 100);

  // Continue with the rest of the captions
  for (let i = 2; i < 4; i++) {
    let text = LINES[i].replace('[name]', name);
    window.captions.show(text);
  }

  // Redirect to the process page.
  setTimeout(() => {
    window.location.href = '/process';
  }, 5000);
});

// Show keyboard when name form becomes visible
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.target.classList.contains('visible')) {
      const keyboard = createVirtualKeyboard();
      document.body.appendChild(keyboard);
      // Disable physical keyboard input
      document.getElementById('nameInput').readOnly = true;
    }
  });
});

observer.observe(nameForm, { attributes: true });

window.onload = () => {
  const root = document.querySelector(':root');
  root.style.setProperty(
    '--vh',
    Math.min(640, Math.floor(window.innerHeight * 0.85)) + 'px',
  );

  handleScroll();
};

window.onscroll = () => handleScroll();

function handleScroll() {
  if (window.innerWidth > 800) {
    const root = document.querySelector(':root');
    root.style.setProperty('--scroll', Math.floor(window.scrollY) + 'px');

    root.style.setProperty(
      '--visible',
      (Math.floor(window.scrollY - 17000) / -100).toFixed(1),
    );
  }
}
