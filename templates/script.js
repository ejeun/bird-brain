const canvas = document.getElementById('portal');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let time = 0;

function drawPortal() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const x = canvas.width / 2;
  const y = canvas.height / 2;
  const radius = 100 + Math.sin(time / 20) * 10;

  for (let i = 0; i < 30; i++) {
    const angle = (i / 30) * Math.PI * 2 + time / 50;
    const r = radius + Math.sin(time / 15 + i) * 5;
    const px = x + Math.cos(angle) * r;
    const py = y + Math.sin(angle) * r;

    ctx.beginPath();
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    const brightness = 0.7 + Math.sin(time / 20 + i) * 0.3;
    ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
    ctx.fill();
  }

  time++;
  requestAnimationFrame(drawPortal);
}

drawPortal();

document.getElementById('enterPortal').addEventListener('click', () => {
  alert('PORTAL ACTIVATED\n\nYou are no longer singular.');
  // Here you could redirect or trigger further animations
});

// Toggle logs functionality
document.getElementById('toggleLogs').addEventListener('click', () => {
  console.log('toggleLogs clicked');
  const logDiv = document.getElementById('log');
  logDiv.classList.toggle('hidden');
  if (!logDiv.classList.contains('hidden')) {
    // Add visible class after a small delay to trigger the transition
    console.log('visible');
    setTimeout(() => logDiv.classList.add('visible'), 10);
  } else {
    logDiv.classList.remove('visible');
  }
});
