import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { basename } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { HEADLESS_SITE_ID } from './manifest.mjs';

const documents = [
  { pressId: 'press-official-press-kit', mediaId: 'media-official-press-kit', path: 'D:/shiridocs/source-truth/The Pan-African Fabric - Official Press Kit.pdf', title: 'The Pan-African Fabric — Press Kit' },
  { pressId: 'press-official-media-guide', mediaId: 'media-official-media-guide', path: 'D:/shiridocs/source-truth/The_Pan_African_Fabric_Official_Press_ _Media_Guide_1.pdf', title: 'The Pan-African Fabric — Official Press & Media Guide' },
  { pressId: 'press-showcase-reception-invitation', mediaId: 'media-showcase-reception-invitation', path: 'D:/shiridocs/source-truth/The_Pan_African_Fabric_Showcase_ _Cultural_Reception_Invite_Sept.pdf', title: 'Showcase and reception invitation' },
];
const config = JSON.parse(await readFile(new URL('../../wix.config.json', import.meta.url), 'utf8'));
assert.equal(config.siteId, HEADLESS_SITE_ID);
const cli = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const tokenResult = spawnSync(cli, ['wix', 'token', '--site', HEADLESS_SITE_ID], { cwd: fileURLToPath(new URL('../..', import.meta.url)), encoding: 'utf8', windowsHide: true, shell: process.platform === 'win32' });
assert.equal(tokenResult.status, 0, tokenResult.stderr || 'Wix authentication failed.');
const token = tokenResult.stdout.trim();

async function api(path, { method = 'GET', body } = {}) {
  const response = await fetch(`https://www.wixapis.com${path}`, { method, redirect: 'error', signal: AbortSignal.timeout(90_000), headers: { Authorization: `Bearer ${token}`, 'wix-site-id': HEADLESS_SITE_ID, 'Content-Type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`Wix API ${method} ${path} failed (${response.status}): ${JSON.stringify(data).slice(0, 500)}`);
  return data;
}

async function query(collectionId, id) {
  return (await api(`/wix-data/v2/items/${encodeURIComponent(id)}?dataCollectionId=${encodeURIComponent(collectionId)}&consistentRead=true`)).dataItem;
}

async function saveAndPublish(collectionId, id, data) {
  const saved = await api('/wix-data/v2/items/save', { method: 'POST', body: { dataCollectionId: collectionId, dataItem: { id, data: { ...data, _publishStatus: 'PUBLISHED' } }, publishPluginOptions: { includeDraftItems: true } } });
  const draft = await query(`${collectionId}__drafts`, id).catch(() => undefined);
  if (draft) await api('/wix-data/v2/items/publish-draft', { method: 'POST', body: { dataCollectionId: collectionId, dataItemId: id } });
  return saved.dataItem;
}

async function upload(path) {
  const fileName = basename(path);
  const listed = await api('/site-media/v1/files?mediaTypes=DOCUMENT&sort.fieldName=updatedDate&sort.order=DESC&paging.limit=100').catch(() => ({}));
  const existing = listed.files?.find(file => file.displayName === fileName && file.operationStatus !== 'FAILED');
  if (existing?.url) return existing;
  const ticket = await api('/site-media/v1/files/generate-upload-url', { method: 'POST', body: { mimeType: 'application/pdf', fileName, filePath: '/pan-african-fabric/press', private: false } });
  const response = await fetch(ticket.uploadUrl, { method: 'PUT', headers: { 'Content-Type': 'application/pdf' }, body: await readFile(path), signal: AbortSignal.timeout(120_000), redirect: 'error' });
  const uploaded = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`Wix document upload failed (${response.status}).`);
  const file = uploaded.file ?? uploaded;
  assert.ok(file.id && file.url, `Wix returned no document URL for ${fileName}.`);
  return file;
}

const completed = [];
for (const document of documents) {
  const file = await upload(document.path);
  assert.match(file.url, /^https:\/\//, `Wix returned a non-public document URL for ${basename(document.path)}.`);
  const size = (await stat(document.path)).size;
  const fileSizeLabel = `${(size / 1_048_576).toFixed(1)} MB`;
  await saveAndPublish('MediaAssets', document.mediaId, { title: document.title, slug: document.mediaId, filename: basename(document.path), assetType: 'document', document: file.url, location: 'Wix Media Manager', usagePermission: 'download-approved', usageTerms: 'Approved by the project collaborator for public download on 2026-09-14.', downloadAllowed: true, downloadLabel: 'Download PDF', fileSizeLabel, version: 'September 2026' });
  const current = await query('PressItems', document.pressId);
  assert.ok(current?.data, `Missing PressItems/${document.pressId}.`);
  await saveAndPublish('PressItems', document.pressId, { ...current.data, externalUrl: file.url, asset: document.mediaId, downloadAllowed: true, fileSizeLabel });
  completed.push({ pressId: document.pressId, mediaId: document.mediaId, url: file.url, fileSizeLabel });
}
console.log(JSON.stringify({ siteId: HEADLESS_SITE_ID, completed }, null, 2));
