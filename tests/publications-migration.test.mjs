import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import { inventorySummary, mergeInventory, pdfLinksFromHtml, readLedger, validateLedger } from '../scripts/inventory-publications.mjs';
import { contentPathForRecord, localAlias, recordFromInventoryItem, renderRecord } from '../scripts/migrate-publications.mjs';

const source = { url: 'https://breakthroughindia.org/major-articles/', category: 'major_article' };
const record = {
  publication_id: 'sample-article', title: 'Sample Article', slug: 'sample-article', publication_type: 'major_article',
  date: '2026-01-01T00:00:00Z', lastmod: '2026-01-01T00:00:00Z', draft: false, catalogue: true,
  summary: 'A reviewed legacy article.', languages: ['en'], contributors: [], topics: [],
  document: { asset_id: '0123456789abcdef0123456789abcdef', key: 'publications/sample.pdf', filename: 'sample.pdf', media_type: 'application/pdf', bytes: 42, label: 'Read PDF' },
};

test('extracts, normalizes and de-duplicates HTTPS PDF links without downloading assets', () => {
  const html = '<a href="/wp-content/uploads/A.pdf"> First &amp; best </a><a href="javascript:alert(1)">bad</a>';
  const discovered = pdfLinksFromHtml(html, source);
  assert.equal(discovered.length, 1);
  assert.equal(discovered[0].legacy_url, 'https://breakthroughindia.org/wp-content/uploads/A.pdf');
  assert.equal(discovered[0].title, 'First & best');
  assert.equal(mergeInventory(discovered, discovered).length, 1);
});

test('rejects duplicate URLs and unapproved migration dispositions', () => {
  const item = { inventory_id: 'one', legacy_url: 'https://example.org/a.pdf', rights_status: 'review_required', disposition: 'migrate' };
  assert.throws(() => validateLedger({ version: 1, sources: [], items: [item] }), /approved rights/i);
  assert.throws(() => validateLedger({ version: 1, sources: [], items: [{ ...item, disposition: 'pending' }, { ...item, inventory_id: 'two', disposition: 'pending' }] }), /duplicate/i);
});

test('reconciles reviewed disposition totals', () => {
  const summary = inventorySummary([
    { disposition: 'migrate' }, { disposition: 'redirect' }, { disposition: 'exclude' }, { disposition: 'missing' },
  ]);
  assert.deepEqual(summary, { total: 4, pending: 0, migrate: 1, redirect: 1, exclude: 1, missing: 1, reviewed: 4, reconciled: true });
});

test('converts only an approved item to deterministic validated content and a safe path', () => {
  const item = { inventory_id: 'one', legacy_url: 'https://breakthroughindia.org/old-article/', rights_status: 'approved', disposition: 'migrate', record };
  const converted = recordFromInventoryItem(item);
  assert.deepEqual(converted.aliases, ['/old-article/']);
  assert.deepEqual(converted.legacy_urls, ['https://breakthroughindia.org/old-article/']);
  assert.match(contentPathForRecord(converted, path.resolve('tmp-content')), /sample-article[\\/]index\.md$/);
  assert.deepEqual(JSON.parse(renderRecord(converted)), converted);
  assert.equal(localAlias('https://external.example/a.pdf'), null);
});

test('loads the committed JSON-compatible YAML ledger', async () => {
  const ledger = await readLedger(new URL('../data/publication-migration.yml', import.meta.url));
  assert.equal(ledger.sources.length, 3);
  assert.equal(ledger.summary.total, ledger.items.length);
});
