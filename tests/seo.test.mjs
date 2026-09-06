import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const { outputText } = ts.transpileModule(readFileSync('src/lib/seo/indexing.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
});
const loaded = { exports: {} };
new Function('module', 'exports', outputText)(loaded, loaded.exports);
const { canonicalPageUrl, buildRobots } = loaded.exports;
const origin = 'https://inception23.com';

test('canonical page URLs remove duplicate query/hash/trailing slash variants', () => {
  assert.equal(canonicalPageUrl('/contact/?subject=appointment#inquiry', origin), `${origin}/contact`);
  assert.equal(canonicalPageUrl('services/legal-support', origin), `${origin}/services/legal-support`);
  assert.equal(canonicalPageUrl('/', origin), `${origin}/`);
});

test('sitemap URL filter excludes private and foreign URLs', () => {
  for (const path of ['/admin', '/admin/website', '/api/contact', '/_next/static/a.js', '//other.example/', 'https://other.example/']) {
    assert.equal(canonicalPageUrl(path, origin), null, path);
  }
});

test('robots protects private paths in each custom crawler group', () => {
  const result = buildRobots('User-agent: Googlebot\nAllow: /\n\nUser-agent: GPTBot\nDisallow: /\nSitemap: /wrong.xml', origin);
  assert.match(result, /User-agent: \*\nAllow: \//);
  assert.match(result, /User-agent: GPTBot\nDisallow: \//);
  assert.equal(result.split('Disallow: /admin$').length - 1, 3);
  assert.equal(result.split('Sitemap:').length - 1, 1);
  assert.match(result, /Sitemap: https:\/\/inception23.com\/sitemap.xml/);
});

test('default robots allows public search crawling without changing training preferences', () => {
  const result = buildRobots(undefined, origin);
  assert.match(result, /User-agent: \*\nAllow: \//);
  assert.doesNotMatch(result, /Disallow: \/\n/);
});
