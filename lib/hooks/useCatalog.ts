// File: lib/hooks/useCatalog.ts
import { useQuery } from '@tanstack/react-query';
import { catalog } from '../api/catalog';
import type { CityDto } from '../types/api';

export function useCatalogCities() {
  return useQuery<CityDto[], Error>({
    queryKey: ['catalog', 'cities'],
    queryFn: () => catalog.getCities(),
  });
}
