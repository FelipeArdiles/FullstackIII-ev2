import { test } from 'node:test';
import assert from 'node:assert';
import { CompositeForm, FormField } from '@innovatech/ui-capacity-form';

test('formulario proyecto requiere campos', () => {
  const form = new CompositeForm([
    Object.assign(new FormField('name'), { value: '' }),
    Object.assign(new FormField('description'), { value: 'ok' })
  ]);
  assert.equal(form.validate().valid, false);
});
