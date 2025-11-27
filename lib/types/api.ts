// File: lib/types/api.ts
export type Role = 'ADMIN' | 'EMPLOYEE';

// Auth
export type LoginDto = { email: string; password: string };
export type RegisterDto = { email: string; password: string; name: string; role: Role };
export type LoginResponse = { 
  token?: string;
  access_token?: string; // backend puede devolver access_token o token
  user?: { 
    clientId?: string;
    email?: string;
    name?: string;
    [key: string]: any;
  }
}; // bearer token

// Clients
export type CreateClientDto = { name: string; email: string; phone?: string; clientId?: string };
export type ClientDto = { 
  id: string; 
  clientId?: string;
  name: string; 
  email: string; 
  phone?: string; 
  createdAt: string;
  updatedAt?: string;
  isDeleted?: boolean;
};

// Cart
export type CartKind = 'HOTEL' | 'AIR';
export type CartAddItemDto = {
  clientId: string;
  currency: string;
  kind: CartKind;
  refId: string;
  quantity: number;
  price: number;
  metadata?: Record<string, any>;
};

export type CartItemDto = { id: string } & CartAddItemDto & { createdAt: string };
export type CartDto = { 
  id: string;           // UUID del carrito
  clientId: string; 
  items: CartItemDto[]; 
  currency: string;
  total?: number;
};

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
  expiresAt?: string;
  hotelReservations?: any[];
  flightReservations?: any[];
};

// Payments
export type PaymentInitiateRequestDto = {
  clientId: string;
  clientName?: string;
  totalAmount: number;
  currency: string;
  description?: string;
  returnUrl?: string;
  callbackUrl?: string;
  reservationId?: string;
};
export type PaymentInitiateResponseDto = {
  paymentAttemptId: string;
  bankPaymentUrl?: string;
  totalAmount: number;
  expiresAt?: string;
  state?: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';
  reservationId?: string;
  url_respuesta?: string;
};
export type PaymentStatusQuery = { reservationId?: string; orderId?: string; paymentAttemptId?: string; transactionId?: string };

// Reservations
export type CreateReservationDto = { clientUuid: string; currency: string; totalAmount: number; note?: string };
export type ReservationDto = { id: string; clientUuid: string; currency: string; totalAmount: number; status: string; createdAt: string };

// Catalog
export type CityDto = { 
  id: string;        // CO-BOG (ISO 3166-2)
  name: string;      // Bogotá
  iataCode?: string; // BOG
  country?: string;  // Colombia
};
