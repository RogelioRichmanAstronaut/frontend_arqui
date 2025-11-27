// File: lib/api/health.ts
import { apiClient } from './client';

export type HealthCheckDto = {
  status: 'OK' | 'ERROR';
  timestamp: string;
  version?: string;
  environment?: string;
  services?: {
    database: 'OK' | 'ERROR';
    airline: 'OK' | 'ERROR';
    hotel: 'OK' | 'ERROR';
    bank: 'OK' | 'ERROR';
  };
};

export type ReadinessCheckDto = {
  ready: boolean;
  checks: {
    [service: string]: boolean;
  };
};

export const health = {
  /**
   * Basic health check
   * Connects to: GET /health
   */
  check: () => 
    apiClient<HealthCheckDto>('/health', { method: 'GET' }),

  /**
   * Readiness check (includes external services)
   * Connects to: GET /ready
   */
  ready: () => 
    apiClient<ReadinessCheckDto>('/ready', { method: 'GET' }),
};