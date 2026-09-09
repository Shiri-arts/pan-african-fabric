import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { HEADLESS_SITE_ID } from './manifest.mjs';

const config = JSON.parse(await readFile(new URL('../../wix.config.json', import.meta.url), 'utf8'));
assert.equal(config.siteId, HEADLESS_SITE_ID);

const oauth = await fetch('https://www.wixapis.com/oauth2/token', {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ clientId: config.appId, grantType: 'anonymous' }),
});
assert.equal(oauth.status, 200, 'Anonymous Wix authentication failed.');
const { access_token: token } = await oauth.json();
assert.ok(token);

async function get(collectionId, itemId) {
  const response = await fetch(`https://www.wixapis.com/wix-data/v2/items/${encodeURIComponent(itemId)}?dataCollectionId=${encodeURIComponent(collectionId)}&consistentRead=true`, {
    headers: { Authorization: `Bearer ${token}`, 'wix-site-id': HEADLESS_SITE_ID },
  });
  assert.equal(response.status, 200, `${collectionId}/${itemId} is not visitor-readable.`);
  return (await response.json()).dataItem;
}

const [founder, hero, home, about, founderSection] = await Promise.all([
  get('MediaAssets', 'media-founder-shiri-achu'),
  get('MediaAssets', 'media-home-hero-pan-african-fan'),
  get('Pages', 'page-home'),
  get('Pages', 'page-about'),
  get('PageSections', 'section-about-founder'),
]);

for (const asset of [founder, hero]) {
  assert.equal(asset.data?._publishStatus, 'PUBLISHED');
  assert.equal(asset.data?.usagePermission, 'web-display-approved');
  assert.ok(asset.data?.image?.startsWith('https://static.wixstatic.com/'));
  assert.ok(asset.data?.alt);
  const imageResponse = await fetch(asset.data.image, { redirect: 'manual' });
  assert.equal(imageResponse.status, 200, `${asset.id} image URL returned ${imageResponse.status}.`);
  assert.ok(imageResponse.headers.get('content-type')?.startsWith('image/'), `${asset.id} did not return image bytes.`);
}
assert.equal(home.data?.heroAsset, hero.id);
assert.equal(founderSection.data?.page, about.id);
assert.equal(founderSection.data?.mediaAsset, founder.id);

const draftProbe = await fetch('https://www.wixapis.com/wix-data/v2/items/query', {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}`, 'wix-site-id': HEADLESS_SITE_ID, 'Content-Type': 'application/json' },
  body: JSON.stringify({ dataCollectionId: 'MediaAssets__drafts', query: { paging: { limit: 1 } }, consistentRead: true }),
});
assert.ok([403, 404].includes(draftProbe.status), 'Anonymous visitor can access a draft collection.');

console.log(JSON.stringify({
  siteId: HEADLESS_SITE_ID,
  publishedItemsVerified: 5,
  relationshipsVerified: ['Pages.home -> hero MediaAsset', 'PageSections.founder -> Pages.about', 'PageSections.founder -> founder MediaAsset'],
  anonymousDraftStatus: draftProbe.status,
}, null, 2));
