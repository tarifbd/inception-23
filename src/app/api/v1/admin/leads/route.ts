import type { NextRequest } from 'next/server';
import { requirePermission } from '@/lib/admin/rbac';
import { assertString, readJson } from '@/lib/api/http';
import { db } from '@/lib/db';

const leadTypes = ['contact', 'inquiry', 'newsletter'] as const;
type LeadType = (typeof leadTypes)[number];

function parseType(value: string | null): LeadType {
  return leadTypes.includes(value as LeadType) ? value as LeadType : 'contact';
}

function parsePositiveInteger(value: string | null, fallback: number, maximum: number) {
  const parsed = Number.parseInt(value || '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, maximum) : fallback;
}

export async function GET(request: NextRequest) {
  const forbidden = requirePermission(request, 'leads.view');
  if (forbidden) return forbidden;

  const type = parseType(request.nextUrl.searchParams.get('type'));
  const page = parsePositiveInteger(request.nextUrl.searchParams.get('page'), 1, 100_000);
  const limit = parsePositiveInteger(request.nextUrl.searchParams.get('limit'), 20, 50);
  const skip = (page - 1) * limit;

  if (type === 'newsletter') {
    const [data, total] = await Promise.all([
      db.newsletterSubscriber.findMany({ orderBy: { subscribedAt: 'desc' }, skip, take: limit }),
      db.newsletterSubscriber.count(),
    ]);
    return Response.json({ data, meta: { type, page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) } });
  }

  if (type === 'inquiry') {
    const [data, total] = await Promise.all([
      db.inquiry.findMany({ orderBy: { createdAt: 'desc' }, skip, take: limit }),
      db.inquiry.count(),
    ]);
    return Response.json({ data, meta: { type, page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) } });
  }

  const [data, total] = await Promise.all([
    db.contactSubmission.findMany({ orderBy: { createdAt: 'desc' }, skip, take: limit }),
    db.contactSubmission.count(),
  ]);
  return Response.json({ data, meta: { type, page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) } });
}

export async function PATCH(request: NextRequest) {
  const forbidden = requirePermission(request, 'leads.manage');
  if (forbidden) return forbidden;

  try {
    const body = await readJson<Record<string, unknown>>(request, 8 * 1024);
    const id = assertString(body.id, 'Lead id', 100);
    const status = assertString(body.status, 'Status', 30);
    if (!['new', 'in-progress', 'resolved', 'spam'].includes(status)) {
      return Response.json({ error: 'Unsupported lead status' }, { status: 400 });
    }
    const data = await db.contactSubmission.update({ where: { id }, data: { status } });
    return Response.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to update lead';
    return Response.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const forbidden = requirePermission(request, 'leads.manage');
  if (forbidden) return forbidden;

  try {
    const body = await readJson<Record<string, unknown>>(request, 8 * 1024);
    const type = parseType(typeof body.type === 'string' ? body.type : null);
    const id = assertString(body.id, 'Lead id', 100);

    if (type === 'newsletter') await db.newsletterSubscriber.delete({ where: { id } });
    else if (type === 'inquiry') await db.inquiry.delete({ where: { id } });
    else await db.contactSubmission.delete({ where: { id } });

    return Response.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to delete lead';
    return Response.json({ error: message }, { status: 400 });
  }
}
