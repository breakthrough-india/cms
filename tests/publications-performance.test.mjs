import assert from 'node:assert/strict';
import { performance } from 'node:perf_hooks';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

test('filters 5,000 publication cards in under one second', async () => {
  const source = await readFile(new URL('../assets/js/publications.js', import.meta.url), 'utf8');
  const context = {};
  vm.runInNewContext(source, context);
  const cards = Array.from({ length: 5_000 }, (_, index) => ({ dataset: {
    title: `publication ${index}`, summary: index % 2 ? 'science movement' : 'history',
    topics: index % 3 ? 'physics,history' : 'biology', type: index % 4 ? 'major_article' : 'book',
    series: '', languages: index % 5 ? 'en' : 'bn', year: String(2000 + index % 27),
  } }));
  const started = performance.now();
  const matches = cards.filter((card) => context.PublicationFilters.cardMatches(card, { query: 'science', type: 'major_article', language: 'en' }));
  const elapsed = performance.now() - started;
  assert.ok(matches.length > 0);
  assert.ok(elapsed < 1_000, `Filtering took ${elapsed.toFixed(1)} ms`);
});
