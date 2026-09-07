import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
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
  const id = `phase1-check-${randomUUID()}`;
  const itemPath = `/wix-data/v2/items/${id}?dataCollectionId=${expected.id}`;
  let created = false;
  try {
    const insertion = await request('/wix-data/v2/items', admin, 'POST', {
      dataCollectionId: expected.id,
      dataItem: { id, data: { title: '__phase1_access_check__', summary: 'Temporary synthetic permission test; not editorial content.' } },
    });
    assert.equal(insertion.status, 200, `Canary insertion failed for ${expected.id}.`);
    created = true;
    assert.equal((await request(`${itemPath}&consistentRead=true`, admin)).status, 200, 'Admin cannot read canary.');
    const query = { dataCollectionId: expected.id, query: { paging: { limit: 1 } }, consistentRead: true };
    const list = await request('/wix-data/v2/items/query', visitor, 'POST', query);
    const direct = await request(`${itemPath}&consistentRead=true`, visitor);
    assert.equal(list.status, 403, `${expected.id}: visitor list was not denied.`);
    assert.equal(direct.status, 403, `${expected.id}: visitor direct read was not denied.`);
    results.push({ collection: expected.id, visitorQueryStatus: list.status, visitorGetStatus: direct.status });
  } finally {
    if (created) {
      const removal = await request(itemPath, admin, 'DELETE');
      assert.equal(removal.status, 200, `Cleanup failed: ${expected.id}/${id}`);
      const empty = await request('/wix-data/v2/items/query', admin, 'POST', { dataCollectionId: expected.id, query: { paging: { limit: 1 } }, consistentRead: true });
      assert.equal(empty.status, 200);
      assert.deepEqual(empty.data.dataItems, [], `${expected.id} is not empty after cleanup.`);
    }
  }
}
const report = { checkedAt: new Date().toISOString(), siteId, anonymousAuthentication: 'verified', results, canariesRemoved: true };
console.log(JSON.stringify(report, null, 2));
await writeFile(new URL('../../cms-access-verification.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
