import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

async function findPage(parts: string[]) {
  return db.cmsPage.findFirst({ where: { slug: parts.join('/'), isPublished: true } });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await findPage(slug);
  return page
    ? { title: page.seoTitle || `${page.title} | Inception 23`, description: page.seoDescription || page.excerpt }
    : { title: 'Page Not Found | Inception 23' };
}

export default async function CmsPublicPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await findPage(slug);
  if (!page) notFound();

  const widthClass =
    page.template === 'wide' ? 'max-w-7xl' : page.template === 'editorial' ? 'max-w-3xl' : 'max-w-5xl';

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_48%,#f2f8fb_100%)]">
      <Header />
      <article className="pb-20 pt-32 sm:pt-40">
        <div className={`mx-auto ${widthClass} px-4 sm:px-6 lg:px-8`}>
          <header className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl">
            {page.heroImage ? (
              <div className="aspect-[16/7] bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={page.heroImage} alt="" className="h-full w-full object-cover" />
              </div>
            ) : null}
            <div className="p-6 sm:p-10 lg:p-14">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-700">{page.navigationLabel || 'Inception 23'}</p>
              <h1 className="mt-5 font-serif text-[clamp(2.6rem,7vw,5.5rem)] font-black leading-[0.98] text-brand-950">{page.title}</h1>
              {page.excerpt ? <p className="mt-6 max-w-4xl text-lg font-semibold leading-8 text-slate-600">{page.excerpt}</p> : null}
            </div>
          </header>

          {page.videoEmbedUrl ? (
            <section className="mt-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-black shadow-xl">
              <div className="aspect-video">
                <iframe
                  src={page.videoEmbedUrl}
                  title={`${page.title} video`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </section>
          ) : null}

          <section className="cms-public-content mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-10 lg:p-14" dangerouslySetInnerHTML={{ __html: page.bodyHtml }} />
        </div>
      </article>
      <Footer />
    </main>
  );
}
