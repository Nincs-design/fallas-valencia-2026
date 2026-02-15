// src/types/index.ts

export interface Falla {
  id: number;
  name: string;
  lat: number;
  lng: number;
  address?: string;
  category: 'Municipal' | 'Especial' | 'Experimental' | 'Primera' | 'Segunda' | 'Tercera' | 'CategoriaA' | 'CategoriaB' | 'EspecialInfantil' | 'Evento';
  theme: string;
  facts: string;
  artist?: string;
  president?: string;
  fallera?: string;
  boceto?: string;
  fundacion?: number;
  distintivo?: string;
  type?: 'grande' | 'infantil';
  isExperimental?: boolean;
  isMunicipal?: boolean;
}

export interface Event {
  name: string;
  time: string;
  description: string;
  animation: string;
}

export interface EventsData {
  [key: number]: Event;
}

export interface RouteStop extends Falla {
  distanceFromPrevious?: number;
  estimatedWalkingTime?: number;
}

export interface RouteStats {
  totalStops: number;
  totalDistance: string;
  totalTime: number;
  estimatedDuration: string;
}

export interface UserLocation {
  lat: number;
  lng: number;
}

export type AnimationType = 'cabalgata' | 'ofrenda' | 'mascletà' | 'cremà';
