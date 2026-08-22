import { getTrackingSettings, toPublicTrackingSettings } from '@/lib/tracking';

export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json(
    { data: toPublicTrackingSettings(await getTrackingSettings()) },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
