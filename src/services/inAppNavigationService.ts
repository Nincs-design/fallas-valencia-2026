// src/services/inAppNavigationService.ts
import { RouteStop } from '@/types';

export interface NavigationState {
  isNavigating: boolean;
  currentStopIndex: number;
  nextStop: RouteStop;
  distanceToNext: number; // metros
  timeToNext: number; // minutos
  direction: string; // Norte, Sur, Este, Oeste
  instruction: string;
  totalStops: number;
  completedStops: number;
  arrived: boolean;
}

export class InAppNavigationService {
  private route: RouteStop[] = [];
  private currentPosition: { lat: number; lng: number } | null = null;
  private currentStopIndex: number = 0;
  private watchId: number | null = null;
  private updateCallback: ((state: NavigationState) => void) | null = null;
  private arrivalDistance = 50; // metros

  /**
   * Inicia la navegación
   */
  startNavigation(
    route: RouteStop[],
    userLocation: { lat: number; lng: number },
    onUpdate: (state: NavigationState) => void
  ): void {
    if (route.length === 0) return;

    this.route = route;
    this.currentPosition = userLocation;
    this.currentStopIndex = 0;
    this.updateCallback = onUpdate;

    // Iniciar seguimiento GPS
    this.startLocationTracking();

    // Primera actualización
    this.updateState();
  }

  /**
   * Detiene la navegación
   */
  stopNavigation(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.route = [];
    this.currentStopIndex = 0;
    this.updateCallback = null;
  }

  /**
   * Salta a la siguiente parada
   */
  nextStop(): void {
    if (this.currentStopIndex < this.route.length - 1) {
      this.currentStopIndex++;
      this.updateState();
    }
  }

  /**
   * Inicia tracking de ubicación
   */
  private startLocationTracking(): void {
    if (!navigator.geolocation) {
      console.error('Geolocalización no disponible');
      return;
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.currentPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.updateState();
        this.checkArrival();
      },
      (error) => console.error('Error GPS:', error),
      {
        enableHighAccuracy: true,
        maximumAge: 2000,
        timeout: 10000
      }
    );
  }

  /**
   * Actualiza el estado de navegación
   */
  private updateState(): void {
    if (!this.currentPosition || this.currentStopIndex >= this.route.length) {
      return;
    }

    const nextStop = this.route[this.currentStopIndex];
    const distance = this.getDistance(
      this.currentPosition.lat,
      this.currentPosition.lng,
      nextStop.lat,
      nextStop.lng
    );

    const bearing = this.getBearing(
      this.currentPosition.lat,
      this.currentPosition.lng,
      nextStop.lat,
      nextStop.lng
    );

    const direction = this.bearingToDirection(bearing);
    const distanceMeters = Math.round(distance * 1000);
    const timeMinutes = Math.ceil((distance * 1000) / 83); // 5km/h = 83m/min

    const instruction = distanceMeters < this.arrivalDistance
      ? `¡Llegaste! ${nextStop.name}`
      : `Camina ${distanceMeters}m hacia el ${direction}`;

    const state: NavigationState = {
      isNavigating: true,
      currentStopIndex: this.currentStopIndex,
      nextStop,
      distanceToNext: distanceMeters,
      timeToNext: timeMinutes,
      direction,
      instruction,
      totalStops: this.route.length,
      completedStops: this.currentStopIndex,
      arrived: distanceMeters < this.arrivalDistance
    };

    this.updateCallback?.(state);
  }

  /**
   * Verifica si llegaste a la parada
   */
  private checkArrival(): void {
    if (!this.currentPosition || this.currentStopIndex >= this.route.length) {
      return;
    }

    const nextStop = this.route[this.currentStopIndex];
    const distance = this.getDistance(
      this.currentPosition.lat,
      this.currentPosition.lng,
      nextStop.lat,
      nextStop.lng
    );

    const distanceMeters = distance * 1000;

    // Si estás a menos de 50m, avanzar automáticamente
    if (distanceMeters < this.arrivalDistance) {
      setTimeout(() => {
        if (this.currentStopIndex < this.route.length - 1) {
          this.currentStopIndex++;
          this.updateState();
        } else {
          // Ruta completada
          this.stopNavigation();
        }
      }, 3000); // Esperar 3 segundos antes de avanzar
    }
  }

  /**
   * Calcula distancia (Haversine) en km
   */
  private getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Calcula bearing (dirección) en grados
   */
  private getBearing(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const dLng = this.toRad(lng2 - lng1);
    const y = Math.sin(dLng) * Math.cos(this.toRad(lat2));
    const x = Math.cos(this.toRad(lat1)) * Math.sin(this.toRad(lat2)) -
              Math.sin(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * Math.cos(dLng);
    
    let bearing = Math.atan2(y, x);
    bearing = (bearing * 180 / Math.PI + 360) % 360;
    return bearing;
  }

  /**
   * Convierte bearing a dirección cardinal
   */
  private bearingToDirection(bearing: number): string {
    const directions = [
      'Norte', 'Noreste', 'Este', 'Sureste',
      'Sur', 'Suroeste', 'Oeste', 'Noroeste'
    ];
    const index = Math.round(bearing / 45) % 8;
    return directions[index];
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}

export const inAppNavigationService = new InAppNavigationService();
