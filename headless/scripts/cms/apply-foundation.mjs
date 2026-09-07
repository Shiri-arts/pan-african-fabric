import { pathToFileURL } from 'node:url';
import { assertNewSite, assertPrivateCollection, collections, creationPlan } from './manifest.mjs';
import { createPrivateCmsClient } from './content.server.mjs';

/** Resume safely after an interrupted create; never overwrites existing fields or permissions. */
export async function applyFoundation(client) {
  const read = id => client.request(`/wix-data/v2/collections/${id}?consistentRead=true`);
  const existing = new Map();
  for (const expected of collections) {
    try {
      const result = await read(expected.id);
      // For an existing shell, validate every known field before adding missing references.
      assertPrivateCollection(result.collection, { ...expected, fields: expected.fields.filter(wanted => !wanted.typeMetadata || result.collection?.fields?.some(actual => actual.key === wanted.key)) });
      existing.set(expected.id, result.collection);
    } catch (error) { if (error.status !== 404) throw error; }
  }
  for (const operation of creationPlan()) {
    const id = operation.body.collection?.id ?? operation.body.dataCollectionId;
    const current = operation.body.field ? (await read(id)).collection : existing.get(id);
    if (operation.body.collection && current) continue;
    if (operation.body.field && current?.fields?.some(value => value.key === operation.body.field.key)) continue;
    await client.request(operation.path, operation);
  }
  const verified = [];
  for (const expected of collections) {
    const result = await read(expected.id);
    assertPrivateCollection(result.collection, expected);
    const items = await client.queryPrivate(expected.id);
    if (items.length) throw new Error(`Unexpected existing items in ${expected.id}; Phase 1 does not populate or publish content.`);
    verified.push({ id: expected.id, fields: expected.fields.length, permissions: result.collection.permissions, itemCount: 0 });
  }
  return { status: 'verified-private-foundation', collections: verified };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const args = process.argv.slice(2);
    if (args.length === 0 || (args.length === 1 && args[0] === '--dry-run')) {
      console.log(JSON.stringify({ mode: 'dry-run', mutations: creationPlan(), items: [], publication: 'disabled' }, null, 2));
    } else {
      if (args.length !== 3 || args[0] !== '--apply' || args[1] !== '--site') throw new Error('Usage: node apply-foundation.mjs [--dry-run | --apply --site NEW_SITE_ID]');
      const siteId = args[2];
      assertNewSite(siteId);
      const client = createPrivateCmsClient({ siteId, token: process.env.WIX_CMS_ADMIN_TOKEN });
      console.log(JSON.stringify(await applyFoundation(client), null, 2));
    }
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
