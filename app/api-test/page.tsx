// File: app/api-test/page.tsx
"use client";
import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCatalogCities } from '../../lib/hooks/useCatalog';
import { apiClient } from '../../lib/api/client';
import type {
  CreateClientDto,
  CartAddItemDto,
  CheckoutConfirmRequestDto,
  CreateReservationDto,
} from '../../lib/types/generated/backend-dtos';

const qc = new QueryClient();

function CatalogList() {
  const { data, isLoading, error } = useCatalogCities();
  if (isLoading) return <div>Loading cities...</div>;
  if (error) return <div>Error: {String(error)}</div>;
  return (
    <div>
      <h2>Catalog cities</h2>
      <ul>
        {data?.map((c: any) => (
          <li key={c.id}>{c.name} {c.country ? `(${c.country})` : ''}</li>
        ))}
      </ul>
    </div>
  );
}



export default function Page() {
  // `clientDocId` holds document-style client identifier (p.ej. CC-12345678) required by some endpoints
  // `clientUuid` holds internal UUID returned by the backend when creating a client
  const [clientId, setClientId] = useState('');
  const [clientDocId, setClientDocId] = useState('');
  const [clientUuid, setClientUuid] = useState('');
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [authEmail, setAuthEmail] = useState('test@example.com');
  const [authPassword, setAuthPassword] = useState('password');
  const [output, setOutput] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [decodedPayload, setDecodedPayload] = useState<any>(null);
  const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/v1');

  const run = async (fn: () => Promise<any>) => {
    setLoading(true);
    setOutput(null);
    try {
      const res = await fn();
      setOutput(res);
      return res;
    } catch (e: any) {
      setOutput({ error: e?.message ?? String(e), detail: e });
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const doRegister = async () => {
    await run(() => apiClient('/auth/register', { method: 'POST', body: { email: authEmail, password: authPassword, name: 'Test User', role: 'EMPLOYEE' } }));
  };

  const doLogin = async () => {
    const res = await apiClient('/auth/login', { method: 'POST', body: { email: authEmail, password: authPassword } });
    const token = (res && (res.token || res.access_token || res.accessToken)) as string | undefined;
    if (token) {
      setAuthToken(token);
      setTokenInput(token);
      setOutput({ message: 'Logged in (token stored)', token });
    } else {
      setOutput({ message: 'Logged in (cookie may be set). If requests still 401, use Authorization header.', res });
    }
  };

  const apiCall = (path: string, opts: Record<string, any> = {}) => {
    const merged = { ...(opts || {}), authToken: authToken ?? undefined } as any;
    return apiClient(path, merged);
  };

  function makeRandomDigits(length: number) {
    let s = '';
    while (s.length < length) s += Math.floor(Math.random() * 10).toString();
    return s.slice(0, length);
  }

  function generateClientId() {
    const kinds = ['CC', 'NIT', 'CE', 'TI'];
    const kind = kinds[Math.floor(Math.random() * kinds.length)];
    const number = makeRandomDigits(8);
    return `${kind}-${number}`;
  }

  function generateRandomClientPayload() {
    const cid = generateClientId();
    const email = `test+${Date.now()}-${Math.floor(Math.random() * 10000)}@example.com`;
    const name = `Auto ${cid}`;
    return { name, email, role: 'EMPLOYEE', clientId: cid } as any;
  }

  function buildCurl(method: string, path: string, body?: any, extraHeaders?: Record<string,string>) {
    const url = `${API_BASE.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`;
    const headers: Record<string,string> = { 'Content-Type': 'application/json', ...(extraHeaders || {}) };
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
    const headerFlags = Object.entries(headers).map(([k,v]) => `-H '${k}: ${v}'`).join(' ');
    const bodyFlag = body ? `-d '${JSON.stringify(body)}'` : '';
    return `curl -v -X ${method} '${url}' ${headerFlags} ${bodyFlag}`;
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setOutput({ message: 'Comando copiado al portapapeles' });
    } catch (e) {
      setOutput({ error: 'No se pudo copiar' });
    }
  };

  function decodeJwtPayload(token: string) {
    try {
      const parts = token.split('.');
      if (parts.length < 2) return null;
      const payload = parts[1];
      // base64url -> base64
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(json);
    } catch (e) {
      return null;
    }
  }

  const setTokenFromInput = () => {
    setAuthToken(tokenInput || null);
    const decoded = tokenInput ? decodeJwtPayload(tokenInput) : null;
    setDecodedPayload(decoded);
    setOutput({ message: tokenInput ? 'Token set in memory' : 'Token cleared', token: tokenInput || null });
  };
  return (
    <QueryClientProvider client={qc}>
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-2xl font-semibold mb-4">API Test Dashboard</h1>
          <p className="text-sm text-slate-600 mb-6">Usa las secciones para probar los endpoints del backend. Todas las llamadas usan el `apiClient` central.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="md:col-span-2 bg-white shadow-sm rounded p-4">
              <CatalogList />
            </div>
            <div className="bg-white shadow-sm rounded p-4">
              <div className="text-sm text-slate-700">Quick info</div>
              <div className="mt-2 text-xs text-slate-500">Base URL: <code>http://localhost:3000/v1</code> (override with <code>NEXT_PUBLIC_API_URL</code>)</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded shadow p-4">
              <h2 className="text-lg font-medium">1. Autorización</h2>
              <p className="text-sm text-slate-600">Registra y loguea. Si el backend devuelve token, lo guardamos y lo usamos para llamadas protegidas; si setea cookie HttpOnly, las requests usarán cookies.</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <input className="border rounded px-2 py-1" value={authEmail} onChange={e => setAuthEmail(e.target.value)} placeholder="email" />
                <input className="border rounded px-2 py-1" value={authPassword} onChange={e => setAuthPassword(e.target.value)} placeholder="password" />
                <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={doRegister}>Register</button>
                <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={doLogin}>Login</button>
                <button className="bg-gray-500 text-white px-3 py-1 rounded" onClick={() => { setAuthToken(null); setOutput({ message: 'Logged out' }); }}>Logout</button>
              </div>
              <div className="mt-3 text-sm">
                <div className="mb-1"><strong>Token (in-memory):</strong></div>
                <div className="flex gap-2 items-center">
                  <input className="flex-1 border rounded px-2 py-1 text-xs" value={tokenInput} onChange={e => setTokenInput(e.target.value)} placeholder="pega aquí el token JWT..." />
                  <button className="bg-emerald-600 text-white px-3 py-1 rounded text-sm" onClick={setTokenFromInput}>Set token</button>
                  <button className="bg-gray-400 text-white px-3 py-1 rounded text-sm" onClick={() => { navigator.clipboard?.writeText(authToken ?? ''); }}>{'Copy'}</button>
                </div>
                <pre className="mt-2 p-2 bg-slate-100 rounded text-xs break-all">{authToken ?? '— no token —'}</pre>
                <div className="mt-2 text-xs text-slate-500">Payload décodificado:</div>
                <pre className="mt-1 p-2 bg-slate-50 rounded text-xs h-32 overflow-auto">{decodedPayload ? JSON.stringify(decodedPayload, null, 2) : '— no payload —'}</pre>
              </div>
            </div>

            <div className="bg-white rounded shadow p-4">
              <h2 className="text-lg font-medium">2. Clientes</h2>
              <p className="text-sm text-slate-600">Crear / consultar / actualizar / eliminar clientes. Recuerda usar un <code>clientId</code> válido donde aplique.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <input className="border rounded px-2 py-1" value={clientDocId || clientId} onChange={e => setClientDocId(e.target.value)} placeholder="clientId (p.ej., CC-12345678)" />
                <button className="bg-indigo-600 text-white px-3 py-1 rounded" onClick={async () => {
                  await run(async () => {
                    const body = { name: 'Test User', email: `test+${Date.now()}@example.com`, role: 'EMPLOYEE', clientId: clientDocId || clientId || 'CC-12345678' } as any;
                    const res = await apiCall('/clients', { method: 'POST', body });
                    // backend usually returns created client with `id` (UUID) — capture it
                    if (res && (res.id || res.uuid)) {
                      const id = res.id || res.uuid;
                      // store internal uuid
                      setClientUuid(id);
                      setClientId(id);
                      // ensure document id is stored (use provided body.clientId when available)
                      if (body.clientId) setClientDocId(body.clientId);
                      return { message: 'Cliente creado', client: res };
                    }
                    return res;
                  });
                }}>Crear cliente</button>
                <button className="bg-indigo-700 text-white px-3 py-1 rounded" onClick={async () => {
                  // crear cliente aleatorio para evitar colisiones
                  await run(async () => {
                    const body = generateRandomClientPayload();
                    const res = await apiCall('/clients', { method: 'POST', body });
                    if (res && (res.id || res.uuid)) {
                      const id = res.id || res.uuid;
                      setClientUuid(id);
                      setClientId(id);
                      if (body.clientId) setClientDocId(body.clientId);
                      return { message: 'Cliente aleatorio creado', client: res };
                    }
                    // fallback: if API returns clientId but no uuid, set that
                    if (res && res.clientId) {
                      // if backend returns clientId (document), store it as document id
                      setClientDocId(res.clientId);
                      setClientId(res.clientId);
                      return { message: 'Cliente creado (sin uuid devuelto)', client: res };
                    }
                    return res;
                  });
                }}>Crear cliente aleatorio</button>
                <button className="bg-sky-600 text-white px-3 py-1 rounded" disabled title="Este backend no expone listado general de clientes">Listar clientes (no expuesto)</button>
                <button className="bg-emerald-600 text-white px-3 py-1 rounded" onClick={() => run(() => apiCall(`/clients/${clientId}`, { method: 'GET' }))} disabled={!clientId}>Obtener cliente</button>
                <button className="bg-amber-600 text-white px-3 py-1 rounded" onClick={() => run(() => apiCall(`/clients/${clientId}`, { method: 'PATCH', body: { name: 'Updated Name' } }))} disabled={!clientId}>Actualizar</button>
                <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => run(() => apiCall(`/clients/${clientId}`, { method: 'DELETE' }))} disabled={!clientId}>Eliminar</button>
              </div>
            </div>

            <div className="bg-white rounded shadow p-4">
              <h2 className="text-lg font-medium">3. Carrito</h2>
              <p className="text-sm text-slate-600">Operaciones básicas del carrito.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button className="bg-slate-700 text-white px-3 py-1 rounded" onClick={() => run(() => apiCall(`/cart${clientId ? `?clientId=${encodeURIComponent(clientId)}` : ''}`, { method: 'GET' }))}>Ver carrito</button>
                <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => run(() => apiCall('/cart/items', { method: 'POST', body: { clientId: clientDocId || 'CC-12345678', currency: 'USD', kind: 'HOTEL', refId: `REF-${Date.now()}`, quantity: 1, price: 100, metadata: { hotelId: 'HOTEL-1', roomId: 'ROOM-1', checkIn: '2025-12-01', checkOut: '2025-12-05' } } }))}>Agregar item</button>
                <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => run(() => apiCall(`/cart?clientId=${encodeURIComponent(clientId || 'CC-12345678')}`, { method: 'DELETE' }))}>Limpiar carrito</button>
              </div>
            </div>

            <div className="bg-white rounded shadow p-4">
              <h2 className="text-lg font-medium">4. Checkout</h2>
              <p className="text-sm text-slate-600">Obtener quote y confirmar (Idempotency-Key de ejemplo incluida). Nota: primero agrega items al carrito para obtener un cartId válido.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button className="bg-indigo-600 text-white px-3 py-1 rounded" onClick={() => run(() => apiCall('/checkout/quote', { method: 'POST', body: { clientId: clientDocId || 'CC-12345678' } }))}>Quote</button>
                <button className="bg-emerald-600 text-white px-3 py-1 rounded" onClick={() => run(() => apiCall('/checkout/confirm', { method: 'POST', body: { clientId: clientDocId || 'CC-12345678', currency: 'USD', description: 'Test checkout', returnUrl: 'http://localhost:3001', callbackUrl: 'http://localhost:3001/api/bank/notificacion' }, idempotencyKey: `idem-${Date.now()}` }))}>Confirmar (Idempotency)</button>
              </div>
            </div>

            <div className="bg-white rounded shadow p-4">
              <h2 className="text-lg font-medium">5. Reservas</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                <button className="bg-sky-600 text-white px-3 py-1 rounded" onClick={async () => {
                  // list by clientUuid
                  if (!clientUuid) return setOutput({ error: 'Se necesita clientUuid para listar reservas. Crea un cliente primero.' });
                  await run(() => apiCall(`/reservations?clientUuid=${encodeURIComponent(clientUuid)}`, { method: 'GET' }));
                }}>Listar reservas por cliente</button>
                <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={async () => {
                  await run(async () => {
                    // ensure we have a UUID; generate if needed
                    let uuid = clientUuid;
                    if (!uuid) {
                      uuid = (crypto && (crypto as any).randomUUID) ? (crypto as any).randomUUID() : `gen-${Date.now()}`;
                      setClientUuid(uuid);
                    }
                    const body = { clientUuid: uuid, currency: 'USD', totalAmount: 100, note: 'test' };
                    return apiCall('/reservations', { method: 'POST', body });
                  });
                }}>Crear reserva</button>
                <button className="bg-emerald-600 text-white px-3 py-1 rounded" onClick={() => run(() => apiCall(`/reservations/${clientId}`, { method: 'GET' }))} disabled={!clientId} title="Usa el ID devuelto por 'Crear reserva'">Obtener reserva</button>
                <button className="bg-amber-600 text-white px-3 py-1 rounded" onClick={() => run(() => apiCall(`/reservations/${clientId}/cancel`, { method: 'PATCH', body: { reason: 'test cancel' } }))} disabled={!clientId} title="Usa el ID devuelto por 'Crear reserva'">Cancelar</button>
              </div>
            </div>

            <div className="bg-white rounded shadow p-4">
              <h2 className="text-lg font-medium">6. Reporting / Margins / Salud</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                <button className="bg-slate-600 text-white px-3 py-1 rounded" onClick={() => run(() => apiCall('/reporting/sales', { method: 'GET' }))}>Sales report</button>
                <button className="bg-slate-600 text-white px-3 py-1 rounded" onClick={() => run(() => apiCall('/reporting/reservations', { method: 'GET' }))}>Reservations report</button>
                <button className="bg-slate-600 text-white px-3 py-1 rounded" disabled title="Backend devuelve 404 — verificar si ruta existe">Margins rates (404)</button>
                <button className="bg-slate-600 text-white px-3 py-1 rounded" onClick={() => run(() => apiCall('/notifications/health', { method: 'GET' }))}>Notifications health</button>
                <button className="bg-slate-600 text-white px-3 py-1 rounded" onClick={() => run(() => apiCall('/health', { method: 'GET' }))}>Health</button>
                <button className="bg-slate-600 text-white px-3 py-1 rounded" onClick={() => run(() => apiCall('/ready', { method: 'GET' }))}>Ready</button>
              </div>
            </div>

            <div className="bg-white rounded shadow p-4">
              <h2 className="text-lg font-medium">Última respuesta / Output</h2>
              <div className="mt-3">
                <div className="text-sm text-slate-600">Salida JSON</div>
                <pre className="mt-2 p-3 bg-slate-50 border rounded h-56 overflow-auto text-xs">{JSON.stringify(output, null, 2)}</pre>
              </div>
            </div>

            <div className="bg-white rounded shadow p-4">
              <h2 className="text-lg font-medium">7. Comandos curl (copiar/pegar)</h2>
              <div className="mt-3 text-sm text-slate-600">Ejemplos `curl` dinámicos para reproducir peticiones desde consola.</div>
              <div className="mt-3 space-y-2 text-xs">
                <div>
                  <div className="font-medium">Crear cliente (ejemplo)</div>
                  <pre className="mt-1 p-2 bg-slate-50 rounded text-xs break-all">{buildCurl('POST','/clients', { name: 'Test User', email: 'test@example.com', role: 'EMPLOYEE', clientId: clientDocId || 'CC-12345678' })}</pre>
                  <div className="mt-1">
                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs" onClick={() => copyToClipboard(buildCurl('POST','/clients', { name: 'Test User', email: `test+${Date.now()}@example.com`, role: 'EMPLOYEE', clientId: clientDocId || 'CC-12345678' }))}>Copiar</button>
                  </div>
                </div>

                <div>
                  <div className="font-medium">Agregar item al carrito</div>
                  <pre className="mt-1 p-2 bg-slate-50 rounded text-xs break-all">{buildCurl('POST','/cart/items', { clientId: clientDocId || 'CC-12345678', currency: 'USD', kind: 'HOTEL', refId: 'REF-1234', quantity: 1, price: 100 })}</pre>
                  <div className="mt-1">
                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs" onClick={() => copyToClipboard(buildCurl('POST','/cart/items', { clientId: clientDocId || 'CC-12345678', currency: 'USD', kind: 'HOTEL', refId: `REF-${Date.now()}`, quantity: 1, price: 100 }))}>Copiar</button>
                  </div>
                </div>

                <div>
                  <div className="font-medium">Confirmar checkout (Idempotency)</div>
                  <pre className="mt-1 p-2 bg-slate-50 rounded text-xs break-all">{buildCurl('POST','/checkout/confirm', { clientId: clientDocId || 'CC-12345678', currency: 'USD', cartId: 'cart-1', description: 'Test checkout', returnUrl: 'http://localhost:3001', callbackUrl: 'http://localhost:3001/api-test/webhook' }, { 'Idempotency-Key': 'idem-EXAMPLE' })}</pre>
                  <div className="mt-1">
                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs" onClick={() => copyToClipboard(buildCurl('POST','/checkout/confirm', { clientId: clientDocId || 'CC-12345678', currency: 'USD', cartId: 'cart-1', description: 'Test checkout', returnUrl: 'http://localhost:3001', callbackUrl: 'http://localhost:3001/api-test/webhook' }, { 'Idempotency-Key': `idem-${Date.now()}` }))}>Copiar</button>
                  </div>
                </div>

                <div>
                  <div className="font-medium">Crear reserva</div>
                  <pre className="mt-1 p-2 bg-slate-50 rounded text-xs break-all">{buildCurl('POST','/reservations', { clientUuid: clientUuid || 'UUID-EXAMPLE', currency: 'USD', totalAmount: 100, note: 'test' })}</pre>
                  <div className="mt-1">
                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs" onClick={() => copyToClipboard(buildCurl('POST','/reservations', { clientUuid: clientUuid || `gen-${Date.now()}`, currency: 'USD', totalAmount: 100, note: 'test' }))}>Copiar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </QueryClientProvider>
  );
}
