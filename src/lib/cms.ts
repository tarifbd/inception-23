export const cmsTemplates = ['standard', 'wide', 'editorial'] as const;

const reservedSlugs = new Set([
  'admin',
  'api',
  'resources',
  'services',
  'about',
  'contact',
  'insights',
  'case-studies',
  'featured-solutions',
  'robots.txt',
  'sitemap.xml',
]);

export function createCmsSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, '')
    .split('/')
    .map((segment) => segment.replace(/[^a-z0-9-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''))
    .filter(Boolean)
    .join('/')
    .slice(0, 180);
}

export function assertCmsSlug(value: string) {
  const slug = createCmsSlug(value);
  if (!slug) throw new Error('A valid page slug is required');
  if (reservedSlugs.has(slug.split('/')[0])) {
    throw new Error('This URL is reserved by the website');
  }
  return slug;
}

export function sanitizeCmsHtml(value: string) {
  return value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, '')
    .replace(/\son\w+\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi, '')
    .replace(/\s(href|src)\s*=\s*("|')javascript:[\s\S]*?\2/gi, ' $1="#"');
}

export function getVideoEmbedUrl(value: string | null | undefined) {
  if (!value) return null;

  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const id = url.searchParams.get('v') || url.pathname.split('/').filter(Boolean).pop();
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (host === 'vimeo.com' || host === 'player.vimeo.com') {
      const id = url.pathname.split('/').filter(Boolean).pop();
      return id && /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch {
    return null;
  }

  return null;
}
