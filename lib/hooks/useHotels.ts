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
      const response = await apiClient<{ hotels: HotelResult[] }>('/bookings/hotels/search', {
        method: 'POST',
        body: params,
        authToken: typeof window !== 'undefined' ? localStorage.getItem('auth_token') || undefined : undefined,
      });
      return response.hotels || [];
    },
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}
