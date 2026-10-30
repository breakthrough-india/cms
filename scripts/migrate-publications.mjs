import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readLedger } from './inventory-publications.mjs';
import { validateRecord } from './validate-publications.mjs';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function localAlias(legacyUrl) {
  const url = new URL(legacyUrl);
  return url.hostname === 'breakthroughindia.org' || url.hostname === 'www.breakthroughindia.org'
    ? url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`
    : null;
}

function recordFromInventoryItem(item) {
  if (item.disposition !== 'migrate' || item.rights_status !== 'approved') throw new Error(`${item.legacy_url}: item is not approved for migration.`);
  const alias = localAlias(item.legacy_url);
  const record = {
    ...item.record,
    aliases: [...new Set([...(item.record?.aliases || []), ...(alias ? [alias] : [])])],
    legacy_urls: [...new Set([...(item.record?.legacy_urls || []), item.legacy_url])],
  };
  const validation = validateRecord(record);
  if (!validation.valid) throw new Error(`${item.legacy_url}: invalid publication record ${JSON.stringify(validation.errors)}`);
  return record;
}

function contentPathForRecord(record, contentRoot = path.join(REPO_ROOT, 'content', 'publications')) {
  const resolvedRoot = path.resolve(contentRoot);
  // Records use one stable path regardless of presentation collection. This matches the admin API
  // contract; Hugo's collection pages select records by publication_type and series metadata.
  const result = path.resolve(resolvedRoot, record.publication_id, 'index.md');
  if (!result.startsWith(`${resolvedRoot}${path.sep}`)) throw new Error(`Unsafe publication path: ${record.publication_id}`);
  return result;
}

function renderRecord(record) {
  const ordered = Object.fromEntries(Object.keys(record).sort().map((key) => [key, record[key]]));
  return `${JSON.stringify(ordered, null, 2)}\n`;
}

function migrationPlan(ledger, contentRoot) {
  return ledger.items.filter((item) => item.disposition === 'migrate').map((item) => {
    const record = recordFromInventoryItem(item);
    return { item, record, output: contentPathForRecord(record, contentRoot), source: renderRecord(record) };
  });
}

async function writePlan(plan) {
  for (const entry of plan) {
    await mkdir(path.dirname(entry.output), { recursive: true });
    await writeFile(entry.output, entry.source, { encoding: 'utf8', flag: 'wx' });
  }
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const positional = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
  const ledger = await readLedger(positional[0] ? path.resolve(positional[0]) : undefined);
  const plan = migrationPlan(ledger);
  if (!args.has('--write')) {
    process.stdout.write(`${JSON.stringify(plan.map(({ record, output }) => ({ publication_id: record.publication_id, output: path.relative(REPO_ROOT, output) })), null, 2)}\n`);
    return;
  }
  await writePlan(plan);
  console.log(`Created ${plan.length} publication page bundle${plan.length === 1 ? '' : 's'} without overwriting existing content.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => { console.error(error.message); process.exitCode = 1; });
}

export { contentPathForRecord, localAlias, migrationPlan, recordFromInventoryItem, renderRecord, writePlan };
