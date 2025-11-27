// File: lib/hooks/useHealth.ts
// Hooks para health checks
import { useQuery } from '@tanstack/react-query';
import { health } from '../api/health';
import type { HealthResponse } from '../api/health';

export function useHealthCheck() {
  return useQuery<HealthResponse, Error>({
    queryKey: ['health'],
    queryFn: () => health.check(),
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider stale after 10 seconds
  });
}

export function useReadyCheck() {
  return useQuery<HealthResponse, Error>({
    queryKey: ['ready'],
    queryFn: () => health.ready(),
    refetchInterval: 30000,
    staleTime: 10000,
  });
}


