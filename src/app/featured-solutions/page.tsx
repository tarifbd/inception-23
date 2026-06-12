import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { SolutionCard } from '@/components/sections/SolutionCard';
import { serviceCategories } from '@/lib/constants/service-categories';
import { solutions } from '@/lib/constants/solutions';
import { serviceThemes } from '@/lib/constants/theme';

export const metadata: Metadata = {
  title: 'Featured Solutions | Inception 23',
  description: 'Explore all featured advisory, IT, AI, management, legal, and creative solution systems by Inception 23.',
};

export default function FeaturedSolutionsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      <Header />
      <section className="pb-16 pt-28 sm:pb-20 sm:pt-36 lg:pb-24 lg:pt-40">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-brand-950 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
            <ArrowLeft size={15} />
            Back to home
          </Link>

          <div className="mt-8 max-w-4xl">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-brand-700">Featured solution library</p>
            <h1 className="mt-4 font-serif text-[clamp(2.5rem,6vw,6rem)] font-black leading-[1.02] text-brand-950">
              All solution systems, grouped by service.
            </h1>
            <p className="mt-6 max-w-3xl text-base font-semibold leading-8 text-slate-600 sm:text-lg">
              Browse every featured system as a media-led work brief. Each card keeps the image clear, then explains the service rendered and the operating outcome.
            </p>
          </div>

          <div className="mt-12 space-y-16">
            {serviceCategories.map((category) => {
              const theme = serviceThemes[category.key];
              const categorySolutions = solutions.filter((solution) => solution.serviceKey === category.key);

              return (
                <section key={category.key} className="scroll-mt-28">
                  <div className={`mb-6 rounded-[2rem] border bg-gradient-to-br p-5 sm:p-6 ${theme.border} ${theme.gradientSoft}`}>
                    <p className={`text-[10px] font-black uppercase tracking-[0.22em] ${theme.text}`}>{theme.label}</p>
                    <h2 className="mt-2 text-2xl font-black text-brand-950 sm:text-3xl">{category.title}</h2>
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
