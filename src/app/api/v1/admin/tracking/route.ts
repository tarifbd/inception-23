import type { NextRequest } from 'next/server';
import { requirePermission } from '@/lib/admin/rbac';
import { readJson } from '@/lib/api/http';
import { getTrackingSettings, normalizeTrackingSettings, saveTrackingSettings, trackingProviders, maskedTrackingSettings, secretFields, secretMask } from '@/lib/tracking';

export async function GET(request: NextRequest) {
  const forbidden = requirePermission(request, 'tracking.view');
  if (forbidden) return forbidden;
  return Response.json({ data: maskedTrackingSettings(await getTrackingSettings()), providers: trackingProviders });
}

export async function PUT(request: NextRequest) {
  const forbidden = requirePermission(request, 'tracking.manage');
  if (forbidden) return forbidden;
  try {
    const payload = normalizeTrackingSettings(await readJson(request, 128 * 1024));
    const previous = await getTrackingSettings();
    for (const provider of Object.values(payload.providers)) {
      for (const field of secretFields) {
        if (provider[field] === secretMask) provider[field] = previous.providers[provider.id][field];
      }
    }
    const meta = payload.providers.facebook;
    if (meta.publicId && !/^\d{5,30}$/.test(meta.publicId)) return Response.json({ error: 'Meta Pixel / Dataset ID must contain 5–30 digits.' }, { status: 400 });
    if (meta.debugMode && !meta.testEventCode) return Response.json({ error: 'Test mode requires a Test Event Code.' }, { status: 400 });
    return Response.json({ data: maskedTrackingSettings(await saveTrackingSettings(payload)), providers: trackingProviders });
  } catch (error) {
    console.error('Tracking settings update failed');
    const message = error instanceof Error ? error.message : '';
    const clientError = message === 'Request body is too large' || message === 'Invalid JSON body';
    return Response.json(
      { error: clientError ? message : 'Could not save tracking settings.' },
      { status: message === 'Request body is too large' ? 413 : clientError ? 400 : 500 },
    );
  }
}
