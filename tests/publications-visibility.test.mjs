import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { isPublicRecord, parseRecord } from '../scripts/validate-publications.mjs';

const fixture = new URL('./fixtures/publications/integration/published/index.md', import.meta.url);

test('publishes only catalogue-enabled, non-draft, non-future records', async () => {
  const record = parseRecord(await readFile(fixture, 'utf8'), 'published integration fixture');
  const now = new Date('2026-10-30T00:00:00Z');
  assert.equal(isPublicRecord(record, now), true);
  assert.equal(isPublicRecord({ ...record, draft: true }, now), false);
  assert.equal(isPublicRecord({ ...record, catalogue: false }, now), false);
  assert.equal(isPublicRecord({ ...record, date: '2027-10-30T00:00:00Z' }, now), false);
});

test('keeps a valid integration draft out of public output', async () => {
  const source = await readFile(new URL('./fixtures/publications/integration/draft/index.md', import.meta.url), 'utf8');
  const record = parseRecord(source, 'draft integration fixture');
  assert.equal(record.draft, true);
  assert.equal(isPublicRecord(record, new Date('2026-10-30T00:00:00Z')), false);
});
