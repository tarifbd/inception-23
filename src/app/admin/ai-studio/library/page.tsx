import { db } from '@/lib/db';
import { AdminModuleShell, adminCardClass } from '@/components/admin/AdminModuleShell';

const nav = [
  { href: '/admin/ai-studio', label: 'Studio' },
  { href: '/admin/ai-studio/agents', label: 'Agents' },
  { href: '/admin/ai-studio/logs', label: 'Logs' },
  { href: '/admin/ai-studio/library', label: 'Library' },
];

export default async function AiLibraryPage() {
  const contents = await db.aiGeneratedContent.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });

  return (
    <AdminModuleShell title="Generated Content Library" eyebrow="Drafts, approvals, and applied AI content" nav={nav}>
      <div className="grid gap-4 lg:grid-cols-2">
        {contents.map((content) => (
          <article key={content.id} className={`${adminCardClass} p-5`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-brand-700">{content.featureType}</p>
                <h3 className="mt-1 font-serif text-xl font-black">{content.title}</h3>
              </div>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-gray-600">{content.status}</span>
            </div>
            <pre className="mt-4 max-h-56 overflow-auto rounded-lg bg-gray-950 p-4 text-xs text-gray-100">{content.contentText || content.contentJson || 'No content text'}</pre>
          </article>
        ))}
        {contents.length === 0 && <div className={`${adminCardClass} col-span-full p-10 text-center text-sm font-bold text-gray-500`}>No generated content yet.</div>}
      </div>
    </AdminModuleShell>
  );
}
