// src/utils/fallaStateUtils.ts

export type FallaState = 
  | 'pre-construction'
  | 'active'
  | 'burning'
  | 'post-crema';

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
  fallaType: 'grande' | 'infantil' | undefined,
  selectedDay: number,
  currentHour: number
): FallaStateInfo => {
  const resolvedType: 'grande' | 'infantil' = fallaType === 'infantil' ? 'infantil' : 'grande';

  const PLANTA_INFANTIL_DAY = 15;
  const PLANTA_GRANDE_DAY = 16;
  const CREMA_DAY = 19;
  const CREMA_INFANTIL_HOUR = 20;
  const CREMA_GRANDE_HOUR = 22;

  const plantaDay = resolvedType === 'infantil' ? PLANTA_INFANTIL_DAY : PLANTA_GRANDE_DAY;
  const cremaHour = resolvedType === 'infantil' ? CREMA_INFANTIL_HOUR : CREMA_GRANDE_HOUR;

  if (selectedDay < plantaDay) {
    return {
      state: 'pre-construction',
      icon: '⏳',
      statusMessage: `Esta falla está en construcción. Ven a visitarla el día ${plantaDay} de marzo (Plantà ${resolvedType === 'infantil' ? 'Infantiles' : 'Grandes'}).`,
      statusColor: '#f59e0b',
      showOnMap: true
    };
  }

  if (selectedDay === CREMA_DAY && currentHour >= cremaHour) {
    return {
      state: 'burning',
      icon: '🔥',
      statusMessage: `¡Esta falla está siendo quemada! La Cremà ${resolvedType === 'infantil' ? 'Infantil' : 'Grande'} está en curso.`,
      statusColor: '#ef4444',
      showOnMap: true
    };
  }

  if (selectedDay > CREMA_DAY || (selectedDay === CREMA_DAY && currentHour >= cremaHour + 1)) {
    return {
      state: 'post-crema',
      icon: '⏳',
      statusMessage: 'Esta falla ya fue quemada. ¡Nos vemos de nuevo en las Fallas 2027!',
      statusColor: '#6b7280',
      showOnMap: true
    };
  }

  return {
    state: 'active',
    icon: '',
    statusMessage: `¡Falla activa! Puedes visitarla hasta el 19 de marzo a las ${cremaHour}:00h.`,
    statusColor: '#10b981',
    showOnMap: true
  };
};

/**
 * Obtiene el icono apropiado para mostrar en el mapa
 */
export const getFallaMapIcon = (
  fallaType: 'grande' | 'infantil' | undefined,
  category: string,
  selectedDay: number,
  currentHour: number
): string => {
  const stateInfo = getFallaState(fallaType, selectedDay, currentHour);
  if (stateInfo.icon) return stateInfo.icon;
  return getCategoryIcon(category, fallaType);
};

/**
 * Icono por categoría
 */
export const getCategoryIcon = (
  category: string,
  type: 'grande' | 'infantil' | undefined
): string => {
  if (type === 'infantil') {
    if (category.includes('Especial')) return '👶👑';
    return '👶';
  }

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
  fallaType: 'grande' | 'infantil' | undefined,
  selectedDay: number,
  currentHour: number
): boolean => {
  const CREMA_DAY = 19;
  const CREMA_INFANTIL_HOUR = 20;
  const CREMA_GRANDE_HOUR = 22;
  const resolvedType = fallaType === 'infantil' ? 'infantil' : 'grande';
  const cremaHour = resolvedType === 'infantil' ? CREMA_INFANTIL_HOUR : CREMA_GRANDE_HOUR;
  return selectedDay === CREMA_DAY && currentHour >= cremaHour;
};

/**
 * Devuelve la clase CSS para el estado de la falla
 */
export const getFallaStateClass = (
  fallaType: 'grande' | 'infantil' | undefined,
  selectedDay: number,
  currentHour: number
): string => {
  const { state } = getFallaState(fallaType, selectedDay, currentHour);
  return `falla-${state}`;
};

/**
 * Devuelve el color del marcador según el estado
 */
export const getFallaMarkerColor = (
  fallaType: 'grande' | 'infantil' | undefined,
  selectedDay: number,
  currentHour: number
): string => {
  const { state } = getFallaState(fallaType, selectedDay, currentHour);
  switch (state) {
    case 'pre-construction': return '#f59e0b';
    case 'burning': return '#ef4444';
    case 'post-crema': return '#6b7280';
    default: return fallaType === 'infantil' ? '#10b981' : '#3b82f6';
  }
};
