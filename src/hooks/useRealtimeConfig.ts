import { useMemo } from 'react';
import { AppRole } from './useAuth';

interface RealtimeConfig {
  debounceMs: number;
  shouldReceiveAllNotifications: boolean;
}

/**
 * Returns role-based realtime configuration for optimized performance
 * 
 * Throttle strategy:
 * - Operativos (vendedora, bodega_manager, driver): 500ms - necesitan rapidez
 * - Tesorero: 750ms - balance entre rapidez y carga
 * - Admin/Zone Admin: 1000ms - monitoreo, puede esperar
 * - Consultor: 2000ms - solo observación, menor prioridad
 */
export function useRealtimeConfig(role: AppRole | null | undefined): RealtimeConfig {
  return useMemo(() => {
    switch (role) {
      case 'vendedora':
      case 'bodega_manager':
      case 'driver':
        return {
          debounceMs: 500,
          shouldReceiveAllNotifications: false, // Solo sus datos
        };
      
      case 'tesorero':
        return {
          debounceMs: 750,
          shouldReceiveAllNotifications: true, // Ve todos los pagos pendientes
        };
      
      case 'super_admin':
      case 'zone_admin':
        return {
          debounceMs: 1000,
          shouldReceiveAllNotifications: true,
        };
      
      case 'consultor':
        return {
          debounceMs: 2000, // Menor prioridad, solo monitoreo
          shouldReceiveAllNotifications: true,
        };
      
      default:
        return {
          debounceMs: 500,
          shouldReceiveAllNotifications: false,
        };
    }
  }, [role]);
}

/**
 * Get debounce time based on role
 */
export function getDebounceForRole(role: AppRole | null | undefined): number {
  switch (role) {
    case 'vendedora':
    case 'bodega_manager':
    case 'driver':
      return 500;
    case 'tesorero':
      return 750;
    case 'super_admin':
    case 'zone_admin':
      return 1000;
    case 'consultor':
      return 2000;
    default:
      return 500;
  }
}
