// File: lib/hooks/usePayments.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import { payments } from '../api/payments';
import { generateIdempotencyKey } from '../utils/idempotency';
import type { PaymentInitiateRequestDto, PaymentInitiateResponseDto, PaymentStatusQuery } from '../types/api';

export function useInitiatePayment() {
  return useMutation<PaymentInitiateResponseDto, Error, { dto: PaymentInitiateRequestDto; idempotencyKey?: string }, unknown>({
    mutationFn: ({ dto, idempotencyKey }) => payments.initiate(dto, idempotencyKey ?? generateIdempotencyKey()),
  });
}

export function usePaymentsStatus(query: PaymentStatusQuery | undefined) {
  return useQuery<PaymentInitiateResponseDto, Error>({
    queryKey: ['payments', 'status', query],
    queryFn: () => payments.status(query as PaymentStatusQuery),
    enabled: !!query,
  });
}
