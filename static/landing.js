let clicks = 0;
const portalContainer = document.getElementById('portalContainer');
const portal = document.querySelector('.portal');
const overlay = document.querySelector('.overlay');

// Show initial caption
window.captions.show("[Closed captioning sponsored by the Keki Fund]");

// Show a caption for 5 seconds
window.captions.show("Are you ready to move on?");

const isShowingCaptions = () => {
    if (window.captions.hasQueuedCaptions()) {
        return true;
    }
    return false;
}

const checkInterval = setInterval(() => {
    if (isShowingCaptions()) {
        portal.style.pointerEvents = 'none';
    } else {
        portal.style.pointerEvents = 'auto';
    }
}, 100);


portal.addEventListener('click', () => {
clicks++;
if (clicks === 1) {
    window.captions.show("Welcome to the Decompositor.");
    window.captions.show("Your identity synchronization and biometric access have been confirmed.");
}
if (clicks === 2) {
    if (window.captions.waitingForClick) {
        window.captions.next();
    }
    window.captions.show("I am Ejeun, the inventor of this machine and I will be your guide.");
    window.captions.show("The process will take approximately 10 minutes.");
}
if (clicks === 3) {
    if (window.captions.waitingForClick) {
        window.captions.next();
    }
    // Audio.play();
    // Add a subtle visual indication that it's now clickable
    clearInterval(checkInterval);
    portal.style.cursor = 'pointer';
    portal.style.animation = 'pulseGlowRed 2s infinite alternate ease-in-out';
    window.captions.show("Please keep still and do not move.");
    window.captions.show("You may hear a loud noise.");
    }
if (clicks === 4) {
    if (window.captions.waitingForClick) {
        window.captions.next();
    }
    window.captions.show("Let's dissolve you.");
    overlay.classList.add('fade-out');
    setTimeout(() => {
        window.location.href = '/step1';
    }, 3000);
    }
});
