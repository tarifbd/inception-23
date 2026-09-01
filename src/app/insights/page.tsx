import type { Metadata } from 'next';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { SectionHeader } from '@/components/common/PremiumSections';
import { insights } from '@/lib/constants/services';
import { getWebsiteCollection, type CollectionRecord } from '@/lib/website-collections';
import { createPageMetadata } from '@/lib/seo/metadata';
import { staticPageMetadata } from '@/lib/seo/page-metadata';

export const metadata: Metadata = createPageMetadata(staticPageMetadata.insights);

export const revalidate = 300;

type InsightPost = CollectionRecord & {
  slug: string;
  title: string;
  category: string;
  summary: string;
  image?: string;
  isPublished?: string | boolean;
};

export default async function InsightsPage() {
  const posts = await getWebsiteCollection<InsightPost>('insights');
  const visiblePosts = (posts.length ? posts : insights as InsightPost[])
    .filter((post) => post.isPublished !== 'false' && post.isPublished !== false);

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-white dark:bg-night-950">
      <Header />
      <section className="pb-16 pt-28 sm:pb-20 sm:pt-36 lg:pb-24 lg:pt-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Insights" title="Structured thinking for practical operators." description="Notes, explainers, and field observations prepared for the website content library." headingLevel="h1" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
            {visiblePosts.map((post) => (
              <article key={post.slug} className="ui-card-interactive rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-night-900 sm:p-7 lg:p-8">
                {post.image ? (
                  <div className="ui-media mb-5 aspect-[16/10] overflow-hidden rounded-lg bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
                  </div>
                ) : null}
                <p className="text-xs font-semibold text-brand-600">{post.category}</p>
                <h2 className="mt-6 break-words font-serif text-2xl font-bold leading-tight text-brand-950 sm:mt-8 sm:text-3xl">{post.title}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">{post.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
