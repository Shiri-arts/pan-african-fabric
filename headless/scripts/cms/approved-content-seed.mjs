/**
 * Allowlisted, client-approved CMS seed data.
 *
 * This module contains data only. Importing it never authenticates, performs a
 * network request, uploads media, or writes to Wix. Records use stable IDs so a
 * later draft migration can be safely repeated.
 */

export const HEADLESS_SITE_ID = '6dabfd00-04c6-4f6f-8282-fb56b240c160';
export const FORBIDDEN_EDITOR_SITE_ID = 'cf6dc8aa-2320-4c66-b52e-44252adf69f3';
export const SOURCE_VERSION = 'client-approved-content-2026-09-09';

export const existingPublishedDependencies = Object.freeze([
  Object.freeze({ collectionId: 'MediaAssets', id: 'media-home-hero-pan-african-fan' }),
  Object.freeze({ collectionId: 'MediaAssets', id: 'media-founder-shiri-achu' }),
]);

const record = (collectionId, id, approvalSource, data) => Object.freeze({
  collectionId,
  id,
  classification: 'approved-client-supplied',
  approvalSource,
  data: Object.freeze({ ...data, sourceVersion: SOURCE_VERSION }),
});

const pages = [
  ['page-home', 'Home', 'home', '/', 'Home', 0],
  ['page-about', 'About', 'about', '/about', 'About', 1],
  ['page-edition-one', 'Edition One', 'edition-one', '/edition-one', 'Edition One', 2],
  ['page-events', 'Events', 'events', '/events', 'Events', 3],
  ['page-stories', 'Stories', 'stories', '/stories', 'Stories', 4],
  ['page-shop', 'Shop', 'shop', '/shop', 'Shop', 5],
  ['page-press-contact', 'Press & Contact', 'press-contact', '/press-contact', 'Press & Contact', 6],
  ['page-partner-with-us', 'Partner With Us', 'partner-with-us', '/partner-with-us', 'Partner With Us', 7],
];

const pageRecords = pages.map(([id, title, pageKey, path, navigationLabel, displayOrder]) => record(
  'Pages',
  id,
  'Client-supplied revised website navigation guide; home identity/tagline approved in the project brief.',
  {
    title,
    slug: pageKey,
    pageKey,
    path,
    navigationLabel,
    navigationVisible: path !== '/',
    navigationOrder: displayOrder,
    footerNavigationVisible: path !== '/',
    footerNavigationOrder: displayOrder,
    footerNavigationLabel: navigationLabel,
    navigationHighlighted: path === '/partner-with-us',
    heroTitle: path === '/' ? 'The Pan-African Fabric' : title,
    ...(path === '/' ? {
      heroTagline: 'One Fabric. Many African Stories.',
      heroAsset: 'media-home-hero-pan-african-fan',
    } : {}),
    displayOrder,
  },
));

const countries = [
  ['country-cameroon-edition-one', 'Cameroon', 'cameroon'],
  ['country-kenya-edition-one', 'Kenya', 'kenya'],
  ['country-south-africa-edition-one', 'South Africa', 'south-africa'],
  ['country-ghana-edition-one', 'Ghana', 'ghana'],
  ['country-morocco-edition-one', 'Morocco', 'morocco'],
  ['country-central-african-republic-edition-one', 'Central African Republic', 'central-african-republic'],
  ['country-ethiopia-edition-one', 'Ethiopia', 'ethiopia'],
  ['country-egypt-edition-one', 'Egypt', 'egypt'],
  ['country-nigeria-edition-one', 'Nigeria', 'nigeria'],
];

const countryRecords = countries.map(([id, countryName, slug]) => record(
  'Countries',
  id,
  'Client-supplied country/colour artwork and Edition One navigation decision.',
  {
    title: countryName,
    slug,
    countryName,
    edition: 'edition-one',
  },
));

const colours = [
  ['dark-green', 'Dark green', 'country-cameroon-edition-one'],
  ['red', 'Red', 'country-kenya-edition-one'],
  ['yellow', 'Yellow', 'country-south-africa-edition-one'],
  ['pink', 'Pink', 'country-ghana-edition-one'],
  ['black', 'Black', 'country-morocco-edition-one'],
  ['white', 'White', 'country-central-african-republic-edition-one'],
  ['blue', 'Blue', 'country-cameroon-edition-one'],
  ['mint-green', 'Mint green', 'country-ethiopia-edition-one'],
  ['orange', 'Orange', 'country-egypt-edition-one'],
  ['hot-pink', 'Hot pink', 'country-nigeria-edition-one'],
  ['purple', 'Purple', 'country-ghana-edition-one'],
  ['green', 'Green', 'country-south-africa-edition-one'],
];

const colourRecords = colours.map(([slug, colourName, country], index) => record(
  'EditionColours',
  `edition-one-colour-${String(index + 1).padStart(2, '0')}-${slug}`,
  'Client-supplied COLOURS AND COUNTRY.png; names, order and country assignments only.',
  {
    title: `${colourName} — ${countryRecords.find(item => item.id === country)?.data.countryName}`,
    slug: `edition-one-${slug}`,
    colourName,
    sourcePosition: index + 1,
    edition: 'edition-one',
    country,
    displayOrder: index + 1,
  },
));

export const seedRecords = Object.freeze([
  record('Editions', 'edition-one', 'Client-supplied revised website navigation guide.', {
    title: 'Edition One',
    slug: 'edition-one',
    displayOrder: 1,
  }),
  ...pageRecords,
  ...countryRecords,
  ...colourRecords,
  record('Events', 'event-inaugural-pan-african-fabric-fashion-showcase', 'Exact event details supplied by the client; timezone subsequently confirmed as US Eastern time.', {
    title: 'The Inaugural Pan-African Fabric & Fashion Showcase',
    slug: 'inaugural-pan-african-fabric-fashion-showcase',
    eventType: 'showcase',
    dateLabel: 'Saturday, September 26, 2026',
    timeLabel: '1:00 PM–5:00 PM',
    timezoneLabel: 'ET',
    startsAt: '2026-09-26T13:00:00-04:00',
    endsAt: '2026-09-26T17:00:00-04:00',
    venue: 'Smithsonian National Museum of African Art',
    location: 'Washington, D.C.',
    isConfirmed: true,
    featured: true,
    edition: 'edition-one',
    displayOrder: 1,
  }),
  record('PageSections', 'section-about-founder', 'Existing approved founder-media relationship; no biography or credit is added.', {
    title: 'Founder',
    slug: 'about-founder',
    sectionKey: 'founder',
    sectionType: 'media',
    page: 'page-about',
    mediaAsset: 'media-founder-shiri-achu',
    isEnabled: true,
    displayOrder: 4,
  }),
  record('SiteSettings', 'site-settings-primary', 'Approved project identity and tagline.', {
    title: 'Primary site settings',
    slug: 'primary',
    siteName: 'The Pan-African Fabric',
    headerIdentity: 'The Pan-African Fabric',
    tagline: 'One Fabric. Many African Stories.',
    primaryEdition: 'edition-one',
    displayOrder: 1,
  }),
]);

export const seedCollections = Object.freeze([...new Set(seedRecords.map(item => item.collectionId))]);

export function assertAllowedSite(siteId) {
  if (siteId === FORBIDDEN_EDITOR_SITE_ID) {
    throw new Error('The existing Wix Editor site is explicitly forbidden.');
  }
  if (siteId !== HEADLESS_SITE_ID) {
    throw new Error(`Draft seed is restricted to Headless site ${HEADLESS_SITE_ID}.`);
  }
}

export function validateSeedManifest(records = seedRecords) {
  const identities = new Set();
  for (const item of records) {
    if (item.classification !== 'approved-client-supplied') {
      throw new Error(`${item.collectionId}/${item.id} is not approved for the seed.`);
    }
    const identity = `${item.collectionId}/${item.id}`;
    if (identities.has(identity)) throw new Error(`Duplicate seed identity: ${identity}`);
    identities.add(identity);
    if (!item.approvalSource?.trim()) throw new Error(`Missing approval source: ${identity}`);
    if (item.data._publishStatus !== undefined) throw new Error(`Publication state must be controlled by the migration runner: ${identity}`);
    if (Object.values(item.data).some(value => value === undefined)) throw new Error(`Undefined seed value: ${identity}`);
  }
  return true;
}

validateSeedManifest();
