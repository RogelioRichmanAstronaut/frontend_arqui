// File: app/api/auth/login/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const BACKEND = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/v1';
  
  // Ensure the URL includes /v1 prefix if not already present
  const baseUrl = BACKEND.replace(/\/$/, '');
  const apiUrl = baseUrl.includes('/v1') ? `${baseUrl}/auth/login` : `${baseUrl}/v1/auth/login`;

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    return NextResponse.json({ message: data?.message ?? 'Login failed' }, { status: res.status });
  }

  // Backend returns access_token, but handle both token and access_token for compatibility
  const token = data?.access_token || data?.token;
  if (!token) return NextResponse.json({ message: 'Token not returned by auth' }, { status: 500 });

  // Set HttpOnly cookie
  // Note: In development, Secure should be false unless using HTTPS
  const isProduction = process.env.NODE_ENV === 'production';
  const cookie = `session_token=${token}; HttpOnly; Path=/; ${isProduction ? 'Secure;' : ''} SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`;

  const r = NextResponse.json({ success: true, token, user: data?.user });
  r.headers.set('Set-Cookie', cookie);
  return r;
}
