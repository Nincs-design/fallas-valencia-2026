// src/components/CabalgataAnimation/CabalgataManager.tsx
import React, { useMemo, useEffect } from 'react';
import { CabalgataAnimation } from './CabalgataAnimation';
import { useAppStore } from '@/stores/useAppStore';
import { cabalgataRoutes } from '@/data/cabalgataRoutes';
import { useEventAudio } from '@/utils/audioUtils';

export const CabalgataManager: React.FC = () => {
  const selectedDay = useAppStore(state => state.selectedDay);
  const selectedHour = useAppStore(state => state.selectedHour);
  const clockMode = useAppStore(state => state.clockMode);
  const audio = useEventAudio();

  // Get current hour based on clock mode
  const currentHour = useMemo(() => {
    return clockMode === 'real' ? new Date().getHours() : selectedHour;
  }, [clockMode, selectedHour]);

  // Check if Cabalgata del Ninot should be active
  const isNinotActive = useMemo(() => {
    const route = cabalgataRoutes.ninot;
    return selectedDay === route.date && 
           currentHour >= route.startHour && 
           currentHour <= route.endHour;
  }, [selectedDay, currentHour]);

  // Check if Cabalgata del Fuego should be active
  const isFuegoActive = useMemo(() => {
    const route = cabalgataRoutes.fuego;
    return selectedDay === route.date && 
           currentHour >= route.startHour && 
           currentHour <= route.endHour;
  }, [selectedDay, currentHour]);

  // Play audio when Cabalgata del Ninot is active
  useEffect(() => {
    if (isNinotActive) {
      audio.play('cabalgata-ninot', { loop: true, volume: 0.6 });
    } else {
      audio.stop('cabalgata-ninot');
    }
  }, [isNinotActive]);

  // Play audio when Cabalgata del Fuego is active
  useEffect(() => {
    if (isFuegoActive) {
      audio.play('cabalgata-fuego', { loop: true, volume: 0.7 });
    } else {
      audio.stop('cabalgata-fuego');
    }
  }, [isFuegoActive]);

  return (
    <>
      <CabalgataAnimation type="ninot" isActive={isNinotActive} />
      <CabalgataAnimation type="fuego" isActive={isFuegoActive} />
    </>
  );
};
