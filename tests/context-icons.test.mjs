import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';

const require = createRequire(import.meta.url);
// Test icon selection independently of Lucide's renderer/package format.
const iconNames = new Proxy({}, { get: (_, name) => name });
function load(file) {
  const { outputText } = ts.transpileModule(readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 },
  });
  const loaded = { exports: {} };
  new Function('require', 'module', 'exports', outputText)(
    (name) => name === 'lucide-react' ? iconNames : require(name), loaded, loaded.exports,
  );
  return loaded.exports;
}
const { getContextIcon, ContextIcon } = load('src/components/ui/ContextIcon.tsx');
const { subServices } = load('src/lib/constants/sub-services.ts');

for (const [category, services] of Object.entries(subServices)) {
  test(`${category} services have distinct icons`, () => {
    const icons = services.map(({ title }) => getContextIcon(title));
    assert.equal(new Set(icons).size, services.length);
    assert.ok(icons.every(Boolean));
  });
}

test('title wins over shared descriptions and supports case normalization', () => {
  const title = 'Corporate Tax Planning';
  assert.equal(ContextIcon({ title, context: 'VAT filing finance documentation' }).type, getContextIcon(title));
  assert.equal(getContextIcon(title.toUpperCase()), getContextIcon(title));
});
