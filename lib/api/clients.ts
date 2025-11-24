// File: lib/api/clients.ts
import { apiClient } from './client';
import type { CreateClientDto, ClientDto } from '../types/api';

export const clients = {
  create: (dto: CreateClientDto) => apiClient<ClientDto>('/clients', { method: 'POST', body: dto }),
  get: (id: string) => apiClient<ClientDto>(`/clients/${id}`, { method: 'GET' }),
  getMe: () => apiClient<ClientDto>('/clients/me', { method: 'GET' }),
  update: (id: string, dto: Partial<CreateClientDto>) => apiClient<ClientDto>(`/clients/${id}`, { method: 'PATCH', body: dto }),
  remove: (id: string) => apiClient<void>(`/clients/${id}`, { method: 'DELETE' }),
};
