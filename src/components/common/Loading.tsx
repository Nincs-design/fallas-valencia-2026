// src/components/common/Loading.tsx
import './Loading.css';

export const Loading = () => {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="loading-text">FALLAS 2026</div>
        <div className="loading-bars">
          <div className="loading-bar bar-1"></div>
          <div className="loading-bar bar-2"></div>
          <div className="loading-bar bar-3"></div>
          <div className="loading-bar bar-4"></div>
        </div>
        <div className="loading-subtitle">Cargando mapa...</div>
      </div>
    </div>
  );
};
