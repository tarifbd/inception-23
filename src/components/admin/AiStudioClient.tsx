'use client';

import { useEffect, useMemo, useState } from 'react';
import { Bot, Copy, FileText, Loader2, WandSparkles } from 'lucide-react';
import { AdminField, AdminModuleShell, AdminStatCard, adminButtonClass, adminCardClass, adminInputClass, adminSecondaryButtonClass } from './AdminModuleShell';

type ProviderStatus = {
  provider: string;
  label: string;
  configured: boolean;
  enabled: boolean;
  active: boolean;
  model?: string;
  missingEnv?: string;
};

type AiSettings = {
  provider: string;
  defaultModel?: string | null;
  isEnabled: boolean;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
};

const aiNav = [
  { href: '/admin/ai-studio', label: 'Studio' },
  { href: '/admin/ai-studio/agents', label: 'Agents' },
  { href: '/admin/ai-studio/logs', label: 'Logs' },
  { href: '/admin/ai-studio/library', label: 'Library' },
];

const tools = [
  ['product-content', 'Product Content Generator'],
  ['product-seo', 'Product SEO Generator'],
  ['category-seo', 'Category SEO Generator'],
  ['landing-page', 'Landing Page Generator'],
  ['blog', 'Blog / Article Generator'],
  ['ad-copy', 'Ad Copy Generator'],
  ['email', 'Email Copy Generator'],
  ['faq', 'FAQ Generator'],
  ['image-alt-text', 'Image Alt Text Generator'],
  ['custom', 'Custom Prompt'],
];

export function AiStudioClient() {
  const [settings, setSettings] = useState<AiSettings | null>(null);
  const [providers, setProviders] = useState<ProviderStatus[]>([]);
  const [logs, setLogs] = useState<Array<{ status: string }>>([]);
  const [activeTool, setActiveTool] = useState('product-content');
  const [input, setInput] = useState('{"product_name":"Premium Product","category":"General","target_audience":"Online shoppers","language":"English"}');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const stats = useMemo(() => ({
    total: logs.length,
    success: logs.filter((log) => log.status === 'SUCCESS').length,
    failed: logs.filter((log) => log.status === 'FAILED').length,
  }), [logs]);

  async function load() {
    const [settingsRes, providersRes, logsRes] = await Promise.all([
      fetch('/api/v1/admin/ai/settings'),
      fetch('/api/v1/admin/ai/providers/status'),
      fetch('/api/v1/admin/ai/logs'),
    ]);
    if (settingsRes.ok) setSettings(await settingsRes.json());
    if (providersRes.ok) setProviders(await providersRes.json());
    if (logsRes.ok) setLogs(await logsRes.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function saveSettings() {
    if (!settings) return;
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/v1/admin/ai/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to save settings');
      setSettings(await res.json());
      setMessage('AI settings saved.');
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Save failed.');
    } finally {
      setLoading(false);
    }
  }

  async function testProvider() {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/v1/admin/ai/providers/test', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Provider test failed');
      setMessage(`Provider connected: ${data.provider}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Provider test failed.');
    } finally {
      setLoading(false);
    }
  }

  async function generate() {
    setLoading(true);
    setMessage('');
    setOutput('');
    try {
      const payload = JSON.parse(input);
      const res = await fetch(`/api/v1/admin/ai/generate/${activeTool}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      setOutput(JSON.stringify(data.output, null, 2));
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Generation failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminModuleShell title="AI Studio" eyebrow="AI Control Center" nav={aiNav}>
      <div className="grid gap-4 md:grid-cols-4">
        <AdminStatCard label="AI Status" value={settings?.isEnabled ? 'ON' : 'OFF'} tone={settings?.isEnabled ? 'emerald' : 'rose'} />
        <AdminStatCard label="Provider" value={settings?.provider || 'disabled'} tone="cyan" />
        <AdminStatCard label="Generations" value={stats.total} />
        <AdminStatCard label="Failed" value={stats.failed} tone={stats.failed ? 'rose' : 'emerald'} />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[420px_1fr]">
        <div className="space-y-5">
          <section className={`${adminCardClass} p-5`}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-xl font-black">Provider Setup</h2>
              <button onClick={testProvider} disabled={loading} className={adminSecondaryButtonClass}>Test</button>
            </div>
            {settings && (
              <div className="space-y-4">
                <AdminField label="AI Enabled">
                  <select className={adminInputClass} value={settings.isEnabled ? 'true' : 'false'} onChange={(e) => setSettings({ ...settings, isEnabled: e.target.value === 'true' })}>
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                  </select>
                </AdminField>
                <AdminField label="Provider">
                  <select className={adminInputClass} value={settings.provider} onChange={(e) => setSettings({ ...settings, provider: e.target.value })}>
                    {['disabled', 'openai', 'gemini', 'anthropic', 'openrouter', 'local'].map((provider) => <option key={provider} value={provider}>{provider}</option>)}
                  </select>
                </AdminField>
                <AdminField label="Model">
                  <input className={adminInputClass} value={settings.defaultModel || ''} onChange={(e) => setSettings({ ...settings, defaultModel: e.target.value })} placeholder="AI_MODEL or provider default" />
                </AdminField>
                <button onClick={saveSettings} disabled={loading} className={adminButtonClass}>Save settings</button>
              </div>
            )}
            <div className="mt-5 space-y-2">
              {providers.map((provider) => (
                <div key={provider.provider} className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm">
                  <span className="font-bold">{provider.label}</span>
                  <span className={`font-black ${provider.configured ? 'text-emerald-700' : 'text-rose-600'}`}>{provider.configured ? 'Connected' : provider.missingEnv}</span>
                </div>
              ))}
            </div>
          </section>

          <section className={`${adminCardClass} p-5`}>
            <h2 className="mb-4 font-serif text-xl font-black">AI Tools</h2>
            <div className="grid gap-2">
              {tools.map(([id, label]) => (
                <button key={id} onClick={() => setActiveTool(id)} className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm font-bold transition ${activeTool === id ? 'border-brand-500 bg-brand-50 text-brand-800' : 'border-gray-200 bg-white text-gray-700 hover:border-brand-400'}`}>
                  <WandSparkles size={16} />
                  {label}
                </button>
              ))}
            </div>
          </section>
        </div>

        <section className={`${adminCardClass} overflow-hidden`}>
          <div className="border-b border-gray-200 bg-gray-50 p-5">
            <h2 className="font-serif text-xl font-black">{tools.find(([id]) => id === activeTool)?.[1]}</h2>
            <p className="mt-1 text-sm text-gray-500">Enter JSON input. Output is saved to the generated content library as draft.</p>
          </div>
          <div className="grid gap-5 p-5 lg:grid-cols-2">
            <div>
              <AdminField label="Input JSON">
                <textarea className={`${adminInputClass} min-h-[360px] font-mono text-xs`} value={input} onChange={(e) => setInput(e.target.value)} />
              </AdminField>
              <button onClick={generate} disabled={loading} className={`mt-4 ${adminButtonClass}`}>
                {loading ? <Loader2 className="animate-spin" size={15} /> : <Bot size={15} />}
                Generate
              </button>
              {message && <p className="mt-3 rounded-lg bg-gray-50 p-3 text-sm font-bold text-gray-700">{message}</p>}
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Output</span>
                <button onClick={() => navigator.clipboard.writeText(output)} className="inline-flex items-center gap-1 text-xs font-bold text-brand-700"><Copy size={13} /> Copy</button>
              </div>
              <pre className="min-h-[360px] overflow-auto rounded-lg border border-gray-200 bg-gray-950 p-4 text-xs text-gray-100">{output || 'Generated JSON will appear here.'}</pre>
            </div>
          </div>
        </section>
      </div>

      <section className={`${adminCardClass} mt-6 p-5`}>
        <h2 className="mb-4 font-serif text-xl font-black">Recent AI Tasks</h2>
        <div className="grid gap-3">
          {logs.slice(0, 8).map((log, index) => (
            <div key={index} className="flex items-center justify-between rounded-lg border border-gray-200 p-3 text-sm">
              <span className="flex items-center gap-2 font-bold"><FileText size={15} /> Generation #{index + 1}</span>
              <span className={log.status === 'SUCCESS' ? 'font-black text-emerald-700' : 'font-black text-rose-600'}>{log.status}</span>
            </div>
          ))}
          {logs.length === 0 && <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm font-bold text-gray-500">No AI generations yet.</div>}
        </div>
      </section>
    </AdminModuleShell>
  );
}
