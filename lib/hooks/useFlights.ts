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
      // Transformar parámetros del frontend al formato que espera el backend
      // El backend espera originCityId y destinationCityId en formato CO-BOG
      // Por ahora, asumimos que origin y destination son códigos de ciudad válidos
      const backendParams = {
        originCityId: params.origin.startsWith('CO-') ? params.origin : `CO-${params.origin}`,
        destinationCityId: params.destination.startsWith('CO-') ? params.destination : `CO-${params.destination}`,
        departureAt: params.departureDate,
        returnAt: params.returnDate,
        passengers: params.passengers,
        cabin: params.classType === 'BUSINESS' || params.classType === 'FIRST' ? 'EJECUTIVA' : 'ECONOMICA',
      };

      const response = await apiClient<{ flights: Array<{
        flightId: string;
        airline: string;
        originCityId: string;
        destinationCityId: string;
        departsAt: string;
        arrivesAt: string;
        duration: string;
        fare: string;
        rules: string[];
        price: number;
        currency: string;
        baggage: string;
      }> }>('/bookings/air/search', {
        method: 'POST',
        body: backendParams,
        authToken: typeof window !== 'undefined' ? localStorage.getItem('auth_token') || undefined : undefined,
      });

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
