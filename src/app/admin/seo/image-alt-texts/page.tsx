import { db } from '@/lib/db';
import { AdminModuleShell, adminCardClass } from '@/components/admin/AdminModuleShell';
import { seoNav } from '@/components/admin/SeoDashboardClient';

export default async function ImageAltTextsPage() {
  const rows = await db.seoImageAlt.findMany({ orderBy: { updatedAt: 'desc' } });

  return (
    <AdminModuleShell title="Image Alt Text Manager" eyebrow="Accessible image SEO" nav={seoNav}>
      <div className="grid gap-4 lg:grid-cols-2">
        {rows.map((row) => (
          <article key={row.id} className={`${adminCardClass} p-5`}>
            <p className="text-[10px] font-black uppercase tracking-wider text-brand-700">{row.entityType} / {row.entityId}</p>
            <p className="mt-2 break-all text-xs text-gray-500">{row.imageUrl}</p>
            <h3 className="mt-4 text-sm font-black text-gray-950">{row.altText}</h3>
            {row.titleText && <p className="mt-1 text-sm text-gray-600">{row.titleText}</p>}
          </article>
        ))}
        {rows.length === 0 && <div className={`${adminCardClass} col-span-full p-10 text-center text-sm font-bold text-gray-500`}>No image alt records yet.</div>}
      </div>
    </AdminModuleShell>
  );
}
