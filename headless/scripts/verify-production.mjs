/**
 * Production boundary verification.
 *
 * Walks the built output and then invokes the built worker's fetch entry with the
 * ignored local environment, because the hosting adapter cannot run `astro preview`.
 *
 * Asserts three things:
 *   1. No draft copy, administrative CMS code or managed secret is in the bundle.
 *   2. Approved content really does render in a production response.
 *   3. Unknown slugs and review-only specimens return a real HTTP 404, not a 200.
 */
import { readFile, readdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { parseEnv } from 'node:util';

const root = new URL('../', import.meta.url);
const environment = parseEnv(await readFile(new URL('.env.local', root), 'utf8'));
assert(environment.WIX_CLIENT_SECRET, 'Pull the managed local environment before this check.');

/**
 * Copy that has not been approved for publication. Every string is a verbatim
 * fragment of src/data/review-copy.server.ts or review-fixtures.server.ts.
 * The tagline "One Fabric. Many African Stories." is deliberately absent: the
 * production frontend brief approves it for the hero.
 */
const drafts = [
  'Nine countries. A shared creative conversation.',
  'Created by Shiri Achu, The Pan-African Fabric',
  'Created by Shiri Achu.',
  'Explore the people, symbols and creative interpretations',
  'Nine countries. Five regions. One shared visual language.',
  'The Pan-African Fabric connects artistic practice with cultural exchange',
  'Trace The Pan-African Fabric through public programs',
  'Find approved information, images and resources for coverage',
  'Discover the people and interpretations behind Edition One',
  'Story template specimen',
  'Product template specimen',
  'Muks',
  'Goody',
  'STUDIO D',
  'YYASMINA',
  'Amos Onyango',
  'MOJA Design Studio',
  'Naima El Messaoudi',
  'Ngoumape',
  'Fatima Barnes',
];

/** Client-provided content that must survive into a production response. */
const approvedOnHome = [
  'One Fabric. Many African Stories.',
  'The Inaugural Pan-African Fabric &amp; Fashion Showcase',
  'Saturday, September 26, 2026',
  'Smithsonian National Museum of African Art',
  'Washington, D.C.',
  'Central African Republic',
  'Hot pink',
];

async function walk(url) {
  for (const entry of await readdir(url, { withFileTypes: true })) {
    const child = new URL(entry.name + (entry.isDirectory() ? '/' : ''), url);
    if (entry.isDirectory()) { await walk(child); continue; }
    if (!/\.(m?js|html|json|css)$/.test(entry.name)) continue;
    const content = await readFile(child, 'utf8');
    for (const draft of drafts) assert(!content.includes(draft), `Draft text in ${child.pathname}: ${draft}`);
    assert(!content.includes('WIX_CMS_ADMIN_TOKEN'), `Admin code in ${child.pathname}`);
    assert(!content.includes(environment.WIX_CLIENT_SECRET), `Managed secret in ${child.pathname}`);
  }
}
await walk(new URL('dist/', root));

const { default: worker } = await import(new URL('dist/_worker.js/index.mjs', root));
const origin = 'http://127.0.0.1:4322';

const routes = [
  { path: '/', status: 200 },
  { path: '/about', status: 200 },
  { path: '/edition-one', status: 200 },
  { path: '/edition-one/cameroon', status: 200 },
  { path: '/edition-one/central-african-republic', status: 200 },
  { path: '/events', status: 200 },
  { path: '/events/inaugural-pan-african-fabric-fashion-showcase', status: 200 },
  { path: '/stories', status: 200 },
  { path: '/shop', status: 200 },
  { path: '/press-contact', status: 200 },
  { path: '/partner-with-us', status: 200 },
  // Unknown slugs and review-only specimens must not become HTTP 200 pages.
  { path: '/unknown', status: 404 },
  { path: '/initiative', status: 404 },
  { path: '/edition-one/atlantis', status: 404 },
  { path: '/events/not-a-real-event', status: 404 },
  { path: '/stories/story-template-specimen', status: 404 },
  { path: '/shop/product-template-specimen', status: 404 },
];

const results = [];
for (const { path, status } of routes) {
  const response = await worker.fetch(new Request(origin + path), environment);
  const html = await response.text();
  assert.equal(response.status, status, `${path} expected HTTP ${status}, received ${response.status}`);
  assert(!html.includes(environment.WIX_CLIENT_SECRET), `${path} leaks managed secret`);
  assert(
    response.headers.get('content-security-policy')?.includes("connect-src 'self'"),
    `${path} is missing the same-origin request policy`,
  );
  for (const draft of drafts) assert(!html.includes(draft), `${path} leaks draft copy: ${draft}`);
  assert(html.includes('noindex, nofollow'), `${path} is missing the review robots directive`);
  // A rendered control label, not prose. The pages state truthfully that there is
  // no cart or checkout, so a bare word match would flag the honest sentence.
  assert(
    !/>\s*(add to (cart|bag|basket)|buy now|buy it now|checkout|proceed to checkout|pay now)\s*</i.test(html),
    `${path} exposes a commerce control`,
  );
  assert(!/name=["']?(quantity|variant_id|add-to-cart)/i.test(html), `${path} exposes a commerce form field`);
  assert(!html.includes('Local review build'), `${path} leaks the review banner`);
  results.push({ path, status: response.status });
}

const home = await (await worker.fetch(new Request(origin + '/'), environment)).text();
for (const approvedText of approvedOnHome) {
  assert(home.includes(approvedText), `Home is missing approved content: ${approvedText}`);
}

console.log(JSON.stringify({
  productionBundle: 'no draft copy, admin code or managed secret',
  approvedContentRendered: approvedOnHome.length,
  responses: results,
}, null, 2));
