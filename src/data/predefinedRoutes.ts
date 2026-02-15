// src/data/predefinedRoutes.ts

export interface PredefinedRoute {
  id: string;
  name: string;
  description: string;
  icon: string;
  duration: string;
  distance: string;
  difficulty: 'easy' | 'medium' | 'hard';
  fallaIds: number[];
  tags: string[];
  recommendations: string[];
}

export const predefinedRoutes: PredefinedRoute[] = [
  {
    id: 'institutional',
    name: 'Ruta Institucional',
    description: 'Visita las fallas más emblemáticas y oficiales de Valencia, incluyendo las municipales y especiales más premiadas.',
    icon: '🏛️',
    duration: '2-3 horas',
    distance: '3.5 km',
    difficulty: 'easy',
    fallaIds: [335, 10219, 10, 11, 12, 13], // Municipal + Especiales (IDs de ejemplo)
    tags: ['Municipal', 'Especial', 'Historia', 'Premiadas'],
    recommendations: [
      'Empieza temprano para evitar multitudes',
      'Lleva cámara para los bocetos oficiales',
      'Parada recomendada: Plaza del Ayuntamiento'
    ]
  },
  {
    id: 'vanguard',
    name: 'Ruta Vanguardista',
    description: 'Explora el lado más innovador de las Fallas con las instalaciones experimentales (I+E) que rompen con lo tradicional.',
    icon: '🔬',
    duration: '2.5 horas',
    distance: '4.2 km',
    difficulty: 'medium',
    fallaIds: [3, 4, 5, 240, 6, 7], // Experimentales (IDs de ejemplo)
    tags: ['Experimental', 'Arte Contemporáneo', 'Innovación'],
    recommendations: [
      'Ideal para amantes del arte moderno',
      'Algunas fallas pueden tener horarios especiales',
      'Perfecto para fotografía artística'
    ]
  },
  {
    id: 'family',
    name: 'Ruta Familiar',
    description: 'Un recorrido pensado para disfrutar con niños, visitando fallas infantiles y con zonas de descanso.',
    icon: '👨‍👩‍👧‍👦',
    duration: '1.5-2 horas',
    distance: '2.1 km',
    difficulty: 'easy',
    fallaIds: [10219, 8, 9, 10, 11], // Infantiles cercanas (IDs de ejemplo)
    tags: ['Infantil', 'Familiar', 'Corta', 'Fácil'],
    recommendations: [
      'Parques infantiles cerca de cada parada',
      'Zonas de merendero disponibles',
      'Horarios recomendados: mañana o tarde',
      'Baños públicos en la ruta'
    ]
  },
  {
    id: 'artist',
    name: 'Ruta del Arte Fallero',
    description: 'Descubre las obras de los mejores artistas falleros: bocetos espectaculares y técnicas innovadoras.',
    icon: '🎨',
    duration: '3-4 horas',
    distance: '5.8 km',
    difficulty: 'medium',
    fallaIds: [10, 11, 12, 13, 14, 15, 16], // Fallas de artistas destacados (IDs de ejemplo)
    tags: ['Arte', 'Artistas', 'Especial', 'Primera'],
    recommendations: [
      'Lleva guía de artistas falleros',
      'Tiempo extra en cada parada (20-30 min)',
      'Fotografía permitida de bocetos',
      'Visita casales si están abiertos'
    ]
  },
  {
    id: 'express',
    name: 'Ruta Exprés',
    description: 'Para los que tienen poco tiempo: 5 fallas imprescindibles en menos de 1 hora. ¡Lo mejor en tiempo récord!',
    icon: '⚡',
    duration: '45-60 min',
    distance: '1.8 km',
    difficulty: 'easy',
    fallaIds: [335, 10, 11, 12, 13], // 5 fallas cercanas y top (IDs de ejemplo)
    tags: ['Rápida', 'Esencial', 'Centro'],
    recommendations: [
      'Perfecta para turistas con poco tiempo',
      'Todas en el centro histórico',
      'Combina con otras actividades',
      'Mejor hacer a primera hora'
    ]
  },
  {
    id: 'historic',
    name: 'Ruta Histórica',
    description: 'Visita las comisiones falleras más antiguas de Valencia, algunas con más de 100 años de historia.',
    icon: '📜',
    duration: '3 horas',
    distance: '4.5 km',
    difficulty: 'medium',
    fallaIds: [10, 122, 32, 88, 54, 124], // Fallas antiguas (IDs de ejemplo basados en años de fundación)
    tags: ['Historia', 'Tradición', 'Patrimonio'],
    recommendations: [
      'Visita los casales históricos',
      'Pregunta por las fotos antiguas',
      'Muchas tienen museos pequeños',
      'Guía histórica disponible en App'
    ]
  },
  {
    id: 'photography',
    name: 'Ruta del Fotógrafo',
    description: 'Las mejores localizaciones para fotografía: fallas en plazas emblemáticas con arquitectura impresionante de fondo.',
    icon: '📸',
    duration: '2.5 horas',
    distance: '3.2 km',
    difficulty: 'easy',
    fallaIds: [335, 10, 122, 88, 54], // Fallas en plazas bonitas (IDs de ejemplo)
    tags: ['Fotografía', 'Arquitectura', 'Plazas'],
    recommendations: [
      'Mejor luz: amanecer o atardecer',
      'Lleva trípode si es posible',
      'Plazas amplias para perspectiva',
      'Evita horas punta de turistas'
    ]
  },
  {
    id: 'gastronomic',
    name: 'Ruta Gastronómica Fallera',
    description: 'Combina las mejores fallas con paradas en bares, horchaterías y restaurantes típicos valencianos.',
    icon: '🍽️',
    duration: '4-5 horas',
    distance: '3.8 km',
    difficulty: 'easy',
    fallaIds: [10, 12, 13, 54, 240], // Fallas cerca de zonas gastronómicas (IDs de ejemplo)
    tags: ['Gastronomía', 'Cultura', 'Ocio'],
    recommendations: [
      'Reserva en restaurantes con antelación',
      'Prueba la horchata en Horchatería Santa Catalina',
      'Paella en Mercado Central',
      'Almuerzo: 14:00-16:00',
      'Cena: 21:00-23:00'
    ]
  }
];

/**
 * Obtiene una ruta predefinida por ID
 */
export const getPredefinedRoute = (id: string): PredefinedRoute | undefined => {
  return predefinedRoutes.find(route => route.id === id);
};

/**
 * Filtra rutas por tags
 */
export const filterRoutesByTag = (tag: string): PredefinedRoute[] => {
  return predefinedRoutes.filter(route => 
    route.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
  );
};

/**
 * Filtra rutas por dificultad
 */
export const filterRoutesByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): PredefinedRoute[] => {
  return predefinedRoutes.filter(route => route.difficulty === difficulty);
};

/**
 * Obtiene rutas por duración máxima (en minutos)
 */
export const getRoutesByMaxDuration = (maxMinutes: number): PredefinedRoute[] => {
  return predefinedRoutes.filter(route => {
    const duration = route.duration.split('-')[0];
    const minutes = parseInt(duration) * 60;
    return minutes <= maxMinutes;
  });
};
