import { db } from '@/lib/db';
import { AdminModuleShell, adminCardClass } from '@/components/admin/AdminModuleShell';
import { seoNav } from '@/components/admin/SeoDashboardClient';

export default async function SeoSettingsPage() {
  const settings = await db.seoSetting.upsert({ where: { id: 'default' }, update: {}, create: { id: 'default' } });

  return (
    <AdminModuleShell title="SEO Settings" eyebrow="Global search defaults" nav={seoNav}>
      <div className={`${adminCardClass} p-5`}>
        <dl className="grid gap-4 md:grid-cols-2">
          {[
            ['Site name', settings.siteName],
            ['Default title', settings.defaultTitle],
            ['Title template', settings.titleTemplate],
            ['Default description', settings.defaultMetaDescription],
            ['Auto sitemap', settings.enableAutoSitemap ? 'Enabled' : 'Disabled'],
            ['Schema markup', settings.enableSchemaMarkup ? 'Enabled' : 'Disabled'],
            ['Open Graph', settings.enableOpenGraph ? 'Enabled' : 'Disabled'],
            ['Twitter cards', settings.enableTwitterCards ? 'Enabled' : 'Disabled'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <dt className="text-[10px] font-black uppercase tracking-wider text-gray-500">{label}</dt>
              <dd className="mt-1 text-sm font-bold text-gray-900">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </AdminModuleShell>
  );
}
