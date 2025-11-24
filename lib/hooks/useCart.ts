// File: lib/hooks/useCart.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cart } from '../api/cart';
import type { CartAddItemDto, CartDto } from '../types/api';
import { generateIdempotencyKey } from '../utils/idempotency';

export function useCart(clientId: string) {
  return useQuery<CartDto, Error>({
    queryKey: ['cart', clientId],
    queryFn: () => cart.get(clientId),
    enabled: !!clientId,
  });
}


export function useAddCartItem() {
  const qc = useQueryClient();
  return useMutation<CartDto, Error, CartAddItemDto, unknown>({
    mutationFn: (payload: CartAddItemDto) => cart.addItem(payload),
    onMutate: async (newItem: CartAddItemDto) => {
      await qc.cancelQueries({ queryKey: ['cart', newItem.clientId] });
      const previous = qc.getQueryData(['cart', newItem.clientId]);
      // optimistic update: append a temp item
      qc.setQueryData(['cart', newItem.clientId], (old: any) => {
        if (!old) return { clientId: newItem.clientId, items: [] };
        return { ...old, items: [...old.items, { ...newItem, id: 'temp-' + Date.now(), createdAt: new Date().toISOString() }] };
      });
      return { previous };
    },
    onError: (_err: unknown, variables, context: any) => {
      qc.setQueryData(['cart', (variables as CartAddItemDto).clientId], context?.previous);
    },
    onSettled: (_data, _err, variables) => {
      qc.invalidateQueries({ queryKey: ['cart', (variables as any)?.clientId] });
    },
  });
}

export function useRemoveCartItem() {
  const qc = useQueryClient();
  return useMutation<void, Error, { id: string; clientId: string }, unknown>({
    mutationFn: ({ id, clientId }: { id: string; clientId: string }) => cart.removeItem(id, clientId),
    onSuccess: (_data, vars) => qc.invalidateQueries({ queryKey: ['cart', vars.clientId] }),
  });
}

export function useClearCart() {
  const qc = useQueryClient();
  return useMutation<void, Error, string, unknown>({
    mutationFn: (clientId: string) => cart.clear(clientId),
    onSuccess: (_data, clientId) => qc.invalidateQueries({ queryKey: ['cart', clientId] }),
  });
}
