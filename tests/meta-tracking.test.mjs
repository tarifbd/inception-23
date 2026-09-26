import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';

const require = createRequire(import.meta.url);
function load(path, mocks = {}, globals = {}) {
  const { outputText } = ts.transpileModule(readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', ...Object.keys(globals), outputText)(name => name in mocks ? mocks[name] : require(name), mod, mod.exports, ...Object.values(globals));
  return mod.exports;
}
const core = load('src/lib/meta/core.ts');
const event = { eventName: 'Lead', eventId: 'inquiry:test-uuid', eventTime: 1700000000, url: 'https://example.com/contact', email: '  Person@Example.com ', phone: '+880 1712-345678', userAgent: 'test-agent', fbp: 'fb.1.1700000000000.1234', fbc: 'fb.1.1700000000000.real_click' };

test('Meta payload hashes only permitted identity fields, preserves event ID/time and unhashed browser identifiers', () => {
  const payload = core.buildMetaEvent(event);
  assert.equal(payload.event_id, event.eventId);
  assert.equal(payload.event_time, event.eventTime);
  assert.deepEqual(payload.user_data.em, [core.sha256('person@example.com')]);
  assert.deepEqual(payload.user_data.ph, [core.sha256('8801712345678')]);
  assert.equal(payload.user_data.fbp, event.fbp);
  assert.equal(payload.user_data.fbc, event.fbc);
  assert.equal(payload.user_data.client_user_agent, 'test-agent');
  assert.equal(core.buildMetaEvent({ ...event, phone: '01712345678' }).user_data.ph, undefined);
  assert.equal(core.buildMetaEvent({ ...event, fbp: 'fake', fbc: 'fake' }).user_data.fbp, undefined);
  assert.throws(() => core.buildMetaEvent({ ...event, eventName: 'Purchase' }));
  for (const eventName of ['PageView', 'Contact', 'Lead']) {
    const built = core.buildMetaEvent({ ...event, eventName });
    assert.equal(built.event_name, eventName);
    assert.equal(built.event_id, event.eventId);
  }
});

test('event URLs reject private/foreign destinations and strip query PII and fragments', () => {
  assert.equal(core.publicEventUrl('https://example.com/contact?email=private#name', 'https://example.com'), 'https://example.com/contact');
  for (const url of ['https://evil.test/', '/admin', '/admin/tracking', '/api/contact', 'javascript:alert(1)']) assert.equal(core.publicEventUrl(url, 'https://example.com'), undefined);
});

test('real HTTP contract: auth header, paired ID, test code, supported API and accepted count', async () => {
  let call;
  const transport = async (...args) => { call = args; return Response.json({ events_received: 1 }); };
  const result = await core.transmitMeta('123456789', 'secret-token', core.buildMetaEvent(event), 'TEST123', transport);
  assert.equal(result.accepted, true);
  assert.match(call[0], /v26\.0\/123456789\/events$/);
  assert.ok(!call[0].includes('secret-token'));
  assert.equal(call[1].headers.Authorization, 'Bearer secret-token');
  const body = JSON.parse(call[1].body);
  assert.equal(body.test_event_code, 'TEST123');
  assert.equal(body.data[0].event_id, event.eventId);
  await core.transmitMeta('123456789', 'secret-token', core.buildMetaEvent(event), '', transport);
  assert.ok(!('test_event_code' in JSON.parse(call[1].body)));
});

test('HTTP success without accepted events is not success; safe failures and retry classification', async () => {
  const send = transport => core.transmitMeta('123456789', 'secret-token', core.buildMetaEvent(event), '', transport);
  assert.equal((await send(async () => Response.json({ events_received: 0 }))).accepted, false);
  const rejected = await send(async () => Response.json({ error: { code: 190, message: 'secret-token person@example.com' } }, { status: 400 }));
  assert.equal(rejected.retryable, false);
  assert.equal(rejected.code, 190);
  assert.ok(!JSON.stringify(rejected).includes('secret-token'));
  assert.ok(!JSON.stringify(rejected).includes('person@example.com'));
  assert.equal((await send(async () => new Response('', { status: 503 }))).retryable, true);
  assert.equal((await send(async () => { throw new Error('secret-token'); })).retryable, true);
});

test('encrypted settings round-trip, tamper detection, missing-key failure', () => {
  const previous = process.env.TRACKING_ENCRYPTION_KEY;
  process.env.TRACKING_ENCRYPTION_KEY = 'ab'.repeat(32);
  const secrets = load('src/lib/meta/secrets.ts');
  const encrypted = secrets.seal('top-secret');
  assert.ok(!encrypted.includes('top-secret'));
  assert.equal(secrets.unseal(encrypted), 'top-secret');
  const pieces = encrypted.split(':'); pieces[2] = Buffer.alloc(16).toString('base64');
  assert.throws(() => secrets.unseal(pieces.join(':')));
  delete process.env.TRACKING_ENCRYPTION_KEY;
  assert.throws(() => secrets.seal('top-secret'), /TRACKING_ENCRYPTION_KEY/);
  if (previous) process.env.TRACKING_ENCRYPTION_KEY = previous;
});

test('public config contains no secrets and admin config is masked', async () => {
  let stored;
  const tracking = load('src/lib/tracking.ts', {
    'next/cache': { unstable_cache: fn => fn, revalidateTag() {} },
    '@/lib/db': { db: { siteSetting: { upsert: async data => { stored = data; } } } },
    '@/lib/meta/secrets': { seal: s => s ? `encrypted:${s}` : '', unseal: s => s },
  });
  const settings = tracking.normalizeTrackingSettings({ enabled: true, providers: { facebook: { enabled: true, publicId: '123456789', accessToken: 'secret-token', customHeadersJson: 'private-header' } } });
  assert.ok(!JSON.stringify(tracking.toPublicTrackingSettings(settings)).includes('secret-token'));
  const masked = tracking.maskedTrackingSettings(settings);
  assert.equal(masked.providers.facebook.accessToken, tracking.secretMask);
  assert.ok(!JSON.stringify(masked).includes('private-header'));
  await tracking.saveTrackingSettings(settings);
  assert.match(JSON.parse(stored.create.value).providers.facebook.accessToken, /^encrypted:/);
});

test('browser event and server fallback share a single ID; denied consent sends neither', () => {
  const pixels = []; const bodies = [];
  const browser = load('src/lib/meta/browser.ts', {}, {
    location: { origin: 'https://example.com', pathname: '/contact', href: 'https://example.com/contact' },
    document: { cookie: '' },
    window: { fbq: (...args) => pixels.push(args) },
    navigator: { sendBeacon: () => false },
    fetch: async (_, init) => { bodies.push(JSON.parse(init.body)); return new Response(); },
  });
  const settings = { enabled: true, serverSideEnabled: true, providers: [{ id: 'facebook', publicId: '123456789', browserEnabled: true, sendPageView: true, sendContact: true, sendLead: true }] };
  browser.setBrowserTracking(settings, false); browser.trackPublicAction('PageView');
  assert.equal(pixels.length, 0); assert.equal(bodies.length, 0);
  browser.setBrowserTracking(settings, true); browser.trackPublicAction('PageView');
  assert.equal(pixels[0][2], 'PageView');
  assert.equal(pixels[0][4].eventID, bodies[0].eventId);
  browser.fireMetaBrowser('PageView', bodies[0].eventId);
  assert.equal(pixels.length, 1);
  browser.trackPublicAction('Contact', 'whatsapp');
  assert.equal(pixels[1][4].eventID, bodies[1].eventId);
  assert.equal(bodies[1].channel, 'whatsapp');
});

test('outbox deduplicates enqueue and preserves event ID/time across retry; disabled consent blocks queue', async () => {
  const rows = new Map(); let outcome = { accepted: false, retryable: true, status: 503, summary: 'retry' }; const transmitted = [];
  const settings = { enabled: true, serverSideEnabled: true, consentMode: 'manual', providers: { facebook: { enabled: true, capiEnabled: true, publicId: '123456789', accessToken: 'secret', testEventCode: '' } } };
  const db = { metaDelivery: {
    upsert: async ({ where, create }) => { if (!rows.has(where.id)) rows.set(where.id, { ...create, status: 'pending', attempts: 0, nextAttempt: new Date(0), createdAt: new Date() }); },
    deleteMany: async () => {},
    findMany: async () => [...rows.values()].filter(r => ['pending', 'sending'].includes(r.status) && r.nextAttempt <= new Date()).map(r => ({ ...r })),
    updateMany: async ({ where, data }) => { const row = rows.get(where.id); if (!row || row.nextAttempt > where.nextAttempt.lte) return { count: 0 }; Object.assign(row, { ...data, attempts: row.attempts + 1 }); return { count: 1 }; },
    update: async ({ where, data }) => { Object.assign(rows.get(where.id), data); },
  } };
  const server = load('src/lib/meta/server.ts', { '@/lib/db': { db }, '@/lib/tracking': { getTrackingSettings: async () => settings, providerSupportsEvent: () => true },
    './core': { ...core, transmitMeta: async (_, __, payload) => { transmitted.push(payload); return outcome; } }, './secrets': { seal: x => x, unseal: x => x } });
  await server.enqueueMeta(settings, event); await server.enqueueMeta(settings, event); assert.equal(rows.size, 1);
  await server.drainMeta(); assert.equal(rows.get(event.eventId).status, 'pending');
  rows.get(event.eventId).nextAttempt = new Date(0); outcome = { accepted: true, retryable: false, status: 200, summary: 'accepted' };
  await server.drainMeta(); assert.equal(rows.get(event.eventId).status, 'accepted');
  assert.equal(rows.get(event.eventId).payload, '');
  assert.deepEqual(transmitted[0], transmitted[1]);
  await server.drainMeta(); assert.equal(transmitted.length, 2);
  settings.consentMode = 'denied';
  assert.equal(await server.enqueueMeta(settings, { ...event, eventId: 'other-event' }), false);
  settings.consentMode = 'manual'; settings.providers.facebook.sendLead = true;
  const request = { headers: new Headers({ host: 'example.com', 'user-agent': 'test-agent' }), nextUrl: { protocol: 'https:', host: 'example.com' }, cookies: { get: () => undefined } };
  const context = { consent: 'granted', url: 'https://example.com/contact' };
  const receipt = await server.recordLead(request, context, 'saved-id', 'person@example.com', 'inquiry', true);
  assert.equal(receipt.eventId, 'inquiry:saved-id');
  assert.equal(JSON.parse(rows.get(receipt.eventId).payload).event_id, receipt.eventId);
  assert.equal(await server.recordLead(request, { ...context, consent: 'denied' }, 'denied-id', 'person@example.com', 'inquiry'), undefined);
  assert.equal(await server.recordLead(request, context, 'old-id', 'person@example.com', 'inquiry', true, new Date(Date.now() - 2 * 86400000)), undefined);
  assert.equal(rows.has('inquiry:old-id'), false);
});

test('same-origin protection accepts actual loopback Host but rejects foreign origins', () => {
  const auth = load('src/lib/admin/auth.ts');
  const request = { method: 'POST', headers: new Headers({ host: '127.0.0.1:3000', origin: 'http://127.0.0.1:3000' }), nextUrl: { host: 'localhost:3000', protocol: 'http:', origin: 'http://localhost:3000' } };
  assert.equal(auth.isSameOriginMutation(request), true);
  request.headers.set('origin', 'https://evil.example');
  assert.equal(auth.isSameOriginMutation(request), false);
});

test('public tracking config fails closed during a database outage', async () => {
  const disabled = { enabled: false, serverSideEnabled: false, consentMode: 'manual', providers: [] };
  const route = load('src/app/api/tracking/config/route.ts', { '@/lib/tracking': {
    defaultTrackingSettings: disabled,
    getTrackingSettings: async () => { throw new Error('database unavailable'); },
    toPublicTrackingSettings: value => value,
  } });
  const response = await route.GET();
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.deepEqual(await response.json(), { data: disabled });
});
