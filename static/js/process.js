import { LINES } from './constants.js';

document.addEventListener("DOMContentLoaded", () => { 
    window.captions.show(LINES[2]);
    window.captions.show(LINES[3]);
    onDOMContentLoaded();
});

const onDOMContentLoaded = () => {
    // Show an animation of light sparking in mycelium.
};

const onClick = () => {
    // Show a carousel of videos of bird migrations.
    const carousel = document.getElementById('carousel');
    carousel.style.display = 'block';
    carousel.style.transition = 'opacity 1s ease';
    setTimeout(() => {
        carousel.style.opacity = '1';
    }, 1000);

    for (let i = 0; i < 3; i++) {
        const video = document.createElement('video');
        video.src = `/static/videos/birds/${i}.mp4`;
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.style.width = '100%';
        video.style.height = '100%';    
        video.addEventListener('click', () => {});
        carousel.appendChild(video);
    }

    window.captions.show(LINES[4]);
    window.captions.show(LINES[5]);
}

const onSelectionComplete = () => {
    window.captions.show(LINES[6]);

};