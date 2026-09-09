import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

function worker(online = true) {
  const handlers = {};
  const stored = [];
  const offline = new Response('offline');
  runInNewContext(readFileSync('public/sw.js', 'utf8'), {
    self: { location: { origin: 'https://example.com' }, clients: { claim: async () => {} }, addEventListener: (name, fn) => { handlers[name] = fn; } },
    caches: { open: async () => ({ add: async (request) => stored.push(request.url) }), match: async () => offline },
    fetch: async () => { if (!online) throw new Error('offline'); return new Response('live'); },
    URL, Response,
    Request: class { constructor(url) { this.url = url; } },
  });
  return { handlers, stored };
}

test('precache contains only the static offline fallback', async () => {
  const { handlers, stored } = worker();
  let pending;
  handlers.install({ waitUntil: (value) => { pending = value; } });
  await pending;
  assert.deepEqual(stored, ['/offline.html']);
});

test('private routes, API, assets, POST and RSC requests bypass the worker', () => {
  const { handlers } = worker(false);
  for (const [path, method, mode] of [
    ['/admin', 'GET', 'navigate'], ['/admin/website', 'GET', 'navigate'],
    ['/api/contact', 'GET', 'navigate'], ['/auth/login', 'GET', 'navigate'],
    ['/contact', 'POST', 'navigate'], ['/services?_rsc=test', 'GET', 'cors'],
    ['/_next/static/chunk.js', 'GET', 'cors'],
  ]) {
    handlers.fetch({ request: { url: `https://example.com${path}`, method, mode }, respondWith: () => assert.fail(path) });
  }
});

test('public navigation gets live content online and a fallback offline', async () => {
  for (const online of [true, false]) {
    const { handlers } = worker(online);
    let pending;
    handlers.fetch({ request: { url: 'https://example.com/contact', method: 'GET', mode: 'navigate' }, respondWith: (value) => { pending = value; } });
    assert.equal(await (await pending).text(), online ? 'live' : 'offline');
  }
});
