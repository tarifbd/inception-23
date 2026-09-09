/* Only the generic offline page is cached. No page, API, form or user data. */
const CACHE = 'inception23-pwa-v1';
const OFFLINE = '/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.add(new Request(OFFLINE, { cache: 'reload' }))));
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith('inception23-pwa-') && key !== CACHE).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || request.mode !== 'navigate' || url.origin !== self.location.origin) return;
  if (/^\/(admin|api|auth|login|app-icon)(\/|$)/.test(url.pathname)) return;
  event.respondWith(fetch(request).catch(async () =>
    (await caches.match(OFFLINE)) || new Response('You are offline. Please reconnect.', {
      status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    }),
  ));
});
