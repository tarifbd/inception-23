// Run against a local production build with PLAYWRIGHT_MODULE pointing to Playwright.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const origin = process.env.TEST_ORIGIN || 'http://127.0.0.1:3002';
assert.ok(['localhost', '127.0.0.1'].includes(new URL(origin).hostname));
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const workers = [];
  page.on('worker', worker => workers.push(worker));
  await page.goto(origin);
  await page.locator('.hero-lottie-player .opacity-100').waitFor({ state: 'visible' });
  assert.equal(await page.locator('canvas').count(), 1);
  assert.ok(workers.length > 0, 'Animation has a worker');
  await page.getByRole('button', { name: 'Show Legal Support' }).click();
  await page.locator('.hero-lottie-player .opacity-100').waitFor({ state: 'visible' });
  assert.equal(await page.locator('canvas').count(), 1, 'Inactive slide does not mount an animation');
  await page.screenshot({ path: '.cache/lighthouse/hero-desktop.png' });
  await page.setViewportSize({ width: 412, height: 823 });
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({ path: '.cache/lighthouse/hero-mobile.png' });
  const config = await page.request.get(`${origin}/api/tracking/config`);
  assert.equal(config.status(), 200);
  const llms = await page.request.get(`${origin}/llms.txt`);
  assert.equal(llms.status(), 200);
  assert.match(await llms.text(), /# Inception 23/);
  assert.deepEqual(errors, []);
  console.log('PASS: worker animation loads and switches, one canvas, mobile/desktop rendering, no page errors, tracking config and llms.txt return 200.');
} finally {
  await browser.close();
}
