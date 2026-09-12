import test from 'node:test';
import assert from 'node:assert/strict';
import { PUBLIC_COLLECTION_IDS, assertPublicCollection, colourContrast, createCmsContentAccess, mapMedia, safePublicUrl } from '../../src/lib/cms-content.ts';

const record = (_id, values = {}) => ({ _id, title: _id, slug: _id, displayOrder: 1, ...values });

function fixtureSource(seed = {}) {
  const calls = [];
  const source = {
    async query(collectionId, query) {
      calls.push({ kind: 'query', collectionId, query });
      let values = [...(seed[collectionId] ?? [])];
      for (const [field, expected] of Object.entries(query.filters ?? {})) {
        values = values.filter(item => {
          const actual = item[field];
          const id = typeof actual === 'object' && actual ? actual._id ?? actual.id : actual;
          return id === expected;
        });
      }
      for (const sort of [...query.sort].reverse()) values.sort((a, b) => {
        const left = a[sort.field] ?? ''; const right = b[sort.field] ?? '';
        const result = left < right ? -1 : left > right ? 1 : 0;
        return sort.direction === 'asc' ? result : -result;
      });
      return values.slice(0, query.limit);
    },
    async get(collectionId, itemId) {
      calls.push({ kind: 'get', collectionId, itemId });
      return (seed[collectionId] ?? []).find(item => item._id === itemId);
    },
  };
  return { source, calls };
}

test('collection and URL guards fail closed', () => {
  for (const id of PUBLIC_COLLECTION_IDS) assert.doesNotThrow(() => assertPublicCollection(id));
  assert.throws(() => assertPublicCollection('Pages__drafts'), /Unsupported/);
  assert.throws(() => assertPublicCollection('WixForms'), /Unsupported/);
  assert.equal(safePublicUrl('/about', { allowRelative: true }), '/about');
  assert.equal(safePublicUrl('//attacker.test', { allowRelative: true }), undefined);
  assert.equal(safePublicUrl('javascript:alert(1)', { allowRelative: true }), undefined);
  assert.equal(safePublicUrl('http://example.com'), undefined);
  assert.equal(safePublicUrl('https://example.com/path'), 'https://example.com/path');
});

test('page, section and media reads use published base collections and preserve the existing media API', async () => {
  const { source, calls } = fixtureSource({
    Pages: [record('page-home', { pageKey: 'home', path: '/', heroAsset: 'media-hero' })],
    PageSections: [record('section-intro', { page: 'page-home', sectionKey: 'intro', isEnabled: true, heading: 'Introduction', mediaAsset: 'media-intro' })],
    MediaAssets: [
      record('media-hero', { image: 'https://static.wixstatic.com/media/hero', width: 1200, height: 800, usagePermission: 'web-display-approved', alt: 'Approved hero' }),
      record('media-intro', { image: 'wix:image://v1/intro/file.jpg', width: 600, height: 800, usagePermission: 'download-approved', alt: 'Approved introduction' }),
    ],
  });
  const cms = createCmsContentAccess(source, (uri, width, height) => `scaled:${uri}:${width}x${height}`);
  assert.equal((await cms.getPageByKey('home'))?.path, '/');
  assert.equal((await cms.getPageSections('home'))[0]?.heading, 'Introduction');
  assert.equal((await cms.getPageHeroMedia('home'))?.desktop?.src, 'https://static.wixstatic.com/media/hero');
  assert.equal((await cms.getPageSectionMedia('home', 'intro'))?.desktop?.src, 'scaled:wix:image://v1/intro/file.jpg:600x800');
  assert.equal(await cms.getPageByKey('../Pages__drafts'), undefined);
  assert.ok(calls.every(call => PUBLIC_COLLECTION_IDS.includes(call.collectionId)));
  assert.ok(calls.every(call => !call.collectionId.endsWith('__drafts')));
  assert.ok(calls.filter(call => call.kind === 'query').every(call => call.query.limit >= 1 && call.query.limit <= 100));
});

test('media rights, alt text and source validation prevent unsafe images', () => {
  const scale = value => value;
  assert.equal(mapMedia(record('m1', { image: 'https://example.com/a.jpg', usagePermission: 'review-only', alt: 'A' }), scale), undefined);
  assert.equal(mapMedia(record('m2', { image: 'https://example.com/a.jpg', usagePermission: 'web-display-approved' }), scale), undefined);
  assert.equal(mapMedia(record('m3', { image: 'javascript:alert(1)', usagePermission: 'web-display-approved', alt: 'A' }), scale), undefined);
  assert.ok(mapMedia(record('m4', { image: 'https://example.com/a.jpg', usagePermission: 'web-display-approved', decorative: true }), scale));
});

test('rich content rejects executable nodes and unsafe links', async () => {
  const { source } = fixtureSource({ Pages: [
    record('safe', { pageKey: 'safe', path: '/safe', introduction: '<p>Safe</p>' }),
    record('unsafe-node', { pageKey: 'unsafe-node', path: '/unsafe-node', introduction: '<script>alert(1)</script>' }),
    record('unsafe-link', { pageKey: 'unsafe-link', path: '/unsafe-link', introduction: '<a href="javascript:alert(1)">Unsafe</a>' }),
  ] });
  const cms = createCmsContentAccess(source, value => value);
  assert.ok((await cms.getPageByKey('safe'))?.introduction);
  assert.equal((await cms.getPageByKey('unsafe-node'))?.introduction, undefined);
  assert.equal((await cms.getPageByKey('unsafe-link'))?.introduction, undefined);
});

test('domain readers validate records, references, dates, colours and public contact state', async () => {
  const now = new Date('2026-01-01T00:00:00Z');
  const { source } = fixtureSource({
    SiteSettings: [record('settings', { siteName: 'Fabric', canonicalOrigin: 'https://example.com', primaryEdition: 'edition-one' })],
    Editions: [record('edition-one', { year: 2026, relatedEvents: [{ _id: 'event-future' }] })],
    Regions: [record('west', { regionKey: 'west-africa', name: 'West Africa' })],
    Countries: [record('ghana', { slug: 'ghana', countryName: 'Ghana', edition: 'edition-one', region: 'west' })],
    EditionColours: [
      record('pink', { colourName: 'Pink', hexValue: '#E5A09B', textHex: '#24211e', sourcePosition: 4, edition: 'edition-one', country: 'ghana' }),
      record('bad', { colourName: 'Bad', hexValue: 'pink' }),
      record('low-contrast', { colourName: 'Low contrast', hexValue: '#ffffff', textHex: '#eeeeee', edition: 'edition-one', country: 'ghana' }),
    ],
    Symbols: [record('symbol', { approvedName: 'Approved name', publicSourceUrl: 'https://example.com/source' })],
    Designers: [record('designer', { slug: 'designer', displayName: 'Designer', professionalUrl: 'javascript:alert(1)' })],
    Participations: [record('participation', { edition: 'edition-one', country: 'ghana', designer: 'designer', isPrincipal: true })],
    Garments: [record('garment', { edition: 'edition-one', country: 'ghana', galleryAssets: ['media-a'] })],
    Events: [record('event-old', { slug: 'old', startsAt: '2025-01-01T00:00:00Z', isConfirmed: true }), record('event-future', { slug: 'future', startsAt: '2026-09-26T17:00:00Z', isConfirmed: true })],
    Stories: [record('story', { slug: 'story', headline: 'Story', publishedDate: '2026-02-01T00:00:00Z' })],
    PressItems: [record('press', { headline: 'Press', externalUrl: 'https://example.com/press' })],
    PartnershipOptions: [record('partner', { label: 'Museums', isEnabled: true })],
    ContactChannels: [record('public-email', { channelKey: 'media', label: 'Media', emailAddress: 'media@example.com', publicUseVerified: true, isEnabled: true }), record('private-email', { channelKey: 'private', label: 'Private', emailAddress: 'private@example.com', publicUseVerified: false, isEnabled: true })],
    ShopItems: [record('shop', { slug: 'shop', commerceEnabled: false, relatedStories: ['story'] })],
  });
  const cms = createCmsContentAccess(source, value => value);
  assert.equal((await cms.getSiteSettings())?.primaryEditionId, 'edition-one');
  assert.equal((await cms.getPrimaryEdition())?.year, 2026);
  assert.equal((await cms.getRegions()).length, 1);
  assert.equal((await cms.getEditionCountries('edition-one'))[0]?.countryName, 'Ghana');
  assert.equal((await cms.getCountryBySlug('ghana'))?.regionId, 'west');
  assert.equal((await cms.getEditionColours('edition-one')).length, 1);
  assert.equal((await cms.getSymbols()).length, 1);
  assert.equal((await cms.getDesignerBySlug('designer'))?.professionalUrl, undefined);
  assert.equal((await cms.getParticipations({ countryId: 'ghana' }))[0]?.designerId, 'designer');
  assert.deepEqual((await cms.getGarments({ editionId: 'edition-one' }))[0]?.galleryAssetIds, ['media-a']);
  assert.deepEqual((await cms.getUpcomingEvents(now)).map(event => event.id), ['event-future']);
  assert.equal((await cms.getEventBySlug('future'))?.startsAt, '2026-09-26T17:00:00.000Z');
  assert.equal((await cms.getPublishedStories())[0]?.headline, 'Story');
  assert.equal((await cms.getStoryBySlug('story'))?.id, 'story');
  assert.equal((await cms.getPressItems())[0]?.externalUrl, 'https://example.com/press');
  assert.equal((await cms.getPartnershipOptions())[0]?.label, 'Museums');
  assert.deepEqual((await cms.getContactChannels()).map(channel => channel.id), ['public-email']);
  assert.equal((await cms.getShopItemBySlug('shop'))?.commerceEnabled, false);
  assert.equal((await cms.getShopItems())[0]?.relatedStoryIds[0], 'story');
});

test('colour contrast is measured from the CMS values and unsafe colour pairs fail closed', async () => {
  assert.ok((colourContrast('#E5A09B', '#24211e') ?? 0) >= 4.5);
  assert.equal(colourContrast('#ffffff', '#eeeeee') < 4.5, true);
  assert.equal(colourContrast('pink', '#000000'), undefined);
});

test('query failures and malformed identifiers return safe missing data', async () => {
  const cms = createCmsContentAccess({ query: async () => { throw new Error('private upstream details'); }, get: async () => { throw new Error('private upstream details'); } }, value => value);
  assert.equal(await cms.getSiteSettings(), undefined);
  assert.deepEqual(await cms.getPublishedStories(), []);
  assert.equal(await cms.getMediaById('missing'), undefined);
  assert.equal(await cms.getStoryBySlug('Not A Safe Slug'), undefined);
});

test('navigation configuration preserves an intentional all-hidden menu', async () => {
  const { source } = fixtureSource({ Pages: [
    record('home', { pageKey: 'home', path: '/', navigationVisible: false, footerNavigationVisible: false }),
    record('about', { pageKey: 'about', path: '/about', navigationLabel: 'About', navigationVisible: true, navigationOrder: 2 }),
  ] });
  const cms = createCmsContentAccess(source, value => value);
  const primary = await cms.getPrimaryNavigationState();
  const footer = await cms.getFooterNavigationState();
  assert.equal(primary.configured, true);
  assert.deepEqual(primary.items.map(item => item.href), ['/about']);
  assert.equal(footer.configured, true);
  assert.deepEqual(footer.items, []);
});
