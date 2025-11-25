// File: lib/hooks/usePayments.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import { payments } from '../api/payments';
import { generateIdempotencyKey } from '../utils/idempotency';
import type { PaymentInitiateResponseDto, PaymentStatusQuery } from '../types/api';

export function useInitiatePayment() {
  return useMutation<PaymentInitiateResponseDto, Error, { dto: any; idempotencyKey?: string }, unknown>({
    mutationFn: ({ dto, idempotencyKey }: { dto: any; idempotencyKey?: string }) => payments.initiate(dto, idempotencyKey ?? generateIdempotencyKey()),
  });
}

export function usePaymentsStatus(query: PaymentStatusQuery | undefined) {
  return useQuery<any, Error>({
    queryKey: ['payments', 'status', query],
    queryFn: () => payments.status(query as PaymentStatusQuery),
    enabled: !!query,
  });
}
