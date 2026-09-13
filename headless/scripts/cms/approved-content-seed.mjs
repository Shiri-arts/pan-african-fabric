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
export const SOURCE_TRUTH_VERSION = 'source-truth-2026-09-13';

export const existingPublishedDependencies = Object.freeze([
  Object.freeze({ collectionId: 'MediaAssets', id: 'media-home-hero-pan-african-fan' }),
  Object.freeze({ collectionId: 'MediaAssets', id: 'media-founder-shiri-achu' }),
]);

const record = (collectionId, id, approvalSource, data) => Object.freeze({
  collectionId,
  id,
  classification: 'approved-client-supplied',
  approvalSource,
  data: Object.freeze({ sourceVersion: SOURCE_VERSION, ...data }),
});

const sourceTruthRecord = (collectionId, id, source, data) => record(
  collectionId,
  id,
  `${source}; user authorized unambiguous draft CMS population on 2026-09-13.`,
  { ...data, sourceVersion: SOURCE_TRUTH_VERSION },
);

const richText = text => ({
  nodes: [{
    type: 'PARAGRAPH',
    nodes: [{ type: 'TEXT', textData: { text, decorations: [] } }],
    paragraphData: { textStyle: { textAlignment: 'AUTO' } },
  }],
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

const regions = [
  ['region-north-africa', 'North Africa', 'north-africa'],
  ['region-east-africa', 'East Africa', 'east-africa'],
  ['region-southern-africa', 'Southern Africa', 'southern-africa'],
  ['region-west-africa', 'West Africa', 'west-africa'],
  ['region-central-africa', 'Central Africa', 'central-africa'],
];

const regionRecords = regions.map(([id, name, regionKey], index) => sourceTruthRecord(
  'Regions',
  id,
  'The_Pan_African_Fabric_Official_Press_ _Media_Guide_1.pdf, page 7',
  {
    title: name,
    slug: regionKey,
    regionKey,
    name,
    displayOrder: index + 1,
  },
));

const designers = [
  ['designer-muks-couture', 'Muks’ Couture'],
  ['designer-diana-melissa-ngoumape', 'Diana-Melissa Ngoumape'],
  ['designer-moja-design-studio', 'MOJA Design Studio'],
  ['designer-yyasmina-star', 'YYASMINA STAR'],
  ['designer-afua-sam', 'Afua Sam'],
  ['designer-amos-onyango', 'Amos Onyango'],
  ['designer-naima-el-messaoudi', 'Naima El Messaoudi'],
  ['designer-goodys-stitches', 'Goody’s Stitches'],
  ['designer-fatima-barnes', 'Fatima Barnes'],
];

const designerRecords = designers.map(([id, displayName], index) => sourceTruthRecord(
  'Designers',
  id,
  'The_Pan_African_Fabric_Official_Press_ _Media_Guide_1.pdf, page 14',
  {
    title: displayName,
    slug: id.replace(/^designer-/, ''),
    displayName,
    displayOrder: index + 1,
  },
));

const sourceMedia = [
  ['media-source-colour-chart', 'Colour chart', 'source-colour-chart', 'COLOUR CHAT2.png', 'A chart of twelve colour names arranged in a three-column grid.', '3/4', 1086, 1448, 'https://static.wixstatic.com/media/9b8a9d_6d280db7b36b4450b6d5a4d50d504e35~mv2.png'],
  ['media-source-symbols-and-meanings', 'Symbols and meanings', 'source-symbols-and-meanings', 'Symbols and meanings.jpg', 'A table of African symbols and their supplied meanings.', '4/5', 7200, 8821, 'https://static.wixstatic.com/media/9b8a9d_a519e45ee0a54b698ff9b149aadaf4a52~mv2.jpg'],
  ['media-source-africa-to-the-world', 'Africa to the World', 'source-africa-to-the-world', '67329f2b-6d3a-4a7b-a34c-8f68e30d4183.jpg', 'Africa to the World promotional artwork featuring Muks\u2019 Couture and The Pan-African Fabric.', '5/4', 571, 800, 'https://static.wixstatic.com/media/9b8a9d_f80cd134100f4270ad34c03b9f82e994~mv2.jpg'],
  ['media-source-poem-lltaos', 'Long Live the Art of Service (LLTAOS)', 'source-poem-lltaos', 'POEM10 GB..jpg', 'Poem artwork titled \u201cLong Live the Art of Service (LLTAOS)\u201d.', '1/1', 4000, 4000, 'https://static.wixstatic.com/media/9b8a9d_aba8cf9a77704fc28ed4f40aa459bf79~mv2.jpg'],
  ['media-source-poem-inked-concentrations', 'Inked Concentrations.', 'source-poem-inked-concentrations', 'POEM3_GB.jpg', 'Poem artwork titled \u201cInked Concentrations.\u201d', '1/1', 4000, 4000, 'https://static.wixstatic.com/media/9b8a9d_4c65958581c04c868790e0f952ed9b76~mv2.jpg'],
  ['media-source-poem-frames-of-fabrics', 'Frames of Fabrics.', 'source-poem-frames-of-fabrics', 'POEM4_GB.jpg', 'Poem artwork titled \u201cFrames of Fabrics.\u201d', '1/1', 4000, 4000, 'https://static.wixstatic.com/media/9b8a9d_19bca1ee27b34349a3aa1f2023850b9c~mv2.jpg'],
  ['media-source-poem-teeming-bazaar', 'Sketching A Teeming Bazaar of Drawings', 'source-poem-teeming-bazaar', 'POEM5_GB.jpg', 'Poem artwork titled \u201cSketching A Teeming Bazaar of Drawings\u201d.', '1/1', 4000, 4000, 'https://static.wixstatic.com/media/9b8a9d_ad5e60ea64b74208a57adc7920cf3d07~mv2.jpg'],
  ['media-source-poem-same-sight-different-lenses', 'Same Sight / Different Lenses: The Diversity of a United Universe', 'source-poem-same-sight-different-lenses', 'POEM6_GB.jpg', 'Poem artwork titled \u201cSame Sight / Different Lenses: The Diversity of a United Universe\u201d.', '1/1', 4000, 4000, 'https://static.wixstatic.com/media/9b8a9d_fcaf2741789547f5852a6371c4b88f99~mv2.jpg'],
  ['media-source-poem-little-hands', 'Of Little hands, soft strokes and silk outlines', 'source-poem-little-hands', 'POEM7_GB.jpg', 'Poem artwork titled \u201cOf Little hands, soft strokes and silk outlines\u201d.', '1/1', 4000, 4000, 'https://static.wixstatic.com/media/9b8a9d_db59103a0b244344a734e74f7720a7bd~mv2.jpg'],
  ['media-source-poem-textile-certificates', 'Textile Certificates: A Proud Bevy of Symbologists.', 'source-poem-textile-certificates', 'POEM9_GB5.jpg', 'Poem artwork titled \u201cTextile Certificates: A Proud Bevy of Symbologists.\u201d', '1/1', 4000, 4000, 'https://static.wixstatic.com/media/9b8a9d_b5d3363c624e4453a44bb0cb65957bcb~mv2.jpg'],
];

const sourceMediaRecords = sourceMedia.map(([id, title, slug, filename, alt, ratio, width, height, image], index) => sourceTruthRecord(
  'MediaAssets',
  id,
  `Source asset ${filename}`,
  {
    title, slug, filename, assetType: 'image', alt, ratio, focalPosition: '50% 50%',
    image, width, height, decorative: false, usagePermission: 'review-only',
    downloadAllowed: false, version: '1', displayOrder: index + 1,
  },
));

export const seedRecords = Object.freeze([
  sourceTruthRecord('Editions', 'edition-one', 'The_Pan_African_Fabric_Official_Press_ _Media_Guide_1.pdf, pages 12–13', {
    title: 'Edition One',
    slug: 'edition-one',
    colourNarrative: richText("The fabric's distinctive color palette has its origins in Long Live the Art of Service (LLTAOS), a creative initiative developed by Shiri Achu throughout 2023 that explored twelve colors as symbols of service, purpose, and human values. These colors later became the foundation of The Pan-African Fabric, where color, symbolism, and storytelling came together to create a contemporary textile celebrating African unity."),
    creativeProcess: richText("Fashion designers representing each participating country have interpreted The Pan-African Fabric through their own unique cultural perspective, creative vision, and craftsmanship. Together, these original fashion interpretations celebrate the individuality of each nation while revealing the unity woven throughout the continent."),
    displayOrder: 1,
  }),
  ...regionRecords,
  ...designerRecords,
  ...sourceMediaRecords,
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
