# API Map (selected controllers)

Nota: todas las rutas están expuestas bajo el prefijo global `/v1` (ver `main.ts` en el backend).

Formato: `METHOD /v1/path` — **Auth**: si requiere JWT (JwtAuthGuard)

---

## Auth

- POST /v1/auth/register — **Auth**: no — Body: `RegisterDto` (email, password, name...)
- POST /v1/auth/login — **Auth**: no — Body: `LoginDto` (email, password)

## Clients

- POST /v1/clients — **Auth**: yes — Body: `CreateClientDto`
- GET /v1/clients/:id — **Auth**: yes
- PATCH /v1/clients/:id — **Auth**: yes — Body: `UpdateClientDto`
- DELETE /v1/clients/:id — **Auth**: yes

## Cart

- POST /v1/cart/items — **Auth**: yes — Body: `CartAddItemDto`
- GET /v1/cart?clientId=... — **Auth**: yes — Response: `CartViewResponseDto`
- DELETE /v1/cart/items/:id?clientId=... — **Auth**: yes
- DELETE /v1/cart?clientId=... — **Auth**: yes

## Catalog

- GET /v1/catalog/cities — **Auth**: no — Response: array de `CityDto`

## Checkout

- POST /v1/checkout/quote — **Auth**: yes — Body: `CheckoutQuoteRequestDto` — Response: `CheckoutQuoteResponseDto`
- POST /v1/checkout/confirm — **Auth**: yes — Body: `CheckoutConfirmRequestDto` — Header opcional: `Idempotency-Key` — Response: `CheckoutConfirmResponseDto`

## Reservations

- POST /v1/reservations — **Auth**: yes — Body: `CreateReservationDto`
- GET /v1/reservations/:id — **Auth**: yes
- GET /v1/reservations?clientUuid=... — **Auth**: yes
- PATCH /v1/reservations/:id/cancel — **Auth**: yes — Body: `CancelReservationDto`

## Reporting

- GET /v1/reporting/sales?startDate=...&endDate=... — **Auth**: yes — Params: ISO dates (opcionales)
- GET /v1/reporting/reservations — **Auth**: yes

## Margins

- GET /v1/margins/rates — **Auth**: no — Response: objeto con `hotel` y `air` margenes

## Notifications

- GET /v1/notifications/health — **Auth**: no

## Health

- GET /v1/health — **Auth**: no
- GET /v1/ready — **Auth**: no

---

Notas adicionales:

- Si el backend requiere cookies HttpOnly para la sesión, el frontend debe usar `credentials: 'include'` (ya configurado en `lib/api/client.ts`).
- Para endpoints protegidos por JWT desde el navegador, puedes usar la cookie de sesión HttpOnly o enviar `authToken` en llamadas SSR.
- Si quieres que incluya los DTOs (shape de request/response) extraídos de los archivos del backend, dímelo y los generaré en este mismo `docs/API-map.md` o en un archivo separado `docs/API-dtos.md`.
