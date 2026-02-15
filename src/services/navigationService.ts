// src/services/navigationService.ts
import { RouteStop } from '@/types';
import { TransportMode } from '@/types/transportMode';

/**
 * Valida que unas coordenadas sean numéricas y estén en rango válido
 */
function isValidCoordinate(lat: number, lng: number): boolean {
  return (
    typeof lat === 'number' && isFinite(lat) &&
    typeof lng === 'number' && isFinite(lng) &&
    lat >= -90 && lat <= 90 &&
    lng >= -180 && lng <= 180
  );
}

/**
 * Sanitiza coordenadas para incluir en URLs (máx. 6 decimales)
 */
function sanitizeCoord(n: number): string {
  return parseFloat(n.toFixed(6)).toString();
}

export class NavigationService {
  /**
   * Abre Google Maps con la ruta completa
   */
  static openInGoogleMaps(
    route: RouteStop[], 
    userLocation: { lat: number; lng: number },
    transportMode: TransportMode = 'walking'
  ): void {
    if (route.length === 0) return;
    if (!isValidCoordinate(userLocation.lat, userLocation.lng)) return;

    // Construir waypoints validados
    const waypoints = route
      .slice(1, -1)
      .filter(stop => isValidCoordinate(stop.lat, stop.lng))
      .map(stop => `${sanitizeCoord(stop.lat)},${sanitizeCoord(stop.lng)}`)
      .join('|');

    // URL de Google Maps
    const destination = route[route.length - 1];
    if (!isValidCoordinate(destination.lat, destination.lng)) return;

    let url = `https://www.google.com/maps/dir/?api=1`;
    url += `&origin=${sanitizeCoord(userLocation.lat)},${sanitizeCoord(userLocation.lng)}`;
    url += `&destination=${sanitizeCoord(destination.lat)},${sanitizeCoord(destination.lng)}`;
    
    if (waypoints) {
      url += `&waypoints=${waypoints}`;
    }
    
    // Parámetro de modo de transporte
    const modeMap: Record<TransportMode, string> = {
      walking: 'walking',
      bicycling: 'bicycling',
      transit: 'transit',
      driving: 'driving'
    };
    url += `&travelmode=${modeMap[transportMode]}`;

    window.open(url, '_blank', 'noopener,noreferrer');
  }

  /**
   * Abre Waze con la primera parada de la ruta (solo para coche)
   */
  static openInWaze(route: RouteStop[]): void {
    if (route.length === 0) return;

    const firstStop = route[0];
    const url = `https://waze.com/ul?ll=${firstStop.lat},${firstStop.lng}&navigate=yes`;
    
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  /**
   * Abre Apple Maps (funciona en dispositivos iOS)
   */
  static openInAppleMaps(
    route: RouteStop[], 
    userLocation: { lat: number; lng: number },
    transportMode: TransportMode = 'walking'
  ): void {
    if (route.length === 0) return;

    const destination = route[route.length - 1];
    
    // Parámetros de Apple Maps
    // dirflg: d=driving, w=walking, r=transit
    const modeMap: Record<TransportMode, string> = {
      walking: 'w',
      bicycling: 'w', // Apple Maps no tiene bicycling, usa walking
      transit: 'r',
      driving: 'd'
    };
    
    const url = `https://maps.apple.com/?saddr=${sanitizeCoord(userLocation.lat)},${sanitizeCoord(userLocation.lng)}&daddr=${sanitizeCoord(destination.lat)},${sanitizeCoord(destination.lng)}&dirflg=${modeMap[transportMode]}`;
    
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  /**
   * Detecta el navegador más apropiado y abre
   */
  static openInPreferredApp(
    route: RouteStop[], 
    userLocation: { lat: number; lng: number },
    transportMode: TransportMode = 'walking'
  ): void {
    // Detectar iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
      this.openInAppleMaps(route, userLocation, transportMode);
    } else {
      this.openInGoogleMaps(route, userLocation, transportMode);
    }
  }

  /**
   * Genera deep link para navegación
   */
  static generateDeepLink(stop: RouteStop): string {
    return `geo:${sanitizeCoord(stop.lat)},${sanitizeCoord(stop.lng)}?q=${encodeURIComponent(stop.name)}`;
  }

  /**
   * Abre la navegación a una parada específica
   */
  static navigateToStop(
    stop: RouteStop, 
    userLocation: { lat: number; lng: number},
    transportMode: TransportMode = 'walking'
  ): void {
    const modeMap: Record<TransportMode, string> = {
      walking: 'walking',
      bicycling: 'bicycling',
      transit: 'transit',
      driving: 'driving'
    };
    
    const url = `https://www.google.com/maps/dir/?api=1&origin=${sanitizeCoord(userLocation.lat)},${sanitizeCoord(userLocation.lng)}&destination=${sanitizeCoord(stop.lat)},${sanitizeCoord(stop.lng)}&travelmode=${modeMap[transportMode]}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
