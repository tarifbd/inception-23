import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requirePermission } from '@/lib/admin/rbac';
import { assertString, readJson } from '@/lib/api/http';
import { checkRateLimit } from '@/lib/security/rate-limit';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET(request: NextRequest) {
  const forbidden = requirePermission(request, 'leads.view');
  if (forbidden) return forbidden;

  try {
    const subscribers = await db.newsletterSubscriber.findMany({
      orderBy: { subscribedAt: 'desc' },
    });
    return NextResponse.json(subscribers);
  } catch (error) {
    console.error('API Newsletter GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const rateLimit = checkRateLimit(request, {
    key: 'newsletter',
    limit: 10,
    windowMs: 60 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many subscription attempts. Please try again later.' },
      { status: 429, headers: rateLimit.headers },
    );
  }

  try {
    const body = await readJson<Record<string, unknown>>(request, 8 * 1024);

    if (typeof body.website === 'string' && body.website.trim()) {
      return NextResponse.json({ success: true }, { status: 202, headers: rateLimit.headers });
    }

    const email = assertString(body.email, 'Email', 254).toLowerCase();
    if (!emailPattern.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400, headers: rateLimit.headers },
      );
    }

    await db.newsletterSubscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    });

    return NextResponse.json(
      { success: true, message: 'Subscription received.' },
      { status: 201, headers: rateLimit.headers },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    const clientError = message === 'Request body is too large' || message === 'Invalid JSON body'
      || message.endsWith('is required') || message.endsWith('is too long');
    if (!clientError) console.error('API Newsletter POST Error:', error);
    return NextResponse.json(
      { error: clientError ? message : 'Failed to process subscription' },
      { status: message === 'Request body is too large' ? 413 : clientError ? 400 : 500, headers: rateLimit.headers },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const forbidden = requirePermission(request, 'leads.manage');
  if (forbidden) return forbidden;

  try {
    const body = await readJson<Record<string, unknown>>(request, 8 * 1024);
    const id = assertString(body.id, 'Subscriber id', 100);

    await db.newsletterSubscriber.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Subscriber deleted successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    const clientError = message === 'Request body is too large' || message === 'Invalid JSON body'
      || message.endsWith('is required') || message.endsWith('is too long');
    if (!clientError) console.error('API Newsletter DELETE Error:', error);
    return NextResponse.json(
      { error: clientError ? message : 'Failed to delete subscriber' },
      { status: message === 'Request body is too large' ? 413 : clientError ? 400 : 500 },
    );
  }
}
