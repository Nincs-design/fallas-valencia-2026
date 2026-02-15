// src/App.tsx
import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/Search';
import { AudioControl } from './components/AudioControl';
import { MapComponent } from './components/Map';
import { CalendarWidget } from './components/Calendar';
import { FallaPanel } from './components/FallaPanel';
import { RouteBuilder } from './components/RouteBuilder';
import { FallasFilters } from './components/Filters';
import { PredefinedRoutesGallery } from './components/PredefinedRoutes';
import { NavigationPanel } from './components/Navigation';
import { AnimationsLayer } from './components/Animations';
import { AnimationsControlPanel } from './components/AnimationsControl';
import { Loading } from './components/common/Loading';
import { RouteShareService } from './services/routeShareService';
import { inAppNavigationService } from './services/inAppNavigationService';
import { fallasData } from './data/fallas';
import { useAppStore } from './stores/useAppStore';
import './styles/globals.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const isNavigating = useAppStore(state => state.isNavigating);
  const setIsNavigating = useAppStore(state => state.setIsNavigating);
  const optimizedRoute = useAppStore(state => state.optimizedRoute);
  const selectedRoute = useAppStore(state => state.selectedRoute);
  const userLocation = useAppStore(state => state.userLocation);

  useEffect(() => {
    // Simular carga inicial
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Load shared route from URL
  useEffect(() => {
    const routeIds = RouteShareService.parseRouteFromURL();
    if (routeIds && routeIds.length > 0) {
      // Find fallas by IDs
      const fallas = routeIds
        .map(id => fallasData.find(f => f.id === id))
        .filter(Boolean);

      if (fallas.length > 0) {
        // Add to route
        const addToRoute = useAppStore.getState().addToRoute;
        fallas.forEach(falla => {
          if (falla) addToRoute(falla);
        });

        // Open route builder
        useAppStore.getState().setIsRouteBuilderOpen(true);
      }
    }
  }, []);

  // Start navigation when flag is set
  useEffect(() => {
    if (isNavigating) {
      const route = optimizedRoute.length > 0 ? optimizedRoute : selectedRoute;
      if (route.length > 0) {
        inAppNavigationService.startNavigation(
          route,
          userLocation,
          (navState) => {
            console.log('Nav update:', navState);
          }
        );
      }
    } else {
      inAppNavigationService.stopNavigation();
    }

    return () => {
      if (isNavigating) {
        inAppNavigationService.stopNavigation();
      }
    };
  }, [isNavigating, optimizedRoute, selectedRoute, userLocation]);

  const handleCloseNavigation = () => {
    setIsNavigating(false);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Header />
      {!isNavigating && (
        <div style={{
          position: 'fixed',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: '600px',
          zIndex: 1000,
          padding: '0 20px'
        }}>
          <SearchBar />
        </div>
      )}
      <AnimationsLayer />
      <MapComponent />
      {!isNavigating && <CalendarWidget />}
      {!isNavigating && <FallasFilters />}
      <FallaPanel />
      {!isNavigating && <RouteBuilder />}
      {!isNavigating && <PredefinedRoutesGallery />}
      {!isNavigating && <AnimationsControlPanel />}
      {!isNavigating && <AudioControl />}
      {isNavigating && <NavigationPanel onClose={handleCloseNavigation} />}
    </>
  );
}

export default App;
