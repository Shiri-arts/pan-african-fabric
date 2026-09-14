import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { HEADLESS_SITE_ID } from './manifest.mjs';

const contacts = [
  { id: 'contact-media-email', emailAddress: 'info@shiriachuart.com' },
  { id: 'contact-media-phone', phoneNumber: '+1 240 696 9297' },
  { id: 'contact-reception-phone', phoneNumber: '240 234 1979' },
];
const cli = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const tokenResult = spawnSync(cli, ['wix', 'token', '--site', HEADLESS_SITE_ID], { cwd: fileURLToPath(new URL('../..', import.meta.url)), encoding: 'utf8', windowsHide: true, shell: process.platform === 'win32' });
assert.equal(tokenResult.status, 0, tokenResult.stderr || 'Wix authentication failed.');
const token = tokenResult.stdout.trim();
async function api(path, { method = 'GET', body } = {}) {
  const response = await fetch(`https://www.wixapis.com${path}`, { method, redirect: 'error', signal: AbortSignal.timeout(45_000), headers: { Authorization: `Bearer ${token}`, 'wix-site-id': HEADLESS_SITE_ID, 'Content-Type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`Wix API failed (${response.status}): ${JSON.stringify(data).slice(0, 300)}`);
  return data;
}
for (const contact of contacts) {
  const current = (await api(`/wix-data/v2/items/${contact.id}?dataCollectionId=ContactChannels&consistentRead=true`)).dataItem;
  assert.ok(current?.data, `Missing approved contact ${contact.id}.`);
  await api('/wix-data/v2/items/save', { method: 'POST', body: { dataCollectionId: 'ContactChannels', dataItem: { id: contact.id, data: { ...current.data, ...(contact.emailAddress ? { emailAddress: contact.emailAddress } : { phoneNumber: contact.phoneNumber }), description: undefined, publicUseVerified: true, isEnabled: true, _publishStatus: 'PUBLISHED' } }, publishPluginOptions: { includeDraftItems: true } } });
  const draft = await api(`/wix-data/v2/items/${contact.id}?dataCollectionId=ContactChannels__drafts&consistentRead=true`).catch(() => undefined);
  if (draft?.dataItem) await api('/wix-data/v2/items/publish-draft', { method: 'POST', body: { dataCollectionId: 'ContactChannels', dataItemId: contact.id } });
}
console.log(JSON.stringify({ siteId: HEADLESS_SITE_ID, updated: contacts.map(value => value.id) }, null, 2));
