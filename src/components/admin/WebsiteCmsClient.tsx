'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import type { ElementType } from 'react';
import Link from 'next/link';
import {
  ExternalLink,
  FilePenLine,
  FilePlus2,
  FolderOpen,
  Home,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  ListTree,
  Newspaper,
  Pencil,
  RadioTower,
  RefreshCw,
  Save,
  Settings2,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import {
  AdminField,
  AdminLoadingSkeleton,
  AdminModuleShell,
  AdminStatCard,
  adminButtonClass,
  adminCardClass,
  adminInputClass,
  adminSecondaryButtonClass,
} from './AdminModuleShell';
import { RichTextEditor } from './RichTextEditor';
import { SiteAssetLibrary } from './SiteAssetLibrary';
import type { SiteAsset, SiteAssetKind } from '@/lib/site-asset-types';

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

type UploadedMediaAsset = {
  id: string;
  name: string;
  fileName: string;
  url: string;
  mimeType: string;
  size: number;
  altText: string;
  createdAt: string;
};

function getUploadedAssetKind(mimeType: string): SiteAssetKind {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  return 'other';
}

function normalizeUploadedAsset(asset: UploadedMediaAsset, usage: string[] = []): SiteAsset {
  const extension = asset.fileName.includes('.') ? asset.fileName.split('.').pop()?.toLowerCase() || 'file' : 'file';
  return {
    ...asset,
    extension,
    kind: getUploadedAssetKind(asset.mimeType),
    source: 'uploaded',
    readOnly: false,
    usage,
  };
}

type View = 'dashboard' | 'pages' | 'media' | 'structure';

const editableCollections = [
  ['navigation', 'Header / Navigation', 'Top menu label, URL, dropdown behavior'],
  ['servicesMenu', 'Services Dropdown', 'Service dropdown cards and links'],
  ['eventsMenu', 'Events Dropdown', 'Event dropdown cards and links'],
  ['solutionsMenu', 'Solutions Dropdown', 'Solution dropdown cards and links'],
  ['industriesMenu', 'Industries Dropdown', 'Industry dropdown cards and links'],
  ['insightsMenu', 'Insights Dropdown', 'Insight dropdown cards and links'],
  ['resourcesMenu', 'Resources Dropdown', 'Resource dropdown cards and links'],
  ['aboutMenu', 'About Dropdown', 'About dropdown cards and links'],
  ['serviceDetails', 'Service Detail Pages', 'Page media, copy, process, deliverables, and use cases'],
  ['insights', 'Posts / Insights', 'Blog-style cards for the Insights page'],
  ['caseStudies', 'Case Studies', 'Portfolio/case-study cards and metrics'],
  ['testimonials', 'Testimonials', 'Quotes, names, roles, optional media'],
  ['serviceCategories', 'Our Services', 'Homepage service cards and highlight bullets'],
  ['eventServices', 'Event Services', 'Event rows, descriptions, and contact destinations'],
  ['eventHandover', 'Event Handover Pack', 'Event deliverables and closing documents'],
  ['eventPhases', 'Event Delivery Phases', 'Before, during, and after delivery notes'],
  ['serviceEcosystem', 'Service Ecosystem', 'Category tabs and every capability card'],
  ['aiCapabilities', 'AI Solutions', 'AI cards, benefits, icons, text'],
  ['caAdvisory', 'CA Advisory', 'Finance, tax, VAT, compliance focus items'],
  ['whyChoose', 'Why Choose Us', 'Reason cards, icons, descriptions'],
  ['industries', 'Industries', 'Industry cards, value text, optional images'],
  ['process', 'Process', 'Timeline steps, icons, descriptions'],
  ['solutions', 'Featured Solutions', 'Solution stories, modules, image and video URL'],
  ['team', 'Team', 'Team profiles, images, links, expertise'],
  ['techStack', 'Technology Stack', 'Tool groups, chips, colors'],
  ['mainServices', 'Main Services Showcase', 'GSAP slides, images, colors, service bullets'],
  ['footerCompanyLinks', 'Footer Company Links', 'Footer navigation links'],
  ['footerSocialLinks', 'Footer Social Links', 'Social URLs and icons'],
  ['footerTrustPoints', 'Footer Trust Points', 'Footer trust cards'],
  ['footerContactHighlights', 'Footer Contact Highlights', 'Footer contact info rows'],
  ['contactChannels', 'Contact Channels', 'Up to 3 emails, 3 phone numbers, and 1 WhatsApp contact'],
  ['contactBudgets', 'Contact Budget Options', 'Budget dropdown items'],
  ['contactTrustPoints', 'Contact Trust Points', 'Contact section trust bullets'],
  ['aboutValues', 'About Values', 'About page value cards'],
  ['aboutExpertise', 'About Expertise', 'About page expertise bullets'],
] as const;

type CollectionSummary = {
  id: typeof editableCollections[number][0];
  count: number;
};

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
  const [assets, setAssets] = useState<SiteAsset[]>([]);
  const [builtInAssets, setBuiltInAssets] = useState<SiteAsset[]>([]);
  const [collectionSummaries, setCollectionSummaries] = useState<CollectionSummary[]>([]);
  const [draft, setDraft] = useState<PageDraft | null>(null);
  const [view, setView] = useState<View>('dashboard');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [query, setQuery] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [pagesResponse, mediaResponse, siteAssetsResponse, ...collectionResponses] = await Promise.all([
        fetch('/api/v1/admin/cms/pages'),
        fetch('/api/v1/admin/cms/media'),
        fetch('/api/v1/admin/cms/site-assets'),
        ...editableCollections.map(([id]) => fetch(`/api/v1/admin/website-content/${id}`)),
      ]);
      const [pagesPayload, mediaPayload, siteAssetsPayload, ...collectionPayloads] = await Promise.all([
        pagesResponse.json(),
        mediaResponse.json(),
        siteAssetsResponse.json(),
        ...collectionResponses.map((response) => response.json()),
      ]);
      if (!pagesResponse.ok) throw new Error(pagesPayload.error || 'Could not load pages');
      if (!mediaResponse.ok) throw new Error(mediaPayload.error || 'Could not load media');
      if (!siteAssetsResponse.ok) throw new Error(siteAssetsPayload.error || 'Could not load built-in assets');
      setPages(pagesPayload.data);
      setAssets((mediaPayload.data as UploadedMediaAsset[]).map((asset) => normalizeUploadedAsset(asset, siteAssetsPayload.usage?.[asset.url] || [])));
      setBuiltInAssets(siteAssetsPayload.data);
      setCollectionSummaries(
        editableCollections.map(([id], index) => ({
          id,
          count: Array.isArray(collectionPayloads[index]?.data) ? collectionPayloads[index].data.length : 0,
        })),
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not load the website CMS');
    } finally {
      setLoading(false);
    }
  }, []);

  const allAssets = useMemo(() => {
    const byUrl = new Map<string, SiteAsset>();
    builtInAssets.forEach((asset) => byUrl.set(asset.url, asset));
    assets.forEach((asset) => byUrl.set(asset.url, asset));
    return [...byUrl.values()].sort((left, right) => left.fileName.localeCompare(right.fileName));
  }, [assets, builtInAssets]);

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

  const deleteMedia = async (asset: SiteAsset) => {
    if (asset.readOnly) return;
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
      eyebrow="New website structure CMS"
      nav={[
        { href: '/', label: 'View website' },
        { href: '/admin/homepage', label: 'Homepage layout' },
      ]}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Custom Pages" value={pages.length} />
        <AdminStatCard label="Published" value={pages.filter((page) => page.isPublished).length} tone="emerald" />
        <AdminStatCard label="Drafts" value={pages.filter((page) => !page.isPublished).length} tone="rose" />
        <AdminStatCard label="Media Assets" value={allAssets.length} tone="cyan" />
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
        {([
          ['dashboard', 'Dashboard', Home],
          ['pages', 'Website pages', FilePenLine],
          ['media', 'Media library', ImageIcon],
          ['structure', 'Homepage sections', LayoutDashboard],
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

          {loading ? <div className="p-5"><AdminLoadingSkeleton rows={4} framed={false} /></div> : null}

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
              <p className="text-xs font-black uppercase tracking-wider text-brand-700">Upload media</p>
              <h2 className="mt-1 font-serif text-2xl font-black">Add to media library</h2>
            </div>
            <AdminField label="Media file">
              <input type="file" name="file" accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime" required className={`${adminInputClass} file:mr-3 file:rounded-md file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-xs file:font-black file:text-brand-700`} />
            </AdminField>
            <AdminField label="Alt text">
              <input name="altText" className={adminInputClass} placeholder="Describe the image for accessibility" />
            </AdminField>
            <button disabled={uploading} className={`${adminButtonClass} w-full`}>
              <Upload size={15} />
              {uploading ? 'Uploading...' : 'Upload image'}
            </button>
            <p className="text-xs leading-5 text-gray-500">JPG, PNG, WebP, GIF, MP4, WebM, or MOV. Maximum 4 MB.</p>
          </form>

          <SiteAssetLibrary assets={allAssets} onCopy={copyUrl} onDelete={deleteMedia} />
        </div>
      ) : null}

      {view === 'dashboard' ? (
        <div className="mt-5 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard label="Pages" value={pages.length} />
            <AdminStatCard label="Posts" value={collectionSummaries.find((item) => item.id === 'insights')?.count ?? 0} tone="cyan" />
            <AdminStatCard label="Media" value={allAssets.length} tone="emerald" />
            <AdminStatCard label="Editable blocks" value={collectionSummaries.reduce((sum, item) => sum + item.count, 0)} tone="rose" />
          </div>

          <section className={`${adminCardClass} overflow-hidden`}>
            <div className="border-b border-gray-200 bg-gray-50 p-5">
              <p className="text-xs font-black uppercase tracking-wider text-brand-700">WordPress-style CMS</p>
              <h2 className="mt-1 font-serif text-2xl font-black">Content control center</h2>
              <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-gray-500">
                Manage pages, posts, media, menus, homepage sections, SEO, resources, and system tools from one place.
              </p>
            </div>
            <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
              <CmsModuleCard icon={FilePenLine} title="Pages" meta={`${pages.length} pages`} copy="Create rich pages with hero media, video, SEO, drafts, and publishing." onClick={() => setView('pages')} action="Manage pages" />
              <CmsModuleCard icon={Newspaper} title="Posts / Insights" meta={`${collectionSummaries.find((item) => item.id === 'insights')?.count ?? 0} posts`} copy="Manage blog-style insight cards shown on the Insights page." href="/admin/content/insights" action="Manage posts" />
              <CmsModuleCard icon={ImageIcon} title="Media Library" meta={`${allAssets.length} files`} copy="Search every built-in and uploaded website asset, see where it is used, preview it, or copy its URL." onClick={() => setView('media')} action="Open media" />
              <CmsModuleCard icon={ListTree} title="Menus" meta="Header navigation" copy="Edit top navigation labels, URLs, order, and dropdown behavior." href="/admin/content/navigation" action="Edit menus" />
              <CmsModuleCard icon={Home} title="Homepage Layout" meta="Hero + sections" copy="Edit hero slides, CTA labels, section order, visibility, headings, and hero visuals." href="/admin/homepage" action="Edit layout" />
              <CmsModuleCard icon={LayoutDashboard} title="Section Builder" meta={`${editableCollections.length - 2} sections`} copy="Edit every live homepage section item: cards, services, team, solutions, and visuals." onClick={() => setView('structure')} action="Open sections" />
              <CmsModuleCard icon={FolderOpen} title="Resources" meta="Downloads/content" copy="Manage resource portal entries, access links, categories, metadata, and publishing." href="/admin/resources" action="Manage resources" />
              <CmsModuleCard icon={Inbox} title="Leads & Subscribers" meta="Contact operations" copy="Review contact submissions, quick inquiries, and newsletter subscribers from one protected workspace." href="/admin/leads" action="Open leads" />
              <CmsModuleCard icon={RadioTower} title="Pixels / CAPI" meta="Tracking setup" copy="Toggle Google, Meta, LinkedIn, TikTok, X, Clarity, and server-side event settings." href="/admin/tracking" action="Open tracking" />
              <CmsModuleCard icon={Settings2} title="SEO" meta="Search controls" copy="Manage SEO settings, redirects, robots, sitemap, product metadata, and image alt text." href="/admin/seo" action="Open SEO" />
              <CmsModuleCard icon={ExternalLink} title="Preview Website" meta="Public site" copy="Open the public website after publishing CMS changes." href="/" action="View site" />
            </div>
          </section>

          <section className={`${adminCardClass} p-5`}>
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-brand-700">Quick section access</p>
                <h2 className="mt-1 font-serif text-2xl font-black">Editable website parts</h2>
              </div>
              <button onClick={load} disabled={loading} className={adminSecondaryButtonClass}>
                <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {editableCollections.map(([id, label]) => {
                const count = collectionSummaries.find((item) => item.id === id)?.count ?? 0;
                return (
                  <Link key={id} href={`/admin/content/${id}`} className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-black text-gray-800 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
                    <span className="min-w-0 truncate">{label}</span>
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] text-gray-500">{count}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      ) : null}

      {view === 'structure' ? (
        <div className="mt-5 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard label="Editable sections" value={editableCollections.length + 1} />
            <AdminStatCard label="Section items" value={collectionSummaries.reduce((sum, item) => sum + item.count, 0)} tone="cyan" />
            <AdminStatCard label="Media files" value={allAssets.length} tone="emerald" />
            <AdminStatCard label="Custom pages" value={pages.length} tone="rose" />
          </div>

          <section className={`${adminCardClass} overflow-hidden`}>
            <div className="flex flex-col gap-3 border-b border-gray-200 bg-gray-50 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-brand-700">Current homepage structure</p>
                <h2 className="mt-1 font-serif text-2xl font-black">Edit every live section</h2>
                <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-gray-500">
                  These are the new website sections. Open any section to add, upload, delete, reorder, or change its visible elements.
                </p>
              </div>
              <Link href="/admin/homepage" className={adminButtonClass}>
                <Settings2 size={15} />
                Layout / headings
              </Link>
            </div>

            <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
              <Link href="/admin/homepage" className="group flex min-h-52 flex-col rounded-xl border border-gray-200 bg-white p-5 transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                    <Home size={20} />
                  </div>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-gray-500">hero + sections</span>
                </div>
                <h3 className="mt-5 font-serif text-xl font-black text-gray-950">Hero, section order, headings</h3>
                <p className="mt-3 flex-1 text-sm font-medium leading-6 text-gray-500">Hero slide text, buttons, section visibility, ordering, headings, descriptions, and support copy.</p>
                <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-brand-700">Open editor <ExternalLink size={14} /></span>
              </Link>

              {editableCollections.map(([id, label, description]) => {
                const count = collectionSummaries.find((item) => item.id === id)?.count ?? 0;
                return (
                  <Link key={id} href={`/admin/content/${id}`} className="group flex min-h-52 flex-col rounded-xl border border-gray-200 bg-white p-5 transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700">
                        <LayoutDashboard size={20} />
                      </div>
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-gray-500">{count} item{count === 1 ? '' : 's'}</span>
                    </div>
                    <h3 className="mt-5 font-serif text-xl font-black text-gray-950">{label}</h3>
                    <p className="mt-3 flex-1 text-sm font-medium leading-6 text-gray-500">{description}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-brand-700">Add / edit / upload <ExternalLink size={14} /></span>
                  </Link>
                );
              })}
            </div>
          </section>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <StructureCard icon={ImageIcon} title="Media library" copy="Upload reusable website imagery and video, maintain alt text, and select media inside section editors." onClick={() => setView('media')} action="Manage media" />
            <StructureCard icon={FilePenLine} title="Custom pages" copy="Create extra rich-content pages with images, videos, SEO metadata, and publishing controls." onClick={() => setView('pages')} action="Manage pages" />
            <StructureCard icon={Home} title="Preview website" copy="Open the live homepage after saving section changes to confirm the public view." href="/" action="View website" />
          </div>
        </div>
      ) : null}

      {draft ? (
        <div className="dialog-backdrop fixed inset-0 z-[100] flex justify-end bg-gray-950/40" role="dialog" aria-modal="true" aria-label="Page editor">
          <button className="hidden flex-1 lg:block" onClick={() => setDraft(null)} aria-label="Close page editor" />
          <div className="dialog-panel h-full w-full overflow-y-auto bg-white p-5 shadow-xl dark:bg-night-900 sm:max-w-4xl sm:p-7">
            <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-brand-700">Full page editor</p>
                <h2 className="mt-1 font-serif text-2xl font-black">{draft.id ? 'Edit page' : 'Create page'}</h2>
              </div>
              <button onClick={() => setDraft(null)} aria-label="Close editor" className="ui-action inline-flex h-11 w-11 items-center justify-center rounded-lg border border-gray-200 text-gray-600 dark:border-white/10"><X size={17} /></button>
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
  icon: ElementType;
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

function CmsModuleCard({
  icon: Icon,
  title,
  meta,
  copy,
  href,
  action,
  onClick,
}: {
  icon: ElementType;
  title: string;
  meta: string;
  copy: string;
  action: string;
  href?: string;
  onClick?: () => void;
}) {
  const className = 'group flex min-h-56 flex-col rounded-xl border border-gray-200 bg-white p-5 text-left transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg';
  const content = (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-700 transition group-hover:bg-brand-600 group-hover:text-white">
          <Icon size={20} />
        </div>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-gray-500">{meta}</span>
      </div>
      <h3 className="mt-5 font-serif text-xl font-black text-gray-950">{title}</h3>
      <p className="mt-3 flex-1 text-sm font-medium leading-6 text-gray-500">{copy}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-brand-700">
        {action}
        <ExternalLink size={14} />
      </span>
    </>
  );

  return href ? <Link href={href} className={className}>{content}</Link> : <button type="button" onClick={onClick} className={className}>{content}</button>;
}
