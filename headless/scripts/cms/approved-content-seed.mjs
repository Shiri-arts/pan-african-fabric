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
export const PUBLICATION_APPROVED_AT = '2026-09-13T00:00:00.000Z';

export const existingPublishedDependencies = Object.freeze([
  Object.freeze({ collectionId: 'MediaAssets', id: 'media-home-hero-pan-african-fan' }),
  Object.freeze({ collectionId: 'MediaAssets', id: 'media-founder-shiri-achu' }),
]);

const record = (collectionId, id, approvalSource, data) => Object.freeze({
  collectionId,
  id,
  classification: 'approved-client-supplied',
  approvalSource,
  data: Object.freeze({ sourceVersion: SOURCE_VERSION, approvedAt: PUBLICATION_APPROVED_AT, ...data }),
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

const aboutIntroduction = 'The Pan-African Fabric is the first contemporary Pan-African textile intentionally designed to unite authentic cultural symbols from across North, East, West, Central, and Southern Africa into a single shared fabric. Founded by artist and architect Shiri Achu, The Pan-African Fabric Initiative celebrates African unity through culture, creativity, collaboration, and cultural diplomacy.\n\nOfficially launched at the Embassy of the Republic of Cameroon in Washington, D.C., in April 2025, the initiative has grown into an international platform bringing together artists, fashion designers, museums, embassies, educational institutions, cultural organisations, and communities through exhibitions, workshops, designer competitions, educational programmes, public engagement, and creative collaborations.\n\nThrough the language of art and fashion, The Pan-African Fabric continues to celebrate the richness and diversity of African cultures while strengthening connections across the continent and its global diaspora.';

const founderBiography = 'Shiri Achu is an internationally exhibited, award-winning artist, architect, and cultural practitioner whose work explores how creativity can strengthen cultural identity, foster international collaboration, and build lasting connections between people, communities, and nations.\n\nBased in the Washington, D.C. area, she develops interdisciplinary projects that bring together visual art, architecture, fashion, museums, education, cultural diplomacy, and community engagement. Her work is guided by the belief that creativity has the power not only to inspire, but also to connect cultures, preserve heritage, encourage dialogue, and build meaningful relationships across borders.\n\nIn 2025, Shiri founded The Pan-African Fabric Initiative and created The Pan-African Fabric—the first contemporary Pan-African textile intentionally designed to unite authentic cultural symbols representing North, East, West, Central, and Southern Africa into one shared fabric. More than a textile, the initiative has grown into an international cultural platform that brings together artists, designers, museums, embassies, educational institutions, cultural organisations, and communities through exhibitions, designer competitions, museum programmes, educational workshops, public engagement, and creative collaboration.\n\nOfficially launched at the Embassy of the Republic of Cameroon in Washington, D.C., the initiative has expanded through partnerships across Africa and the United States, culminating in The Inaugural Pan-African Fabric & Fashion Showcase at the Smithsonian National Museum of African Art and the official Pan-African Fabric Cultural Reception hosted by the Embassy of the Republic of Cameroon.\n\nAlongside The Pan-African Fabric Initiative, Shiri is recognised for her contemporary African-inspired paintings and for creating InPrint, the long-running international exhibition series showcasing her African-inspired artworks in print form. Developed to make her work more accessible, affordable, and transportable, InPrint has introduced audiences around the world to contemporary African-inspired art while celebrating the richness of African cultures through a growing body of work. Throughout her career, she has consistently developed projects that extend beyond traditional artistic practice, creating opportunities for participation, education, cultural dialogue, and international collaboration.\n\nOver the course of her career, Shiri has received more than thirty national and international awards and recognitions for her artistic practice, cultural leadership, and community engagement. In 2026, she was named one of the Top Investable Artists by Art Market Experts, recognising both the strength of her artistic practice and the growing international significance of her work.\n\nWhether creating paintings, curating her own exhibitions, designing cultural programmes, or building international partnerships, Shiri approaches every project with the conviction that meaningful ideas can be intentionally designed, thoughtfully nurtured, and transformed into lasting cultural movements.\n\nThrough art, fashion, architecture, and cultural diplomacy, she continues to create platforms that celebrate African creativity while strengthening connections across the continent and its global diaspora.';

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

const pageContent = {
  home: { eyebrow: 'An international cultural initiative', heroTitle: 'The Pan-African Fabric', heroTagline: 'One Fabric. Many African Stories.', introduction: 'Created by artist and architect Shiri Achu, The Pan-African Fabric is a contemporary cultural initiative that brings African symbols, textile, fashion, education and cultural exchange into one shared story.', primaryCtaLabel: 'Explore Edition One', primaryCtaHref: '/edition-one', secondaryCtaLabel: 'The inaugural showcase', secondaryCtaHref: '/events/inaugural-pan-african-fabric-fashion-showcase', heroAsset: 'media-home-hero-pan-african-fan', heroMetaLabels: ['12 colours', '9 countries', '5 regions'] },
  about: { eyebrow: 'About', heroTitle: 'The why behind the fabric.', introduction: aboutIntroduction, heroAsset: 'media-source-shiri-achu-with-colour-block-2', heroMetaLabels: ['12 colours', '9 countries', '5 regions'] },
  'edition-one': { eyebrow: 'Edition One', heroTitle: 'One fabric. Nine countries.', heroTagline: 'Nine countries. Five regions. One shared visual language.', introduction: 'Edition One brings together creative voices from Cameroon, the Central African Republic, Egypt, Ethiopia, Ghana, Kenya, Morocco, Nigeria and South Africa. Explore the designers, cultural symbols and fashion interpretations behind each contribution.', heroAsset: 'media-source-symbols-and-meanings', heroMetaLabels: ['12 colours', '9 countries', '5 regions'] },
  events: { eyebrow: 'Events', heroTitle: 'Where the fabric comes alive.', introduction: 'From exhibitions and workshops to runway presentations and cultural receptions, each event creates a place for the fabric, its makers and its stories to meet the public.', heroAsset: 'media-source-obp05905', primaryCtaLabel: 'See the inaugural showcase', primaryCtaHref: '/events/inaugural-pan-african-fabric-fashion-showcase' },
  stories: { eyebrow: 'Stories', heroTitle: 'The living voice of the initiative.', introduction: 'Read reflections, poems and records from the people, places and creative moments shaping The Pan-African Fabric.', heroAsset: 'media-source-img-6999' },
  shop: { eyebrow: 'Shop', heroTitle: 'Own a piece of the story.', introduction: 'Explore the Pan-African Fan and future approved products connected directly to the initiative, its fabric and its cultural story.', heroAsset: 'media-home-hero-pan-african-fan' },
  'press-contact': { eyebrow: 'Press & Contact', heroTitle: 'Professional access to the initiative.', introduction: 'Find verified facts, official releases, approved media materials and the right contact route for press, interviews and general enquiries.', heroAsset: 'media-source-obp05746' },
  'partner-with-us': { eyebrow: 'Partner with us', heroTitle: 'Bring the fabric to your city.', introduction: 'Museums, embassies, universities, sponsors, cultural organisations, designers and future hosts can help shape where this initiative goes next.', heroAsset: 'media-source-obp06356', primaryCtaLabel: 'Start an enquiry', primaryCtaHref: '#enquiry', secondaryCtaLabel: 'Explore Edition One', secondaryCtaHref: '/edition-one' },
};

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
    heroTitle: pageContent[pageKey]?.heroTitle ?? title,
    ...(pageContent[pageKey] ?? {}),
    ...(pageContent[pageKey]?.introduction ? { introduction: richText(pageContent[pageKey].introduction) } : {}),
    displayOrder,
  },
));

const countryRegions = {
  'country-cameroon-edition-one': 'region-central-africa',
  'country-central-african-republic-edition-one': 'region-central-africa',
  'country-egypt-edition-one': 'region-north-africa',
  'country-ethiopia-edition-one': 'region-east-africa',
  'country-ghana-edition-one': 'region-west-africa',
  'country-kenya-edition-one': 'region-east-africa',
  'country-morocco-edition-one': 'region-north-africa',
  'country-nigeria-edition-one': 'region-west-africa',
  'country-south-africa-edition-one': 'region-southern-africa',
};
const countryDesigners = {
  'country-cameroon-edition-one': 'designer-muks-couture', 'country-central-african-republic-edition-one': 'designer-diana-melissa-ngoumape',
  'country-egypt-edition-one': 'designer-moja-design-studio', 'country-ethiopia-edition-one': 'designer-yyasmina-star',
  'country-ghana-edition-one': 'designer-afua-sam', 'country-kenya-edition-one': 'designer-amos-onyango',
  'country-morocco-edition-one': 'designer-naima-el-messaoudi', 'country-nigeria-edition-one': 'designer-goodys-stitches',
  'country-south-africa-edition-one': 'designer-fatima-barnes',
};
const countrySymbols = {
  'country-cameroon-edition-one': 'symbol-cameroon-double-bell', 'country-central-african-republic-edition-one': 'symbol-car-kuba',
  'country-egypt-edition-one': 'symbol-egypt-eye-of-horus', 'country-ethiopia-edition-one': 'symbol-ethiopia-traditional-pattern',
  'country-ghana-edition-one': 'symbol-ghana-nkonsonkonson', 'country-kenya-edition-one': 'symbol-kenya-massai-shuka',
  'country-morocco-edition-one': 'symbol-morocco-diamond-amazigh', 'country-nigeria-edition-one': 'symbol-nigeria-northern-knot',
  'country-south-africa-edition-one': 'symbol-south-africa-shwe-shwe',
};

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
    region: countryRegions[id],
    principalDesigner: countryDesigners[id],
    featuredSymbol: countrySymbols[id],
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
const screenColours = {
  'dark-green': ['#284f49', '#ffffff'], red: ['#ef001e', '#000000'], yellow: ['#efd300', '#000000'], pink: ['#eaa4a4', '#000000'], black: ['#020706', '#ffffff'], white: ['#faf7f7', '#000000'], blue: ['#12a8de', '#000000'], 'mint-green': ['#8edaca', '#000000'], orange: ['#dc671d', '#000000'], 'hot-pink': ['#e52c7b', '#000000'], purple: ['#64139b', '#ffffff'], green: ['#009b1a', '#000000'],
};

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
    hexValue: screenColours[slug][0],
    textHex: screenColours[slug][1],
    screenValueNote: 'Representative on-screen sample interpreted from the supplied colour artwork; not a print specification.',
    largeTextOnly: false,
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
  ['designer-afua-sam', 'Afua Sam', 'Studio D’Maxsi'],
  ['designer-amos-onyango', 'Amos Onyango', 'LAWY Afrik'],
  ['designer-naima-el-messaoudi', 'Naima El Messaoudi', 'Caftan Joujou'],
  ['designer-goodys-stitches', 'Goody’s Stitches'],
  ['designer-fatima-barnes', 'Fatima Barnes'],
];

const designerRecords = designers.map(([id, displayName, studioName], index) => sourceTruthRecord(
  'Designers',
  id,
  'The_Pan_African_Fabric_Official_Press_ _Media_Guide_1.pdf, page 14',
  {
    title: displayName,
    slug: id.replace(/^designer-/, ''),
    displayName,
    ...(studioName ? { studioName } : {}),
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
    image, width, height, decorative: false, usagePermission: 'web-display-approved',
    usageTerms: 'User authorized website publication from the supplied source-truth folder on 2026-09-13.', downloadAllowed: false, version: '1', displayOrder: index + 1,
  },
));

const additionalMediaSource = [
  ['10oct.jpg',2550,3300,'9b8a9d_ebc4bbff185842c19d883126933f04bc~mv2.jpg'],['11nov.jpg',2550,3300,'9b8a9d_8c20043b12d94c238519348b0a93a747~mv2.jpg'],['12Dec.jpg',2550,3300,'9b8a9d_4d6fc397b8564fb8a7d75856375f3898~mv2.jpg'],
  ['2.jpg',2550,3300,'9b8a9d_5fe44178212e4d3d8eb8c562d761c1ae~mv2.jpg'],['3.jpg',2550,3300,'9b8a9d_95c21cd9184744189314c4a7766afab0~mv2.jpg'],['3march.jpg',2550,3300,'9b8a9d_60e04d294e014bc28f1756195775bd43~mv2.jpg'],
  ['5may.jpg',2550,3300,'9b8a9d_28cfad06eae24eabb3e04b896b497318~mv2.jpg'],['7.jpg',2550,3300,'9b8a9d_6ba9282c0ff4438ba71284bb6b642f90~mv2.jpg'],['8Florence.jpg',2550,3300,'9b8a9d_3390f407af654179bc0a3d4596f81a38~mv2.jpg'],
  ['Bukum workshop.JPG',1600,1200,'9b8a9d_33bae757f1ae47e7a34396b493d193f7~mv2.jpg'],['Colour board.jpg',2550,3300,'9b8a9d_e618f5acea904b4a89e3125134f67fbb~mv2.jpg'],['DSC_0737.JPG',6000,4000,'9b8a9d_1d9bd3aa202d4bd1a19c8d344d1aab82~mv2.jpg'],
  ['FAN.png',1220,1204,'9b8a9d_2339c45f91664efaaa5adb15308cd481~mv2.png'],['IMG_6999.jpg',3889,5833,'9b8a9d_e013b82b004b464e9d0fa1368b6b54c4~mv2.jpg'],['IMG_8963.jpeg',640,480,'9b8a9d_1390bb8e50474ec49037613b1b9d7b84~mv2.jpeg'],['IMG_9007.jpeg',640,480,'9b8a9d_7b91710c8d33414c906944d2d96019d1~mv2.jpeg'],
  ['OBP05746.jpg',1541,2000,'9b8a9d_8373ec3a224446b385d45550819095d7~mv2.jpg'],['OBP05905.jpg',2000,1333,'9b8a9d_0ef72f85116b4d2ba31955be895b9e3f~mv2.jpg'],['OBP05927.jpg',2000,1566,'9b8a9d_aeb006084a9f4ed8919f98ee94762f0f~mv2.jpg'],['OBP05964.jpg',2000,1333,'9b8a9d_d188ab5f25fe4ffd85b1f9f0bc0a5999~mv2.jpg'],
  ['OBP05996.jpg',2000,1486,'9b8a9d_9ad2eb4e531b4053bbe7e654916918a6~mv2.jpg'],['OBP06037.jpg',1541,2000,'9b8a9d_ea40c2aac0274ee6b2bf8eff2055bd9f~mv2.jpg'],['OBP06111.jpg',2000,1488,'9b8a9d_79a5c3812cd1401bb26119da0ec52b55~mv2.jpg'],['OBP06178.jpg',1514,2000,'9b8a9d_d348cb90919641829e8a7eb81d5ed0ab~mv2.jpg'],
  ['OBP06356.jpg',2000,1547,'9b8a9d_b133cd456dcf4e58908bd1168bf28ed9~mv2.jpg'],['OBP06404.jpg',1333,2000,'9b8a9d_f63734b7d77f477cac75776c47e5bd6e~mv2.jpg'],['OBP06410.jpg',1333,2000,'9b8a9d_b28dc48d4f5c47948c29aaaae1f5ba34~mv2.jpg'],['OBP06537.jpg',1399,2000,'9b8a9d_8fe24618f81e4814be8356ef92227adb~mv2.jpg'],
  ['Photo Feb 13 2026, 9 52 41 AM.jpg',2287,3211,'9b8a9d_4eb149f5a7d14f379bb0029e2de407ad~mv2.jpg'],['Screenshot 2024-09-25 141914.jpg',1722,1222,'9b8a9d_01d15c1a2e6c4270afcacc5507389643~mv2.jpg'],['Screenshot 2024-09-25 142025.jpg',1627,1277,'9b8a9d_ecd72eecab2543d89a63c8ff7f9ca003~mv2.jpg'],
  ['SHIRI ACHU WITH COLOUR BLOCK 2.JPG',1366,2048,'9b8a9d_280e0dbb052e4aa9ab1fb8ab18ddc5e1~mv2.jpg'],['Styling the Tie.jpg',2550,3300,'9b8a9d_f1401b3ab2914809b818da9db8e1929c~mv2.jpg'],
];
const slugify = value => value.toLowerCase().replace(/\.[^.]+$/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const additionalMediaRecords = additionalMediaSource.map(([filename, width, height, wixId], index) => sourceTruthRecord('MediaAssets', `media-source-${slugify(filename)}`, `Source asset ${filename}; publication authorized by user on 2026-09-13`, {
  title: filename.replace(/\.[^.]+$/, ''), slug: `source-${slugify(filename)}`, filename, assetType: 'image', alt: `Supplied project image: ${filename}.`, ratio: width === height ? '1/1' : width > height ? '3/2' : '4/5', focalPosition: '50% 50%', image: `https://static.wixstatic.com/media/${wixId}`, width, height, decorative: false, usagePermission: 'web-display-approved', usageTerms: 'User authorized website publication from the supplied source-truth folder on 2026-09-13.', downloadAllowed: false, version: '1', displayOrder: 11 + index,
}));

const symbolSource = [
  ['morocco-diamond-amazigh', 'Diaomond Amazigh (Berber)', 'Originates from an animistic belief and tradition. The diamond is the symbol of the woman, associated with the snake it represents the union of opposites.', 'country-morocco-edition-one'],
  ['egypt-eye-of-horus', 'The Eye of Horus', 'Originated in Ancient Egypt and represents healing and knowledge and is a symbol of protection from evil.', 'country-egypt-edition-one'],
  ['ghana-nkonsonkonson', 'Nkonsonkonson (Chain Link)', 'A symbol of unity, community. A reminder to contribute to the community, that in unity lies strength', 'country-ghana-edition-one'],
  ['ghana-boa-me', 'Boa me na me mmoa wo', '(“Help me and let me help you”) Symbol of cooperation and interdependence.', 'country-ghana-edition-one'],
  ['nigeria-northern-knot', 'The Northern knot', 'Symbolizes unity in diversity and is elaborately expressed in the palace art of Northern Nigeria.', 'country-nigeria-edition-one'],
  ['car-kuba', 'Kuba', 'A traditional fabric pattern graphically distinctive and richly evocative of central Africa.', 'country-central-african-republic-edition-one'],
  ['cameroon-double-bell', 'Bamilieke Double Bell', 'Denotes palace authorities transmitting information to the public.', 'country-cameroon-edition-one'],
  ['cameroon-toghu', 'Toghu', 'It’s a symbol from Cameroon African Fabric (Toghu) that removes bad luck in.', 'country-cameroon-edition-one'],
  ['ethiopia-traditional-pattern', 'Traditional Ethiopian pattern', 'Traditional Ethiopian pattern.', 'country-ethiopia-edition-one'],
  ['kenya-massai-shuka', 'Massai Shuka', 'A traditional fabric pattern by the people of Kenya.', 'country-kenya-edition-one'],
  ['south-africa-shwe-shwe', 'Shwe-Shwe Fabric pattern', 'Traditional African pattern inspired from the Shwe-Shwe Fabric from Cape Town in South Africa', 'country-south-africa-edition-one'],
  ['south-africa-zulu-shield', 'Zulu Shield', "It is the traditional zulu symbol by the Southern part of africa which means to be under somebody's shield.", 'country-south-africa-edition-one'],
];
const symbolRecords = symbolSource.map(([slug, approvedName, meaning, country], index) => sourceTruthRecord('Symbols', `symbol-${slug}`, 'Symbols and meanings.jpg and Screenshot 2024-09-25 141914.jpg', {
  title: approvedName, slug, approvedName, meaning: richText(meaning), acknowledgement: `Supplied project symbol reference artwork; mapped to ${countryRecords.find(item => item.id === country)?.data.countryName}.`, artworkAsset: 'media-source-symbols-and-meanings', displayOrder: index + 1,
}));

const participationSource = [
  ['cameroon', 'designer-muks-couture', 'country-cameroon-edition-one', 'Winner of The Pan-African Fabric: Cameroon Designer Competition, Muks’ Couture brings a distinctive Cameroonian interpretation to Edition One.'],
  ['central-african-republic', 'designer-diana-melissa-ngoumape', 'country-central-african-republic-edition-one', 'Designer, model, and Miss Africa USA 2025 Diana-Melissa Ngoumape represents the Central African Republic through her interpretation of The Pan-African Fabric.'],
  ['egypt', 'designer-moja-design-studio', 'country-egypt-edition-one', 'MOJA Design Studio represents Egypt, bringing an Egyptian creative perspective to the shared Pan-African textile.'],
  ['ethiopia', 'designer-yyasmina-star', 'country-ethiopia-edition-one', 'Selected as the winner of The Pan-African Fabric: Ethiopia Designer Competition, YYASMINA STAR represents Ethiopia in the inaugural showcase.'],
  ['ghana', 'designer-afua-sam', 'country-ghana-edition-one', 'Ghanaian designer Afua Sam of Studio D’Maxsi brings her creative vision and Ghanaian perspective to Edition One.'],
  ['kenya', 'designer-amos-onyango', 'country-kenya-edition-one', 'Amos Onyango of LAWY Afrik represents Kenya through an original interpretation shaped by his contemporary African design perspective.'],
  ['morocco', 'designer-naima-el-messaoudi', 'country-morocco-edition-one', 'Naima El Messaoudi of Caftan Joujou represents Morocco, interpreting The Pan-African Fabric through the artistry of Moroccan fashion.'],
  ['nigeria', 'designer-goodys-stitches', 'country-nigeria-edition-one', 'Goody’s Stitches represents Nigeria with original interpretation celebrating the country’s vibrant fashion creativity.'],
  ['south-africa', 'designer-fatima-barnes', 'country-south-africa-edition-one', 'Fatima Barnes represents South Africa, bringing a distinctive South African perspective to the shared fabric and its continental story.'],
];
const participationRecords = participationSource.map(([slug, designer, country, statement], index) => sourceTruthRecord('Participations', `participation-edition-one-${slug}`, 'Official Press & Media Guide, page 14', {
  title: `Edition One — ${slug}`, slug: `edition-one-${slug}`, participationRole: 'Edition One designer', participationStatus: 'confirmed', isPrincipal: true, statement: richText(statement), edition: 'edition-one', country, designer, displayOrder: index + 1,
}));

const additionalEvents = [
  ['event-pan-african-fabric-cultural-reception', 'The Pan-African Fabric Cultural Reception', 'pan-african-fabric-cultural-reception', 'Saturday, September 26, 2026', '6:00 PM–8:30 PM', 'Embassy of the Republic of Cameroon', 'Washington, D.C.'],
  ['event-official-launch', 'Official Launch', 'official-launch', '25 April 2025', '', 'Embassy of Cameroon', 'Washington, D.C.'],
  ['event-africa-with-love', 'Africa, With Love', 'africa-with-love', 'February 13, 2026', '', 'Smithsonian National Museum of African Art', 'Washington, D.C.'],
  ['event-international-womens-day-workshop', "International Women's Day Workshop", 'international-womens-day-workshop', 'March 2026', '', 'Bukom Café DC', 'Washington, D.C.'],
  ['event-fashioning-power-fashioning-peace', 'Fashioning Power, Fashioning Peace', 'fashioning-power-fashioning-peace', 'April 27–May 9, 2026', '', 'President Woodrow Wilson House Museum', 'Washington, D.C.'],
];
const eventPublication = {
  'pan-african-fabric-cultural-reception': { eventType: 'reception', startsAt: '2026-09-26T18:00:00-04:00', endsAt: '2026-09-26T20:30:00-04:00', eventStatus: 'upcoming', isConfirmed: true, heroAsset: 'media-source-obp06356' },
  'official-launch': { eventType: 'exhibition', startsAt: '2025-04-25T12:00:00-04:00', eventStatus: 'archive', isConfirmed: true, heroAsset: 'media-source-obp05927' },
  'africa-with-love': { eventType: 'workshop', startsAt: '2026-02-13T09:52:00-05:00', eventStatus: 'archive', isConfirmed: true, heroAsset: 'media-source-photo-feb-13-2026-9-52-41-am' },
  'international-womens-day-workshop': { eventType: 'workshop', eventStatus: 'documented', isConfirmed: false, heroAsset: 'media-source-bukum-workshop' },
  'fashioning-power-fashioning-peace': { eventType: 'exhibition', startsAt: '2026-04-27T12:00:00-04:00', endsAt: '2026-05-09T17:00:00-04:00', eventStatus: 'archive', isConfirmed: true, heroAsset: 'media-source-africa-to-the-world' },
};
const additionalEventRecords = additionalEvents.map(([id, title, slug, dateLabel, timeLabel, venue, location], index) => sourceTruthRecord('Events', id, 'Official Press & Media Guide and showcase invitation', {
  title, slug, dateLabel, ...(timeLabel ? { timeLabel } : {}), venue, location, featured: false, edition: 'edition-one', ...eventPublication[slug],
  ...(slug === 'pan-african-fabric-cultural-reception' ? { admission: richText('By Invitation'), programme: richText('Continue the celebration through an evening of cultural exchange and connection with designers, diplomats, cultural leaders, and invited guests, while enjoying The Pan-African Fabric exhibition and celebrating a shared vision of African unity.'), publicPartnerCredits: richText('Hosted by the Embassy of the Republic of Cameroon') } : {}),
  ...(slug === 'africa-with-love' ? { overview: richText('“Africa, With Love” Workshop; Approximately 1,000 participants.') } : {}),
  ...(slug === 'international-womens-day-workshop' ? { overview: richText('Nine women representing the participating countries.') } : {}),
  displayOrder: index + 2,
}));

const contactRecords = [
  ['contact-media-email', 'Media contact and reception RSVP', 'media-email', 'email', 'info@shiriachuart.com'],
  ['contact-media-phone', 'Media contact phone', 'media-phone', 'phone', '+1 240 696 9297'],
  ['contact-reception-phone', 'Cultural Reception RSVP', 'reception-phone', 'phone', '240 234 1979'],
].map(([id, title, channelKey, kind, value], index) => sourceTruthRecord('ContactChannels', id, 'Official Press & Media Guide and showcase invitation', {
  title, slug: channelKey, channelKey, label: title, description: value, ...(kind === 'email' ? { emailAddress: value } : {}), publicUseVerified: true, isEnabled: true, displayOrder: index + 1,
}));

const storySource = [
  ['story-africa-to-the-world', 'Africa to the World', 'africa-to-the-world', undefined, 'August 2026', '2026-08-01', 'media-source-africa-to-the-world', 'This inaugural Pan-African Fabric dress, designed by Muks\' Couture, winner of The Pan-African Fabric: Cameroon Designer Competition, was exhibited as part of Fashioning Power, Fashioning Peace at the President Woodrow Wilson House Museum. As one of the first public presentations of The Pan-African Fabric, the exhibition marked an important milestone in the initiative\'s journey, introducing its vision of African unity through contemporary art, fashion, and cultural storytelling.'],
  ['story-poem-lltaos', 'Long Live the Art of Service (LLTAOS)', 'long-live-the-art-of-service-lltaos', 'Wirndzerem G.B.', '04/2026', '2026-04-01', 'media-source-poem-lltaos'],
  ['story-poem-inked-concentrations', 'Inked Concentrations.', 'inked-concentrations', 'Wirndzerem GB', '03.2026', '2026-03-01', 'media-source-poem-inked-concentrations'],
  ['story-poem-frames-of-fabrics', 'Frames of Fabrics.', 'frames-of-fabrics', 'Wirndzerem GB', '03.2026', '2026-03-01', 'media-source-poem-frames-of-fabrics'],
  ['story-poem-teeming-bazaar', 'Sketching A Teeming Bazaar of Drawings', 'sketching-a-teeming-bazaar-of-drawings', 'Wirndzerem G. Barfee', '04.2026', '2026-04-01', 'media-source-poem-teeming-bazaar'],
  ['story-poem-same-sight', 'Same Sight / Different Lenses: The Diversity of a United Universe', 'same-sight-different-lenses', 'Wirndzerem G. Barfee', '04.2026', '2026-04-01', 'media-source-poem-same-sight-different-lenses'],
  ['story-poem-little-hands', 'Of Little hands, soft strokes and silk outlines', 'of-little-hands-soft-strokes-and-silk-outlines', 'Wirndzerem.GB', '03.2026', '2026-03-01', 'media-source-poem-little-hands'],
  ['story-poem-textile-certificates', 'Textile Certificates: A Proud Bevy of Symbologists.', 'textile-certificates-a-proud-bevy-of-symbologists', 'Wirndzerem G. Barfee', '04.2026', '2026-04-01', 'media-source-poem-textile-certificates'],
];
const storyRecords = storySource.map(([id, headline, slug, authorCredit, dateLabel, storyDate, heroAsset, body], index) => sourceTruthRecord('Stories', id, 'Official Press & Media Guide and supplied poem artwork', {
  title: headline, headline, slug, category: index === 0 ? 'Milestone' : 'Poetry', ...(authorCredit ? { authorCredit } : {}), dateLabel, storyDate, ...(body ? { body: richText(body) } : {}), heroAsset, displayOrder: index + 1,
}));

const garmentRecord = sourceTruthRecord('Garments', 'garment-inaugural-pan-african-fabric-dress', 'Official Press & Media Guide, page 11', {
  title: 'This inaugural Pan-African Fabric dress', slug: 'inaugural-pan-african-fabric-dress', itemType: 'dress', collectionLabel: 'This inaugural Pan-African Fabric dress', description: richText("This inaugural Pan-African Fabric dress, designed by Muks' Couture, winner of The Pan-African Fabric: Cameroon Designer Competition, was exhibited as part of Fashioning Power, Fashioning Peace at the President Woodrow Wilson House Museum."), participation: 'participation-edition-one-cameroon', designer: 'designer-muks-couture', country: 'country-cameroon-edition-one', edition: 'edition-one', heroAsset: 'media-source-africa-to-the-world', displayOrder: 1,
});

const pressRecords = [
  ['press-showcase-release-august-2026', 'The Inaugural Pan-African Fabric & Fashion Showcase to Debut at the Smithsonian National Museum of African Art', 'showcase-release-august-2026', 'press-release', 'August 2026'],
  ['press-official-media-guide', 'THE PAN-AFRICAN FABRIC — OFFICIAL PRESS & MEDIA GUIDE', 'official-press-media-guide', 'Press and media guide', 'August 2026'],
  ['press-official-press-kit', 'THE PAN-AFRICAN FABRIC — PRESS KIT', 'official-press-kit', 'Press kit', 'July 2026'],
  ['press-showcase-reception-invitation', 'Showcase and reception invitation', 'showcase-reception-invitation', 'Invitation', 'September 2026'],
].map(([id, headline, slug, itemType, dateLabel], index) => sourceTruthRecord('PressItems', id, 'Supplied official press PDFs', { title: headline, headline, slug, itemType, dateLabel, version: dateLabel, downloadAllowed: false, relatedEvent: 'event-inaugural-pan-african-fabric-fashion-showcase', displayOrder: index + 1 }));

const collaboratorDescriptions = {
  Museums: 'Host exhibitions, public programmes and educational experiences that connect audiences with contemporary African textile, symbolism and fashion.',
  Embassies: 'Support cultural diplomacy, national participation and cross-cultural exchange through programmes built around the shared fabric.',
  Universities: 'Create learning, research, workshop and student engagement opportunities across art, fashion, design, history and cultural studies.',
  Sponsors: 'Help extend the reach, access and production of exhibitions, education programmes and public events.',
  'Cultural organisations': 'Develop programmes that connect communities, creative practice and African cultural storytelling.',
  Designers: 'Contribute new interpretations, craftsmanship and creative perspectives to future editions and programmes.',
  'Future hosts': 'Bring the initiative to new cities, institutions and audiences through exhibitions, showcases and public engagement.',
};
const collaboratorRecordId = label => ({
  Museums: 'partnership-museums', Embassies: 'partnership-embassies', Universities: 'partnership-universities',
  Sponsors: 'partnership-sponsors', 'Cultural organisations': 'partnership-cultural-organisations',
  Designers: 'partnership-designers-and-future-hosts',
}[label] ?? `partnership-collaborator-${slugify(label)}`);
const partnershipRecords = [
  ...Object.entries(collaboratorDescriptions).map(([label, description], index) => sourceTruthRecord('PartnershipOptions', collaboratorRecordId(label), 'Validated page-by-page content and media proposal', { title: label, slug: `collaborator-${slugify(label)}`, optionType: 'collaborator', label, enquiryValue: label, description: richText(description), isEnabled: true, displayOrder: index + 1 })),
  ...[
    ['Exhibitions', 'Present the fabric, its symbols, designers and stories through an institution-led exhibition.'],
    ['Fashion showcases', 'Stage a runway or presentation featuring approved interpretations of The Pan-African Fabric.'],
    ['Workshops', 'Invite participants to explore colour, symbolism, storytelling and creative practice through guided activity.'],
    ['Educational programmes', 'Build curriculum-linked talks, demonstrations and learning experiences for students and communities.'],
    ['Cultural receptions', 'Create space for cultural exchange among artists, designers, diplomats, partners and invited guests.'],
    ['Talks and presentations', 'Introduce the initiative, its creative process and its cultural purpose to a live audience.'],
  ].map(([label, description], index) => sourceTruthRecord('PartnershipOptions', `partnership-format-${slugify(label)}`, 'Validated page-by-page content and media proposal', { title: label, slug: `format-${slugify(label)}`, optionType: 'format', label, enquiryValue: label, description: richText(description), isEnabled: true, displayOrder: index + 1 })),
  ...['Hosting an exhibition', 'Workshop or education programme', 'Sponsorship', 'Cultural partnership', 'Designer collaboration', 'Something else'].map((label, index) => sourceTruthRecord('PartnershipOptions', `partnership-enquiry-${slugify(label)}`, 'Validated page-by-page content and media proposal', { title: label, slug: `enquiry-${slugify(label)}`, optionType: 'enquiry', label, enquiryValue: label, description: richText(label), isEnabled: true, displayOrder: index + 1 })),
];

const section = (page, key, order, heading, body, extra = {}) => record('PageSections', `section-${page}-${key}`, 'Validated page-by-page content and media proposal; implementation authorized on 2026-09-13.', { title: heading, slug: `${page}-${key}`, page: `page-${page}`, sectionKey: key, sectionType: extra.mediaAsset ? 'media' : 'editorial', eyebrow: `${String(order).padStart(2, '0')} — ${key.replaceAll('-', ' ')}`, heading, body: richText(body), isEnabled: true, displayOrder: order, ...extra });

const pageSectionRecords = [
  section('home', 'edition-one', 1, 'One fabric. Nine countries.', 'Edition One brings together designers representing Cameroon, the Central African Republic, Egypt, Ethiopia, Ghana, Kenya, Morocco, Nigeria and South Africa. Each designer interprets the same Pan-African textile through a distinct cultural and creative perspective.'),
  section('home', 'designers', 2, 'One fabric, interpreted nine ways.', 'Meet the designers shaping Edition One and discover how a shared textile becomes nine individual fashion interpretations.', { ctaLabel: 'Meet the designers', ctaHref: '/edition-one#designers', mediaAsset: 'media-source-africa-to-the-world' }),
  section('home', 'stories', 3, 'The living voice of the initiative.', 'Read reflections, poems and records from the people and moments shaping The Pan-African Fabric.', { ctaLabel: 'Go to Stories', ctaHref: '/stories' }),
  section('home', 'partner', 4, 'Bring the fabric to your city.', 'Museums, embassies, universities, sponsors, cultural organisations, designers and future hosts can help shape where this initiative goes next.', { ctaLabel: 'Partner With Us', ctaHref: '/partner-with-us', mediaAsset: 'media-source-obp05905' }),
  section('about', 'origin', 1, 'Why this initiative exists.', 'The Pan-African Fabric began with a desire to create a shared contemporary textile that could hold distinct African cultural stories together. Its colour palette grew from Long Live the Art of Service (LLTAOS), Shiri Achu’s 2023 creative initiative exploring twelve colours as symbols of service, purpose and human values. Those colours became the foundation of a fabric where symbolism and storytelling meet.', { mediaAsset: 'media-source-colour-board' }),
  section('about', 'mission', 2, 'What it sets out to do.', 'The initiative uses art and fashion to celebrate the richness and diversity of African cultures, strengthen connections across the continent and its global diaspora, and create opportunities for cultural dialogue, education and international collaboration.'),
  section('about', 'model', 3, 'How the initiative is made.', 'The platform brings together artists, fashion designers, museums, embassies, educational institutions, cultural organisations and communities through exhibitions, workshops, designer competitions, educational programmes, public engagement and creative collaboration. For Edition One, designers representing nine countries interpret one shared textile through their own cultural perspectives, creative visions and craftsmanship.', { mediaAsset: 'media-source-bukum-workshop' }),
  section('about', 'milestones', 5, 'A growing cultural movement.', '2023 — Long Live the Art of Service (LLTAOS): twelve colours explored as symbols of service, purpose and human values.\n\nApril 2025 — Official launch: The Pan-African Fabric Initiative officially launched at the Embassy of the Republic of Cameroon in Washington, D.C.\n\n2025–2026 — Creative programmes: workshops, designer competitions, exhibitions and public programmes expanded the initiative across Africa and the United States.\n\n26 September 2026 — Inaugural showcase: nine designers representing nine African countries present Edition One at the Smithsonian National Museum of African Art.', { mediaAsset: 'media-source-photo-feb-13-2026-9-52-41-am' }),
  section('edition-one', 'the-fabric', 1, 'A single cloth, carrying twelve colours.', 'The first Pan-African fabric intentionally created to unite symbols from across all five regions of Africa into one contemporary textile. The fabric’s colours, symbolism and storytelling come together to celebrate African unity.', { mediaAsset: 'media-source-fan' }),
  section('edition-one', 'colours', 2, 'Twelve colours. Twelve values.', 'The Edition One palette connects twelve colours with participating countries and the values first explored through Long Live the Art of Service.', { mediaAsset: 'media-source-colour-chart' }),
  section('edition-one', 'regions', 3, 'Five regions, held in one composition.', 'North, East, West, Central and Southern Africa meet within a single contemporary textile.'),
  section('edition-one', 'countries', 4, 'Nine countries. Nine perspectives.', 'Explore each participating country, its colour, cultural symbol, designer and interpretation.'),
  section('edition-one', 'designers', 5, 'The designers of Edition One.', 'Nine designers bring their own cultural perspectives, creative visions and craftsmanship to one shared fabric.'),
  section('edition-one', 'process', 6, 'From symbol to silhouette.', 'The creative process moves from cultural research and symbol selection through textile development, designer interpretation, making and presentation.', { mediaAsset: 'media-source-styling-the-tie' }),
  section('edition-one', 'garments', 7, 'The fabric in form.', 'See how The Pan-African Fabric becomes fashion, beginning with the inaugural dress created by Muks’ Couture.', { mediaAsset: 'media-source-africa-to-the-world' }),
  section('events', 'upcoming', 1, 'The inaugural showcase.', 'The next confirmed public presentation brings nine designers and nine country interpretations together at the Smithsonian National Museum of African Art.', { mediaAsset: 'media-source-fan' }),
  section('events', 'formats', 2, 'Many ways to encounter the fabric.', 'The initiative comes to life through exhibitions, fashion showcases, workshops, educational programmes, cultural receptions, talks and presentations.'),
  section('events', 'archive', 3, 'The story so far.', 'Explore documented launches, workshops, exhibitions and cultural programmes that have shaped the initiative.', { mediaAsset: 'media-source-obp05927' }),
  section('stories', 'index', 1, 'Stories from across the initiative.', 'Browse published reflections, poetry and records from the people and programmes shaping The Pan-African Fabric.'),
  section('stories', 'categories', 2, 'Explore by voice and form.', 'Discover stories across reflections, poetry, events, designers and behind-the-scenes practice.'),
  section('shop', 'collection', 1, 'The Pan-African Fan.', 'A functional object made from The Pan-African Fabric, connecting the Edition One textile with the initiative’s wider story.', { mediaAsset: 'media-home-hero-pan-african-fan' }),
  section('shop', 'positions', 2, 'More pieces will follow.', 'Future digital and special-edition products will appear only when their stories, images, availability and fulfilment details are approved.'),
  section('press-contact', 'fast-facts', 1, 'The initiative at a glance.', 'A concise set of verified facts for journalists, institutions and partners.'),
  section('press-contact', 'releases', 2, 'Official releases.', 'Read official announcements and media releases issued by The Pan-African Fabric.'),
  section('press-contact', 'assets', 3, 'Approved images and files.', 'Access approved press materials with their version, usage notes and download permissions.'),
  section('press-contact', 'coverage', 4, 'Selected coverage.', 'Verified media coverage will be listed with its publication, date and source link.'),
  section('press-contact', 'contact', 5, 'How to reach the initiative.', 'Use the relevant public channel for press, interviews, partnerships and general enquiries.'),
  section('partner-with-us', 'why-partner', 1, 'What a partnership makes possible.', 'Partnerships create opportunities for cultural exchange, public learning, creative collaboration and new encounters with contemporary African stories.'),
  section('partner-with-us', 'collaborators', 2, 'Seven kinds of collaborator.', 'The initiative works with museums, embassies, universities, sponsors, cultural organisations, designers and future hosts.'),
  section('partner-with-us', 'ways', 3, 'How collaboration can take shape.', 'A partnership can begin with an exhibition, showcase, workshop, educational programme, cultural reception, talk or presentation.'),
  section('partner-with-us', 'enquiry', 4, 'Tell us what you have in mind.', 'Choose the enquiry type that best fits your idea and share the city, organisation, dates and format you are considering.'),
];

const shopRecord = sourceTruthRecord('ShopItems', 'shop-pan-african-fan', 'Client-supplied The Pan-African Fan.jpg', { title: 'The Pan-African Fan', slug: 'the-pan-african-fan', itemType: 'fan', availabilityLabel: 'Details forthcoming', commerceEnabled: false, edition: 'edition-one', heroAsset: 'media-home-hero-pan-african-fan', displayOrder: 1 });

export const seedRecords = Object.freeze([
  record('MediaAssets', 'media-home-hero-pan-african-fan', 'Client-supplied hero image and publication authorization on 2026-09-13.', {}),
  record('MediaAssets', 'media-founder-shiri-achu', 'Client-supplied founder portrait and publication authorization on 2026-09-13.', {}),
  sourceTruthRecord('Editions', 'edition-one', 'The_Pan_African_Fabric_Official_Press_ _Media_Guide_1.pdf, pages 12–13', {
    title: 'Edition One',
    slug: 'edition-one',
    year: 2025,
    editionStatus: 'current',
    leadLine: 'ONE FABRIC. MANY AFRICAN STORIES.',
    fabricDescription: richText('The first Pan-African fabric intentionally created to unite symbols from across all five regions of Africa into one contemporary textile.'),
    colourNarrative: richText("The fabric's distinctive color palette has its origins in Long Live the Art of Service (LLTAOS), a creative initiative developed by Shiri Achu throughout 2023 that explored twelve colors as symbols of service, purpose, and human values. These colors later became the foundation of The Pan-African Fabric, where color, symbolism, and storytelling came together to create a contemporary textile celebrating African unity."),
    creativeProcess: richText("Fashion designers representing each participating country have interpreted The Pan-African Fabric through their own unique cultural perspective, creative vision, and craftsmanship. Together, these original fashion interpretations celebrate the individuality of each nation while revealing the unity woven throughout the continent."),
    displayOrder: 1,
  }),
  ...regionRecords,
  ...designerRecords,
  ...sourceMediaRecords,
  ...additionalMediaRecords,
  ...symbolRecords,
  ...participationRecords,
  garmentRecord,
  ...storyRecords,
  ...pressRecords,
  ...partnershipRecords,
  shopRecord,
  ...pageRecords,
  ...countryRecords,
  ...colourRecords,
  ...additionalEventRecords,
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
    eventStatus: 'upcoming',
    overview: richText('For the first time, contemporary fashion designers representing nine African countries across all five regions of Africa will present original fashion interpretations created from a single Pan-African textile during The Inaugural Pan-African Fabric & Fashion Showcase at the Smithsonian National Museum of African Art on Saturday, September 26, 2026.'),
    programme: richText('1:00 PM — Community Day Opens — Smithsonian National Museum of African Art\n\n2:00 PM – 3:00 PM — The Pan-African Fabric & Fashion Showcase — A contemporary runway presentation celebrating a Pan-African vision of unity through original designs by nine designers representing nine African countries.\n\n3:00 PM – 5:00 PM — Meet & Greet with Designers, Diplomats and Fellow Guests — Enjoy photo opportunities and explore the Smithsonian National Museum of African Art, discover its exhibitions, and experience Community Day activities, including the Sounds of Africa Concert.'),
    isConfirmed: true,
    featured: true,
    edition: 'edition-one',
    displayOrder: 1,
  }),
  record('PageSections', 'section-about-founder', 'Founder relationship and exact biography/quotation from Official Press & Media Guide, pages 2 and 15–16; user authorized publication on 2026-09-13.', {
    title: 'Founder',
    slug: 'about-founder',
    sectionKey: 'founder',
    sectionType: 'media',
    page: 'page-about',
    mediaAsset: 'media-founder-shiri-achu',
    heading: 'Shiri Achu',
    quoteText: "The Pan-African Fabric is my visual love letter to Africa—a celebration of the continent's unity, diversity, and creativity, and an invitation to the world to discover the many African stories woven into its fabric.",
    quoteAttribution: 'Shiri Achu',
    body: richText(founderBiography),
    isEnabled: true,
    displayOrder: 4,
  }),
  ...pageSectionRecords,
  record('SiteSettings', 'site-settings-primary', 'Approved project identity and tagline.', {
    title: 'Primary site settings',
    slug: 'primary',
    siteName: 'The Pan-African Fabric',
    headerIdentity: 'The Pan-African Fabric',
    tagline: 'One Fabric. Many African Stories.',
    footerStatement: 'A contemporary cultural initiative connecting African stories through textile, art, fashion, education and exchange.',
    copyrightText: 'Created by Shiri Achu.',
    primaryEdition: 'edition-one',
    instagramUrl: 'https://www.instagram.com/thepanafricanfabric/',
    founderSiteUrl: 'https://www.shiriachuart.com/',
    canonicalOrigin: 'https://www.thepanafricanfabric.com/',
    defaultSeoAsset: 'media-home-hero-pan-african-fan',
    socialShareAsset: 'media-home-hero-pan-african-fan',
    displayOrder: 1,
  }),
  ...contactRecords,
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
