import type { Metadata } from 'next';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { FinalCTA, SectionHeader } from '@/components/common/PremiumSections';

export const metadata: Metadata = {
  title: 'About | Inception 23',
  description: 'Learn about Inception 23, a premium advisory and solution company built for strategic execution.',
};

const values = ['Clarity before complexity', 'Execution over theater', 'Trust through disciplined systems', 'Design with commercial purpose'];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <section className="bg-brand-950 pt-40 pb-24 text-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <p className="mb-5 text-xs font-black uppercase tracking-[0.24em] text-brand-300">About Inception 23</p>
          <h1 className="max-w-5xl font-serif text-5xl font-black leading-tight md:text-7xl">
            Advisory, systems, and market execution for decisive companies.
          </h1>
          <p className="mt-8 max-w-3xl text-lg leading-8 text-white/70">
            We help leadership teams make complex moves with strategy, technology, management discipline, legal readiness, and creative clarity.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-6 lg:grid-cols-2">
          <SectionHeader eyebrow="Mission" title="Turn advisory into operating advantage." description="Our mission is to help organizations install the strategy, systems, and assets required to move faster with control." />
          <SectionHeader eyebrow="Vision" title="A trusted transformation partner." description="We aim to become the advisory and solution partner leaders call when the work is too important for generic execution." />
        </div>
      </section>

      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <SectionHeader eyebrow="Values" title="How we operate." />
          <div className="mt-12 grid gap-5 md:grid-cols-4">
            {values.map((value) => (
              <div key={value} className="rounded-2xl border border-slate-200 bg-white p-6 font-black text-brand-950">
                {value}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <SectionHeader eyebrow="Leadership" title="Built for a senior operating conversation." description="Team profiles and leadership credentials are prepared as a database-backed section for the admin system." />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {['Management', 'Advisor & Consultant', 'Executives'].map((group) => (
              <div key={group} className="rounded-[1.5rem] border border-slate-200 bg-white p-8 shadow-sm">
                <h3 className="font-serif text-3xl font-black text-brand-950">{group}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">Structured placeholder for future admin-managed profiles.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA />
      <Footer />
    </main>
  );
}
