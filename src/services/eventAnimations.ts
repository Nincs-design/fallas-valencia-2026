// src/services/eventAnimations.ts
import { Map as LeafletMap, Marker, Polyline, divIcon, LatLngExpression } from 'leaflet';

export type AnimationType = 'cabalgata' | 'ofrenda' | 'mascletà' | 'cremà';

export class EventAnimationService {
  private map: LeafletMap | null = null;
  private activeMarkers: Marker[] = [];
  private activePolylines: Polyline[] = [];
  private animationIntervals: ReturnType<typeof setInterval>[] = [];

  setMap(map: LeafletMap) {
    this.map = map;
  }

  clearAnimations() {
    // Remove all markers
    this.activeMarkers.forEach(marker => {
      if (this.map) {
        this.map.removeLayer(marker);
      }
    });
    this.activeMarkers = [];

    // Remove all polylines
    this.activePolylines.forEach(polyline => {
      if (this.map) {
        this.map.removeLayer(polyline);
      }
    });
    this.activePolylines = [];

    // Clear all intervals
    this.animationIntervals.forEach(interval => clearInterval(interval));
    this.animationIntervals = [];
  }

  // Cabalgata del Fuego: Recorrido animado con demonios de fuego
  animateCabalgataDelFuego() {
    if (!this.map) return;

    this.clearAnimations();

    // Ruta de la Cabalgata: Calle de la Paz → Porta de la Mar
    const route: LatLngExpression[] = [
      [39.4699, -0.3763], // Plaza Ayuntamiento
      [39.4705, -0.3755],
      [39.4712, -0.3748],
      [39.4720, -0.3740],
      [39.4728, -0.3732], // Porta de la Mar
    ];

    // Dibujar la ruta de la cabalgata
    const routeLine = new Polyline(route, {
      color: '#FF6B35',
      weight: 4,
      opacity: 0.6,
      dashArray: '10, 10',
    }).addTo(this.map);
    this.activePolylines.push(routeLine);

    // Crear múltiples "demonios" que se mueven por la ruta
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        this.createMovingFireDemon(route, i);
      }, i * 1500);
    }
  }

  private createMovingFireDemon(route: LatLngExpression[], _offset: number) {
    if (!this.map) return;

    const demonIcon = divIcon({
      html: `
        <div style="
          font-size: 32px; 
          animation: pulse 0.8s infinite, bounce 1s infinite;
          filter: drop-shadow(0 0 8px #FF6B35);
        ">🔥</div>
      `,
      className: 'fire-demon-marker',
      iconSize: [32, 32],
    });

    const marker = new Marker(route[0] as [number, number], { 
      icon: demonIcon,
      zIndexOffset: 1000 
    }).addTo(this.map);
    this.activeMarkers.push(marker);

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < route.length - 1) {
        currentIndex++;
        marker.setLatLng(route[currentIndex] as [number, number]);
      } else {
        // Loop: volver al inicio
        currentIndex = 0;
        marker.setLatLng(route[0] as [number, number]);
      }
    }, 1000);

    this.animationIntervals.push(interval);
  }

  // Ofrenda de Flores: Virgen con flores progresivas
  animateOfrendaFlores(currentHour: number) {
    if (!this.map) return;

    this.clearAnimations();

    // Ubicación de la Plaza de la Virgen
    const virgenLocation: [number, number] = [39.4756, -0.3749];

    // Calcular progreso según la hora (16:00 - 23:00)
    const startHour = 16;
    const endHour = 23;
    let flowerProgress = 0;

    if (currentHour >= startHour && currentHour <= endHour) {
      flowerProgress = ((currentHour - startHour) / (endHour - startHour)) * 100;
    } else if (currentHour > endHour) {
      flowerProgress = 100;
    }

    // Crear icono de la Virgen con flores progresivas
    const virgenIcon = divIcon({
      html: `
        <div style="
          width: 70px;
          height: 90px;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        ">
          <!-- Virgen -->
          <div style="
            width: 60px;
            height: 70px;
            background: linear-gradient(135deg, #004E89, #06A77D);
            border: 3px solid #FFD23F;
            border-radius: 50% 50% 0 0;
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-top: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          ">
            <div style="font-size: 24px;">👑</div>
          </div>
          
          <!-- Manto de flores progresivo -->
          <div style="
            position: absolute;
            bottom: -20px;
            width: 75px;
            height: ${flowerProgress * 0.8}px;
            background: repeating-linear-gradient(
              0deg,
              #FF6B35,
              #FF6B35 8px,
              #FFD23F 8px,
              #FFD23F 16px
            );
            border: 2px solid #1A1A1A;
            transition: height 1s ease;
          "></div>
          
          <!-- Indicador de progreso -->
          <div style="
            position: absolute;
            top: -30px;
            background: #1A1A1A;
            color: #FFD23F;
            padding: 4px 8px;
            font-size: 11px;
            font-weight: bold;
            white-space: nowrap;
            border: 2px solid #FFD23F;
          ">🌸 ${Math.round(flowerProgress)}%</div>
        </div>
      `,
      className: 'virgen-marker',
      iconSize: [70, 90],
    });

    const virgenMarker = new Marker(virgenLocation, { 
      icon: virgenIcon,
      zIndexOffset: 1000 
    }).addTo(this.map);
    this.activeMarkers.push(virgenMarker);

    // Simular llegada de comisiones falleras si está en horario
    if (currentHour >= startHour && currentHour <= endHour) {
      this.createOfrendaProcession(virgenLocation);
    }
  }

  private createOfrendaProcession(destination: [number, number]) {
    if (!this.map) return;

    // Rutas desde diferentes puntos
    const startPoints: [number, number][] = [
      [39.4650, -0.3800],
      [39.4680, -0.3720],
      [39.4720, -0.3810]
    ];

    startPoints.forEach((start, index) => {
      setTimeout(() => {
        if (!this.map) return;

        const processionIcon = divIcon({
          html: `
            <div style="
              font-size: 28px;
              animation: bounce 1.5s infinite;
              filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
            ">👥🌸</div>
          `,
          className: 'procession-marker',
          iconSize: [30, 30],
        });

        const marker = new Marker(start, { 
          icon: processionIcon,
          zIndexOffset: 900 
        }).addTo(this.map!);
        this.activeMarkers.push(marker);

        // Animar hacia la virgen
        const steps = 25;
        let currentStep = 0;

        const interval = setInterval(() => {
          if (currentStep < steps) {
            const lat = start[0] + (destination[0] - start[0]) * (currentStep / steps);
            const lng = start[1] + (destination[1] - start[1]) * (currentStep / steps);
            marker.setLatLng([lat, lng]);
            currentStep++;
          } else {
            clearInterval(interval);
            if (this.map) {
              this.map.removeLayer(marker);
            }
            const markerIndex = this.activeMarkers.indexOf(marker);
            if (markerIndex > -1) {
              this.activeMarkers.splice(markerIndex, 1);
            }
          }
        }, 200);

        this.animationIntervals.push(interval);
      }, index * 2000);
    });
  }

  // Mascletà: Explosiones de fuegos artificiales
  animateMascleta() {
    if (!this.map) return;

    this.clearAnimations();

    // Plaza del Ayuntamiento
    const mascletaLocation: [number, number] = [39.4699, -0.3763];

    // Crear múltiples explosiones en secuencia
    for (let i = 0; i < 12; i++) {
      setTimeout(() => {
        this.createFireworkExplosion(mascletaLocation);
      }, i * 400);
    }
  }

  private createFireworkExplosion(location: [number, number]) {
    if (!this.map) return;

    const randomOffset = () => (Math.random() - 0.5) * 0.003;

    const explosionIcon = divIcon({
      html: `
        <div style="
          font-size: 48px;
          animation: explode 1.2s ease-out forwards;
          filter: drop-shadow(0 0 12px #FFD23F);
        ">💥</div>
        <style>
          @keyframes explode {
            0% { 
              transform: scale(0); 
              opacity: 1; 
            }
            50% {
              transform: scale(1.5);
              opacity: 0.9;
            }
            100% { 
              transform: scale(2.5); 
              opacity: 0; 
            }
          }
        </style>
      `,
      className: 'explosion-marker',
      iconSize: [48, 48],
    });

    const marker = new Marker([
      location[0] + randomOffset(),
      location[1] + randomOffset()
    ], { 
      icon: explosionIcon,
      zIndexOffset: 1000 
    }).addTo(this.map);

    // Auto-remove después de la animación
    setTimeout(() => {
      if (this.map) {
        this.map.removeLayer(marker);
      }
    }, 1200);
  }

  // Cremà: Fallas ardiendo
  animateCrema() {
    if (!this.map) return;

    this.clearAnimations();

    // Ubicaciones de todas las fallas
    const fallaLocations: [number, number][] = [
      [39.4699, -0.3763], // Plaza Ayuntamiento
      [39.4742, -0.3753], // Convento Jerusalén
      [39.4651, -0.3712], // Sueca-Literato Azorín
      [39.4805, -0.3695], // Na Jordana
      [39.4740, -0.3790], // Mercado Central
    ];

    // Quemar cada falla con un delay
    fallaLocations.forEach((location, index) => {
      setTimeout(() => {
        this.createBurningFalla(location);
      }, index * 2000);
    });
  }

  private createBurningFalla(location: [number, number]) {
    if (!this.map) return;

    const fireIcon = divIcon({
      html: `
        <div style="
          width: 60px;
          height: 80px;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        ">
          <!-- Llamas principales -->
          <div style="
            position: absolute;
            bottom: 0;
            font-size: 70px;
            animation: flicker 0.6s infinite;
            filter: drop-shadow(0 0 16px #FF6B35);
          ">🔥</div>
          
          <!-- Humo -->
          <div style="
            position: absolute;
            top: -20px;
            font-size: 24px;
            animation: rise 2.5s infinite;
          ">💨</div>
          
          <!-- Chispas -->
          <div style="
            position: absolute;
            top: 10px;
            right: -10px;
            font-size: 16px;
            animation: sparkle 1s infinite;
          ">✨</div>
        </div>
        <style>
          @keyframes flicker {
            0%, 100% { 
              opacity: 1; 
              transform: scale(1); 
            }
            50% { 
              opacity: 0.85; 
              transform: scale(1.15); 
            }
          }
          @keyframes rise {
            0% { 
              opacity: 0.9; 
              transform: translateY(0); 
            }
            100% { 
              opacity: 0; 
              transform: translateY(-40px); 
            }
          }
          @keyframes sparkle {
            0%, 100% { opacity: 0; }
            50% { opacity: 1; }
          }
        </style>
      `,
      className: 'fire-marker',
      iconSize: [60, 80],
    });

    const marker = new Marker(location, { 
      icon: fireIcon,
      zIndexOffset: 1000 
    }).addTo(this.map);
    this.activeMarkers.push(marker);
  }

  // Método principal para activar animaciones según el tipo
  triggerAnimation(type: AnimationType, options: { hour?: number } = {}) {
    switch (type) {
      case 'cabalgata':
        this.animateCabalgataDelFuego();
        break;
      case 'ofrenda':
        this.animateOfrendaFlores(options.hour || 16);
        break;
      case 'mascletà':
        this.animateMascleta();
        break;
      case 'cremà':
        this.animateCrema();
        break;
      default:
        this.clearAnimations();
    }
  }
}

export const eventAnimationService = new EventAnimationService();
