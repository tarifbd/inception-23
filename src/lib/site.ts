const fallbackSiteUrl = 'https://inception23.com';

function normalizeSiteUrl(value: string | undefined) {
  try {
    const url = new URL(value || fallbackSiteUrl);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return fallbackSiteUrl;
    return url.origin;
  } catch {
    return fallbackSiteUrl;
  }
}

export const siteConfig = {
  name: 'Inception 23',
  legalName: 'Inception 23',
  url: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  locale: 'en_BD',
  language: 'en',
  email: 'hello@inception23.com',
  whatsappHref: 'https://wa.me/8801911369686',
  appointmentHref: '/contact?subject=appointment#inquiry',
  title: 'Inception 23 | Advisory, Consulting & Business Solutions',
  description:
    'Technology solutions, Business Advisory & Compliances, legal support, event management, and creative services for practical business execution.',
  keywords: [
    'business advisory Bangladesh',
    'business advisory and compliances',
    'finance advisory',
    'technology solutions',
    'legal support',
    'event management',
    'creative services',
  ],
} as const;

export function absoluteUrl(path = '/') {
  if (/^https?:\/\//i.test(path)) return path;
  return new URL(path.startsWith('/') ? path : `/${path}`, `${siteConfig.url}/`).toString();
}
