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
export type DocumentType = 'CC' | 'TI' | 'PASS';
export type CreateClientDto = { name: string; email: string; phone?: string; clientId?: string; documentType?: DocumentType };
export type ClientDto = {
  id: string;
  clientId?: string;
  name: string;
  email: string;
  phone?: string;
  documentType?: DocumentType;
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
export type CartDto = { clientId: string; items: CartItemDto[]; currency: string };

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
export type PaymentInitiateRequestDto = CheckoutConfirmRequestDto;
export type PaymentInitiateResponseDto = CheckoutConfirmResponseDto;
export type PaymentStatusQuery = { reservationId?: string; orderId?: string; paymentAttemptId?: string };

// Reservations
export type CreateReservationDto = { clientUuid: string; currency: string; totalAmount: number; note?: string };
export type ReservationDto = { id: string; clientUuid: string; currency: string; totalAmount: number; status: string; createdAt: string };

// Catalog
export type CityDto = { id: string; name: string; country?: string };

// Flight DTOs
export type FlightSearchRequestDto = {
  originCityId: string; // Format: CO-BOG
  destinationCityId: string; // Format: CO-MDE
  departureAt: string; // Format: YYYY-MM-DD
  returnAt?: string; // Optional for round trip
  passengers: number;
  cabin: 'ECONOMICA' | 'PREMIUM' | 'BUSINESS' | 'FIRST';
};

export type PassengerDto = {
  name: string;
  doc: string;
  age?: number;
  seat?: string;
};

export type FlightDto = {
  id: string;
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  currency: string;
  availableSeats: number;
  cabin: string;
};

export type FlightReservationRequestDto = {
  reservationId: string;
  flightId: string;
  clientId: string;
  passengers: PassengerDto[];
};

export type FlightReservationResponseDto = {
  flightReservationId: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  totalAmount: number;
  currency: string;
  expiresAt?: string;
};

export type FlightConfirmationRequestDto = {
  flightReservationId: string;
  transactionId: string;
};

export type FlightCancellationRequestDto = {
  confirmedId?: string;
  reservationId?: string;
  origin: 'CLIENTE' | 'SISTEMA' | 'AEROLINEA';
  reason: string;
};

// Hotel DTOs
export type HotelSearchRequestDto = {
  cityId: string; // Format: CO-BOG
  checkIn: string; // Format: YYYY-MM-DD
  checkOut: string; // Format: YYYY-MM-DD
  adults: number;
  rooms: number;
};

export type RoomDto = {
  id: string;
  type: string;
  description?: string;
  price: number;
  currency: string;
  available: number;
  amenities?: string[];
};

export type HotelDto = {
  id: string;
  name: string;
  address?: string;
  city: string;
  rating?: number;
  rooms: RoomDto[];
  amenities?: string[];
  images?: string[];
};

export type HotelReservationRequestDto = {
  hotelId: string;
  roomId: string;
  clientId: string;
  checkIn: string;
  checkOut: string;
  reservationId: string;
  rooms: number;
  adults: number;
};

export type HotelReservationResponseDto = {
  hotelReservationId: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  totalAmount: number;
  currency: string;
  expiresAt?: string;
};

export type HotelConfirmationRequestDto = {
  hotelReservationId: string;
  transactionId: string;
};

export type HotelCancellationRequestDto = {
  confirmedId?: string;
  reservationId?: string;
  origin: 'CLIENTE' | 'SISTEMA' | 'HOTEL';
  reason: string;
  notes?: string;
};

// Payment DTOs (extended)
export type PaymentState = 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | 'CANCELADA' | 'EXPIRADA';

export type PaymentWebhookDto = {
  transactionId: string;
  paymentAttemptId: string;
  clientId: string;
  totalAmount: number;
  currency: string;
  authCode?: string;
  receiptRef?: string;
  transactionAt: string;
  signature: string;
  state: PaymentState;
};

export type PaymentStatusResponseDto = {
  transactionId: string;
  state: PaymentState;
  totalAmount: number;
  currency: string;
  createdAt: string;
  completedAt?: string;
  authCode?: string;
  receiptRef?: string;
};
