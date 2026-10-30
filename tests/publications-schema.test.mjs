import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { isPublicRecord, parseRecord, validateRecord } from '../scripts/validate-publications.mjs';

const validUrl = new URL('./fixtures/publications/valid/magazine.json', import.meta.url);
const invalidUrl = new URL('./fixtures/publications/invalid/missing-document.json', import.meta.url);

test('accepts the approved public contract fixture', async () => {
  const record = parseRecord(await readFile(validUrl, 'utf8'), 'valid magazine');
  assert.equal(record.publication_type, 'magazine_issue');
  assert.equal(validateRecord(record).valid, true);
});

test('rejects unknown fields, language names, and missing conditional PDF', async () => {
  const source = await readFile(invalidUrl, 'utf8');
  assert.throws(() => parseRecord(source, 'invalid article'), /unexpected|document|languages/i);
});

test('visibility excludes drafts, future dates, and catalogue-disabled records', async () => {
  const record = parseRecord(await readFile(validUrl, 'utf8'));
  const now = new Date('2026-10-30T00:00:00Z');
  assert.equal(isPublicRecord(record, now), true);
  assert.equal(isPublicRecord({ ...record, draft: true }, now), false);
  assert.equal(isPublicRecord({ ...record, catalogue: false }, now), false);
  assert.equal(isPublicRecord({ ...record, date: '2027-01-01T00:00:00Z' }, now), false);
});
