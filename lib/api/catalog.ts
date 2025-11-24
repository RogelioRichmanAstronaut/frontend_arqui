// File: lib/api/catalog.ts
import { apiClient } from './client';
import type { CityDto } from '../types/api';

export const catalog = {
  getCities: () => apiClient<CityDto[]>('/catalog/cities', { method: 'GET' }),
};
