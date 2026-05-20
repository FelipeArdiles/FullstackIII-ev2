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

test('formulario proyecto válido con nombre y descripción', () => {
  const form = new CompositeForm([
    Object.assign(new FormField('name'), { value: 'Portal' }),
    Object.assign(new FormField('description'), { value: 'Descripción larga' })
  ]);
  assert.equal(form.validate().valid, true);
});

test('email inválido falla validación', () => {
  const form = new CompositeForm([
    Object.assign(new FormField('email', true, 'email'), { value: 'no-es-email' })
  ]);
  const result = form.validate();
  assert.equal(result.valid, false);
  assert.match(result.errors[0], /Email inválido/);
});

test('email válido pasa validación', () => {
  const form = new CompositeForm([
    Object.assign(new FormField('email', true, 'email'), { value: 'dev@innovatech.cl' })
  ]);
  assert.equal(form.validate().valid, true);
});
