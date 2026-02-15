// src/components/Navigation/NavigationPanel.tsx
import { useState, useEffect } from 'react';
import { inAppNavigationService } from '@/services/inAppNavigationService';
import type { NavigationState } from '@/services/inAppNavigationService';
import './NavigationPanel.css';

interface NavigationPanelProps {
  onClose: () => void;
}

export const NavigationPanel = ({ onClose }: NavigationPanelProps) => {
  const [navState, setNavState] = useState<NavigationState | null>(null);

  useEffect(() => {
    const updateState = () => {
      // Usar getNavigationState si existe, o leer del servicio directamente
      const state = (inAppNavigationService as any).getNavigationState?.() ?? null;
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
    inAppNavigationService.nextStop();
    const state = (inAppNavigationService as any).getNavigationState?.() ?? null;
    setNavState(state);
  };

  if (!navState) return null;

  const { nextStop, distanceToNext, timeToNext, currentStopIndex, arrived, totalStops } = navState;
  const isSingleDestination = totalStops === 1;

  return (
    <div className="navigation-panel">
      <div className="nav-header">
        <div className="nav-progress">
          <div className="nav-progress-text">
            {isSingleDestination
              ? 'Navegando a tu destino'
              : `Parada ${currentStopIndex + 1} de ${totalStops}`
            }
          </div>
          <button className="nav-close-btn" onClick={handleStop}>✕</button>
        </div>
        {!isSingleDestination && (
          <div className="nav-progress-bar">
            <div
              className="nav-progress-fill"
              style={{ width: `${(currentStopIndex / totalStops) * 100}%` }}
            />
          </div>
        )}
      </div>

      <div className="nav-destination">
        <div className="nav-destination-icon">📍</div>
        <div className="nav-destination-info">
          <div className="nav-destination-name">{nextStop.name}</div>
          {arrived ? (
            <div className="nav-arrived">¡Has llegado!</div>
          ) : (
            <div className="nav-distance">
              {distanceToNext < 1000
                ? `${distanceToNext}m`
                : `${(distanceToNext / 1000).toFixed(1)}km`
              } · {timeToNext} min
            </div>
          )}
        </div>
      </div>

      <div className="nav-actions">
        {!isSingleDestination && !arrived && (
          <button className="btn btn-secondary" onClick={handleSkip}>
            Saltar parada →
          </button>
        )}
        <button className="btn btn-danger" onClick={handleStop}>
          Detener navegación
        </button>
      </div>
    </div>
  );
};
