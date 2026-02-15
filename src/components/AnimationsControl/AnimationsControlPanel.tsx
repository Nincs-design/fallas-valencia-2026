// src/components/AnimationsControl/AnimationsControlPanel.tsx
import { useState, useEffect } from 'react';
import { getAllAnimations, toggleAnimation, loadAnimationState } from '@/config/animationsConfig';
import { AnimationConfig } from '@/types/animations';
import './AnimationsControlPanel.css';

export const AnimationsControlPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [animations, setAnimations] = useState<AnimationConfig[]>([]);

  useEffect(() => {
    // Cargar todas las animaciones con sus estados
    const allAnimations = getAllAnimations().map(anim => ({
      ...anim,
      enabled: loadAnimationState(anim.id)
    }));
    setAnimations(allAnimations);
  }, []);

  const handleToggle = (id: string) => {
    const animation = animations.find(a => a.id === id);
    if (!animation) return;

    const newEnabled = !animation.enabled;
    toggleAnimation(id, newEnabled);

    setAnimations(prev =>
      prev.map(a => a.id === id ? { ...a, enabled: newEnabled } : a)
    );
  };

  const handleEnableAll = () => {
    animations.forEach(anim => {
      toggleAnimation(anim.id, true);
    });
    setAnimations(prev => prev.map(a => ({ ...a, enabled: true })));
  };

  const handleDisableAll = () => {
    animations.forEach(anim => {
      toggleAnimation(anim.id, false);
    });
    setAnimations(prev => prev.map(a => ({ ...a, enabled: false })));
  };

  const getAnimationTypeIcon = (type: string) => {
    switch (type) {
      case 'canvas': return '🎨';
      case 'lottie': return '🎬';
      case 'css': return '⚡';
      case 'svg': return '🖼️';
      default: return '✨';
    }
  };

  const getAnimationIcon = (id: string) => {
    switch (id) {
      case 'mascleta': return '💥';
      case 'ofrenda': return '🌸';
      case 'cabalgata': return '🔥';
      case 'crema': return '🔥';
      case 'castillo': return '🎆';
      case 'nitDelFoc': return '🎇';
      case 'desperta': return '💣';
      case 'crida': return '🏰';
      case 'cabalgataDelNinot': return '🎭';
      case 'planta': return '🏗️';
      default: return '✨';
    }
  };

  return (
    <>
      {/* Botón flotante */}
      <button 
        className="animations-control-btn"
        onClick={() => setIsOpen(true)}
        title="Configurar animaciones"
      >
        ✨
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="animations-control-modal">
          <div className="animations-control-overlay" onClick={() => setIsOpen(false)} />
          
          <div className="animations-control-content">
            <div className="animations-control-header">
              <h2>Configuración de Animaciones</h2>
              <button className="close-btn" onClick={() => setIsOpen(false)}>
                ✕
              </button>
            </div>

            <div className="animations-control-actions">
              <button className="btn btn-success" onClick={handleEnableAll}>
                ✅ Activar Todas
              </button>
              <button className="btn btn-danger" onClick={handleDisableAll}>
                ❌ Desactivar Todas
              </button>
            </div>

            <div className="animations-list">
              {animations.map(anim => (
                <div key={anim.id} className={`animation-item ${!anim.enabled ? 'disabled' : ''}`}>
                  <div className="animation-item-header">
                    <div className="animation-item-icon">
                      {getAnimationIcon(anim.id)}
                    </div>
                    <div className="animation-item-info">
                      <div className="animation-item-name">
                        {anim.name}
                        <span className="animation-type-badge">
                          {getAnimationTypeIcon(anim.type)} {anim.type}
                        </span>
                      </div>
                      <div className="animation-item-description">
                        {anim.description}
                      </div>
                    </div>
                    <div className="animation-item-toggle">
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={anim.enabled}
                          onChange={() => handleToggle(anim.id)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>

                  <div className="animation-item-details">
                    <div className="animation-detail">
                      <span className="detail-label">Ubicación:</span>
                      <span className="detail-value">{anim.location.name}</span>
                    </div>
                    <div className="animation-detail">
                      <span className="detail-label">Eventos:</span>
                      <span className="detail-value">{anim.schedule.length}</span>
                    </div>
                    <div className="animation-detail">
                      <span className="detail-label">Prioridad:</span>
                      <span className="detail-value priority-badge">
                        {anim.priority}
                      </span>
                    </div>
                  </div>

                  {anim.schedule.length > 0 && (
                    <div className="animation-schedule">
                      <div className="schedule-header">📅 Horarios:</div>
                      {anim.schedule.map((sched, idx) => (
                        <div key={idx} className="schedule-item">
                          {sched.startDate} · {sched.startTime} · {sched.duration} min
                          {sched.target && <span className="schedule-target"> ({sched.target})</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="animations-control-footer">
              <p className="animations-help">
                💡 Las animaciones se activarán automáticamente según el calendario.
                Puedes desactivar individualmente las que no desees ver.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
