'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  BookOpen,
  ExternalLink,
  Filter,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import {
  AdminField,
  AdminModuleShell,
  AdminStatCard,
  adminButtonClass,
  adminCardClass,
  adminInputClass,
  adminSecondaryButtonClass,
} from './AdminModuleShell';
import { parseResourceTags, resourceCategories, resourceTypes } from '@/lib/resources';

type ResourceRecord = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  resourceType: string;
  audience: string | null;
  tagsJson: string;
  coverImage: string | null;
  fileUrl: string | null;
  externalUrl: string | null;
  accessLabel: string | null;
  readingMinutes: number | null;
  seoTitle: string | null;
  seoDescription: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  publishedAt: string | null;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
};

type ResourceDraft = Omit<
  ResourceRecord,
  'id' | 'tagsJson' | 'publishedAt' | 'downloadCount' | 'createdAt' | 'updatedAt'
> & {
  id?: string;
  tags: string;
};

type ResourceMeta = {
  total: number;
  published: number;
  drafts: number;
  totalAccesses: number;
  recentAccesses: Array<{
    id: string;
    source: string;
    createdAt: string;
    resource: { title: string; slug: string };
  }>;
};

const emptyResource: ResourceDraft = {
  slug: '',
  title: '',
  excerpt: '',
  content: '',
  category: 'Management',
  resourceType: 'Guide',
  audience: '',
  tags: '',
  coverImage: '',
  fileUrl: '',
  externalUrl: '',
  accessLabel: '',
  readingMinutes: null,
  seoTitle: '',
  seoDescription: '',
  isFeatured: false,
  isPublished: false,
};

const emptyMeta: ResourceMeta = {
  total: 0,
  published: 0,
  drafts: 0,
  totalAccesses: 0,
  recentAccesses: [],
};

export function ResourceAdminClient() {
  const [resources, setResources] = useState<ResourceRecord[]>([]);
  const [meta, setMeta] = useState<ResourceMeta>(emptyMeta);
  const [draft, setDraft] = useState<ResourceDraft | null>(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const loadResources = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set('search', query.trim());
      if (category) params.set('category', category);
      if (type) params.set('type', type);
      if (status) params.set('status', status);

      const response = await fetch(`/api/v1/admin/resources?${params.toString()}`);
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Could not load resources');
      setResources(payload.data);
      setMeta(payload.meta || emptyMeta);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not load resources');
    } finally {
      setLoading(false);
    }
  }, [category, query, status, type]);

  useEffect(() => {
    const timer = window.setTimeout(loadResources, 250);
    return () => window.clearTimeout(timer);
  }, [loadResources]);

  const activeFilterCount = useMemo(
    () => [query.trim(), category, type, status].filter(Boolean).length,
    [category, query, status, type],
  );

  const editResource = (resource: ResourceRecord) => {
    const { tagsJson, publishedAt, downloadCount, createdAt, updatedAt, ...editable } = resource;
    void publishedAt;
    void downloadCount;
    void createdAt;
    void updatedAt;
    setDraft({ ...editable, tags: parseResourceTags(tagsJson).join(', ') });
  };

  const saveResource = async (event: FormEvent) => {
    event.preventDefault();
    if (!draft) return;

    setSaving(true);
    setMessage('');
    try {
      const response = await fetch(
        draft.id ? `/api/v1/admin/resources/${draft.id}` : '/api/v1/admin/resources',
        {
          method: draft.id ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...draft,
            tags: draft.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
            readingMinutes: draft.readingMinutes ? Number(draft.readingMinutes) : null,
          }),
        },
      );
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Could not save resource');
      setDraft(null);
      setMessage(draft.id ? 'Resource updated.' : 'Resource created.');
      await loadResources();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not save resource');
    } finally {
      setSaving(false);
    }
  };

  const deleteResource = async (resource: ResourceRecord) => {
    if (!window.confirm(`Delete "${resource.title}"? This also removes its access history.`)) return;
    const response = await fetch(`/api/v1/admin/resources/${resource.id}`, { method: 'DELETE' });
    const payload = await response.json();
    if (!response.ok) {
      setMessage(payload.error || 'Could not delete resource');
      return;
    }
    setMessage('Resource deleted.');
    await loadResources();
  };

  const clearFilters = () => {
    setQuery('');
    setCategory('');
    setType('');
    setStatus('');
  };

  return (
    <AdminModuleShell
      title="Resource Operations"
      eyebrow="Publish, discover, and measure"
      nav={[
        { href: '/resources', label: 'View portal' },
        { href: '/admin', label: 'Main admin' },
      ]}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="All Resources" value={meta.total} />
        <AdminStatCard label="Published" value={meta.published} tone="emerald" />
        <AdminStatCard label="Drafts" value={meta.drafts} tone="rose" />
        <AdminStatCard label="Total Accesses" value={meta.totalAccesses} tone="cyan" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className={`${adminCardClass} min-w-0 overflow-hidden`}>
          <div className="border-b border-gray-200 bg-gray-50 p-4 sm:p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <label className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search title, slug, summary, or tags"
                  className={`${adminInputClass} pl-9`}
                />
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex">
                <select value={category} onChange={(event) => setCategory(event.target.value)} className={adminInputClass} aria-label="Filter by category">
                  <option value="">All categories</option>
                  {resourceCategories.map((item) => <option key={item}>{item}</option>)}
                </select>
                <select value={type} onChange={(event) => setType(event.target.value)} className={adminInputClass} aria-label="Filter by format">
                  <option value="">All formats</option>
                  {resourceTypes.map((item) => <option key={item}>{item}</option>)}
                </select>
                <select value={status} onChange={(event) => setStatus(event.target.value)} className={adminInputClass} aria-label="Filter by status">
                  <option value="">Any status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                <Filter size={14} />
                {activeFilterCount ? `${activeFilterCount} active filter${activeFilterCount === 1 ? '' : 's'}` : 'Showing the full library'}
                {activeFilterCount ? (
                  <button onClick={clearFilters} className="font-black text-brand-700 hover:text-brand-950">Clear</button>
                ) : null}
              </div>
              <div className="flex gap-2">
                <button onClick={loadResources} className={adminSecondaryButtonClass} disabled={loading}>
                  <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
                  Refresh
                </button>
                <button onClick={() => setDraft({ ...emptyResource })} className={adminButtonClass}>
                  <Plus size={15} />
                  New resource
                </button>
              </div>
            </div>
          </div>

          {message ? <div className="border-b border-gray-200 bg-cyan-50 px-5 py-3 text-sm font-bold text-cyan-900">{message}</div> : null}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left">
              <thead className="border-b border-gray-200 text-[11px] font-black uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-5 py-3">Resource</th>
                  <th className="px-5 py-3">Taxonomy</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Accesses</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {resources.map((resource) => {
                  const tags = parseResourceTags(resource);
                  return (
                    <tr key={resource.id} className="align-top hover:bg-gray-50">
                      <td className="max-w-md px-5 py-4">
                        <div className="font-black text-gray-950">{resource.title}</div>
                        <div className="mt-1 truncate text-xs text-gray-500">/resources/{resource.slug}</div>
                        <div className="mt-2 line-clamp-2 text-xs leading-5 text-gray-500">{resource.excerpt}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-sm font-bold text-gray-700">{resource.category} / {resource.resourceType}</div>
                        <div className="mt-2 flex max-w-xs flex-wrap gap-1">
                          {tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="rounded-md bg-gray-100 px-2 py-1 text-[10px] font-bold text-gray-600">{tag}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col items-start gap-2">
                          <span className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wider ${resource.isPublished ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                            {resource.isPublished ? 'Published' : 'Draft'}
                          </span>
                          {resource.isFeatured ? <span className="text-[10px] font-black uppercase tracking-wider text-violet-700">Featured</span> : null}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-lg font-black text-gray-900">{resource.downloadCount}</div>
                        <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          {resource.readingMinutes || 1} min read
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          {resource.isPublished ? (
                            <Link href={`/resources/${resource.slug}`} target="_blank" title="Open resource" className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-brand-400 hover:text-brand-700">
                              <ExternalLink size={15} />
                            </Link>
                          ) : null}
                          <button onClick={() => editResource(resource)} title="Edit resource" className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-brand-400 hover:text-brand-700">
                            <Pencil size={15} />
                          </button>
                          <button onClick={() => deleteResource(resource)} title="Delete resource" className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {!loading && resources.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <BookOpen className="mx-auto mb-3 text-gray-300" size={36} />
              <p className="text-sm font-bold">No resources match these filters.</p>
            </div>
          ) : null}
        </section>

        <aside className={`${adminCardClass} h-fit overflow-hidden`}>
          <div className="border-b border-gray-200 bg-gray-50 px-5 py-4">
            <div className="flex items-center gap-2">
              <Activity size={17} className="text-cyan-700" />
              <h2 className="font-black text-gray-950">Recent access activity</h2>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {meta.recentAccesses.map((event) => (
              <div key={event.id} className="p-4">
                <Link href={`/resources/${event.resource.slug}`} target="_blank" className="line-clamp-2 text-sm font-black text-gray-900 hover:text-brand-700">
                  {event.resource.title}
                </Link>
                <div className="mt-2 flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  <span>{event.source.replaceAll('-', ' ')}</span>
                  <time>{new Date(event.createdAt).toLocaleDateString()}</time>
                </div>
              </div>
            ))}
            {!meta.recentAccesses.length ? (
              <div className="p-8 text-center text-sm font-bold text-gray-400">Access events will appear here.</div>
            ) : null}
          </div>
        </aside>
      </div>

      {draft ? (
        <div className="fixed inset-0 z-[100] flex justify-end bg-gray-950/35">
          <button className="hidden flex-1 lg:block" onClick={() => setDraft(null)} aria-label="Close resource editor" />
          <div className="h-full w-full overflow-y-auto bg-white p-5 shadow-2xl sm:max-w-2xl sm:p-7">
            <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-brand-700">Resource editor</p>
                <h2 className="mt-1 font-serif text-2xl font-black">{draft.id ? 'Edit resource' : 'New resource'}</h2>
              </div>
              <button onClick={() => setDraft(null)} className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600" aria-label="Close editor">
                <X size={17} />
              </button>
            </div>

            <form onSubmit={saveResource} className="space-y-5">
              <EditorSection title="Core content">
                <AdminField label="Title">
                  <input className={adminInputClass} value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} required />
                </AdminField>
                <AdminField label="Slug (generated from title when empty)">
                  <input className={adminInputClass} value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: event.target.value })} placeholder="business-health-check-framework" />
                </AdminField>
                <AdminField label="Short summary">
                  <textarea className={`${adminInputClass} min-h-24 resize-y`} value={draft.excerpt} onChange={(event) => setDraft({ ...draft, excerpt: event.target.value })} required />
                </AdminField>
                <AdminField label="Full resource overview">
                  <textarea className={`${adminInputClass} min-h-52 resize-y`} value={draft.content} onChange={(event) => setDraft({ ...draft, content: event.target.value })} required />
                </AdminField>
              </EditorSection>

              <EditorSection title="Discovery">
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminField label="Category">
                    <select className={adminInputClass} value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}>
                      {resourceCategories.map((item) => <option key={item}>{item}</option>)}
                    </select>
                  </AdminField>
                  <AdminField label="Format">
                    <select className={adminInputClass} value={draft.resourceType} onChange={(event) => setDraft({ ...draft, resourceType: event.target.value })}>
                      {resourceTypes.map((item) => <option key={item}>{item}</option>)}
                    </select>
                  </AdminField>
                </div>
                <AdminField label="Target audience">
                  <input className={adminInputClass} value={draft.audience || ''} onChange={(event) => setDraft({ ...draft, audience: event.target.value })} placeholder="Founders and leadership teams" />
                </AdminField>
                <AdminField label="Tags (comma separated)">
                  <input className={adminInputClass} value={draft.tags} onChange={(event) => setDraft({ ...draft, tags: event.target.value })} placeholder="strategy, operations, leadership" />
                </AdminField>
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminField label="Reading minutes">
                    <input type="number" min="1" max="240" className={adminInputClass} value={draft.readingMinutes || ''} onChange={(event) => setDraft({ ...draft, readingMinutes: event.target.value ? Number(event.target.value) : null })} placeholder="Auto" />
                  </AdminField>
                  <AdminField label="Access button label">
                    <input className={adminInputClass} value={draft.accessLabel || ''} onChange={(event) => setDraft({ ...draft, accessLabel: event.target.value })} placeholder="Download guide" />
                  </AdminField>
                </div>
              </EditorSection>

              <EditorSection title="Assets and destination">
                <AdminField label="Cover image URL">
                  <input className={adminInputClass} value={draft.coverImage || ''} onChange={(event) => setDraft({ ...draft, coverImage: event.target.value })} placeholder="/resources/example-cover.jpg" />
                </AdminField>
                <AdminField label="File URL">
                  <input className={adminInputClass} value={draft.fileUrl || ''} onChange={(event) => setDraft({ ...draft, fileUrl: event.target.value })} placeholder="/downloads/example.pdf" />
                </AdminField>
                <AdminField label="External URL">
                  <input className={adminInputClass} value={draft.externalUrl || ''} onChange={(event) => setDraft({ ...draft, externalUrl: event.target.value })} placeholder="https://..." />
                </AdminField>
              </EditorSection>

              <EditorSection title="Search preview">
                <AdminField label="SEO title">
                  <input className={adminInputClass} value={draft.seoTitle || ''} onChange={(event) => setDraft({ ...draft, seoTitle: event.target.value })} placeholder={draft.title || 'Optional custom search title'} />
                </AdminField>
                <AdminField label="SEO description">
                  <textarea className={`${adminInputClass} min-h-24 resize-y`} value={draft.seoDescription || ''} onChange={(event) => setDraft({ ...draft, seoDescription: event.target.value })} placeholder={draft.excerpt || 'Optional custom search description'} />
                </AdminField>
              </EditorSection>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 text-sm font-bold">
                  <input type="checkbox" checked={draft.isFeatured} onChange={(event) => setDraft({ ...draft, isFeatured: event.target.checked })} />
                  Feature in portal
                </label>
                <label className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 text-sm font-bold">
                  <input type="checkbox" checked={draft.isPublished} onChange={(event) => setDraft({ ...draft, isPublished: event.target.checked })} />
                  Published
                </label>
              </div>

              <button type="submit" disabled={saving} className={`${adminButtonClass} w-full py-3`}>
                <Save size={15} />
                {saving ? 'Saving...' : 'Save resource'}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </AdminModuleShell>
  );
}

function EditorSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-4 rounded-xl border border-gray-200 p-4">
      <legend className="px-2 text-xs font-black uppercase tracking-wider text-gray-500">{title}</legend>
      {children}
    </fieldset>
  );
}
