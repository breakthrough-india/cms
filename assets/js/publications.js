(function (root) {
  'use strict';

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function cardMatches(card, filters) {
    var query = normalize(filters.query);
    var haystack = [card.dataset.title, card.dataset.summary, card.dataset.topics].join(' ');
    if (query && haystack.indexOf(query) === -1) return false;
    if (filters.type && card.dataset.type !== filters.type) return false;
    if (filters.series && card.dataset.series !== filters.series) return false;
    if (filters.language && normalize(card.dataset.languages).split(',').indexOf(normalize(filters.language)) === -1) return false;
    if (filters.topic && normalize(card.dataset.topics).split(',').indexOf(normalize(filters.topic)) === -1) return false;
    if (filters.year && card.dataset.year !== filters.year) return false;
    return true;
  }

  function valuesFromForm(form) {
    var data = new FormData(form);
    return ['query', 'type', 'series', 'language', 'topic', 'year'].reduce(function (values, key) {
      values[key] = normalize(data.get(key));
      return values;
    }, {});
  }

  function updateUrl(filters) {
    var url = new URL(window.location.href);
    Object.keys(filters).forEach(function (key) {
      if (filters[key]) url.searchParams.set(key, filters[key]);
      else url.searchParams.delete(key);
    });
    history.replaceState(null, '', url.pathname + url.search + url.hash);
  }

  function applyFilters(form, cards, count, empty, syncUrl) {
    var filters = valuesFromForm(form);
    var visible = 0;
    cards.forEach(function (card) {
      var matches = cardMatches(card, filters);
      card.hidden = !matches;
      if (matches) visible += 1;
    });
    count.textContent = visible + ' publication' + (visible === 1 ? '' : 's');
    empty.hidden = visible !== 0;
    if (syncUrl) updateUrl(filters);
    return visible;
  }

  function setFormFromUrl(form) {
    var params = new URLSearchParams(window.location.search);
    ['query', 'type', 'series', 'language', 'topic', 'year'].forEach(function (key) {
      if (form.elements[key]) form.elements[key].value = params.get(key) || '';
    });
  }

  function init() {
    var form = document.querySelector('[data-publication-filters]');
    var count = document.querySelector('[data-publication-count]');
    var empty = document.querySelector('[data-publication-empty]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-publication-card]'));
    if (!form || !count || !empty) return;
    setFormFromUrl(form);
    applyFilters(form, cards, count, empty, false);
    form.addEventListener('input', function () { applyFilters(form, cards, count, empty, true); });
    form.addEventListener('change', function () { applyFilters(form, cards, count, empty, true); });
    form.addEventListener('reset', function () {
      window.setTimeout(function () { applyFilters(form, cards, count, empty, true); }, 0);
    });
    window.addEventListener('popstate', function () {
      setFormFromUrl(form);
      applyFilters(form, cards, count, empty, false);
    });
  }

  root.PublicationFilters = { applyFilters: applyFilters, cardMatches: cardMatches, normalize: normalize };
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this));
