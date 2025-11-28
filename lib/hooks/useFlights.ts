import { useQuery } from '@tanstack/react-query';
import { bookings } from '../api/bookings';
import { catalog, type City } from '../api/catalog';
import type { AirSearchRequest } from '../api/bookings';

export type AirlineSearchRequest = {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  classType?: 'ECONOMY' | 'BUSINESS' | 'FIRST';
};

export type FlightResult = {
  flightId: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  classes: Array<{
    classId: string;
    className: string;
    price: number;
    available: boolean;
  }>;
};

// Construir mapeos dinámicos desde el catálogo de ciudades
function buildCityMaps(cities: City[]): { iataMap: Record<string, string>; nameMap: Record<string, string> } {
  const iataMap: Record<string, string> = {};
  const nameMap: Record<string, string> = {};

  for (const city of cities) {
    // Mapeo IATA → CityID (ej: "MAD" → "ES-MAD")
    if (city.iataCode) {
      iataMap[city.iataCode.toUpperCase()] = city.id;
    }
    // Mapeo nombre → CityID (ej: "madrid" → "ES-MAD")
    if (city.name) {
      nameMap[city.name.toLowerCase()] = city.id;
      // También sin acentos
      const normalized = city.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      nameMap[normalized] = city.id;
    }
  }

  return { iataMap, nameMap };
}

/**
 * Normalizar input a CityID ISO 3166-2 (XX-YYY) usando el catálogo dinámico
 * 
 * Soporta múltiples formatos:
 *   - CityID completo: "ES-MAD" → "ES-MAD"
 *   - Solo código IATA: "BOG" → "CO-BOG"
 *   - Con display: "MAD - Madrid" → "ES-MAD"
 *   - Nombre de ciudad: "Madrid" → "ES-MAD"
 */
function normalizeToCityId(
  input: string,
  iataMap: Record<string, string>,
  nameMap: Record<string, string>
): string {
  if (!input) return 'CO-BOG';
  
  const cleaned = input.trim();
  
  // Caso 1: Ya es CityID válido (XX-YYY)
  if (cleaned.match(/^[A-Z]{2}-[A-Z]{2,4}$/i)) {
    return cleaned.toUpperCase();
  }
  
  // Caso 2: Solo código IATA de 3 letras
  if (cleaned.match(/^[A-Z]{3}$/i)) {
    const iata = cleaned.toUpperCase();
    return iataMap[iata] || `CO-${iata}`;
  }
  
  // Caso 3: Código IATA con nombre "BOG - Bogotá" o "MAD - Madrid"
  const codeWithName = cleaned.match(/^([A-Z]{3})\s*-\s*(.+)/i);
  if (codeWithName) {
    const iata = codeWithName[1].toUpperCase();
    return iataMap[iata] || `CO-${iata}`;
  }
  
  // Caso 4: Buscar nombre de ciudad completo
  const textForSearch = cleaned
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/,.*$/, '') // Remover después de coma
    .trim();
  
  if (nameMap[textForSearch]) {
    return nameMap[textForSearch];
  }
  
  // Fallback: Bogotá
  console.warn(`[normalizeToCityId] No se pudo normalizar: "${input}", usando CO-BOG`);
  return 'CO-BOG';
}

export function useFlightSearch(params: AirlineSearchRequest, enabled: boolean = false) {
  return useQuery({
    queryKey: ['flights', 'search', params],
    queryFn: async () => {
      // Obtener catálogo de ciudades para mapeo dinámico
      const cities = await catalog.getCities();
      const { iataMap, nameMap } = buildCityMaps(cities);

      // Normalizar a CityID ISO 3166-2 (ej: ES-MAD, CO-BOG)
      const originCityId = normalizeToCityId(params.origin, iataMap, nameMap);
      const destCityId = normalizeToCityId(params.destination, iataMap, nameMap);
      
      // Validar que origen y destino sean diferentes
      if (originCityId === destCityId) {
        throw new Error('El origen y destino no pueden ser la misma ciudad');
      }
      
      // Convertir fechas a formato YYYY-MM-DD (el backend no acepta ISO completo)
      const formatDate = (date?: string): string | undefined => {
        if (!date) return undefined;
        // Si tiene 'T', extraer solo la fecha
        if (date.includes('T')) {
          return date.split('T')[0];
        }
        return date;
      };

      const backendParams: AirSearchRequest = {
        originCityId,      // Ya es ISO 3166-2: ES-MAD, CO-BOG, etc.
        destinationCityId: destCityId,
        departureAt: formatDate(params.departureDate),
        returnAt: formatDate(params.returnDate),
        passengers: params.passengers,
        cabin: params.classType === 'BUSINESS' || params.classType === 'FIRST' ? 'EJECUTIVA' : 'ECONOMICA',
      };

      const response = await bookings.air.search(backendParams);

      // Transformar respuesta del backend al formato que espera el frontend
      const flights: FlightResult[] = (response.flights || []).map((flight) => {
        // Extraer código de ciudad (CO-BOG -> BOG)
        const originCode = flight.originCityId.split('-').pop() || flight.originCityId;
        const destCode = flight.destinationCityId.split('-').pop() || flight.destinationCityId;
        
        // Extraer hora de las fechas ISO
        const departsAt = new Date(flight.departsAt);
        const arrivesAt = new Date(flight.arrivesAt);
        const departureTime = departsAt.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false });
        const arrivalTime = arrivesAt.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false });

        return {
          flightId: flight.flightId,
          airline: flight.airline,
          origin: originCode,
          destination: destCode,
          departureTime,
          arrivalTime,
          duration: flight.duration,
          classes: [
            {
              classId: `${flight.flightId}-${flight.fare}`,
              className: flight.fare === 'EJECUTIVA' ? 'Ejecutiva' : 'Económica',
              price: flight.price,
              available: true,
            },
          ],
        };
      });

      return flights;
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
