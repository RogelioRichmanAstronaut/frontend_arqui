// File: README_API_CLIENT.md

# API Client integration (front)

Resumen rápido:

- Cliente HTTP central: `lib/api/client.ts` (fetch nativo, compatible SSR).
- Tipos: `lib/types/api.ts`
- Endpoints: `lib/api/*.ts` (auth, clients, cart, checkout, payments, reservations, catalog)
- Hooks (React Query): `lib/hooks/*`
- CSR Auth Provider: `lib/context/AuthProvider.tsx`
- Next.js login route (sets HttpOnly cookie): `app/api/auth/login/route.ts`

Instalación recomendada (desde la raíz del proyecto):

```bash
npm install @tanstack/react-query uuid
# si usas TypeScript
npm install -D @types/uuid
```

Variables de entorno:

- `NEXT_PUBLIC_API_URL` — URL base del backend (por ejemplo `https://api.example.com`).
  o alternativamente `BACKEND_URL` (servidor only).

Cómo usar (SSR):

- En `pages` usa `getServerSideProps` y lee `ctx.req.cookies['session_token']` y pásalo en Authorization Bearer.

Ejemplo login (ruta incluida):

- POST `/api/auth/login` -> body `{ email, password }`. Esta ruta llama al backend y setea cookie HttpOnly `session_token`.

Idempotency-Key:

- Para endpoints como `/checkout/confirm` y `/payments/init`, los helpers aceptan un `idempotencyKey` opcional. Usa `lib/utils/idempotency.ts` para generar `uuidv4()`.

Tests:

- El repo tiene un test ejemplo `tests/hooks/useAddCartItem.test.tsx` que mockea `fetch`.

Limitaciones y notas:

- La estrategia recomendada de sesión es cookie HttpOnly establecida por la ruta `/api/auth/login`.
- Alternativa CSR: usar `AuthProvider` en memoria y enviar token en Authorization; mayor riesgo XSS si se guarda en localStorage.
