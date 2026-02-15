// src/components/CabalgataAnimation/CabalgataAnimation.tsx
import React, { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import { cabalgataRoutes } from '@/data/cabalgataRoutes';
import './CabalgataAnimation.css';

interface CabalgataAnimationProps {
  type: 'ninot' | 'fuego';
  isActive: boolean;
}

export const CabalgataAnimation: React.FC<CabalgataAnimationProps> = ({ type, isActive }) => {
  const map = useMap();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const progressRef = useRef(0);

  const route = type === 'ninot' ? cabalgataRoutes.ninot : cabalgataRoutes.fuego;

  const getPositionAtProgress = (progress: number) => {
    const coords = route.coordinates;
    const totalSegments = coords.length - 1;
    const segmentIndex = Math.min(
      Math.floor(progress * totalSegments),
      totalSegments - 1
    );
    const segmentProgress = (progress * totalSegments) - segmentIndex;

    const start = coords[segmentIndex];
    const end = coords[Math.min(segmentIndex + 1, coords.length - 1)];

    return [
      start[0] + (end[0] - start[0]) * segmentProgress,
      start[1] + (end[1] - start[1]) * segmentProgress
    ] as [number, number];
  };

  useEffect(() => {
    if (!isActive || !map) return;

    const canvas = document.createElement('canvas');
    canvasRef.current = canvas;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '650';

    const updateCanvasSize = () => {
      const container = map.getContainer();
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };

    updateCanvasSize();
    map.getContainer().appendChild(canvas);
    map.on('resize', updateCanvasSize);
    map.on('move', () => {});

    const colors = type === 'ninot'
      ? ['#FF6B35', '#4ECDC4', '#FFE66D', '#FF8B94', '#A8E6CF']
      : ['#FF4500', '#FF6347', '#FF8C00', '#FFD700', '#FFA500'];

    const particles: Array<{
      x: number; y: number; vx: number; vy: number;
      color: string; size: number; life: number; maxLife: number;
    }> = [];

    const animate = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      progressRef.current = (progressRef.current + 0.0008) % 1;
      const [lat, lng] = getPositionAtProgress(progressRef.current);
      const point = map.latLngToContainerPoint([lat, lng]);

      // Emitir partículas
      for (let i = 0; i < 3; i++) {
        particles.push({
          x: point.x + (Math.random() - 0.5) * 10,
          y: point.y + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 3,
          vy: -Math.random() * 2 - 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 8 + 4,
          life: 1,
          maxLife: Math.random() * 40 + 20
        });
      }

      // Dibujar icono principal
      ctx.font = '24px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(type === 'ninot' ? '🎭' : '🔥', point.x, point.y);

      // Actualizar y dibujar partículas
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1 / p.maxLife;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = p.life * 0.7;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      map.off('resize', updateCanvasSize);
    };
  }, [isActive, map, type]);

  return null;
};
