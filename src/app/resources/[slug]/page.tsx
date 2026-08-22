import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Clock3, Download, FileText, Users } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { JsonLd } from '@/components/seo/JsonLd';
import { db } from '@/lib/db';
import { parseResourceTags, resourceDestination } from '@/lib/resources';
import { createPageMetadata } from '@/lib/seo/metadata';
import { articleSchema, breadcrumbSchema } from '@/lib/seo/schema';
import { absoluteUrl, siteConfig } from '@/lib/site';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const resource = await db.resource.findFirst({
    where: { slug, isPublished: true },
    select: { title: true, excerpt: true, seoTitle: true, seoDescription: true, coverImage: true, category: true },
  });

  return resource
    ? createPageMetadata({
        title: resource.seoTitle || resource.title,
        description: resource.seoDescription || resource.excerpt,
        path: `/resources/${slug}`,
        image: resource.coverImage,
        type: 'article',
        keywords: [resource.category],
      })
    : createPageMetadata({
        title: 'Resource Not Found',
        description: 'The requested resource could not be found.',
        path: `/resources/${slug}`,
        noIndex: true,
      });
}

export default async function ResourceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const resource = await db.resource.findFirst({ where: { slug, isPublished: true } });
  if (!resource) notFound();

  const hasDestination = Boolean(resourceDestination(resource));
  const tags = parseResourceTags(resource);
  const relatedResources = await db.resource.findMany({
    where: {
      isPublished: true,
      id: { not: resource.id },
      OR: [
        { category: resource.category },
        ...tags.slice(0, 4).map((tag) => ({ tagsJson: { contains: tag } })),
      ],
    },
    orderBy: [{ isFeatured: 'desc' }, { publishedAt: 'desc' }],
    take: 3,
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      resourceType: true,
      readingMinutes: true,
    },
  });

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-slate-50 dark:bg-night-950">
      <JsonLd
        data={[
          articleSchema({
            headline: resource.title,
            description: resource.seoDescription || resource.excerpt,
            url: absoluteUrl(`/resources/${resource.slug}`),
            image: resource.coverImage ? absoluteUrl(resource.coverImage) : absoluteUrl('/opengraph-image'),
            datePublished: resource.publishedAt || resource.createdAt,
            dateModified: resource.updatedAt,
            publisherName: siteConfig.name,
            publisherLogo: absoluteUrl('/inception23-mark.png'),
          }),
          breadcrumbSchema([
            { name: 'Home', item: absoluteUrl('/') },
            { name: 'Resources', item: absoluteUrl('/resources') },
            { name: resource.title, item: absoluteUrl(`/resources/${resource.slug}`) },
          ]),
        ]}
      />
      <Header />
      <article className="pb-16 pt-32 sm:pb-20 sm:pt-40">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link href="/resources" className="ui-nav-link inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-slate-500 hover:text-brand-950">
            <ArrowLeft size={15} />
            Resource portal
          </Link>

          <header className="ui-panel mt-8 overflow-hidden rounded-lg border border-slate-200 bg-white p-6 shadow-md dark:border-white/10 dark:bg-night-900 sm:p-10 lg:p-14">
            {resource.coverImage ? (
              <div className="ui-media mb-8 aspect-[16/7] overflow-hidden rounded-lg bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resource.coverImage} alt={resource.title} className="h-full w-full object-cover" />
              </div>
            ) : null}
            <div className="flex flex-wrap gap-3">
              <span className="rounded bg-support-50 px-4 py-2 text-xs font-semibold text-support-800">{resource.resourceType}</span>
              <span className="rounded bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600">{resource.category}</span>
            </div>
            <h1 className="mt-7 font-serif text-[clamp(2.5rem,7vw,5.5rem)] font-bold leading-[0.98] text-brand-950">{resource.title}</h1>
            <p className="mt-6 max-w-4xl text-lg font-semibold leading-8 text-slate-600">{resource.excerpt}</p>
            {tags.length ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="rounded bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-8 flex flex-col gap-4 border-t border-slate-100 pt-7 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-5 text-sm font-bold text-slate-500">
                {resource.audience ? <span className="inline-flex items-center gap-2"><Users size={16} />{resource.audience}</span> : null}
                <span className="inline-flex items-center gap-2"><Download size={16} />{resource.downloadCount} accesses</span>
                <span className="inline-flex items-center gap-2"><Clock3 size={16} />{resource.readingMinutes || 1} min read</span>
              </div>
              {hasDestination ? (
                <a href={`/api/resources/${resource.slug}/access`} className="ui-action inline-flex items-center justify-center gap-3 rounded-lg bg-brand-950 px-6 py-4 text-xs font-semibold text-white hover:bg-support-700">
                  {resource.accessLabel || 'Access resource'}
                  <ArrowRight size={17} />
                </a>
              ) : null}
            </div>
          </header>

          <section className="ui-panel mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-night-900 sm:p-10 lg:p-14">
            <div className="mb-6 flex items-center gap-3 text-cyan-700">
              <FileText size={22} />
              <p className="text-xs font-semibold">Resource overview</p>
            </div>
            <div className="whitespace-pre-line text-base font-medium leading-8 text-slate-700 sm:text-lg sm:leading-9">
              {resource.content}
            </div>
          </section>

          {relatedResources.length ? (
            <section className="mt-12">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-support-700">Continue exploring</p>
                  <h2 className="mt-2 font-serif text-3xl font-bold text-brand-950">Related resources</h2>
                </div>
                <Link href="/resources" className="hidden text-sm font-black text-brand-700 hover:text-brand-950 sm:block">View library</Link>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {relatedResources.map((item) => (
                  <Link key={item.id} href={`/resources/${item.slug}`} className="ui-card-interactive group rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-night-900">
                    <p className="text-xs font-semibold text-support-700">{item.resourceType}</p>
                    <h3 className="mt-3 font-serif text-xl font-bold leading-tight text-brand-950">{item.title}</h3>
                    <p className="mt-3 line-clamp-3 text-sm font-semibold leading-6 text-slate-500">{item.excerpt}</p>
                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-bold text-slate-400">
                      <span>{item.readingMinutes || 1} min read</span>
                      <ArrowRight size={16} className="text-cyan-700 transition group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </article>
      <Footer />
    </main>
  );
}
