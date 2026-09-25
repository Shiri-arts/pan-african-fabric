import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import {
  FORBIDDEN_EDITOR_SITE_ID,
  HEADLESS_SITE_ID,
  assertAllowedSite,
  existingPublishedDependencies,
  seedRecords,
  validateSeedManifest,
} from './approved-content-seed.mjs';
import { dryRunReport, findSemanticDuplicate, parseArguments, prepareDraftData } from './migrate-approved-content.mjs';

const identity = item => `${item.collectionId}/${item.id}`;
const find = (collectionId, id) => seedRecords.find(item => item.collectionId === collectionId && item.id === id);

test('site allowlist accepts only the separate Headless site', () => {
  assert.doesNotThrow(() => assertAllowedSite(HEADLESS_SITE_ID));
  assert.throws(() => assertAllowedSite(FORBIDDEN_EDITOR_SITE_ID), /forbidden/i);
  assert.throws(() => assertAllowedSite('any-other-site'), /restricted/i);
});

test('manifest has stable unique draft identities and explicit approval evidence', () => {
  assert.equal(validateSeedManifest(), true);
  assert.equal(new Set(seedRecords.map(identity)).size, seedRecords.length);
  assert.ok(seedRecords.every(item => item.classification === 'approved-client-supplied'));
  assert.ok(seedRecords.every(item => item.approvalSource.length > 10));
  assert.ok(seedRecords.every(item => item.data._publishStatus === undefined));
  assert.ok(seedRecords.every(item => item.data.approvedAt === '2026-09-13T00:00:00.000Z'));
});

test('manifest contains exactly the approved country-colour mapping in source order', () => {
  const actual = seedRecords
    .filter(item => item.collectionId === 'EditionColours')
    .sort((left, right) => left.data.sourcePosition - right.data.sourcePosition)
    .map(item => [item.data.colourName, item.data.country]);
  assert.deepEqual(actual, [
    ['Dark green', 'country-cameroon-edition-one'],
    ['Red', 'country-kenya-edition-one'],
    ['Yellow', 'country-south-africa-edition-one'],
    ['Pink', 'country-ghana-edition-one'],
    ['Black', 'country-morocco-edition-one'],
    ['White', 'country-central-african-republic-edition-one'],
    ['Blue', 'country-cameroon-edition-one'],
    ['Mint green', 'country-ethiopia-edition-one'],
    ['Orange', 'country-egypt-edition-one'],
    ['Hot pink', 'country-nigeria-edition-one'],
    ['Purple', 'country-ghana-edition-one'],
    ['Green', 'country-south-africa-edition-one'],
  ]);
  assert.ok(seedRecords.filter(item => item.collectionId === 'EditionColours').every(item => /^#[0-9a-f]{6}$/i.test(item.data.hexValue) && /^#[0-9a-f]{6}$/i.test(item.data.textHex)));
});

test('source-truth regions and designer identities preserve supplied names', () => {
  const regions = seedRecords.filter(item => item.collectionId === 'Regions');
  assert.deepEqual(regions.map(item => item.data.name), [
    'North Africa',
    'East Africa',
    'Southern Africa',
    'West Africa',
    'Central Africa',
  ]);
  assert.ok(regions.every(item => item.data.description === undefined));

  const designers = seedRecords.filter(item => item.collectionId === 'Designers');
  assert.deepEqual(designers.map(item => item.data.displayName), [
    'Muks’ Couture',
    'Diana-Melissa Ngoumape',
    'MOJA Design Studio',
    'YYASMINA STAR',
    'Afua Sam',
    'Amos Onyango',
    'Naima El Messaoudi',
    'Goody’s Stitches',
    'Fatima Barnes',
  ]);
  assert.equal(find('Designers', 'designer-afua-sam').data.studioName, 'Studio D’Maxsi');
  assert.equal(find('Designers', 'designer-amos-onyango').data.studioName, 'LAWY Afrik');
  assert.equal(find('Designers', 'designer-naima-el-messaoudi').data.studioName, 'Caftan Joujou');
});

test('every Edition One country has an approved introduction of at most 100 words', () => {
  const countries = seedRecords.filter(item => item.collectionId === 'Countries');
  assert.equal(countries.length, 9);
  for (const country of countries) {
    const text = country.data.introduction?.nodes?.[0]?.nodes?.[0]?.textData?.text;
    assert.ok(text, `${country.data.countryName} is missing its introduction.`);
    assert.ok(text.trim().split(/\s+/u).length <= 100, `${country.data.countryName} exceeds 100 words.`);
  }
});

test('Edition One includes the authorized source-backed editorial fields', () => {
  const edition = find('Editions', 'edition-one').data;
  assert.match(edition.colourNarrative.nodes[0].nodes[0].textData.text, /^The fabric's distinctive color palette/);
  assert.match(edition.creativeProcess.nodes[0].nodes[0].textData.text, /^Fashion designers representing each participating country/);
  for (const field of ['colourNarrative', 'creativeProcess']) {
    const document = edition[field];
    assert.equal(document.nodes.length, 1);
    assert.equal(document.nodes[0].type, 'PARAGRAPH');
    assert.equal(document.nodes[0].nodes[0].type, 'TEXT');
    assert.deepEqual(document.nodes[0].nodes[0].textData.decorations, []);
    assert.equal(document.nodes[0].paragraphData.textStyle.textAlignment, 'AUTO');
  }
  assert.equal(edition.year, 2025);
  assert.equal(edition.editionStatus, 'current');
  assert.equal(edition.leadLine, 'ONE FABRIC. MANY AFRICAN STORIES.');
  assert.ok(edition.fabricDescription);
});

test('event seed includes supplied programme and overview with confirmed time zone', () => {
  const event = find('Events', 'event-inaugural-pan-african-fabric-fashion-showcase').data;
  assert.equal(event.title, 'The Inaugural Pan-African Fabric & Fashion Showcase');
  assert.equal(event.dateLabel, 'Saturday, September 26, 2026');
  assert.equal(event.timeLabel, '1:00 PM–5:00 PM');
  assert.equal(event.startsAt, '2026-09-26T13:00:00-04:00');
  assert.equal(event.endsAt, '2026-09-26T17:00:00-04:00');
  assert.equal(event.venue, 'Smithsonian National Museum of African Art');
  assert.equal(event.location, 'Washington, D.C.');
  assert.ok(event.overview);
  assert.ok(event.programme);
});

test('menu and media dependencies match the approved decisions', () => {
  const menuPages = seedRecords
    .filter(item => item.collectionId === 'Pages' && item.data.navigationVisible)
    .sort((left, right) => left.data.navigationOrder - right.data.navigationOrder);
  const labels = menuPages.map(item => item.data.navigationLabel);
  assert.deepEqual(labels, ['About', 'Edition One', 'Events', 'Stories', 'Shop', 'Press & Contact', 'Partner With Us']);
  assert.deepEqual(menuPages.map(item => item.data.footerNavigationLabel), labels);
  assert.ok(menuPages.every(item => item.data.footerNavigationVisible));
  assert.deepEqual(menuPages.map(item => item.data.footerNavigationOrder), [1, 2, 3, 4, 5, 6, 7]);
  assert.equal(find('Pages', 'page-partner-with-us').data.navigationHighlighted, true);
  assert.ok(menuPages.filter(item => item.id !== 'page-partner-with-us').every(item => !item.data.navigationHighlighted));
  assert.deepEqual(existingPublishedDependencies, [
    { collectionId: 'MediaAssets', id: 'media-home-hero-pan-african-fan' },
    { collectionId: 'MediaAssets', id: 'media-founder-shiri-achu' },
  ]);
  assert.equal(find('Pages', 'page-home').data.heroAsset, 'media-home-hero-pan-african-fan');
  assert.equal(find('PageSections', 'section-about-founder').data.mediaAsset, 'media-founder-shiri-achu');
});

test('authorized source media is web-display approved with downloads disabled', () => {
  const media = seedRecords.filter(item => item.collectionId === 'MediaAssets' && item.id.startsWith('media-source-'));
  assert.equal(media.length, 43);
  assert.ok(media.every(item => item.data.assetType === 'image'));
  assert.ok(media.every(item => item.data.usagePermission === 'web-display-approved'));
  assert.ok(media.every(item => item.data.downloadAllowed === false));
  assert.ok(media.every(item => item.data.image.startsWith('https://static.wixstatic.com/media/')));
  assert.ok(media.every(item => item.data.width > 0 && item.data.height > 0));
  for (const item of media) {
    assert.equal(item.data.approvedAt, '2026-09-13T00:00:00.000Z');
    for (const omitted of ['copyrightHolder', 'creditLine']) {
      assert.equal(item.data[omitted], undefined);
    }
  }
});

test('draft merge fills blanks, preserves editorial fields and reports conflicts', () => {
  const item = find('Pages', 'page-home');
  const prepared = prepareDraftData(item, { title: 'Home', robots: 'Editor-owned content', sourceVersion: 'existing' }, [
    ...Object.keys(item.data), 'robots',
  ]);
  assert.equal(prepared.data.robots, 'Editor-owned content');
  assert.equal(prepared.data.sourceVersion, 'existing');
  assert.equal(prepared.data._publishStatus, undefined);
  assert.deepEqual(prepared.conflicts, []);

  const conflict = prepareDraftData(item, { title: 'Different title' }, Object.keys(item.data));
  assert.deepEqual(conflict.conflicts, [{ field: 'title', current: 'Different title', proposed: 'Home' }]);
});

test('draft merge treats normalized Wix datetimes as the same instant', () => {
  const item = find('Events', 'event-inaugural-pan-african-fabric-fashion-showcase');
  const prepared = prepareDraftData(item, {
    ...item.data,
    startsAt: '2026-09-26T17:00:00.000Z',
    endsAt: '2026-09-26T21:00:00.000Z',
  }, Object.keys(item.data));
  assert.deepEqual(prepared.conflicts, []);
  assert.equal(prepared.data._publishStatus, undefined);
});

test('draft merge accepts Wix rich-text key normalization', () => {
  const item = find('Editions', 'edition-one');
  const normalized = {
    ...item.data,
    colourNarrative: {
      nodes: item.data.colourNarrative.nodes.map(node => ({
        nodes: node.nodes.map(child => ({ textData: child.textData, type: child.type })),
        paragraphData: node.paragraphData,
        type: node.type,
      })),
    },
  };
  assert.deepEqual(prepareDraftData(item, normalized, Object.keys(item.data)).conflicts, []);
});

test('duplicate preflight detects different IDs with the same CMS identity', () => {
  const designer = find('Designers', 'designer-afua-sam');
  assert.equal(findSemanticDuplicate(designer, [{
    id: 'existing-afua',
    data: { slug: 'different-slug', displayName: 'Afua Sam' },
  }]).id, 'existing-afua');
  assert.equal(findSemanticDuplicate(designer, [{
    id: designer.id,
    data: { slug: designer.data.slug, displayName: designer.data.displayName },
  }]), undefined);

  const page = find('Pages', 'page-events');
  assert.equal(findSemanticDuplicate(page, [{
    id: 'another-events-page',
    data: { slug: 'events' },
  }]).id, 'another-events-page');
});

test('apply requires explicit draft-write confirmation', () => {
  assert.throws(() => parseArguments(['--apply', '--site', HEADLESS_SITE_ID]), /confirm-draft-write/);
  assert.throws(() => parseArguments(['--apply', '--confirm-draft-write']), /explicit --site/);
  assert.throws(() => parseArguments(['--apply', '--dry-run', '--confirm-draft-write', '--site', HEADLESS_SITE_ID]), /mutually exclusive/);
  assert.throws(() => parseArguments(['--site']), /requires an explicit site ID/);
  assert.equal(parseArguments(['--apply', '--confirm-draft-write', `--site=${HEADLESS_SITE_ID}`]).apply, true);
});

test('default command is an offline dry run with zero writes', () => {
  const script = fileURLToPath(new URL('./migrate-approved-content.mjs', import.meta.url));
  const result = spawnSync(process.execPath, [script, '--site', HEADLESS_SITE_ID], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.mode, 'dry-run');
  assert.equal(report.writesPerformed, 0);
  assert.equal(report.publicationOperations, 0);
  assert.equal(report.recordCount, seedRecords.length);
  assert.ok(report.records.every(item => item.draftCollectionId.endsWith('__drafts')));
  assert.ok(report.records.every(item => item.draftData._publishStatus === undefined));
});

test('migration source contains no publishing endpoint or published status', async () => {
  const source = await readFile(new URL('./migrate-approved-content.mjs', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /items\/(?:bulk-)?publish|publish-draft/i);
  assert.doesNotMatch(source, /_publishStatus\s*:\s*['\"]PUBLISHED['\"]/);
  assert.match(source, /includeDraftItems/);
  assert.match(source, /skippedPublished/);
});

test('seed relationships resolve to another seed record or an approved published dependency', () => {
  const identities = new Set(seedRecords.map(identity));
  const dependencies = new Set(existingPublishedDependencies.map(identity));
  const referenceFields = {
    Pages: ['heroAsset'],
    PageSections: ['page', 'mediaAsset'],
    Countries: ['edition'],
    EditionColours: ['edition', 'country'],
    Events: ['edition'],
    SiteSettings: ['primaryEdition'],
  };
  for (const item of seedRecords) {
    for (const field of referenceFields[item.collectionId] ?? []) {
      const target = item.data[field];
      if (!target) continue;
      const targetCollection = field === 'heroAsset' || field === 'mediaAsset'
        ? 'MediaAssets'
        : field === 'page' || field === 'internalPage'
          ? 'Pages'
          : field === 'edition' || field === 'primaryEdition'
            ? 'Editions'
            : 'Countries';
      assert.ok(identities.has(`${targetCollection}/${target}`) || dependencies.has(`${targetCollection}/${target}`), `${identity(item)} has unresolved ${field}: ${target}`);
    }
  }
});

test('seed contains no invented commerce fields', () => {
  const excluded = new Set([
    'price', 'inventory',
  ]);
  for (const item of seedRecords) {
    for (const field of Object.keys(item.data)) {
      assert.equal(excluded.has(field), false, `${identity(item)} unexpectedly seeds ${field}.`);
    }
  }
});

test('dry-run report rejects the Editor site before any operation', () => {
  assert.throws(() => dryRunReport(FORBIDDEN_EDITOR_SITE_ID), /forbidden/i);
});
