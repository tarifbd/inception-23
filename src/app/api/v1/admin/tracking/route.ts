import type { NextRequest } from 'next/server';
import { requirePermission } from '@/lib/admin/rbac';
import { readJson } from '@/lib/api/http';
import { getTrackingSettings, normalizeTrackingSettings, saveTrackingSettings, trackingProviders } from '@/lib/tracking';

export async function GET(request: NextRequest) {
  const forbidden = requirePermission(request, 'tracking.view');
  if (forbidden) return forbidden;
  return Response.json({ data: await getTrackingSettings(), providers: trackingProviders });
}

export async function PUT(request: NextRequest) {
  const forbidden = requirePermission(request, 'tracking.manage');
  if (forbidden) return forbidden;
  try {
    const payload = normalizeTrackingSettings(await readJson(request, 128 * 1024));
    return Response.json({ data: await saveTrackingSettings(payload), providers: trackingProviders });
  } catch (error) {
    console.error('Tracking settings update failed:', error);
    const message = error instanceof Error ? error.message : '';
    const clientError = message === 'Request body is too large' || message === 'Invalid JSON body';
    return Response.json(
      { error: clientError ? message : 'Could not save tracking settings.' },
      { status: message === 'Request body is too large' ? 413 : clientError ? 400 : 500 },
    );
  }
}
