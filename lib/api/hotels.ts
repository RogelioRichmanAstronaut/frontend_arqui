// File: lib/api/hotels.ts
import { apiClient } from './client';
import { generateIdempotencyKey } from '../utils/idempotency';
import type {
  HotelSearchRequestDto,
  HotelDto,
  HotelReservationRequestDto,
  HotelReservationResponseDto,
  HotelConfirmationRequestDto,
  HotelCancellationRequestDto
} from '../types/api';

export const hotels = {
  /**
   * Search for available hotels and rooms
   * Connects to: POST /bookings/hotels/search
   */
  async search(request: HotelSearchRequestDto): Promise<HotelDto[]> {
    return apiClient<HotelDto[]>('/bookings/hotels/search', {
      method: 'POST',
      body: request
    });
  },

  /**
   * Reserve a hotel room
   * Connects to: POST /bookings/hotels/reserve
   */
  async reserve(request: HotelReservationRequestDto): Promise<HotelReservationResponseDto> {
    return apiClient<HotelReservationResponseDto>('/bookings/hotels/reserve', {
      method: 'POST',
      body: request,
      idempotencyKey: generateIdempotencyKey()
    });
  },

  /**
   * Confirm a hotel reservation with payment
   * Connects to: POST /bookings/hotels/confirm
   */
  async confirm(request: HotelConfirmationRequestDto): Promise<void> {
    return apiClient<void>('/bookings/hotels/confirm', {
      method: 'POST',
      body: request,
      idempotencyKey: generateIdempotencyKey()
    });
  },

  /**
   * Cancel a hotel reservation or confirmed booking
   * Connects to: POST /bookings/hotels/cancel
   */
  async cancel(request: HotelCancellationRequestDto): Promise<void> {
    return apiClient<void>('/bookings/hotels/cancel', {
      method: 'POST',
      body: request,
      idempotencyKey: generateIdempotencyKey()
    });
  }
};