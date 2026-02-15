# 🎬 Guía Visual de Animaciones - Fallas València 2026

## 📅 Calendario de Eventos con Animaciones

```
┌─────────────────────────────────────────────────────────────┐
│                    MARZO 2026                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  14 MAR - PLANTÀ                                           │
│  ┌────────────────────────────────┐                        │
│  │ 🎨 Montaje de las Fallas       │                        │
│  │ Todo el día                    │                        │
│  │ Sin animaciones especiales     │                        │
│  └────────────────────────────────┘                        │
│                                                             │
│  15 MAR - OFRENDA (DÍA 1)                                  │
│  ┌────────────────────────────────┐                        │
│  │ 🌸 16:00 → Empieza Ofrenda     │                        │
│  │ 👑 Virgen con 0% flores        │                        │
│  │ 👥 Comisiones caminando        │                        │
│  │                                │                        │
│  │ 19:00 → 42% flores             │                        │
│  │ 23:00 → 100% flores            │                        │
│  └────────────────────────────────┘                        │
│                                                             │
│  16 MAR - OFRENDA (DÍA 2)                                  │
│  ┌────────────────────────────────┐                        │
│  │ 🌸 Continuación de la Ofrenda  │                        │
│  │ Misma mecánica que día 15      │                        │
│  └────────────────────────────────┘                        │
│                                                             │
│  17 MAR - MASCLETÀ Y OFRENDA                               │
│  ┌────────────────────────────────┐                        │
│  │ 14:00 → 💥 MASCLETÀ            │                        │
│  │ Plaza del Ayuntamiento         │                        │
│  │ 12 explosiones consecutivas    │                        │
│  │                                │                        │
│  │ 16:00-23:00 → 🌸 Ofrenda       │                        │
│  └────────────────────────────────┘                        │
│                                                             │
│  18 MAR - CABALGATA DEL FUEGO                              │
│  ┌────────────────────────────────┐                        │
│  │ 20:00 → 🔥 NIT DEL FOC         │                        │
│  │ Calle Paz → Porta de la Mar    │                        │
│  │ 4 demonios moviéndose          │                        │
│  │ Recorrido en loop infinito     │                        │
│  └────────────────────────────────┘                        │
│                                                             │
│  19 MAR - LA CREMÀ                                         │
│  ┌────────────────────────────────┐                        │
│  │ 22:00 → 🔥 CREMÀ               │                        │
│  │ Todas las fallas ardiendo      │                        │
│  │ Efectos: fuego, humo, chispas  │                        │
│  │ Secuencia de 5 fallas          │                        │
│  └────────────────────────────────┘                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔥 1. Cabalgata del Fuego

### Visualización

```
Calle de la Paz              Porta de la Mar
      ↓                            ↓
    [🔥]─────────────────────────→ ●
      ╲                           ╱
       ╲   [🔥]                  ╱
        ╲    ╲                  ╱
         ╲    ╲  [🔥]          ╱
          ╲    ╲   ╲          ╱
           ╲    ╲   ╲  [🔥]  ╱
            ╲    ╲   ╲   ╲  ╱
             ╲────●───●───●
         Plaza Ayuntamiento

Leyenda:
🔥 = Demonio de fuego (4 en total)
● = Puntos del recorrido
→ = Dirección del movimiento
```

### Timeline

```
0s     🔥 ────────────────────
1.5s      🔥 ────────────────
3s           🔥 ────────────
4.5s            🔥 ────────
       |    |    |    |    |
       0    5   10   15   20s

Loop: Al llegar al final, vuelven al inicio
```

---

## 🌸 2. Ofrenda de Flores

### Progreso Visual

```
        👑
      ┌─────┐
      │     │     ← Virgen (siempre visible)
      │     │
      └──┬──┘
         │
    ┌────┴────┐
    │ FLORES  │  ← Manto que crece
    │ 0-100%  │
    └─────────┘

16:00h     17:00h     19:00h     21:00h     23:00h
  0%        14%        42%        71%        100%

┌────┐    ┌────┐    ┌────┐    ┌────┐    ┌────┐
│    │    │▓   │    │▓▓▓ │    │▓▓▓▓│    │▓▓▓▓│
│    │    │    │    │▓   │    │▓▓▓ │    │▓▓▓▓│
│    │    │    │    │    │    │▓   │    │▓▓▓▓│
└────┘    └────┘    └────┘    └────┘    └────┘
```

### Comisiones Falleras

```
Punto A          Punto B          Punto C
  👥🌸              👥🌸              👥🌸
   ╲                │                ╱
    ╲               │               ╱
     ╲              │              ╱
      ╲             │             ╱
       ╲            │            ╱
        ╲           │           ╱
         ╲          │          ╱
          ╲         │         ╱
           ╲        │        ╱
            ╲       │       ╱
             ╲      │      ╱
              ╲     │     ╱
               ╲    │    ╱
                ╲   │   ╱
                 ╲  │  ╱
                  ╲ │ ╱
                   👑
              Plaza Virgen

Duración: ~5 segundos por comisión
Frecuencia: Una cada 2 segundos
```

---

## 💥 3. Mascletà

### Patrón de Explosiones

```
Plaza del Ayuntamiento
       (39.4699, -0.3763)

  💥        💥        💥
      💥        💥
          🏛️
      💥        💥
  💥        💥        💥

Secuencia:
💥 → 400ms → 💥 → 400ms → 💥 ...

Total: 12 explosiones en ~5 segundos

Cada explosión:
  0ms   → Scale: 0    Opacity: 1
  600ms → Scale: 1.5  Opacity: 0.9
  1200ms→ Scale: 2.5  Opacity: 0  (desaparece)
```

### Área de Impacto

```
       Radio de explosiones: ±150m

    ╔═════════════════════════╗
    ║     ┌───────────┐      ║
    ║     │           │      ║
    ║  💥 │   PLAZA   │ 💥   ║
    ║     │     🏛️     │      ║
    ║  💥 │ AYUNTAMIENTO│ 💥  ║
    ║     │           │      ║
    ║     └───────────┘      ║
    ╚═════════════════════════╝

Posiciones: Aleatorias dentro del área
```

---

## 🔥 4. Cremà

### Secuencia de Quema

```
Tiempo  Falla                          Estado
───────────────────────────────────────────────
 0s     Plaza Ayuntamiento            🔥💨✨
 2s     Convento Jerusalén            🔥💨✨
 4s     Sueca-Literato Azorín         🔥💨✨
 6s     Na Jordana                    🔥💨✨
 8s     Mercado Central               🔥💨✨

Todas continúan ardiendo simultáneamente
```

### Efectos por Falla

```
        ✨ Chispas
         ↑
    💨 Humo elevándose
     ↑
    🔥 Llamas parpadeando
     ↓
   ┌─────┐
   │     │  Estructura de la falla
   │     │
   └─────┘

Animaciones:
- Fuego: Flicker 0.6s (parpadeo)
- Humo: Rise 2.5s (elevación)
- Chispas: Sparkle 1s (destello)
```

### Mapa de Ubicaciones

```
           Na Jordana
              🔥
              │
    Convento  │   Sueca
    Jerusalén │   Literato
       🔥─────┼─────🔥
              │
         Plaza│  Mercado
    Ayuntamiento Central
         🔥   │    🔥
              │
       Valencia (Centro)
```

---

## 🎮 Controles Interactivos

### Calendario

```
┌──────────────────────┐
│ 📅 CALENDARIO        │
├──────────────────────┤
│                      │
│ ┌────┐               │
│ │15MAR│ [Selector▼]  │
│ └────┘               │
│                      │
│ HORA                 │
│ ├─────●──────┤       │
│ 0h        23h        │
│                      │
│ ⏰ 12:00             │
│                      │
│ 🌸 Ofrenda activa    │
│                      │
└──────────────────────┘

Interacción:
1. Seleccionar día → Cambia evento
2. Mover slider → Actualiza hora
3. Animación se activa automáticamente
```

---

## 🔍 Detalles Técnicos

### Estados de Animación

```
┌─────────────────────────────────┐
│ Día: 18 MAR | Hora: 19:00       │  ← Sin animación
├─────────────────────────────────┤
│ Día: 18 MAR | Hora: 20:00       │  ← Cabalgata ACTIVA
├─────────────────────────────────┤
│ Día: 17 MAR | Hora: 14:00       │  ← Mascletà ACTIVA
├─────────────────────────────────┤
│ Día: 15 MAR | Hora: 18:00       │  ← Ofrenda 28%
└─────────────────────────────────┘
```

### Limpieza de Animaciones

```
Cambio de Día/Hora
       ↓
   Clear All
       ↓
┌──────────────┐
│ • Markers    │ → removeLayer()
│ • Polylines  │ → removeLayer()
│ • Intervals  │ → clearInterval()
└──────────────┘
       ↓
 Nuevas Animaciones
```

---

## 📱 Responsive

### Desktop (>768px)

```
┌───────────────────────────────────────┐
│ HEADER                                │
├──────┬────────────────────────┬───────┤
│Route │                        │ Falla │
│Build │        MAPA            │ Panel │
│      │      + ANIMACIONES     │       │
│      │                        │       │
├──────┴────────────────────────┴───────┤
│ Calendario                            │
│  ⊙ + - 📋                             │
└───────────────────────────────────────┘
```

### Mobile (<768px)

```
┌──────────────┐
│   HEADER     │
├──────────────┤
│              │
│    MAPA      │
│     +        │
│ ANIMACIONES  │
│              │
├──────────────┤
│  Calendario  │
│   📋 ⊙ +-    │
└──────────────┘

Panels: Fullscreen overlay
```

---

## 🎯 Testing Rápido

### Checklist de Verificación

```
□ Día 18, Hora 20:00 → Cabalgata visible
□ Día 15, Hora 16:00 → Ofrenda 0%
□ Día 15, Hora 23:00 → Ofrenda 100%
□ Día 17, Hora 14:00 → Explosiones visibles
□ Día 19, Hora 22:00 → Fallas ardiendo
□ Cambiar hora → Animaciones se actualizan
□ Cambiar día → Animaciones se limpian
□ Performance → 60fps constante
```

---

## 💡 Tips de Uso

1. **Mejor experiencia:** Pantalla completa (F11)
2. **Explorar:** Cambiar día y hora para ver diferentes animaciones
3. **Combinar:** Crear rutas mientras hay animaciones activas
4. **Zoom:** Acercarse para ver mejor los detalles

---

**¡Disfruta explorando las Fallas de València!** 🎊
