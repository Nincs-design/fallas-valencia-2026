// src/components/EventMarkers/EventInfoModal.tsx
import { AnimationConfig } from '@/types/animations';
import { useAppStore } from '@/stores/useAppStore';
import { inAppNavigationService } from '@/services/inAppNavigationService';
import './EventInfoModal.css';

interface EventInfoModalProps {
  animation: AnimationConfig;
  onClose: () => void;
}

export const EventInfoModal = ({ animation, onClose }: EventInfoModalProps) => {
  const setIsNavigating = useAppStore(state => state.setIsNavigating);
  const userLocation = useAppStore(state => state.userLocation);

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

  const formatSchedule = (schedule: AnimationConfig['schedule']) => {
    return schedule.map((s, idx) => {
      const date = new Date(s.startDate);
      const dateStr = date.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'short' 
      });
      return (
        <div key={idx} className="schedule-entry">
          📅 {dateStr} · ⏰ {s.startTime} · ⏱️ {s.duration} min
        </div>
      );
    });
  };

  const handleComoLlegar = () => {
    // Crear un punto de ruta temporal para el evento
    const eventPoint = {
      id: `event-${animation.id}`,
      name: animation.name,
      lat: animation.location.lat,
      lng: animation.location.lng,
      category: 'Evento' as const,
      type: 'adulta' as const
    };

    // Iniciar navegación directa
    setIsNavigating(true);
    inAppNavigationService.startNavigation(
      [eventPoint],
      userLocation,
      (navState) => {
        console.log('Navegando a evento:', navState);
      }
    );

    onClose();
  };

  const handleAñadirRuta = () => {
    // Crear punto de ruta y añadir al RouteBuilder
    const eventPoint = {
      id: `event-${animation.id}`,
      name: animation.name,
      lat: animation.location.lat,
      lng: animation.location.lng,
      category: 'Evento' as const,
      type: 'adulta' as const,
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
      // Abrir RouteBuilder
      useAppStore.getState().setIsRouteBuilderOpen(true);
    }

    onClose();
  };

  return (
    <div className="event-info-modal">
      <div className="event-info-overlay" onClick={onClose} />
      
      <div className="event-info-content">
        <button className="event-info-close" onClick={onClose}>
          ✕
        </button>

        <div className="event-info-header">
          <div className="event-info-icon">
            {getEventIcon(animation.id)}
          </div>
          <h2 className="event-info-title">{animation.name}</h2>
          <div className="event-info-type">
            {animation.type === 'canvas' && '🎨 Animación Canvas'}
            {animation.type === 'lottie' && '🎬 Animación Lottie'}
            {animation.type === 'css' && '⚡ Animación CSS'}
          </div>
        </div>

        <div className="event-info-body">
          <div className="event-info-section">
            <h3>📍 Ubicación</h3>
            <p className="event-location-name">{animation.location.name}</p>
            <p className="event-coordinates">
              {animation.location.lat.toFixed(4)}, {animation.location.lng.toFixed(4)}
            </p>
          </div>

          <div className="event-info-section">
            <h3>📝 Descripción</h3>
            <p>{animation.description}</p>
          </div>

          <div className="event-info-section">
            <h3>📅 Horarios</h3>
            <div className="event-schedule">
              {formatSchedule(animation.schedule)}
            </div>
          </div>

          {animation.visual && (
            <div className="event-info-section">
              <h3>✨ Efectos Visuales</h3>
              <div className="event-effects">
                {animation.visual.particles && (
                  <div className="effect-tag">
                    🎆 {animation.visual.particles} partículas
                  </div>
                )}
                {animation.visual.intensity && (
                  <div className="effect-tag">
                    ⚡ Intensidad: {animation.visual.intensity}
                  </div>
                )}
                {animation.visual.sound && (
                  <div className="effect-tag">
                    🔊 Con sonido
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="event-info-section">
            <h3>⭐ Prioridad</h3>
            <div className="event-priority">
              <div className="priority-bar">
                <div 
                  className="priority-fill" 
                  style={{ width: `${(animation.priority / 10) * 100}%` }}
                />
              </div>
              <span className="priority-value">{animation.priority}/10</span>
            </div>
          </div>
        </div>

        <div className="event-info-actions">
          <button className="btn btn-primary btn-event" onClick={handleComoLlegar}>
            📍 Cómo Llegar
          </button>
          <button className="btn btn-secondary btn-event" onClick={handleAñadirRuta}>
            ➕ Añadir a Ruta
          </button>
        </div>
      </div>
    </div>
  );
};
