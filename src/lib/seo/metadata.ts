import type { Metadata } from 'next';
import { absoluteUrl, siteConfig } from '@/lib/site';

export type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  keywords?: string[];
  type?: 'website' | 'article';
  noIndex?: boolean;
};

export function createPageMetadata({
  title,
  description,
  path,
  image,
  keywords = [],
  type = 'website',
  noIndex = false,
}: PageMetadataInput): Metadata {
  const canonical = absoluteUrl(path);
  const socialImage = absoluteUrl(image || '/opengraph-image');

  return {
    title,
    description,
    keywords: [...siteConfig.keywords, ...keywords],
    alternates: { canonical },
    robots: noIndex
      ? { index: false, follow: false, nocache: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
    openGraph: {
      type,
      locale: siteConfig.locale,
      url: canonical,
      siteName: siteConfig.name,
      title,
      description,
      images: [{ url: socialImage, width: 1200, height: 630, alt: `${title} - ${siteConfig.name}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [socialImage],
    },
  };
}
