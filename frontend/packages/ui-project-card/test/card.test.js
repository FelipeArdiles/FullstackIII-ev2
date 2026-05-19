import { test } from 'node:test';
import assert from 'node:assert';
import { ProjectSelectionSubject } from '../src/index.js';

test('Observer notifica suscriptores', () => {
  const subject = new ProjectSelectionSubject();
  let notified = null;
  subject.subscribe(id => { notified = id; });
  subject.select(42);
  assert.equal(notified, 42);
});
