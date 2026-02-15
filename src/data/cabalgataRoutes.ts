// src/data/cabalgataRoutes.ts

export interface CabalgataRoute {
  coordinates: [number, number][]; // [lat, lng]
  name: string;
  date: number; // día del mes
  startHour: number;
  endHour: number;
  dateRange?: number[]; // para eventos de múltiples días [startDay, endDay]
}

export const cabalgataRoutes: Record<string, CabalgataRoute> = {
  ninot: {
    name: "Cabalgata del Ninot",
    date: 28, // 28 de febrero
    startHour: 17, // 17:30
    endHour: 20, // Hasta 20:00 (2.5 horas)
    coordinates: [
      [39.4721, -0.37056],
      [39.47282, -0.37069],
      [39.47379, -0.37555],
      [39.47232, -0.37671],
      [39.47139, -0.37675],
      [39.4699, -0.3763]
    ]
  },
  fuego: {
    name: "Cabalgata del Fuego",
    date: 19, // 19 de marzo
    startHour: 19, // 19:00
    endHour: 20, // Hasta 20:00 (1 hora)
    coordinates: [
      [39.4738, -0.37547],
      [39.4727, -0.37011],
      [39.4722, -0.37004],
      [39.47209, -0.36848]
    ]
  },
  ofrenda_la_paz: {
    name: "Ofrenda - Calle La Paz",
    date: 17, // 17-18 de marzo
    dateRange: [17, 18],
    startHour: 15, // 15:30
    endHour: 1, // Hasta 01:00 (siguiente día)
    coordinates: [
      [39.4727, -0.37011],
      [39.4738, -0.37547],
      [39.47513, -0.37532],
      [39.47504, -0.37504],
      [39.47598, -0.37443],
      [39.47626, -0.37523] // Plaza de la Virgen (destino)
    ]
  },
  ofrenda_san_vicente: {
    name: "Ofrenda - Calle San Vicente",
    date: 17, // 17-18 de marzo
    dateRange: [17, 18],
    startHour: 15, // 15:30
    endHour: 1, // Hasta 01:00 (siguiente día)
    coordinates: [
      [39.4699, -0.3763],
      [39.47232, -0.37671],
      [39.4738, -0.37547],
      [39.47513, -0.37532],
      [39.47527, -0.37579],
      [39.47602, -0.37521],
      [39.47626, -0.37523] // Plaza de la Virgen (destino)
    ]
  }
};

// Coordenadas de la Plaza de la Virgen (donde se coloca el icono)
export const PLAZA_VIRGEN_COORDS: [number, number] = [39.47626, -0.37523];
