import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { TrackingScripts } from "@/components/tracking/TrackingScripts";
import { MotionPreferences, SiteExperience } from "@/components/ui/SiteExperience";
import { FloatingContactBar } from "@/components/ui/FloatingContactBar";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { SkipLink } from "@/components/ui/SkipLink";
import { absoluteUrl, siteConfig } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: 'Business Consulting',
  keywords: [...siteConfig.keywords],
  alternates: { canonical: siteConfig.url },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [{ url: '/favicon.ico' }, { url: '/inception23-mark.png', type: 'image/png' }],
    apple: [{ url: '/inception23-mark.png' }],
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: siteConfig.title }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: ['/opengraph-image'],
  },
  robots: {
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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans relative" suppressHydrationWarning>
        <JsonLd
          data={[
            {
              '@context': 'https://schema.org',
              '@type': 'Organization',
              '@id': `${siteConfig.url}/#organization`,
              name: siteConfig.legalName,
              url: siteConfig.url,
              logo: absoluteUrl('/inception23-mark.png'),
              email: siteConfig.email,
              description: siteConfig.description,
              areaServed: 'Bangladesh',
            },
            {
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              '@id': `${siteConfig.url}/#website`,
              name: siteConfig.name,
              url: siteConfig.url,
              inLanguage: siteConfig.language,
              publisher: { '@id': `${siteConfig.url}/#organization` },
            },
          ]}
        />
        <SiteExperience />
        <MotionPreferences>
          <SkipLink />
          <TrackingScripts />
          {children}
          <FloatingContactBar />
          <ToastProvider />
        </MotionPreferences>
      </body>
    </html>
  );
}
