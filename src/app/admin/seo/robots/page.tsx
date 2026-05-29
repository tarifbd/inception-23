import { db } from '@/lib/db';
import { AdminModuleShell, adminCardClass } from '@/components/admin/AdminModuleShell';
import { seoNav } from '@/components/admin/SeoDashboardClient';

export default async function RobotsPage() {
  const settings = await db.seoSetting.upsert({ where: { id: 'default' }, update: {}, create: { id: 'default' } });

  return (
    <AdminModuleShell title="Robots.txt Editor" eyebrow="Crawler rules" nav={seoNav}>
      <div className={`${adminCardClass} p-5`}>
        <p className="mb-4 text-sm leading-7 text-gray-600">Current robots.txt content. Update through PATCH /api/v1/admin/seo/robots; the public file is available at /robots.txt.</p>
        <pre className="overflow-auto rounded-lg bg-gray-950 p-5 text-sm text-gray-100">{settings.robotsTxt}</pre>
      </div>
    </AdminModuleShell>
  );
}
