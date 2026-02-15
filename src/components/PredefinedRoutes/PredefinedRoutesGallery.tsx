// src/components/PredefinedRoutes/PredefinedRoutesGallery.tsx
import { useState } from 'react';
import { predefinedRoutes, PredefinedRoute } from '@/data/predefinedRoutes';
import { useAppStore } from '@/stores/useAppStore';
import { fallasData } from '@/data/fallas';
import './PredefinedRoutesGallery.css';

export const PredefinedRoutesGallery = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<PredefinedRoute | null>(null);
  const addToRoute = useAppStore(state => state.addToRoute);
  const clearRoute = useAppStore(state => state.clearRoute);
  const setOptimizedRoute = useAppStore(state => state.setOptimizedRoute);

  const loadPredefinedRoute = (route: PredefinedRoute) => {
    // Buscar las fallas por IDs
    const fallas = route.fallaIds
      .map(id => fallasData.find(f => f.id === id))
      .filter(Boolean) as typeof fallasData;

    if (fallas.length > 0) {
      // Limpiar ruta actual
      clearRoute();
      
      // Cargar fallas a la ruta
      fallas.forEach(falla => addToRoute(falla));
      
      // Auto-optimizar
      setOptimizedRoute(fallas.map((falla, index) => ({
        ...falla,
        distanceFromPrevious: index > 0 ? 0.5 : 0,
        estimatedWalkingTime: index > 0 ? 6 : 0
      })));

      setIsOpen(false);
      setSelectedRoute(null);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'var(--verde)';
      case 'medium': return 'var(--amarillo)';
      case 'hard': return 'var(--naranja)';
      default: return 'var(--azul)';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Media';
      case 'hard': return 'Difícil';
      default: return '';
    }
  };

  return (
    <>
      {/* Botón para abrir galería */}
      <button 
        className="predefined-routes-btn"
        onClick={() => setIsOpen(true)}
        title="Rutas predefinidas"
      >
        🗺️
      </button>

      {/* Modal de galería */}
      {isOpen && (
        <div className="predefined-routes-modal">
          <div className="predefined-routes-overlay" onClick={() => setIsOpen(false)} />
          
          <div className="predefined-routes-content">
            <div className="predefined-routes-header">
              <h2>Rutas Recomendadas</h2>
              <button 
                className="close-btn"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="routes-grid">
              {predefinedRoutes.map(route => (
                <div 
                  key={route.id} 
                  className="route-card"
                  onClick={() => setSelectedRoute(route)}
                >
                  <div className="route-card-icon">{route.icon}</div>
                  
                  <h3 className="route-card-title">{route.name}</h3>
                  
                  <p className="route-card-description">{route.description}</p>
                  
                  <div className="route-card-stats">
                    <div className="route-stat">
                      <span className="route-stat-icon">⏱️</span>
                      <span>{route.duration}</span>
                    </div>
                    <div className="route-stat">
                      <span className="route-stat-icon">📍</span>
                      <span>{route.distance}</span>
                    </div>
                    <div className="route-stat">
                      <span className="route-stat-icon">🎯</span>
                      <span>{route.fallaIds.length} paradas</span>
                    </div>
                  </div>

                  <div 
                    className="route-difficulty"
                    style={{ background: getDifficultyColor(route.difficulty) }}
                  >
                    {getDifficultyLabel(route.difficulty)}
                  </div>

                  <div className="route-tags">
                    {route.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="route-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalles de ruta */}
      {selectedRoute && (
        <div className="route-detail-modal">
          <div className="route-detail-overlay" onClick={() => setSelectedRoute(null)} />
          
          <div className="route-detail-content">
            <button 
              className="close-btn"
              onClick={() => setSelectedRoute(null)}
            >
              ✕
            </button>

            <div className="route-detail-header">
              <div className="route-detail-icon">{selectedRoute.icon}</div>
              <h2>{selectedRoute.name}</h2>
            </div>

            <p className="route-detail-description">{selectedRoute.description}</p>

            <div className="route-detail-stats">
              <div className="detail-stat">
                <div className="detail-stat-label">Duración</div>
                <div className="detail-stat-value">⏱️ {selectedRoute.duration}</div>
              </div>
              <div className="detail-stat">
                <div className="detail-stat-label">Distancia</div>
                <div className="detail-stat-value">📍 {selectedRoute.distance}</div>
              </div>
              <div className="detail-stat">
                <div className="detail-stat-label">Paradas</div>
                <div className="detail-stat-value">🎯 {selectedRoute.fallaIds.length}</div>
              </div>
              <div className="detail-stat">
                <div className="detail-stat-label">Dificultad</div>
                <div 
                  className="detail-stat-value"
                  style={{ color: getDifficultyColor(selectedRoute.difficulty) }}
                >
                  {getDifficultyLabel(selectedRoute.difficulty)}
                </div>
              </div>
            </div>

            <div className="route-recommendations">
              <h3>💡 Recomendaciones</h3>
              <ul>
                {selectedRoute.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>

            <div className="route-tags-full">
              {selectedRoute.tags.map(tag => (
                <span key={tag} className="route-tag">{tag}</span>
              ))}
            </div>

            <button 
              className="btn-load-route"
              onClick={() => loadPredefinedRoute(selectedRoute)}
            >
              ✅ Cargar esta ruta
            </button>
          </div>
        </div>
      )}
    </>
  );
};
