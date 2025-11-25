// File: lib/hooks/useCheckout.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { checkout } from '../api/checkout';
import type { CheckoutQuoteRequestDto, CheckoutQuoteResponseDto, CheckoutConfirmRequestDto, CheckoutConfirmResponseDto } from '../types/api';
import { generateIdempotencyKey } from '../utils/idempotency';

export function useCheckoutQuote(dto: CheckoutQuoteRequestDto | undefined) {
  return useQuery<CheckoutQuoteResponseDto, Error, CheckoutQuoteResponseDto>({
    queryKey: ['checkout', 'quote', dto?.clientId ?? dto?.cartId],
    queryFn: () => checkout.quote(dto as CheckoutQuoteRequestDto),
    enabled: !!dto,
  });
}

export function useCheckoutConfirm() {
  const qc = useQueryClient();
  return useMutation<CheckoutConfirmResponseDto, Error, { dto: CheckoutConfirmRequestDto; idempotencyKey?: string }, unknown>({
    mutationFn: ({ dto, idempotencyKey }: { dto: CheckoutConfirmRequestDto; idempotencyKey?: string }) => checkout.confirm(dto, idempotencyKey ?? generateIdempotencyKey()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] }),
  });
}
