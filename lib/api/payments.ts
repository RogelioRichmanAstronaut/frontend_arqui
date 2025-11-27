// File: lib/api/payments.ts
import { apiClient } from './client';
import { generateIdempotencyKey } from '../utils/idempotency';
import type { 
  PaymentInitiateRequestDto, 
  PaymentInitiateResponseDto, 
  PaymentStatusQuery,
  PaymentStatusResponseDto,
  PaymentWebhookDto
} from '../types/api';

export const payments = {
  /**
   * Initiate a payment process
   * Connects to: POST /payments/init
   */
  initiate: (dto: PaymentInitiateRequestDto, idempotencyKey?: string) => 
    apiClient<PaymentInitiateResponseDto>('/payments/init', { 
      method: 'POST', 
      body: dto, 
      idempotencyKey: idempotencyKey || generateIdempotencyKey() 
    }),

  /**
   * Handle payment webhook from bank
   * Connects to: POST /payments/webhook
   */
  webhook: (payload: PaymentWebhookDto) => 
    apiClient('/payments/webhook', { method: 'POST', body: payload }),

  /**
   * Check payment status
   * Connects to: GET /payments/status
   */
  status: (query: PaymentStatusQuery) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => { 
      if (v) params.set(k, String(v)); 
    });
    return apiClient<PaymentStatusResponseDto>(`/payments/status?${params.toString()}`, { method: 'GET' });
  },

  /**
   * Status check by transaction ID
   */
  statusByTransaction: (transactionId: string) => 
    apiClient<PaymentStatusResponseDto>(`/payments/status?transactionId=${encodeURIComponent(transactionId)}`, { method: 'GET' }),

  /**
   * Refund a payment
   */
  refund: (payload: any) => 
    apiClient('/payments/refund', { method: 'POST', body: payload }),

  /**
   * Validate payment receipt
   */
  validateReceipt: (payload: any) => 
    apiClient('/payments/receipt/validate', { method: 'POST', body: payload }),
};
