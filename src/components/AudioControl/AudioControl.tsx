// src/components/AudioControl/AudioControl.tsx
import React, { useState, useEffect } from 'react';
import { useEventAudio } from '@/utils/audioUtils';
import './AudioControl.css';

export const AudioControl: React.FC = () => {
  const audio = useEventAudio();
  const [isEnabled, setIsEnabled] = useState(audio.isEnabled());
  const [volume, setVolume] = useState(audio.getVolume());
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    audio.setEnabled(isEnabled);
  }, [isEnabled]);

  useEffect(() => {
    audio.setVolume(volume);
  }, [volume]);

  const handleToggle = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    
    // Show welcome message on first enable
    if (newState && !localStorage.getItem('fallas-audio-welcomed')) {
      localStorage.setItem('fallas-audio-welcomed', 'true');
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const getVolumeIcon = () => {
    if (!isEnabled) return '🔇';
    if (volume === 0) return '🔇';
    if (volume < 0.3) return '🔈';
    if (volume < 0.7) return '🔉';
    return '🔊';
  };

  return (
    <div className={`audio-control ${isExpanded ? 'expanded' : ''}`}>
      <button 
        className="audio-toggle"
        onClick={handleToggle}
        onMouseEnter={() => setIsExpanded(true)}
        title={isEnabled ? 'Sonido activado' : 'Sonido desactivado'}
      >
        {getVolumeIcon()}
      </button>
      
      {isExpanded && (
        <div 
          className="audio-panel"
          onMouseLeave={() => setIsExpanded(false)}
        >
          <div className="audio-header">
            <span className="audio-title">🔊 Sonido</span>
            <button 
              className="audio-close"
              onClick={() => setIsExpanded(false)}
            >
              ✕
            </button>
          </div>
          
          <div className="audio-content">
            <div className="audio-toggle-section">
              <label className="audio-switch">
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={handleToggle}
                />
                <span className="audio-slider"></span>
              </label>
              <span className="audio-label">
                {isEnabled ? 'Activado' : 'Desactivado'}
              </span>
            </div>
            
            {isEnabled && (
              <div className="audio-volume-section">
                <label className="volume-label">
                  Volumen: {Math.round(volume * 100)}%
                </label>
                <input
                  type="range"
                  className="volume-slider"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                />
              </div>
            )}
            
            <div className="audio-info">
              <small>
                🎵 Los sonidos se reproducirán automáticamente 
                durante eventos especiales como Mascletàs, 
                Cabalgatas y la Cremà.
              </small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
