import { db } from '@/lib/db';
import { AdminModuleShell, adminCardClass } from '@/components/admin/AdminModuleShell';

const nav = [
  { href: '/admin/ai-studio', label: 'Studio' },
  { href: '/admin/ai-studio/agents', label: 'Agents' },
  { href: '/admin/ai-studio/logs', label: 'Logs' },
  { href: '/admin/ai-studio/library', label: 'Library' },
];

export default async function AiAgentsPage() {
  const agents = await db.aiAgentIntegration.findMany({ orderBy: { createdAt: 'desc' }, include: { tasks: { take: 3, orderBy: { createdAt: 'desc' } } } });

  return (
    <AdminModuleShell title="AI Agent Integrations" eyebrow="Future agent layer" nav={nav}>
      <div className={`${adminCardClass} p-5`}>
        <h2 className="font-serif text-xl font-black">Agent Registry</h2>
        <p className="mt-2 text-sm leading-6 text-gray-600">Generic integrations for Hermes-style agents, SEO agents, content agents, inventory agents, support agents, or custom autonomous systems.</p>
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {agents.map((agent) => (
          <article key={agent.id} className={`${adminCardClass} p-5`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl font-black">{agent.name}</h3>
                <p className="mt-1 text-xs font-black uppercase tracking-wider text-brand-700">{agent.agentType} / {agent.provider}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${agent.isEnabled ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{agent.isEnabled ? 'Enabled' : 'Disabled'}</span>
            </div>
            <p className="mt-4 text-sm leading-7 text-gray-600">{agent.description}</p>
            <p className="mt-4 text-xs font-bold text-gray-500">{agent.tasks.length} recent tasks</p>
          </article>
        ))}
        {agents.length === 0 && <div className={`${adminCardClass} col-span-full p-10 text-center text-sm font-bold text-gray-500`}>No agents configured yet. Use the AI API to add integrations without exposing keys.</div>}
      </div>
    </AdminModuleShell>
  );
}
