import { useQuery } from '@tanstack/react-query';
import { bookings } from '../api/bookings';
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
    roomId: string;
    type: string;
    price: number;
    available: boolean;
    includesBreakfast: boolean;
  }>;
};

// Extraer código de ciudad del formato "BOG - Bogotá" o "CO-BOG"
function extractCityId(destination: string): string | undefined {
  if (!destination || destination.trim() === '') {
    return undefined; // Sin destino = buscar todos los hoteles
  }
  
  // Si ya es formato ISO (CO-BOG)
  if (destination.match(/^[A-Z]{2}-[A-Z]{3}$/)) {
    return destination;
  }
  
  // Si es formato "BOG - Bogotá" o solo "BOG"
  const iataMatch = destination.match(/^([A-Z]{3})(?:\s*-|$)/i);
  if (iataMatch) {
    return `CO-${iataMatch[1].toUpperCase()}`;
  }
  
  // Mapeo de nombres de ciudad a códigos
  const cityMap: Record<string, string> = {
    'bogota': 'CO-BOG', 'bogotá': 'CO-BOG',
    'medellin': 'CO-MDE', 'medellín': 'CO-MDE',
    'cartagena': 'CO-CTG', 'cali': 'CO-CLO',
    'barranquilla': 'CO-BAQ', 'santa marta': 'CO-SMR',
  };
  
  const normalized = destination.toLowerCase().split('-')[0].trim();
  return cityMap[normalized] || undefined;
}

export function useHotelSearch(params: HotelSearchRequest, enabled: boolean = false) {
  return useQuery({
    queryKey: ['hotels', 'search', params],
    queryFn: async () => {
      // ciudad_destino es OPCIONAL según docs.txt
      const cityId = extractCityId(params.destination);

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
        country: 'CO',
        images: response.photos || [],
        amenities: response.amenities || [],
        rooms: (response.roomTypes || []).map((rt) => ({
          roomId: rt.roomId || rt.roomCode,
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
