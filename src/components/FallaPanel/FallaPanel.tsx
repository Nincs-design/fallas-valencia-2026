// src/components/FallaPanel/FallaPanel.tsx
import { useAppStore } from '@/stores/useAppStore';
import { inAppNavigationService } from '@/services/inAppNavigationService';
import { getFallaState } from '@/utils/fallaStateUtils';
import './FallaPanel.css';

export const FallaPanel = () => {
  const selectedFalla = useAppStore(state => state.selectedFalla);
  const isPanelOpen = useAppStore(state => state.isPanelOpen);
  const setIsPanelOpen = useAppStore(state => state.setIsPanelOpen);
  const addToRoute = useAppStore(state => state.addToRoute);
  const setIsNavigating = useAppStore(state => state.setIsNavigating);
  const userLocation = useAppStore(state => state.userLocation);
  const selectedDay = useAppStore(state => state.selectedDay);
  const selectedHour = useAppStore(state => state.selectedHour);
  const clockMode = useAppStore(state => state.clockMode);

  if (!selectedFalla) return null;

  // Get current hour based on clock mode
  const currentHour = clockMode === 'real' ? new Date().getHours() : selectedHour;
  
  // Get falla state
  const fallaStateInfo = getFallaState(selectedFalla.type, selectedDay, currentHour);

  const handleClose = () => {
    setIsPanelOpen(false);
  };

  const handleAddToRoute = () => {
    const added = addToRoute(selectedFalla);
    if (added) {
      console.log('Added to route:', selectedFalla.name);
    }
  };

  const handleGetDirections = () => {
    // Usar navegación interna - navegar solo a esta falla
    const singleStopRoute = [selectedFalla];
    
    // Activar modo navegación
    setIsNavigating(true);
    
    // Iniciar navegación con una sola parada
    inAppNavigationService.startNavigation(
      singleStopRoute,
      userLocation,
      (navState) => {
        console.log('Navegando a:', selectedFalla.name);
      }
    );
    
    // Cerrar panel de detalles
    setIsPanelOpen(false);
  };

  const categoryLabel = selectedFalla.type === 'infantil' 
    ? `Infantil - Sección ${selectedFalla.category}` 
    : `Adulta - ${selectedFalla.category}`;

  return (
    <div className={`falla-panel ${isPanelOpen ? 'active' : ''}`}>
      <button className="close-panel" onClick={handleClose}>
        ✕
      </button>

      <div className="falla-panel-header">
        <h2>{selectedFalla.name}</h2>
        <div className="falla-category">
          {selectedFalla.isMunicipal || selectedFalla.category === 'Municipal' ? (
            <span className="municipal-badge">🏛️ MUNICIPAL - AYUNTAMIENTO</span>
          ) : selectedFalla.isExperimental || selectedFalla.category === 'Experimental' ? (
            <span className="experimental-badge">🔬 EXPERIMENTAL (I+E)</span>
          ) : (
            categoryLabel
          )}
        </div>
        {selectedFalla.distintivo && (
          <div className="falla-distintivo">🏆 {selectedFalla.distintivo}</div>
        )}
      </div>

      {/* Estado de la falla */}
      {fallaStateInfo.state !== 'active' && (
        <div 
          className={`falla-state-banner ${fallaStateInfo.state}`}
          style={{ 
            backgroundColor: `${fallaStateInfo.statusColor}20`,
            borderLeft: `4px solid ${fallaStateInfo.statusColor}`
          }}
        >
          <span className="falla-state-icon">{fallaStateInfo.icon}</span>
          <p className="falla-state-message">{fallaStateInfo.statusMessage}</p>
        </div>
      )}

      {fallaStateInfo.state === 'active' && (
        <div 
          className="falla-state-banner active"
          style={{ 
            backgroundColor: `${fallaStateInfo.statusColor}20`,
            borderLeft: `4px solid ${fallaStateInfo.statusColor}`
          }}
        >
          <span className="falla-state-icon">✨</span>
          <p className="falla-state-message">{fallaStateInfo.statusMessage}</p>
        </div>
      )}

      <div className="falla-panel-content">
        <div className="falla-image">
          {selectedFalla.boceto ? (
            <img 
              src={selectedFalla.boceto} 
              alt={`Boceto ${selectedFalla.name}`}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '[BOCETO FALLA 2026]';
              }}
            />
          ) : (
            <div className="boceto-placeholder">[BOCETO FALLA 2026]</div>
          )}
        </div>

        {selectedFalla.theme && selectedFalla.theme !== 'Sin tema' && (
          <div className="falla-section">
            <h3>Lema</h3>
            <p className="falla-lema">"{selectedFalla.theme}"</p>
          </div>
        )}

        {selectedFalla.artist && selectedFalla.artist !== 'Sin artista' && (
          <div className="falla-section">
            <h3>Artista</h3>
            <p>{selectedFalla.artist}</p>
          </div>
        )}

        <div className="falla-section">
          <h3>Comisión</h3>
          <div className="falla-comision">
            {selectedFalla.president && selectedFalla.president !== 'Sin presidente' && (
              <p><strong>Presidente:</strong> {selectedFalla.president}</p>
            )}
            {selectedFalla.fallera && selectedFalla.fallera !== 'Sin fallera mayor' && selectedFalla.fallera !== 'Sin fallera infantil' && (
              <p><strong>Fallera Mayor:</strong> {selectedFalla.fallera}</p>
            )}
          </div>
        </div>

        <div className="falla-section">
          <h3>Datos</h3>
          <p>{selectedFalla.facts}</p>
        </div>

        <div className="action-buttons">
          <button className="btn btn-primary" onClick={handleGetDirections}>
            📍 Cómo Llegar
          </button>
          <button className="btn" onClick={handleAddToRoute}>
            ➕ Añadir a Ruta
          </button>
        </div>
      </div>
    </div>
  );
};
