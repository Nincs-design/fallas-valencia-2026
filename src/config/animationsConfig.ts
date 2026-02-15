// src/config/animationsConfig.ts
import { AnimationConfig } from '@/types/animations';

/**
 * Configuración central de todas las animaciones
 * Sistema escalable: añadir, modificar u ocultar animaciones fácilmente
 */

export const animationsConfig: Record<string, AnimationConfig> = {
  // ============================================
  // MASCLETÀ (Fuegos artificiales diurnos)
  // ============================================
  mascleta: {
    id: 'mascleta',
    name: 'Mascletà',
    type: 'canvas',
    enabled: true,
    priority: 1,
    description: 'Explosiones de pólvora con humo de colores',
    location: {
      lat: 39.4699,
      lng: -0.3763,
      name: 'Plaza del Ayuntamiento'
    },
    schedule: [
      // Del 1 al 19 de marzo, todos los días a las 14:00
      { startDate: '2026-03-01', endDate: '2026-03-19', startTime: '14:00', duration: 5 }
    ],
    visual: {
      colors: ['#FF6B35', '#F7931E', '#FDC830', '#FF0000', '#FFD700'],
      particles: 200,
      radius: 100,
      intensity: 'high',
      sound: true
    },
    trigger: {
      type: 'time',
      autoStart: true
    }
  },

  // ============================================
  // OFRENDA DE FLORES
  // ============================================
  ofrenda: {
    id: 'ofrenda',
    name: 'Ofrenda de Flores',
    type: 'lottie',
    enabled: true,
    priority: 2,
    description: 'Flores flotando hacia la Plaza de la Virgen',
    location: {
      lat: 39.4753,
      lng: -0.3750,
      name: 'Plaza de la Virgen'
    },
    schedule: [
      // 17-18 Marzo, 15:30 - 01:00 (próximo día)
      { startDate: '2026-03-17', endDate: '2026-03-17', startTime: '15:30', duration: 570 }, // 9.5 horas hasta 01:00
      { startDate: '2026-03-18', endDate: '2026-03-18', startTime: '15:30', duration: 570 }
    ],
    visual: {
      lottieUrl: '/animations/flowers.json',
      colors: ['#FF69B4', '#FF1493', '#FFC0CB', '#FFB6C1', '#DB7093'],
      particles: 50,
      speed: 0.5,
      direction: 'up-float'
    },
    trigger: {
      type: 'time',
      autoStart: true
    }
  },

  // ============================================
  // CABALGATA DEL FUEGO
  // ============================================
  cabalgata: {
    id: 'cabalgata',
    name: 'Cabalgata del Fuego',
    type: 'canvas',
    enabled: true,
    priority: 3,
    description: 'Desfile de fuego y demonios',
    location: {
      lat: 39.4699,
      lng: -0.3763,
      path: [
        { lat: 39.4699, lng: -0.3763 },
        { lat: 39.4720, lng: -0.3755 },
        { lat: 39.4740, lng: -0.3745 }
      ],
      name: 'Calle de la Paz hasta Porta de la Mar'
    },
    schedule: [
      // 19 Marzo, 19:00
      { startDate: '2026-03-19', endDate: '2026-03-19', startTime: '19:00', duration: 120 }
    ],
    visual: {
      type: 'moving-fire',
      colors: ['#FF4500', '#FF6347', '#FF8C00', '#FFA500'],
      particles: 150,
      trail: true,
      demons: true,
      sound: true
    },
    trigger: {
      type: 'time',
      autoStart: true
    }
  },

  // ============================================
  // CREMÀ (Quema de fallas)
  // ============================================
  crema: {
    id: 'crema',
    name: 'Cremà',
    type: 'canvas',
    enabled: true,
    priority: 10, // Máxima prioridad
    description: 'Quema de todas las fallas',
    location: {
      lat: 39.4699,
      lng: -0.3763,
      name: 'Todas las fallas'
    },
    schedule: [
      // 19 Marzo - Infantiles
      { startDate: '2026-03-19', endDate: '2026-03-19', startTime: '20:00', duration: 120, target: 'infantil' },
      // 19 Marzo - Adultas
      { startDate: '2026-03-19', endDate: '2026-03-19', startTime: '22:00', duration: 180, target: 'grande' }
    ],
    visual: {
      type: 'fire-burn',
      colors: ['#FF4500', '#FF6347', '#FF8C00', '#FFD700', '#FFA500'],
      particles: 300,
      intensity: 'very-high',
      smoke: true,
      sparks: true,
      sound: true
    },
    trigger: {
      type: 'time',
      autoStart: true
    },
    effects: {
      fadeOut: true,
      duration: 180 // minutos
    }
  },

  // ============================================
  // CASTILLO DE FUEGOS (Nocturno)
  // ============================================
  castillo: {
    id: 'castillo',
    name: 'Castillo de Fuegos Artificiales',
    type: 'canvas',
    enabled: true,
    priority: 4,
    description: 'Espectáculo pirotécnico nocturno',
    location: {
      lat: 39.4615,
      lng: -0.3538,
      name: 'Jardín del Turia (Palau de les Arts)'
    },
    schedule: [
      { startDate: '2026-03-16', endDate: '2026-03-16', startTime: '23:59', duration: 30 },
      { startDate: '2026-03-17', endDate: '2026-03-17', startTime: '23:59', duration: 30 }
    ],
    visual: {
      type: 'fireworks',
      colors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFD700'],
      particles: 500,
      burst: true,
      trails: true,
      sound: true
    },
    trigger: {
      type: 'time',
      autoStart: true
    }
  },

  // ============================================
  // ESPECTÁCULOS PIROTÉCNICOS NOCTURNOS
  // ============================================
  espectaculoNocturno: {
    id: 'espectaculoNocturno',
    name: 'Espectáculo Pirotécnico Nocturno',
    type: 'canvas',
    enabled: true,
    priority: 3,
    description: 'Fuegos artificiales nocturnos',
    location: {
      lat: 39.4699,
      lng: -0.3763,
      name: 'Plaza del Ayuntamiento'
    },
    schedule: [
      // Febrero
      { startDate: '2026-02-28', endDate: '2026-02-28', startTime: '23:59', duration: 20 },
      // Marzo
      { startDate: '2026-03-01', endDate: '2026-03-01', startTime: '20:00', duration: 20 },
      { startDate: '2026-03-06', endDate: '2026-03-06', startTime: '23:59', duration: 20 },
      { startDate: '2026-03-07', endDate: '2026-03-07', startTime: '23:59', duration: 20 },
      { startDate: '2026-03-08', endDate: '2026-03-08', startTime: '20:00', duration: 20 },
      { startDate: '2026-03-12', endDate: '2026-03-12', startTime: '20:30', duration: 20 },
      { startDate: '2026-03-13', endDate: '2026-03-13', startTime: '23:59', duration: 20 },
      { startDate: '2026-03-14', endDate: '2026-03-14', startTime: '23:59', duration: 20 }
    ],
    visual: {
      type: 'fireworks',
      colors: ['#FF4500', '#FFD700', '#FF1493', '#00CED1', '#7FFF00', '#FF6347'],
      particles: 400,
      burst: true,
      trails: true,
      sound: true
    },
    trigger: {
      type: 'time',
      autoStart: true
    }
  },

  // ============================================
  // L'ALBA DE LAS FALLAS
  // ============================================
  lAlba: {
    id: 'lAlba',
    name: "L'Alba de las Fallas",
    type: 'canvas',
    enabled: true,
    priority: 6,
    description: 'Espectáculo pirotécnico especial del alba',
    location: {
      lat: 39.4699,
      lng: -0.3763,
      name: 'Plaza del Ayuntamiento'
    },
    schedule: [
      { startDate: '2026-03-15', endDate: '2026-03-15', startTime: '23:59', duration: 30 }
    ],
    visual: {
      type: 'special-fireworks',
      colors: ['#FFD700', '#FFA500', '#FF4500', '#FF6347', '#FFFFFF'],
      particles: 600,
      burst: true,
      synchronized: true,
      intensity: 'very-high'
    },
    trigger: {
      type: 'time',
      autoStart: true
    }
  },

  // ============================================
  // NIT DEL FOC (Evento especial)
  // ============================================
  nitDelFoc: {
    id: 'nitDelFoc',
    name: 'Nit del Foc',
    type: 'canvas',
    enabled: true,
    priority: 5,
    description: 'Espectáculo pirotécnico especial',
    location: {
      lat: 39.4615,
      lng: -0.3538,
      name: 'Jardín del Turia'
    },
    schedule: [
      // 18 Marzo a las 23:59 (medianoche)
      { startDate: '2026-03-18', endDate: '2026-03-18', startTime: '23:59', duration: 45 }
    ],
    visual: {
      type: 'special-fireworks',
      colors: ['#FF4500', '#FFD700', '#FF1493', '#00CED1', '#7FFF00'],
      particles: 800,
      synchronized: true,
      music: true,
      intensity: 'extreme'
    },
    trigger: {
      type: 'time',
      autoStart: true
    }
  },

  // ============================================
  // DESPERTÀ (Petardos matutinos)
  // ============================================
  desperta: {
    id: 'desperta',
    name: 'Despertà',
    type: 'canvas',
    enabled: true,
    priority: 1,
    description: 'Petardos por las calles al amanecer',
    location: {
      lat: 39.4699,
      lng: -0.3763,
      name: 'Por toda la ciudad'
    },
    schedule: [
      { startDate: '2026-02-22', endDate: '2026-02-22', startTime: '07:00', duration: 30 },
      { startDate: '2026-02-22', endDate: '2026-02-22', startTime: '07:30', duration: 30 }
    ],
    visual: {
      type: 'firecrackers',
      colors: ['#FF0000', '#FFD700', '#FFFFFF'],
      particles: 100,
      sound: true,
      random: true
    },
    trigger: {
      type: 'time',
      autoStart: true
    }
  },

  // ============================================
  // CRIDA (Inicio de las fallas)
  // ============================================
  crida: {
    id: 'crida',
    name: 'Crida',
    type: 'lottie',
    enabled: true,
    priority: 2,
    description: 'Inicio monumental de las festividades',
    location: {
      lat: 39.4787,
      lng: -0.3738,
      name: 'Torres de Serranos'
    },
    schedule: [
      { startDate: '2026-02-22', endDate: '2026-02-22', startTime: '19:30', duration: 60 }
    ],
    visual: {
      lottieUrl: '/animations/crida.json',
      colors: ['#FFD700', '#FF4500', '#FFA500'],
      glow: true,
      celebration: true
    },
    trigger: {
      type: 'time',
      autoStart: true
    }
  },

  // ============================================
  // CABALGATA DEL NINOT
  // ============================================
  cabalgataDelNinot: {
    id: 'cabalgataDelNinot',
    name: 'Cabalgata del Ninot',
    type: 'lottie',
    enabled: true,
    priority: 2,
    description: 'Desfile de ninots artísticos',
    location: {
      lat: 39.4699,
      lng: -0.3763,
      name: 'Glorieta hasta Xátiva'
    },
    schedule: [
      { startDate: '2026-02-28', endDate: '2026-02-28', startTime: '17:30', duration: 180 }
    ],
    visual: {
      lottieUrl: '/animations/parade.json',
      colors: ['#FF69B4', '#87CEEB', '#98FB98', '#FFD700'],
      confetti: true,
      musical: true
    },
    trigger: {
      type: 'time',
      autoStart: true
    }
  },

  // ============================================
  // PLANTÀ (Montaje de fallas)
  // ============================================
  planta: {
    id: 'planta',
    name: 'Plantà',
    type: 'css',
    enabled: true,
    priority: 1,
    description: 'Montaje de monumentos falleros',
    location: {
      lat: 39.4699,
      lng: -0.3763,
      name: 'Todas las fallas'
    },
    schedule: [
      { startDate: '2026-03-15', endDate: '2026-03-15', startTime: '09:00', duration: 1440, target: 'infantil' },
      { startDate: '2026-03-16', endDate: '2026-03-16', startTime: '08:00', duration: 1440, target: 'grande' }
    ],
    visual: {
      type: 'scale-in',
      animation: 'fadeInUp',
      duration: 2,
      stagger: 0.1
    },
    trigger: {
      type: 'time',
      autoStart: true
    }
  }
};

/**
 * Configuración de intensidades de animación
 */
export const animationIntensity = {
  low: {
    particles: 50,
    fps: 30,
    quality: 'low'
  },
  medium: {
    particles: 150,
    fps: 45,
    quality: 'medium'
  },
  high: {
    particles: 300,
    fps: 60,
    quality: 'high'
  },
  'very-high': {
    particles: 500,
    fps: 60,
    quality: 'ultra'
  },
  extreme: {
    particles: 800,
    fps: 60,
    quality: 'ultra'
  }
};

/**
 * Obtener animaciones activas en una fecha/hora específica
 */
export function getActiveAnimations(date: Date): AnimationConfig[] {
  const activeAnimations: AnimationConfig[] = [];
  
  Object.values(animationsConfig).forEach(animation => {
    if (!animation.enabled) return;
    
    animation.schedule.forEach(schedule => {
      const scheduleStart = new Date(schedule.startDate + ' ' + schedule.startTime);
      const scheduleEnd = new Date(scheduleStart.getTime() + schedule.duration * 60000);
      
      if (date >= scheduleStart && date <= scheduleEnd) {
        activeAnimations.push({
          ...animation,
          currentSchedule: schedule
        });
      }
    });
  });
  
  // Ordenar por prioridad (mayor prioridad primero)
  return activeAnimations.sort((a, b) => (b.priority || 0) - (a.priority || 0));
}

/**
 * Obtener todas las animaciones disponibles
 */
export function getAllAnimations(): AnimationConfig[] {
  return Object.values(animationsConfig);
}

/**
 * Activar/Desactivar una animación
 */
export function toggleAnimation(id: string, enabled: boolean): void {
  if (animationsConfig[id]) {
    animationsConfig[id].enabled = enabled;
    localStorage.setItem(`animation_${id}_enabled`, enabled.toString());
  }
}

/**
 * Obtener estado de animación desde localStorage
 */
export function loadAnimationState(id: string): boolean {
  const saved = localStorage.getItem(`animation_${id}_enabled`);
  return saved !== null ? saved === 'true' : animationsConfig[id]?.enabled || true;
}

/**
 * Cargar todos los estados guardados
 */
export function loadAllAnimationStates(): void {
  Object.keys(animationsConfig).forEach(id => {
    const enabled = loadAnimationState(id);
    animationsConfig[id].enabled = enabled;
  });
}
