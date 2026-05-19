import { test } from 'node:test';
import assert from 'node:assert';
import { CompositeForm, FormField, capacityBadge } from '../src/index.js';

test('CompositeForm valida campos obligatorios', () => {
  const form = new CompositeForm([
    new FormField('name'),
    new FormField('email')
  ]);
  const result = form.validate();
  assert.equal(result.valid, false);
  assert.ok(result.errors.length >= 1);
});

test('capacityBadge clasifica niveles', () => {
  const b = capacityBadge(60);
  assert.equal(b.level, 'alta');
});
