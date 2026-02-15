// src/components/RouteBuilder/RouteBuilder.tsx
import { useState, useRef } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { routeOptimizer } from '@/services/routeOptimizer';
import { RouteExportService } from '@/services/routeExportService';
import { RouteShareService } from '@/services/routeShareService';
import { TransportModeSelector } from '@/components/TransportModeSelector';
import { fallasData } from '@/data/fallas';
import type { RouteStop } from '@/types';
import './RouteBuilder.css';

export const RouteBuilder = () => {
  const selectedRoute = useAppStore(state => state.selectedRoute);
  const optimizedRoute = useAppStore(state => state.optimizedRoute);
  const setOptimizedRoute = useAppStore(state => state.setOptimizedRoute);
  const removeFromRoute = useAppStore(state => state.removeFromRoute);
  const clearRoute = useAppStore(state => state.clearRoute);
  const userLocation = useAppStore(state => state.userLocation);
  const isRouteBuilderOpen = useAppStore(state => state.isRouteBuilderOpen);
  const setIsRouteBuilderOpen = useAppStore(state => state.setIsRouteBuilderOpen);
  const transportMode = useAppStore(state => state.transportMode);

  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [qrUrl, setQrUrl] = useState('');
  const [notification, setNotification] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOptimize = () => {
    if (selectedRoute.length === 0) {
      showNotification('⚠️ Añade al menos una falla');
      return;
    }

    const optimized = routeOptimizer.optimizeRoute(selectedRoute, userLocation, transportMode);
    setOptimizedRoute(optimized);
    showNotification('✅ Ruta optimizada correctamente');
  };

  const handleClear = () => {
    clearRoute();
    showNotification('🗑️ Ruta limpiada');
  };

  const handleRemove = (fallaId: number) => {
    removeFromRoute(fallaId);
  };

  const handleToggle = () => {
    setIsRouteBuilderOpen(!isRouteBuilderOpen);
  };

  // Export functions
  const handleExportJSON = () => {
    const route = optimizedRoute.length > 0 ? optimizedRoute : selectedRoute;
    if (route.length === 0) {
      showNotification('⚠️ No hay ruta para exportar');
      return;
    }
    RouteExportService.exportToJSON(route);
    showNotification('💾 Ruta exportada como JSON');
  };

  const handleExportGPX = () => {
    const route = optimizedRoute.length > 0 ? optimizedRoute : selectedRoute;
    if (route.length === 0) {
      showNotification('⚠️ No hay ruta para exportar');
      return;
    }
    RouteExportService.exportToGPX(route);
    showNotification('💾 Ruta exportada como GPX');
  };

  // Import function
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const importedRoute = await RouteExportService.importFromJSON(file);
    if (!importedRoute) {
      showNotification('❌ Error al importar ruta');
      return;
    }

    // Find fallas by IDs
    const fallas = importedRoute.stops
      .map(stop => fallasData.find(f => f.id === stop.id))
      .filter(Boolean);

    if (fallas.length > 0) {
      clearRoute();
      fallas.forEach(falla => {
        if (falla) useAppStore.getState().addToRoute(falla);
      });
      showNotification(`✅ Ruta importada (${fallas.length} paradas)`);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Share functions
  const handleCopyLink = async () => {
    const route = optimizedRoute.length > 0 ? optimizedRoute : selectedRoute;
    if (route.length === 0) {
      showNotification('⚠️ No hay ruta para compartir');
      return;
    }

    const success = await RouteShareService.copyToClipboard(route);
    if (success) {
      showNotification('🔗 Link copiado al portapapeles');
    } else {
      showNotification('❌ Error al copiar link');
    }
    setShowShareMenu(false);
  };

  const handleShareNative = async () => {
    const route = optimizedRoute.length > 0 ? optimizedRoute : selectedRoute;
    if (route.length === 0) {
      showNotification('⚠️ No hay ruta para compartir');
      return;
    }

    const success = await RouteShareService.shareNative(route);
    if (!success) {
      // Fallback to copy
      await handleCopyLink();
    }
    setShowShareMenu(false);
  };

  const handleShowQR = () => {
    const route = optimizedRoute.length > 0 ? optimizedRoute : selectedRoute;
    if (route.length === 0) {
      showNotification('⚠️ No hay ruta para generar QR');
      return;
    }

    const url = RouteShareService.generateQRCode(route);
    setQrUrl(url);
    setShowQR(true);
    setShowShareMenu(false);
  };

  const handleShareSocial = (platform: 'twitter' | 'facebook' | 'whatsapp') => {
    const route = optimizedRoute.length > 0 ? optimizedRoute : selectedRoute;
    if (route.length === 0) {
      showNotification('⚠️ No hay ruta para compartir');
      return;
    }

    RouteShareService.shareToSocial(route, platform);
    setShowShareMenu(false);
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleNavigate = () => {
    const route = optimizedRoute.length > 0 ? optimizedRoute : selectedRoute;
    if (route.length === 0) {
      showNotification('⚠️ No hay ruta para navegar');
      return;
    }

    // Usar navegación dentro de la app
    useAppStore.getState().setIsNavigating(true);
    showNotification('🧭 Iniciando navegación...');
  };

  const displayRoute = (optimizedRoute.length > 0 ? optimizedRoute : selectedRoute) as RouteStop[];
  const stats = optimizedRoute.length > 0 ? routeOptimizer.getRouteStats(optimizedRoute) : null;

  return (
    <>
      <div className={`route-panel ${isRouteBuilderOpen ? '' : 'collapsed'}`}>
        <div className="route-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="route-title">MI RECORRIDO</h3>
            <button className="route-toggle-btn" onClick={handleToggle}>
              {isRouteBuilderOpen ? '➖' : '➕'}
            </button>
          </div>
        </div>

        {isRouteBuilderOpen && (
          <div className="route-content">
            {/* Transport Mode Selector */}
            <TransportModeSelector />
            
            <div className="route-list">
              {displayRoute.length === 0 ? (
                <div className="empty-route">
                  <div style={{ fontSize: '48px', opacity: 0.3 }}>📍</div>
                  <p>Añade fallas a tu recorrido</p>
                  <p style={{ fontSize: '12px', opacity: 0.6, marginTop: '8px' }}>
                    O importa una ruta guardada
                  </p>
                </div>
              ) : (
                displayRoute.map((location, index) => (
                  <div key={location.id} className="route-item" data-number={index + 1}>
                    <div className="route-item-info">
                      <div className="route-item-name">{location.name}</div>
                      <div className="route-item-meta">
                        {'distanceFromPrevious' in location && location.distanceFromPrevious ? (
                          <>
                            📍 {(location.distanceFromPrevious as number).toFixed(2)} km · 
                            ⏱️ {location.estimatedWalkingTime} min
                          </>
                        ) : (
                          location.category
                        )}
                      </div>
                    </div>
                    <button 
                      className="route-item-remove" 
                      onClick={() => handleRemove(location.id)}
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>

            {stats && (
              <div className="route-stats">
                <div className="stat-item">
                  <span className="stat-label">Paradas:</span>
                  <span className="stat-value">{stats.totalStops}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Distancia:</span>
                  <span className="stat-value">{stats.totalDistance} km</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Tiempo:</span>
                  <span className="stat-value">{stats.estimatedDuration}</span>
                </div>
              </div>
            )}

            <div className="route-actions">
              <button 
                className="btn btn-primary" 
                onClick={handleOptimize}
                style={{ width: '100%', marginBottom: '8px' }}
              >
                🎯 Optimizar Ruta
              </button>

              <button 
                className="btn btn-navigate" 
                onClick={handleNavigate}
                style={{ width: '100%', marginBottom: '8px' }}
                disabled={displayRoute.length === 0}
              >
                🧭 Iniciar Navegación
              </button>

              {/* Export/Import/Share buttons */}
              <div className="route-action-grid">
                <button 
                  className="btn btn-secondary" 
                  onClick={handleExportJSON}
                  title="Exportar como JSON"
                  disabled={displayRoute.length === 0}
                >
                  💾 Exportar
                </button>

                <button 
                  className="btn btn-secondary" 
                  onClick={() => fileInputRef.current?.click()}
                  title="Importar ruta"
                >
                  📂 Importar
                </button>

                <button 
                  className="btn btn-secondary" 
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  title="Compartir ruta"
                  disabled={displayRoute.length === 0}
                >
                  🔗 Compartir
                </button>

                <button 
                  className="btn btn-secondary" 
                  onClick={handleExportGPX}
                  title="Exportar como GPX para GPS"
                  disabled={displayRoute.length === 0}
                >
                  🗺️ GPX
                </button>
              </div>

              {/* Share menu */}
              {showShareMenu && displayRoute.length > 0 && (
                <div className="share-menu">
                  <button className="share-option" onClick={handleCopyLink}>
                    🔗 Copiar enlace
                  </button>
                  <button className="share-option" onClick={handleShowQR}>
                    📱 Código QR
                  </button>
                  <button className="share-option" onClick={handleShareNative}>
                    📤 Compartir...
                  </button>
                  <div className="share-social">
                    <button onClick={() => handleShareSocial('whatsapp')}>💬</button>
                    <button onClick={() => handleShareSocial('twitter')}>🐦</button>
                    <button onClick={() => handleShareSocial('facebook')}>📘</button>
                  </div>
                </div>
              )}

              <button 
                className="btn" 
                onClick={handleClear}
                style={{ width: '100%', marginTop: '8px' }}
              >
                🗑️ Limpiar Todo
              </button>
            </div>

            {/* Hidden file input for import */}
            <input 
              ref={fileInputRef}
              type="file" 
              accept=".json"
              style={{ display: 'none' }}
              onChange={handleImport}
            />
          </div>
        )}
      </div>

      {/* QR Modal */}
      {showQR && (
        <div className="qr-modal" onClick={() => setShowQR(false)}>
          <div className="qr-content" onClick={(e) => e.stopPropagation()}>
            <button className="qr-close" onClick={() => setShowQR(false)}>✕</button>
            <h3>Escanea para compartir</h3>
            <img src={qrUrl} alt="QR Code" className="qr-image" />
            <p className="qr-hint">Comparte esta ruta escaneando el código QR</p>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className="route-notification">
          {notification}
        </div>
      )}
    </>
  );
};
