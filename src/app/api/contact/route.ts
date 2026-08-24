import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { assertAdmin } from '@/lib/authGuard';
import { errorResponse } from '@/lib/apiError';
import { contactSchema } from '@/lib/validation';
import { getClientIp, isRateLimited } from '@/lib/rateLimit';

export async function GET() {
  const denied = await assertAdmin();
  if (denied) return denied;

  try {
    const submissions = await db.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(submissions);
  } catch (error) {
    return errorResponse('API Contact GET Error', error, 500, 'Failed to fetch contact submissions');
  }
}

export async function POST(request: Request) {
  if (isRateLimited(`contact:${getClientIp(request)}`, 5)) {
    return NextResponse.json({ error: 'Too many requests. Please try again in a minute.' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid submission.', details: result.error.flatten() }, { status: 400 });
    }
    const { name, email, company, serviceInterest, message } = result.data;

    const submission = await db.contactSubmission.create({
      data: {
        name,
        email,
        company: company || null,
        serviceInterest: serviceInterest || null,
        message,
      },
    });

    return NextResponse.json({ success: true, data: submission }, { status: 201 });
  } catch (error) {
    return errorResponse('Contact submission error', error, 500, 'Failed to submit inquiry.');
  }
}
