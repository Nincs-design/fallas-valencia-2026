import type { Falla } from '@/types'

// Mock data - Reemplazar con tus 702 fallas reales
export const fallas: Falla[] = [
  {
    id: 1,
    name: "Falla Plaza del Ayuntamiento",
    lat: 39.4699,
    lng: -0.3763,
    category: "Municipal",
    type: "grande",
    theme: "València, capital mundial del diseño 2022",
    facts: "La falla municipal es la más grande y espectacular de todas",
    artist: "Manolo Martín",
    address: "Plaza del Ayuntamiento",
  },
  {
    id: 2,
    name: "Falla Convento Jerusalén",
    lat: 39.4745,
    lng: -0.3780,
    category: "Especial",
    type: "grande",
    theme: "El temps de les Falles",
    facts: "Una de las fallas más tradicionales de València",
    artist: "Alejandro Santaeulalia",
    address: "Convento Jerusalén",
  },
  {
    id: 3,
    name: "Falla Sueca-Literato Azorín",
    lat: 39.4650,
    lng: -0.3700,
    category: "Especial",
    type: "grande",
    theme: "Somnis de paper",
    facts: "Reconocida por sus monumentos innovadores",
    artist: "Paco Roca",
    address: "Sueca - Literato Azorín",
  },
]
