// File: lib/api/reservations.ts
import { apiClient } from './client';
import type { CreateReservationDto, ReservationDto } from '../types/api';

export const reservations = {
  create: (dto: CreateReservationDto) => apiClient<ReservationDto>('/reservations', { method: 'POST', body: dto }),
  get: (id: string) => apiClient<ReservationDto>(`/reservations/${id}`, { method: 'GET' }),
  listByClient: (clientUuid: string) => apiClient<ReservationDto[]>(`/reservations?clientUuid=${encodeURIComponent(clientUuid)}`, { method: 'GET' }),
  cancel: (id: string) => apiClient(`/reservations/${id}/cancel`, { method: 'PATCH' }),
};
