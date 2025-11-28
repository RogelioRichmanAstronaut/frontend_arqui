// File: lib/hooks/useCities.ts
// Hook para obtener ciudades disponibles del catálogo
import { useQuery } from '@tanstack/react-query';
import { catalog, type City } from '../api/catalog';

export function useCities() {
  return useQuery({
    queryKey: ['catalog', 'cities'],
    queryFn: () => catalog.getCities(),
    staleTime: 1000 * 60 * 60, // 1 hora (las ciudades no cambian frecuentemente)
  });
}

// Helper para formatear ciudades para dropdowns
export function formatCityForDisplay(city: City): string {
  return `${city.iataCode} - ${city.name}`;
}

// Helper para obtener país de un cityId (CO-BOG → CO)
export function getCountryFromCityId(cityId: string): string {
  return cityId.split('-')[0] || 'CO';
}

// Agrupar ciudades por país
export function groupCitiesByCountry(cities: City[]): Record<string, City[]> {
  return cities.reduce((acc, city) => {
    const country = getCountryFromCityId(city.id);
    if (!acc[country]) {
      acc[country] = [];
    }
    acc[country].push(city);
    return acc;
  }, {} as Record<string, City[]>);
}

// Nombres de países
export const COUNTRY_NAMES: Record<string, string> = {
  'CO': 'Colombia',
  'US': 'Estados Unidos',
  'ES': 'España',
  'MX': 'México',
  'BR': 'Brasil',
  'AR': 'Argentina',
  'PE': 'Perú',
  'CL': 'Chile',
  'PA': 'Panamá',
};



