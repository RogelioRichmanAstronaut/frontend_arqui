// File: lib/api/index.ts
/**
 * Centralized API services for the Tourism Frontend
 * 
 * This module exports all API service functions that connect to the NestJS backend.
 * Based on the comprehensive API documentation for the Tourism System.
 * 
 * Services included:
 * - Authentication (login, register)
 * - Client management (CRUD operations)
 * - Catalog (cities)
 * - Flight bookings (search, reserve, confirm, cancel)
 * - Hotel bookings (search, reserve, confirm, cancel)
 * - Shopping cart operations
 * - Checkout process (quote, confirm)
 * - Payment processing
 * - Reservations management
 * - Health checks
 * - Reporting
 */

// Core API client
export { apiClient, apiConfig } from './client';
export type { ApiClientOptions } from './client';

// Authentication services
export { auth } from './auth';

// Client management
export { clients } from './clients';

// Catalog services
export { catalog } from './catalog';

// Booking services
export { flights } from './flights';
export { hotels } from './hotels';

// Shopping and checkout
export { cart } from './cart';
export { checkout } from './checkout';

// Payment services
export { payments } from './payments';

// Reservations
export { reservations } from './reservations';

// Health monitoring
export { health } from './health';

// Reporting
export { reporting } from './reporting';

// Export all types for easy consumption
export * from '../types/api';

// Utility functions
export { generateIdempotencyKey } from '../utils/idempotency';
export { ApiError } from '../utils/apiError';

/**
 * Environment-aware service configuration
 */
export const serviceEndpoints = {
  tourism: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1',
  airline: process.env.NEXT_PUBLIC_AIRLINE_API_URL || 'http://10.43.103.34:8080/v1',
  hotel: process.env.NEXT_PUBLIC_HOTEL_API_URL || 'http://10.43.103.234:8080/manejadordb',
  bank: process.env.NEXT_PUBLIC_BANK_API_URL || 'http://localhost:3000',
} as const;

/**
 * Feature flags for conditional rendering
 */
export const features = {
  hotelBooking: process.env.NEXT_PUBLIC_ENABLE_HOTEL_BOOKING !== 'false',
  flightBooking: process.env.NEXT_PUBLIC_ENABLE_FLIGHT_BOOKING !== 'false',
  packageBooking: process.env.NEXT_PUBLIC_ENABLE_PACKAGE_BOOKING !== 'false',
  reporting: process.env.NEXT_PUBLIC_ENABLE_REPORTING !== 'false',
} as const;

/**
 * Application configuration constants
 */
export const appConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'Turismo App',
  version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  defaultCurrency: process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || 'COP',
  margins: {
    flight: parseFloat(process.env.NEXT_PUBLIC_FLIGHT_MARGIN || '5'),
    hotel: parseFloat(process.env.NEXT_PUBLIC_HOTEL_MARGIN || '10'),
  },
  urls: {
    paymentReturn: process.env.NEXT_PUBLIC_PAYMENT_RETURN_URL || 'http://localhost:3000/payments/return',
    paymentCallback: process.env.NEXT_PUBLIC_PAYMENT_CALLBACK_URL || 'http://localhost:3001/v1/payments/webhook',
  },
  session: {
    timeout: parseInt(process.env.NEXT_PUBLIC_SESSION_TIMEOUT || '120'),
    tokenKey: process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token',
  },
} as const;