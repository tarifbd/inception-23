import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

function loadTypescript(file) {
  const source = readFileSync(file, 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  const loaded = { exports: {} };
  new Function('module', 'exports', outputText)(loaded, loaded.exports);
  return loaded.exports;
}

const { safePublicDestination } = loadTypescript('src/lib/security/url.ts');
const { readJson } = loadTypescript('src/lib/api/http.ts');

test('public destinations reject browser-normalized external redirects', () => {
  for (const url of ['/\\evil.example', '//evil.example', '/\t/evil.example', 'javascript:alert(1)', 'https://user:pass@example.com']) {
    assert.equal(safePublicDestination(url), null, url);
  }
  assert.equal(safePublicDestination('/contact?subject=appointment#inquiry'), '/contact?subject=appointment#inquiry');
  assert.equal(safePublicDestination('https://example.com/contact'), 'https://example.com/contact');
});

test('JSON body limit works without a content-length header', async () => {
  const request = new Request('https://example.com', { method: 'POST', body: JSON.stringify({ text: 'a'.repeat(100) }) });
  await assert.rejects(readJson(request, 32), /Request body is too large/);
});

test('JSON reader accepts valid input and rejects malformed input', async () => {
  assert.deepEqual(await readJson(new Request('https://example.com', { method: 'POST', body: '{"ok":true}' })), { ok: true });
  await assert.rejects(readJson(new Request('https://example.com', { method: 'POST', body: '{' })), /Invalid JSON body/);
});
