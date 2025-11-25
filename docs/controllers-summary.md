# Resumen de controladores (generado)

Base API

- Base URL en dev: `http://localhost:3000/v1` (prefijo global `v1`).
- Autenticación: cookie HttpOnly `session_token` preferida (usar proxy Next), o `Authorization: Bearer <JWT>`.

---

Listado de controladores detectados (ordenados por módulo)

## Auth — `auth.controller.ts`

- Auth required: No
- Métodos:
  - `POST /auth/register` — Request: `RegisterDto` → Response: created user DTO
  - `POST /auth/login` — Request: `LoginDto` → Response: `{ access_token, user }` (nota: front puede mapear a `{ token, user }`)

Consumo front: público. Para cookie HttpOnly use `POST /api/auth/login` (Next) como proxy al backend.

## Bookings — `bookings.controller.ts`

- Auth required: Sí
- Métodos (ejemplos):
  - `POST /bookings/air/search` — Request: `AirlineSearchRequestDto` → Response: `AirlineSearchResponseDto`
  - `POST /bookings/air/reserve` — Request: `AirlineReserveRequestDto` → Response: `AirlineReserveResponseDto`
  - `POST /bookings/hotels/search` — Request: `HotelSearchRequestDto` → Response: `HotelSearchResponseDto`

Consumo front: protegido (Authorization o proxy Next con credentials).

## Cart — `cart.controller.ts`

- Auth required: Sí
- Métodos:
  - `POST /cart/items` — Request: `CartAddItemDto` → Response: `CartViewResponseDto`
  - `GET /cart?clientId=...` — Response: `CartViewResponseDto`
  - `DELETE /cart/items/:id?clientId=...` — Response: `CartViewResponseDto`
  - `DELETE /cart?clientId=...` — Response: `CartViewResponseDto`

Consumo front: usar `credentials: 'include'` para cookies o Authorization header; no requiere Idempotency.

## Catalog — `catalog.controller.ts`

- Auth required: No
- Métodos:
  - `GET /catalog/cities` — Response: `CityDto[]`

## Checkout — `checkout.controller.ts`

- Auth required: Sí
- Métodos:
  - `POST /checkout/quote` — Request: `CheckoutQuoteRequestDto` → Response: `CheckoutQuoteResponseDto`
  - `POST /checkout/confirm` — Request: `CheckoutConfirmRequestDto` → Response: `CheckoutConfirmResponseDto` (usar header `Idempotency-Key`)

Consumo front: incluir `Idempotency-Key` en confirm; preferir proxy Next para cookies HttpOnly.

## Clients — `clients.controller.ts`

- Auth required: Sí
- Métodos:
  - `POST /clients` — Request: `CreateClientDto` → Response: client DTO
  - `GET /clients/:id` — Response: client DTO
  - `PATCH /clients/:id` — Request: `UpdateClientDto` → Response: client DTO
  - `DELETE /clients/:id` — Response: status

## Margins — `margins.controller.ts`

- Auth required: No (según controlador)
- Métodos:
  - `GET /margins/rates` — Response: margins info (ej. `{ hotel: number, air: number }`)

## Notifications — `notifications.controller.ts`

- Auth required: No (health endpoint)
- Métodos:
  - `GET /notifications/health` — Response: health info

## Observability / Health — `health.controller.ts`

- Auth required: No
- Métodos:
  - `GET /health`
  - `GET /ready`

## Payments — `payments.controller.ts`

- Auth required: mixto (algunas rutas protegidas)
- Métodos:
  - `POST /payments/init` — Request: `BankInitiatePaymentRequestDto` → Response: `BankInitiatePaymentResponseDto` (JWT + `Idempotency-Key`)
  - `POST /payments/webhook` — Request: `BankPaymentNotificationDto` → Response: `BankAckResponseDto` (pública)
  - `GET /payments/status` — Query → Response: status (protegido)

## Reporting — `reporting.controller.ts`

- Auth required: probablemente sí
- Métodos:
  - `GET /reporting/sales`
  - `GET /reporting/reservations`

## Reservations — `reservations.controller.ts`

- Auth required: Sí
- Métodos:
  - `POST /reservations` — Request: `CreateReservationDto` → Response: reservation DTO
  - `GET /reservations/:id`
  - `GET /reservations?clientUuid=`
  - `PATCH /reservations/:id/cancel`

## Orders — `order.controller.ts`

- Archivo presente pero vacío / no implementado en este momento.

---

Recomendaciones rápidas

- Usar cookie HttpOnly + proxy Next para producción; Authorization header para pruebas rápidas.
- Incluir `Idempotency-Key` en `/checkout/confirm` y `/payments/init`.
- Generar tipos TS desde los DTOs del backend y colocarlos en `lib/types/generated/` del frontend para consumo directo.

Si quieres que genere archivos con esta información en el repositorio, dime:

1. Crear `docs/controllers-summary.md` (hecho).
2. Generar tipos TS a partir de DTOs para el frontend (puedo generar un archivo en `lib/types/generated/`).
3. Exportar Postman collection (JSON) con los endpoints listos.

Indica si quieres que además genere los tipos TS en `frontend_arqui/lib/types/generated/` (recomendado) o en una carpeta compartida `frontend_generated/`.

---

_Archivo generado automáticamente por la herramienta de prueba API._
