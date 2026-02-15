// src/components/EventMarkers/EventMarker.tsx
import { useEffect, useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { AnimationConfig } from '@/types/animations';
import './EventMarker.css';

interface EventMarkerProps {
  animation: AnimationConfig;
  isActive: boolean;
  onClick: (animation: AnimationConfig) => void;
}

export const EventMarker = ({ animation, isActive, onClick }: EventMarkerProps) => {
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    // Pulsar cuando está activo
    if (isActive) {
      setIsPulsing(true);
    } else {
      setIsPulsing(false);
    }
  }, [isActive]);

  // Crear icono personalizado con animación de pulso
  const createPulsingIcon = () => {
    const iconHtml = `
      <div class="event-marker-container ${isPulsing ? 'pulsing' : ''}">
        <div class="event-marker-pulse"></div>
        <div class="event-marker-icon">
          ${getEventIcon(animation.id)}
        </div>
      </div>
    `;

    return L.divIcon({
      html: iconHtml,
      className: 'event-marker-wrapper',
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });
  };

  const getEventIcon = (id: string): string => {
    const icons: Record<string, string> = {
      mascleta: '💥',
      ofrenda: '🌸',
      cabalgata: '🔥',
      crema: '🔥',
      castillo: '🎆',
      nitDelFoc: '🎇',
      desperta: '💣',
      crida: '🏰',
      cabalgataDelNinot: '🎭',
      planta: '🏗️',
      espectaculoNocturno: '🎆',
      lAlba: '🌅'
    };
    return icons[id] || '✨';
  };

  const handleClick = () => {
    onClick(animation);
  };

  return (
    <Marker
      position={[animation.location.lat, animation.location.lng]}
      icon={createPulsingIcon()}
      eventHandlers={{
        click: handleClick
      }}
    >
      <Popup>
        <div className="event-marker-popup">
          <div className="event-popup-icon">{getEventIcon(animation.id)}</div>
          <div className="event-popup-name">{animation.name}</div>
          <div className="event-popup-location">{animation.location.name}</div>
          {isActive && (
            <div className="event-popup-active">
              🔴 ACTIVO AHORA
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
};
