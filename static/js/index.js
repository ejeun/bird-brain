let time = 0;

const loadingTexts = [
  'self-decomposition protocol initiated',
  'biological signature analysis in progress',
  'cloning via non-localized energetic signatures enabled',
];

async function typeWriter(element, text) {
  element.textContent = ''; // Clear initial space
  element.classList.add('visible');
  element.textContent = text;
}

async function startTypewriter() {
  const elements = document.querySelectorAll('.typewriter');
  for (let i = 0; i < elements.length; i++) {
    await typeWriter(elements[i], loadingTexts[i]);
    await new Promise((resolve) => setTimeout(resolve, 800)); // Longer pause between lines
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Check if this is the first visit
  if (!localStorage.getItem('hasVisited')) {
    startTypewriter();
    localStorage.setItem('hasVisited', 'true');
  } else {
    // If not first visit, just show the text immediately
    const elements = document.querySelectorAll('.typewriter');
    elements.forEach((element, i) => {
      element.textContent = loadingTexts[i];
      element.classList.add('visible');
    });
  }
});

// function drawPortal() {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);

//   const x = canvas.width / 2;
//   const y = canvas.height / 2;
//   const radius = 100 + Math.sin(time / 20) * 10;

//   for (let i = 0; i < 30; i++) {
//     const angle = (i / 30) * Math.PI * 2 + time / 50;
//     const r = radius + Math.sin(time / 15 + i) * 5;
//     const px = x + Math.cos(angle) * r;
//     const py = y + Math.sin(angle) * r;

//     ctx.beginPath();
//     ctx.arc(px, py, 3, 0, Math.PI * 2);
//     const brightness = 0.7 + Math.sin(time / 20 + i) * 0.3;
//     ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
//     ctx.fill();
//   }

//   time++;
//   requestAnimationFrame(drawPortal);
// }

// drawPortal();

// Toggle logs functionality
document.getElementById('toggleLogs').addEventListener('click', () => {
  const logDiv = document.getElementById('log');
  logDiv.classList.toggle('hidden');
  if (!logDiv.classList.contains('hidden')) {
    // Add visible class after a small delay to trigger the transition
    setTimeout(() => logDiv.classList.add('visible'), 10);
  } else {
    logDiv.classList.remove('visible');
  }
});
