import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { assertAdmin } from '@/lib/authGuard';
import { errorResponse } from '@/lib/apiError';
import { inquiryPostSchema, deleteIdSchema } from '@/lib/validation';
import { getClientIp, isRateLimited } from '@/lib/rateLimit';

export async function GET() {
  const denied = await assertAdmin();
  if (denied) return denied;

  try {
    const inquiries = await db.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(inquiries);
  } catch (error) {
    return errorResponse('API Inquiries GET Error', error, 500, 'Failed to fetch inquiries');
  }
}

export async function POST(request: Request) {
  if (isRateLimited(`inquiries:${getClientIp(request)}`, 5)) {
    return NextResponse.json({ error: 'Too many requests. Please try again in a minute.' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const result = inquiryPostSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid inquiry.', details: result.error.flatten() }, { status: 400 });
    }
    const { name, email, message } = result.data;

    const newInquiry = await db.inquiry.create({
      data: { name, email, message },
    });

    return NextResponse.json({ success: true, inquiry: newInquiry }, { status: 201 });
  } catch (error) {
    return errorResponse('API Inquiries POST Error', error, 500, 'Failed to process inquiry');
  }
}

export async function DELETE(request: Request) {
  const denied = await assertAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();
    const result = deleteIdSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Inquiry id is required' }, { status: 400 });
    }

    await db.inquiry.delete({ where: { id: result.data.id } });

    return NextResponse.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (error) {
    return errorResponse('API Inquiries DELETE Error', error, 500, 'Failed to delete inquiry');
  }
}
