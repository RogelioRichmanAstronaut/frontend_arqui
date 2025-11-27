// File: lib/api/flights.ts
import { apiClient } from './client';
import { generateIdempotencyKey } from '../utils/idempotency';
import type {
  FlightSearchRequestDto,
  FlightDto,
  FlightReservationRequestDto,
  FlightReservationResponseDto,
  FlightConfirmationRequestDto,
  FlightCancellationRequestDto
} from '../types/api';

export const flights = {
  /**
   * Search for available flights
   * Connects to: POST /bookings/air/search
   */
  async search(request: FlightSearchRequestDto): Promise<FlightDto[]> {
    return apiClient<FlightDto[]>('/bookings/air/search', {
      method: 'POST',
      body: request
    });
  },

  /**
   * Reserve a flight
   * Connects to: POST /bookings/air/reserve
   */
  async reserve(request: FlightReservationRequestDto): Promise<FlightReservationResponseDto> {
    return apiClient<FlightReservationResponseDto>('/bookings/air/reserve', {
      method: 'POST',
      body: request,
      idempotencyKey: generateIdempotencyKey()
    });
  },

  /**
   * Confirm a flight reservation with payment
   * Connects to: POST /bookings/air/confirm
   */
  async confirm(request: FlightConfirmationRequestDto): Promise<void> {
    return apiClient<void>('/bookings/air/confirm', {
      method: 'POST',
      body: request,
      idempotencyKey: generateIdempotencyKey()
    });
  },

  /**
   * Cancel a flight reservation or confirmed booking
   * Connects to: POST /bookings/air/cancel
   */
  async cancel(request: FlightCancellationRequestDto): Promise<void> {
    return apiClient<void>('/bookings/air/cancel', {
      method: 'POST',
      body: request,
      idempotencyKey: generateIdempotencyKey()
    });
  }
};