import { db } from '@/lib/db';
import { AdminModuleShell, adminCardClass } from '@/components/admin/AdminModuleShell';

const nav = [
  { href: '/admin/ai-studio', label: 'Studio' },
  { href: '/admin/ai-studio/agents', label: 'Agents' },
  { href: '/admin/ai-studio/logs', label: 'Logs' },
  { href: '/admin/ai-studio/library', label: 'Library' },
];

export default async function AiLogsPage() {
  const logs = await db.aiGenerationLog.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });

  return (
    <AdminModuleShell title="AI Logs" eyebrow="Generation audit trail" nav={nav}>
      <div className={`${adminCardClass} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="border-b border-gray-200 bg-gray-50 text-[11px] font-black uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Feature</th>
                <th className="px-5 py-3">Provider</th>
                <th className="px-5 py-3">Model</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Error</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 text-sm text-gray-600">{log.createdAt.toLocaleString()}</td>
                  <td className="px-5 py-4 text-sm font-bold">{log.featureType}</td>
                  <td className="px-5 py-4 text-sm">{log.provider}</td>
                  <td className="px-5 py-4 text-sm">{log.model || '-'}</td>
                  <td className={`px-5 py-4 text-sm font-black ${log.status === 'SUCCESS' ? 'text-emerald-700' : 'text-rose-600'}`}>{log.status}</td>
                  <td className="px-5 py-4 text-sm text-gray-500">{log.errorMessage || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {logs.length === 0 && <div className="p-10 text-center text-sm font-bold text-gray-500">No AI logs yet.</div>}
      </div>
    </AdminModuleShell>
  );
}
