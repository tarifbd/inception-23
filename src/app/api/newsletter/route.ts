import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { assertAdmin } from '@/lib/authGuard';
import { errorResponse } from '@/lib/apiError';
import { newsletterPostSchema, deleteIdSchema } from '@/lib/validation';
import { getClientIp, isRateLimited } from '@/lib/rateLimit';

export async function GET() {
  const denied = await assertAdmin();
  if (denied) return denied;

  try {
    const subscribers = await db.newsletterSubscriber.findMany({
      orderBy: { subscribedAt: 'desc' },
    });
    return NextResponse.json(subscribers);
  } catch (error) {
    return errorResponse('API Newsletter GET Error', error, 500, 'Failed to fetch subscribers');
  }
}

export async function POST(request: Request) {
  if (isRateLimited(`newsletter:${getClientIp(request)}`, 5)) {
    return NextResponse.json({ error: 'Too many requests. Please try again in a minute.' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const result = newsletterPostSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }
    const { email } = result.data;

    const existing = await db.newsletterSubscriber.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ success: true, message: 'Already subscribed!', subscriber: existing });
    }

    const newSubscriber = await db.newsletterSubscriber.create({ data: { email } });

    return NextResponse.json({ success: true, subscriber: newSubscriber }, { status: 201 });
  } catch (error) {
    return errorResponse('API Newsletter POST Error', error, 500, 'Failed to process subscription');
  }
}

export async function DELETE(request: Request) {
  const denied = await assertAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();
    const result = deleteIdSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Subscriber id is required' }, { status: 400 });
    }

    await db.newsletterSubscriber.delete({ where: { id: result.data.id } });

    return NextResponse.json({ success: true, message: 'Subscriber deleted successfully' });
  } catch (error) {
    return errorResponse('API Newsletter DELETE Error', error, 500, 'Failed to delete subscriber');
  }
}
