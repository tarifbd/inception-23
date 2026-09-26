import { after, NextRequest, NextResponse } from 'next/server';
import { sha256 } from '@/lib/meta/core';
import { recordLead, requestTracking, safeDrainMeta } from '@/lib/meta/server';
import { isSameOriginMutation } from '@/lib/admin/auth';
import { db } from '@/lib/db';
import { assertString, optionalString, readJson } from '@/lib/api/http';
import { checkRateLimit } from '@/lib/security/rate-limit';

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: NextRequest) {
  if (!isSameOriginMutation(request)) return new Response(null, { status: 403 });
  const rateLimit = checkRateLimit(request, {
    key: 'contact',
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
    const company = optionalString(body.company, 180);
    const serviceInterest = optionalString(body.serviceInterest, 120);
    const message = assertString(body.message, 'Message', 5000);

    if (!isEmail(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400, headers: rateLimit.headers },
      );
    }

    const requestKey = typeof body.requestKey === 'string' && /^[a-f0-9-]{36}$/i.test(body.requestKey) ? body.requestKey : undefined;
    const requestHash = sha256(JSON.stringify({ name, email, company, serviceInterest, message }));
    const data = {
        name,
        email,
        company,
        serviceInterest,
        message,
        requestKey,
        requestHash,
        metaConsent: requestTracking(request, body.tracking).consent,
    };
    const submission = requestKey
      ? await db.contactSubmission.upsert({ where: { requestKey }, update: {}, create: data })
      : await db.contactSubmission.create({ data });
    if (submission.requestHash !== requestHash) return NextResponse.json({ error: 'Submission key already used for different form data.' }, { status: 409 });
    const tracking = await recordLead(request, body.tracking, submission.id, submission.email, 'inquiry', submission.metaConsent, submission.createdAt);
    after(safeDrainMeta);

    return NextResponse.json(
      { success: true, submissionId: submission.id, tracking },
      { status: 201, headers: rateLimit.headers },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    const clientError = message === 'Request body is too large' || message === 'Invalid JSON body'
      || message.endsWith('is required') || message.endsWith('is too long')
      || message === 'Expected string' || message === 'Value is too long';
    if (!clientError) console.error('Contact submission error:', error);

    return NextResponse.json(
      { error: clientError ? message : 'Failed to submit inquiry.' },
      { status: message === 'Request body is too large' ? 413 : clientError ? 400 : 500, headers: rateLimit.headers },
    );
  }
}
