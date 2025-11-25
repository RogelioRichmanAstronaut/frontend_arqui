// File: lib/api/payments.ts
import { apiClient } from './client';
import type { PaymentInitiateRequestDto, PaymentInitiateResponseDto, PaymentStatusQuery } from '../types/api';

export const payments = {
  initiate: (dto: PaymentInitiateRequestDto, idempotencyKey?: string) => apiClient<PaymentInitiateResponseDto>('/payments/init', { method: 'POST', body: dto, idempotencyKey }),
  webhook: (payload: any) => apiClient('/payments/webhook', { method: 'POST', body: payload }),
  status: (query: PaymentStatusQuery) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => { if (v) params.set(k, String(v)); });
    return apiClient(`/payments/status?${params.toString()}`, { method: 'GET' });
  },
  refund: (payload: any) => apiClient('/payments/refund', { method: 'POST', body: payload }),
  validateReceipt: (payload: any) => apiClient('/payments/receipt/validate', { method: 'POST', body: payload }),
};
