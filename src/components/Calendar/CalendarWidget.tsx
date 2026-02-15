// src/components/Calendar/CalendarWidget.tsx
import React from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { eventsData } from '@/data/events';
import './Calendar.css';

export const CalendarWidget = () => {
  const selectedDay = useAppStore(state => state.selectedDay);
  const selectedHour = useAppStore(state => state.selectedHour);
  const setSelectedDay = useAppStore(state => state.setSelectedDay);
  const setSelectedHour = useAppStore(state => state.setSelectedHour);
  const clockMode = useAppStore(state => state.clockMode);
  const setClockMode = useAppStore(state => state.setClockMode);

  const currentEvent = eventsData[selectedDay];

  // Obtener hora actual del sistema
  const [currentRealHour, setCurrentRealHour] = React.useState(new Date().getHours());

  // Actualizar hora real cada minuto
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRealHour(new Date().getHours());
    }, 60000); // Cada 60 segundos

    return () => clearInterval(interval);
  }, []);

  // Determinar qué hora usar para el display
  const displayHour = clockMode === 'real' ? currentRealHour : selectedHour;
  
  // Determinar si es de día o de noche
  const isDayTime = displayHour >= 7 && displayHour < 20;
  const timeOfDayIcon = isDayTime ? '☀️' : '🌙';
  const timeOfDayLabel = isDayTime ? 'DÍA' : 'NOCHE';

  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDay(parseInt(e.target.value));
  };

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedHour(parseInt(e.target.value));
    // Al mover el slider manualmente, cambiar a modo manual
    if (clockMode === 'real') {
      setClockMode('manual');
    }
  };

  const handleModeToggle = () => {
    const newMode = clockMode === 'real' ? 'manual' : 'real';
    setClockMode(newMode);
    
    // Si cambia a modo real, actualizar hora del slider a la hora actual
    if (newMode === 'real') {
      setSelectedHour(currentRealHour);
    }
  };

  return (
    <div className="calendar-widget">
      <div className="calendar-header">
        📅 CALENDARIO
      </div>
      
      {/* Selector de Modo */}
      <div className="clock-mode-selector">
        <button
          className={`mode-btn ${clockMode === 'real' ? 'active' : ''}`}
          onClick={() => {
            setClockMode('real');
            setSelectedHour(currentRealHour);
          }}
          title="Usar hora actual del sistema"
        >
          🌍 Hora Real
        </button>
        <button
          className={`mode-btn ${clockMode === 'manual' ? 'active' : ''}`}
          onClick={() => setClockMode('manual')}
          title="Explorar diferentes horarios"
        >
          🎮 Exploración
        </button>
      </div>

      <div className="calendar-date">
        <div className="date-box">{selectedDay} {selectedDay <= 28 && selectedDay >= 22 ? 'FEB' : 'MAR'}</div>
        <select 
          value={selectedDay}
          onChange={handleDayChange}
          className="day-selector"
        >
          <optgroup label="📅 FEBRERO">
            <option value="22">22 Feb - Despertà, Crida y Exposición</option>
            <option value="28">28 Feb - Cabalgata del Ninot + Pólvora</option>
          </optgroup>
          
          <optgroup label="📅 MARZO">
            <option value="1">01 Mar - Mascletà</option>
            <option value="2">02 Mar - Mascletà</option>
            <option value="3">03 Mar - Mascletà</option>
            <option value="4">04 Mar - Mascletà</option>
            <option value="5">05 Mar - Mascletà</option>
            <option value="6">06 Mar - Mascletà</option>
            <option value="7">07 Mar - Mascletà + Pólvora + Calles Iluminadas</option>
            <option value="8">08 Mar - San Juan + Calles Iluminadas</option>
            <option value="9">09 Mar - Mascletà + Calles Iluminadas</option>
            <option value="10">10 Mar - Mascletà + Calles Iluminadas</option>
            <option value="11">11 Mar - Mascletà + Calles Iluminadas</option>
            <option value="12">12 Mar - Mascletà + Calles Iluminadas</option>
            <option value="13">13 Mar - Mascletà + Bailes + Calles Iluminadas</option>
            <option value="14">14 Mar - Exposición + Calles Iluminadas</option>
            <option value="15">15 Mar - Plantà Infantiles + Calles Iluminadas</option>
            <option value="16">16 Mar - Plantà Grandes + Calles Iluminadas</option>
            <option value="17">17 Mar - Ofrenda + Calles Iluminadas</option>
            <option value="18">18 Mar - Ofrenda + Nit Foc + Calles Ilum.</option>
            <option value="19">19 Mar - Cremà + Calles Iluminadas (último)</option>
          </optgroup>
        </select>
      </div>

      <div className="time-control">
        <label className="time-label">
          HORA {clockMode === 'real' && <span className="live-indicator">🔴 EN VIVO</span>}
        </label>
        <input
          type="range"
          className="time-slider"
          min="0"
          max="23"
          value={selectedHour}
          onChange={handleHourChange}
          disabled={clockMode === 'real'}
        />
        <div className="time-display">
          <span className={`time-of-day ${isDayTime ? 'day' : 'night'}`}>
            {timeOfDayIcon} {timeOfDayLabel}
          </span>
          {displayHour.toString().padStart(2, '0')}:00
        </div>
      </div>

      {currentEvent && (
        <div className="event-indicator">
          {currentEvent.description}
        </div>
      )}
    </div>
  );
};
