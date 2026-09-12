import test from 'node:test';
import assert from 'node:assert/strict';
import { EXISTING_EDITOR_SITE_ID, HEADLESS_SITE_ID, assertEditorialCollection, collections, creationPlan } from './manifest.mjs';
import { createPrivateCmsClient, publicCollection } from './content.server.mjs';
import { applyFoundation } from './apply-foundation.mjs';
import { validateContent } from './validate-content.mjs';

const siteId = HEADLESS_SITE_ID;
const token = 'TEST_ONLY_NOT_A_CREDENTIAL';

test('public collection registry accepts base collections and rejects unknown or draft collections', () => {
  for (const { id } of collections) assert.deepEqual(publicCollection(id), { collectionId: id, state: 'published-only' });
  assert.throws(() => publicCollection('WixForms'), /Unknown/);
  assert.throws(() => publicCollection('Pages__drafts'), /Unknown|Draft/);
});

test('old Editor site, invalid IDs and missing credentials are rejected before network access', () => {
  let called = false;
  const fetchImpl = () => { called = true; };
  for (const rejected of [EXISTING_EDITOR_SITE_ID, undefined, 'other-site', '11111111-2222-4333-8444-555555555555']) assert.throws(() => createPrivateCmsClient({ siteId: rejected, token, fetchImpl }), /Headless|separate/);
  assert.throws(() => createPrivateCmsClient({ siteId, token: '', fetchImpl }), /token/);
  assert.equal(called, false);
});

test('the redesigned schemas are public-read, admin-write, draft-first and all relationship targets exist', () => {
  assert.deepEqual(collections.map(value => value.id), [
    'SiteSettings', 'Pages', 'PageSections', 'Editions', 'Regions', 'Countries', 'EditionColours', 'Symbols',
    'Designers', 'Participations', 'Garments', 'Events', 'MediaAssets', 'Stories', 'PressItems',
    'PartnershipOptions', 'ContactChannels', 'ShopItems',
  ]);
  for (const collection of collections) {
    assert.deepEqual(Object.values(collection.permissions), ['ADMIN', 'ADMIN', 'ADMIN', 'ANYONE']);
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

test('permission verification fails closed when permissions are missing or writes are public', () => {
  const expected = collections[0];
  assert.throws(() => assertEditorialCollection({ ...expected, permissions: undefined }, expected), /permissions/);
  assert.throws(() => assertEditorialCollection({ ...expected, permissions: { ...expected.permissions, insert: 'ANYONE' } }, expected), /permissions/);
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

test('foundation creates shells before references, verifies schemas and resumes without duplicate writes', async () => {
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

test('foundation preserves existing content while applying additive schema fields', async () => {
  const stored = new Map(collections.map(value => [value.id, structuredClone(value)]));
  stored.get('Pages').fields = stored.get('Pages').fields.filter(value => value.key !== 'heroTagline');
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
    async queryPrivate(collectionId) { return collectionId === 'Pages' ? [{ id: 'page-home', data: { title: 'Home' } }] : []; },
  };
  const result = await applyFoundation(client);
  assert.deepEqual(created, ['Pages.heroTagline']);
  assert.equal(result.collections.find(value => value.id === 'Pages').hasPublishedItems, true);
});

test('foundation refuses permission drift before any mutations', async () => {
  let writes = 0;
  const client = { request: async (_path, operation) => {
    if (operation) writes++;
    return { collection: { ...collections[0], permissions: { ...collections[0].permissions, read: 'ADMIN' } } };
  } };
  await assert.rejects(applyFoundation(client), /permissions/);
  assert.equal(writes, 0);
});

test('content validator reports unsafe publication and accepts a complete page navigation record', () => {
  const common = { title: 'About', slug: 'about', sourceVersion: 'client-approved-v1', approvedAt: '2026-09-11T00:00:00.000Z', _publishStatus: 'PUBLISHED' };
  const records = {
    Pages: [{ id: 'page-about', state: 'published', data: {
      ...common, pageKey: 'about', path: '/about', heroTitle: 'About', navigationVisible: true, navigationLabel: 'About', navigationOrder: 1,
    } }],
  };
  assert.deepEqual(validateContent(records), { valid: true, summary: { errors: 0, warnings: 0 }, issues: [] });
  records.Pages[0].data.primaryCtaHref = 'javascript:alert(1)';
  records.Pages[0].data.primaryCtaLabel = 'Unsafe';
  Object.assign(records.Pages[0].data, { footerNavigationVisible: true });
  const invalid = validateContent(records);
  assert.equal(invalid.valid, false);
  assert.ok(invalid.issues.some(issue => issue.code === 'unsafe-url'));
  assert.ok(invalid.issues.some(issue => issue.code === 'incomplete-navigation'));
});

test('content validator catches draft dependencies, media rights and invalid event ranges', () => {
  const common = { title: 'Item', slug: 'item', sourceVersion: 'approved-v1', approvedAt: '2026-09-11T00:00:00.000Z', _publishStatus: 'PUBLISHED' };
  const records = {
    MediaAssets: [{ id: 'media-draft', state: 'draft', data: { title: 'Draft image', slug: 'draft-image', assetType: 'image' } }],
    Pages: [{ id: 'page-home', state: 'published', data: { ...common, pageKey: 'home', path: '/', heroTitle: 'Home', heroAsset: 'media-draft' } }],
    Events: [{ id: 'event-one', state: 'published', data: {
      ...common, eventType: 'showcase', eventStatus: 'confirmed', startsAt: '2026-09-26T17:00:00.000Z', endsAt: '2026-09-26T16:00:00.000Z',
      timezoneLabel: 'America/New_York', venue: 'Venue', location: 'Washington, D.C.', isConfirmed: true,
    } }],
  };
  const result = validateContent(records);
  assert.equal(result.valid, false);
  assert.ok(result.issues.some(issue => issue.code === 'draft-dependency'));
  assert.ok(result.issues.some(issue => issue.code === 'invalid-date-range'));
});

test('content validator measures published edition-colour contrast', () => {
  const common = { title: 'Colour', slug: 'colour', sourceVersion: 'approved-v1', approvedAt: '2026-09-11T00:00:00.000Z', _publishStatus: 'PUBLISHED' };
  const records = { EditionColours: [{ id: 'colour', state: 'published', data: {
    ...common, colourName: 'White', hexValue: '#ffffff', textHex: '#eeeeee', edition: 'edition-one', country: 'ghana', contrastRatio: 9,
  } }] };
  const result = validateContent(records);
  assert.equal(result.valid, false);
  assert.ok(result.issues.some(issue => issue.code === 'insufficient-contrast'));
  assert.ok(result.issues.some(issue => issue.code === 'stale-contrast-ratio'));
});
