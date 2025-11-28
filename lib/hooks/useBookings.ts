// File: lib/hooks/useBookings.ts
// Hooks para búsqueda, reserva, confirmación y cancelación via proxy
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookings } from '../api/bookings';
import type {
  AirSearchRequest,
  AirSearchResponse,
  AirReserveRequest,
  AirReserveResponse,
  AirConfirmRequest,
  AirConfirmResponse,
  AirCancelRequest,
  AirCancelResponse,
  HotelSearchRequest,
  HotelSearchResponse,
  HotelReserveRequest,
  HotelReserveResponse,
  HotelConfirmRequest,
  HotelConfirmResponse,
  HotelCancelRequest,
  HotelCancelResponse,
} from '../api/bookings';

// ============================================
// VUELOS (AIR) HOOKS
// ============================================

export function useAirSearch(params: AirSearchRequest | undefined, enabled: boolean = false) {
  return useQuery<AirSearchResponse, Error>({
    queryKey: ['bookings', 'air', 'search', params],
    queryFn: () => bookings.air.search(params as AirSearchRequest),
    enabled: enabled && !!params,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useAirReserve() {
  const qc = useQueryClient();
  return useMutation<AirReserveResponse, Error, AirReserveRequest>({
    mutationFn: (dto) => bookings.air.reserve(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings', 'air'] });
    },
  });
}

export function useAirConfirm() {
  const qc = useQueryClient();
  return useMutation<AirConfirmResponse, Error, AirConfirmRequest>({
    mutationFn: (dto) => bookings.air.confirm(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings', 'air'] });
      qc.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
}

export function useAirCancel() {
  const qc = useQueryClient();
  return useMutation<AirCancelResponse, Error, AirCancelRequest>({
    mutationFn: (dto) => bookings.air.cancel(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings', 'air'] });
      qc.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
}

// ============================================
// HOTELES HOOKS
// ============================================

export function useHotelSearch(params: HotelSearchRequest | undefined, enabled: boolean = false) {
  return useQuery<HotelSearchResponse, Error>({
    queryKey: ['bookings', 'hotels', 'search', params],
    queryFn: () => bookings.hotels.search(params as HotelSearchRequest),
    enabled: enabled && !!params,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useHotelReserve() {
  const qc = useQueryClient();
  return useMutation<HotelReserveResponse, Error, HotelReserveRequest>({
    mutationFn: (dto) => bookings.hotels.reserve(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings', 'hotels'] });
    },
  });
}

export function useHotelConfirm() {
  const qc = useQueryClient();
  return useMutation<HotelConfirmResponse, Error, HotelConfirmRequest>({
    mutationFn: (dto) => bookings.hotels.confirm(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings', 'hotels'] });
      qc.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
}

export function useHotelCancel() {
  const qc = useQueryClient();
  return useMutation<HotelCancelResponse, Error, HotelCancelRequest>({
    mutationFn: (dto) => bookings.hotels.cancel(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings', 'hotels'] });
      qc.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
}



