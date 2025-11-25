// Generated DTO types (frontend shim)
// WARNING: generated from controller summary — verify against backend DTOs before relying in production

export type Role = 'ADMIN' | 'EMPLOYEE';

// Auth
export type LoginDto = { email: string; password: string };
export type RegisterDto = { email: string; password: string; name: string; role: Role };

export type LoginResponse = { access_token?: string; token?: string; user?: any };

// Clients
export type CreateClientDto = { name: string; email: string; phone?: string; role?: Role; clientId?: string };
export type ClientDto = { id: string; uuid?: string; clientId?: string; name: string; email: string; phone?: string; createdAt?: string };

// Cart
export type CartKind = 'HOTEL' | 'AIR';
export type CartAddItemDto = {
  clientId: string; // document id like CC-12345678
  currency: string; // ISO-4217
  kind: CartKind;
  refId: string;
  quantity: number;
  price: number;
  metadata?: Record<string, any>;
};
export type CartItemDto = { id: string } & CartAddItemDto & { createdAt?: string };
export type CartDto = { clientId: string; items: CartItemDto[]; currency?: string };

// Checkout
export type CheckoutQuoteRequestDto = { clientId: string; cartId?: string };
export type CheckoutQuoteResponseDto = { currency: string; total: number; items: CartItemDto[] };

export type CheckoutConfirmRequestDto = {
  clientId: string;
  currency: string;
  cartId?: string;
  description?: string;
  returnUrl?: string;
  callbackUrl?: string;
};
export type CheckoutConfirmResponseDto = {
  reservationId?: string;
  orderId?: string;
  totalAmount: number;
  paymentAttemptId?: string;
  bankPaymentUrl?: string;
};

// Reservations
export type CreateReservationDto = { clientUuid: string; currency: string; totalAmount: number; note?: string };
export type ReservationDto = { id: string; clientUuid: string; currency: string; totalAmount: number; status: string; createdAt?: string };

// Payments (minimal)
export type BankInitiatePaymentRequestDto = CheckoutConfirmRequestDto;
export type BankInitiatePaymentResponseDto = CheckoutConfirmResponseDto;

// Reporting
export type SalesReportDto = any;

// Health
export type HealthResponse = { status: string; ts?: string };

// Notes: estos tipos deben verificarse y sincronizarse con los DTOs reales del backend.

export {};
