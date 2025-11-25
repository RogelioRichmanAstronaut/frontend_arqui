// File: lib/api/checkout.ts
import { apiClient } from './client';
import type { CheckoutQuoteRequestDto, CheckoutQuoteResponseDto, CheckoutConfirmRequestDto, CheckoutConfirmResponseDto } from '../types/api';

export const checkout = {
  quote: (dto: CheckoutQuoteRequestDto) => apiClient<CheckoutQuoteResponseDto>('/checkout/quote', { method: 'POST', body: dto }),
  confirm: (dto: CheckoutConfirmRequestDto, idempotencyKey?: string) => apiClient<CheckoutConfirmResponseDto>('/checkout/confirm', { method: 'POST', body: dto, idempotencyKey }),
};
