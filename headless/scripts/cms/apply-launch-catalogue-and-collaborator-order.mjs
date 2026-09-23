import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { HEADLESS_SITE_ID, seedRecords } from './approved-content-seed.mjs';

const args = new Set(process.argv.slice(2));
assert.ok(args.has('--apply') && args.has('--confirm-publish'), 'Run with --apply --confirm-publish.');

const collaboratorIds = [
  'partnership-embassies',
  'partnership-museums',
  'partnership-cultural-organisations',
  'partnership-collaborator-future-hosts',
  'partnership-universities',
  'partnership-sponsors',
  'partnership-designers-and-future-hosts',
];
const shopSeed = seedRecords.find(record => record.collectionId === 'ShopItems' && record.id === 'shop-pan-african-fan');
const shopPageSeed = seedRecords.find(record => record.collectionId === 'Pages' && record.id === 'page-shop');
assert.ok(shopSeed && shopPageSeed, 'Approved shop seed records are missing.');

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
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`${method} ${path} failed (${response.status}): ${JSON.stringify(data).slice(0, 500)}`);
  return data;
}

async function updatePublished(collectionId, id, changes) {
  const current = (await api(`/wix-data/v2/items/${encodeURIComponent(id)}?dataCollectionId=${encodeURIComponent(collectionId)}&consistentRead=true`)).dataItem;
  assert.ok(current?.data, `Missing ${collectionId}/${id}.`);
  const saved = await api('/wix-data/v2/items/save', {
    method: 'POST',
    body: {
      dataCollectionId: collectionId,
      dataItem: { id, data: { ...current.data, ...changes, _publishStatus: 'PUBLISHED' } },
      publishPluginOptions: { includeDraftItems: true },
    },
  });
  assert.equal(saved.dataItem?.id, id);
  const draft = await api(`/wix-data/v2/items/${encodeURIComponent(id)}?dataCollectionId=${encodeURIComponent(collectionId)}__drafts&consistentRead=true`).catch(() => undefined);
  if (draft?.dataItem) {
    await api('/wix-data/v2/items/publish-draft', { method: 'POST', body: { dataCollectionId: collectionId, dataItemId: id } });
  }
}

const enquiriesBefore = await api('/wix-data/v2/items/query', {
  method: 'POST',
  body: { dataCollectionId: 'Enquiries', query: { paging: { limit: 10 } }, consistentRead: true, returnTotalCount: true },
});
assert.equal(enquiriesBefore.pagingMetadata?.total ?? enquiriesBefore.dataItems?.length, 1, 'Expected the existing single enquiry record.');
const enquiryCollection = (await api('/wix-data/v2/collections/Enquiries?consistentRead=true')).collection;
assert.ok(enquiryCollection, 'Missing Enquiries collection.');
if (enquiryCollection.permissions?.insert !== 'ADMIN' || enquiryCollection.permissions?.read !== 'ADMIN'
  || enquiryCollection.permissions?.update !== 'ADMIN' || enquiryCollection.permissions?.remove !== 'ADMIN') {
  await api('/wix-data/v2/collections/Enquiries', {
    method: 'PATCH',
    body: {
      dataCollection: {
        id: 'Enquiries',
        permissions: { ...enquiryCollection.permissions, insert: 'ADMIN', read: 'ADMIN', update: 'ADMIN', remove: 'ADMIN' },
      },
      fieldMask: { paths: ['permissions'] },
    },
  });
}

for (const [index, id] of collaboratorIds.entries()) {
  await updatePublished('PartnershipOptions', id, { displayOrder: index + 1 });
}

await updatePublished('ShopItems', shopSeed.id, shopSeed.data);
await updatePublished('Pages', shopPageSeed.id, {
  introduction: shopPageSeed.data.introduction,
  seoDescription: 'The Pan-African Fan is available to order directly from the initiative. Contact the team for current price, payment and delivery details.',
});

const readback = await api('/wix-data/v2/items/query', {
  method: 'POST',
  body: { dataCollectionId: 'PartnershipOptions', query: { filter: { optionType: 'collaborator' }, sort: [{ fieldName: 'displayOrder', order: 'ASC' }], paging: { limit: 20 } }, consistentRead: true },
});
assert.deepEqual(readback.dataItems?.map(item => item.id), collaboratorIds);
const fan = (await api('/wix-data/v2/items/shop-pan-african-fan?dataCollectionId=ShopItems&consistentRead=true')).dataItem;
assert.equal(fan?.data?.availabilityLabel, 'Available to order');
assert.equal(fan?.data?.commerceEnabled, false);
const enquiriesAfter = await api('/wix-data/v2/items/query', {
  method: 'POST',
  body: { dataCollectionId: 'Enquiries', query: { paging: { limit: 10 } }, consistentRead: true, returnTotalCount: true },
});
const enquiryCollectionAfter = (await api('/wix-data/v2/collections/Enquiries?consistentRead=true')).collection;
assert.equal(enquiriesAfter.pagingMetadata?.total ?? enquiriesAfter.dataItems?.length, 1);
assert.equal(enquiryCollectionAfter?.permissions?.insert, 'ADMIN');

console.log(JSON.stringify({
  siteId: HEADLESS_SITE_ID,
  collaboratorOrder: readback.dataItems.map(item => item.data.label),
  shopItem: { id: fan.id, availabilityLabel: fan.data.availabilityLabel, commerceEnabled: fan.data.commerceEnabled },
  enquiries: { existingRecordsPreserved: 1, newPublicCmsStorageDisabled: enquiryCollectionAfter.permissions.insert === 'ADMIN' },
}, null, 2));
