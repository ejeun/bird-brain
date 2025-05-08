const canvas = document.getElementById('portal');
const ctx = canvas.getContext('2d');

// Set canvas size to window size
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Portal parameters
const particles = [];
const particleCount = 100;
const maxRadius = 2;
const speed = 0.5;

// Create particles
for (let i = 0; i < particleCount; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * maxRadius,
    speedX: (Math.random() - 0.5) * speed,
    speedY: (Math.random() - 0.5) * speed,
    opacity: Math.random(),
  });
}

// Animation loop
function animate() {
  ctx.fillStyle = 'rgba(51, 51, 51, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle) => {
    // Update position
    particle.x += particle.speedX;
    particle.y += particle.speedY;

    // Wrap around screen
    if (particle.x < 0) particle.x = canvas.width;
    if (particle.x > canvas.width) particle.x = 0;
    if (particle.y < 0) particle.y = canvas.height;
    if (particle.y > canvas.height) particle.y = 0;

    // Draw particle
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
    ctx.fill();
  });

  requestAnimationFrame(animate);
}

animate();
