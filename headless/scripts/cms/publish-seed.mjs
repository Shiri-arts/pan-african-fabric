import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { HEADLESS_SITE_ID, assertAllowedSite, seedCollections, seedRecords, validateSeedManifest } from './approved-content-seed.mjs';

const args = new Set(process.argv.slice(2));
const siteArg = process.argv.find(value => value.startsWith('--site='));
const collectionArg = process.argv.find(value => value.startsWith('--collection='));
const siteId = siteArg?.slice(7);
assert.ok(args.has('--apply') && args.has('--confirm-publish'), 'Publishing requires --apply --confirm-publish.');
assert.ok(siteId, 'Publishing requires --site=<site-id>.');
assertAllowedSite(siteId);
validateSeedManifest();
const requestedCollection = collectionArg?.slice(13);
assert.ok(!requestedCollection || seedCollections.includes(requestedCollection), 'Unknown --collection value.');
const targetCollections = requestedCollection ? [requestedCollection] : seedCollections;
const targetRecords = requestedCollection ? seedRecords.filter(item => item.collectionId === requestedCollection) : seedRecords;
const config = JSON.parse(await readFile(new URL('../../wix.config.json', import.meta.url), 'utf8'));
assert.equal(config.siteId, HEADLESS_SITE_ID);

const cli = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const tokenResult = spawnSync(cli, ['wix', 'token', '--site', siteId], { cwd: fileURLToPath(new URL('../..', import.meta.url)), encoding: 'utf8', windowsHide: true, shell: process.platform === 'win32' });
assert.equal(tokenResult.status, 0, tokenResult.stderr);
const token = tokenResult.stdout.trim();
assert.ok(token);

async function api(path, { method = 'GET', body } = {}) {
  const response = await fetch(`https://www.wixapis.com${path}`, { method, redirect: 'error', signal: AbortSignal.timeout(45_000), headers: { Authorization: `Bearer ${token}`, 'wix-site-id': siteId, 'Content-Type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`${method} ${path} failed (${response.status}): ${JSON.stringify(data).slice(0, 600)}`);
  return data;
}

async function publishedItem(collectionId, id) {
  const path = `/wix-data/v2/items/${encodeURIComponent(id)}?dataCollectionId=${encodeURIComponent(collectionId)}&consistentRead=true`;
  const response = await fetch(`https://www.wixapis.com${path}`, { redirect: 'error', signal: AbortSignal.timeout(45_000), headers: { Authorization: `Bearer ${token}`, 'wix-site-id': siteId, 'Content-Type': 'application/json' } });
  if (response.status === 404) return undefined;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`GET ${path} failed (${response.status}): ${JSON.stringify(data).slice(0, 600)}`);
  return data.dataItem;
}

async function inclusive(collectionId, id) {
  const result = await api('/wix-data/v2/items/query', { method: 'POST', body: { dataCollectionId: collectionId, query: { filter: { _id: id }, paging: { limit: 1 } }, consistentRead: true, publishPluginOptions: { includeDraftItems: true } } });
  return result.dataItems?.[0];
}

const allowed = new Map();
for (const collectionId of targetCollections) {
  const result = await api(`/wix-data/v2/collections/${encodeURIComponent(collectionId)}?consistentRead=true`);
  const collection = result.collection ?? result.dataCollection;
  assert.equal(collection?.id, collectionId);
  assert.equal(collection.permissions?.insert, 'ADMIN');
  assert.equal(collection.permissions?.update, 'ADMIN');
  if (!collection.plugins?.some(plugin => plugin.type === 'PUBLISH')) {
    await api('/wix-data/v2/collections/add-plugin', { method: 'POST', body: { dataCollectionId: collectionId, plugin: { type: 'PUBLISH', publishOptions: { defaultStatus: 'DRAFT' } } } });
  }
  allowed.set(collectionId, new Set(collection.fields.map(field => field.key)));
}

const savedDrafts = [];
for (const item of targetRecords) {
  const current = await inclusive(item.collectionId, item.id);
  const fields = allowed.get(item.collectionId);
  const existing = Object.fromEntries(Object.entries(current?.data ?? {}).filter(([key]) => fields.has(key)));
  const proposed = Object.fromEntries(Object.entries(item.data).filter(([key]) => fields.has(key)));
  const saved = await api('/wix-data/v2/items/save', { method: 'POST', body: { dataCollectionId: item.collectionId, dataItem: { id: item.id, data: { ...existing, ...proposed } }, publishPluginOptions: { includeDraftItems: true } } });
  assert.equal(saved.dataItem?.id, item.id);
  savedDrafts.push(`${item.collectionId}/${item.id}`);
  console.log(`Saved ${savedDrafts.length}/${targetRecords.length}: ${item.collectionId}/${item.id}`);
}

// These collections were created with Wix's legacy PUBLISH plugin. Its records report
// DRAFT in combined reads, but the newer publish-draft endpoint rejects them. Wix's
// supported legacy transition is to disable drafts (which makes all items live), then
// restore draft-first authoring for future dashboard edits.
const authorizedIds = new Map(targetCollections.map(collectionId => [collectionId, new Set(seedRecords.filter(item => item.collectionId === collectionId).map(item => item.id))]));
for (const collectionId of targetCollections) {
  const combined = await api('/wix-data/v2/items/query', { method: 'POST', body: { dataCollectionId: collectionId, query: { paging: { limit: 1000 } }, consistentRead: true, publishPluginOptions: { includeDraftItems: true }, returnTotalCount: true } });
  assert.ok((combined.pagingMetadata?.total ?? combined.dataItems?.length ?? 0) <= 1000, `${collectionId} exceeds the guarded preflight page size.`);
  const unauthorizedDrafts = (combined.dataItems ?? []).filter(item => item.data?._publishStatus === 'DRAFT' && !authorizedIds.get(collectionId).has(item.id));
  assert.deepEqual(unauthorizedDrafts.map(item => item.id), [], `${collectionId} contains drafts outside the authorized manifest; refusing collection-wide publication.`);
}

for (const collectionId of targetCollections) {
  await api('/wix-data/v2/collections/delete-plugin', { method: 'POST', body: { dataCollectionId: collectionId, pluginType: 'PUBLISH' } });
  try {
    for (const item of seedRecords.filter(record => record.collectionId === collectionId)) {
      const current = await inclusive(collectionId, item.id);
      const fields = allowed.get(collectionId);
      const data = Object.fromEntries(Object.entries(current?.data ?? item.data).filter(([key]) => fields.has(key)));
      const saved = await api('/wix-data/v2/items/save', { method: 'POST', body: { dataCollectionId: collectionId, dataItem: { id: item.id, data } } });
      assert.equal(saved.dataItem?.id, item.id);
      assert.equal((await publishedItem(collectionId, item.id))?.id, item.id, `Base write failed for ${collectionId}/${item.id}`);
    }
  } finally {
    await api('/wix-data/v2/collections/add-plugin', { method: 'POST', body: { dataCollectionId: collectionId, plugin: { type: 'PUBLISH', publishOptions: { defaultStatus: 'DRAFT' } } } });
  }
  console.log(`Published collection and restored draft-first editing: ${collectionId}`);
}

const published = [];
for (const item of targetRecords) {
  const result = await publishedItem(item.collectionId, item.id);
  assert.equal(result?.id, item.id, `Published readback failed for ${item.collectionId}/${item.id}`);
  published.push(`${item.collectionId}/${item.id}`);
}

console.log(JSON.stringify({ siteId, publicationOperations: published.length, draftFirstRestored: targetCollections, published }, null, 2));
