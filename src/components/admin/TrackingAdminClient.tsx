'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, KeyRound, RefreshCw, Save, Server, SlidersHorizontal, ToggleLeft, ToggleRight } from 'lucide-react';
import {
  AdminField,
  AdminLoadingSkeleton,
  AdminModuleShell,
  AdminStatCard,
  adminButtonClass,
  adminCardClass,
  adminInputClass,
  adminSecondaryButtonClass,
} from '@/components/admin/AdminModuleShell';
import type { TrackingProviderConfig, TrackingProviderId, TrackingSettings } from '@/lib/tracking';

type ProviderMeta = {
  id: TrackingProviderId;
  label: string;
  publicIdLabel: string;
  serverSecretLabel: string;
};

type TrackingPayload = {
  data: TrackingSettings;
  providers: ProviderMeta[];
};

const emptyProvider = (id: TrackingProviderId, label: string): TrackingProviderConfig => ({
  id,
  label,
  enabled: false,
  publicId: '',
  accessToken: '',
  apiSecret: '',
  eventSourceId: '',
  testEventCode: '',
  sendPageView: true,
  sendLead: true,
  sendContact: true,
  customEndpoint: '',
  customHeadersJson: '',
});

function SwitchButton({ checked, onClick, label }: { checked: boolean; onClick: () => void; label: string }) {
  const Icon = checked ? ToggleRight : ToggleLeft;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={checked}
      className={`inline-flex min-h-11 items-center gap-2 rounded-lg border px-3 py-2 text-xs font-black uppercase tracking-wider transition ${
        checked
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300'
          : 'border-gray-200 bg-white text-gray-500 hover:text-gray-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-gray-300 dark:hover:text-white'
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );
}

export function TrackingAdminClient() {
  const [settings, setSettings] = useState<TrackingSettings | null>(null);
  const [providers, setProviders] = useState<ProviderMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/v1/admin/tracking', { cache: 'no-store' });
      const payload = await response.json() as TrackingPayload & { error?: string };
      if (!response.ok) throw new Error(payload.error || 'Could not load tracking settings');
      setSettings(payload.data);
      setProviders(payload.providers);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not load tracking settings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const enabledCount = useMemo(() => {
    if (!settings) return 0;
    return Object.values(settings.providers).filter((provider) => provider.enabled).length;
  }, [settings]);

  const updateProvider = (id: TrackingProviderId, patch: Partial<TrackingProviderConfig>) => {
    if (!settings) return;
    const meta = providers.find((provider) => provider.id === id);
    setSettings({
      ...settings,
      providers: {
        ...settings.providers,
        [id]: {
          ...(settings.providers[id] || emptyProvider(id, meta?.label || id)),
          ...patch,
        },
      },
    });
  };

  const save = async () => {
    if (!settings) return;
    setSaving(true);
    setMessage('');
    try {
      const response = await fetch('/api/v1/admin/tracking', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const payload = await response.json() as TrackingPayload & { error?: string };
      if (!response.ok) throw new Error(payload.error || 'Could not save tracking settings');
      setSettings(payload.data);
      setProviders(payload.providers);
      setMessage('Tracking setup saved. Public scripts will use the new toggles on the next page load.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not save tracking settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminModuleShell
      title="Pixel and CAPI Manager"
      eyebrow="Marketing tracking setup"
      nav={[
        { href: '/admin', label: 'CMS' },
        { href: '/', label: 'View website' },
      ]}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Configured providers" value={enabledCount} tone="emerald" />
        <AdminStatCard label="Available channels" value={providers.length || 11} tone="cyan" />
        <AdminStatCard label="Client pixels" value={settings?.enabled ? 'On' : 'Off'} />
        <AdminStatCard label="Server events" value={settings?.serverSideEnabled ? 'On' : 'Off'} tone="rose" />
      </div>

      <section className={`${adminCardClass} mt-5 p-5`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-brand-700">
              <SlidersHorizontal size={15} />
              Global control
            </div>
            <h2 className="mt-1 font-serif text-2xl font-black text-gray-950">One switch for the whole website</h2>
            <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-gray-500">
              Add platform IDs, keep secrets on the server, then toggle providers on when campaigns are ready.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={load} disabled={loading} className={adminSecondaryButtonClass}>
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button onClick={save} disabled={!settings || saving} className={adminButtonClass}>
              <Save size={15} />
              {saving ? 'Saving...' : 'Save setup'}
            </button>
          </div>
        </div>

        {settings ? (
          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            <SwitchButton checked={settings.enabled} label={settings.enabled ? 'Website tracking on' : 'Website tracking off'} onClick={() => setSettings({ ...settings, enabled: !settings.enabled })} />
            <SwitchButton checked={settings.serverSideEnabled} label={settings.serverSideEnabled ? 'CAPI on' : 'CAPI off'} onClick={() => setSettings({ ...settings, serverSideEnabled: !settings.serverSideEnabled })} />
            <AdminField label="Consent mode">
              <select className={adminInputClass} value={settings.consentMode} onChange={(event) => setSettings({ ...settings, consentMode: event.target.value as TrackingSettings['consentMode'] })}>
                <option value="granted">Fire when enabled</option>
                <option value="manual">Manual consent layer later</option>
                <option value="denied">Block all tracking</option>
              </select>
            </AdminField>
          </div>
        ) : null}

        {message ? <div className="mt-4 rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-bold text-cyan-900">{message}</div> : null}
      </section>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        {settings && providers.map((meta) => {
          const provider = settings.providers[meta.id] || emptyProvider(meta.id, meta.label);
          const hasServerSetup = provider.apiSecret || provider.accessToken || provider.customEndpoint;
          return (
            <article key={meta.id} className={`${adminCardClass} overflow-hidden`}>
              <div className="flex flex-col gap-3 border-b border-gray-200 bg-gray-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate font-serif text-xl font-black text-gray-950">{meta.label}</h2>
                    {provider.enabled ? <CheckCircle2 className="shrink-0 text-emerald-600" size={18} /> : null}
                  </div>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-gray-400">{hasServerSetup ? 'Pixel + backend event ready' : 'Pixel setup'}</p>
                </div>
                <SwitchButton checked={provider.enabled} label={provider.enabled ? 'Enabled' : 'Disabled'} onClick={() => updateProvider(meta.id, { enabled: !provider.enabled })} />
              </div>

              <div className="space-y-4 p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminField label={meta.publicIdLabel}>
                    <input className={adminInputClass} value={provider.publicId} onChange={(event) => updateProvider(meta.id, { publicId: event.target.value })} placeholder="Paste ID here" />
                  </AdminField>
                  <AdminField label="Event source / dataset ID">
                    <input className={adminInputClass} value={provider.eventSourceId} onChange={(event) => updateProvider(meta.id, { eventSourceId: event.target.value })} placeholder="Optional" />
                  </AdminField>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminField label={meta.serverSecretLabel}>
                    <div className="relative">
                      <KeyRound className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                      <input type="password" className={`${adminInputClass} pl-9`} value={provider.accessToken} onChange={(event) => updateProvider(meta.id, { accessToken: event.target.value })} placeholder="Backend only" />
                    </div>
                  </AdminField>
                  <AdminField label="API secret">
                    <input type="password" className={adminInputClass} value={provider.apiSecret} onChange={(event) => updateProvider(meta.id, { apiSecret: event.target.value })} placeholder="Google MP or platform secret" />
                  </AdminField>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <SwitchButton checked={provider.sendPageView} label="Pageview" onClick={() => updateProvider(meta.id, { sendPageView: !provider.sendPageView })} />
                  <SwitchButton checked={provider.sendLead} label="Lead" onClick={() => updateProvider(meta.id, { sendLead: !provider.sendLead })} />
                  <SwitchButton checked={provider.sendContact} label="Contact" onClick={() => updateProvider(meta.id, { sendContact: !provider.sendContact })} />
                </div>

                <div className="rounded-lg border border-gray-200 p-4">
                  <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-500">
                    <Server size={14} />
                    Advanced CAPI fallback
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <AdminField label="Custom event endpoint">
                      <input className={adminInputClass} value={provider.customEndpoint} onChange={(event) => updateProvider(meta.id, { customEndpoint: event.target.value })} placeholder="https://api.platform.com/..." />
                    </AdminField>
                    <AdminField label="Test event code">
                      <input className={adminInputClass} value={provider.testEventCode} onChange={(event) => updateProvider(meta.id, { testEventCode: event.target.value })} placeholder="Optional" />
                    </AdminField>
                  </div>
                  <AdminField label="Custom headers JSON">
                    <textarea className={`${adminInputClass} mt-3 min-h-20 font-mono text-xs`} value={provider.customHeadersJson} onChange={(event) => updateProvider(meta.id, { customHeadersJson: event.target.value })} placeholder='{"Authorization":"Bearer token"}' />
                  </AdminField>
                </div>
              </div>
            </article>
          );
        })}

        {loading ? <div className="col-span-full"><AdminLoadingSkeleton rows={5} /></div> : null}
      </div>
    </AdminModuleShell>
  );
}
