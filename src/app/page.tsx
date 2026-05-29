import type { Metadata } from 'next';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { HeroWrapper } from '@/components/home/HeroWrapper';
import { LandingPageSections } from '@/components/sections';

export const metadata: Metadata = {
  title: 'Inception 23 | Advisory, Consulting & Solution Company',
  description:
    'Premium advisory, consulting, IT, legal, management, and creative solution company for decisive business transformation.',
  openGraph: {
    title: 'Inception 23 | Advisory, Consulting & Solution Company',
    description: 'Strategic advisory, AI systems, management consultancy, legal support, and creative solution design.',
    type: 'website',
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-brand-950 selection:bg-brand-700 selection:text-white">
      <Header />
      <HeroWrapper />
      <LandingPageSections />
      <Footer />
    </main>
  );
}
