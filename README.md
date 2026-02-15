# 🎊 Fallas València 2026 - PWA Interactiva

## 🚀 Inicio Rápido

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Iniciar el Servidor
```bash
npm run dev
```

### 3. Abrir en el Navegador
Abre: `http://localhost:5173/`

**¡Listo!** La app ya debería estar funcionando con el token de Mapbox configurado.

---

## 🎮 Qué Probar

### 1. Ver Eventos Activos
```
1. Abre el calendario (abajo izquierda)
2. Cambia a: 19 Marzo
3. Mueve la hora a: 22:00
4. ¡Marcadores 🔥 empiezan a PULSAR!
5. Click en uno para ver animación
```

### 2. Navegar a un Evento
```
1. Click en marcador 💥 (Mascletà)
2. Espera la animación (5 segundos)
3. Modal aparece con información
4. Click "📍 Cómo Llegar"
5. ¡GPS te guía!
```

### 3. Crear una Ruta Personalizada
```
1. Click en varias fallas ⭐
2. Click "➕ Añadir a Ruta"
3. Click "🎯 Optimizar Ruta"
4. Click "🧭 Iniciar Navegación"
5. ¡Sigue las instrucciones!
```

### 4. Usar Rutas Predefinidas
```
1. Click botón 🗺️ (abajo derecha)
2. Elige una ruta (ej: "Ruta Familiar")
3. Click "Cargar esta ruta"
4. ¡Ya tienes una ruta lista!
```

---

## 📱 Ver en Móvil

```bash
# 1. Inicia el servidor
npm run dev

# 2. Busca la URL de Network en la consola:
➜  Network: http://192.168.1.100:5173/

# 3. Abre esa URL en tu móvil
(debe estar en la misma WiFi)
```

---

## 🎯 Características Principales

### ✅ Mapa Interactivo
- 702 fallas con información completa
- Filtros por tipo y categoría
- Zoom y navegación fluida

### ✅ Eventos con Animaciones
- 13 marcadores de eventos
- Animaciones localizadas al hacer click
- Sincronizados con el calendario real

### ✅ Sistema de Rutas
- Crear rutas personalizadas
- Optimización automática
- Navegación GPS paso a paso
- Exportar/Importar/Compartir

### ✅ Calendario Temporal
- Navega por los días de Fallas
- Ve qué eventos están activos
- Animaciones contextuales

### ✅ 8 Rutas Predefinidas
- Institucional 🏛️
- Vanguardista 🔬
- Familiar 👨‍👩‍👧‍👦
- Arte Fallero 🎨
- Express ⚡
- Histórica 📜
- Fotógrafo 📸
- Gastronómica 🍽️

---

## 🛠️ Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Build
npm run build        # Compila para producción

# Preview
npm run preview      # Previsualiza el build

# Linting
npm run lint         # Verifica el código
```

---

## 🗺️ Token de Mapbox

El token de Mapbox ya está configurado en el código. Si necesitas cambiarlo:

1. Abre `src/components/Map/MapContainer.tsx`
2. Busca: `mapboxToken`
3. Reemplaza con tu token

O crea un archivo `.env`:
```
VITE_MAPBOX_TOKEN=tu_token_aqui
```

---

## 📊 Tecnologías

- **React 18** + TypeScript
- **Vite** para desarrollo rápido
- **Mapbox GL** para mapas
- **Leaflet** para interacción
- **Zustand** para estado global
- **Canvas API** para animaciones

---

## 🎨 Estructura del Proyecto

```
fallas-react/
├── src/
│   ├── components/         # Componentes React
│   │   ├── Map/           # Mapa principal
│   │   ├── EventMarkers/  # Marcadores de eventos
│   │   ├── Navigation/    # Sistema de navegación
│   │   ├── RouteBuilder/  # Constructor de rutas
│   │   ├── Calendar/      # Calendario temporal
│   │   └── ...
│   ├── services/          # Lógica de negocio
│   ├── config/            # Configuraciones
│   ├── data/              # Datos de fallas
│   └── types/             # TypeScript types
├── public/                # Archivos estáticos
└── package.json           # Dependencias
```

---

## 🐛 Solución de Problemas

### El mapa no carga
**Solución:** Verifica que tienes conexión a internet y el token de Mapbox es válido.

### Puerto 5173 ocupado
```bash
npm run dev -- --port 3000
```

### Errores al instalar
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 🌐 Deploy a Producción

### Netlify (Recomendado)
```bash
npm run build
npx netlify-cli deploy --prod
```

### Vercel
```bash
npx vercel
```

### GitHub Pages
```bash
npm run build
# Sube la carpeta dist/ a GitHub Pages
```

---

## 📝 Notas

- El proyecto usa datos reales de las Fallas 2026
- Todas las animaciones están sincronizadas con el calendario oficial
- La navegación GPS funciona con geolocalización del navegador
- Los datos de fallas pueden actualizarse en `src/data/fallas.ts`

---

## 🎉 ¡Disfruta Explorando las Fallas 2026!

Cualquier pregunta o problema, revisa la documentación en la carpeta de outputs.

**Desarrollado para las Fallas de València** 🎊🔥
