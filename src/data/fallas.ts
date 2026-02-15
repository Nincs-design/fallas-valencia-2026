// src/data/fallas.ts
import fallasCompleto from './fallas-completo.json';
import { Falla } from '@/types';

// Convertir los datos del JSON al formato de la app
export const fallasData: Falla[] = fallasCompleto.fallas.map((falla: any) => ({
  id: falla.id,
  name: falla.name,
  lat: falla.lat,
  lng: falla.lng,
  category: getCategoryFromSeccion(falla.category),
  theme: falla.theme,
  facts: generateFacts(falla),
  artist: falla.artist,
  president: falla.president,
  fallera: falla.fallera,
  boceto: falla.boceto,
  fundacion: falla.fundacion,
  distintivo: falla.distintivo,
  type: falla.type
}));

// Obtener solo fallas adultas
export const fallasAdultas = fallasData.filter(f => f.type === 'adulta');

// Obtener solo fallas infantiles
export const fallasInfantiles = fallasData.filter(f => f.type === 'infantil');

// Función helper para categorizar por sección
function getCategoryFromSeccion(seccion: string): Falla['category'] {
  // Las secciones especiales (1A, 1B, etc.) son "Especial"
  if (seccion.startsWith('1')) return 'Especial';
  if (seccion.startsWith('2') || seccion.startsWith('3')) return 'Primera';
  if (seccion.startsWith('4') || seccion.startsWith('5')) return 'Segunda';
  return 'Tercera';
}

// Generar datos curiosos a partir de la información
function generateFacts(falla: any): string {
  const facts = [];
  
  if (falla.fundacion) {
    const edad = 2026 - falla.fundacion;
    facts.push(`Fundada en ${falla.fundacion} (${edad} años)`);
  }
  
  if (falla.artist && falla.artist !== 'Sin artista') {
    facts.push(`Artista: ${falla.artist}`);
  }
  
  if (falla.distintivo) {
    facts.push(`Distintivo: ${falla.distintivo}`);
  }
  
  if (falla.type === 'infantil') {
    facts.push('Falla Infantil');
  }
  
  return facts.map(f => `• ${f}`).join('<br>');
}

// Estadísticas
export const fallasStats = {
  total: fallasCompleto.totalFallas,
  adultas: fallasCompleto.fallasAdultas,
  infantiles: fallasCompleto.fallasInfantiles,
  especiales: fallasData.filter(f => f.category === 'Especial').length,
  primeras: fallasData.filter(f => f.category === 'Primera').length,
  segundas: fallasData.filter(f => f.category === 'Segunda').length,
  terceras: fallasData.filter(f => f.category === 'Tercera').length
};

