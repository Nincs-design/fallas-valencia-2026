// src/components/OfrendaAnimation/OfrendaAnimation.tsx
import React, { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import { cabalgataRoutes, PLAZA_VIRGEN_COORDS } from '@/data/cabalgataRoutes';
import './OfrendaAnimation.css';

interface FlowerParticle {
  id: number;
  routeProgress: number;
  speed: number;
  flowerType: 'white' | 'red' | 'yellow' | 'multicolor';
  size: number;
  rotation: number;
}

interface OfrendaAnimationProps {
  isRoutesActive: boolean; // Rutas activas durante 17-18 (15:30-01:00)
  virgenFillPercentage: number; // 0-100: progreso del llenado
  showVirgen: boolean; // Mostrar icono de la Virgen
}

export const OfrendaAnimation: React.FC<OfrendaAnimationProps> = ({ 
  isRoutesActive, 
  virgenFillPercentage,
  showVirgen 
}) => {
  const map = useMap();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const virgenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number>();
  const particlesLaPazRef = useRef<FlowerParticle[]>([]);
  const particlesSanVicenteRef = useRef<FlowerParticle[]>([]);
  const nextParticleIdRef = useRef(0);
  const lastSpawnTimeRef = useRef(0);

  const routeLaPaz = cabalgataRoutes.ofrenda_la_paz;
  const routeSanVicente = cabalgataRoutes.ofrenda_san_vicente;

  // Flower colors configuration
  const flowerColors = {
    white: { r: 255, g: 255, b: 255, variation: 10 },
    red: { r: 220, g: 20, b: 60, variation: 20 },
    yellow: { r: 255, g: 215, b: 0, variation: 15 },
    multicolor: { r: 255, g: 140, b: 0, variation: 60 }
  };

  const config = {
    particleCount: 35,
    spawnInterval: 90,
    baseSpeed: 0.004,
    sizeRange: [7, 13]
  };

  const getPositionAtProgress = (route: typeof routeLaPaz, progress: number) => {
    const coords = route.coordinates;
    const totalSegments = coords.length - 1;
    const segmentIndex = Math.min(Math.floor(progress * totalSegments), totalSegments - 1);
    const segmentProgress = (progress * totalSegments) - segmentIndex;

    const start = coords[segmentIndex];
    const end = coords[segmentIndex + 1];

    return {
      lat: start[0] + (end[0] - start[0]) * segmentProgress,
      lng: start[1] + (end[1] - start[1]) * segmentProgress
    };
  };

  const latLngToCanvas = (lat: number, lng: number) => {
    const point = map.latLngToContainerPoint([lat, lng]);
    return { x: point.x, y: point.y };
  };

  const spawnParticle = (route: 'laPaz' | 'sanVicente') => {
    const flowerTypes: Array<'white' | 'red' | 'yellow' | 'multicolor'> = 
      ['white', 'red', 'yellow', 'multicolor'];
    const flowerType = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];
    
    const particle: FlowerParticle = {
      id: nextParticleIdRef.current++,
      routeProgress: 0,
      speed: config.baseSpeed * (0.85 + Math.random() * 0.3),
      flowerType,
      size: config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]),
      rotation: Math.random() * 360
    };

    if (route === 'laPaz') {
      particlesLaPazRef.current.push(particle);
    } else {
      particlesSanVicenteRef.current.push(particle);
    }
  };

  const updateParticles = () => {
    const now = Date.now();

    if (now - lastSpawnTimeRef.current > config.spawnInterval) {
      if (particlesLaPazRef.current.length < config.particleCount) spawnParticle('laPaz');
      if (particlesSanVicenteRef.current.length < config.particleCount) spawnParticle('sanVicente');
      lastSpawnTimeRef.current = now;
    }

    particlesLaPazRef.current = particlesLaPazRef.current.filter(p => {
      p.routeProgress += p.speed;
      p.rotation += 1.5;
      return p.routeProgress < 1;
    });

    particlesSanVicenteRef.current = particlesSanVicenteRef.current.filter(p => {
      p.routeProgress += p.speed;
      p.rotation += 1.5;
      return p.routeProgress < 1;
    });
  };

  const drawFlower = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    flowerType: FlowerParticle['flowerType'],
    rotation: number,
    alpha: number
  ) => {
    const colors = flowerColors[flowerType];
    let r = colors.r, g = colors.g, b = colors.b;
    
    if (flowerType === 'multicolor') {
      const colorChoices = [
        { r: 255, g: 140, b: 0 }, // Naranja
        { r: 30, g: 144, b: 255 }, // Azul
        { r: 50, g: 205, b: 50 }, // Verde
        { r: 220, g: 20, b: 60 } // Rojo
      ];
      const chosen = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      r = chosen.r; g = chosen.g; b = chosen.b;
    } else {
      r = Math.max(0, Math.min(255, r + (Math.random() - 0.5) * colors.variation));
      g = Math.max(0, Math.min(255, g + (Math.random() - 0.5) * colors.variation));
      b = Math.max(0, Math.min(255, b + (Math.random() - 0.5) * colors.variation));
    }

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);

    // Glow
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 1.5);
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * 0.5})`);
    gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${alpha * 0.2})`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(-size * 1.5, -size * 1.5, size * 3, size * 3);

    // Petals
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    for (let i = 0; i < 5; i++) {
      const angle = (i * 2 * Math.PI) / 5;
      ctx.beginPath();
      ctx.ellipse(
        Math.cos(angle) * size * 0.5,
        Math.sin(angle) * size * 0.5,
        size * 0.6, size * 0.4, angle, 0, 2 * Math.PI
      );
      ctx.fill();
    }

    // Center
    ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
  };

  const drawRouteParticles = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    [...particlesLaPazRef.current, ...particlesSanVicenteRef.current].forEach((particle, idx) => {
      const isLaPaz = idx < particlesLaPazRef.current.length;
      const route = isLaPaz ? routeLaPaz : routeSanVicente;
      const pos = getPositionAtProgress(route, particle.routeProgress);
      const canvasPos = latLngToCanvas(pos.lat, pos.lng);

      let alpha = 1;
      if (particle.routeProgress < 0.05) alpha = particle.routeProgress / 0.05;
      else if (particle.routeProgress > 0.95) alpha = (1 - particle.routeProgress) / 0.05;

      drawFlower(ctx, canvasPos.x, canvasPos.y, particle.size, particle.flowerType, particle.rotation, alpha);
    });
  };

  const drawVirgenIcon = (ctx: CanvasRenderingContext2D) => {
    const virgenPos = latLngToCanvas(PLAZA_VIRGEN_COORDS[0], PLAZA_VIRGEN_COORDS[1]);
    const scale = 2.5;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.save();
    ctx.translate(virgenPos.x, virgenPos.y);
    ctx.scale(scale, scale);

    // Outline
    ctx.strokeStyle = 'rgba(139, 69, 19, 0.8)';
    ctx.lineWidth = 2;

    // Crown
    ctx.beginPath();
    ctx.moveTo(-8, -25);
    ctx.lineTo(-5, -28);
    ctx.lineTo(0, -30);
    ctx.lineTo(5, -28);
    ctx.lineTo(8, -25);
    ctx.lineTo(8, -20);
    ctx.arc(0, -20, 8, 0, Math.PI);
    ctx.lineTo(-8, -20);
    ctx.closePath();
    ctx.stroke();
    
    // Body
    ctx.beginPath();
    ctx.moveTo(-15, -12);
    ctx.quadraticCurveTo(-12, -18, -8, -20);
    ctx.lineTo(8, -20);
    ctx.quadraticCurveTo(12, -18, 15, -12);
    ctx.lineTo(12, 25);
    ctx.lineTo(-12, 25);
    ctx.closePath();
    ctx.stroke();
    
    // Baby
    ctx.beginPath();
    ctx.arc(-2, -5, 3, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(1, -2);
    ctx.lineTo(1, 5);
    ctx.lineTo(-5, 5);
    ctx.lineTo(-5, -2);
    ctx.closePath();
    ctx.stroke();

    // Fill with flowers
    if (virgenFillPercentage > 0) {
      const fillHeight = (virgenFillPercentage / 100) * 55;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(-15, -12);
      ctx.quadraticCurveTo(-12, -18, -8, -20);
      ctx.lineTo(8, -20);
      ctx.quadraticCurveTo(12, -18, 15, -12);
      ctx.lineTo(12, 25);
      ctx.lineTo(-12, 25);
      ctx.closePath();
      ctx.clip();

      const numFlowers = Math.floor(virgenFillPercentage * 2);
      for (let i = 0; i < numFlowers; i++) {
        const x = (Math.random() - 0.5) * 24;
        const y = 25 - (Math.random() * fillHeight);
        
        const types = ['white', 'red', 'yellow', 'multicolor'];
        const type = types[Math.floor(Math.random() * types.length)] as any;
        const colors = flowerColors[type];
        
        let r = colors.r, g = colors.g, b = colors.b;
        if (type === 'multicolor') {
          const choices = [
            { r: 255, g: 140, b: 0 },
            { r: 30, g: 144, b: 255 },
            { r: 50, g: 205, b: 50 },
            { r: 220, g: 20, b: 60 }
          ];
          const c = choices[Math.floor(Math.random() * choices.length)];
          r = c.r; g = c.g; b = c.b;
        }
        
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.9)`;
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, 2 * Math.PI);
        ctx.fill();
      }
      ctx.restore();
    }

    ctx.restore();
  };

  const animateRoutes = () => {
    if (!isRoutesActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    updateParticles();
    drawRouteParticles(ctx);
    animationFrameRef.current = requestAnimationFrame(animateRoutes);
  };

  useEffect(() => {
    if (!isRoutesActive) {
      particlesLaPazRef.current = [];
      particlesSanVicenteRef.current = [];
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = map.getContainer();
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    animateRoutes();

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
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isRoutesActive, map]);

  useEffect(() => {
    if (!showVirgen) {
      const canvas = virgenCanvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    const canvas = virgenCanvasRef.current;
    if (!canvas) return;

    const container = map.getContainer();
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    const ctx = canvas.getContext('2d');
    if (ctx) drawVirgenIcon(ctx);

    const handleMapChange = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      if (ctx) drawVirgenIcon(ctx);
    };

    map.on('move', handleMapChange);
    map.on('zoom', handleMapChange);
    map.on('resize', handleMapChange);

    return () => {
      map.off('move', handleMapChange);
      map.off('zoom', handleMapChange);
      map.off('resize', handleMapChange);
    };
  }, [showVirgen, virgenFillPercentage, map]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="ofrenda-routes-canvas"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 650
        }}
      />
      
      {showVirgen && (
        <canvas
          ref={virgenCanvasRef}
          className="ofrenda-virgen-canvas"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            pointerEvents: 'none',
            zIndex: 660
          }}
        />
      )}
    </>
  );
};
