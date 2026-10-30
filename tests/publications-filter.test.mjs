import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

test('catalogue matching covers query, type, series, language, topic, and year', async () => {
  const source = await readFile(new URL('../assets/js/publications.js', import.meta.url), 'utf8');
  const context = {};
  vm.runInNewContext(source, context);
  const card = { dataset: { title: 'breakthrough issue', summary: 'science movement', topics: 'physics,history', type: 'magazine_issue', series: 'breakthrough-journal', languages: 'en,bn', year: '2026' } };
  const matches = context.PublicationFilters.cardMatches;
  assert.equal(matches(card, { query: 'science', type: 'magazine_issue', series: 'breakthrough-journal', language: 'en', topic: 'physics', year: '2026' }), true);
  assert.equal(matches(card, { query: 'biology' }), false);
  assert.equal(matches(card, { language: 'hi' }), false);
  assert.equal(matches(card, { year: '2025' }), false);
});

test('applying and clearing filters updates card visibility, count, empty state, and URL', async () => {
  const source = await readFile(new URL('../assets/js/publications.js', import.meta.url), 'utf8');
  const history = { value: '', replaceState(_state, _title, value) { this.value = value; } };
  const context = {
    FormData: class { constructor(form) { this.form = form; } get(key) { return this.form.values[key] || ''; } },
    URL, history, window: { location: { href: 'https://example.test/publications/?old=value' } },
  };
  vm.runInNewContext(source, context);
  const form = { values: { query: 'science', type: '', series: '', language: '', topic: '', year: '' } };
  const cards = [
    { dataset: { title: 'science issue', summary: '', topics: '', type: 'magazine_issue', series: '', languages: 'en', year: '2026' }, hidden: false },
    { dataset: { title: 'history issue', summary: '', topics: '', type: 'magazine_issue', series: '', languages: 'en', year: '2025' }, hidden: false },
  ];
  const count = { textContent: '' };
  const empty = { hidden: true };
  assert.equal(context.PublicationFilters.applyFilters(form, cards, count, empty, true), 1);
  assert.deepEqual(cards.map(({ hidden }) => hidden), [false, true]);
  assert.equal(count.textContent, '1 publication');
  assert.match(history.value, /query=science/);

  form.values.query = '';
  assert.equal(context.PublicationFilters.applyFilters(form, cards, count, empty, true), 2);
  assert.deepEqual(cards.map(({ hidden }) => hidden), [false, false]);
  assert.equal(count.textContent, '2 publications');
  assert.doesNotMatch(history.value, /query=/);
});
