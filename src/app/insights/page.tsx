import type { Metadata } from 'next';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { SectionHeader } from '@/components/common/PremiumSections';
import { insights } from '@/lib/constants/services';
import { getWebsiteCollection, type CollectionRecord } from '@/lib/website-collections';

export const metadata: Metadata = {
  title: 'Insights | Inception 23',
  description: 'Premium advisory thinking on AI, management, legal readiness, and market systems.',
};

export const dynamic = 'force-dynamic';

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
    <main className="min-h-screen bg-white">
      <Header />
      <section className="pb-16 pt-28 sm:pb-20 sm:pt-36 lg:pb-24 lg:pt-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Insights" title="Structured thinking for decisive operators." description="SEO-ready article listing prepared for a future CMS or admin-managed blog system." />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
            {visiblePosts.map((post) => (
              <article key={post.slug} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:p-7 lg:rounded-[1.75rem] lg:p-8">
                {post.image ? (
                  <div className="mb-5 aspect-[16/10] overflow-hidden rounded-[1rem] bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={post.image} alt="" className="h-full w-full object-cover" />
                  </div>
                ) : null}
                <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-600">{post.category}</p>
                <h2 className="mt-6 break-words font-serif text-2xl font-black leading-tight text-brand-950 sm:mt-8 sm:text-3xl">{post.title}</h2>
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
