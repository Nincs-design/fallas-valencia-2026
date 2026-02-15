// src/services/routeExportService.ts
import { Falla, RouteStop } from '@/types';

export interface ExportedRoute {
  version: string;
  name: string;
  description?: string;
  createdAt: string;
  stops: Array<{
    id: number;
    name: string;
    lat: number;
    lng: number;
  }>;
  optimized: boolean;
  stats?: {
    totalDistance: string;
    totalTime: number;
    totalStops: number;
  };
}

export class RouteExportService {
  /**
   * Exporta una ruta como JSON descargable
   */
  static exportToJSON(
    route: RouteStop[], 
    routeName: string = 'Mi Ruta Fallas 2026',
    description?: string
  ): void {
    const exportData: ExportedRoute = {
      version: '1.0',
      name: routeName,
      description,
      createdAt: new Date().toISOString(),
      stops: route.map(stop => ({
        id: stop.id,
        name: stop.name,
        lat: stop.lat,
        lng: stop.lng
      })),
      optimized: true,
      stats: route.length > 0 ? {
        totalDistance: this.calculateTotalDistance(route),
        totalTime: this.calculateTotalTime(route),
        totalStops: route.length
      } : undefined
    };

    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `ruta-fallas-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Exporta una ruta como GPX (para GPS)
   */
  static exportToGPX(route: RouteStop[], routeName: string = 'Ruta Fallas'): void {
    const gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Fallas València 2026" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${routeName}</name>
    <desc>Ruta de Fallas de València 2026</desc>
    <time>${new Date().toISOString()}</time>
  </metadata>
  <rte>
    <name>${routeName}</name>
${route.map((stop, index) => `    <rtept lat="${stop.lat}" lon="${stop.lng}">
      <name>Parada ${index + 1}: ${stop.name}</name>
      <desc>${stop.theme || 'Falla de València'}</desc>
    </rtept>`).join('\n')}
  </rte>
</gpx>`;

    const blob = new Blob([gpx], { type: 'application/gpx+xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `ruta-fallas-${Date.now()}.gpx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Importa una ruta desde un archivo JSON
   */
  static async importFromJSON(file: File): Promise<ExportedRoute | null> {
    try {
      // Límite de tamaño: máximo 100 KB para un archivo de ruta
      if (file.size > 100 * 1024) {
        throw new Error('El archivo es demasiado grande (máx. 100 KB)');
      }

      // Verificar tipo MIME
      if (file.type && !['application/json', 'text/plain', ''].includes(file.type)) {
        throw new Error('Tipo de archivo no permitido');
      }

      const text = await file.text();
      const data = JSON.parse(text) as ExportedRoute;

      // Validar estructura
      if (!data.stops || !Array.isArray(data.stops)) {
        throw new Error('Formato de ruta inválido');
      }

      // Limitar número de paradas
      if (data.stops.length > 50) {
        throw new Error('La ruta tiene demasiadas paradas (máx. 50)');
      }

      // Validar cada parada con tipos estrictos
      for (const stop of data.stops) {
        if (
          typeof stop.id !== 'number' || stop.id <= 0 ||
          typeof stop.name !== 'string' || stop.name.length === 0 || stop.name.length > 200 ||
          typeof stop.lat !== 'number' || !isFinite(stop.lat) || stop.lat < -90 || stop.lat > 90 ||
          typeof stop.lng !== 'number' || !isFinite(stop.lng) || stop.lng < -180 || stop.lng > 180
        ) {
          throw new Error('Datos de parada inválidos');
        }
      }

      return data;
    } catch (error) {
      console.error('Error al importar ruta:', error);
      return null;
    }
  }

  /**
   * Calcula distancia total de la ruta
   */
  private static calculateTotalDistance(route: RouteStop[]): string {
    let total = 0;
    for (let i = 0; i < route.length - 1; i++) {
      total += this.haversineDistance(
        route[i].lat, route[i].lng,
        route[i + 1].lat, route[i + 1].lng
      );
    }
    return total.toFixed(2) + ' km';
  }

  /**
   * Calcula tiempo total de la ruta (asumiendo 5 km/h caminando)
   */
  private static calculateTotalTime(route: RouteStop[]): number {
    const distanceKm = parseFloat(this.calculateTotalDistance(route));
    const walkingSpeedKmH = 5;
    const timeHours = distanceKm / walkingSpeedKmH;
    return Math.round(timeHours * 60); // minutos
  }

  /**
   * Fórmula de Haversine para calcular distancia entre coordenadas
   */
  private static haversineDistance(
    lat1: number, lon1: number, 
    lat2: number, lon2: number
  ): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
