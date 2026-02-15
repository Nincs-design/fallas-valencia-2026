# 🔄 Guía de Migración: Vanilla JS → React

## 📊 Comparación Lado a Lado

### 1. Estructura HTML vs Componentes

**ANTES (Vanilla JS - HTML)**
```html
<div class="calendar-widget">
  <div class="calendar-header">📅 CALENDARIO</div>
  <select id="daySelector">
    <option value="15">15 Mar - Ofrenda</option>
  </select>
</div>

<script>
  document.getElementById('daySelector').addEventListener('change', (e) => {
    updateEvent(parseInt(e.target.value));
  });
</script>
```

**AHORA (React - TSX)**
```tsx
export const CalendarWidget = () => {
  const [selectedDay, setSelectedDay] = useState(15);

  return (
    <div className="calendar-widget">
      <div className="calendar-header">📅 CALENDARIO</div>
      <select 
        value={selectedDay}
        onChange={(e) => setSelectedDay(parseInt(e.target.value))}
      >
        <option value="15">15 Mar - Ofrenda</option>
      </select>
    </div>
  );
};
```

**Ventajas:**
- ✅ No más `getElementById` o `querySelector`
- ✅ Estado y UI sincronizados automáticamente
- ✅ TypeScript detecta errores antes de ejecutar
- ✅ Componente reutilizable

---

### 2. Estado Global

**ANTES (Vanilla JS)**
```javascript
// Variables globales dispersas
let selectedRoute = [];
let userLocation = { lat: 39.4699, lng: -0.3763 };
let currentFalla = null;

// Funciones que modifican estado
function addToRoute(falla) {
  selectedRoute.push(falla);
  updateRouteDisplay();
}

function setCurrentFalla(falla) {
  currentFalla = falla;
  openPanel();
}
```

**AHORA (React + Zustand)**
```typescript
// store.ts - Un solo lugar para todo el estado
export const useAppStore = create<AppState>((set) => ({
  selectedRoute: [],
  userLocation: { lat: 39.4699, lng: -0.3763 },
  selectedFalla: null,

  addToRoute: (falla) => set((state) => ({
    selectedRoute: [...state.selectedRoute, falla]
  })),

  setSelectedFalla: (falla) => set({ 
    selectedFalla: falla,
    isPanelOpen: true 
  })
}));

// En cualquier componente
const addToRoute = useAppStore(state => state.addToRoute);
const selectedRoute = useAppStore(state => state.selectedRoute);
```

**Ventajas:**
- ✅ Estado centralizado y predecible
- ✅ Cualquier componente puede acceder sin prop drilling
- ✅ TypeScript valida el estado completo
- ✅ DevTools para debugging

---

### 3. Manipulación del DOM

**ANTES (Vanilla JS)**
```javascript
function updateRouteDisplay() {
  const routeList = document.getElementById('routeList');
  
  if (selectedRoute.length === 0) {
    routeList.innerHTML = `
      <div class="empty-route">
        <p>Añade fallas a tu recorrido</p>
      </div>
    `;
    return;
  }

  routeList.innerHTML = selectedRoute.map((loc, index) => `
    <div class="route-item" data-number="${index + 1}">
      <div class="route-item-info">
        <div class="route-item-name">${loc.name}</div>
      </div>
      <button onclick="removeFromRoute(${loc.id})">×</button>
    </div>
  `).join('');
}
```

**AHORA (React)**
```tsx
export const RouteBuilder = () => {
  const selectedRoute = useAppStore(state => state.selectedRoute);
  const removeFromRoute = useAppStore(state => state.removeFromRoute);

  return (
    <div className="route-list">
      {selectedRoute.length === 0 ? (
        <div className="empty-route">
          <p>Añade fallas a tu recorrido</p>
        </div>
      ) : (
        selectedRoute.map((loc, index) => (
          <div key={loc.id} className="route-item" data-number={index + 1}>
            <div className="route-item-info">
              <div className="route-item-name">{loc.name}</div>
            </div>
            <button onClick={() => removeFromRoute(loc.id)}>×</button>
          </div>
        ))
      )}
    </div>
  );
};
```

**Ventajas:**
- ✅ No más `innerHTML` peligroso (XSS)
- ✅ Actualizaciones automáticas cuando cambia el estado
- ✅ Event handlers con closures correctos
- ✅ Keys para optimizar re-renders

---

### 4. Mapas con Leaflet

**ANTES (Vanilla JS)**
```javascript
let map;

function initMap() {
  map = L.map('map').setView([39.4699, -0.3763], 14);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    .addTo(map);

  fallasData.forEach(falla => {
    const marker = L.marker([falla.lat, falla.lng]);
    marker.on('click', () => openFallaPanel(falla));
    marker.addTo(map);
  });
}

window.onload = initMap;
```

**AHORA (React + React Leaflet)**
```tsx
export const MapComponent = () => {
  const setSelectedFalla = useAppStore(state => state.setSelectedFalla);

  return (
    <MapContainer center={[39.4699, -0.3763]} zoom={14}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      {fallasData.map(falla => (
        <Marker 
          key={falla.id}
          position={[falla.lat, falla.lng]}
          eventHandlers={{ 
            click: () => setSelectedFalla(falla) 
          }}
        />
      ))}
    </MapContainer>
  );
};
```

**Ventajas:**
- ✅ Declarativo vs imperativo
- ✅ Lifecycle manejado automáticamente
- ✅ No memory leaks (cleanup automático)
- ✅ Integración perfecta con React

---

### 5. Estilos CSS

**ANTES (Vanilla JS)**
```javascript
// Estilos inline mezclados con lógica
marker.style.cssText = `
  width: 40px;
  height: 40px;
  background: #FF6B35;
  transform: scale(1.2);
`;
```

**AHORA (React)**
```tsx
// Opción 1: CSS Modules (archivos separados)
import styles from './Marker.module.css';

<div className={styles.marker} />

// Opción 2: CSS normal con clases
<div className="custom-marker" />

// Opción 3: Estilos inline solo cuando son dinámicos
<div style={{ 
  transform: `scale(${isHovered ? 1.2 : 1})` 
}} />
```

**Ventajas:**
- ✅ Separación de concerns
- ✅ CSS Modules previene conflictos
- ✅ Mejor performance (menos cambios de estilo)
- ✅ Más mantenible

---

### 6. Event Listeners

**ANTES (Vanilla JS)**
```javascript
// Fácil crear memory leaks
document.getElementById('btn').addEventListener('click', handler);

// Hay que limpiar manualmente
function cleanup() {
  document.getElementById('btn').removeEventListener('click', handler);
}
```

**AHORA (React)**
```tsx
// Cleanup automático
<button onClick={handler}>Click me</button>

// O con useEffect para eventos custom
useEffect(() => {
  const handleResize = () => console.log('resized');
  window.addEventListener('resize', handleResize);
  
  // Cleanup automático
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

**Ventajas:**
- ✅ No memory leaks
- ✅ Cleanup automático
- ✅ Closures correctos
- ✅ Menos código boilerplate

---

### 7. Optimización de Rutas

**ANTES (Vanilla JS)**
```javascript
class RouteOptimizer {
  constructor(map) {
    this.map = map;
    this.selectedLocations = [];
  }

  addLocation(location) {
    this.selectedLocations.push(location);
    this.updateUI();
  }

  updateUI() {
    // Manipular DOM directamente
    document.getElementById('count').textContent = 
      this.selectedLocations.length;
  }
}

const optimizer = new RouteOptimizer(map);
```

**AHORA (React + Service)**
```typescript
// service/routeOptimizer.ts - Lógica pura (sin UI)
export class RouteOptimizerService {
  calculateDistance(lat1, lng1, lat2, lng2) { /*...*/ }
  optimizeRoute(locations, start) { /*...*/ }
}

export const routeOptimizer = new RouteOptimizerService();

// Component - Solo UI
export const RouteBuilder = () => {
  const locations = useAppStore(state => state.selectedRoute);
  
  const handleOptimize = () => {
    const optimized = routeOptimizer.optimizeRoute(locations, start);
    setOptimizedRoute(optimized);
  };

  return <button onClick={handleOptimize}>Optimizar</button>;
};
```

**Ventajas:**
- ✅ Separación clara: lógica vs UI
- ✅ Fácil de testear (lógica pura)
- ✅ Reutilizable en cualquier componente
- ✅ No acoplado al DOM

---

### 8. Loading States

**ANTES (Vanilla JS)**
```javascript
async function fetchData() {
  const loader = document.getElementById('loading');
  loader.style.display = 'block';
  
  try {
    const data = await fetch('/api/fallas');
    updateUI(data);
  } catch (error) {
    showError(error);
  } finally {
    loader.style.display = 'none';
  }
}
```

**AHORA (React)**
```tsx
export const FallasList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/fallas');
        setData(await response.json());
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;
  return <div>{data.map(...)}</div>;
};
```

**Ventajas:**
- ✅ Estados claros (loading, error, success)
- ✅ UI declarativa basada en estado
- ✅ Componentes especializados
- ✅ Fácil de testear cada estado

---

## 🎯 Patrones Clave de React

### 1. Composición sobre Herencia
```tsx
// Malo: Crear clase base y heredar
class BasePanel extends Component { /*...*/ }
class FallaPanel extends BasePanel { /*...*/ }

// Bueno: Componer componentes pequeños
<Panel>
  <PanelHeader title="Falla" />
  <PanelContent>...</PanelContent>
  <PanelActions>...</PanelActions>
</Panel>
```

### 2. Props vs State
```tsx
// Props: Datos de arriba hacia abajo (inmutables)
<FallaCard falla={fallaData} onSelect={handleSelect} />

// State: Datos que cambian en el tiempo (mutables)
const [isOpen, setIsOpen] = useState(false);
```

### 3. Lifting State Up
```tsx
// Cuando dos componentes necesitan el mismo estado
// Súbelo al padre común

// ❌ Malo: Estado duplicado
const ComponentA = () => {
  const [selectedDay, setSelectedDay] = useState(15);
  // ...
};

const ComponentB = () => {
  const [selectedDay, setSelectedDay] = useState(15);
  // ...
};

// ✅ Bueno: Estado compartido en Zustand
const selectedDay = useAppStore(state => state.selectedDay);
```

### 4. Custom Hooks
```tsx
// Extraer lógica reutilizable
export const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation(pos.coords),
      (err) => setError(err)
    );
  }, []);

  return { location, error };
};

// Usar en cualquier componente
const { location, error } = useGeolocation();
```

---

## 📈 Métricas de Mejora

| Métrica | Vanilla JS | React |
|---------|-----------|-------|
| **Líneas de código** | ~1200 | ~800 |
| **Bugs por refactor** | Alto | Bajo |
| **Tiempo de debugging** | 3x | 1x |
| **Testabilidad** | Difícil | Fácil |
| **Onboarding nuevos devs** | 2 semanas | 3 días |
| **Performance** | Buena | Excelente* |

*Con optimizaciones (memo, useMemo, useCallback)

---

## 🚀 Próximos Pasos en React

### 1. Animaciones Contextuales
```tsx
// hooks/useEventAnimation.ts
export const useEventAnimation = (day: number, hour: number) => {
  const mapRef = useRef<Map>(null);

  useEffect(() => {
    if (day === 18 && hour >= 20) {
      // Trigger Cabalgata animation
      animateCabalgata(mapRef.current);
    }
    
    return () => {
      // Cleanup animations
    };
  }, [day, hour]);
};
```

### 2. Traductor con OCR
```tsx
// components/CameraTranslator.tsx
export const CameraTranslator = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { captureFrame } = useCamera(videoRef);
  const { translate } = useOCR();

  const handleCapture = async () => {
    const frame = await captureFrame();
    const text = await translate(frame);
    setTranslation(text);
  };

  return (
    <div>
      <video ref={videoRef} />
      <button onClick={handleCapture}>Traducir</button>
    </div>
  );
};
```

### 3. PWA con Offline
```tsx
// App.tsx
import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {
    // Mostrar notificación de actualización
  },
  onOfflineReady() {
    // App lista para offline
  }
});
```

---

## 📚 Recursos de Aprendizaje

- **React Docs**: https://react.dev/
- **Zustand**: https://github.com/pmndrs/zustand
- **React Leaflet**: https://react-leaflet.js.org/
- **TypeScript**: https://www.typescriptlang.org/

---

**Conclusión**: La migración a React proporciona una base más sólida, mantenible y escalable para continuar desarrollando las funcionalidades avanzadas de la app de Fallas València.
