// File: tests/hooks/useAddCartItem.test.tsx
import { cart } from '../../lib/api/cart';

describe('cart API', () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = jest.fn();
  });

  it('calls addItem and returns cart', async () => {
    const mockResp = { clientId: 'c1', currency: 'USD', items: [] };
    // @ts-ignore
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => mockResp, headers: new Map(), status: 200 });

    const dto = { clientId: 'c1', currency: 'USD', kind: 'HOTEL', refId: 'r1', quantity: 1, price: 100 };
    const res = await cart.addItem(dto as any);
    expect(res).toEqual(mockResp);
    expect(global.fetch).toHaveBeenCalled();
  });
});
