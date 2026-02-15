// src/components/Animations/AnimationsLayer.tsx
import { useEffect, useRef } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { animationManager } from '@/services/animationManager';
import './AnimationsLayer.css';

export const AnimationsLayer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedDay = useAppStore(state => state.selectedDay);
  const selectedHour = useAppStore(state => state.selectedHour);

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
    const currentDate = new Date(2026, 2, selectedDay, selectedHour); // Marzo es mes 2
    animationManager.setCurrentTime(currentDate);
  }, [selectedDay, selectedHour]);

  return (
    <div ref={containerRef} className="animations-layer" />
  );
};
