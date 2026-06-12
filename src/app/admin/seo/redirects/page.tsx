import { db } from '@/lib/db';
import { AdminModuleShell, adminCardClass } from '@/components/admin/AdminModuleShell';
import { seoNav } from '@/components/admin/SeoDashboardClient';

export default async function RedirectsPage() {
  const redirects = await db.seoRedirect.findMany({ orderBy: { updatedAt: 'desc' } });

  return (
    <AdminModuleShell title="Redirect Manager" eyebrow="SEO route control" nav={seoNav}>
      <div className={`${adminCardClass} overflow-x-auto`}>
        <table className="w-full min-w-[720px] text-left">
          <thead className="border-b border-gray-200 bg-gray-50 text-[11px] font-black uppercase tracking-wider text-gray-500">
            <tr><th className="px-5 py-3">Source</th><th className="px-5 py-3">Target</th><th className="px-5 py-3">Code</th><th className="px-5 py-3">Hits</th><th className="px-5 py-3">Active</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {redirects.map((item) => (
              <tr key={item.id}><td className="px-5 py-4 font-bold">{item.sourcePath}</td><td className="px-5 py-4">{item.targetPath}</td><td className="px-5 py-4">{item.statusCode}</td><td className="px-5 py-4">{item.hitCount}</td><td className="px-5 py-4">{item.isActive ? 'Yes' : 'No'}</td></tr>
            ))}
          </tbody>
        </table>
        {redirects.length === 0 && <div className="p-10 text-center text-sm font-bold text-gray-500">No redirects yet.</div>}
      </div>
    </AdminModuleShell>
  );
}
