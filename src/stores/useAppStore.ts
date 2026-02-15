// src/stores/useAppStore.ts
import { create } from 'zustand';
import { Falla, RouteStop, UserLocation, AnimationType } from '@/types';
import { TransportMode } from '@/types/transportMode';

interface AppState {
  // User location
  userLocation: UserLocation;
  setUserLocation: (location: UserLocation) => void;

  // Selected falla (for panel)
  selectedFalla: Falla | null;
  setSelectedFalla: (falla: Falla | null) => void;

  // Route management
  selectedRoute: Falla[];
  addToRoute: (falla: Falla) => boolean;
  removeFromRoute: (fallaId: number) => void;
  clearRoute: () => void;
  optimizedRoute: RouteStop[];
  setOptimizedRoute: (route: RouteStop[]) => void;
  
  // Transport mode
  transportMode: TransportMode;
  setTransportMode: (mode: TransportMode) => void;

  // Calendar
  selectedDay: number;
  selectedHour: number;
  setSelectedDay: (day: number) => void;
  setSelectedHour: (hour: number) => void;
  
  // Clock mode: 'real' uses system time, 'manual' uses slider
  clockMode: 'real' | 'manual';
  setClockMode: (mode: 'real' | 'manual') => void;

  // Animation
  currentAnimation: AnimationType | null;
  setCurrentAnimation: (animation: AnimationType | null) => void;

  // UI state
  isPanelOpen: boolean;
  setIsPanelOpen: (isOpen: boolean) => void;
  isRouteBuilderOpen: boolean;
  setIsRouteBuilderOpen: (isOpen: boolean) => void;
  
  // Filters
  isFiltersOpen: boolean;
  setIsFiltersOpen: (isOpen: boolean) => void;
  fallaTypeFilter: 'all' | 'grande' | 'infantil';
  setFallaTypeFilter: (type: 'all' | 'grande' | 'infantil') => void;
  categoryFilter: Falla['category'] | null;
  setCategoryFilter: (category: Falla['category'] | null) => void;

  // Navigation
  isNavigating: boolean;
  setIsNavigating: (isNavigating: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // User location
  userLocation: { lat: 39.4699, lng: -0.3763 },
  setUserLocation: (location) => set({ userLocation: location }),

  // Selected falla
  selectedFalla: null,
  setSelectedFalla: (falla) => set({ selectedFalla: falla, isPanelOpen: !!falla }),

  // Route management
  selectedRoute: [],
  addToRoute: (falla) => {
    const { selectedRoute } = get();
    const exists = selectedRoute.find(f => f.id === falla.id);
    if (!exists) {
      set({ selectedRoute: [...selectedRoute, falla] });
      return true;
    }
    return false;
  },
  removeFromRoute: (fallaId) => {
    const { selectedRoute } = get();
    set({ 
      selectedRoute: selectedRoute.filter(f => f.id !== fallaId),
      optimizedRoute: []
    });
  },
  clearRoute: () => set({ selectedRoute: [], optimizedRoute: [] }),
  optimizedRoute: [],
  setOptimizedRoute: (route) => set({ optimizedRoute: route }),
  
  // Transport mode (default: walking)
  transportMode: 'walking',
  setTransportMode: (mode) => set({ transportMode: mode }),

  // Calendar
  selectedDay: 15,
  selectedHour: 12,
  setSelectedDay: (day) => set({ selectedDay: day }),
  setSelectedHour: (hour) => set({ selectedHour: hour }),
  
  // Clock mode default: 'real' (uses system time)
  clockMode: 'real',
  setClockMode: (mode) => set({ clockMode: mode }),

  // Animation
  currentAnimation: null,
  setCurrentAnimation: (animation) => set({ currentAnimation: animation }),

  // UI state
  isPanelOpen: false,
  setIsPanelOpen: (isOpen) => set({ isPanelOpen: isOpen }),
  isRouteBuilderOpen: false,
  setIsRouteBuilderOpen: (isOpen) => set({ isRouteBuilderOpen: isOpen }),
  
  // Filters
  isFiltersOpen: false,
  setIsFiltersOpen: (isOpen) => set({ isFiltersOpen: isOpen }),
  fallaTypeFilter: 'all',
  setFallaTypeFilter: (type) => set({ fallaTypeFilter: type }),
  categoryFilter: null,
  setCategoryFilter: (category) => set({ categoryFilter: category }),

  // Navigation
  isNavigating: false,
  setIsNavigating: (isNavigating) => set({ isNavigating }),
}));
