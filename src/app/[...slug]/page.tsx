import type { Metadata } from 'next';
import { notFound, permanentRedirect, redirect } from 'next/navigation';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { JsonLd } from '@/components/seo/JsonLd';
import { db } from '@/lib/db';
import { sanitizeCmsHtml } from '@/lib/cms';
import { createPageMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema } from '@/lib/seo/schema';
import { absoluteUrl, siteConfig } from '@/lib/site';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

async function findPage(parts: string[]) {
  return db.cmsPage.findFirst({ where: { slug: parts.join('/'), isPublished: true } });
}

function safeRedirectTarget(value: string) {
  try {
    const url = new URL(value, siteConfig.url);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null;
  } catch {
    return null;
  }
}

async function applyManagedRedirect(parts: string[]) {
  const sourcePath = `/${parts.join('/')}`;
  const rule = await db.seoRedirect.findUnique({ where: { sourcePath } }).catch(() => null);
  if (!rule?.isActive) return;

  const destination = safeRedirectTarget(rule.targetPath);
  if (!destination) return;

  await db.seoRedirect.update({
    where: { id: rule.id },
    data: { hitCount: { increment: 1 } },
  }).catch(() => undefined);

  if (rule.statusCode === 301 || rule.statusCode === 308) permanentRedirect(destination);
  redirect(destination);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await findPage(slug);
  return page
    ? createPageMetadata({
        title: page.seoTitle || page.title,
        description: page.seoDescription || page.excerpt,
        path: `/${page.slug}`,
        image: page.heroImage,
        type: page.template === 'editorial' ? 'article' : 'website',
      })
    : createPageMetadata({
        title: 'Page Not Found',
        description: 'The requested page could not be found.',
        path: `/${slug.join('/')}`,
        noIndex: true,
      });
}

export default async function CmsPublicPage({ params }: PageProps) {
  const { slug } = await params;
  await applyManagedRedirect(slug);
  const page = await findPage(slug);
  if (!page) notFound();
  const safeBodyHtml = sanitizeCmsHtml(page.bodyHtml);

  const widthClass =
    page.template === 'wide' ? 'max-w-7xl' : page.template === 'editorial' ? 'max-w-3xl' : 'max-w-5xl';

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-slate-50 dark:bg-night-950">
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': page.template === 'editorial' ? 'Article' : 'WebPage',
            name: page.title,
            description: page.seoDescription || page.excerpt,
            url: absoluteUrl(`/${page.slug}`),
            image: page.heroImage ? absoluteUrl(page.heroImage) : undefined,
            datePublished: page.publishedAt?.toISOString(),
            dateModified: page.updatedAt.toISOString(),
            publisher: { '@id': `${siteConfig.url}/#organization` },
          },
          breadcrumbSchema([
            { name: 'Home', item: absoluteUrl('/') },
            { name: page.title, item: absoluteUrl(`/${page.slug}`) },
          ]),
        ]}
      />
      <Header />
      <article className="pb-20 pt-32 sm:pt-40">
        <div className={`mx-auto ${widthClass} px-4 sm:px-6 lg:px-8`}>
          <header className="ui-panel overflow-hidden rounded-lg border border-slate-200 bg-white shadow-md dark:border-white/10 dark:bg-night-900">
            {page.heroImage ? (
              <div className="aspect-[16/7] bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={page.heroImage} alt={page.title} className="h-full w-full object-cover" />
              </div>
            ) : null}
            <div className="p-6 sm:p-10 lg:p-14">
              <p className="text-xs font-semibold text-support-700">{page.navigationLabel || 'Inception 23'}</p>
              <h1 className="mt-5 font-serif text-[clamp(2.6rem,7vw,5.5rem)] font-bold leading-[0.98] text-brand-950">{page.title}</h1>
              {page.excerpt ? <p className="mt-6 max-w-4xl text-lg font-semibold leading-8 text-slate-600">{page.excerpt}</p> : null}
            </div>
          </header>

          {page.videoEmbedUrl ? (
            <section className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-black shadow-md dark:border-white/10">
              <div className="aspect-video">
                <iframe
                  src={page.videoEmbedUrl}
                  title={`${page.title} video`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  referrerPolicy="strict-origin-when-cross-origin"
                  sandbox="allow-scripts allow-same-origin allow-presentation"
                  allowFullScreen
                />
              </div>
            </section>
          ) : null}

          <section className="cms-public-content ui-panel mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-night-900 sm:p-10 lg:p-14" dangerouslySetInnerHTML={{ __html: safeBodyHtml }} />
        </div>
      </article>
      <Footer />
    </main>
  );
}
