// src/components/Map/MapContainer.tsx
import React, { useEffect, useMemo } from 'react';
import { MapContainer as LeafletMap, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { divIcon, LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAppStore } from '@/stores/useAppStore';
import { fallasData } from '@/data/fallas';
import { NavigationControls } from '@/components/common/NavigationControls';
import { EventMarkersLayer } from '@/components/EventMarkers';
import { CabalgataManager } from '@/components/CabalgataAnimation';
import { OfrendaManager } from '@/components/OfrendaAnimation';
import { useEventAnimations } from '@/hooks/useEventAnimations';
import { getFallaMapIcon, getFallaMarkerColor } from '@/utils/fallaStateUtils';
import { Falla, RouteStop } from '@/types';
import './Map.css';

const FallaMarker = ({ falla }: { falla: Falla }) => {
  const setSelectedFalla = useAppStore(state => state.setSelectedFalla);
  const selectedDay = useAppStore(state => state.selectedDay);
  const selectedHour = useAppStore(state => state.selectedHour);
  const clockMode = useAppStore(state => state.clockMode);
  
  // Get current hour based on clock mode
  const currentHour = clockMode === 'real' ? new Date().getHours() : selectedHour;
  
  // Get icon and color based on falla state
  const icon = getFallaMapIcon(falla.type, falla.category, selectedDay, currentHour);
  const color = getFallaMarkerColor(falla.type, selectedDay, currentHour);
  
  let markerClass = 'custom-marker';
  if (falla.type === 'infantil') {
    markerClass += ' marker-infantil';
  }
  if (falla.isExperimental || falla.category === 'Experimental') {
    markerClass += ' marker-experimental';
  }
  if (falla.isMunicipal || falla.category === 'Municipal') {
    markerClass += ' marker-municipal';
  }
  
  const customIcon = divIcon({
    html: `
      <div class="${markerClass}" style="background-color: ${color}">
        <span style="font-size: 20px; line-height: 1;">${icon}</span>
      </div>
    `,
    className: 'custom-marker-container',
    iconSize: [40, 40],
  });

  return (
    <Marker
      position={[falla.lat, falla.lng]}
      icon={customIcon}
      eventHandlers={{
        click: () => setSelectedFalla(falla)
      }}
    >
      <Popup>{falla.name}</Popup>
    </Marker>
  );
};

const UserMarker = ({ lat, lng }: { lat: number; lng: number }) => {
  const userIcon = divIcon({
    html: '<div style="width: 20px; height: 20px; background: #06A77D; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>',
    className: '',
    iconSize: [20, 20],
  });

  return <Marker position={[lat, lng]} icon={userIcon} />;
};

const RouteLayer = ({ route }: { route: RouteStop[] }) => {
  const userLocation = useAppStore(state => state.userLocation);
  
  if (route.length === 0) return null;

  const coordinates: LatLngExpression[] = [
    [userLocation.lat, userLocation.lng],
    ...route.map(loc => [loc.lat, loc.lng] as LatLngExpression)
  ];

  return (
    <>
      <Polyline
        positions={coordinates}
        pathOptions={{
          color: '#FF6B35',
          weight: 6,
          opacity: 0.8,
          dashArray: '10, 15',
        }}
      />
      {route.map((location, index) => {
        const numberIcon = divIcon({
          html: `<div class="route-number-marker">${index + 1}</div>`,
          className: '',
          iconSize: [32, 32],
        });

        return (
          <Marker
            key={`route-${location.id}`}
            position={[location.lat, location.lng]}
            icon={numberIcon}
          />
        );
      })}
    </>
  );
};

const MapController = () => {
  const map = useMap();
  const optimizedRoute = useAppStore(state => state.optimizedRoute);
  const userLocation = useAppStore(state => state.userLocation);
  const clockMode = useAppStore(state => state.clockMode);
  const [, forceUpdate] = React.useState({});

  // Activar animaciones de eventos
  useEventAnimations();

  // Actualizar mapa cada minuto cuando está en modo real
  useEffect(() => {
    if (clockMode === 'real') {
      const interval = setInterval(() => {
        forceUpdate({}); // Force re-render to update map style
      }, 60000); // Cada 60 segundos

      return () => clearInterval(interval);
    }
  }, [clockMode]);

  useEffect(() => {
    if (optimizedRoute.length > 0) {
      const coordinates: LatLngExpression[] = [
        [userLocation.lat, userLocation.lng],
        ...optimizedRoute.map(loc => [loc.lat, loc.lng] as LatLngExpression)
      ];
      
      const bounds = coordinates.map(coord => coord as [number, number]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [optimizedRoute, map, userLocation]);

  return null;
};

export const MapComponent = () => {
  const userLocation = useAppStore(state => state.userLocation);
  const optimizedRoute = useAppStore(state => state.optimizedRoute);
  const fallaTypeFilter = useAppStore(state => state.fallaTypeFilter);
  const categoryFilter = useAppStore(state => state.categoryFilter);
  const selectedHour = useAppStore(state => state.selectedHour);
  const clockMode = useAppStore(state => state.clockMode);
  
  // Mapbox token desde variables de entorno (nunca hardcodeado)
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

  // Aviso en desarrollo si falta el token
  if (!mapboxToken && import.meta.env.DEV) {
    console.warn('⚠️ VITE_MAPBOX_TOKEN no está definido. Copia .env.example a .env y añade tu token.');
  }

  // Determinar estilo del mapa según hora del día
  const mapStyle = useMemo(() => {
    // Obtener hora a usar según el modo
    const hour = clockMode === 'real' ? new Date().getHours() : selectedHour;
    
    // Definir horarios de día/noche (ajustados para València)
    // Amanecer: ~7:00 AM
    // Anochecer: ~20:00 (8:00 PM) en invierno/primavera
    
    // Día: 7:00 - 19:59 (7 AM - 7:59 PM) → Light
    // Noche: 20:00 - 6:59 (8 PM - 6:59 AM) → Dark
    const isDayTime = hour >= 7 && hour < 20;
    return isDayTime ? 'light-v11' : 'dark-v11';
  }, [selectedHour, clockMode]);

  // Aplicar filtros a las fallas
  const filteredFallas = useMemo(() => {
    return fallasData.filter(falla => {
      // Filtrar por tipo (adulta/infantil)
      if (fallaTypeFilter !== 'all' && falla.type !== fallaTypeFilter) {
        return false;
      }
      
      // Filtrar por categoría
      if (categoryFilter && falla.category !== categoryFilter) {
        return false;
      }
      
      return true;
    });
  }, [fallaTypeFilter, categoryFilter]);

  return (
    <LeafletMap
      center={[userLocation.lat, userLocation.lng]}
      zoom={14}
      zoomControl={false}
      attributionControl={false}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        key={mapStyle} // Force re-render when style changes
        url={`https://api.mapbox.com/styles/v1/mapbox/${mapStyle}/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`}
        attribution='&copy; <a href="https://www.mapbox.com/">Mapbox</a>'
        tileSize={512}
        zoomOffset={-1}
        maxZoom={19}
      />
      
      <UserMarker lat={userLocation.lat} lng={userLocation.lng} />
      
      {filteredFallas.map(falla => (
        <FallaMarker key={falla.id} falla={falla} />
      ))}

      <RouteLayer route={optimizedRoute} />
      
      {/* Marcadores de eventos con animaciones localizadas */}
      <EventMarkersLayer />
      
      {/* Animaciones de cabalgatas */}
      <CabalgataManager />
      
      {/* Animación de la Ofrenda a la Virgen */}
      <OfrendaManager />
      
      <MapController />
      
      <NavigationControls />
    </LeafletMap>
  );
};
