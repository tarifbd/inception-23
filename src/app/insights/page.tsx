import type { Metadata } from 'next';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { SectionHeader } from '@/components/common/PremiumSections';
import { insights } from '@/lib/constants/services';

export const metadata: Metadata = {
  title: 'Insights | Inception 23',
  description: 'Premium advisory thinking on AI, management, legal readiness, and market systems.',
};

export default function InsightsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <section className="pt-40 pb-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <SectionHeader eyebrow="Insights" title="Structured thinking for decisive operators." description="SEO-ready article listing prepared for a future CMS or admin-managed blog system." />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {insights.map((post) => (
              <article key={post.slug} className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-600">{post.category}</p>
                <h2 className="mt-8 font-serif text-3xl font-black text-brand-950">{post.title}</h2>
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
