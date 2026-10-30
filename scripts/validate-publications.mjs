import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const LANGUAGE = /^[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/;
const TYPES = new Set(['magazine_issue', 'major_article', 'book']);
const SERIES = new Set(['breakthrough-journal', 'prakriti-bengali', 'breakthrough-bulletin-hindi']);
const FIELDS = new Set(['publication_id', 'title', 'slug', 'publication_type', 'series', 'date', 'lastmod', 'draft', 'catalogue', 'summary', 'languages', 'contributors', 'topics', 'volume', 'issue', 'cover', 'document', 'purchase_url', 'price_text', 'isbn', 'aliases', 'legacy_urls']);

function validateRecord(record) {
  const errors = {};
  if (!record || typeof record !== 'object' || Array.isArray(record)) return { valid: false, errors: { record: 'Must be an object.' } };
  for (const key of Object.keys(record)) if (!FIELDS.has(key)) errors[key] = 'Unknown field.';
  const string = (field, min, max, pattern) => {
    const value = record[field];
    if (typeof value !== 'string' || value.length < min || value.length > max || pattern && !pattern.test(value)) errors[field] = 'Invalid value.';
  };
  string('publication_id', 3, 80, ID); string('title', 1, 160); string('slug', 1, 80, ID); string('summary', 1, 320);
  if (!TYPES.has(record.publication_type)) errors.publication_type = 'Unknown publication type.';
  if (record.publication_type === 'magazine_issue' && !SERIES.has(record.series)) errors.series = 'Magazine series is required.';
  if (record.publication_type !== 'magazine_issue' && record.series !== undefined) errors.series = 'Series is magazine-only.';
  for (const field of ['date', 'lastmod']) if (typeof record[field] !== 'string' || !Number.isFinite(Date.parse(record[field]))) errors[field] = 'Invalid date/time.';
  if (typeof record.draft !== 'boolean') errors.draft = 'Must be boolean.';
  if (typeof record.catalogue !== 'boolean') errors.catalogue = 'Must be boolean.';
  if (!Array.isArray(record.languages) || !record.languages.length || record.languages.some(value => !LANGUAGE.test(value)) || new Set(record.languages).size !== record.languages.length) errors.languages = 'Use unique BCP 47 language tags.';
  if (record.topics !== undefined && (!Array.isArray(record.topics) || record.topics.some(value => typeof value !== 'string' || !value || value.length > 60) || new Set(record.topics.map(value => value.toLowerCase())).size !== record.topics.length)) errors.topics = 'Topics must be unique labels up to 60 characters.';
  if (record.contributors !== undefined && (!Array.isArray(record.contributors) || record.contributors.some(value => !value || typeof value.name !== 'string' || value.name.length < 1 || value.name.length > 120 || !['author', 'editor', 'translator', 'contributor'].includes(value.role) || Object.keys(value).some(key => !['name', 'role'].includes(key))))) errors.contributors = 'Contributor is invalid.';
  if (record.cover !== undefined && (!record.cover || typeof record.cover.src !== 'string' || typeof record.cover.alt !== 'string' || Object.keys(record.cover).some(key => !['src', 'alt', 'width', 'height'].includes(key)))) errors.cover = 'Cover is invalid.';
  const documentRequired = ['magazine_issue', 'major_article'].includes(record.publication_type);
  if (documentRequired && !record.document) errors.document = 'Document is required.';
  if (record.document) {
    const document = record.document;
    const allowed = ['asset_id', 'key', 'filename', 'media_type', 'bytes', 'sha256', 'label'];
    if (!/^[a-f0-9]{32}$/.test(document.asset_id || '') || !/^(?:publications|documents)\/[a-z0-9][a-z0-9./-]*$/i.test(document.key || '') || document.key.includes('..') || !/^[^/\\]+\.pdf$/i.test(document.filename || '') || document.media_type !== 'application/pdf' || !Number.isInteger(document.bytes) || document.bytes < 1 || document.bytes > 52_428_800 || typeof document.label !== 'string' || !document.label || document.label.length > 180 || document.sha256 !== undefined && !/^[a-f0-9]{64}$/.test(document.sha256) || Object.keys(document).some(key => !allowed.includes(key))) errors.document = 'Document metadata is invalid.';
  }
  if (record.purchase_url !== undefined && !/^https:\/\//i.test(record.purchase_url)) errors.purchase_url = 'HTTPS required.';
  if (record.aliases !== undefined && (!Array.isArray(record.aliases) || record.aliases.some(value => !/^\/(?!\/)/.test(value)))) errors.aliases = 'Aliases must be local root paths.';
  if (record.legacy_urls !== undefined && (!Array.isArray(record.legacy_urls) || record.legacy_urls.some(value => !/^https:\/\//i.test(value)))) errors.legacy_urls = 'Legacy URLs must use HTTPS.';
  return { valid: Object.keys(errors).length === 0, errors };
}

function parseRecord(source, sourcePath = 'publication') {
  let record;
  try { record = JSON.parse(source.trim()); }
  catch { throw new Error(`${sourcePath}: publication files must contain deterministic JSON front matter.`); }
  const result = validateRecord(record);
  if (!result.valid) throw new Error(`${sourcePath}: ${JSON.stringify(result.errors)}`);
  return record;
}

function isPublicRecord(record, now = new Date()) {
  return validateRecord(record).valid && record.draft === false && record.catalogue !== false && new Date(record.date) <= now;
}

async function publicationFiles(root) {
  const files = [];
  async function walk(directory) {
    let entries;
    try { entries = await readdir(directory, { withFileTypes: true }); } catch (error) {
      if (error.code === 'ENOENT') return;
      throw error;
    }
    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) await walk(fullPath);
      else if (entry.name === 'index.md') files.push(fullPath);
    }
  }
  await walk(root);
  return files;
}

async function main() {
  const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const files = await publicationFiles(path.join(repoRoot, 'content', 'publications'));
  const ids = new Set();
  for (const file of files) {
    const record = parseRecord(await readFile(file, 'utf8'), path.relative(repoRoot, file));
    if (ids.has(record.publication_id)) throw new Error(`${file}: duplicate publication_id ${record.publication_id}`);
    ids.add(record.publication_id);
  }
  console.log(`Validated ${files.length} publication record${files.length === 1 ? '' : 's'}.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}

export { isPublicRecord, parseRecord, publicationFiles, validateRecord };
