// File: lib/hooks/usePayments.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import { payments } from '../api/payments';
import { generateIdempotencyKey } from '../utils/idempotency';
import type { PaymentInitiateRequestDto, PaymentInitiateResponseDto, PaymentStatusQuery } from '../types/api';

type InitiateArgs = { dto: PaymentInitiateRequestDto; idempotencyKey?: string };

export function useInitiatePayment() {
  return useMutation<PaymentInitiateResponseDto, Error, InitiateArgs, unknown>({
    mutationFn: ({ dto, idempotencyKey }) =>
      payments.initiate(dto, idempotencyKey ?? generateIdempotencyKey()),
  });
}

type ProcessPaymentArgs = {
  clientId: string;
  clientName: string;
  totalAmount: number;
  description: string;
  returnUrl: string;
  callbackUrl: string;
  currency?: string;
  reservationId?: string;
  idempotencyKey?: string;
};

export function useProcessPayment() {
  const mutation = useInitiatePayment();

  const processPayment = (args: ProcessPaymentArgs) => {
    const dto: PaymentInitiateRequestDto = {
      clientId: args.clientId,
      clientName: args.clientName,
      totalAmount: args.totalAmount,
      currency: args.currency ?? 'COP',
      description: args.description,
      returnUrl: args.returnUrl,
      callbackUrl: args.callbackUrl,
      reservationId: args.reservationId,
    };

    return mutation.mutateAsync({
      dto,
      idempotencyKey: args.idempotencyKey,
    });
  };

  return {
    ...mutation,
    processPayment,
  };
}

export function usePaymentsStatus(query: PaymentStatusQuery | undefined) {
  return useQuery<PaymentInitiateResponseDto, Error>({
    queryKey: ['payments', 'status', query],
    queryFn: () => payments.status(query as PaymentStatusQuery),
    enabled: !!query,
  });
}
