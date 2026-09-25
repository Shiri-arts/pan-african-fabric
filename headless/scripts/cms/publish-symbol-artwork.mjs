import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { HEADLESS_SITE_ID, seedRecords } from './approved-content-seed.mjs';

const args = new Set(process.argv.slice(2));
assert.ok(args.has('--apply') && args.has('--confirm-publish'), 'Run with --apply --confirm-publish.');

const folderName = 'symbols';
const symbolSeeds = seedRecords.filter(record => record.collectionId === 'Symbols');
const mediaSeeds = seedRecords.filter(record => record.collectionId === 'MediaAssets' && record.id.startsWith('media-symbol-'));
assert.equal(symbolSeeds.length, 12);
assert.equal(mediaSeeds.length, 12);

const cli = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const cwd = fileURLToPath(new URL('../..', import.meta.url));
const tokenResult = spawnSync(cli, ['wix', 'token', '--site', HEADLESS_SITE_ID], { cwd, encoding: 'utf8', windowsHide: true, shell: process.platform === 'win32' });
assert.equal(tokenResult.status, 0, tokenResult.stderr || 'Wix authentication failed.');
const token = tokenResult.stdout.trim();

async function api(path, { method = 'GET', body } = {}) {
  const response = await fetch(`https://www.wixapis.com${path}`, {
    method,
    redirect: 'error',
    signal: AbortSignal.timeout(45_000),
    headers: { Authorization: `Bearer ${token}`, 'wix-site-id': HEADLESS_SITE_ID, 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok) throw new Error(`${method} ${path} failed (${response.status}): ${text.slice(0, 500)}`);
  return data;
}

async function getItem(collectionId, id) {
  return (await api(`/wix-data/v2/items/${encodeURIComponent(id)}?dataCollectionId=${encodeURIComponent(collectionId)}&consistentRead=true`)).dataItem;
}

async function saveAndPublish(collectionId, id, data) {
  const current = await getItem(collectionId, id).catch(() => undefined);
  const saved = await api('/wix-data/v2/items/save', {
    method: 'POST',
    body: {
      dataCollectionId: collectionId,
      dataItem: { id, data: { ...(current?.data ?? {}), ...data, _publishStatus: 'PUBLISHED' } },
      publishPluginOptions: { includeDraftItems: true },
    },
  });
  assert.equal(saved.dataItem?.id, id);
  const draft = await getItem(`${collectionId}__drafts`, id).catch(() => undefined);
  if (draft) await api('/wix-data/v2/items/publish-draft', { method: 'POST', body: { dataCollectionId: collectionId, dataItemId: id } });
  const published = await getItem(collectionId, id);
  assert.equal(published?.id, id);
  return published;
}

const folders = (await api('/site-media/v1/folders?paging.limit=100')).folders ?? [];
const folder = folders.find(item => item.displayName?.toLowerCase() === folderName);
assert.ok(folder?.id, 'The Wix Media Manager Symbols folder was not found.');
const files = (await api(`/site-media/v1/files?parentFolderId=${encodeURIComponent(folder.id)}&paging.limit=100`)).files ?? [];
assert.equal(files.length, 12, `Expected 12 symbol images in the Symbols folder, found ${files.length}.`);

const filesByName = new Map(files.map(file => [file.displayName, file]));
for (const media of mediaSeeds) {
  const file = filesByName.get(media.data.filename);
  assert.ok(file, `Missing symbol image: ${media.data.filename}`);
  assert.equal(file.operationStatus, 'READY', `${media.data.filename} is not ready.`);
  assert.equal(file.url, media.data.image, `Unexpected Wix URL for ${media.data.filename}.`);
}

for (const media of mediaSeeds) await saveAndPublish('MediaAssets', media.id, media.data);
for (const symbol of symbolSeeds) {
  assert.ok(symbol.data.artworkAsset?.startsWith('media-symbol-'));
  await saveAndPublish('Symbols', symbol.id, { artworkAsset: symbol.data.artworkAsset });
}

const verified = [];
for (const symbol of symbolSeeds) {
  const published = await getItem('Symbols', symbol.id);
  assert.equal(published.data.artworkAsset, symbol.data.artworkAsset);
  const media = await getItem('MediaAssets', symbol.data.artworkAsset);
  assert.equal(media.data.usagePermission, 'web-display-approved');
  assert.ok(media.data.image?.startsWith('https://static.wixstatic.com/media/'));
  verified.push({ symbol: published.data.approvedName, artwork: media.data.filename, country: published.data.country });
}

console.log(JSON.stringify({ siteId: HEADLESS_SITE_ID, folder: folder.displayName, connected: verified.length, verified }, null, 2));
