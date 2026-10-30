import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PDF_PATH = /\.pdf(?:$|[?#])/i;
const DEFAULT_LEDGER = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'data', 'publication-migration.yml');

function decodeEntities(value) {
  return value
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)));
}

function textFromHtml(value) {
  return decodeEntities(String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
}

function pdfLinksFromHtml(html, source) {
  const links = [];
  const anchor = /<a\b[^>]*\bhref\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s>]+))[^>]*>([\s\S]*?)<\/a>/gi;
  for (const match of html.matchAll(anchor)) {
    const href = decodeEntities(match[1] || match[2] || match[3] || '').trim();
    let url;
    try { url = new URL(href, source.url); } catch { continue; }
    if (url.protocol !== 'https:' || !PDF_PATH.test(url.href)) continue;
    url.hash = '';
    const title = textFromHtml(match[4]) || decodeURIComponent(url.pathname.split('/').pop()).replace(/[-_]+/g, ' ').replace(/\.pdf$/i, '');
    links.push({
      inventory_id: `legacy-${createHash('sha256').update(url.href).digest('hex').slice(0, 32)}`,
      source_url: source.url,
      legacy_url: url.href,
      title,
      category: source.category,
      ...(source.series ? { series: source.series } : {}),
      rights_status: 'review_required',
      disposition: 'pending',
      notes: '',
    });
  }
  return links;
}

function mergeInventory(existingItems, discoveredItems) {
  const byUrl = new Map();
  for (const item of [...existingItems, ...discoveredItems]) {
    const prior = byUrl.get(item.legacy_url);
    if (!prior || prior.disposition === 'pending') byUrl.set(item.legacy_url, { ...prior, ...item });
  }
  return [...byUrl.values()].sort((a, b) => a.legacy_url.localeCompare(b.legacy_url));
}

function inventorySummary(items) {
  const summary = { total: items.length, pending: 0, migrate: 0, redirect: 0, exclude: 0, missing: 0 };
  for (const item of items) {
    if (!(item.disposition in summary)) throw new Error(`Unsupported disposition for ${item.legacy_url}: ${item.disposition}`);
    summary[item.disposition] += 1;
  }
  summary.reviewed = summary.total - summary.pending;
  summary.reconciled = summary.pending === 0;
  return summary;
}

function validateLedger(ledger) {
  if (!ledger || ledger.version !== 1 || !Array.isArray(ledger.sources) || !Array.isArray(ledger.items)) throw new Error('Migration ledger must use version 1 with sources and items arrays.');
  const ids = new Set();
  const urls = new Set();
  for (const item of ledger.items) {
    if (!item.inventory_id || ids.has(item.inventory_id)) throw new Error(`Duplicate or missing inventory_id: ${item.inventory_id || '(missing)'}`);
    if (!/^https:\/\//i.test(item.legacy_url || '') || urls.has(item.legacy_url)) throw new Error(`Duplicate or invalid legacy_url: ${item.legacy_url || '(missing)'}`);
    if (!['review_required', 'approved', 'restricted'].includes(item.rights_status)) throw new Error(`Invalid rights_status for ${item.legacy_url}`);
    if (!['pending', 'migrate', 'redirect', 'exclude', 'missing'].includes(item.disposition)) throw new Error(`Invalid disposition for ${item.legacy_url}`);
    if (item.disposition === 'migrate' && item.rights_status !== 'approved') throw new Error(`Migration requires approved rights: ${item.legacy_url}`);
    ids.add(item.inventory_id);
    urls.add(item.legacy_url);
  }
  return { ...ledger, summary: inventorySummary(ledger.items) };
}

async function readLedger(filename = DEFAULT_LEDGER) {
  // JSON is valid YAML 1.2; using the JSON subset keeps this control file deterministic and
  // dependency-free while retaining the requested .yml location for Hugo data discovery.
  return validateLedger(JSON.parse(await readFile(filename, 'utf8')));
}

async function generateInventory(ledger, fetchPage = fetch) {
  const discovered = [];
  for (const source of ledger.sources) {
    const response = await fetchPage(source.url, { headers: { accept: 'text/html' }, redirect: 'follow' });
    if (!response.ok) throw new Error(`${source.url}: inventory request failed with ${response.status}`);
    const contentType = response.headers?.get?.('content-type') || '';
    if (contentType && !contentType.includes('text/html')) throw new Error(`${source.url}: expected HTML, received ${contentType}`);
    discovered.push(...pdfLinksFromHtml(await response.text(), source));
  }
  return validateLedger({ ...ledger, generated_at: new Date().toISOString(), items: mergeInventory(ledger.items, discovered) });
}

async function main() {
  const positional = process.argv.slice(2).filter((argument) => !argument.startsWith('--'));
  const filename = positional[0] ? path.resolve(positional[0]) : DEFAULT_LEDGER;
  const ledger = await readLedger(filename);
  const result = await generateInventory(ledger);
  if (process.argv.includes('--write-ledger')) {
    await writeFile(filename, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
    console.error(`Updated ${path.relative(process.cwd(), filename)} with ${result.items.length} pending/reviewed inventory items.`);
    return;
  }
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => { console.error(error.message); process.exitCode = 1; });
}

export { generateInventory, inventorySummary, mergeInventory, pdfLinksFromHtml, readLedger, validateLedger };
