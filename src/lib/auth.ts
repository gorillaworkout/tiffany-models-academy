import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Secret key untuk JWT — diambil dari environment variable, dengan fallback default
const secretKey = process.env.JWT_SECRET || 'tiffany-models-academy-top-secret-key-2026';
const key = new TextEncoder().encode(secretKey);

// Bikin tiket login (Token JWT) yang kadaluarsa 7 hari
export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7 d')
    .sign(key);
}

// Cek dan bongkar tiket login (Token JWT) dari browser murid
export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload;
}

// Helper untuk middleware atau halaman Server Components
export async function getSession() {
  const session = cookies().get('tma_session')?.value;
  if (!session) return null;
  return await decrypt(session);
}
