// src/utils/audioUtils.ts

/**
 * Sistema de Audio para Eventos de Fallas
 * 
 * Nomenclatura de archivos (ubicar en /public/sounds/):
 * - mascleta.mp3 / mascleta.ogg
 * - despertà.mp3 / despertà.ogg
 * - cabalgata-ninot.mp3 / cabalgata-ninot.ogg
 * - cabalgata-fuego.mp3 / cabalgata-fuego.ogg
 * - ofrenda.mp3 / ofrenda.ogg
 * - crema.mp3 / crema.ogg
 * - nit-del-foc.mp3 / nit-del-foc.ogg
 * - castillo.mp3 / castillo.ogg
 * - polvora.mp3 / polvora.ogg
 * - l-alba.mp3 / l-alba.ogg
 * 
 * Formatos soportados: MP3, OGG, WAV
 */

export type EventSoundKey = 
  | 'mascleta'
  | 'desperta'
  | 'cabalgata-ninot'
  | 'cabalgata-fuego'
  | 'ofrenda'
  | 'crema'
  | 'nit-del-foc'
  | 'castillo'
  | 'polvora'
  | 'l-alba'
  | 'crida'
  | 'ambient';

interface AudioConfig {
  volume: number;
  loop: boolean;
  fadeDuration?: number; // ms
}

const defaultConfig: AudioConfig = {
  volume: 0.7,
  loop: false,
  fadeDuration: 1000
};

// Mapeo de eventos a archivos de sonido
export const EVENT_SOUNDS: Record<EventSoundKey, string[]> = {
  'mascleta': ['mascleta.mp3', 'mascleta.ogg', 'mascleta.wav'],
  'desperta': ['desperta.mp3', 'desperta.ogg', 'desperta.wav'],
  'cabalgata-ninot': ['cabalgata-ninot.mp3', 'cabalgata-ninot.ogg', 'cabalgata-ninot.wav'],
  'cabalgata-fuego': ['cabalgata-fuego.mp3', 'cabalgata-fuego.ogg', 'cabalgata-fuego.wav'],
  'ofrenda': ['ofrenda.mp3', 'ofrenda.ogg', 'ofrenda.wav'],
  'crema': ['crema.mp3', 'crema.ogg', 'crema.wav'],
  'nit-del-foc': ['nit-del-foc.mp3', 'nit-del-foc.ogg', 'nit-del-foc.wav'],
  'castillo': ['castillo.mp3', 'castillo.ogg', 'castillo.wav'],
  'polvora': ['polvora.mp3', 'polvora.ogg', 'polvora.wav'],
  'l-alba': ['l-alba.mp3', 'l-alba.ogg', 'l-alba.wav'],
  'crida': ['crida.mp3', 'crida.ogg', 'crida.wav'],
  'ambient': ['ambient.mp3', 'ambient.ogg', 'ambient.wav']
};

class EventAudioManager {
  private audioElements: Map<string, HTMLAudioElement> = new Map();
  private currentlyPlaying: Set<string> = new Set();
  private userEnabled: boolean = false;
  private masterVolume: number = 0.7;

  constructor() {
    // Load user preference
    const saved = localStorage.getItem('fallas-audio-enabled');
    this.userEnabled = saved === 'true';
    
    const savedVolume = localStorage.getItem('fallas-audio-volume');
    if (savedVolume) {
      const parsed = parseFloat(savedVolume);
      // Validar que sea un número en rango [0, 1]
      if (!isNaN(parsed) && isFinite(parsed)) {
        this.masterVolume = Math.max(0, Math.min(1, parsed));
      }
    }
  }

  /**
   * Habilitar/deshabilitar audio (requerido por navegadores)
   */
  setEnabled(enabled: boolean) {
    this.userEnabled = enabled;
    localStorage.setItem('fallas-audio-enabled', enabled.toString());
    
    if (!enabled) {
      this.stopAll();
    }
  }

  isEnabled(): boolean {
    return this.userEnabled;
  }

  /**
   * Establecer volumen maestro (0-1)
   */
  setMasterVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    localStorage.setItem('fallas-audio-volume', this.masterVolume.toString());
    
    // Update all playing audio
    this.audioElements.forEach(audio => {
      audio.volume = this.masterVolume;
    });
  }

  getMasterVolume(): number {
    return this.masterVolume;
  }

  /**
   * Cargar un archivo de audio
   */
  private async loadAudio(soundKey: EventSoundKey): Promise<HTMLAudioElement | null> {
    if (this.audioElements.has(soundKey)) {
      return this.audioElements.get(soundKey)!;
    }

    const possibleFiles = EVENT_SOUNDS[soundKey];
    
    for (const filename of possibleFiles) {
      try {
        const audio = new Audio(`/sounds/${filename}`);
        audio.volume = this.masterVolume;
        
        // Preload
        await new Promise((resolve, reject) => {
          audio.addEventListener('canplaythrough', resolve, { once: true });
          audio.addEventListener('error', reject, { once: true });
          audio.load();
        });
        
        this.audioElements.set(soundKey, audio);
        return audio;
      } catch (error) {
        // Try next format
        continue;
      }
    }
    
    console.warn(`No audio file found for: ${soundKey}`);
    return null;
  }

  /**
   * Reproducir sonido de evento
   */
  async play(soundKey: EventSoundKey, config: Partial<AudioConfig> = {}): Promise<void> {
    if (!this.userEnabled) {
      console.log('Audio disabled by user');
      return;
    }

    const finalConfig = { ...defaultConfig, ...config };
    
    try {
      const audio = await this.loadAudio(soundKey);
      if (!audio) return;

      audio.loop = finalConfig.loop;
      audio.volume = this.masterVolume * finalConfig.volume;
      
      // Stop if already playing
      if (this.currentlyPlaying.has(soundKey)) {
        await this.stop(soundKey);
      }
      
      await audio.play();
      this.currentlyPlaying.add(soundKey);
      
      // Auto-remove when finished (if not looping)
      if (!finalConfig.loop) {
        audio.addEventListener('ended', () => {
          this.currentlyPlaying.delete(soundKey);
        }, { once: true });
      }
      
    } catch (error) {
      console.error(`Error playing sound ${soundKey}:`, error);
    }
  }

  /**
   * Detener sonido específico
   */
  async stop(soundKey: EventSoundKey, fadeDuration: number = 500): Promise<void> {
    const audio = this.audioElements.get(soundKey);
    if (!audio || !this.currentlyPlaying.has(soundKey)) return;

    if (fadeDuration > 0) {
      await this.fadeOut(audio, fadeDuration);
    }
    
    audio.pause();
    audio.currentTime = 0;
    this.currentlyPlaying.delete(soundKey);
  }

  /**
   * Detener todos los sonidos
   */
  stopAll(fadeDuration: number = 500): void {
    this.audioElements.forEach((_audio, key) => {
      if (this.currentlyPlaying.has(key)) {
        this.stop(key as EventSoundKey, fadeDuration);
      }
    });
  }

  /**
   * Fade out de audio
   */
  private fadeOut(audio: HTMLAudioElement, duration: number): Promise<void> {
    return new Promise(resolve => {
      const startVolume = audio.volume;
      const steps = 20;
      const stepDuration = duration / steps;
      const volumeStep = startVolume / steps;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        audio.volume = Math.max(0, startVolume - (volumeStep * currentStep));
        
        if (currentStep >= steps) {
          clearInterval(interval);
          audio.volume = startVolume; // Restore for next play
          resolve();
        }
      }, stepDuration);
    });
  }

  /**
   * Fade in de audio
   */
  private _fadeIn(audio: HTMLAudioElement, duration: number, targetVolume: number): Promise<void> {
    return new Promise(resolve => {
      audio.volume = 0;
      const steps = 20;
      const stepDuration = duration / steps;
      const volumeStep = targetVolume / steps;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        audio.volume = Math.min(targetVolume, volumeStep * currentStep);
        
        if (currentStep >= steps) {
          clearInterval(interval);
          resolve();
        }
      }, stepDuration);
    });
  }

  /**
   * Verificar si un sonido está reproduciéndose
   */
  isPlaying(soundKey: EventSoundKey): boolean {
    return this.currentlyPlaying.has(soundKey);
  }

  /**
   * Precargar múltiples sonidos
   */
  async preload(soundKeys: EventSoundKey[]): Promise<void> {
    await Promise.all(soundKeys.map(key => this.loadAudio(key)));
  }

  /**
   * Limpiar recursos
   */
  cleanup(): void {
    this.stopAll(0);
    this.audioElements.forEach(audio => {
      audio.src = '';
      audio.load();
    });
    this.audioElements.clear();
  }
}

// Singleton instance
export const eventAudioManager = new EventAudioManager();

// Helper hooks para React
export const useEventAudio = () => {
  return {
    play: (soundKey: EventSoundKey, config?: Partial<AudioConfig>) => 
      eventAudioManager.play(soundKey, config),
    stop: (soundKey: EventSoundKey) => 
      eventAudioManager.stop(soundKey),
    stopAll: () => 
      eventAudioManager.stopAll(),
    isPlaying: (soundKey: EventSoundKey) => 
      eventAudioManager.isPlaying(soundKey),
    setEnabled: (enabled: boolean) => 
      eventAudioManager.setEnabled(enabled),
    isEnabled: () => 
      eventAudioManager.isEnabled(),
    setVolume: (volume: number) => 
      eventAudioManager.setMasterVolume(volume),
    getVolume: () => 
      eventAudioManager.getMasterVolume()
  };
};
