import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { collections, assertPrivateCollection } from './manifest.mjs';

// This check is bound to the migration site. It never changes permissions.
const siteId = '6dabfd00-04c6-4f6f-8282-fb56b240c160';
const appId = '7c983a5c-6496-4542-8036-6ffd5a3c71eb';
const config = JSON.parse(await readFile(new URL('../../wix.config.json', import.meta.url), 'utf8'));
assert.equal(config.siteId, siteId);
assert.equal(config.appId, appId);
const admin = process.env.WIX_CMS_ADMIN_TOKEN;
assert.ok(admin, 'A temporary site-scoped administrative token is required.');
async function request(path, token, method = 'GET', body) {
  const response = await fetch(`https://www.wixapis.com${path}`, {
    method, redirect: 'error', signal: AbortSignal.timeout(30000),
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}`, 'wix-site-id': siteId } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  let data;
  try { data = await response.json(); } catch { data = {}; }
  return { status: response.status, data };
}
const visitorResult = await request('/oauth2/token', null, 'POST', { clientId: appId, grantType: 'anonymous' });
assert.equal(visitorResult.status, 200, 'Anonymous authentication failed.');
const visitor = visitorResult.data.access_token;
assert.ok(visitor);
const results = [];
for (const expected of collections) {
  const schema = await request(`/wix-data/v2/collections/${expected.id}?consistentRead=true`, admin);
  assert.equal(schema.status, 200);
  assertPrivateCollection(schema.data.collection, expected);
  const publishedQuery = { dataCollectionId: expected.id, query: { paging: { limit: 1 } }, consistentRead: true };
  const draftQuery = { ...publishedQuery, dataCollectionId: `${expected.id}__drafts` };
  const adminPublished = await request('/wix-data/v2/items/query', admin, 'POST', publishedQuery);
  const adminDrafts = await request('/wix-data/v2/items/query', admin, 'POST', draftQuery);
  assert.equal(adminPublished.status, 200, `${expected.id}: admin cannot query the published collection.`);
  assert.ok([200, 404].includes(adminDrafts.status), `${expected.id}: unexpected draft collection response.`);
  assert.deepEqual(adminPublished.data.dataItems, [], `${expected.id} published collection is not empty.`);
  if (adminDrafts.status === 200) assert.deepEqual(adminDrafts.data.dataItems, [], `${expected.id} draft collection is not empty.`);
  const visitorPublished = await request('/wix-data/v2/items/query', visitor, 'POST', publishedQuery);
  const visitorDrafts = await request('/wix-data/v2/items/query', visitor, 'POST', draftQuery);
  assert.equal(visitorPublished.status, 403, `${expected.id}: visitor published query was not denied.`);
  assert.ok([403, 404].includes(visitorDrafts.status), `${expected.id}: visitor draft collection was accessible.`);
  results.push({
    collection: expected.id,
    visitorPublishedQueryStatus: visitorPublished.status,
    visitorDraftQueryStatus: visitorDrafts.status,
    draftCollectionState: adminDrafts.status === 404 ? 'not-materialized' : 'empty',
    publishedItemCount: 0,
    draftItemCount: 0,
  });
}
const report = { checkedAt: new Date().toISOString(), siteId, anonymousAuthentication: 'verified', results, mutations: 0 };
console.log(JSON.stringify(report, null, 2));
await writeFile(new URL('../../cms-access-verification.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');

