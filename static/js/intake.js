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
let selectedCount = 0;
    
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

    div.addEventListener('click', () => {
        if (!div.classList.contains('selected') && selectedCount < 3) {
            // window.captions.show(POETRY[index], false);
            div.classList.add('selected');
            selectedCount++;
        }
        if (selectedCount === 3) {
            // Add a class to the collage container to disable hover effects
            collage.classList.add('selection-complete');
            window.captions.show('Understood.');
            window.captions.show(LINES[1]);
            // Wait for the poetry to finish before showing the name form.
            setTimeout(() => {
                nameForm.classList.add('visible');
            }, 3000);
        }
    });
});

const onDOMContentLoaded = () => {
    const canvas = document.getElementById('visualization');
    if (canvas) {
        // Set canvas style to center it
        canvas.style.position = 'absolute';
        canvas.style.top = '50%';
        canvas.style.left = '50%';
        canvas.style.transform = 'translate(-50%, -50%)';
        
        const dataviz = new DataVisualizer(canvas, CANVAS_CONFIG);
        dataviz.setupNodes();
        dataviz.animate();
        
        // Set up a MutationObserver to watch for changes to the canvas display style
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const displayStyle = window.getComputedStyle(canvas).display;
                    if (displayStyle === 'none') {
                        // This function will be called when the canvas display becomes 'none'
                        onCanvasHidden();
                    }
                }
            });
        });
        
        // Start observing the canvas element for style attribute changes
        observer.observe(canvas, { attributes: true });
        
    } else {
        console.error("Canvas element with id 'visualization' not found");
    }

    // Fade out the canvas
    setTimeout(() => {
        window.captions.show(LINES[0]);
        canvas.style.opacity = '0';
        canvas.style.transition = 'opacity 1s ease';
        setTimeout(() => {
            canvas.style.display = 'none';
        }, ANIMATION_TIMING.CANVAS_FADE_OUT_DURATION);
    }, ANIMATION_TIMING.CANVAS_FADE_OUT_DELAY);   
};

// Function that will be called when the canvas is hidden
const onCanvasHidden = () => {
    const collage = document.getElementById('collage');
    if (collage) {
        collage.style.display = 'block';
        collage.style.opacity = '0';
        collage.style.transition = 'opacity 1s ease';
        
        // Fade in the collage
        setTimeout(() => {
            collage.style.opacity = '1';
        }, ANIMATION_TIMING.COLLAGE_FADE_IN_DELAY);
    }
}

// Handle name submission
nameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('nameInput').value;
    const collage = document.getElementById('collage');
    nameForm.classList.remove('visible');
    collage.style.opacity = '0';
    // Fade out the collage.
    setTimeout(() => {
        collage.style.display = 'none';
    }, ANIMATION_TIMING.COLLAGE_FADE_IN_DELAY);
    
    // Continue with the rest of the captions
    for (let i = 2; i < LINES.length; i++) {
        let text = LINES[i].replace('[name]', name);
        window.captions.show(text);
    }
});

document.addEventListener("DOMContentLoaded", () => { 
    const intro = "First we will locate the life processes that match your signature.";
    const follow = "Do not analyze. Locate.";
    window.captions.show(intro);
    window.captions.show(follow, false);
    
    onDOMContentLoaded();
});