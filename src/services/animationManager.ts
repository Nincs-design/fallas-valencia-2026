// src/services/animationManager.ts
import { AnimationEngine } from './animationEngine';
import { AnimationConfig, AnimationState } from '@/types/animations';
import { getActiveAnimations } from '@/config/animationsConfig';

export class AnimationManager {
  private engines: Map<string, AnimationEngine> = new Map();
  private canvases: Map<string, HTMLCanvasElement> = new Map();
  private container: HTMLElement | null = null;
  private updateInterval: number | null = null;
  private currentDate: Date = new Date();
  private callbacks: Array<(animations: AnimationState[]) => void> = [];

  // MVP: Animaciones siempre activas, sin necesidad de cargar estado
  constructor() {
    // loadAllAnimationStates() eliminado - todas las animaciones siempre activas
  }

  /**
   * Inicializa el contenedor de animaciones
   */
  initialize(container: HTMLElement): void {
    this.container = container;
  }

  /**
   * Establece la fecha/hora actual para las animaciones
   */
  setCurrentTime(date: Date): void {
    this.currentDate = date;
    this.updateAnimations();
  }

  /**
   * Actualiza las animaciones activas basado en la hora actual
   */
  private updateAnimations(): void {
    if (!this.container) return;

    const activeAnimations = getActiveAnimations(this.currentDate);
    
    // Detener animaciones que ya no están activas
    this.engines.forEach((_engine, id) => {
      if (!activeAnimations.find(a => a.id === id)) {
        this.stopAnimation(id);
      }
    });

    // Iniciar nuevas animaciones
    activeAnimations.forEach(animation => {
      if (!this.engines.has(animation.id) && animation.type === 'canvas') {
        this.startCanvasAnimation(animation);
      }
    });

    // Notificar cambios
    this.notifyCallbacks();
  }

  /**
   * Inicia una animación Canvas
   */
  private startCanvasAnimation(config: AnimationConfig): void {
    if (!this.container) return;

    // Crear canvas si no existe
    let canvas = this.canvases.get(config.id);
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = `animation-${config.id}`;
      canvas.className = 'animation-canvas';
      canvas.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: ${1000 + config.priority};
      `;
      this.container.appendChild(canvas);
      this.canvases.set(config.id, canvas);
    }

    // Crear motor de animación
    try {
      const engine = new AnimationEngine(canvas, config);
      this.engines.set(config.id, engine);
      engine.start();
    } catch (error) {
      console.error(`Error starting animation ${config.id}:`, error);
    }
  }

  /**
   * Detiene una animación específica
   */
  stopAnimation(id: string): void {
    const engine = this.engines.get(id);
    if (engine) {
      engine.stop();
      this.engines.delete(id);
    }

    const canvas = this.canvases.get(id);
    if (canvas && canvas.parentElement) {
      canvas.parentElement.removeChild(canvas);
      this.canvases.delete(id);
    }
  }

  /**
   * Pausa una animación
   */
  pauseAnimation(id: string): void {
    const engine = this.engines.get(id);
    if (engine) {
      engine.pause();
    }
  }

  /**
   * Reanuda una animación
   */
  resumeAnimation(id: string): void {
    const engine = this.engines.get(id);
    if (engine) {
      engine.resume();
    }
  }

  /**
   * Detiene todas las animaciones
   */
  stopAll(): void {
    this.engines.forEach((_engine, id) => {
      this.stopAnimation(id);
    });
  }

  /**
   * Inicia el monitoreo automático de animaciones
   */
  startAutoUpdate(intervalMs: number = 5000): void {
    if (this.updateInterval !== null) {
      this.stopAutoUpdate();
    }

    this.updateInterval = window.setInterval(() => {
      this.updateAnimations();
    }, intervalMs);

    // Actualización inicial
    this.updateAnimations();
  }

  /**
   * Detiene el monitoreo automático
   */
  stopAutoUpdate(): void {
    if (this.updateInterval !== null) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  /**
   * Obtiene el estado de todas las animaciones activas
   */
  getActiveStates(): AnimationState[] {
    const states: AnimationState[] = [];
    this.engines.forEach(engine => {
      states.push(engine.getState());
    });
    return states;
  }

  /**
   * Registra un callback para cambios de estado
   */
  onStateChange(callback: (animations: AnimationState[]) => void): void {
    this.callbacks.push(callback);
  }

  /**
   * Notifica a todos los callbacks
   */
  private notifyCallbacks(): void {
    const states = this.getActiveStates();
    this.callbacks.forEach(cb => cb(states));
  }

  /**
   * Fuerza una animación específica (override de horario)
   */
  forceAnimation(config: AnimationConfig): void {
    if (config.type === 'canvas') {
      this.startCanvasAnimation(config);
    }
  }

  /**
   * Limpia todos los recursos
   */
  cleanup(): void {
    this.stopAll();
    this.stopAutoUpdate();
    this.callbacks = [];
  }
}

// Instancia singleton
export const animationManager = new AnimationManager();
