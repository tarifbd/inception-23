// Explicit local-only integration check. Never run against a configured or production site.
// Run: PLAYWRIGHT_MODULE=<path to playwright> node tests/meta-local.e2e.mjs
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { randomUUID } from 'node:crypto';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient({ datasourceUrl: 'file:./dev.db' });
const base = 'http://127.0.0.1:3000';
const testIdentity = `local-test-${randomUUID()}`;
const localFetch = (url, options = {}) => fetch(url, { ...options, headers: { 'x-forwarded-for': testIdentity, ...options.headers } });
const original = await (await fetch(`${base}/api/v1/admin/tracking`)).json();
assert.equal(original.data.enabled, false, 'Refuse to modify an enabled tracking configuration');
assert.equal(original.data.providers.facebook.accessToken, '', 'Refuse to overwrite existing Meta credentials');
const email = `meta-local-${randomUUID()}@example.invalid`;
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
async function save(data) {
  const response = await localFetch(`${base}/api/v1/admin/tracking`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Origin: base }, body: JSON.stringify(data) });
  assert.equal(response.status, 200, await response.text());
}
try {
  const settings = structuredClone(original.data);
  Object.assign(settings, { enabled: true, consentMode: 'manual' });
  Object.assign(settings.providers.facebook, { enabled: true, browserEnabled: true, capiEnabled: false, publicId: '123456789012345', accessToken: 'LOCAL-TEST-NOT-A-REAL-TOKEN' });
  await save(settings);
  const admin = await (await fetch(`${base}/api/v1/admin/tracking`)).json();
  assert.equal(admin.data.providers.facebook.accessToken, '••••••••');
  const publicConfig = await (await fetch(`${base}/api/tracking/config`)).text();
  assert.ok(!publicConfig.includes('LOCAL-TEST') && !publicConfig.includes('accessToken'));
  const stored = await db.siteSetting.findUnique({ where: { key: 'tracking.integrations.v1' } });
  assert.ok(!stored.value.includes('LOCAL-TEST'));
  assert.match(JSON.parse(stored.value).providers.facebook.accessToken, /^enc1:/);
  const context = await browser.newContext({ extraHTTPHeaders: { 'x-forwarded-for': testIdentity } });
  await context.route(/https:\/\/.*(facebook|fbcdn)\./, route => route.abort());
  await context.addInitScript(() => { window.__metaCalls = []; window.fbq = (...args) => window.__metaCalls.push(args); });
  const page = await context.newPage();
  const pageErrors = []; page.on('pageerror', error => pageErrors.push(error.message));
  const events = []; page.on('request', req => { if (req.url().endsWith('/api/tracking/event')) events.push(req.postDataJSON()); });
  await page.goto(`${base}/contact?fbclid=LOCAL_TEST_CLICK`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Accept analytics' }).waitFor();
  assert.equal(events.length, 0);
  assert.equal((await page.evaluate(() => window.__metaCalls.filter(c => c[0] === 'trackSingle'))).length, 0);
  await page.getByRole('button', { name: 'Accept analytics' }).click();
  await page.waitForFunction(() => window.__metaCalls.some(c => c[2] === 'PageView'));
  await page.waitForTimeout(250);
  const calls = await page.evaluate(() => window.__metaCalls.filter(c => c[0] === 'trackSingle'));
  assert.equal(calls.length, 1, 'Strict Mode does not duplicate PageView');
  assert.equal(events.length, 1);
  assert.equal(calls[0][4].eventID, events[0].eventId);
  assert.equal(events[0].url, `${base}/contact`);
  assert.ok((await context.cookies()).some(c => c.name === '_fbc' && c.value.endsWith('.LOCAL_TEST_CLICK')));
  await page.locator('a[href^="mailto:"]').first().evaluate(anchor => anchor.addEventListener('click', event => event.preventDefault()));
  await page.locator('a[href^="mailto:"]').first().click();
  await page.waitForFunction(() => window.__metaCalls.some(c => c[2] === 'Contact'));
  await page.waitForTimeout(100);
  const contactCall = await page.evaluate(() => window.__metaCalls.find(c => c[2] === 'Contact'));
  assert.equal(contactCall[4].eventID, events.find(e => e.eventName === 'Contact').eventId);
  const form = page.locator('form').filter({ has: page.locator('input[name="name"]') }).first();
  await form.locator('input[name="name"]').fill('Local tracking integration test');
  await form.locator('input[name="email"]').fill(email);
  await form.locator('input[name="mainService"]').locator('..').getByRole('button').first().click();
  await form.locator('input[name="mainService"]').locator('..').getByRole('option').first().click();
  await form.locator('input[name="subService"]').locator('..').getByRole('button').first().click();
  await form.locator('input[name="subService"]').locator('..').getByRole('option').first().click();
  await form.locator('textarea[name="project"]').fill('Local automated verification only. This record will be removed.');
  const [response] = await Promise.all([
    page.waitForResponse(r => r.url().endsWith('/api/contact') && r.request().method() === 'POST'),
    form.getByRole('button', { name: 'Send Message', exact: true }).click(),
  ]);
  assert.equal(response.status(), 201, await response.text());
  const result = await response.json();
  await page.waitForFunction(() => window.__metaCalls.some(c => c[2] === 'Lead'));
  const lead = await page.evaluate(() => window.__metaCalls.find(c => c[2] === 'Lead'));
  assert.equal(lead[4].eventID, result.tracking.eventId);
  assert.equal(result.tracking.eventId, `inquiry:${result.submissionId}`);
  const repeat = await localFetch(`${base}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: response.request().postData() });
  const replay = await repeat.json(); assert.equal(replay.submissionId, result.submissionId);
  assert.equal(await db.contactSubmission.count({ where: { email } }), 1);
  const invalid = await localFetch(`${base}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, name: '', message: '' }) });
  assert.equal(invalid.status, 400);
  const forge = await localFetch(`${base}/api/tracking/event`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ consent: 'granted', url: `${base}/contact`, eventName: 'Lead', eventId: randomUUID() }) });
  assert.equal(forge.status, 400);
  const crossSite = await fetch(`${base}/api/tracking/event`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://foreign.example' }, body: '{}' });
  assert.equal(crossSite.status, 403);
  // Test newsletter persistence without creating a real mailing-list delivery.
  const newsletterBody = JSON.stringify({ email, tracking: { consent: 'granted', url: `${base}/contact` } });
  await page.locator('#footer-email').fill(email);
  const [newsletterResponse] = await Promise.all([
    page.waitForResponse(r => r.url().endsWith('/api/newsletter') && r.request().method() === 'POST'),
    page.getByRole('button', { name: 'Subscribe to insight dispatch' }).click(),
  ]);
  const newsletter = await newsletterResponse.json();
  assert.match(newsletter.tracking.eventId, /^newsletter:/);
  await page.waitForFunction(() => window.__metaCalls.some(c => c[2] === 'Lead' && c[4]?.eventID.startsWith('newsletter:')));
  assert.equal(await page.evaluate(() => window.__metaCalls.find(c => c[2] === 'Lead' && c[4]?.eventID.startsWith('newsletter:'))[4].eventID), newsletter.tracking.eventId);
  const duplicateNewsletter = await (await localFetch(`${base}/api/newsletter`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: newsletterBody })).json();
  assert.equal(duplicateNewsletter.tracking, undefined);
  await page.getByRole('button', { name: 'Privacy preferences', exact: true }).click();
  await page.getByRole('button', { name: 'Necessary only' }).click();
  const beforeAdmin = events.length;
  await page.goto(`${base}/admin/tracking`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'Meta delivery diagnostics' }).waitFor();
  assert.equal(events.length, beforeAdmin);
  await page.screenshot({ path: '.next/meta-admin-check.png', fullPage: true });
  assert.deepEqual(pageErrors, []);
  console.log('PASS: browser consent, paired IDs, Strict Mode, successful inquiry, replay idempotency, validation failure, newsletter acquisition, duplicate subscriber, encrypted/masked secrets, private routes, forged Lead and cross-origin rejection. Meta network blocked; real acceptance NOT TESTED.');
} catch (error) {
  for (const context of browser.contexts()) for (const page of context.pages()) {
    await page.screenshot({ path: '.next/meta-e2e-failure.png', fullPage: true }).catch(() => {});
    console.log('Form status', await page.locator('[data-state], .status-message').allTextContents());
  }
  throw error;
} finally {
  await save(original.data);
  await db.contactSubmission.deleteMany({ where: { email } });
  await db.newsletterSubscriber.deleteMany({ where: { email } });
  await db.$disconnect();
  await browser.close();
}
