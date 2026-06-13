import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Download, FileCheck2, Search, Sparkles } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { db } from '@/lib/db';
import { parseResourceTags, resourceCategories, resourceTypes } from '@/lib/resources';

export const metadata: Metadata = {
  title: 'Resource Portal | Inception 23',
  description: 'Practical guides, checklists, frameworks, templates, and reports for growing organizations.',
};

export const dynamic = 'force-dynamic';

type PageProps = {
  searchParams: Promise<{ search?: string; category?: string; type?: string; page?: string }>;
};

type ResourceCard = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  resourceType: string;
  audience: string | null;
  tagsJson: string;
  isFeatured: boolean;
  downloadCount: number;
  readingMinutes: number | null;
};

const fallbackResources: ResourceCard[] = [
  {
    id: 'fallback-ai-readiness',
    slug: 'ai-automation-readiness-checklist',
    title: 'AI & Automation Readiness Checklist',
    excerpt: 'A practical checklist for identifying where AI, automation, and workflow redesign can create measurable business value.',
    category: 'Technology & AI',
    resourceType: 'Checklist',
    audience: 'Business leaders and operations teams',
    tagsJson: JSON.stringify(['AI', 'Automation', 'Operations']),
    isFeatured: true,
    downloadCount: 0,
    readingMinutes: 4,
  },
  {
    id: 'fallback-management-control',
    slug: 'management-control-kpi-framework',
    title: 'Management Control & KPI Framework',
    excerpt: 'A simple operating framework for leadership reporting, KPI ownership, review cadence, and management discipline.',
    category: 'Management & Finance',
    resourceType: 'Framework',
    audience: 'Founders, managers, and finance teams',
    tagsJson: JSON.stringify(['KPI', 'Reporting', 'Finance']),
    isFeatured: true,
    downloadCount: 0,
    readingMinutes: 5,
  },
  {
    id: 'fallback-compliance-register',
    slug: 'legal-compliance-document-register',
    title: 'Legal & Compliance Document Register',
    excerpt: 'A starter structure for tracking agreements, policies, deadlines, case files, risk items, and document ownership.',
    category: 'Legal & Compliance',
    resourceType: 'Template',
    audience: 'Compliance, legal, and admin teams',
    tagsJson: JSON.stringify(['Documents', 'Compliance', 'Risk']),
    isFeatured: false,
    downloadCount: 0,
    readingMinutes: 3,
  },
  {
    id: 'fallback-brand-launch',
    slug: 'brand-launch-content-planner',
    title: 'Brand Launch Content Planner',
    excerpt: 'A compact planning guide for coordinating brand assets, social posts, landing pages, pitch decks, and campaign messages.',
    category: 'Creative & Brand',
    resourceType: 'Guide',
    audience: 'Marketing and creative teams',
    tagsJson: JSON.stringify(['Brand', 'Content', 'Campaign']),
    isFeatured: false,
    downloadCount: 0,
    readingMinutes: 4,
  },
];

function filterFallbackResources(resources: ResourceCard[], search: string, category: string, type: string) {
  const normalizedSearch = search.toLowerCase();

  return resources.filter((resource) => {
    if (category && resource.category !== category) return false;
    if (type && resource.resourceType !== type) return false;
    if (!normalizedSearch) return true;

    return [resource.title, resource.excerpt, resource.category, resource.resourceType, resource.audience ?? '', resource.tagsJson]
      .join(' ')
      .toLowerCase()
      .includes(normalizedSearch);
  });
}

export default async function ResourcesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search?.trim() || '';
  const category = params.category?.trim() || '';
  const type = params.type?.trim() || '';
  const requestedPage = Number.parseInt(params.page || '1', 10);
  const currentPage = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const pageSize = 9;

  const where = {
    isPublished: true,
    ...(category ? { category } : {}),
    ...(type ? { resourceType: type } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search } },
            { excerpt: { contains: search } },
            { category: { contains: search } },
            { resourceType: { contains: search } },
            { audience: { contains: search } },
            { tagsJson: { contains: search } },
          ],
        }
      : {}),
  };

  let resources: ResourceCard[];
  let totalResources: number;

  try {
    const [dbResources, dbTotalResources] = await Promise.all([
      db.resource.findMany({
        where,
        orderBy: [{ isFeatured: 'desc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
        skip: (currentPage - 1) * pageSize,
        take: pageSize,
      }),
      db.resource.count({ where }),
    ]);
    resources = dbResources;
    totalResources = dbTotalResources;
  } catch (error) {
    console.error('Resource portal database unavailable. Rendering fallback resources.', error);
    const filteredFallbackResources = filterFallbackResources(fallbackResources, search, category, type);
    totalResources = filteredFallbackResources.length;
    resources = filteredFallbackResources.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }
  const totalPages = Math.max(1, Math.ceil(totalResources / pageSize));
  const pageHref = (page: number) => {
    const query = new URLSearchParams();
    if (search) query.set('search', search);
    if (category) query.set('category', category);
    if (type) query.set('type', type);
    if (page > 1) query.set('page', String(page));
    return `/resources${query.size ? `?${query.toString()}` : ''}`;
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_42%,#f1f8fb_100%)]">
      <Header />
      <section className="pb-16 pt-32 sm:pb-20 sm:pt-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-brand-950 px-5 py-10 text-white shadow-2xl shadow-brand-950/15 sm:px-10 sm:py-14 lg:px-14">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-emerald-400/15 blur-3xl" />
            <div className="relative max-w-4xl">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">Inception 23 Resource Portal</p>
              <h1 className="mt-5 font-serif text-[clamp(2.6rem,7vw,6rem)] font-black leading-[0.98]">
                Practical resources for better business decisions.
              </h1>
              <p className="mt-6 max-w-3xl text-base font-semibold leading-8 text-white/70 sm:text-lg">
                Explore working guides, checklists, frameworks, templates, and reports across management, technology, finance, compliance, legal, and creative execution.
              </p>
            </div>
          </div>

          <form className="relative z-10 -mt-6 mx-auto grid max-w-6xl gap-3 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-xl sm:grid-cols-[1fr_190px_170px_auto] sm:rounded-[2rem] sm:p-5">
            <label className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                name="search"
                defaultValue={search}
                placeholder="Search resources"
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-bold text-brand-950 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
              />
            </label>
            <select name="category" defaultValue={category} className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-brand-950 outline-none focus:border-cyan-500">
              <option value="">All categories</option>
              {resourceCategories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select name="type" defaultValue={type} className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-brand-950 outline-none focus:border-cyan-500">
              <option value="">All formats</option>
              {resourceTypes.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <button className="inline-flex h-12 items-center justify-center rounded-xl bg-brand-950 px-6 text-xs font-black uppercase tracking-[0.15em] text-white transition hover:bg-cyan-700">
              Filter
            </button>
          </form>

          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-700">Knowledge library</p>
              <h2 className="mt-2 font-serif text-3xl font-black text-brand-950 sm:text-4xl">
                {totalResources} resource{totalResources === 1 ? '' : 's'} available
              </h2>
            </div>
            {(search || category || type) ? (
              <Link href="/resources" className="text-sm font-black text-brand-700 hover:text-brand-950">Clear filters</Link>
            ) : null}
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {resources.map((resource) => (
              <article key={resource.id} className="group flex min-h-[330px] flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="flex items-center justify-between gap-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-800">
                    <FileCheck2 size={14} />
                    {resource.resourceType}
                  </span>
                  {resource.isFeatured ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-600">
                      <Sparkles size={13} />
                      Featured
                    </span>
                  ) : null}
                </div>
                <p className="mt-7 text-xs font-black uppercase tracking-[0.18em] text-slate-400">{resource.category}</p>
                <h3 className="mt-3 font-serif text-2xl font-black leading-tight text-brand-950">{resource.title}</h3>
                <p className="mt-4 flex-1 text-sm font-semibold leading-7 text-slate-600">{resource.excerpt}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {parseResourceTags(resource).slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500">
                      {tag}
                    </span>
                  ))}
                </div>
                {resource.audience ? <p className="mt-5 text-xs font-bold text-slate-400">For {resource.audience}</p> : null}
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                    <span className="inline-flex items-center gap-1.5"><Download size={14} />{resource.downloadCount}</span>
                    <span>{resource.readingMinutes || 1} min read</span>
                  </div>
                  <Link href={`/resources/${resource.slug}`} className="inline-flex items-center gap-2 text-sm font-black text-cyan-700 transition group-hover:gap-3">
                    View resource
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {resources.length === 0 ? (
            <div className="mt-8 rounded-[2rem] border border-dashed border-slate-300 bg-white p-12 text-center">
              <BookOpen className="mx-auto text-slate-300" size={40} />
              <h2 className="mt-4 text-xl font-black text-brand-950">No matching resources</h2>
              <p className="mt-2 text-sm text-slate-500">Try a broader search or clear the current filters.</p>
            </div>
          ) : null}

          {totalPages > 1 ? (
            <nav className="mt-10 flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm" aria-label="Resource pagination">
              {currentPage > 1 ? (
                <Link href={pageHref(currentPage - 1)} className="rounded-xl px-4 py-3 text-xs font-black uppercase tracking-wider text-brand-700 hover:bg-slate-50">
                  Previous
                </Link>
              ) : <span />}
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                Page {Math.min(currentPage, totalPages)} of {totalPages}
              </span>
              {currentPage < totalPages ? (
                <Link href={pageHref(currentPage + 1)} className="rounded-xl px-4 py-3 text-xs font-black uppercase tracking-wider text-brand-700 hover:bg-slate-50">
                  Next
                </Link>
              ) : <span />}
            </nav>
          ) : null}
        </div>
      </section>
      <Footer />
    </main>
  );
}
