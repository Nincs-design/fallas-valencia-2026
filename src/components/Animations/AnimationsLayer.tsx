// src/components/Animations/AnimationsLayer.tsx
import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { animationManager } from '@/services/animationManager';
import { getActiveAnimations } from '@/config/animationsConfig';
import { AnimationConfig } from '@/types/animations';
import { EventInfoModal } from '@/components/EventMarkers/EventInfoModal';
import './AnimationsLayer.css';

export const AnimationsLayer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedDay = useAppStore(state => state.selectedDay);
  const selectedHour = useAppStore(state => state.selectedHour);
  
  const [selectedAnimation, setSelectedAnimation] = useState<AnimationConfig | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeAnimations, setActiveAnimations] = useState<AnimationConfig[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Inicializar el manager con el contenedor
    animationManager.initialize(containerRef.current);

    // Iniciar actualización automática cada 5 segundos
    animationManager.startAutoUpdate(5000);

    // Cleanup al desmontar
    return () => {
      animationManager.cleanup();
    };
  }, []);

  useEffect(() => {
    // Actualizar animaciones cuando cambia el día o la hora
    const currentDate = new Date(2026, 2, selectedDay, selectedHour);
    animationManager.setCurrentTime(currentDate);
    
    // Obtener animaciones activas para los overlays
    const active = getActiveAnimations(currentDate);
    setActiveAnimations(active);
  }, [selectedDay, selectedHour]);

  const handleAnimationClick = (animation: AnimationConfig) => {
    // Pausar la animación (convertir a icono estático)
    animationManager.pauseAnimation(animation.id);
    
    // Mostrar modal
    setSelectedAnimation(animation);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    // Reanudar animación
    if (selectedAnimation) {
      animationManager.resumeAnimation(selectedAnimation.id);
    }
    
    setShowModal(false);
    setSelectedAnimation(null);
  };

  return (
    <>
      <div ref={containerRef} className="animations-layer" />
      
      {/* Overlays clickeables sobre animaciones activas */}
      {activeAnimations.map(animation => (
        <AnimationClickOverlay
          key={animation.id}
          animation={animation}
          onClick={() => handleAnimationClick(animation)}
        />
      ))}

      {/* Modal de información */}
      {showModal && selectedAnimation && (
        <EventInfoModal
          animation={selectedAnimation}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

// Componente para el área clickeable sobre la animación
interface AnimationClickOverlayProps {
  animation: AnimationConfig;
  onClick: () => void;
}

const AnimationClickOverlay = ({ animation, onClick }: AnimationClickOverlayProps) => {
  return (
    <div
      className="animation-click-overlay"
      onClick={onClick}
      style={{
        position: 'fixed',
        // Posicionar según el tipo de animación
        ...(animation.id === 'cabalgata-ninot' || animation.id === 'cabalgata-fuego' ? {
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '200px',
          height: '200px',
        } : animation.id === 'ofrenda' ? {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '250px',
          height: '250px',
        } : {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '150px',
          height: '150px',
        }),
        cursor: 'pointer',
        zIndex: 600,
        // Visual feedback al hover
        borderRadius: '50%',
        transition: 'background-color 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255, 107, 53, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
      title={`Click para ver información sobre ${animation.name}`}
    />
  );
};
