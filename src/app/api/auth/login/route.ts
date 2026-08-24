import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { ADMIN_SESSION_COOKIE, SESSION_COOKIE_MAX_AGE, createSessionToken } from '@/lib/auth';
import { errorResponse } from '@/lib/apiError';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const password = typeof body.password === 'string' ? body.password : '';

    const hash = process.env.ADMIN_PASSWORD_HASH;
    if (!hash) {
      return errorResponse('Login Error', new Error('ADMIN_PASSWORD_HASH not configured'));
    }

    const valid = password.length > 0 && (await bcrypt.compare(password, hash));
    if (!valid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const token = await createSessionToken();
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_COOKIE_MAX_AGE,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse('Login Error', error);
  }
}
