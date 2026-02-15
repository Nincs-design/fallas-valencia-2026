// src/services/routeOptimizer.ts
import { Falla, RouteStop, RouteStats, UserLocation } from '@/types';
import { TransportMode, calculateEstimatedTime } from '@/types/transportMode';

export class RouteOptimizerService {
  // Calcular distancia entre dos puntos (Haversine formula)
  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Algoritmo greedy del vecino más cercano (Nearest Neighbor)
  optimizeRoute(
    locations: Falla[], 
    startLocation: UserLocation,
    transportMode: TransportMode = 'walking'
  ): RouteStop[] {
    if (locations.length === 0) return [];
    
    const optimized: RouteStop[] = [];
    const remaining = [...locations];
    let current = startLocation;

    while (remaining.length > 0) {
      let nearestIndex = 0;
      let minDistance = Infinity;

      remaining.forEach((location, index) => {
        const distance = this.calculateDistance(
          current.lat, current.lng,
          location.lat, location.lng
        );

        if (distance < minDistance) {
          minDistance = distance;
          nearestIndex = index;
        }
      });

      const nearest = remaining.splice(nearestIndex, 1)[0];
      const estimatedTime = calculateEstimatedTime(minDistance, transportMode);
      
      optimized.push({
        ...nearest,
        distanceFromPrevious: minDistance,
        estimatedWalkingTime: estimatedTime
      });
      current = nearest;
    }

    return optimized;
  }

  // Calcular estadísticas de la ruta
  getRouteStats(optimizedRoute: RouteStop[]): RouteStats {
    let totalDistance = 0;
    let totalTime = 0;

    optimizedRoute.forEach(location => {
      totalDistance += location.distanceFromPrevious || 0;
      totalTime += location.estimatedWalkingTime || 0;
    });

    return {
      totalStops: optimizedRoute.length,
      totalDistance: totalDistance.toFixed(2),
      totalTime: totalTime,
      estimatedDuration: this.formatTime(totalTime)
    };
  }

  private formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  }
}

export const routeOptimizer = new RouteOptimizerService();
