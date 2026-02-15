// src/components/common/NavigationControls.tsx
import { useAppStore } from '@/stores/useAppStore';
import { useMap } from 'react-leaflet';
import './NavigationControls.css';

export const NavigationControls = () => {
  const map = useMap();
  const userLocation = useAppStore(state => state.userLocation);
  const isRouteBuilderOpen = useAppStore(state => state.isRouteBuilderOpen);
  const setIsRouteBuilderOpen = useAppStore(state => state.setIsRouteBuilderOpen);

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  const handleCenter = () => {
    map.setView([userLocation.lat, userLocation.lng], 14);
  };

  const handleToggleRouteBuilder = () => {
    setIsRouteBuilderOpen(!isRouteBuilderOpen);
  };

  return (
    <div className="nav-controls">
      <button className="nav-btn" onClick={handleZoomIn} title="Acercar">
        +
      </button>
      <button className="nav-btn" onClick={handleZoomOut} title="Alejar">
        -
      </button>
      <button className="nav-btn" onClick={handleCenter} title="Mi ubicación">
        ⊙
      </button>
      <button 
        className="nav-btn" 
        onClick={handleToggleRouteBuilder} 
        title="Mi recorrido"
        style={{ fontSize: '20px' }}
      >
        📋
      </button>
    </div>
  );
};
