export function productSchema(input: {
  name: string;
  description?: string | null;
  image?: string | null;
  sku?: string | null;
  brand?: string | null;
  url?: string | null;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: input.name,
    description: input.description,
    image: input.image ? [input.image] : undefined,
    sku: input.sku,
    brand: input.brand ? { '@type': 'Brand', name: input.brand } : undefined,
    url: input.url,
  };
}

export function organizationSchema(input: { name: string; url?: string | null; logo?: string | null }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: input.name,
    url: input.url,
    logo: input.logo,
  };
}

export function websiteSchema(input: { name: string; url?: string | null }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: input.name,
    url: input.url,
  };
}

export function faqSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

export function breadcrumbSchema(items: Array<{ name: string; item: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };
}

export function serviceSchema(input: {
  name: string;
  description: string;
  url: string;
  providerName: string;
  providerUrl: string;
  areaServed?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: input.name,
    description: input.description,
    url: input.url,
    areaServed: input.areaServed,
    provider: {
      '@type': 'Organization',
      name: input.providerName,
      url: input.providerUrl,
    },
  };
}

export function articleSchema(input: {
  headline: string;
  description: string;
  url: string;
  image?: string | null;
  datePublished?: Date | string | null;
  dateModified?: Date | string | null;
  publisherName: string;
  publisherLogo: string;
}) {
  const toIso = (value: Date | string | null | undefined) =>
    value ? new Date(value).toISOString() : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.headline,
    description: input.description,
    mainEntityOfPage: input.url,
    image: input.image || undefined,
    datePublished: toIso(input.datePublished),
    dateModified: toIso(input.dateModified),
    publisher: {
      '@type': 'Organization',
      name: input.publisherName,
      logo: {
        '@type': 'ImageObject',
        url: input.publisherLogo,
      },
    },
  };
}
