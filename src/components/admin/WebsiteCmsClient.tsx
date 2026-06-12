'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Copy,
  ExternalLink,
  FilePenLine,
  FilePlus2,
  FolderOpen,
  Home,
  Image as ImageIcon,
  LayoutDashboard,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  Upload,
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
import { RichTextEditor } from './RichTextEditor';

type CmsPage = {
  id: string;
  slug: string;
  title: string;
  navigationLabel: string | null;
  excerpt: string;
  bodyHtml: string;
  heroImage: string | null;
  videoUrl: string | null;
  videoEmbedUrl: string | null;
  template: string;
  seoTitle: string | null;
  seoDescription: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type PageDraft = Omit<CmsPage, 'id' | 'videoEmbedUrl' | 'publishedAt' | 'createdAt' | 'updatedAt'> & {
  id?: string;
};

type MediaAsset = {
  id: string;
  name: string;
  fileName: string;
  url: string;
  mimeType: string;
  size: number;
  altText: string;
  createdAt: string;
};

type View = 'pages' | 'media' | 'structure';

const emptyPage: PageDraft = {
  slug: '',
  title: '',
  navigationLabel: '',
  excerpt: '',
  bodyHtml: '',
  heroImage: '',
  videoUrl: '',
  template: 'standard',
  seoTitle: '',
  seoDescription: '',
  isPublished: false,
};

export function WebsiteCmsClient() {
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [draft, setDraft] = useState<PageDraft | null>(null);
  const [view, setView] = useState<View>('pages');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [query, setQuery] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [pagesResponse, mediaResponse] = await Promise.all([
        fetch('/api/v1/admin/cms/pages'),
        fetch('/api/v1/admin/cms/media'),
      ]);
      const [pagesPayload, mediaPayload] = await Promise.all([pagesResponse.json(), mediaResponse.json()]);
      if (!pagesResponse.ok) throw new Error(pagesPayload.error || 'Could not load pages');
      if (!mediaResponse.ok) throw new Error(mediaPayload.error || 'Could not load media');
      setPages(pagesPayload.data);
      setAssets(mediaPayload.data);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not load the website CMS');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filteredPages = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return pages;
    return pages.filter((page) => [page.title, page.slug, page.excerpt].join(' ').toLowerCase().includes(term));
  }, [pages, query]);

  const savePage = async (event: FormEvent) => {
    event.preventDefault();
    if (!draft) return;
    setSaving(true);
    setMessage('');
    try {
      const response = await fetch(draft.id ? `/api/v1/admin/cms/pages/${draft.id}` : '/api/v1/admin/cms/pages', {
        method: draft.id ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Could not save page');
      setDraft(null);
      setMessage(draft.id ? 'Page updated.' : 'Page created.');
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not save page');
    } finally {
      setSaving(false);
    }
  };

  const deletePage = async (page: CmsPage) => {
    if (!window.confirm(`Delete "${page.title}"?`)) return;
    const response = await fetch(`/api/v1/admin/cms/pages/${page.id}`, { method: 'DELETE' });
    const payload = await response.json();
    if (!response.ok) return setMessage(payload.error || 'Could not delete page');
    setMessage('Page deleted.');
    await load();
  };

  const uploadMedia = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUploading(true);
    setMessage('');
    try {
      const form = event.currentTarget;
      const response = await fetch('/api/v1/admin/cms/media', { method: 'POST', body: new FormData(form) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Upload failed');
      form.reset();
      setMessage('Image uploaded to the media library.');
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const copyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setMessage(`Copied ${url}`);
  };

  const deleteMedia = async (asset: MediaAsset) => {
    if (!window.confirm(`Delete "${asset.name}" from the media library?`)) return;
    const response = await fetch(`/api/v1/admin/cms/media/${asset.id}`, { method: 'DELETE' });
    const payload = await response.json();
    if (!response.ok) return setMessage(payload.error || 'Could not delete media');
    setMessage('Media asset deleted.');
    await load();
  };

  return (
    <AdminModuleShell
      title="Website CMS"
      eyebrow="Pages, media, and site content"
      nav={[
        { href: '/', label: 'View website' },
        { href: '/admin/homepage', label: 'Homepage layout' },
      ]}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Custom Pages" value={pages.length} />
        <AdminStatCard label="Published" value={pages.filter((page) => page.isPublished).length} tone="emerald" />
        <AdminStatCard label="Drafts" value={pages.filter((page) => !page.isPublished).length} tone="rose" />
        <AdminStatCard label="Media Assets" value={assets.length} tone="cyan" />
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
        {([
          ['pages', 'Website pages', FilePenLine],
          ['media', 'Media library', ImageIcon],
          ['structure', 'Site structure', LayoutDashboard],
        ] as const).map(([id, label, Icon]) => (
          <button
            key={id}
            onClick={() => setView(id)}
            className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-wider transition ${
              view === id ? 'bg-brand-600 text-white shadow-md' : 'border border-gray-200 bg-white text-gray-600 hover:text-brand-700'
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {message ? (
        <div className="mt-4 rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-bold text-cyan-900">{message}</div>
      ) : null}

      {view === 'pages' ? (
        <section className={`${adminCardClass} mt-5 overflow-hidden`}>
          <div className="flex flex-col gap-3 border-b border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search website pages" className={`${adminInputClass} sm:max-w-sm`} />
            <div className="flex gap-2">
              <button onClick={load} disabled={loading} className={adminSecondaryButtonClass}>
                <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
              <button onClick={() => setDraft({ ...emptyPage })} className={adminButtonClass}>
                <FilePlus2 size={15} />
                New page
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredPages.map((page) => (
              <article key={page.id} className="flex flex-col gap-4 p-5 transition hover:bg-gray-50 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-black text-gray-950">{page.title}</h2>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${page.isPublished ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {page.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-bold text-gray-500">/{page.slug}</p>
                  <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-gray-500">{page.excerpt || 'No page summary yet.'}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  {page.isPublished ? (
                    <Link href={`/${page.slug}`} target="_blank" className={adminSecondaryButtonClass}><ExternalLink size={15} /> Preview</Link>
                  ) : null}
                  <button onClick={() => setDraft({ ...page })} className={adminSecondaryButtonClass}><Pencil size={15} /> Edit</button>
                  <button onClick={() => deletePage(page)} className="inline-flex items-center gap-2 rounded-lg border border-rose-200 px-3 py-2 text-xs font-black uppercase text-rose-600 hover:bg-rose-50"><Trash2 size={15} /></button>
                </div>
              </article>
            ))}
          </div>

          {!loading && filteredPages.length === 0 ? (
            <div className="p-12 text-center">
              <FolderOpen className="mx-auto text-gray-300" size={40} />
              <h2 className="mt-4 font-black text-gray-900">No custom pages yet</h2>
              <p className="mt-2 text-sm text-gray-500">Create full pages such as Privacy, Terms, Company Profile, campaigns, or landing pages.</p>
            </div>
          ) : null}
        </section>
      ) : null}

      {view === 'media' ? (
        <div className="mt-5 grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <form onSubmit={uploadMedia} className={`${adminCardClass} h-fit space-y-4 p-5`}>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-brand-700">Upload image</p>
              <h2 className="mt-1 font-serif text-2xl font-black">Add to media library</h2>
            </div>
            <AdminField label="Image file">
              <input type="file" name="file" accept="image/jpeg,image/png,image/webp,image/gif" required className={`${adminInputClass} file:mr-3 file:rounded-md file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-xs file:font-black file:text-brand-700`} />
            </AdminField>
            <AdminField label="Alt text">
              <input name="altText" className={adminInputClass} placeholder="Describe the image for accessibility" />
            </AdminField>
            <button disabled={uploading} className={`${adminButtonClass} w-full`}>
              <Upload size={15} />
              {uploading ? 'Uploading...' : 'Upload image'}
            </button>
            <p className="text-xs leading-5 text-gray-500">JPG, PNG, WebP, or GIF. Maximum 8 MB.</p>
          </form>

          <section className={`${adminCardClass} p-5`}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-serif text-2xl font-black">Media library</h2>
              <span className="text-xs font-black uppercase tracking-wider text-gray-400">{assets.length} files</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {assets.map((asset) => (
                <article key={asset.id} className="overflow-hidden rounded-xl border border-gray-200">
                  <div className="aspect-[4/3] bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={asset.url} alt={asset.altText} className="h-full w-full object-cover" />
                  </div>
                  <div className="p-3">
                    <p className="truncate text-sm font-black text-gray-900">{asset.name}</p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">{Math.ceil(asset.size / 1024)} KB</p>
                    <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                      <button onClick={() => copyUrl(asset.url)} className={adminSecondaryButtonClass}><Copy size={14} /> Copy URL</button>
                      <button onClick={() => deleteMedia(asset)} title="Delete media" className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"><Trash2 size={15} /></button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            {!assets.length ? <div className="py-12 text-center text-sm font-bold text-gray-400">Uploaded images will appear here.</div> : null}
          </section>
        </div>
      ) : null}

      {view === 'structure' ? (
        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <StructureCard icon={Home} title="Homepage layout" copy="Edit the hero slides, homepage sections, visibility, ordering, headings, and calls to action." href="/admin/homepage" action="Open homepage editor" />
          <StructureCard icon={FilePenLine} title="Custom pages" copy="Create full rich-content pages with images, videos, SEO metadata, and publishing controls." onClick={() => setView('pages')} action="Manage pages" />
          <StructureCard icon={ImageIcon} title="Media library" copy="Upload reusable website imagery, maintain alt text, and copy URLs into any content field." onClick={() => setView('media')} action="Manage media" />
        </div>
      ) : null}

      {draft ? (
        <div className="fixed inset-0 z-[100] flex justify-end bg-gray-950/40">
          <button className="hidden flex-1 lg:block" onClick={() => setDraft(null)} aria-label="Close page editor" />
          <div className="h-full w-full overflow-y-auto bg-white p-5 shadow-2xl sm:max-w-4xl sm:p-7">
            <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-brand-700">Full page editor</p>
                <h2 className="mt-1 font-serif text-2xl font-black">{draft.id ? 'Edit page' : 'Create page'}</h2>
              </div>
              <button onClick={() => setDraft(null)} aria-label="Close editor" className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600"><X size={17} /></button>
            </div>

            <form onSubmit={savePage} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <AdminField label="Page title">
                  <input className={adminInputClass} value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} required />
                </AdminField>
                <AdminField label="Page URL">
                  <div className="flex rounded-lg border border-gray-200 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/10">
                    <span className="flex items-center bg-gray-50 px-3 text-sm font-bold text-gray-400">/</span>
                    <input className="min-w-0 flex-1 rounded-r-lg px-3 py-2.5 text-sm outline-none" value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: event.target.value })} placeholder="privacy-policy" required />
                  </div>
                </AdminField>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <AdminField label="Navigation label">
                  <input className={adminInputClass} value={draft.navigationLabel || ''} onChange={(event) => setDraft({ ...draft, navigationLabel: event.target.value })} />
                </AdminField>
                <AdminField label="Page template">
                  <select className={adminInputClass} value={draft.template} onChange={(event) => setDraft({ ...draft, template: event.target.value })}>
                    <option value="standard">Standard</option>
                    <option value="wide">Wide</option>
                    <option value="editorial">Editorial</option>
                  </select>
                </AdminField>
              </div>
              <AdminField label="Page summary">
                <textarea className={`${adminInputClass} min-h-24 resize-y`} value={draft.excerpt} onChange={(event) => setDraft({ ...draft, excerpt: event.target.value })} />
              </AdminField>

              <div className="rounded-xl border border-gray-200 p-4">
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-brand-700">Rich content</p>
                    <p className="mt-1 text-sm text-gray-500">Format headings, lists, links, quotes, and inline images.</p>
                  </div>
                  <button type="button" onClick={() => setView('media')} className={adminSecondaryButtonClass}><ImageIcon size={15} /> Media URLs</button>
                </div>
                <RichTextEditor value={draft.bodyHtml} onChange={(bodyHtml) => setDraft({ ...draft, bodyHtml })} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <AdminField label="Hero image URL">
                  <input className={adminInputClass} value={draft.heroImage || ''} onChange={(event) => setDraft({ ...draft, heroImage: event.target.value })} placeholder="/uploads/cms/..." />
                </AdminField>
                <AdminField label="YouTube or Vimeo URL">
                  <input className={adminInputClass} value={draft.videoUrl || ''} onChange={(event) => setDraft({ ...draft, videoUrl: event.target.value })} placeholder="https://youtube.com/watch?v=..." />
                </AdminField>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <p className="mb-4 text-xs font-black uppercase tracking-wider text-gray-500">Search and sharing</p>
                <div className="space-y-4">
                  <AdminField label="SEO title">
                    <input className={adminInputClass} value={draft.seoTitle || ''} onChange={(event) => setDraft({ ...draft, seoTitle: event.target.value })} />
                  </AdminField>
                  <AdminField label="SEO description">
                    <textarea className={`${adminInputClass} min-h-20 resize-y`} value={draft.seoDescription || ''} onChange={(event) => setDraft({ ...draft, seoDescription: event.target.value })} />
                  </AdminField>
                </div>
              </div>

              <label className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 text-sm font-black">
                <input type="checkbox" checked={draft.isPublished} onChange={(event) => setDraft({ ...draft, isPublished: event.target.checked })} />
                Publish this page on the website
              </label>

              <button disabled={saving} className={`${adminButtonClass} w-full py-3`}>
                <Save size={15} />
                {saving ? 'Saving...' : 'Save page'}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </AdminModuleShell>
  );
}

function StructureCard({
  icon: Icon,
  title,
  copy,
  href,
  action,
  onClick,
}: {
  icon: React.ElementType;
  title: string;
  copy: string;
  action: string;
  href?: string;
  onClick?: () => void;
}) {
  const className = `${adminCardClass} flex min-h-60 flex-col p-6 text-left transition hover:-translate-y-1 hover:shadow-lg`;
  const content = (
    <>
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><Icon size={22} /></div>
      <h2 className="mt-5 font-serif text-2xl font-black">{title}</h2>
      <p className="mt-3 flex-1 text-sm font-medium leading-7 text-gray-500">{copy}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-brand-700">{action}<ExternalLink size={14} /></span>
    </>
  );
  return href ? <Link href={href} className={className}>{content}</Link> : <button onClick={onClick} className={className}>{content}</button>;
}
