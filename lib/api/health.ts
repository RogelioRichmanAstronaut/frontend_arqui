// File: lib/api/health.ts
// Endpoints de health check
import { apiClient } from './client';

export interface HealthResponse {
  status: string;
  ts?: string;
}

export const health = {
  check: () => apiClient<HealthResponse>('/health', { method: 'GET' }),
  ready: () => apiClient<HealthResponse>('/ready', { method: 'GET' }),
};


