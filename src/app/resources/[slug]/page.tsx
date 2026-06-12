import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Clock3, Download, FileText, Users } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { db } from '@/lib/db';
import { parseResourceTags, resourceDestination } from '@/lib/resources';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const resource = await db.resource.findFirst({
    where: { slug, isPublished: true },
    select: { title: true, excerpt: true, seoTitle: true, seoDescription: true },
  });

  return resource
    ? {
        title: resource.seoTitle || `${resource.title} | Inception 23 Resources`,
        description: resource.seoDescription || resource.excerpt,
      }
    : { title: 'Resource Not Found | Inception 23' };
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
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_55%,#eef8fb_100%)]">
      <Header />
      <article className="pb-16 pt-32 sm:pb-20 sm:pt-40">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link href="/resources" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-slate-500 hover:text-brand-950">
            <ArrowLeft size={15} />
            Resource portal
          </Link>

          <header className="mt-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl sm:p-10 lg:p-14">
            {resource.coverImage ? (
              <div className="mb-8 aspect-[16/7] overflow-hidden rounded-[1.5rem] bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resource.coverImage} alt="" className="h-full w-full object-cover" />
              </div>
            ) : null}
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full bg-cyan-50 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-cyan-800">{resource.resourceType}</span>
              <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-slate-600">{resource.category}</span>
            </div>
            <h1 className="mt-7 font-serif text-[clamp(2.5rem,7vw,5.5rem)] font-black leading-[0.98] text-brand-950">{resource.title}</h1>
            <p className="mt-6 max-w-4xl text-lg font-semibold leading-8 text-slate-600">{resource.excerpt}</p>
            {tags.length ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-500">
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
                <a href={`/api/resources/${resource.slug}/access`} className="inline-flex items-center justify-center gap-3 rounded-full bg-brand-950 px-6 py-4 text-xs font-black uppercase tracking-[0.15em] text-white transition hover:-translate-y-1 hover:bg-cyan-700">
                  {resource.accessLabel || 'Access resource'}
                  <ArrowRight size={17} />
                </a>
              ) : null}
            </div>
          </header>

          <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-10 lg:p-14">
            <div className="mb-6 flex items-center gap-3 text-cyan-700">
              <FileText size={22} />
              <p className="text-xs font-black uppercase tracking-[0.2em]">Resource overview</p>
            </div>
            <div className="whitespace-pre-line text-base font-medium leading-8 text-slate-700 sm:text-lg sm:leading-9">
              {resource.content}
            </div>
          </section>

          {relatedResources.length ? (
            <section className="mt-12">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-700">Continue exploring</p>
                  <h2 className="mt-2 font-serif text-3xl font-black text-brand-950">Related resources</h2>
                </div>
                <Link href="/resources" className="hidden text-sm font-black text-brand-700 hover:text-brand-950 sm:block">View library</Link>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {relatedResources.map((item) => (
                  <Link key={item.id} href={`/resources/${item.slug}`} className="group rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-700">{item.resourceType}</p>
                    <h3 className="mt-3 font-serif text-xl font-black leading-tight text-brand-950">{item.title}</h3>
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
