// File: app/api/auth/login/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const BACKEND = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL;
  if (!BACKEND) return NextResponse.json({ message: 'BACKEND_URL not configured' }, { status: 500 });

  const res = await fetch(`${BACKEND.replace(/\/$/, '')}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    return NextResponse.json({ message: data?.message ?? 'Login failed' }, { status: res.status });
  }

  const token = data?.token;
  if (!token) return NextResponse.json({ message: 'Token not returned by auth' }, { status: 500 });

  // Set HttpOnly cookie
  const cookie = `session_token=${token}; HttpOnly; Path=/; Secure; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}`;

  const r = NextResponse.json({ success: true });
  r.headers.set('Set-Cookie', cookie);
  return r;
}
