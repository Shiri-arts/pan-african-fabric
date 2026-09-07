// Node-only imports make accidental browser bundling fail; never import this from a React island.
import { isMainThread } from 'node:worker_threads';
import { assertNewSite, collections } from './manifest.mjs';

export { PUBLICATION_STATE, getPublicContent } from '../../src/lib/public-content.mjs';
const knownIds = new Set(collections.map(value => value.id));
const assertCollection = id => { if (!knownIds.has(id)) throw new Error('Unknown editorial collection.'); };

/** The Phase 1 public contract intentionally performs no private CMS query. */

/** Administrative tooling only. This must never be exposed through a public endpoint. */
export function createPrivateCmsClient({ siteId, token, fetchImpl = fetch }) {
  if (typeof window !== 'undefined' || !isMainThread) throw new Error('Administrative CMS client requires the server process.');
  assertNewSite(siteId);
  if (typeof token !== 'string' || !token.trim()) throw new Error('A site-scoped administrative token is required.');
  async function request(path, { method = 'GET', body } = {}) {
    // Fixed host/path set prevents token exfiltration through caller-provided URLs or redirects.
    if (!/^\/wix-data\/v2\/(?:collections(?:\/[A-Za-z-]+)?|items\/query)(?:\?consistentRead=true)?$/.test(path)) throw new Error('Unsupported CMS operation.');
    let response;
    try {
      response = await fetchImpl(`https://www.wixapis.com${path}`, {
        method, redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(15000),
        headers: { Authorization: `Bearer ${token.trim()}`, 'wix-site-id': siteId, 'Content-Type': 'application/json' },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
    } catch { throw new Error('Private CMS request failed; no content returned.'); }
    // Do not expose upstream response bodies, which can contain private content or tokens.
    if (!response.ok) { const error = new Error(`Private CMS request failed (${response.status}).`); error.status = response.status; throw error; }
    try { return await response.json(); } catch { throw new Error('Private CMS returned an invalid response.'); }
  }
  return Object.freeze({
    request,
    async queryPrivate(collectionId) {
      assertCollection(collectionId);
      const result = await request('/wix-data/v2/items/query', { method: 'POST', body: { dataCollectionId: collectionId, query: { paging: { limit: 1 } }, consistentRead: true } });
      if (!Array.isArray(result.dataItems)) throw new Error('Private CMS returned an invalid item list.');
      return result.dataItems;
    },
  });
}
