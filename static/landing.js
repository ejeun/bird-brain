let clicks = 0;
const portalContainer = document.getElementById('portalContainer');
const portal = document.querySelector('.portal');

portal.addEventListener('click', () => {
clicks++;
if (clicks === 3) {
    // Create link element
    const link = document.createElement('a');
    link.href = '/transition';
    
    // Replace portal div with link while maintaining the portal appearance
    portal.parentNode.replaceChild(link, portal);
    link.appendChild(portal);
    
    // Add a subtle visual indication that it's now clickable
    portal.style.cursor = 'pointer';
    portal.style.animation = 'pulseGlowRed 2s infinite alternate ease-in-out';
    }
});