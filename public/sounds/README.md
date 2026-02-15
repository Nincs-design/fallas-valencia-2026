# 🔊 Carpeta de Sonidos para Eventos de Fallas

Esta carpeta contiene los archivos de audio que se reproducirán automáticamente durante los eventos especiales en el mapa.

---

## 📁 Nomenclatura de Archivos

Coloca tus archivos de sonido en esta carpeta con los siguientes nombres exactos:

### Eventos Principales:

1. **`mascleta.mp3`** / **`mascleta.ogg`** / **`mascleta.wav`**
   - **Evento:** Mascletà diaria (1-19 Marzo, 14:00h)
   - **Duración recomendada:** 5-10 segundos
   - **Tipo:** Explosiones rítmicas, petardos
   - **Volumen:** 70% (predeterminado)
   - **Loop:** No

2. **`desperta.mp3`** / **`desperta.ogg`** / **`desperta.wav`**
   - **Evento:** Despertà (22 Febrero, 07:00h)
   - **Duración recomendada:** 5-8 segundos
   - **Tipo:** Petardos, cohetes matutinos
   - **Volumen:** 70%
   - **Loop:** No

3. **`cabalgata-ninot.mp3`** / **`cabalgata-ninot.ogg`** / **`cabalgata-ninot.wav`**
   - **Evento:** Cabalgata del Ninot (28 Febrero, 17:30-20:00h)
   - **Duración recomendada:** 20-30 segundos (loop)
   - **Tipo:** Música festiva, alegre, tradicional valenciana
   - **Volumen:** 60%
   - **Loop:** Sí (mientras dura la cabalgata)

4. **`cabalgata-fuego.mp3`** / **`cabalgata-fuego.ogg`** / **`cabalgata-fuego.wav`**
   - **Evento:** Cabalgata del Fuego (19 Marzo, 19:00-20:00h)
   - **Duración recomendada:** 20-30 segundos (loop)
   - **Tipo:** Música dramática, fuego, tambores
   - **Volumen:** 70%
   - **Loop:** Sí

5. **`ofrenda.mp3`** / **`ofrenda.ogg`** / **`ofrenda.wav`**
   - **Evento:** Ofrenda a la Virgen (17-18 Marzo, 15:30-01:00h)
   - **Duración recomendada:** 30-60 segundos (loop)
   - **Tipo:** Música emotiva, tradicional, "Valencia" u otros pasodobles
   - **Volumen:** 60%
   - **Loop:** Sí (opcional)

6. **`crema.mp3`** / **`crema.ogg`** / **`crema.wav`**
   - **Evento:** Cremà (19 Marzo, 20:00/22:00h)
   - **Duración recomendada:** 10-15 segundos
   - **Tipo:** Fuego ardiendo, explosiones suaves
   - **Volumen:** 70%
   - **Loop:** Sí (opcional)

### Eventos Pirotécnicos:

7. **`nit-del-foc.mp3`** / **`nit-del-foc.ogg`** / **`nit-del-foc.wav`**
   - **Evento:** Nit del Foc (18 Marzo, 23:59h)
   - **Duración recomendada:** 15-20 segundos
   - **Tipo:** Fuegos artificiales espectaculares
   - **Volumen:** 80%
   - **Loop:** No

8. **`castillo.mp3`** / **`castillo.ogg`** / **`castillo.wav`**
   - **Evento:** Castillo de Fuegos (16-17 Marzo, 23:59h)
   - **Duración recomendada:** 10-15 segundos
   - **Tipo:** Fuegos artificiales, cohetes
   - **Volumen:** 75%
   - **Loop:** No

9. **`polvora.mp3`** / **`polvora.ogg`** / **`polvora.wav`**
   - **Evento:** Pólvora a la Vespra (28 Feb y 7 Marzo, 20:00-21:00h)
   - **Duración recomendada:** 8-12 segundos
   - **Tipo:** Fuegos artificiales cortos
   - **Volumen:** 70%
   - **Loop:** No

10. **`l-alba.mp3`** / **`l-alba.ogg`** / **`l-alba.wav`**
    - **Evento:** L'Alba de las Fallas (15 Marzo, 23:59h)
    - **Duración recomendada:** 10-15 segundos
    - **Tipo:** Fuegos artificiales al amanecer
    - **Volumen:** 75%
    - **Loop:** No

### Eventos Ceremoniales:

11. **`crida.mp3`** / **`crida.ogg`** / **`crida.wav`**
    - **Evento:** Crida (22 Febrero, 19:30h)
    - **Duración recomendada:** 5-10 segundos
    - **Tipo:** Proclamación, ambiente ceremonial
    - **Volumen:** 70%
    - **Loop:** No

12. **`ambient.mp3`** / **`ambient.ogg`** / **`ambient.wav`**
    - **Evento:** Ambiente general (opcional, todo el día)
    - **Duración recomendada:** 30-60 segundos (loop)
    - **Tipo:** Música ambiente valenciana suave
    - **Volumen:** 40%
    - **Loop:** Sí

---

## 🎵 Formatos Soportados

El sistema intentará cargar los archivos en este orden de prioridad:

1. **MP3** (`.mp3`) - Más compatible, tamaño medio
2. **OGG** (`.ogg`) - Buena calidad, buen tamaño
3. **WAV** (`.wav`) - Máxima calidad, archivos grandes

**Recomendación:** Proporciona al menos el formato MP3 para máxima compatibilidad.

---

## 📊 Especificaciones Técnicas Recomendadas

```
Formato: MP3 o OGG
Bitrate: 128-192 kbps
Sample Rate: 44.1 kHz
Canales: Estéreo o Mono
Tamaño máximo: 5 MB por archivo
Duración:
  - Efectos cortos: 5-15 segundos
  - Loops: 20-60 segundos
  - Eventos largos: hasta 2 minutos
```

---

## 🔧 Cómo Funciona

1. **Detección automática:** El sistema detecta qué archivos existen en esta carpeta
2. **Prioridad de formatos:** Intenta cargar MP3 primero, luego OGG, luego WAV
3. **Reproducción automática:** Cuando un evento se activa en el calendario, su sonido se reproduce
4. **Control de usuario:** Los usuarios pueden activar/desactivar el audio y ajustar el volumen
5. **Loop inteligente:** Algunos sonidos (cabalgatas, ofrenda) se repiten mientras dura el evento
6. **Fade out:** Al cambiar de evento, los sonidos se desvanecen suavemente

---

## 🎯 Ejemplo de Estructura de Carpeta

```
public/sounds/
├── mascleta.mp3           ✅ Requerido
├── desperta.mp3           ✅ Requerido
├── cabalgata-ninot.mp3    ✅ Requerido
├── cabalgata-fuego.mp3    ✅ Requerido
├── ofrenda.mp3            ✅ Requerido
├── crema.mp3              ✅ Requerido
├── nit-del-foc.mp3        ⭐ Importante
├── castillo.mp3           ⭐ Importante
├── polvora.mp3            ⭐ Importante
├── l-alba.mp3             ⭐ Importante
├── crida.mp3              ○ Opcional
└── ambient.mp3            ○ Opcional
```

---

## 💡 Consejos para Seleccionar Sonidos

### Mascletà:
- Busca: "mascletà sound effect", "fireworks rhythm"
- Características: Explosiones rítmicas y potentes
- Ejemplo: Grabación real de mascletà en Plaza del Ayuntamiento

### Cabalgatas:
- Busca: "pasodoble valenciano", "música festiva valencia"
- Características: Alegre, festivo, tradicional
- Sugerencias:
  - Ninot: "Valencia" (pasodoble), música alegre
  - Fuego: Música más dramática, con tambores

### Ofrenda:
- Busca: "ofrenda virgen música", "pasodoble emotivo"
- Características: Emotivo, tradicional
- Sugerencias: "Valencia", "Paquito el Chocolatero", otros pasodobles

### Cremà:
- Busca: "fire burning sound", "bonfire crackling"
- Características: Fuego ardiendo, crepitar
- Puede incluir: Explosiones suaves, multitud

### Fuegos Artificiales:
- Busca: "fireworks sound effect", "castle fireworks"
- Características: Silbidos, explosiones, cohetes
- Variedad: Diferentes intensidades para cada tipo

---

## 🚫 Archivos que NO Funcionarán

❌ **Nombres incorrectos:**
- `Mascletà.mp3` (mayúscula incorrecta)
- `cabalgata ninot.mp3` (espacio en lugar de guión)
- `crema-falla.mp3` (nombre diferente)

❌ **Formatos no soportados:**
- `.aac`, `.m4a`, `.flac`, `.wma`

❌ **Ubicación incorrecta:**
- `/src/sounds/` (debe estar en `/public/sounds/`)
- `/public/audio/` (nombre de carpeta diferente)

---

## 🎛️ Control de Usuario

Los usuarios pueden:
- ✅ Activar/desactivar todos los sonidos
- ✅ Ajustar el volumen maestro (0-100%)
- ✅ Los ajustes se guardan automáticamente
- ✅ Botón flotante en la esquina inferior derecha
- ✅ Panel expandible con controles

**Ubicación del control:** Esquina inferior derecha del mapa (botón 🔊)

---

## 📝 Notas Adicionales

1. **Sin archivos = Sin sonido:** Si no hay archivos, la app funciona normalmente pero sin audio
2. **Archivos parciales:** Puedes subir solo algunos archivos, no es necesario tener todos
3. **Actualización en caliente:** Puedes añadir archivos mientras la app está corriendo
4. **Rendimiento:** Los archivos se cargan bajo demanda, no todos a la vez
5. **Móvil:** Los sonidos funcionan en móvil, pero requieren interacción del usuario primero (limitación del navegador)

---

## 🎨 Recursos Gratuitos para Sonidos

### Sitios Web Recomendados:
- **Freesound.org** - Efectos de sonido de la comunidad
- **Zapsplat.com** - Efectos gratuitos de calidad
- **YouTube Audio Library** - Música y efectos libres
- **BBC Sound Effects** - Biblioteca de efectos profesionales
- **Incompetech.com** - Música libre de Kevin MacLeod

### Buscar en YouTube:
- "Mascletà Valencia" (grabaciones reales)
- "Pasodoble Valencia" (música tradicional)
- "Fireworks sound effect" (efectos pirotécnicos)
- "Fire crackling" (fuego ardiendo)

---

## ✅ Checklist de Implementación

- [ ] Crear carpeta `/public/sounds/`
- [ ] Descargar/grabar sonidos necesarios
- [ ] Renombrar archivos con nomenclatura correcta
- [ ] Colocar archivos en `/public/sounds/`
- [ ] Verificar que los nombres sean exactos (sin mayúsculas, con guiones)
- [ ] Probar en la aplicación
- [ ] Ajustar volúmenes si es necesario
- [ ] ¡Disfrutar de la experiencia inmersiva!

---

**¡Sistema de Audio Listo para Usar!** 🔊✨

Solo sube los archivos con los nombres correctos y el sistema los reproducirá automáticamente.
