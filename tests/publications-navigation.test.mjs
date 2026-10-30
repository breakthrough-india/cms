import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
test('navigation contains the approved publication hierarchy and reusable menu partial', async () => {
  const [config, header, tree, nav] = await Promise.all([
    readFile(new URL('hugo.toml', root), 'utf8'), readFile(new URL('layouts/partials/header.html', root), 'utf8'),
    readFile(new URL('layouts/partials/menu-tree.html', root), 'utf8'), readFile(new URL('assets/js/nav.js', root), 'utf8'),
  ]);
  for (const label of ['Publications', 'Magazines', '‘BREAKTHROUGH’ Journal', 'Prakriti (Bengali)', 'Breakthrough Bulletin (Hindi)', 'Major Articles', 'Books']) assert.match(config, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  for (const path of ['magazines/breakthrough-journal/', 'magazines/prakriti-bengali/', 'magazines/breakthrough-bulletin-hindi/']) assert.match(config, new RegExp(path));
  assert.match(header, /menu-tree\.html/);
  assert.match(tree, /aria-expanded="false"/);
  assert.match(tree, /HasMenuCurrent/);
  assert.match(tree, /strings\.HasPrefix/);
  assert.match(tree, /page\.Section "publications"/);
  assert.match(nav, /ArrowDown/);
  assert.match(nav, /Escape/);
});
