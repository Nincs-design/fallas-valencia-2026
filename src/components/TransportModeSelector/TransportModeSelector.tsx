// src/components/TransportModeSelector/TransportModeSelector.tsx
import React from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { TRANSPORT_MODES, TransportMode } from '@/types/transportMode';
import './TransportModeSelector.css';

export const TransportModeSelector: React.FC = () => {
  const transportMode = useAppStore(state => state.transportMode);
  const setTransportMode = useAppStore(state => state.setTransportMode);

  const handleModeChange = (mode: TransportMode) => {
    setTransportMode(mode);
  };

  const modes: TransportMode[] = ['walking', 'bicycling', 'transit', 'driving'];

  return (
    <div className="transport-mode-selector">
      <div className="transport-mode-label">
        <span className="transport-icon">🗺️</span>
        <span>Modo de Transporte</span>
      </div>
      
      {/* Recommendation banner */}
      <div className="transport-recommendation">
        <span className="recommendation-icon">💡</span>
        <p className="recommendation-text">
          <strong>Recomendado:</strong> Caminar es la mejor forma de disfrutar las fallas de cerca
        </p>
      </div>
      
      <div className="transport-mode-options">
        {modes.map((mode) => {
          const config = TRANSPORT_MODES[mode];
          const isSelected = transportMode === mode;
          
          return (
            <button
              key={mode}
              className={`transport-mode-button ${isSelected ? 'selected' : ''}`}
              onClick={() => handleModeChange(mode)}
              style={{
                borderColor: isSelected ? config.color : 'transparent',
                backgroundColor: isSelected ? `${config.color}20` : 'transparent'
              }}
              title={config.description}
            >
              <span className="mode-icon">{config.icon}</span>
              <span className="mode-label">{config.label}</span>
              {isSelected && (
                <span className="mode-checkmark">✓</span>
              )}
            </button>
          );
        })}
      </div>
      
      {transportMode && (
        <div className="transport-mode-info">
          <p className="mode-description">
            {TRANSPORT_MODES[transportMode].description}
          </p>
          <p className="mode-speed">
            📊 Velocidad estimada: ~{TRANSPORT_MODES[transportMode].speedKmH} km/h
          </p>
        </div>
      )}
    </div>
  );
};
