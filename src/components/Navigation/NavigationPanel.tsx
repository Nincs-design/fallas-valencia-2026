// src/components/Navigation/NavigationPanel.tsx
import { useState, useEffect } from 'react';
import { inAppNavigationService, NavigationState } from '@/services/inAppNavigationService';
import './NavigationPanel.css';

interface NavigationPanelProps {
  onClose: () => void;
}

export const NavigationPanel = ({ onClose }: NavigationPanelProps) => {
  const [navState, setNavState] = useState<NavigationState | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    // Este componente solo se monta cuando la navegación está activa
    const updateState = () => {
      const state = inAppNavigationService.getCurrentState();
      setNavState(state);
    };

    updateState();
    const interval = setInterval(updateState, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleStop = () => {
    inAppNavigationService.stopNavigation();
    onClose();
  };

  const handleSkip = () => {
    inAppNavigationService.skipToNext();
    const state = inAppNavigationService.getCurrentState();
    setNavState(state);
  };

  if (!navState) return null;

  const { nextStop, distanceToNext, timeToNext, currentStopIndex, arrived, totalStops } = navState;
  const isSingleDestination = totalStops === 1;

  return (
    <div className="navigation-panel">
      {/* Header con progreso */}
      <div className="nav-header">
        <div className="nav-progress">
          <div className="nav-progress-text">
            {isSingleDestination 
              ? 'Navegando a tu destino'
              : `Parada ${currentStopIndex + 1} de ${totalStops}`
            }
          </div>
          <button className="nav-close-btn" onClick={handleStop}>
            ✕
          </button>
        </div>
      </div>

      {/* Instrucción principal */}
      <div className="nav-main">
        {arrived ? (
          <div className="nav-arrived">
            <div className="nav-arrived-icon">✅</div>
            <div className="nav-arrived-text">
              ¡Has llegado!
            </div>
            <div className="nav-arrived-name">{nextStop?.name}</div>
            {!isSingleDestination && (
              <button className="btn-next-stop" onClick={handleSkip}>
                ➡️ Siguiente parada
              </button>
            )}
            {isSingleDestination && (
              <button className="btn-next-stop" onClick={handleStop}>
                ✅ Finalizar
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Distancia y tiempo */}
            <div className="nav-stats">
              <div className="nav-stat-item">
                <div className="nav-stat-value">{distanceToNext}m</div>
                <div className="nav-stat-label">Distancia</div>
              </div>
              <div className="nav-stat-divider">•</div>
              <div className="nav-stat-item">
                <div className="nav-stat-value">{Math.ceil(timeToNext / 60)} min</div>
                <div className="nav-stat-label">Tiempo</div>
              </div>
            </div>

            {/* Instrucción actual */}
            <div className="nav-instruction">
              <div className="nav-instruction-icon">🧭</div>
              <div className="nav-instruction-text">{navState.instruction}</div>
            </div>

            {/* Destino */}
            <div className="nav-destination">
              <div className="nav-destination-label">
                {isSingleDestination ? 'Destino:' : 'Próxima parada:'}
              </div>
              <div className="nav-destination-name">{nextStop?.name}</div>
              {nextStop?.category && (
                <div className="nav-destination-category">{nextStop.category}</div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Acciones */}
      <div className="nav-actions">
        {!arrived && !isSingleDestination && (
          <button className="btn-nav-action" onClick={handleSkip}>
            ⏭️ Saltar parada
          </button>
        )}
        <button 
          className="btn-nav-action btn-nav-stop" 
          onClick={handleStop}
          style={isSingleDestination || arrived ? { gridColumn: '1 / -1' } : {}}
        >
          🛑 Detener navegación
        </button>
      </div>
    </div>
  );
};
