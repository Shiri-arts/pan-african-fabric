import test from 'node:test';
import assert from 'node:assert/strict';
import { EXISTING_EDITOR_SITE_ID, HEADLESS_SITE_ID, assertPrivateCollection, collections, creationPlan } from './manifest.mjs';
import { createPrivateCmsClient, getPublicContent } from './content.server.mjs';
import { applyFoundation } from './apply-foundation.mjs';

const siteId = HEADLESS_SITE_ID;
const token = 'TEST_ONLY_NOT_A_CREDENTIAL';

test('public content cannot leak even apparently approved private data', () => {
  for (const { id } of collections) assert.deepEqual(getPublicContent(id), { items: [], state: 'disabled-phase-1' });
  assert.throws(() => getPublicContent('WixForms'), /Unknown/);
});

test('old Editor site, invalid IDs and missing credentials are rejected before network access', () => {
  let called = false;
  const fetchImpl = () => { called = true; };
  for (const rejected of [EXISTING_EDITOR_SITE_ID, undefined, 'other-site', '11111111-2222-4333-8444-555555555555']) assert.throws(() => createPrivateCmsClient({ siteId: rejected, token, fetchImpl }), /Headless|separate/);
  assert.throws(() => createPrivateCmsClient({ siteId, token: '', fetchImpl }), /token/);
  assert.equal(called, false);
});

test('the redesigned schemas are private, draft-first and all relationship targets exist', () => {
  assert.deepEqual(collections.map(value => value.id), [
    'SiteSettings', 'Pages', 'PageSections', 'Editions', 'Regions', 'Countries', 'EditionColours', 'Symbols',
    'Designers', 'Participations', 'Garments', 'Events', 'MediaAssets', 'Stories', 'PressItems',
    'PartnershipOptions', 'ContactChannels', 'ShopItems',
  ]);
  for (const collection of collections) {
    assert.deepEqual(Object.values(collection.permissions), ['ADMIN', 'ADMIN', 'ADMIN', 'ADMIN']);
    assert.equal(collection.plugins[0].type, 'PUBLISH');
    assert.equal(collection.plugins[0].publishOptions.defaultStatus, 'DRAFT');
    assert.equal(new Set(collection.fields.map(value => value.key)).size, collection.fields.length);
    for (const field of collection.fields.filter(value => value.typeMetadata)) {
      const target = field.typeMetadata.reference?.referencedCollectionId ?? field.typeMetadata.multiReference?.referencedCollectionId;
      assert.ok(collections.some(value => value.id === target));
    }
  }
  assert.ok(creationPlan().slice(0, collections.length).every(value => value.body.collection && value.body.collection.fields.every(field => !field.typeMetadata)));
  assert.equal(creationPlan().filter(value => value.body.plugin?.type === 'PUBLISH').length, collections.length);
});

test('permission verification fails closed when permissions are missing or visitor-readable', () => {
  const expected = collections[0];
  assert.throws(() => assertPrivateCollection({ ...expected, permissions: undefined }, expected), /permissions/);
  assert.throws(() => assertPrivateCollection({ ...expected, permissions: { ...expected.permissions, read: 'ANYONE' } }, expected), /permissions/);
});

test('private transport uses fixed host, site token, no redirects, and no caching', async () => {
  let request;
  const client = createPrivateCmsClient({ siteId, token, fetchImpl: async (url, options) => { request = { url, options }; return { ok: true, json: async () => ({ dataItems: [] }) }; } });
  assert.deepEqual(await client.queryPrivate('Countries'), []);
  assert.equal(request.url, 'https://www.wixapis.com/wix-data/v2/items/query');
  assert.equal(request.options.headers['wix-site-id'], siteId);
  assert.equal(request.options.redirect, 'error');
  assert.equal(request.options.cache, 'no-store');
  await assert.rejects(client.request('https://example.com'), /Unsupported/);
  await assert.rejects(client.queryPrivate('WixForms'), /Unknown/);
});

test('upstream private error bodies and network errors are never surfaced', async () => {
  const client = createPrivateCmsClient({ siteId, token, fetchImpl: async () => ({ ok: false, status: 403, json: async () => ({ privateData: token }) }) });
  await assert.rejects(client.queryPrivate('Countries'), error => error.message === 'Private CMS request failed (403).' && !error.message.includes(token));
  const network = createPrivateCmsClient({ siteId, token, fetchImpl: async () => { throw new Error(token); } });
  await assert.rejects(network.queryPrivate('Countries'), /no content returned/);
});

test('foundation creates shells before references, verifies schemas and empty collections, and resumes without writes', async () => {
  const stored = new Map();
  const mutations = [];
  const client = {
    async request(path, operation) {
      if (!operation) {
        const value = stored.get(path.split('/').at(-1).split('?')[0]);
        if (!value) { const error = new Error('Missing'); error.status = 404; throw error; }
        return { collection: structuredClone(value) };
      }
      mutations.push(operation);
      if (operation.body.collection) stored.set(operation.body.collection.id, structuredClone(operation.body.collection));
      else if (operation.body.field) {
        const { dataCollectionId, field } = operation.body;
        const target = field.typeMetadata.reference?.referencedCollectionId ?? field.typeMetadata.multiReference?.referencedCollectionId;
        assert.ok(stored.has(target));
        stored.get(dataCollectionId).fields.push(structuredClone(field));
      } else {
        const { dataCollectionId, plugin } = operation.body;
        stored.get(dataCollectionId).plugins = [structuredClone(plugin)];
      }
      return {};
    },
    async queryPrivate() { return []; },
  };
  assert.equal((await applyFoundation(client)).collections.length, collections.length);
  const firstCount = mutations.length;
  await applyFoundation(client);
  assert.equal(mutations.length, firstCount);
});

test('foundation adds a new scalar field to an existing collection', async () => {
  const stored = new Map(collections.map(value => [value.id, structuredClone(value)]));
  stored.get('Editions').fields = stored.get('Editions').fields.filter(value => value.key !== 'leadLine');
  const created = [];
  const client = {
    async request(path, operation) {
      if (!operation) return { collection: structuredClone(stored.get(path.split('/').at(-1).split('?')[0])) };
      if (operation.body.field) {
        stored.get(operation.body.dataCollectionId).fields.push(structuredClone(operation.body.field));
        created.push(`${operation.body.dataCollectionId}.${operation.body.field.key}`);
      }
      return {};
    },
    async queryPrivate() { return []; },
  };
  await applyFoundation(client);
  assert.deepEqual(created, ['Editions.leadLine']);
});

test('foundation refuses permission drift before any mutations', async () => {
  let writes = 0;
  const client = { request: async (_path, operation) => {
    if (operation) writes++;
    return { collection: { ...collections[0], permissions: { ...collections[0].permissions, read: 'ANYONE' } } };
  } };
  await assert.rejects(applyFoundation(client), /permissions/);
  assert.equal(writes, 0);
});

