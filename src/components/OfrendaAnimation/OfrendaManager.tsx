// src/components/OfrendaAnimation/OfrendaManager.tsx
import React, { useMemo } from 'react';
import { OfrendaAnimation } from './OfrendaAnimation';
import { useAppStore } from '@/stores/useAppStore';

export const OfrendaManager: React.FC = () => {
  const selectedDay = useAppStore(state => state.selectedDay);
  const selectedHour = useAppStore(state => state.selectedHour);
  const clockMode = useAppStore(state => state.clockMode);

  // Get current hour based on clock mode
  const currentHour = useMemo(() => {
    return clockMode === 'real' ? new Date().getHours() : selectedHour;
  }, [clockMode, selectedHour]);

  // Check if routes should be active (days 17-18, hours 15-01)
  const isRoutesActive = useMemo(() => {
    if (selectedDay !== 17 && selectedDay !== 18) return false;
    
    // Day 17: 15:30 to 23:59
    if (selectedDay === 17) {
      return currentHour >= 15;
    }
    
    // Day 18: 00:00 to 01:00 (continuation), then 15:30 to 23:59
    if (selectedDay === 18) {
      return currentHour <= 1 || currentHour >= 15;
    }
    
    return false;
  }, [selectedDay, currentHour]);

  // Check if Virgen icon should be shown (from day 17 onwards)
  const showVirgen = useMemo(() => {
    return selectedDay >= 17;
  }, [selectedDay]);

  // Calculate fill percentage (50% day 17, 100% from day 18)
  const virgenFillPercentage = useMemo(() => {
    if (selectedDay < 17) return 0;
    if (selectedDay === 17) {
      // Day 17: progressive fill from 0 to 50%
      // Starts at 15:30 (hour 15), should be 50% by end of day
      if (currentHour < 15) return 0;
      
      // Calculate progress through the ofrenda (15:30 to 01:00 = 9.5 hours)
      let hoursSinceStart = 0;
      if (currentHour >= 15) {
        hoursSinceStart = currentHour - 15;
      }
      
      // 50% fill over 9.5 hours = ~5.26% per hour
      const fillRate = 50 / 9.5;
      return Math.min(50, hoursSinceStart * fillRate);
    }
    
    if (selectedDay === 18) {
      // Day 18: starts at 50%, fills to 100%
      // Early morning (00:00-01:00): still filling to 50%
      if (currentHour <= 1) {
        const hoursSinceStart = 9.5 + currentHour; // Continue from day 17
        const fillRate = 50 / 9.5;
        return Math.min(50, hoursSinceStart * fillRate);
      }
      
      // After 15:30: fill from 50% to 100%
      if (currentHour < 15) return 50;
      
      const hoursSinceStart = currentHour - 15;
      const fillRate = 50 / 9.5; // Another 50% over 9.5 hours
      return Math.min(100, 50 + (hoursSinceStart * fillRate));
    }
    
    // Day 19 and onwards: stays at 100%
    return 100;
  }, [selectedDay, currentHour]);

  return (
    <OfrendaAnimation
      isRoutesActive={isRoutesActive}
      virgenFillPercentage={virgenFillPercentage}
      showVirgen={showVirgen}
    />
  );
};
