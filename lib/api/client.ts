// File: lib/api/client.ts
import { ApiError } from '../utils/apiError';

export type ApiClientOptions = {
  method?: string;
  body?: any;
  headers?: HeadersInit;
  authToken?: string; // explicit token for SSR
  idempotencyKey?: string;
  timeout?: number; // request timeout in milliseconds
};

// Environment configuration
const config = {
  // API URLs
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? process.env.BACKEND_URL ?? 'http://localhost:3001/v1',
  airlineUrl: process.env.NEXT_PUBLIC_AIRLINE_API_URL ?? 'http://10.43.103.34:8080/v1',
  hotelUrl: process.env.NEXT_PUBLIC_HOTEL_API_URL ?? 'http://10.43.103.234:8080/manejadordb',
  bankUrl: process.env.NEXT_PUBLIC_BANK_API_URL ?? 'http://localhost:3000',
  
  // Timeouts
  defaultTimeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT ?? '30000'),
  airlineTimeout: parseInt(process.env.NEXT_PUBLIC_AIRLINE_TIMEOUT ?? '15000'),
  hotelTimeout: parseInt(process.env.NEXT_PUBLIC_HOTEL_TIMEOUT ?? '20000'),
  bankTimeout: parseInt(process.env.NEXT_PUBLIC_BANK_TIMEOUT ?? '45000'),
  
  // Debug settings
  debugMode: process.env.NEXT_PUBLIC_DEBUG_API === 'true',
  logRequests: process.env.NEXT_PUBLIC_LOG_API_REQUESTS === 'true',
  
  // Auth settings
  tokenKey: process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY ?? 'auth_token',
};

function buildUrl(path: string) {
  // If path is already a full URL, return it as is
  if (path.startsWith('http')) return path;
  
  // Normalize BASE: remove trailing slashes
  const base = config.baseUrl.replace(/\/+$/, '');
  
  // Normalize path: ensure it starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // Combine base and path
  return `${base}${normalizedPath}`;
}

export async function apiClient<T = any>(path: string, opts: ApiClientOptions = {}): Promise<T> {
  const url = buildUrl(path);
  const timeout = opts.timeout ?? config.defaultTimeout;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers as Record<string, string> || {}),
  };

  if (opts.authToken) {
    headers['Authorization'] = `Bearer ${opts.authToken}`;
  } else if (typeof window !== 'undefined') {
    // CSR: get token from localStorage
    const token = localStorage.getItem(config.tokenKey);
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

  // Add timeout support
  const controller = new AbortController();
  init.signal = controller.signal;
  
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    // Log request if debug mode is enabled
    if (config.logRequests && config.debugMode) {
      console.log('[API Request]', {
        url,
        method: init.method,
        headers: init.headers,
        body: opts.body,
        timestamp: new Date().toISOString()
      });
    }

    const res = await fetch(url, init as RequestInit);
    clearTimeout(timeoutId);

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
      if (res.status >= 500 && config.debugMode) {
        try {
          console.error('[apiClient] Server error', { 
            url, 
            init, 
            status: res.status, 
            data,
            timestamp: new Date().toISOString()
          });
        } catch (e) {
          // ignore logging errors
        }
      }

      throw new ApiError(res.status, message, data);
    }

    if (res.status === 204) return null as unknown as T;

    let responseData: T;
    if (contentType.includes('application/json')) {
      responseData = (await res.json()) as T;
    } else {
      responseData = (await res.text()) as unknown as T;
    }

    // Log response if debug mode is enabled
    if (config.logRequests && config.debugMode) {
      console.log('[API Response]', {
        url,
        status: res.status,
        data: responseData,
        timestamp: new Date().toISOString()
      });
    }

    return responseData;

  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError(408, `Request timeout after ${timeout}ms`, null);
    }
    
    throw error;
  }
}

// Export configuration for use in other modules
export { config as apiConfig };
