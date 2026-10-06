import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { HEADLESS_SITE_ID, seedRecords } from './approved-content-seed.mjs';

const args = new Set(process.argv.slice(2));
assert.ok(args.has('--apply') && args.has('--confirm-publish'), 'Run with --apply --confirm-publish.');

const countrySeeds = seedRecords.filter(record => record.collectionId === 'Countries');
assert.equal(countrySeeds.length, 9, 'Expected exactly nine Edition One countries.');

const richTextValue = document => document?.nodes
  ?.flatMap(node => node.nodes ?? [])
  .map(node => node.textData?.text ?? '')
  .join('') ?? '';

for (const country of countrySeeds) {
  const introduction = richTextValue(country.data.introduction);
  assert.ok(introduction, `${country.data.countryName} is missing an introduction.`);
  assert.ok(introduction.trim().split(/\s+/u).length <= 100, `${country.data.countryName} exceeds 100 words.`);
}

const cli = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const cwd = fileURLToPath(new URL('../..', import.meta.url));
const tokenResult = spawnSync(cli, ['wix', 'token', '--site', HEADLESS_SITE_ID], {
  cwd,
  encoding: 'utf8',
  windowsHide: true,
  shell: process.platform === 'win32',
});
assert.equal(tokenResult.status, 0, tokenResult.stderr || 'Wix authentication failed.');
const token = tokenResult.stdout.trim();

async function api(path, { method = 'GET', body } = {}) {
  const response = await fetch(`https://www.wixapis.com${path}`, {
    method,
    redirect: 'error',
    signal: AbortSignal.timeout(45_000),
    headers: {
      Authorization: `Bearer ${token}`,
      'wix-site-id': HEADLESS_SITE_ID,
      'Content-Type': 'application/json',
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok) throw new Error(`${method} ${path} failed (${response.status}): ${text.slice(0, 500)}`);
  return data;
}

async function getItem(collectionId, id) {
  const path = `/wix-data/v2/items/${encodeURIComponent(id)}?dataCollectionId=${encodeURIComponent(collectionId)}&consistentRead=true`;
  return (await api(path)).dataItem;
}

async function saveAndPublish(country) {
  const current = await getItem('Countries', country.id);
  assert.ok(current?.data, `Published country record ${country.id} was not found.`);
  const saved = await api('/wix-data/v2/items/save', {
    method: 'POST',
    body: {
      dataCollectionId: 'Countries',
      dataItem: {
        id: country.id,
        data: {
          ...current.data,
          introduction: country.data.introduction,
          _publishStatus: 'PUBLISHED',
        },
      },
      publishPluginOptions: { includeDraftItems: true },
    },
  });
  assert.equal(saved.dataItem?.id, country.id);
  const draft = await getItem('Countries__drafts', country.id).catch(() => undefined);
  if (draft) {
    await api('/wix-data/v2/items/publish-draft', {
      method: 'POST',
      body: { dataCollectionId: 'Countries', dataItemId: country.id },
    });
  }
}

for (const country of countrySeeds) await saveAndPublish(country);

const verified = [];
for (const country of countrySeeds) {
  const published = await getItem('Countries', country.id);
  const expected = richTextValue(country.data.introduction);
  const actual = richTextValue(published.data.introduction);
  assert.equal(actual, expected, `${country.data.countryName} introduction did not match after publication.`);
  verified.push({
    country: country.data.countryName,
    slug: country.data.slug,
    words: actual.trim().split(/\s+/u).length,
  });
}

console.log(JSON.stringify({ siteId: HEADLESS_SITE_ID, published: verified.length, verified }, null, 2));
