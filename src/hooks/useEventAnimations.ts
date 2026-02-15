// src/hooks/useEventAnimations.ts
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useAppStore } from '@/stores/useAppStore';
import { eventAnimationService } from '@/services/eventAnimations';
import { eventsData } from '@/data/events';

export const useEventAnimations = () => {
  const map = useMap();
  const selectedDay = useAppStore(state => state.selectedDay);
  const selectedHour = useAppStore(state => state.selectedHour);

  useEffect(() => {
    // Configurar el mapa en el servicio de animaciones
    eventAnimationService.setMap(map);

    return () => {
      // Limpiar animaciones al desmontar
      eventAnimationService.clearAnimations();
    };
  }, [map]);

  useEffect(() => {
    // Obtener el evento del día seleccionado
    const event = eventsData[selectedDay];
    
    if (!event) {
      eventAnimationService.clearAnimations();
      return;
    }

    const animationType = event.animation;

    // Activar animación según el tipo y la hora
    switch (animationType) {
      case 'cabalgata':
        // La cabalgata empieza a las 20:00
        if (selectedHour >= 20) {
          eventAnimationService.triggerAnimation('cabalgata');
        } else {
          eventAnimationService.clearAnimations();
        }
        break;

      case 'ofrenda':
        // La ofrenda es de 16:00 a 23:00
        if (selectedHour >= 16 && selectedHour <= 23) {
          eventAnimationService.triggerAnimation('ofrenda', { hour: selectedHour });
        } else if (selectedHour > 23) {
          // Mostrar ofrenda completa (100%)
          eventAnimationService.triggerAnimation('ofrenda', { hour: 24 });
        } else {
          eventAnimationService.clearAnimations();
        }
        break;

      case 'mascletà':
        // La mascletà es a las 14:00
        if (selectedHour === 14) {
          eventAnimationService.triggerAnimation('mascletà');
        } else {
          eventAnimationService.clearAnimations();
        }
        break;

      case 'cremà':
        // La cremà empieza a las 22:00
        if (selectedHour >= 22) {
          eventAnimationService.triggerAnimation('cremà');
        } else {
          eventAnimationService.clearAnimations();
        }
        break;

      default:
        eventAnimationService.clearAnimations();
    }
  }, [selectedDay, selectedHour]);

  return null;
};
