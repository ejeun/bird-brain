let clicks = 0;
const portalContainer = document.getElementById('portalContainer');
const portal = document.querySelector('.portal');
const overlay = document.querySelector('.overlay');

portal.addEventListener('click', () => {
clicks++;
if (clicks === 3) {
    // Add a subtle visual indication that it's now clickable
    portal.style.cursor = 'pointer';
    portal.style.animation = 'pulseGlowRed 2s infinite alternate ease-in-out';
    }
if (clicks === 4) {
    overlay.classList.add('fade-out');
    setTimeout(() => {
        window.location.href = '/transition';
    }, 1000);
    }
});