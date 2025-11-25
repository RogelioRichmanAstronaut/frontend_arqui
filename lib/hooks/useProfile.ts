import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clients } from '../api/clients';
import { reservations } from '../api/reservations';
import type { CreateClientDto, ClientDto } from '../types/api';

export function useClient(clientId: string) {
  return useQuery({
    queryKey: ['clients', clientId],
    queryFn: () => clients.get(clientId),
    enabled: !!clientId,
    retry: false, // No reintentar si falla (ej: 404)
    throwOnError: false, // No lanzar error en la UI
  });
}

export function useMyClient() {
  return useQuery({
    queryKey: ['clients', 'me'],
    queryFn: () => clients.getMe(),
    retry: false,
    throwOnError: false,
  });
}

export function useUpdateClient(clientId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<CreateClientDto>) => clients.update(clientId, data),
    onSuccess: () => {
      // Invalidar tanto la query del cliente específico como la de 'me'
      queryClient.invalidateQueries({ queryKey: ['clients', clientId] });
      queryClient.invalidateQueries({ queryKey: ['clients', 'me'] });
    },
  });
}

export function useUpdateMyClient() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<CreateClientDto>) => clients.updateMe(data),
    onSuccess: () => {
      // Invalidar la query de 'me' para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ['clients', 'me'] });
    },
  });
}

export function useClientReservations(clientUuid: string) {
  return useQuery({
    queryKey: ['reservations', 'client', clientUuid],
    queryFn: () => reservations.listByClient(clientUuid),
    enabled: !!clientUuid,
  });
}
