import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { HEADLESS_SITE_ID, collections } from './manifest.mjs';

const [founderPath, heroPath] = process.argv.slice(2);
assert.ok(founderPath && heroPath, 'Usage: node scripts/cms/publish-approved-media.mjs <founder.png> <hero.jpg>');
const config = JSON.parse(await readFile(new URL('../../wix.config.json', import.meta.url), 'utf8'));
assert.equal(config.siteId, HEADLESS_SITE_ID, 'This operation is restricted to the separate Headless site.');

const cli = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const suppliedToken = process.env.WIX_CMS_ADMIN_TOKEN?.trim();
const tokenResult = suppliedToken ? undefined : spawnSync(cli, ['wix', 'token', '--site', HEADLESS_SITE_ID], {
  cwd: fileURLToPath(new URL('../..', import.meta.url)), encoding: 'utf8', windowsHide: true,
  shell: process.platform === 'win32',
});
if (tokenResult) assert.equal(tokenResult.status, 0, tokenResult.error?.message || tokenResult.stderr || 'Wix CLI authentication failed.');
const token = suppliedToken || tokenResult?.stdout.trim();
assert.ok(token, 'Wix CLI returned no site token.');

async function api(path, { method = 'GET', body } = {}) {
  const response = await fetch(`https://www.wixapis.com${path}`, {
    method,
    redirect: 'error',
    signal: AbortSignal.timeout(45000),
    headers: {
      Authorization: `Bearer ${token}`,
      'wix-site-id': HEADLESS_SITE_ID,
      'Content-Type': 'application/json',
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`Wix API ${method} ${path} failed (${response.status}): ${JSON.stringify(data).slice(0, 500)}`);
  return data;
}

async function query(collectionId, id) {
  const result = await api(`/wix-data/v2/items/${encodeURIComponent(id)}?dataCollectionId=${encodeURIComponent(collectionId)}&consistentRead=true`);
  return result.dataItem;
}

function dimensions(file, fallback) {
  const image = file.media?.image?.image ?? file.media?.image ?? file.image ?? {};
  return {
    width: Number(image.width ?? file.width ?? fallback.width),
    height: Number(image.height ?? file.height ?? fallback.height),
  };
}

async function upload(localPath, mimeType, fileName, fallback) {
  const recent = await api('/site-media/v1/files?mediaTypes=IMAGE&sort.fieldName=updatedDate&sort.order=DESC&paging.limit=100').catch(() => ({}));
  const existing = recent.files?.find(file => file.displayName === fileName && file.operationStatus !== 'FAILED');
  if (existing?.id && existing?.url) return { ...existing, ...dimensions(existing, fallback) };
  const ticket = await api('/site-media/v1/files/generate-upload-url', {
    method: 'POST', body: { mimeType, fileName, filePath: '/pan-african-fabric/phase-1', private: false },
  });
  assert.ok(ticket.uploadUrl, 'Wix did not return a media upload URL.');
  const bytes = await readFile(localPath);
  const response = await fetch(ticket.uploadUrl, {
    method: 'PUT', headers: { 'Content-Type': mimeType }, body: bytes, signal: AbortSignal.timeout(90000), redirect: 'error',
  });
  const uploaded = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`Wix media upload failed (${response.status}).`);
  let file = uploaded.file ?? uploaded;
  assert.ok(file.id && file.url, 'Wix media upload returned no usable file descriptor.');
  for (let attempt = 0; attempt < 8 && file.operationStatus && file.operationStatus !== 'READY'; attempt++) {
    await new Promise(resolve => setTimeout(resolve, 750));
    try {
      const result = await api(`/site-media/v1/files/${encodeURIComponent(file.id)}`);
      file = result.file ?? result;
    } catch {
      const result = await api(`/site-media/v1/files/get-file-by-id?fileId=${encodeURIComponent(file.id)}`);
      file = result.file ?? result.files?.[0] ?? result;
    }
  }
  assert.notEqual(file.operationStatus, 'FAILED', `Wix failed to process ${fileName}.`);
  return { ...file, ...dimensions(file, fallback) };
}

async function ensureMedia({ id, path, mimeType, fileName, title, alt, ratio, focalPosition, width, height }) {
  const published = await query('MediaAssets', id).catch(() => undefined);
  if (published?.data?.image) return published;
  const draft = await query('MediaAssets__drafts', id).catch(() => undefined);
  let image = draft?.data?.image;
  if (!image) {
    const file = await upload(path, mimeType, fileName, { width, height });
    image = file.url;
    width = file.width;
    height = file.height;
  }
  return saveAndPublish('MediaAssets', id, {
    title, slug: id, filename: fileName, assetType: 'image', alt, ratio, focalPosition,
    location: 'Wix Media Manager', image, width, height, decorative: false,
    usagePermission: 'web-display-approved',
    usageTerms: 'Approved by the project collaborator for display on The Pan-African Fabric website.',
    downloadAllowed: false, sourceVersion: 'client-supplied-2026-09-09', version: '1',
  });
}

async function saveAndPublish(collectionId, id, data) {
  const saved = await api('/wix-data/v2/items/save', {
    method: 'POST', body: {
      dataCollectionId: collectionId,
      dataItem: { id, data: { ...data, _publishStatus: 'PUBLISHED' } },
      publishPluginOptions: { includeDraftItems: true },
    },
  });
  const savedId = saved.dataItem?.id ?? id;
  assert.equal(saved.dataItem?.data?._publishStatus, 'PUBLISHED', `${collectionId}/${savedId} did not publish.`);
  const draft = await query(`${collectionId}__drafts`, savedId).catch(() => undefined);
  if (draft) {
    return api('/wix-data/v2/items/publish-draft', {
      method: 'POST', body: { dataCollectionId: collectionId, dataItemId: savedId },
    });
  }
  const published = await query(collectionId, savedId).catch(() => undefined);
  assert.ok(published, `${collectionId}/${savedId} was neither drafted nor published after save returned ${JSON.stringify({ id: saved.dataItem?.id, collection: saved.dataItem?.dataCollectionId, status: saved.dataItem?.data?._publishStatus })}.`);
  return published;
}

const founder = await ensureMedia({
  id: 'media-founder-shiri-achu', path: founderPath, mimeType: 'image/png', fileName: basename(founderPath),
  title: 'Shiri Achu founder portrait', alt: 'Portrait of Shiri Achu wearing a black hat, glasses and a colourful patterned tie.',
  ratio: '4/5', focalPosition: '50% 35%', width: 1076, height: 1462,
});
const hero = await ensureMedia({
  id: 'media-home-hero-pan-african-fan', path: heroPath, mimeType: 'image/jpeg', fileName: basename(heroPath),
  title: 'The Pan-African Fan', alt: 'A colourful circular folding fan made with patterned fabric on a white background.',
  ratio: '16/9', focalPosition: '50% 48%', width: 1179, height: 1350,
});

await saveAndPublish('Pages', 'page-home', {
  title: 'Home', slug: 'home', pageKey: 'home', path: '/', heroAsset: 'media-home-hero-pan-african-fan',
  sourceVersion: 'frontend-cms-wiring-2026-09-09', displayOrder: 0,
});
await saveAndPublish('Pages', 'page-about', {
  title: 'About', slug: 'about', pageKey: 'about', path: '/about',
  sourceVersion: 'frontend-cms-wiring-2026-09-09', displayOrder: 1,
});
await saveAndPublish('PageSections', 'section-about-founder', {
  title: 'Founder', slug: 'about-founder', sectionKey: 'founder', sectionType: 'media', isEnabled: true,
  page: 'page-about', mediaAsset: 'media-founder-shiri-achu', sourceVersion: 'frontend-cms-wiring-2026-09-09', displayOrder: 4,
});

for (const expected of collections) {
  const collectionResponse = await api(`/wix-data/v2/collections/${expected.id}?consistentRead=true`);
  const current = collectionResponse.collection ?? collectionResponse.dataCollection;
  assert.ok(current, `Wix returned no schema for ${expected.id}.`);
  if (current.permissions?.read === 'ANYONE') continue;
  await api(`/wix-data/v2/collections/${expected.id}`, {
    method: 'PATCH',
    body: {
      dataCollection: { id: expected.id, permissions: { ...current.permissions, read: 'ANYONE' } },
      fieldMask: { paths: ['permissions'] },
    },
  });
}

console.log(JSON.stringify({
  siteId: HEADLESS_SITE_ID,
  published: ['MediaAssets/media-founder-shiri-achu', 'MediaAssets/media-home-hero-pan-african-fan', 'Pages/page-home', 'Pages/page-about', 'PageSections/section-about-founder'],
  media: [founder.dataItem?.id ?? founder.id ?? 'media-founder-shiri-achu', hero.dataItem?.id ?? hero.id ?? 'media-home-hero-pan-african-fan'],
  permissions: 'published collections readable by anyone; writes remain admin-only',
}, null, 2));
