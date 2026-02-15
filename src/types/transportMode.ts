// src/types/transportMode.ts

export type TransportMode = 'walking' | 'bicycling' | 'transit' | 'driving';

export interface TransportModeConfig {
  mode: TransportMode;
  icon: string;
  label: string;
  speedKmH: number; // Velocidad promedio en km/h
  googleMapsParam: string; // Parámetro para Google Maps API
  description: string;
  color: string;
}

export const TRANSPORT_MODES: Record<TransportMode, TransportModeConfig> = {
  walking: {
    mode: 'walking',
    icon: '🚶',
    label: 'A Pie',
    speedKmH: 5, // 5 km/h promedio caminando
    googleMapsParam: 'walking',
    description: 'Caminar es la mejor forma de disfrutar las fallas de cerca',
    color: '#10b981' // Verde
  },
  bicycling: {
    mode: 'bicycling',
    icon: '🚴',
    label: 'En Bici',
    speedKmH: 15, // 15 km/h promedio en bicicleta
    googleMapsParam: 'bicycling',
    description: 'Rápido y ecológico, perfecto para cubrir más distancia',
    color: '#3b82f6' // Azul
  },
  transit: {
    mode: 'transit',
    icon: '🚇',
    label: 'Transporte Público',
    speedKmH: 20, // 20 km/h promedio (incluye esperas)
    googleMapsParam: 'transit',
    description: 'Metro, autobús y tranvía de Valencia',
    color: '#f59e0b' // Amber
  },
  driving: {
    mode: 'driving',
    icon: '🚗',
    label: 'En Coche',
    speedKmH: 30, // 30 km/h promedio en ciudad (con tráfico)
    googleMapsParam: 'driving',
    description: 'Cómodo pero puede haber tráfico y calles cortadas',
    color: '#ef4444' // Rojo
  }
};

/**
 * Calcula tiempo estimado según modo de transporte
 */
export const calculateEstimatedTime = (
  distanceKm: number,
  mode: TransportMode
): number => {
  const config = TRANSPORT_MODES[mode];
  return Math.ceil((distanceKm / config.speedKmH) * 60); // Minutos
};

/**
 * Obtiene configuración de modo de transporte
 */
export const getTransportModeConfig = (mode: TransportMode): TransportModeConfig => {
  return TRANSPORT_MODES[mode];
};

/**
 * Formatea tiempo en formato legible
 */
export const formatEstimatedTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
};
