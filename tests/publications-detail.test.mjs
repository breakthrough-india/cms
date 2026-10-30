import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('detail rendering derives the PDF URL and retains safe fallbacks/actions', async () => {
  const root = new URL('../', import.meta.url);
  const [single, documentAction, cover, book] = await Promise.all([
    readFile(new URL('layouts/publications/single.html', root), 'utf8'),
    readFile(new URL('layouts/partials/publications/document-action.html', root), 'utf8'),
    readFile(new URL('layouts/partials/publications/cover.html', root), 'utf8'),
    readFile(new URL('layouts/partials/publications/book-action.html', root), 'utf8'),
  ]);
  assert.match(single, /publications\/metadata\.html/);
  assert.match(documentAction, /publication_asset_base_url/);
  assert.match(documentAction, /noopener noreferrer/);
  assert.match(documentAction, /temporarily unavailable/);
  assert.match(cover, /Cover unavailable/);
  assert.match(book, /purchase_url/);
});
