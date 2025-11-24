// File: lib/api/client.ts
import { ApiError } from '../utils/apiError';

export type ApiClientOptions = {
  method?: string;
  body?: any;
  headers?: HeadersInit;
  authToken?: string; // explicit token for SSR
  idempotencyKey?: string;
};

// Default backend for development: backend will run on localhost:3000 and expose API under /v1
const BASE = process.env.NEXT_PUBLIC_API_URL ?? process.env.BACKEND_URL ?? 'http://localhost:3000/v1';

function buildUrl(path: string) {
  if (path.startsWith('http')) return path;
  return `${BASE.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`;
}

export async function apiClient<T = any>(path: string, opts: ApiClientOptions = {}): Promise<T> {
  const url = buildUrl(path);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers as Record<string, string> || {}),
  };

  if (opts.authToken) {
    headers['Authorization'] = `Bearer ${opts.authToken}`;
  } else if (typeof window !== 'undefined') {
    // CSR: get token from localStorage
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  if (opts.idempotencyKey) {
    headers['Idempotency-Key'] = opts.idempotencyKey;
  }

  const init: RequestInit = {
    method: opts.method ?? (opts.body ? 'POST' : 'GET'),
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    credentials: 'include', // allow cookies for same-site usage
  };

  const res = await fetch(url, init as RequestInit);

  const contentType = res.headers.get('content-type') ?? '';

  if (!res.ok) {
    let data: any = null;
    try {
      data = contentType.includes('application/json') ? await res.json() : await res.text();
    } catch (e) {
      data = null;
    }
    const message = (data && data.message) || res.statusText || 'API Error';

    // Helpful debug log for server-side 5xx errors during development
    if (res.status >= 500 && process.env.NODE_ENV !== 'production') {
      try {
        // eslint-disable-next-line no-console
        console.error('[apiClient] Server error', { url, init, status: res.status, data });
      } catch (e) {
        // ignore logging errors
      }
    }

    throw new ApiError(res.status, message, data);
  }

  if (res.status === 204) return null as unknown as T;

  if (contentType.includes('application/json')) {
    return (await res.json()) as T;
  }

  return (await res.text()) as unknown as T;
}
