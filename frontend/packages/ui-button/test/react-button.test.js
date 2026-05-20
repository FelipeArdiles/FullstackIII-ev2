import { test } from 'node:test';
import assert from 'node:assert';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Button } from '../src/Button.js';

test('Button renderiza clase de variante', () => {
  const html = renderToStaticMarkup(
    createElement(Button, { label: 'Guardar', variant: 'primary' })
  );
  assert.match(html, /innovatech-btn--primary/);
  assert.match(html, /Guardar/);
});

test('Button respeta disabled', () => {
  const html = renderToStaticMarkup(
    createElement(Button, { label: 'Ok', disabled: true })
  );
  assert.match(html, /disabled/);
});
