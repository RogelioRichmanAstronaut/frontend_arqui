import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';

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

export function useFlightSearch(params: AirlineSearchRequest, enabled: boolean = false) {
  return useQuery({
    queryKey: ['flights', 'search', params],
    queryFn: async () => {
      const response = await apiClient<{ flights: FlightResult[] }>('/bookings/air/search', {
        method: 'POST',
        body: params,
        authToken: typeof window !== 'undefined' ? localStorage.getItem('auth_token') || undefined : undefined,
      });
      return response.flights || [];
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
