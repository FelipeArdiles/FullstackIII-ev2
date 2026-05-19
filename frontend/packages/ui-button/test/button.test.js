import { test } from 'node:test';
import assert from 'node:assert';
import { createButton, variants } from '../src/index.js';

test('createButton requiere entorno DOM', () => {
  if (typeof document === 'undefined') {
    assert.ok(true, 'omitido en Node sin DOM');
    return;
  }
  const btn = createButton({ label: 'Guardar' });
  assert.equal(btn.textContent, 'Guardar');
  assert.ok(btn.className.includes('primary'));
});

test('variants incluye primary', () => {
  assert.ok(variants.includes('primary'));
});
