// src/components/Calendar/CalendarWidget.tsx
import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { eventsData } from '@/data/events';
import './CalendarWidget.css';

export const CalendarWidget: React.FC = () => {
  const selectedDay = useAppStore(state => state.selectedDay);
  const selectedHour = useAppStore(state => state.selectedHour);
  const clockMode = useAppStore(state => state.clockMode);
  const setSelectedDay = useAppStore(state => state.setSelectedDay);
  const setSelectedHour = useAppStore(state => state.setSelectedHour);
  const setClockMode = useAppStore(state => state.setClockMode);

  const [currentRealHour, setCurrentRealHour] = useState(new Date().getHours());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentRealHour(new Date().getHours());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const displayHour = clockMode === 'real' ? currentRealHour : selectedHour;
  const currentEvent = eventsData[selectedDay];

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDay(parseInt(e.target.value));
  };

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedHour(parseInt(e.target.value));
    if (clockMode === 'real') setClockMode('manual');
  };

  const getDayLabel = (day: number): string => {
    if (day <= 28) return `${day} Feb`;
    return `${day - 28} Mar`;
  };

  return (
    <div className="calendar-widget">
      <div className="calendar-header">
        <span className="calendar-title">🎭 FALLAS 2026</span>
        <div className="clock-mode-selector">
          <button
            className={`mode-btn ${clockMode === 'real' ? 'active' : ''}`}
            onClick={() => { setClockMode('real'); setSelectedHour(currentRealHour); }}
          >
            🔴 En Vivo
          </button>
          <button
            className={`mode-btn ${clockMode === 'manual' ? 'active' : ''}`}
            onClick={() => setClockMode('manual')}
          >
            ✋ Manual
          </button>
        </div>
      </div>

      <div className="calendar-controls">
        <div className="slider-group">
          <label>
            📅 {getDayLabel(selectedDay)}
          </label>
          <input
            type="range"
            min="22"
            max="47"
            value={selectedDay}
            onChange={handleDayChange}
            className="day-slider"
          />
          <div className="slider-labels">
            <span>22 Feb</span>
            <span>19 Mar</span>
          </div>
        </div>

        <div className="slider-group">
          <label>
            🕐 {String(displayHour).padStart(2, '0')}:00h
            {clockMode === 'real' && <span className="live-indicator">🔴 EN VIVO</span>}
          </label>
          <input
            type="range"
            min="0"
            max="23"
            value={displayHour}
            onChange={handleHourChange}
            disabled={clockMode === 'real'}
            className="hour-slider"
          />
          <div className="slider-labels">
            <span>00:00</span>
            <span>23:00</span>
          </div>
        </div>
      </div>

      {currentEvent && (
        <div className="current-event">
          <div className="event-name">🎪 {currentEvent.name}</div>
          <div className="event-time">⏰ {currentEvent.time}</div>
          <div className="event-description">{currentEvent.description}</div>
        </div>
      )}
    </div>
  );
};
