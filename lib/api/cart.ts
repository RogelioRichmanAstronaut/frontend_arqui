// File: lib/api/cart.ts
import { apiClient } from './client';
import type { CartAddItemDto, CartDto } from '../types/api';

export const cart = {
  addItem: (dto: CartAddItemDto) => apiClient<CartDto>('/cart/items', { method: 'POST', body: dto }),
  get: (clientId: string) => apiClient<CartDto>(`/cart?clientId=${encodeURIComponent(clientId)}`, { method: 'GET' }),
  removeItem: (id: string, clientId?: string) => apiClient<void>(`/cart/items/${id}${clientId ? `?clientId=${encodeURIComponent(clientId)}` : ''}`, { method: 'DELETE' }),
  clear: (clientId: string) => apiClient<void>(`/cart?clientId=${encodeURIComponent(clientId)}`, { method: 'DELETE' }),
};
