'use client';

import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Inbox, Mail, RefreshCw, Trash2, Users } from 'lucide-react';
import {
  AdminLoadingSkeleton,
  AdminModuleShell,
  adminButtonClass,
  adminCardClass,
  adminSecondaryButtonClass,
} from './AdminModuleShell';

type LeadType = 'contact' | 'inquiry' | 'newsletter';
type LeadRecord = {
  id: string;
  name?: string;
  email: string;
  company?: string | null;
  serviceInterest?: string | null;
  message?: string;
  status?: string;
  createdAt?: string;
  subscribedAt?: string;
};

type LeadResponse = {
  data: LeadRecord[];
  meta: { type: LeadType; page: number; limit: number; total: number; pages: number };
};

const tabs: Array<{ id: LeadType; label: string; icon: typeof Inbox }> = [
  { id: 'contact', label: 'Contact submissions', icon: Inbox },
  { id: 'inquiry', label: 'Quick inquiries', icon: Users },
  { id: 'newsletter', label: 'Newsletter', icon: Mail },
];

export function LeadsAdminClient() {
  const [type, setType] = useState<LeadType>('contact');
  const [page, setPage] = useState(1);
  const [response, setResponse] = useState<LeadResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setMessage('');
    try {
      const result = await fetch(`/api/v1/admin/leads?type=${type}&page=${page}&limit=20`, { cache: 'no-store' });
      if (!result.ok) throw new Error('Unable to load leads');
      setResponse(await result.json() as LeadResponse);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to load leads');
    } finally {
      setLoading(false);
    }
  }, [page, type]);

  useEffect(() => { void load(); }, [load]);

  const remove = async (record: LeadRecord) => {
    if (!window.confirm(`Delete ${record.email}?`)) return;
    const result = await fetch('/api/v1/admin/leads', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, id: record.id }),
    });
    if (!result.ok) {
      setMessage('Unable to delete this record');
      return;
    }
    await load();
  };

  const updateStatus = async (id: string, status: string) => {
    const result = await fetch('/api/v1/admin/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (!result.ok) {
      setMessage('Unable to update lead status');
      return;
    }
    await load();
  };

  return (
    <AdminModuleShell title="Leads & subscribers" eyebrow="Operations" nav={[{ href: '/admin', label: 'Dashboard' }, { href: '/admin/leads', label: 'Leads' }]}>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} type="button" onClick={() => { setType(tab.id); setPage(1); }} className={type === tab.id ? adminButtonClass : adminSecondaryButtonClass} aria-pressed={type === tab.id}>
                <Icon size={15} aria-hidden="true" />{tab.label}
              </button>
            );
          })}
        </div>
        <button type="button" onClick={() => void load()} className={adminSecondaryButtonClass} disabled={loading}>
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} aria-hidden="true" />Refresh
        </button>
      </div>

      {message ? <p role="alert" className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{message}</p> : null}
      {loading ? <AdminLoadingSkeleton rows={6} /> : (
        <section className={`${adminCardClass} overflow-hidden`}>
          <header className="flex items-center justify-between gap-4 border-b border-gray-200 bg-gray-50 px-5 py-4 dark:border-white/10 dark:bg-night-800">
            <div>
              <h2 className="font-serif text-xl font-bold text-gray-950 dark:text-white">{tabs.find((tab) => tab.id === type)?.label}</h2>
              <p className="mt-1 text-xs font-semibold text-gray-500">{response?.meta.total ?? 0} records</p>
            </div>
          </header>
          <div className="divide-y divide-gray-100 dark:divide-white/10">
            {response?.data.map((record) => (
              <article key={record.id} className="grid gap-4 p-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_auto] lg:items-start">
                <div className="min-w-0">
                  <p className="break-words text-sm font-bold text-gray-950 dark:text-white">{record.name || record.email}</p>
                  {record.name ? <a href={`mailto:${record.email}`} className="mt-1 block break-all text-sm text-brand-700 hover:underline">{record.email}</a> : null}
                  {record.company ? <p className="mt-1 text-xs font-semibold text-gray-500">{record.company}</p> : null}
                </div>
                <div className="min-w-0">
                  {record.serviceInterest ? <p className="mb-1 text-xs font-bold text-brand-700">{record.serviceInterest}</p> : null}
                  {record.message ? <p className="whitespace-pre-wrap break-words text-sm leading-6 text-gray-600 dark:text-gray-300">{record.message}</p> : null}
                  <time className="mt-2 block text-xs text-gray-400">{new Date(record.createdAt || record.subscribedAt || '').toLocaleString()}</time>
                </div>
                <div className="flex items-center gap-2 lg:justify-end">
                  {type === 'contact' ? (
                    <select aria-label={`Status for ${record.email}`} value={record.status || 'new'} onChange={(event) => void updateStatus(record.id, event.target.value)} className="ui-field min-h-10 rounded-lg px-3 text-sm">
                      <option value="new">New</option><option value="in-progress">In progress</option><option value="resolved">Resolved</option><option value="spam">Spam</option>
                    </select>
                  ) : null}
                  <button type="button" onClick={() => void remove(record)} className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50" aria-label={`Delete ${record.email}`}>
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </div>
              </article>
            ))}
            {!response?.data.length ? <p className="p-10 text-center text-sm font-semibold text-gray-500">No records in this view.</p> : null}
          </div>
          <footer className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-5 py-4 dark:border-white/10 dark:bg-night-800">
            <p className="text-xs font-semibold text-gray-500">Page {response?.meta.page ?? 1} of {response?.meta.pages ?? 1}</p>
            <div className="flex gap-2">
              <button type="button" className={adminSecondaryButtonClass} disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))} aria-label="Previous page"><ChevronLeft size={16} /></button>
              <button type="button" className={adminSecondaryButtonClass} disabled={page >= (response?.meta.pages ?? 1)} onClick={() => setPage((value) => value + 1)} aria-label="Next page"><ChevronRight size={16} /></button>
            </div>
          </footer>
        </section>
      )}
    </AdminModuleShell>
  );
}
