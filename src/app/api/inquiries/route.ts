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
    const inquiries = await db.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(inquiries);
  } catch (error) {
    console.error('API Inquiries GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const rateLimit = checkRateLimit(request, {
    key: 'inquiry',
    limit: 5,
    windowMs: 60 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many submissions. Please try again later.' },
      { status: 429, headers: rateLimit.headers },
    );
  }

  try {
    const body = await readJson<Record<string, unknown>>(request, 32 * 1024);

    if (typeof body.website === 'string' && body.website.trim()) {
      return NextResponse.json({ success: true }, { status: 202, headers: rateLimit.headers });
    }

    const name = assertString(body.name, 'Name', 120);
    const email = assertString(body.email, 'Email', 254).toLowerCase();
    const message = assertString(body.message, 'Message', 5000);

    if (!emailPattern.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400, headers: rateLimit.headers },
      );
    }

    const newInquiry = await db.inquiry.create({
      data: {
        name,
        email,
        message,
      },
    });

    return NextResponse.json(
      { success: true, inquiryId: newInquiry.id },
      { status: 201, headers: rateLimit.headers },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    const clientError = message === 'Request body is too large' || message === 'Invalid JSON body'
      || message.endsWith('is required') || message.endsWith('is too long');
    if (!clientError) console.error('API Inquiries POST Error:', error);
    return NextResponse.json(
      { error: clientError ? message : 'Failed to process inquiry' },
      { status: message === 'Request body is too large' ? 413 : clientError ? 400 : 500, headers: rateLimit.headers },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const forbidden = requirePermission(request, 'leads.manage');
  if (forbidden) return forbidden;

  try {
    const body = await readJson<Record<string, unknown>>(request, 8 * 1024);
    const id = assertString(body.id, 'Inquiry id', 100);

    await db.inquiry.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    const clientError = message === 'Request body is too large' || message === 'Invalid JSON body'
      || message.endsWith('is required') || message.endsWith('is too long');
    if (!clientError) console.error('API Inquiries DELETE Error:', error);
    return NextResponse.json(
      { error: clientError ? message : 'Failed to delete inquiry' },
      { status: message === 'Request body is too large' ? 413 : clientError ? 400 : 500 },
    );
  }
}
