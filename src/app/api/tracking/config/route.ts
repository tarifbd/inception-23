import { defaultTrackingSettings, getTrackingSettings, toPublicTrackingSettings } from '@/lib/tracking';

export const dynamic = 'force-dynamic';

export async function GET() {
  // A database outage must fail closed without breaking public page initialization.
  // Keep admin/settings failures visible; this fallback applies only to public config.
  const settings = await getTrackingSettings().catch(() => {
    console.error('Public tracking configuration unavailable; tracking disabled for this request.');
    return defaultTrackingSettings;
  });
  return Response.json(
    { data: toPublicTrackingSettings(settings) },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
