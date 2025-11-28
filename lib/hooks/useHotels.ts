import { useQuery } from '@tanstack/react-query';
import { bookings } from '../api/bookings';
import { catalog, type City } from '../api/catalog';
import type { HotelSearchRequest as BackendHotelSearchRequest } from '../api/bookings';

export type HotelSearchRequest = {
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children?: number;
  rooms?: number;
};

export type HotelResult = {
  hotelId: string;
  name: string;
  stars: number;
  city: string;
  country: string;
  images: string[];
  amenities: string[];
  rooms: Array<{
    roomId: string;      // UUID de la habitación (para referencia)
    roomCode: string;    // Código de tipo (doble, simple) - ESTO se usa para reservas
    type: string;
    price: number;
    available: boolean;
    includesBreakfast: boolean;
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
    }
  }

  return { iataMap, nameMap };
}

// Extraer código de ciudad del formato "BOG - Bogotá" o "CO-BOG"
function extractCityId(
  destination: string,
  iataMap: Record<string, string>,
  nameMap: Record<string, string>
): string | undefined {
  if (!destination || destination.trim() === '') {
    return undefined; // Sin destino = buscar todos los hoteles
  }
  
  // Si ya es formato ISO (CO-BOG, ES-MAD, US-MIA)
  if (destination.match(/^[A-Z]{2}-[A-Z]{3}$/)) {
    return destination;
  }
  
  // Si es formato "BOG - Bogotá" o "MAD - Madrid" o solo "BOG"
  const iataMatch = destination.match(/^([A-Z]{3})(?:\s*-|$)/i);
  if (iataMatch) {
    const iata = iataMatch[1].toUpperCase();
    // Usar mapeo del catálogo
    return iataMap[iata] || `CO-${iata}`;
  }
  
  // Buscar por nombre de ciudad
  const normalized = destination.toLowerCase().split('-')[0].trim();
  return nameMap[normalized] || undefined;
}

export function useHotelSearch(params: HotelSearchRequest, enabled: boolean = false) {
  return useQuery({
    queryKey: ['hotels', 'search', params],
    queryFn: async () => {
      // Obtener catálogo de ciudades para mapeo dinámico
      const cities = await catalog.getCities();
      const { iataMap, nameMap } = buildCityMaps(cities);

      // ciudad_destino es OPCIONAL según docs.txt
      const cityId = extractCityId(params.destination, iataMap, nameMap);

      const backendParams: BackendHotelSearchRequest = {
        cityId: cityId || '', // Vacío = buscar todos (opcional según docs)
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        adults: params.adults,
        rooms: params.rooms || 1,
      };

      const response = await bookings.hotels.search(backendParams);

      // Transformar respuesta del backend al formato que espera el frontend
      const hotel: HotelResult = {
        hotelId: response.hotelId,
        name: response.name,
        stars: response.stars || 3,
        city: response.cityId || 'Bogotá',
        country: cityId?.split('-')[0] || 'CO',
        images: response.photos || [],
        amenities: response.amenities || [],
        rooms: (response.roomTypes || []).map((rt) => ({
          roomId: rt.roomId || rt.roomCode,      // UUID para referencia
          roomCode: rt.roomCode || 'doble',      // Código tipo para reservas
          type: rt.roomType,
          price: rt.priceTotal,
          available: rt.available !== false,
          includesBreakfast: false,
        })),
      };

      return [hotel];
    },
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}
