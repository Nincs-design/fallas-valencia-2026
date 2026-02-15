// src/services/routeShareService.ts
import { RouteStop } from '@/types';

export class RouteShareService {
  /**
   * Genera una URL compartible con los IDs de las fallas
   */
  static generateShareURL(route: RouteStop[]): string {
    if (route.length === 0) return window.location.origin;

    const ids = route.map(stop => stop.id).join(',');
    const baseUrl = window.location.origin;
    return `${baseUrl}?route=${ids}&optimized=true`;
  }

  /**
   * Genera URL corta para compartir (simulado, idealmente usar bit.ly API)
   */
  static async generateShortURL(route: RouteStop[]): Promise<string> {
    const fullUrl = this.generateShareURL(route);
    
    // En producción, aquí usarías un servicio como bit.ly
    // Por ahora simulamos la URL corta
    const routeHash = this.hashRoute(route);
    return `${window.location.origin}/r/${routeHash}`;
  }

  /**
   * Genera código QR para compartir la ruta
   */
  static generateQRCode(route: RouteStop[]): string {
    const url = this.generateShareURL(route);
    // Usar API de QR Code gratuita
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
  }

  /**
   * Comparte usando Web Share API (móviles)
   */
  static async shareNative(route: RouteStop[], routeName: string = 'Mi ruta de Fallas'): Promise<boolean> {
    if (!navigator.share) {
      return false;
    }

    try {
      const url = this.generateShareURL(route);
      await navigator.share({
        title: routeName,
        text: `Mira mi ruta de ${route.length} fallas en València 2026`,
        url: url
      });
      return true;
    } catch (error) {
      console.error('Error al compartir:', error);
      return false;
    }
  }

  /**
   * Copia URL al portapapeles
   */
  static async copyToClipboard(route: RouteStop[]): Promise<boolean> {
    try {
      const url = this.generateShareURL(route);
      await navigator.clipboard.writeText(url);
      return true;
    } catch (error) {
      console.error('Error al copiar:', error);
      return false;
    }
  }

  /**
   * Parsea IDs de ruta desde URL
   */
  static parseRouteFromURL(): number[] | null {
    const params = new URLSearchParams(window.location.search);
    const routeParam = params.get('route');
    
    if (!routeParam) return null;

    // Validación estricta: solo dígitos y comas, longitud máxima razonable
    if (!/^[\d,]+$/.test(routeParam) || routeParam.length > 500) {
      console.warn('Parámetro de ruta inválido ignorado');
      return null;
    }

    try {
      const ids = routeParam
        .split(',')
        .slice(0, 50) // máximo 50 paradas
        .map(id => parseInt(id.trim(), 10))
        .filter(id => !isNaN(id) && id > 0 && id <= 10000); // IDs en rango válido
      return ids.length > 0 ? ids : null;
    } catch (error) {
      console.error('Error al parsear ruta:', error);
      return null;
    }
  }

  /**
   * Genera hash único para la ruta
   */
  private static hashRoute(route: RouteStop[]): string {
    const ids = route.map(s => s.id).join('-');
    // Simple hash para demo (en producción usar mejor algoritmo)
    let hash = 0;
    for (let i = 0; i < ids.length; i++) {
      const char = ids.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36).substring(0, 8);
  }

  /**
   * Comparte en redes sociales
   */
  static shareToSocial(route: RouteStop[], platform: 'twitter' | 'facebook' | 'whatsapp'): void {
    const url = this.generateShareURL(route);
    const text = `Descubre mi ruta de ${route.length} fallas en València 2026`;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
    }
    
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
  }
}
