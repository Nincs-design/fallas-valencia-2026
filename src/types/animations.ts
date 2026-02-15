// src/types/animations.ts

export type AnimationType = 
  | 'canvas'    // Animaciones con Canvas (fuegos, humo, partículas)
  | 'lottie'    // Animaciones Lottie (vectoriales)
  | 'css'       // Animaciones CSS puras
  | 'svg';      // Animaciones SVG

export type AnimationTriggerType =
  | 'time'      // Se activa por fecha/hora
  | 'manual'    // Se activa manualmente
  | 'user'      // Se activa por interacción del usuario
  | 'location'; // Se activa por proximidad

export type AnimationIntensity = 
  | 'low'
  | 'medium'
  | 'high'
  | 'very-high'
  | 'extreme';

export interface AnimationLocation {
  lat: number;
  lng: number;
  name: string;
  path?: Array<{ lat: number; lng: number }>; // Para animaciones con trayectoria
}

export interface AnimationSchedule {
  startDate: string;  // 'YYYY-MM-DD'
  endDate: string;    // 'YYYY-MM-DD'
  startTime: string;  // 'HH:MM'
  duration: number;   // minutos
  target?: 'grande' | 'infantil' | 'all'; // Para qué tipo de falla
}

export interface AnimationVisual {
  // Canvas animations
  type?: string;
  colors?: string[];
  particles?: number;
  radius?: number;
  intensity?: AnimationIntensity;
  sound?: boolean;
  speed?: number;
  direction?: string;
  trail?: boolean;
  demons?: boolean;
  smoke?: boolean;
  sparks?: boolean;
  burst?: boolean;
  trails?: boolean;
  synchronized?: boolean;
  music?: boolean;
  random?: boolean;
  
  // Lottie animations
  lottieUrl?: string;
  glow?: boolean;
  celebration?: boolean;
  confetti?: boolean;
  musical?: boolean;
  
  // CSS animations
  animation?: string;
  duration?: number;
  stagger?: number;
  
  // General
  fps?: number;
  quality?: 'low' | 'medium' | 'high' | 'ultra';
}

export interface AnimationTrigger {
  type: AnimationTriggerType;
  autoStart?: boolean;
  userAction?: string;
  proximity?: number; // metros
}

export interface AnimationEffects {
  fadeOut?: boolean;
  fadeIn?: boolean;
  duration?: number;
  easing?: string;
}

export interface AnimationConfig {
  id: string;
  name: string;
  type: AnimationType;
  enabled: boolean;
  priority: number;
  description: string;
  icon?: string;
  location: AnimationLocation;
  schedule: AnimationSchedule[];
  visual: AnimationVisual;
  trigger: AnimationTrigger;
  effects?: AnimationEffects;
  currentSchedule?: AnimationSchedule;
}

export interface AnimationState {
  id: string;
  active: boolean;
  progress: number; // 0-100
  startTime: number;
  endTime: number;
  paused: boolean;
}

export interface ParticleConfig {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
  alpha: number;
}
