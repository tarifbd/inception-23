import { db } from '@/lib/db';
import { AdminModuleShell, adminCardClass } from '@/components/admin/AdminModuleShell';
import { seoNav } from '@/components/admin/SeoDashboardClient';

export default async function SitemapPage() {
  const entries = await db.seoSitemapEntry.findMany({ orderBy: { url: 'asc' } });

  return (
    <AdminModuleShell title="Sitemap Manager" eyebrow="XML sitemap entries" nav={seoNav}>
      <div className={`${adminCardClass} overflow-hidden`}>
        <table className="w-full min-w-[760px] text-left">
          <thead className="border-b border-gray-200 bg-gray-50 text-[11px] font-black uppercase tracking-wider text-gray-500">
            <tr><th className="px-5 py-3">URL</th><th className="px-5 py-3">Entity</th><th className="px-5 py-3">Priority</th><th className="px-5 py-3">Frequency</th><th className="px-5 py-3">Included</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {entries.map((entry) => (
              <tr key={entry.id}><td className="px-5 py-4 font-bold">{entry.url}</td><td className="px-5 py-4">{entry.entityType || '-'}</td><td className="px-5 py-4">{entry.priority}</td><td className="px-5 py-4">{entry.changeFrequency}</td><td className="px-5 py-4">{entry.includeInSitemap ? 'Yes' : 'No'}</td></tr>
            ))}
          </tbody>
        </table>
        {entries.length === 0 && <div className="p-10 text-center text-sm font-bold text-gray-500">No sitemap entries yet. Use POST /api/v1/admin/seo/sitemap/regenerate after creating metadata.</div>}
      </div>
    </AdminModuleShell>
  );
}
