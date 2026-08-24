import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/auth';

/**
 * Call at the top of any route handler that requires an authenticated admin.
 * Returns a 401 NextResponse to return immediately, or null if the caller is authorized.
 */
export async function assertAdmin(): Promise<NextResponse | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const valid = await verifySessionToken(token);
  if (!valid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}
