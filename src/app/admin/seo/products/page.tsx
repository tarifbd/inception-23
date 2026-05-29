import { db } from '@/lib/db';
import { AdminModuleShell, adminCardClass } from '@/components/admin/AdminModuleShell';
import { seoNav } from '@/components/admin/SeoDashboardClient';

export default async function ProductSeoPage() {
  const rows = await db.seoMetadata.findMany({ where: { entityType: 'PRODUCT' }, orderBy: { updatedAt: 'desc' } });

  return (
    <AdminModuleShell title="Product SEO" eyebrow="Product search metadata" nav={seoNav}>
      <div className={`${adminCardClass} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="border-b border-gray-200 bg-gray-50 text-[11px] font-black uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-5 py-3">Product ID</th>
                <th className="px-5 py-3">Slug</th>
                <th className="px-5 py-3">Focus Keyword</th>
                <th className="px-5 py-3">SEO Title</th>
                <th className="px-5 py-3">Meta Description</th>
                <th className="px-5 py-3">Score</th>
                <th className="px-5 py-3">Indexable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 text-sm font-bold">{row.entityId || '-'}</td>
                  <td className="px-5 py-4 text-sm">{row.slug}</td>
                  <td className="px-5 py-4 text-sm">{row.focusKeyword || '-'}</td>
                  <td className="px-5 py-4 text-sm">{row.seoTitle}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{row.metaDescription}</td>
                  <td className="px-5 py-4 text-sm font-black">{row.seoScore ?? '-'}</td>
                  <td className="px-5 py-4 text-sm">{row.robotsIndex ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && <div className="p-10 text-center text-sm font-bold text-gray-500">No product SEO records yet. Product catalog models are not present in this codebase yet.</div>}
      </div>
    </AdminModuleShell>
  );
}
