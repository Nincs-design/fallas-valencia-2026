// src/utils/fallaStateUtils.ts

export type FallaState = 
  | 'pre-construction'    // Antes de Plantà
  | 'active'              // Durante Fallas (post-Plantà, pre-Cremà)
  | 'burning'             // Durante Cremà
  | 'post-crema';         // Después de Cremà

export interface FallaStateInfo {
  state: FallaState;
  icon: string;
  statusMessage: string;
  statusColor: string;
  showOnMap: boolean;
}

/**
 * Determina el estado de una falla basado en su tipo, día y hora actual
 */
export const getFallaState = (
  fallaType: 'grande' | 'infantil',
  selectedDay: number,
  currentHour: number
): FallaStateInfo => {
  // Fechas importantes
  const PLANTA_INFANTIL_DAY = 15;
  const PLANTA_GRANDE_DAY = 16;
  const CREMA_DAY = 19;
  const CREMA_INFANTIL_HOUR = 20; // 20:00
  const CREMA_GRANDE_HOUR = 22;   // 22:00

  // Determinar día de Plantà según tipo
  const plantaDay = fallaType === 'infantil' ? PLANTA_INFANTIL_DAY : PLANTA_GRANDE_DAY;
  const cremaHour = fallaType === 'infantil' ? CREMA_INFANTIL_HOUR : CREMA_GRANDE_HOUR;

  // PRE-CONSTRUCCIÓN: Antes de la Plantà
  if (selectedDay < plantaDay) {
    return {
      state: 'pre-construction',
      icon: '⏳',
      statusMessage: `Esta falla está en construcción. Ven a visitarla el día ${plantaDay} de marzo (Plantà ${fallaType === 'infantil' ? 'Infantiles' : 'Grandes'}).`,
      statusColor: '#f59e0b', // Amber
      showOnMap: true
    };
  }

  // BURNING: Durante la Cremà (día 19, hora de cremà)
  if (selectedDay === CREMA_DAY && currentHour >= cremaHour) {
    return {
      state: 'burning',
      icon: '🔥',
      statusMessage: `¡Esta falla está siendo quemada en este momento! La Cremà ${fallaType === 'infantil' ? 'Infantil' : 'Grande'} está en curso.`,
      statusColor: '#ef4444', // Red
      showOnMap: true
    };
  }

  // POST-CREMÀ: Después de la Cremà
  if (selectedDay > CREMA_DAY || (selectedDay === CREMA_DAY && currentHour >= cremaHour + 1)) {
    return {
      state: 'post-crema',
      icon: '⏳',
      statusMessage: 'Esta falla ya fue quemada. ¡Nos vemos de nuevo en las Fallas 2027!',
      statusColor: '#6b7280', // Gray
      showOnMap: true
    };
  }

  // ACTIVE: Durante las Fallas (entre Plantà y Cremà)
  return {
    state: 'active',
    icon: '', // Usará el icono normal de la categoría
    statusMessage: `¡Falla activa! Puedes visitarla hasta el 19 de marzo a las ${cremaHour}:00h (Cremà ${fallaType === 'infantil' ? 'Infantil' : 'Grande'}).`,
    statusColor: '#10b981', // Green
    showOnMap: true
  };
};

/**
 * Obtiene el icono apropiado para mostrar en el mapa
 */
export const getFallaMapIcon = (
  fallaType: 'grande' | 'infantil',
  category: string,
  selectedDay: number,
  currentHour: number
): string => {
  const stateInfo = getFallaState(fallaType, selectedDay, currentHour);
  
  // Si tiene icono especial de estado, usarlo
  if (stateInfo.icon) {
    return stateInfo.icon;
  }
  
  // Sino, usar icono de categoría
  return getCategoryIcon(category, fallaType);
};

/**
 * Icono por categoría (para fallas activas)
 */
export const getCategoryIcon = (category: string, type: 'grande' | 'infantil'): string => {
  // Infantiles tienen su propio icono
  if (type === 'infantil') {
    if (category.includes('Especial')) return '👶👑';
    return '👶';
  }

  // Grandes por categoría
  const categoryIcons: Record<string, string> = {
    'Especial': '👑',
    'Primera': '🥇',
    'Segunda': '🥈',
    'Tercera': '🥉',
    'Cuarta': '🏅',
    'Quinta': '🎖️',
    'Sexta': '🎗️',
    'Séptima': '🏵️',
    'Octava': '🌟',
    'Novena': '⭐',
    'I+E y Corona': '🌸'
  };

  return categoryIcons[category] || '🎨';
};

/**
 * Determina si una falla debe mostrar animación de fuego
 */
export const shouldShowBurningAnimation = (
  fallaType: 'grande' | 'infantil',
  selectedDay: number,
  currentHour: number
): boolean => {
  const CREMA_DAY = 19;
  const CREMA_INFANTIL_HOUR = 20;
  const CREMA_GRANDE_HOUR = 22;
  
  const cremaHour = fallaType === 'infantil' ? CREMA_INFANTIL_HOUR : CREMA_GRANDE_HOUR;
  
  return selectedDay === CREMA_DAY && currentHour >= cremaHour && currentHour < cremaHour + 1;
};

/**
 * Obtiene el color del marcador según estado
 */
export const getFallaMarkerColor = (
  fallaType: 'grande' | 'infantil',
  selectedDay: number,
  currentHour: number
): string => {
  const stateInfo = getFallaState(fallaType, selectedDay, currentHour);
  return stateInfo.statusColor;
};
