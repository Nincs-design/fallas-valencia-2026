// src/components/CabalgataAnimation/CabalgataAnimation.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useMap } from 'react-leaflet';
import { cabalgataRoutes, CabalgataRoute } from '@/data/cabalgataRoutes';
import './CabalgataAnimation.css';

interface Particle {
  id: number;
  routeProgress: number; // 0 to 1
  currentSegment: number;
  segmentProgress: number; // 0 to 1
  speed: number; // random speed variation
  hue: number; // for color variation
  size: number;
}

interface CabalgataAnimationProps {
  type: 'ninot' | 'fuego';
  isActive: boolean;
}

export const CabalgataAnimation: React.FC<CabalgataAnimationProps> = ({ type, isActive }) => {
  const map = useMap();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const nextParticleIdRef = useRef(0);
  const lastSpawnTimeRef = useRef(0);

  const route = cabalgataRoutes[type];

  // Configuration based on type
  const config = type === 'fuego' ? {
    particleCount: 30,
    spawnInterval: 100, // ms between spawns
    baseSpeed: 0.003, // slower for more dramatic effect
    particleLifetime: 30000, // 30 seconds to traverse
    color: {
      base: [255, 100, 0], // orange-red
      variation: 30
    },
    emoji: '🔥',
    sizeRange: [8, 16],
    glowIntensity: 20
  } : {
    particleCount: 25,
    spawnInterval: 120,
    baseSpeed: 0.004,
    particleLifetime: 25000,
    color: {
      base: [255, 200, 50], // yellow
      variation: 40
    },
    emoji: '🎭',
    sizeRange: [6, 12],
    glowIntensity: 15
  };

  // Calculate total route length for proper speed
  const calculateRouteLength = (coords: [number, number][]) => {
    let length = 0;
    for (let i = 0; i < coords.length - 1; i++) {
      const dx = coords[i + 1][1] - coords[i][1];
      const dy = coords[i + 1][0] - coords[i][0];
      length += Math.sqrt(dx * dx + dy * dy);
    }
    return length;
  };

  // Get position along route
  const getPositionAtProgress = (progress: number) => {
    const coords = route.coordinates;
    const totalSegments = coords.length - 1;
    const segmentIndex = Math.min(
      Math.floor(progress * totalSegments),
      totalSegments - 1
    );
    const segmentProgress = (progress * totalSegments) - segmentIndex;

    const start = coords[segmentIndex];
    const end = coords[segmentIndex + 1];

    const lat = start[0] + (end[0] - start[0]) * segmentProgress;
    const lng = start[1] + (end[1] - start[1]) * segmentProgress;

    return { lat, lng };
  };

  // Convert lat/lng to canvas coordinates
  const latLngToCanvas = (lat: number, lng: number) => {
    const point = map.latLngToContainerPoint([lat, lng]);
    return { x: point.x, y: point.y };
  };

  // Spawn new particle
  const spawnParticle = () => {
    const particle: Particle = {
      id: nextParticleIdRef.current++,
      routeProgress: 0,
      currentSegment: 0,
      segmentProgress: 0,
      speed: config.baseSpeed * (0.8 + Math.random() * 0.4),
      hue: Math.random() * config.color.variation,
      size: config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0])
    };
    particlesRef.current.push(particle);
  };

  // Update particles
  const updateParticles = () => {
    const now = Date.now();

    // Spawn new particles
    if (now - lastSpawnTimeRef.current > config.spawnInterval) {
      if (particlesRef.current.length < config.particleCount) {
        spawnParticle();
        lastSpawnTimeRef.current = now;
      }
    }

    // Update existing particles
    particlesRef.current = particlesRef.current.filter(particle => {
      particle.routeProgress += particle.speed;
      
      // Remove if completed route
      if (particle.routeProgress >= 1) {
        return false;
      }

      return true;
    });
  };

  // Draw particles
  const drawParticles = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    particlesRef.current.forEach(particle => {
      const pos = getPositionAtProgress(particle.routeProgress);
      const canvasPos = latLngToCanvas(pos.lat, pos.lng);

      // Calculate alpha based on progress (fade in/out)
      let alpha = 1;
      if (particle.routeProgress < 0.05) {
        alpha = particle.routeProgress / 0.05; // Fade in
      } else if (particle.routeProgress > 0.95) {
        alpha = (1 - particle.routeProgress) / 0.05; // Fade out
      }

      // Draw glow
      const gradient = ctx.createRadialGradient(
        canvasPos.x, canvasPos.y, 0,
        canvasPos.x, canvasPos.y, particle.size * 2
      );

      const color = config.color.base;
      const r = Math.max(0, Math.min(255, color[0] + particle.hue));
      const g = Math.max(0, Math.min(255, color[1] + particle.hue * 0.5));
      const b = Math.max(0, Math.min(255, color[2]));

      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * 0.8})`);
      gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${alpha * 0.4})`);
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(
        canvasPos.x - particle.size * 2,
        canvasPos.y - particle.size * 2,
        particle.size * 4,
        particle.size * 4
      );

      // Draw emoji particle
      ctx.font = `${particle.size}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.globalAlpha = alpha;
      ctx.fillText(config.emoji, canvasPos.x, canvasPos.y);
      ctx.globalAlpha = 1;

      // Draw trail
      if (particle.routeProgress > 0.02) {
        const trailPos = getPositionAtProgress(particle.routeProgress - 0.02);
        const trailCanvasPos = latLngToCanvas(trailPos.lat, trailPos.lng);

        ctx.beginPath();
        ctx.moveTo(trailCanvasPos.x, trailCanvasPos.y);
        ctx.lineTo(canvasPos.x, canvasPos.y);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.3})`;
        ctx.lineWidth = particle.size * 0.3;
        ctx.stroke();
      }
    });
  };

  // Animation loop
  const animate = () => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    updateParticles();
    drawParticles(ctx);

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // Setup canvas
  useEffect(() => {
    if (!isActive) {
      // Clear particles when inactive
      particlesRef.current = [];
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = map.getContainer();
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    // Position canvas
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '650';

    // Start animation
    animate();

    // Handle map events
    const handleMapChange = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };

    map.on('move', handleMapChange);
    map.on('zoom', handleMapChange);
    map.on('resize', handleMapChange);

    return () => {
      map.off('move', handleMapChange);
      map.off('zoom', handleMapChange);
      map.off('resize', handleMapChange);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, map]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`cabalgata-animation cabalgata-${type}`}
    />
  );
};
