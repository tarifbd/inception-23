import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { SolutionCard } from '@/components/sections/SolutionCard';
import { serviceCategories } from '@/lib/constants/service-categories';
import { solutions } from '@/lib/constants/solutions';
import { serviceThemes } from '@/lib/constants/theme';
import { getWebsiteCollection } from '@/lib/website-collections';
import { createPageMetadata } from '@/lib/seo/metadata';
import { staticPageMetadata } from '@/lib/seo/page-metadata';

export const revalidate = 300;

export const metadata: Metadata = createPageMetadata(staticPageMetadata.featuredSolutions);

export default async function FeaturedSolutionsPage() {
  const [cmsCategories, cmsSolutions] = await Promise.all([
    getWebsiteCollection('serviceCategories'),
    getWebsiteCollection('solutions'),
  ]);
  const displayCategories = cmsCategories.length ? cmsCategories as unknown as typeof serviceCategories : serviceCategories;
  const displaySolutions = cmsSolutions.length ? cmsSolutions as unknown as typeof solutions : solutions;

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-slate-50 dark:bg-night-950">
      <Header />
      <section className="pb-16 pt-28 sm:pb-20 sm:pt-36 lg:pb-24 lg:pt-40">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href="/" className="ui-action inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-brand-950 shadow-sm dark:border-white/10 dark:bg-night-900">
            <ArrowLeft size={15} />
            Back to home
          </Link>

          <div className="mt-8 max-w-4xl">
            <p className="text-xs font-semibold text-brand-700">Featured solution library</p>
            <h1 className="mt-4 font-serif text-[clamp(2.5rem,6vw,6rem)] font-bold leading-[1.02] text-brand-950">
              All solution systems, grouped by service.
            </h1>
            <p className="mt-6 max-w-3xl text-base font-semibold leading-8 text-slate-600 sm:text-lg">
              Browse every featured system as a media-led work brief. Each card keeps the image clear, then explains the service rendered and the operating outcome.
            </p>
          </div>

          <div className="mt-12 space-y-16">
            {displayCategories.map((category) => {
              const theme = serviceThemes[category.key];
              const categorySolutions = displaySolutions.filter((solution) => solution.serviceKey === category.key);

              return (
                <section key={category.key} className="scroll-mt-28">
                  <div className={`mb-6 border-l-2 bg-white p-5 dark:bg-night-900 sm:p-6 ${theme.border}`}>
                    <p className={`text-xs font-semibold ${theme.text}`}>{theme.label}</p>
                    <h2 className="mt-2 text-2xl font-bold text-brand-950 sm:text-3xl">{category.title}</h2>
                    <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-slate-600">{category.description}</p>
                  </div>

                  <div className="grid gap-7">
                    {categorySolutions.map((solution, index) => (
                      <SolutionCard key={solution.id} solution={solution} index={index} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
