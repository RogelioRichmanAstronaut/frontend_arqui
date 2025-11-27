// File: lib/hooks/useCatalog.ts
import { useQuery } from '@tanstack/react-query';
import { catalog, type City } from '../api/catalog';

export function useCatalogCities() {
  return useQuery<City[], Error>({
    queryKey: ['catalog', 'cities'],
    queryFn: () => catalog.getCities(),
    staleTime: 1000 * 60 * 60, // 1 hora (las ciudades no cambian frecuentemente)
  });
}
