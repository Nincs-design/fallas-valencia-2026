// src/components/EventMarkers/EventInfoModal.tsx
import { useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { inAppNavigationService } from '@/services/inAppNavigationService';
import type { AnimationConfig } from '@/types/animations';
import './EventInfoModal.css';

interface EventInfoModalProps {
  animation: AnimationConfig;
  onClose: () => void;
}

export const EventInfoModal = ({ animation, onClose }: EventInfoModalProps) => {
  const userLocation = useAppStore(state => state.userLocation);
  const [isNavigating, setIsNavigating] = useState(false);

  const handleComoLlegar = () => {
    if (!userLocation) {
      alert('Activa la geolocalización para usar la navegación.');
      return;
    }

    const eventPoint = {
      id: typeof animation.id === 'number' ? animation.id : Math.abs(
        animation.id.split('').reduce((h: number, c: string) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0)
      ),
      name: animation.name,
      lat: animation.location.lat,
      lng: animation.location.lng,
      category: 'Evento' as const,
      type: 'grande' as const,
      theme: animation.description,
      facts: `Ubicación: ${animation.location.name}`
    };

    setIsNavigating(true);
    inAppNavigationService.startNavigation(
      [eventPoint],
      userLocation,
      () => { /* navegando */ }
    );

    onClose();
  };

  const handleAñadirRuta = () => {
    const eventPoint = {
      id: typeof animation.id === 'number' ? animation.id : Math.abs(
        animation.id.split('').reduce((h: number, c: string) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0)
      ),
      name: animation.name,
      lat: animation.location.lat,
      lng: animation.location.lng,
      category: 'Evento' as const,
      type: 'grande' as const,
      artist: 'Evento de Fallas',
      theme: animation.description,
      facts: `Ubicación: ${animation.location.name}`,
      president: '',
      fallera: '',
      boceto: '',
      isMunicipal: false,
      isExperimental: false,
      distintivo: ''
    };

    const addToRoute = useAppStore.getState().addToRoute;
    const added = addToRoute(eventPoint);

    if (added) {
      useAppStore.getState().setIsRouteBuilderOpen(true);
    }

    onClose();
  };

  return (
    <div className="event-info-modal">
      <div className="event-modal-header">
        <div className="event-modal-icon">{animation.icon || '🎭'}</div>
        <div className="event-modal-title">
          <h2>{animation.name}</h2>
          <p className="event-modal-location">📍 {animation.location.name}</p>
        </div>
        <button className="modal-close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="event-modal-body">
        <p className="event-modal-description">{animation.description}</p>
        <div className="event-modal-schedule">
          <span>🕐 {animation.schedule?.[0]?.startTime ?? 'Ver programa'}</span>
        </div>
      </div>

      <div className="event-modal-actions">
        {userLocation && (
          <button
            className="btn btn-primary"
            onClick={handleComoLlegar}
            disabled={isNavigating}
          >
            🧭 Cómo Llegar
          </button>
        )}
        <button className="btn btn-secondary" onClick={handleAñadirRuta}>
          ➕ Añadir a Ruta
        </button>
        <button className="btn btn-ghost" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};
