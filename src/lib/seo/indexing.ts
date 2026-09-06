export function canonicalPageUrl(value: string, origin: string) {
  try {
    const url = new URL(value.startsWith('/') || /^https?:\/\//i.test(value) ? value : `/${value}`, origin);
    if (url.origin !== new URL(origin).origin || url.username || url.password) return null;
    if (/^\/(admin|api|_next)(\/|$)/i.test(url.pathname)) return null;
    url.search = '';
    url.hash = '';
    url.pathname = url.pathname.replace(/\/+$/, '') || '/';
    return url.toString();
  } catch {
    return null;
  }
}

export function buildRobots(configured: string | null | undefined, origin: string) {
  const lines = (configured || 'User-agent: *\nAllow: /').split(/\r?\n/)
    .filter((line) => !/^\s*(sitemap|host)\s*:/i.test(line));
  const groups: string[][] = [];
  let group: string[] = [];
  let hasRules = false;
  for (const line of lines) {
    if (/^\s*user-agent\s*:/i.test(line) && hasRules) {
      groups.push(group);
      group = [];
      hasRules = false;
    }
    group.push(line);
    if (/^\s*(allow|disallow|crawl-delay)\s*:/i.test(line)) hasRules = true;
  }
  if (group.length) groups.push(group);
  if (!lines.some((line) => /^\s*user-agent\s*:\s*\*\s*(?:#.*)?$/i.test(line))) {
    groups.unshift(['User-agent: *', 'Allow: /']);
  }
  const privateRules = ['Disallow: /admin$', 'Disallow: /admin/', 'Disallow: /api$', 'Disallow: /api/'];
  return groups.map((entry) => [...entry, ...privateRules.filter((rule) => !entry.includes(rule))].join('\n').trim())
    .join('\n\n') + `\n\nSitemap: ${new URL('/sitemap.xml', origin)}\n`;
}
