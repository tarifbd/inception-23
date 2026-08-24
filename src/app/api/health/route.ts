import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { assertAdmin } from '@/lib/authGuard';
import { errorResponse } from '@/lib/apiError';

export async function GET() {
  const denied = await assertAdmin();
  if (denied) return denied;

  try {
    await db.serviceCategory.count();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse('API Health Error', error, 503, 'Database unreachable');
  }
}
