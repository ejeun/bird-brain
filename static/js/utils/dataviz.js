/**
 * Data Visualization Utilities
 *
 * This file contains utility functions for creating and managing data visualizations
 * across the application.
 */

export class DataVisualizer {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.nodes = [];
    this.ctx = canvas.getContext('2d');
    this.options = {
      width: options.width || 800,
      height: options.height || 800,
      backgroundColor: options.backgroundColor || 'transparent',
      ...options,
    };

    this.setupCanvas();
  }

  setupCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();

    this.canvas.width = this.options.width * dpr;
    this.canvas.height = this.options.height * dpr;
    this.ctx.scale(dpr, dpr);

    this.centerX = this.options.width / 2;
    this.centerY = this.options.height / 2;

    if (this.options.backgroundColor !== 'transparent') {
      this.ctx.fillStyle = this.options.backgroundColor;
      this.ctx.fillRect(0, 0, this.options.width, this.options.height);
    }
  }

  _createNode() {
    const angle = Math.random() * Math.PI * 2;
    const radius = 150 + Math.random() * 100;
    const speed = 0.001 + Math.random() * 0.002;

    return {
      angle,
      radius,
      speed,
      x: 0,
      y: 0,
    };
  }

  _updateNodePosition(node) {
    node.x = Math.cos(node.angle) * node.radius + this.centerX;
    node.y = Math.sin(node.angle) * node.radius + this.centerY;
    return node;
  }

  setupNodes(nodeCount = 150) {
    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
      this.nodes.push(this._createNode());
    }
  }

  // Animation loop
  animate(connectionRadius = 80) {
    const nodes = this.nodes;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw connections
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      node.angle += node.speed;
      this._updateNodePosition(node);

      // Draw connections
      for (let j = i + 1; j < nodes.length; j++) {
        const other = nodes[j];
        const dx = node.x - other.x;
        const dy = node.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionRadius) {
          const opacity = 1 - distance / connectionRadius;
          this.ctx.beginPath();
          this.ctx.moveTo(node.x, node.y);
          this.ctx.lineTo(other.x, other.y);
          this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.4})`;
          this.ctx.stroke();
        }
      }
    }

    // Draw nodes
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    nodes.forEach((node) => {
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
      this.ctx.fill();
    });

    requestAnimationFrame(() => this.animate(connectionRadius));
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // Draw a circle with optional gradient
  drawCircle(x, y, radius, options = {}) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);

    if (options.gradient) {
      const gradient = this.ctx.createRadialGradient(
        x,
        y,
        options.gradient.innerRadius || 0,
        x,
        y,
        options.gradient.outerRadius || radius,
      );

      options.gradient.stops.forEach((stop) => {
        gradient.addColorStop(stop.position, stop.color);
      });

      this.ctx.fillStyle = gradient;
    } else if (options.fillStyle) {
      this.ctx.fillStyle = options.fillStyle;
    }

    if (options.fill) {
      this.ctx.fill();
    }

    if (options.strokeStyle) {
      this.ctx.strokeStyle = options.strokeStyle;
      this.ctx.lineWidth = options.lineWidth || 1;
      this.ctx.stroke();
    }
  }

  // Draw a line between two points
  drawLine(x1, y1, x2, y2, options = {}) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);

    if (options.strokeStyle) {
      this.ctx.strokeStyle = options.strokeStyle;
      this.ctx.lineWidth = options.lineWidth || 1;
      this.ctx.stroke();
    }
  }

  // Draw text on the canvas
  drawText(text, x, y, options = {}) {
    this.ctx.font = options.font || '16px Arial';
    this.ctx.fillStyle = options.fillStyle || '#ffffff';
    this.ctx.textAlign = options.textAlign || 'center';
    this.ctx.textBaseline = options.textBaseline || 'middle';
    this.ctx.fillText(text, x, y);
  }

  // Create a particle system
  createParticles(count, options = {}) {
    const particles = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: options.x || this.centerX,
        y: options.y || this.centerY,
        radius: options.radius || Math.random() * 3 + 1,
        color:
          options.color || `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`,
        speedX: options.speedX || (Math.random() - 0.5) * 2,
        speedY: options.speedY || (Math.random() - 0.5) * 2,
        life: options.life || 100,
        maxLife: options.life || 100,
      });
    }

    return particles;
  }

  // Update and draw particles
  updateParticles(particles) {
    particles.forEach((particle, index) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      particle.life--;

      if (particle.life <= 0) {
        particles.splice(index, 1);
        return;
      }

      const opacity = particle.life / particle.maxLife;
      this.ctx.globalAlpha = opacity;

      this.drawCircle(particle.x, particle.y, particle.radius, {
        fillStyle: particle.color,
        fill: true,
      });
    });

    this.ctx.globalAlpha = 1;
    return particles;
  }
}
