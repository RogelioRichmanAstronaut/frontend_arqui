# API Services Documentation

## Overview

This document describes the frontend API services that connect to the NestJS backend tourism system. All services are designed to match the comprehensive API specification provided.

## Service Architecture

```
lib/api/
├── index.ts           # Main export file
├── client.ts          # Base API client
├── auth.ts            # Authentication
├── clients.ts         # Client management
├── catalog.ts         # Cities catalog
├── flights.ts         # Flight bookings
├── hotels.ts          # Hotel bookings
├── cart.ts            # Shopping cart
├── checkout.ts        # Checkout process
├── payments.ts        # Payment processing
├── reservations.ts    # Reservations management
├── health.ts          # Health checks
└── reporting.ts       # Reports
```

## Usage Examples

### 1. Authentication

```typescript
import { auth } from '@/lib/api';

// Login
const response = await auth.login({
  email: 'empleado@turismo.com',
  password: 'password123'
});

// Register new employee
await auth.register({
  email: 'new@turismo.com',
  password: 'password123',
  name: 'New Employee',
  role: 'EMPLOYEE'
});
```

### 2. Client Management

```typescript
import { clients } from '@/lib/api';

// Create client (format: CC-1032456789)
const client = await clients.create({
  clientId: 'CC-1032456789',
  name: 'Juan Perez',
  email: 'juan@email.com',
  phone: '3001234567'
});

// Get client by UUID
const client = await clients.get(clientUuid);

// Update client
await clients.update(clientUuid, {
  name: 'Juan Carlos Perez',
  phone: '3009876543'
});
```

### 3. Flight Search and Booking

```typescript
import { flights } from '@/lib/api';

// Search flights (CO-BOG format for cities)
const flightResults = await flights.search({
  originCityId: 'CO-BOG',
  destinationCityId: 'CO-MDE',
  departureAt: '2025-12-01',
  passengers: 2,
  cabin: 'ECONOMICA'
});

// Reserve flight
const reservation = await flights.reserve({
  reservationId: generateUUID(),
  flightId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  clientId: 'CC-1032456789',
  passengers: [
    { name: 'Juan Perez', doc: 'CC-1032456789' },
    { name: 'Maria Garcia', doc: 'CC-9876543210' }
  ]
});

// Confirm with payment
await flights.confirm({
  flightReservationId: reservation.flightReservationId,
  transactionId: 'BDB-20251126-ABC123'
});

// Cancel if needed
await flights.cancel({
  confirmedId: reservation.flightReservationId,
  origin: 'CLIENTE',
  reason: 'Cambio de planes'
});
```

### 4. Hotel Search and Booking

```typescript
import { hotels } from '@/lib/api';

// Search hotels
const hotelResults = await hotels.search({
  cityId: 'CO-BOG',
  checkIn: '2025-12-20',
  checkOut: '2025-12-25',
  adults: 2,
  rooms: 1
});

// Reserve room
const reservation = await hotels.reserve({
  hotelId: 'a32ab199-4381-4d33-9c61-590b323e6e92',
  roomId: 'doble',
  clientId: 'CC-1234567890',
  checkIn: '2025-12-20',
  checkOut: '2025-12-25',
  reservationId: generateUUID(),
  rooms: 1,
  adults: 2
});

// Confirm with payment
await hotels.confirm({
  hotelReservationId: reservation.hotelReservationId,
  transactionId: 'BDB-20251126-HOTEL01'
});
```

### 5. Shopping Cart

```typescript
import { cart } from '@/lib/api';

// Add flight to cart
await cart.addItem({
  clientId: 'CC-1032456789',
  currency: 'COP',
  kind: 'AIR',
  refId: 'flight-001',
  quantity: 2,
  price: 450000,
  metadata: {
    flightId: '550e8400-e29b-41d4-a716-446655440000',
    passengers: [/* passenger data */]
  }
});

// Add hotel to cart
await cart.addItem({
  clientId: 'CC-1032456789',
  currency: 'COP',
  kind: 'HOTEL',
  refId: 'room-001',
  quantity: 1,
  price: 350000,
  metadata: {
    hotelId: '550e8400-e29b-41d4-a716-446655440001',
    roomId: 'room-standard-01',
    checkIn: '2025-12-20',
    checkOut: '2025-12-25'
  }
});

// View cart
const cartContents = await cart.get('CC-1032456789');

// Clear cart
await cart.clear('CC-1032456789');
```

### 6. Checkout Process

```typescript
import { checkout } from '@/lib/api';

// Get quote with margins
const quote = await checkout.quote({
  clientId: 'CC-1032456789'
});

// Confirm checkout
const confirmation = await checkout.confirm({
  clientId: 'CC-1032456789',
  currency: 'COP',
  cartId: cartId,
  description: 'Reserva de vuelo BOG-MDE y hotel en Cartagena',
  returnUrl: 'https://turismo.example.com/payments/return',
  callbackUrl: 'https://turismo.example.com/payments/webhook'
});
```

### 7. Payment Processing

```typescript
import { payments } from '@/lib/api';

// Check payment status
const status = await payments.statusByTransaction('BDB-20251126-ABC123');

// Handle webhook (bank notification)
await payments.webhook({
  transactionId: 'BDB-20251126-ABC123',
  paymentAttemptId: 'pay-ext-001',
  clientId: 'CC-1032456789',
  totalAmount: 945000,
  currency: 'COP',
  authCode: 'AUTH123456',
  receiptRef: 'https://banco.example.com/receipt/123',
  transactionAt: '2025-11-26T18:30:00Z',
  signature: 'abc123signaturehash',
  state: 'APROBADA'
});
```

### 8. Health Monitoring

```typescript
import { health } from '@/lib/api';

// Basic health check
const healthStatus = await health.check();

// Full readiness check
const readiness = await health.ready();
```

### 9. Reporting

```typescript
import { reporting } from '@/lib/api';

// Sales report
const salesData = await reporting.sales({
  startDate: '2025-01-01',
  endDate: '2025-12-31',
  currency: 'COP'
});

// Reservations summary
const reservationsData = await reporting.reservations();
```

## Error Handling

All services use the centralized `ApiError` class for error handling:

```typescript
import { ApiError } from '@/lib/api';

try {
  await flights.search(searchParams);
} catch (error) {
  if (error instanceof ApiError) {
    console.log('API Error:', error.status, error.message);
    console.log('Details:', error.data);
  } else {
    console.log('Network Error:', error);
  }
}
```

## Configuration

The API client uses these environment variables:

- `NEXT_PUBLIC_API_URL`: Frontend API URL (default: http://localhost:3000/v1)
- `BACKEND_URL`: Server-side API URL (for SSR)

## Data Governance Compliance

All services follow the data governance rules:

- **Client IDs**: Format `<tipoDoc>-<numero>` (e.g., `CC-1032456789`)
- **City IDs**: ISO 3166-2 format (e.g., `CO-BOG`, `CO-MDE`)
- **Currency**: ISO 4217 (e.g., `COP`)
- **Transaction IDs**: Format `<BANCO>-<YYYYMMDD>-<SUFIJO>` (e.g., `BDB-20251126-ABC123`)

## External Service Integration

The services connect to:

- **Turismo Backend**: `localhost:3001/v1` ✅
- **Aerolínea**: `10.43.103.34:8080/v1` ✅ 
- **Hotel**: `10.43.103.234:8080/manejadordb` ⚠️
- **Banco**: `localhost:3000/api/pagos/*` ⚠️

## Available Test Data

### Production Flight IDs (2025-12-01):
- `f47ac10b-58cc-4372-a567-0e02b2c3d479` (BOG→MDE, 08:00, $250,000)
- `c77ce5aa-b64a-4749-974a-8ba4a3336164` (BOG→MDE, 14:00, $280,000)
- `d6169429-f777-44d3-9c44-ff2b0a4c7300` (BOG→MDE, 18:00, $300,000)

### Production Hotel IDs:
- Bogotá: `a32ab199-4381-4d33-9c61-590b323e6e92` (Gran Hotel Andino)
- Cartagena: `618f172c-a72e-4098-aa04-de1d04cc4867` (Caribe Colonial Resort)