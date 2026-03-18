// src/data/events.ts

export interface EventData {
  name: string;
  time: string;
  description: string;
  animation: string;
}

export const eventsData: Record<number, EventData> = {
  22: { name: "Despertà, Crida y Exposición del Ninot", time: "07:00 / 19:30", description: "💥 Despertà Infantil (07:00) - Macrodespertà (07:30) - 🏰 Crida en Torres de Serranos (19:30) - 🎨 Exposición del Ninot (10:00-20:00)", animation: "desperta" },
  28: { name: "Cabalgata del Ninot + Pólvora a la Vespra", time: "17:30-21:00", description: "🎭 Cabalgata del Ninot (17:30-20:00, 2.5h) - 🎆 Pólvora a la Vespra (20:00, 20:30, 21:00)", animation: "cabalgata" },
  1:  { name: "Mascletà", time: "14:00", description: "💥 Mascletà diaria en Plaza del Ayuntamiento", animation: "mascletà" },
  2:  { name: "Mascletà", time: "14:00", description: "💥 Mascletà diaria en Plaza del Ayuntamiento", animation: "mascletà" },
  3:  { name: "Mascletà", time: "14:00", description: "💥 Mascletà diaria en Plaza del Ayuntamiento", animation: "mascletà" },
  4:  { name: "Mascletà", time: "14:00", description: "💥 Mascletà diaria en Plaza del Ayuntamiento", animation: "mascletà" },
  5:  { name: "Mascletà", time: "14:00", description: "💥 Mascletà diaria en Plaza del Ayuntamiento", animation: "mascletà" },
  6:  { name: "Mascletà", time: "14:00", description: "💥 Mascletà diaria en Plaza del Ayuntamiento", animation: "mascletà" },
  7:  { name: "Mascletà, Pólvora y Calles Iluminadas", time: "14:00 / 20:00", description: "💥 Mascletà (14:00) - 🎆 Pólvora (20:00, IVAM) - 💡 Inicio Concurso Calles Iluminadas", animation: "mascletà" },
  8:  { name: "San Juan de Dios + Calles Iluminadas", time: "10:00 / 20:00", description: "🚒 Festividad del patrón de los bomberos - 💥 Mascletà (14:00) - 💡 Calles Iluminadas (20:00-23:00)", animation: "mascletà" },
  9:  { name: "Mascletà + Calles Iluminadas", time: "14:00 / 20:00", description: "💥 Mascletà diaria (14:00) - 💡 Calles Iluminadas (20:00-23:00)", animation: "mascletà" },
  10: { name: "Mascletà + Calles Iluminadas", time: "14:00 / 20:00", description: "💥 Mascletà diaria (14:00) - 💡 Calles Iluminadas (20:00-23:00)", animation: "mascletà" },
  11: { name: "Mascletà + Calles Iluminadas", time: "14:00 / 20:00", description: "💥 Mascletà diaria (14:00) - 💡 Calles Iluminadas (20:00-23:00)", animation: "mascletà" },
  12: { name: "Mascletà + Calles Iluminadas", time: "14:00 / 20:00", description: "💥 Mascletà diaria (14:00) - 💡 Calles Iluminadas (20:00-23:00)", animation: "mascletà" },
  13: { name: "Mascletà, Bailes y Calles Iluminadas", time: "14:00 / 20:00", description: "💥 Mascletà (14:00) - 💃 Muestra de bailes (20:00) - 💡 Calles Iluminadas (20:00-23:00)", animation: "mascletà" },
  14: { name: "Exposición del Ninot + Calles Iluminadas", time: "14:00 / 20:00", description: "💥 Mascletà (14:00) - 🏆 Proclamación Ninot Indultat Infantil (17:00) - 💡 Calles Iluminadas", animation: "mascletà" },
  15: { name: "Plantà Infantiles, L'Alba y Calles Iluminadas", time: "09:00 / 23:59", description: "🏗️ Plantà infantiles (09:00) - 💡 Calles Iluminadas (20:00-23:00) - 🎆 L'Alba (23:59)", animation: "mascletà" },
  16: { name: "Plantà Grandes, Castillo y Calles Iluminadas", time: "08:00 / 23:59", description: "🏗️ Plantà grandes (08:00) - 💡 Calles Iluminadas (20:00-23:00) - 🎆 Castillo (23:59)", animation: "mascletà" },
  17: { name: "Ofrenda (Día 1) + Calles Iluminadas", time: "15:30-01:00", description: "🌸 Ofrenda a la Virgen - 💡 Calles Iluminadas (20:00-23:00)", animation: "ofrenda" },
  18: { name: "Ofrenda (Día 2), Nit del Foc y Calles Iluminadas", time: "15:30 / 23:59", description: "🌸 Ofrenda (15:30-01:00) - 💡 Calles Iluminadas (20:00-23:00) - 🎇 Nit del Foc (23:59)", animation: "ofrenda" },
  19: { name: "La Cremà + Calles Iluminadas (Último Día)", time: "19:00-23:00", description: "🔥 Cabalgata del Fuego (19:00-20:00) - 💡 Calles Iluminadas - Cremà Infantiles (20:00) - Cremà Grandes (22:00)", animation: "cremà" }
};
