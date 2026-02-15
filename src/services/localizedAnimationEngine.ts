// src/services/localizedAnimationEngine.ts
import { AnimationConfig, ParticleConfig } from '@/types/animations';

export class LocalizedAnimationEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private config: AnimationConfig;
  private particles: ParticleConfig[] = [];
  private animationFrame: number | null = null;
  private lastTime: number = 0;
  private centerX: number = 0;
  private centerY: number = 0;
  private duration: number = 5000; // 5 segundos por defecto

  constructor(canvas: HTMLCanvasElement, config: AnimationConfig) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get 2D context');
    }
    this.ctx = context;
    this.config = config;
    
    this.centerX = canvas.width / 2;
    this.centerY = canvas.height / 2;
  }

  start(): void {
    this.initParticles();
    this.animate(Date.now());

    // Auto-detener después de la duración
    setTimeout(() => {
      this.stop();
    }, this.duration);
  }

  stop(): void {
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    this.particles = [];
    this.clear();
  }

  private initParticles(): void {
    const particleCount = this.config.visual.particles || 100;
    const colors = this.config.visual.colors || ['#FF4500', '#FF6347', '#FFD700'];

    switch (this.config.visual.type) {
      case 'fire-burn':
        this.initFireBurst(particleCount, colors);
        break;
      case 'fireworks':
        this.initFireworksBurst(particleCount, colors);
        break;
      case 'firecrackers':
        this.initFirecrackersBurst(particleCount, colors);
        break;
      default:
        this.initGenericBurst(particleCount, colors);
    }
  }

  private initFireBurst(count: number, colors: string[]): void {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = Math.random() * 3 + 2;
      
      this.particles.push({
        x: this.centerX,
        y: this.centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2, // Tendencia hacia arriba
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        life: 1,
        maxLife: Math.random() * 60 + 40,
        alpha: 1
      });
    }
  }

  private initFireworksBurst(count: number, colors: string[]): void {
    // Crear múltiples explosiones desde el centro
    const explosions = 3;
    
    for (let e = 0; e < explosions; e++) {
      const delay = e * 20;
      
      for (let i = 0; i < count / explosions; i++) {
        const angle = (Math.PI * 2 * i) / (count / explosions);
        const speed = Math.random() * 4 + 3;
        
        setTimeout(() => {
          this.particles.push({
            x: this.centerX,
            y: this.centerY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 5 + 3,
            life: 1,
            maxLife: Math.random() * 50 + 30,
            alpha: 1
          });
        }, delay);
      }
    }
  }

  private initFirecrackersBurst(count: number, colors: string[]): void {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      
      this.particles.push({
        x: this.centerX,
        y: this.centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 4 + 2,
        life: 1,
        maxLife: Math.random() * 30 + 20,
        alpha: 1
      });
    }
  }

  private initGenericBurst(count: number, colors: string[]): void {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = Math.random() * 3 + 1.5;
      
      this.particles.push({
        x: this.centerX,
        y: this.centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 3,
        life: 1,
        maxLife: Math.random() * 50 + 30,
        alpha: 1
      });
    }
  }

  private animate(currentTime: number): void {
    const deltaTime = (currentTime - this.lastTime) / 16.67;
    this.lastTime = currentTime;

    this.clear();
    this.updateParticles(deltaTime);
    this.drawParticles();

    if (this.particles.length > 0) {
      this.animationFrame = requestAnimationFrame((time) => this.animate(time));
    }
  }

  private updateParticles(deltaTime: number): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      
      // Actualizar posición
      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;
      
      // Gravedad
      p.vy += 0.15 * deltaTime;
      
      // Actualizar vida
      p.life -= (1 / p.maxLife) * deltaTime;
      p.alpha = Math.max(0, p.life);
      
      // Eliminar partículas muertas
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  private drawParticles(): void {
    this.particles.forEach(p => {
      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      
      // Glow effect
      this.ctx.shadowBlur = 15;
      this.ctx.shadowColor = p.color;
      
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Trail
      if (this.config.visual.trail) {
        this.ctx.globalAlpha = p.alpha * 0.5;
        this.ctx.beginPath();
        this.ctx.arc(p.x - p.vx, p.y - p.vy, p.size * 0.7, 0, Math.PI * 2);
        this.ctx.fill();
      }
      
      this.ctx.restore();
    });
  }

  private clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
