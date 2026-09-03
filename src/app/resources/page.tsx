import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Download, FileCheck2, Search, Sparkles } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { db } from '@/lib/db';
import { parseResourceTags, resourceCategories, resourceTypes } from '@/lib/resources';
import { createPageMetadata } from '@/lib/seo/metadata';
import { staticPageMetadata } from '@/lib/seo/page-metadata';

export const metadata: Metadata = createPageMetadata(staticPageMetadata.resources);

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
    id: 'fallback-automation-readiness',
    slug: 'automation-readiness-checklist',
    title: 'Automation Readiness Checklist',
    excerpt: 'A practical checklist for identifying where automation and workflow redesign can create measurable business value.',
    category: 'Technology & Software',
    resourceType: 'Checklist',
    audience: 'Business leaders and operations teams',
    tagsJson: JSON.stringify(['Automation', 'Operations', 'Workflow']),
    isFeatured: true,
    downloadCount: 0,
    readingMinutes: 4,
  },
  {
    id: 'fallback-management-control',
    slug: 'management-control-kpi-framework',
    title: 'Management Control & KPI Framework',
    excerpt: 'A simple operating framework for leadership reporting, KPI ownership, review cadence, and management discipline.',
    category: 'Business Advisory & Compliances',
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
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-slate-50 dark:bg-night-950">
      <Header />
      <section className="pb-16 pt-32 sm:pb-20 sm:pt-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-lg border border-brand-900 bg-brand-950 px-5 py-10 text-white shadow-lg sm:px-10 sm:py-14 lg:px-14">
            <div className="relative max-w-4xl">
              <p className="text-xs font-semibold text-support-200">Inception 23 Resource Portal</p>
              <h1 className="mt-5 font-serif text-[clamp(2.6rem,7vw,6rem)] font-bold leading-[0.98] text-white">
                Practical resources for better business decisions.
              </h1>
              <p className="mt-6 max-w-3xl text-base font-semibold leading-8 text-white/70 sm:text-lg">
                Explore working guides, checklists, frameworks, templates, and reports across management, technology, finance, compliance, legal, and creative execution.
              </p>
            </div>
          </div>

          <form className="ui-panel relative z-10 -mt-6 mx-auto grid max-w-6xl gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-md dark:border-white/10 dark:bg-night-900 sm:grid-cols-[1fr_190px_170px_auto] sm:p-5">
            <label className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                name="search"
                defaultValue={search}
                placeholder="Search resources"
                className="ui-field h-12 w-full rounded-lg bg-slate-50 pl-11 pr-4 text-sm font-semibold"
              />
            </label>
            <select name="category" defaultValue={category} className="ui-field h-12 rounded-lg bg-slate-50 px-4 text-sm font-semibold">
              <option value="">All categories</option>
              {resourceCategories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select name="type" defaultValue={type} className="ui-field h-12 rounded-lg bg-slate-50 px-4 text-sm font-semibold">
              <option value="">All formats</option>
              {resourceTypes.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <button className="ui-action inline-flex h-12 items-center justify-center rounded-lg bg-brand-950 px-6 text-xs font-semibold text-white hover:bg-support-700">
              Filter
            </button>
          </form>

          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold text-support-700">Knowledge library</p>
              <h2 className="mt-2 font-serif text-3xl font-bold text-brand-950 sm:text-4xl">
                {totalResources} resource{totalResources === 1 ? '' : 's'} available
              </h2>
            </div>
            {(search || category || type) ? (
              <Link href="/resources" className="text-sm font-black text-brand-700 hover:text-brand-950">Clear filters</Link>
            ) : null}
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {resources.map((resource) => (
              <article key={resource.id} className="ui-card-interactive group flex min-h-[330px] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-night-900">
                <div className="flex items-center justify-between gap-4">
                  <span className="inline-flex items-center gap-2 rounded bg-support-50 px-3 py-2 text-xs font-semibold text-support-800">
                    <FileCheck2 size={14} />
                    {resource.resourceType}
                  </span>
                  {resource.isFeatured ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent-600">
                      <Sparkles size={13} />
                      Featured
                    </span>
                  ) : null}
                </div>
                <p className="mt-7 text-xs font-semibold text-slate-500">{resource.category}</p>
                <h3 className="mt-3 font-serif text-2xl font-bold leading-tight text-brand-950">{resource.title}</h3>
                <p className="mt-4 flex-1 text-sm font-semibold leading-7 text-slate-600">{resource.excerpt}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {parseResourceTags(resource).slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
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
                  <Link href={`/resources/${resource.slug}`} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-support-700 transition group-hover:gap-3">
                    View resource
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {resources.length === 0 ? (
            <div className="mt-8 rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center dark:border-white/15 dark:bg-night-900">
              <BookOpen className="mx-auto text-slate-300" size={40} />
              <h2 className="mt-4 text-xl font-bold text-brand-950">No matching resources</h2>
              <p className="mt-2 text-sm text-slate-500">Try a broader search or clear the current filters.</p>
            </div>
          ) : null}

          {totalPages > 1 ? (
            <nav className="mt-10 flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-night-900" aria-label="Resource pagination">
              {currentPage > 1 ? (
                <Link href={pageHref(currentPage - 1)} className="ui-action rounded-lg px-4 py-3 text-xs font-semibold text-brand-700 hover:bg-slate-50">
                  Previous
                </Link>
              ) : <span />}
              <span className="text-xs font-semibold text-slate-500">
                Page {Math.min(currentPage, totalPages)} of {totalPages}
              </span>
              {currentPage < totalPages ? (
                <Link href={pageHref(currentPage + 1)} className="ui-action rounded-lg px-4 py-3 text-xs font-semibold text-brand-700 hover:bg-slate-50">
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
