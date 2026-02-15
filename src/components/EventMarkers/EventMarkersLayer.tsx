// src/components/EventMarkers/EventMarkersLayer.tsx
import { useState, useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import { EventMarker } from './EventMarker';
import { EventInfoModal } from './EventInfoModal';
import { AnimationConfig } from '@/types/animations';
import { getActiveAnimations, getAllAnimations } from '@/config/animationsConfig';
import { LocalizedAnimationEngine } from '@/services/localizedAnimationEngine';
import { useAppStore } from '@/stores/useAppStore';
import './EventMarkersLayer.css';

export const EventMarkersLayer = () => {
  const map = useMap();
  const selectedDay = useAppStore(state => state.selectedDay);
  const selectedHour = useAppStore(state => state.selectedHour);
  
  const [activeAnimations, setActiveAnimations] = useState<AnimationConfig[]>([]);
  const [allEvents, setAllEvents] = useState<AnimationConfig[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<AnimationConfig | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<LocalizedAnimationEngine | null>(null);

  useEffect(() => {
    // Obtener todos los eventos para mostrar marcadores
    const events = getAllAnimations();
    setAllEvents(events);
  }, []);

  useEffect(() => {
    // Actualizar eventos activos según el calendario
    const currentDate = new Date(2026, 2, selectedDay, selectedHour); // Marzo = 2
    const active = getActiveAnimations(currentDate);
    setActiveAnimations(active);
  }, [selectedDay, selectedHour]);

  const handleMarkerClick = (animation: AnimationConfig) => {
    // Reproducir animación localizada
    playLocalizedAnimation(animation);

    // Mostrar modal después de 3 segundos
    setTimeout(() => {
      setSelectedEvent(animation);
      setShowModal(true);
    }, 3000);
  };

  const playLocalizedAnimation = (animation: AnimationConfig) => {
    // Convertir coordenadas GPS a píxeles del mapa
    const point = map.latLngToContainerPoint([
      animation.location.lat,
      animation.location.lng
    ]);

    // Crear canvas si no existe
    if (!canvasRef.current) {
      const canvas = document.createElement('canvas');
      canvas.className = 'localized-animation-canvas';
      canvas.width = 400;
      canvas.height = 400;
      canvas.style.cssText = `
        position: absolute;
        pointer-events: none;
        z-index: 1000;
      `;
      map.getContainer().appendChild(canvas);
      canvasRef.current = canvas;
    }

    const canvas = canvasRef.current;
    
    // Posicionar canvas en el punto del evento
    canvas.style.left = `${point.x - 200}px`;
    canvas.style.top = `${point.y - 200}px`;
    canvas.style.display = 'block';

    // Detener animación anterior si existe
    if (engineRef.current) {
      engineRef.current.stop();
    }

    // Crear nueva animación
    engineRef.current = new LocalizedAnimationEngine(canvas, animation);
    engineRef.current.start();

    // Ocultar canvas después de la animación
    setTimeout(() => {
      if (canvas) {
        canvas.style.display = 'none';
      }
    }, 5000);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  const isEventActive = (eventId: string): boolean => {
    return activeAnimations.some(a => a.id === eventId);
  };

  return (
    <>
      {/* Marcadores de eventos */}
      {allEvents.map(event => (
        <EventMarker
          key={event.id}
          animation={event}
          isActive={isEventActive(event.id)}
          onClick={handleMarkerClick}
        />
      ))}

      {/* Modal de información */}
      {showModal && selectedEvent && (
        <EventInfoModal
          animation={selectedEvent}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};
