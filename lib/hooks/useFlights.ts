import { useQuery } from '@tanstack/react-query';
import { bookings } from '../api/bookings';
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

// Mapeo de nombres de ciudad a códigos IATA
const CITY_TO_IATA: Record<string, string> = {
  'bogota': 'BOG', 'bogotá': 'BOG',
  'medellin': 'MDE', 'medellín': 'MDE',
  'cali': 'CLO',
  'barranquilla': 'BAQ',
  'cartagena': 'CTG',
  'santa marta': 'SMR',
  'bucaramanga': 'BGA',
  'pereira': 'PEI',
  'cucuta': 'CUC', 'cúcuta': 'CUC',
  'manizales': 'MZL',
  'armenia': 'AXM',
  'pasto': 'PSO',
  'monteria': 'MTR', 'montería': 'MTR',
  'neiva': 'NVA',
  'villavicencio': 'VVC',
  'ibague': 'IBE', 'ibagué': 'IBE',
  'valledupar': 'VUP',
  'riohacha': 'RCH',
  'quibdo': 'UIB', 'quibdó': 'UIB',
  'leticia': 'LET',
  'san andres': 'ADZ', 'san andrés': 'ADZ',
};

// Extraer código IATA limpio de diferentes formatos
// "BOG" → "BOG"
// "CO-BOG" → "BOG"  
// "BOG - Bogotá" → "BOG"
// "CO-BOG - Bogotá" → "BOG"
// "Bogotá, Colombia" → "BOG"
// "CO-Bogotá, Colombia" → "BOG"
function extractCityCode(input: string): string {
  if (!input) return 'BOG';
  
  const cleaned = input.trim();
  
  // Caso 1: Ya es código ISO completo exacto (CO-BOG)
  const isoMatch = cleaned.match(/^CO-([A-Z]{3})(?:\s|$|-)/i);
  if (isoMatch) {
    return isoMatch[1].toUpperCase();
  }
  
  // Caso 2: Solo código IATA (BOG, MDE, etc.)
  if (cleaned.match(/^[A-Z]{3}$/i)) {
    return cleaned.toUpperCase();
  }
  
  // Caso 3: Código con nombre "BOG - Bogotá"
  const codeWithName = cleaned.match(/^([A-Z]{3})\s*-/i);
  if (codeWithName) {
    return codeWithName[1].toUpperCase();
  }
  
  // Caso 4: Buscar nombre de ciudad en el texto
  // Limpiar: remover "CO-", comas, y palabras extra
  const textForSearch = cleaned
    .replace(/^CO-/i, '')
    .split(',')[0]
    .split('-')[0]
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Remover acentos
  
  // Buscar en el mapeo
  for (const [cityName, code] of Object.entries(CITY_TO_IATA)) {
    const normalizedCity = cityName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (textForSearch.includes(normalizedCity) || normalizedCity.includes(textForSearch)) {
      return code;
    }
  }
  
  // Fallback: BOG
  console.warn(`[extractCityCode] No se pudo extraer código de: "${input}", usando BOG`);
  return 'BOG';
}

export function useFlightSearch(params: AirlineSearchRequest, enabled: boolean = false) {
  return useQuery({
    queryKey: ['flights', 'search', params],
    queryFn: async () => {
      // Extraer códigos limpios y construir formato ISO 3166-2
      const originCode = extractCityCode(params.origin);
      const destCode = extractCityCode(params.destination);
      
      // Validar que origen y destino sean diferentes
      if (originCode === destCode) {
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
        originCityId: `CO-${originCode}`,
        destinationCityId: `CO-${destCode}`,
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
