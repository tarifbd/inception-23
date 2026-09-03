import type { Metadata } from 'next';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { ContactBriefSection } from '@/components/sections';
import { getWebsiteCollections } from '@/lib/website-collections';
import { createPageMetadata } from '@/lib/seo/metadata';
import { staticPageMetadata } from '@/lib/seo/page-metadata';

export const metadata: Metadata = createPageMetadata(staticPageMetadata.contact);
export const revalidate = 300;

export default async function ContactPage() {
  const collections = await getWebsiteCollections();

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen overflow-x-hidden bg-white text-brand-950">
      <Header />
      <div className="pt-16 sm:pt-20 md:pt-24">
        <ContactBriefSection
          headingLevel="h1"
          budgetItems={collections.contactBudgets.map((item) => String(item.label || '')).filter(Boolean)}
          trustItems={collections.contactTrustPoints.map((item) => String(item.label || '')).filter(Boolean)}
          serviceCategoryItems={collections.serviceCategories}
          serviceEcosystemItems={collections.serviceEcosystem}
          contactChannelItems={collections.contactChannels}
          socialLinkItems={collections.footerSocialLinks}
        />
      </div>
      <Footer />
    </main>
  );
}
