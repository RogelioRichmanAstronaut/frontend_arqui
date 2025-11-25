import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';

export type HotelSearchRequest = {
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children?: number;
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

export function useHotelSearch(params: HotelSearchRequest, enabled: boolean = false) {
  return useQuery({
    queryKey: ['hotels', 'search', params],
    queryFn: async () => {
      // El backend espera cityId en formato CO-BOG y rooms (número de habitaciones)
      // Necesitamos convertir el destination a cityId
      // Por ahora, asumimos que destination puede ser un nombre de ciudad o código
      // En producción, esto debería usar el catálogo de ciudades
      const cityId = params.destination.startsWith('CO-') 
        ? params.destination 
        : `CO-${params.destination.toUpperCase().substring(0, 3)}`;

      const backendParams = {
        cityId,
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        adults: params.adults,
        rooms: 1, // Por defecto 1 habitación, puede ajustarse según necesidad
      };

      const response = await apiClient<{
        hotelId: string;
        name: string;
        cityId: string;
        amenities: string[];
        roomTypes: Array<{
          roomType: string;
          priceTotal: number;
          currency: string;
        }>;
      }>('/bookings/hotels/search', {
        method: 'POST',
        body: backendParams,
        authToken: typeof window !== 'undefined' ? localStorage.getItem('auth_token') || undefined : undefined,
      });

      // Transformar respuesta del backend al formato que espera el frontend
      // Nota: El backend actualmente devuelve un solo hotel, pero el frontend espera un array
      // Por ahora, convertimos la respuesta única en un array
      const hotel: HotelResult = {
        hotelId: response.hotelId,
        name: response.name,
        stars: 3, // El backend no devuelve estrellas, usar valor por defecto
        city: response.cityId.split('-').pop() || response.cityId,
        country: response.cityId.split('-')[0] || 'CO',
        images: [], // El backend no devuelve imágenes en la búsqueda
        amenities: response.amenities || [],
        rooms: response.roomTypes.map((rt, index) => ({
          roomId: `${response.hotelId}-room-${index}`,
          type: rt.roomType,
          price: rt.priceTotal,
          available: true,
          includesBreakfast: false, // El backend no devuelve esta información
        })),
      };

      return [hotel];
    },
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}
