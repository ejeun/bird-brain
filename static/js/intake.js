import { DataVisualizer } from './utils/dataviz.js';
import { 
    LINES, 
    POETRY,
    COLLAGE_IMAGES, 
    ANIMATION_TIMING, 
    CANVAS_CONFIG 
} from './constants.js';

const collage = document.getElementById('collage');
const nameForm = document.getElementById('nameForm');
const canvas = document.getElementById('visualization');
let selectedCount = 0;

const onLoad = async () => {
    const intro = "First we will locate the life processes that match your signature.";
    const follow = "Do not analyze. Locate.";
    window.captions.show(intro);
    window.captions.show(follow, false);
    
    if (!canvas) {
        console.error("Canvas element with id 'visualization' not found");
    }
    const dataviz = new DataVisualizer(canvas, CANVAS_CONFIG);
    dataviz.setupNodes();
    dataviz.animate();

    function fadeOutCanvas(resolve) {
        setTimeout(() => {
            window.captions.show(LINES[0]);
            canvas.style.opacity = '0';
            canvas.style.transition = 'opacity 1s ease';
            setTimeout(() => {
                canvas.remove();
                resolve();
            }, ANIMATION_TIMING.CANVAS_FADE_OUT_DURATION);
        }, ANIMATION_TIMING.CANVAS_FADE_OUT_DELAY);
    }

    // Fade out the canvas after the delay.
    await new Promise(resolve => fadeOutCanvas(resolve));

    if (!collage) {
        console.error("Collage element with id 'collage' not found");
    }
    // Fade in the collage after the delay.
    setTimeout(() => {
        collage.style.opacity = '1';
    }, ANIMATION_TIMING.COLLAGE_FADE_IN_DELAY);
    setTimeout(() => {
        collage.classList.remove('inactive');
    }, ANIMATION_TIMING.COLLAGE_FADE_IN_DELAY + 3000);
};

document.addEventListener("DOMContentLoaded", onLoad);
// Create and position images
COLLAGE_IMAGES.forEach((img, index) => {
    const div = document.createElement('div');
    div.className = 'collage-item';
    div.style.width = img.width;
    div.style.top = img.top;
    div.style.left = img.left;
    
    const image = document.createElement('img');
    image.src = img.src;
    image.style.width = '100%';
    image.style.height = 'auto';
    
    div.appendChild(image);
    collage.appendChild(div);

    const onImageClick = () => {
        if (!div.classList.contains('selected') && selectedCount < 3) {
            div.classList.add('selected');
            selectedCount++;
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
    }
    div.addEventListener('click', onImageClick);
});

// Handle name submission
nameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('nameInput').value;
    const collage = document.getElementById('collage');

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
    for (let i = 2; i < LINES.length; i++) {
        let text = LINES[i].replace('[name]', name);
        window.captions.show(text);
    }
});
