import { pathToFileURL } from 'node:url';
import { collections, assertNewSite } from './manifest.mjs';
import { createPrivateCmsClient } from './content.server.mjs';

const target = value => value?.typeMetadata?.reference?.referencedCollectionId
  ?? value?.typeMetadata?.multiReference?.referencedCollectionId
  ?? null;

export async function inspectFoundation(client) {
  const report = [];
  for (const expected of collections) {
    try {
      const { collection: actual } = await client.request(`/wix-data/v2/collections/${expected.id}?consistentRead=true`);
      const actualFields = new Map((actual.fields ?? []).map(value => [value.key, value]));
      report.push({
        id: expected.id,
        permissions: actual.permissions,
        plugins: (actual.plugins ?? []).map(value => value.type),
        missing: expected.fields.filter(value => !actualFields.has(value.key)).map(value => value.key),
        mismatched: expected.fields.flatMap(value => {
          const found = actualFields.get(value.key);
          if (!found || (found.type === value.type && target(found) === target(value))) return [];
          return [{ key: value.key, expectedType: value.type, actualType: found.type, expectedTarget: target(value), actualTarget: target(found) }];
        }),
      });
    } catch (error) {
      report.push({ id: expected.id, error: error.message });
    }
  }
  return report;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const siteIndex = process.argv.indexOf('--site');
    const siteId = siteIndex >= 0 ? process.argv[siteIndex + 1] : undefined;
    assertNewSite(siteId);
    const client = createPrivateCmsClient({ siteId, token: process.env.WIX_CMS_ADMIN_TOKEN });
    console.log(JSON.stringify(await inspectFoundation(client), null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

