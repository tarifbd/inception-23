'use client';

import dynamic from 'next/dynamic';
import type { HomepageContent } from '@/lib/homepage-content';

const Hero3D = dynamic(() => import('@/components/home/Hero3D'), { 
  ssr: false,
  loading: () => <div className="min-h-[100svh] w-full bg-white" />
});

export const HeroWrapper = ({ content }: { content: HomepageContent['hero'] }) => {
  return <Hero3D content={content} />;
};
