// src/services/animationEngine.ts
import { AnimationConfig, ParticleConfig, AnimationState } from '@/types/animations';

export class AnimationEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: ParticleConfig[] = [];
  private animationFrame: number | null = null;
  private config: AnimationConfig;
  private state: AnimationState;
  private lastTime: number = 0;

  constructor(canvas: HTMLCanvasElement, config: AnimationConfig) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get 2D context');
    }
    this.ctx = context;
    this.config = config;
    
    this.state = {
      id: config.id,
      active: false,
      progress: 0,
      startTime: Date.now(),
      endTime: Date.now() + (config.schedule[0]?.duration || 5) * 60000,
      paused: false
    };

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  private resizeCanvas(): void {
    const parent = this.canvas.parentElement;
    if (parent) {
      this.canvas.width = parent.clientWidth;
      this.canvas.height = parent.clientHeight;
    }
  }

  start(): void {
    this.state.active = true;
    this.state.startTime = Date.now();
    this.initParticles();
    this.animate(Date.now());
  }

  stop(): void {
    this.state.active = false;
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    this.particles = [];
    this.clear();
  }

  pause(): void {
    this.state.paused = true;
  }

  resume(): void {
    this.state.paused = false;
    this.animate(Date.now());
  }

  private initParticles(): void {
    const particleCount = this.config.visual.particles || 100;
    
    switch (this.config.visual.type) {
      case 'fire-burn':
        this.initFireParticles(particleCount);
        break;
      case 'fireworks':
        this.initFireworksParticles(particleCount);
        break;
      case 'firecrackers':
        this.initFirecrackersParticles(particleCount);
        break;
      case 'moving-fire':
        this.initMovingFireParticles(particleCount);
        break;
      default:
        this.initGenericParticles(particleCount);
    }
  }

  private initFireParticles(count: number): void {
    const colors = this.config.visual.colors || ['#FF4500', '#FF6347', '#FF8C00'];
    
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: this.canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: -Math.random() * 5 - 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        life: 1,
        maxLife: Math.random() * 60 + 40,
        alpha: 1
      });
    }
  }

  private initFireworksParticles(count: number): void {
    // Crear explosiones en posiciones aleatorias
    const explosionCount = 5;
    const colors = this.config.visual.colors || ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'];
    
    for (let e = 0; e < explosionCount; e++) {
      const centerX = Math.random() * this.canvas.width;
      const centerY = Math.random() * (this.canvas.height * 0.6);
      
      for (let i = 0; i < count / explosionCount; i++) {
        const angle = (Math.PI * 2 * i) / (count / explosionCount);
        const speed = Math.random() * 3 + 2;
        
        this.particles.push({
          x: centerX,
          y: centerY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 4 + 2,
          life: 1,
          maxLife: Math.random() * 40 + 30,
          alpha: 1
        });
      }
    }
  }

  private initFirecrackersParticles(count: number): void {
    const colors = this.config.visual.colors || ['#FF0000', '#FFD700', '#FFFFFF'];
    
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 3 + 1,
        life: 1,
        maxLife: Math.random() * 20 + 10,
        alpha: 1
      });
    }
  }

  private initMovingFireParticles(count: number): void {
    const colors = this.config.visual.colors || ['#FF4500', '#FF6347'];
    
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: 0,
        y: this.canvas.height / 2 + (Math.random() - 0.5) * 100,
        vx: Math.random() * 2 + 1,
        vy: (Math.random() - 0.5) * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 3,
        life: 1,
        maxLife: Math.random() * 50 + 30,
        alpha: 1
      });
    }
  }

  private initGenericParticles(count: number): void {
    const colors = this.config.visual.colors || ['#FF69B4', '#87CEEB'];
    
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 5 + 2,
        life: 1,
        maxLife: Math.random() * 60 + 40,
        alpha: 1
      });
    }
  }

  private animate(currentTime: number): void {
    if (!this.state.active || this.state.paused) return;

    const deltaTime = (currentTime - this.lastTime) / 16.67; // Normalizar a 60fps
    this.lastTime = currentTime;

    // Calcular progreso
    const elapsed = Date.now() - this.state.startTime;
    const total = this.state.endTime - this.state.startTime;
    this.state.progress = Math.min((elapsed / total) * 100, 100);

    // Limpiar canvas
    this.clear();

    // Actualizar y dibujar partículas
    this.updateParticles(deltaTime);
    this.drawParticles();

    // Continuar animación
    if (this.state.progress < 100) {
      this.animationFrame = requestAnimationFrame((time) => this.animate(time));
    } else {
      this.stop();
    }
  }

  private updateParticles(deltaTime: number): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      
      // Actualizar posición
      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;
      
      // Gravedad (para fuegos artificiales y fuego)
      if (this.config.visual.type === 'fireworks' || this.config.visual.type === 'fire-burn') {
        p.vy += 0.1 * deltaTime;
      }
      
      // Actualizar vida
      p.life -= (1 / p.maxLife) * deltaTime;
      p.alpha = p.life;
      
      // Eliminar partículas muertas
      if (p.life <= 0 || p.y > this.canvas.height || p.x < 0 || p.x > this.canvas.width) {
        this.particles.splice(i, 1);
        
        // Reemplazar partícula (para animaciones continuas)
        if (this.config.visual.type === 'fire-burn' || this.config.visual.type === 'moving-fire') {
          this.replaceParticle(i);
        }
      }
    }
  }

  private replaceParticle(index: number): void {
    const colors = this.config.visual.colors || ['#FF4500'];
    
    if (this.config.visual.type === 'fire-burn') {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: this.canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: -Math.random() * 5 - 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        life: 1,
        maxLife: Math.random() * 60 + 40,
        alpha: 1
      });
    } else if (this.config.visual.type === 'moving-fire') {
      this.particles.push({
        x: 0,
        y: this.canvas.height / 2 + (Math.random() - 0.5) * 100,
        vx: Math.random() * 2 + 1,
        vy: (Math.random() - 0.5) * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 3,
        life: 1,
        maxLife: Math.random() * 50 + 30,
        alpha: 1
      });
    }
  }

  private drawParticles(): void {
    this.particles.forEach(p => {
      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      
      // Efecto de brillo
      if (this.config.visual.glow) {
        this.ctx.shadowBlur = 20;
        this.ctx.shadowColor = p.color;
      }
      
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Trail effect
      if (this.config.visual.trail) {
        this.ctx.globalAlpha = p.alpha * 0.5;
        this.ctx.beginPath();
        this.ctx.arc(p.x - p.vx * 2, p.y - p.vy * 2, p.size * 0.7, 0, Math.PI * 2);
        this.ctx.fill();
      }
      
      this.ctx.restore();
    });
  }

  private clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  getState(): AnimationState {
    return { ...this.state };
  }
}
