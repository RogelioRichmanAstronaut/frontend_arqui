// File: lib/api/catalog.ts
// API para catálogo de ciudades y destinos disponibles
import { apiClient } from './client';

// ============================================
// TIPOS
// ============================================

export interface City {
  id: string;        // CO-BOG (ISO 3166-2)
  name: string;      // Bogotá
  iataCode: string;  // BOG
}

// ============================================
// API DE CATÁLOGO
// ============================================

export const catalog = {
  /**
   * Obtener todas las ciudades disponibles
   * GET /v1/catalog/cities
   */
  getCities: () => apiClient<City[]>('/catalog/cities'),
};
