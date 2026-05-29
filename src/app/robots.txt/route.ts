import { db } from '@/lib/db';

export async function GET() {
  const settings = await db.seoSetting.upsert({ where: { id: 'default' }, update: {}, create: { id: 'default' } });
  return new Response(settings.robotsTxt, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
