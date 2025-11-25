// File: lib/hooks/useReservations.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reservations } from '../api/reservations';
import type { ReservationDto, CreateReservationDto } from '../types/api';

export function useReservation(id?: string) {
  return useQuery<ReservationDto, Error>({
    queryKey: ['reservation', id],
    queryFn: () => reservations.get(id as string),
    enabled: !!id,
  });
}

export function useReservations(clientUuid?: string) {
  return useQuery<ReservationDto[], Error>({
    queryKey: ['reservations', clientUuid],
    queryFn: () => reservations.listByClient(clientUuid as string),
    enabled: !!clientUuid,
  });
}

export function useCreateReservation() {
  const qc = useQueryClient();
  return useMutation<ReservationDto, Error, CreateReservationDto, unknown>({
    mutationFn: (dto: CreateReservationDto) => reservations.create(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reservations'] }),
  });
}

export function useCancelReservation() {
  const qc = useQueryClient();
  return useMutation<void, Error, string, unknown>({
    mutationFn: (id: string) => reservations.cancel(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reservations'] }),
  });
}
