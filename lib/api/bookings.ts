// File: lib/api/bookings.ts
// Endpoints de búsqueda, reserva, confirmación y cancelación via proxy
import { apiClient } from './client';

// ============================================
// VUELOS (AIR) - via Proxy backend_arqui
// ============================================

export interface AirSearchRequest {
  originCityId: string;       // CO-BOG (ISO 3166-2)
  destinationCityId: string;  // CO-MDE
  departureAt?: string;       // YYYY-MM-DD
  returnAt?: string;          // YYYY-MM-DD
  passengers: number;
  cabin: 'ECONOMICA' | 'EJECUTIVA';
}

export interface FlightResult {
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
}

export interface AirSearchResponse {
  queryId: string;
  flights: FlightResult[];
}

export interface AirReserveRequest {
  flightId: string;
  clientId: string;           // CC-1020304050
  reservationId: string;      // UUID
  passengers: Array<{ name: string; document: string }>;
}

export interface AirReserveResponse {
  flightReservationId: string;
  totalPrice: number;
  status: string;
  expiresAt: string;
}

export interface AirConfirmRequest {
  flightReservationId: string;
  transactionId: string;      // BDB-YYYYMMDD-XXXX
  totalPrice?: number;
}

export interface AirConfirmResponse {
  confirmedId: string;
  status: string;
  totalConfirmed: number;
}

export interface AirCancelRequest {
  confirmedId: string;
  reservationId: string;
  origin: 'CLIENTE' | 'TURISMO';
  reason: string;
  notes?: string;
}

export interface AirCancelResponse {
  status: string;
  message: string;
  cancelledAt: string;
}

// ============================================
// HOTELES - via Proxy backend_arqui
// ============================================

export interface HotelSearchRequest {
  cityId: string;             // CO-BOG (ISO 3166-2)
  checkIn: string;            // YYYY-MM-DD
  checkOut: string;           // YYYY-MM-DD
  adults: number;
  rooms: number;
}

export interface RoomTypeResponse {
  roomId: string;
  roomType: string;
  roomCode: string;
  available: boolean;
  priceTotal: number;
  currency: string;
  amenities: string[];
}

export interface HotelSearchResponse {
  queryId: string;
  hotelId: string;
  name: string;
  cityId: string;
  stars: number;
  amenities: string[];
  photos: string[];
  roomTypes: RoomTypeResponse[];
}

export interface HotelReserveRequest {
  hotelId: string;
  roomId: string;             // código: "doble", "simple"
  clientId: string;           // CC-1020304050
  checkIn: string;
  checkOut: string;
  reservationId: string;      // UUID
  rooms?: number;
  adults?: number;
}

export interface HotelReserveResponse {
  hotelReservationId: string;
  totalPrice: number;
  status: string;
  notes?: string;
}

export interface HotelConfirmRequest {
  hotelReservationId: string;
  transactionId: string;      // BDB-YYYYMMDD-XXXX
}

export interface HotelConfirmResponse {
  confirmedId: string;
  status: string;
}

export interface HotelCancelRequest {
  confirmedId: string;
  reservationId: string;
  origin: 'CLIENTE' | 'HOTEL';
  reason: string;
  notes?: string;
}

export interface HotelCancelResponse {
  cancellationId: string;
  status: string;
  registeredAt: string;
  notes?: string;
}

// ============================================
// API Exports
// ============================================

export const bookings = {
  // VUELOS
  air: {
    search: (dto: AirSearchRequest) => 
      apiClient<AirSearchResponse>('/bookings/air/search', { method: 'POST', body: dto }),
    
    reserve: (dto: AirReserveRequest) => 
      apiClient<AirReserveResponse>('/bookings/air/reserve', { method: 'POST', body: dto }),
    
    confirm: (dto: AirConfirmRequest) => 
      apiClient<AirConfirmResponse>('/bookings/air/confirm', { method: 'POST', body: dto }),
    
    cancel: (dto: AirCancelRequest) => 
      apiClient<AirCancelResponse>('/bookings/air/cancel', { method: 'POST', body: dto }),
  },

  // HOTELES
  hotels: {
    search: (dto: HotelSearchRequest) => 
      apiClient<HotelSearchResponse>('/bookings/hotels/search', { method: 'POST', body: dto }),
    
    reserve: (dto: HotelReserveRequest) => 
      apiClient<HotelReserveResponse>('/bookings/hotels/reserve', { method: 'POST', body: dto }),
    
    confirm: (dto: HotelConfirmRequest) => 
      apiClient<HotelConfirmResponse>('/bookings/hotels/confirm', { method: 'POST', body: dto }),
    
    cancel: (dto: HotelCancelRequest) => 
      apiClient<HotelCancelResponse>('/bookings/hotels/cancel', { method: 'POST', body: dto }),
  },
};

