import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isPastDeadline, SUBMISSION_DEADLINE } from './deadline.ts';

test('18 Sept 2026 00:19 PKT is before the deadline -- uploads stay open', () => {
  assert.equal(isPastDeadline(new Date('2026-09-18T00:19:00+05:00')), false);
});

test('22 Sept 2026 00:00 PKT (the deadline instant) counts as passed', () => {
  assert.equal(isPastDeadline(new Date(SUBMISSION_DEADLINE)), true);
});

test('one second before the deadline is still open', () => {
  const oneSecondBefore = new Date(SUBMISSION_DEADLINE.getTime() - 1000);
  assert.equal(isPastDeadline(oneSecondBefore), false);
});

test('after the deadline stays passed', () => {
  assert.equal(isPastDeadline(new Date('2026-09-23T12:00:00+05:00')), true);
});
