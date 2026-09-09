/** Private CMS schema for the redesigned public frontend. */
export const EXISTING_EDITOR_SITE_ID = 'cf6dc8aa-2320-4c66-b52e-44252adf69f3';
export const HEADLESS_SITE_ID = '6dabfd00-04c6-4f6f-8282-fb56b240c160';
export const editorialPermissions = Object.freeze({ insert: 'ADMIN', update: 'ADMIN', remove: 'ADMIN', read: 'ANYONE' });
export const publishPlugin = Object.freeze({ type: 'PUBLISH', publishOptions: { defaultStatus: 'DRAFT' } });

const label = key => key.replace(/([A-Z])/g, ' $1').replace(/^./, value => value.toUpperCase());
const field = (key, type = 'TEXT', extra = {}) => ({ key, displayName: label(key), type, ...extra });
const fields = (type, names) => names.split(' ').map(key => field(key, type));
const reference = (key, target, multiple = false, reciprocal) => field(key, multiple ? 'MULTI_REFERENCE' : 'REFERENCE', {
  typeMetadata: multiple
    ? { multiReference: { referencedCollectionId: target, referencingFieldKey: reciprocal, referencingDisplayName: label(reciprocal) } }
    : { reference: { referencedCollectionId: target } },
});
const shared = [...fields('TEXT', 'title slug summary sourceVersion'), field('displayOrder', 'NUMBER'), field('approvedAt', 'DATETIME')];
const collectionNames = {
  SiteSettings: 'Site settings', Pages: 'Pages', PageSections: 'Page sections', Editions: 'Editions', Regions: 'Regions',
  Countries: 'Edition countries', EditionColours: 'Edition colours', Symbols: 'Symbols', Designers: 'Designers',
  Participations: 'Designer participations', Garments: 'Garments and accessories', Events: 'Events', MediaAssets: 'Media assets',
  Stories: 'Stories', PressItems: 'Press items', PartnershipOptions: 'Partnership options', ContactChannels: 'Contact channels',
  ShopItems: 'Shop editorial items',
};
const collection = (id, ownFields) => ({
  id, displayName: collectionNames[id] ?? id, displayField: 'title', fields: [...shared, ...ownFields],
  permissions: { ...editorialPermissions }, plugins: [structuredClone(publishPlugin)],
});

export const collections = [
  collection('SiteSettings', [
    ...fields('TEXT', 'siteName tagline footerStatement'), ...fields('URL', 'canonicalOrigin instagramUrl founderSiteUrl'),
    reference('primaryEdition', 'Editions'), reference('defaultSeoAsset', 'MediaAssets'), reference('socialShareAsset', 'MediaAssets'),
  ]),
  collection('Pages', [
    ...fields('TEXT', 'pageKey path eyebrow heroTitle seoTitle seoDescription robots'), field('introduction', 'RICH_TEXT'),
    field('heroMetaLabels', 'ARRAY_STRING'), reference('heroAsset', 'MediaAssets'),
  ]),
  collection('PageSections', [
    ...fields('TEXT', 'sectionKey sectionType eyebrow heading ctaLabel ctaHref tone'), field('body', 'RICH_TEXT'),
    field('isEnabled', 'BOOLEAN'), reference('page', 'Pages'), reference('mediaAsset', 'MediaAssets'),
  ]),
  collection('Editions', [
    field('year', 'NUMBER'), ...fields('TEXT', 'editionStatus leadLine'),
    ...fields('RICH_TEXT', 'statement fabricDescription colourNarrative creativeProcess'),
    reference('heroAsset', 'MediaAssets'), reference('fabricAsset', 'MediaAssets'), reference('relatedEvents', 'Events', true, 'editionsRelatedEvents'),
  ]),
  collection('Regions', [...fields('TEXT', 'regionKey name'), field('description', 'RICH_TEXT')]),
  collection('Countries', [
    ...fields('TEXT', 'countryName regionLabel profileStatus regionNote'),
    ...fields('RICH_TEXT', 'introduction interpretation participationSummary credits'),
    reference('edition', 'Editions'), reference('region', 'Regions'), reference('principalDesigner', 'Designers'),
    reference('featuredSymbol', 'Symbols'), reference('heroAsset', 'MediaAssets'),
    reference('supportingAssets', 'MediaAssets', true, 'countrySupportingAssets'), reference('relatedEvents', 'Events', true, 'countries'),
  ]),
  collection('EditionColours', [
    ...fields('TEXT', 'colourName hexValue textHex screenValueNote'), field('sourcePosition', 'NUMBER'),
    field('contrastRatio', 'NUMBER'), field('largeTextOnly', 'BOOLEAN'), reference('edition', 'Editions'),
    reference('country', 'Countries'), reference('symbol', 'Symbols'), reference('mediaAsset', 'MediaAssets'),
  ]),
  collection('Symbols', [
    ...fields('TEXT', 'approvedName origin acknowledgement'), field('meaning', 'RICH_TEXT'), field('publicSourceUrl', 'URL'),
    reference('artworkAsset', 'MediaAssets'),
  ]),
  collection('Designers', [
    ...fields('TEXT', 'displayName studioName professionalTitle location'), ...fields('RICH_TEXT', 'biography statement'),
    ...fields('URL', 'professionalUrl socialUrl'), reference('portraitAsset', 'MediaAssets'),
  ]),
  collection('Participations', [
    ...fields('TEXT', 'participationRole participationStatus publicCredit selectionContext'), field('isPrincipal', 'BOOLEAN'),
    field('statement', 'RICH_TEXT'), reference('edition', 'Editions'), reference('country', 'Countries'),
    reference('designer', 'Designers'), reference('heroAsset', 'MediaAssets'),
  ]),
  collection('Garments', [
    ...fields('TEXT', 'lookNumber itemType technique collectionLabel'), ...fields('RICH_TEXT', 'description publicCredits'),
    reference('participation', 'Participations'), reference('designer', 'Designers'), reference('country', 'Countries'),
    reference('edition', 'Editions'), reference('heroAsset', 'MediaAssets'),
    reference('galleryAssets', 'MediaAssets', true, 'garmentsGalleryAssets'), reference('appearances', 'Events', true, 'garmentsAppearances'),
  ]),
  collection('Events', [
    ...fields('TEXT', 'eventType dateLabel timeLabel timezoneLabel venue location eventStatus'),
    ...fields('DATETIME', 'startsAt endsAt'), ...fields('RICH_TEXT', 'overview programme admission accessibility publicPartnerCredits'),
    ...fields('URL', 'officialUrl ticketUrl'), ...fields('BOOLEAN', 'isConfirmed featured'), reference('edition', 'Editions'),
    reference('heroAsset', 'MediaAssets'), reference('galleryAssets', 'MediaAssets', true, 'eventsGalleryAssets'),
    reference('resources', 'MediaAssets', true, 'eventsResources'), reference('countries', 'Countries', true, 'relatedEvents'),
    reference('designers', 'Designers', true, 'eventsDesigners'), reference('participations', 'Participations', true, 'events'),
  ]),
  collection('MediaAssets', [
    ...fields('TEXT', 'filename assetType alt caption ratio focalPosition location creator copyrightHolder creditLine usagePermission usageTerms downloadLabel fileSizeLabel version'),
    ...fields('IMAGE', 'image mobileImage'), field('document', 'DOCUMENT'), field('video', 'VIDEO'), field('date', 'DATE'),
    ...fields('NUMBER', 'width height mobileWidth mobileHeight focalX focalY'), ...fields('BOOLEAN', 'decorative downloadAllowed'),
  ]),
  collection('Stories', [
    ...fields('TEXT', 'headline category excerpt standfirst authorCredit dateLabel'), field('body', 'RICH_TEXT'),
    field('storyDate', 'DATE'), field('publishedDate', 'DATETIME'), reference('heroAsset', 'MediaAssets'),
    reference('countries', 'Countries', true, 'storiesCountries'), reference('designers', 'Designers', true, 'storiesDesigners'),
    reference('events', 'Events', true, 'storiesEvents'),
  ]),
  collection('PressItems', [
    ...fields('TEXT', 'itemType headline publicationName dateLabel version fileSizeLabel'),
    ...fields('RICH_TEXT', 'excerpt body usageNotes'), field('itemDate', 'DATE'), field('externalUrl', 'URL'),
    field('downloadAllowed', 'BOOLEAN'), reference('asset', 'MediaAssets'), reference('relatedEvent', 'Events'),
    reference('relatedStory', 'Stories'),
  ]),
  collection('PartnershipOptions', [
    ...fields('TEXT', 'optionType label enquiryValue'), field('description', 'RICH_TEXT'), field('isEnabled', 'BOOLEAN'),
    reference('mediaAsset', 'MediaAssets'),
  ]),
  collection('ContactChannels', [
    ...fields('TEXT', 'channelKey label description emailAddress responseNote'), field('publicUseVerified', 'BOOLEAN'),
    field('isEnabled', 'BOOLEAN'),
  ]),
  collection('ShopItems', [
    ...fields('TEXT', 'wixProductId itemType availabilityLabel variantLabel'), ...fields('RICH_TEXT', 'editorialStory fulfilment'),
    field('commerceEnabled', 'BOOLEAN'), reference('edition', 'Editions'), reference('country', 'Countries'),
    reference('garment', 'Garments'), reference('heroAsset', 'MediaAssets'),
    reference('galleryAssets', 'MediaAssets', true, 'shopGalleryAssets'), reference('relatedStories', 'Stories', true, 'shopItems'),
  ]),
];

export function assertNewSite(siteId) {
  if (siteId === EXISTING_EDITOR_SITE_ID || siteId !== HEADLESS_SITE_ID) {
    throw new Error('The verified separate Headless site ID is required. Existing Editor site access is forbidden.');
  }
}

const referenceTarget = value => value?.typeMetadata?.reference?.referencedCollectionId
  ?? value?.typeMetadata?.multiReference?.referencedCollectionId;

export function assertEditorialCollection(actual, expected, { requirePublish = true } = {}) {
  if (actual?.id !== expected.id || Object.keys(editorialPermissions).some(key => actual.permissions?.[key] !== editorialPermissions[key])) {
    throw new Error(`Editorial permissions could not be verified for ${expected.id}.`);
  }
  for (const wanted of expected.fields) {
    const found = actual.fields?.find(value => value.key === wanted.key);
    if (!found || found.type !== wanted.type || referenceTarget(found) !== referenceTarget(wanted)
      || found.typeMetadata?.multiReference?.referencingFieldKey !== wanted.typeMetadata?.multiReference?.referencingFieldKey) {
      throw new Error(`Schema mismatch for ${expected.id}.${wanted.key}.`);
    }
  }
  if (requirePublish && !actual.plugins?.some(plugin => plugin.type === 'PUBLISH')) {
    throw new Error(`Draft publishing is not configured for ${expected.id}.`);
  }
}

/** Create shells first, then references, then draft plugins. */
export function creationPlan() {
  return [
    ...collections.map(item => ({ method: 'POST', path: '/wix-data/v2/collections', body: { collection: { ...item, plugins: undefined, fields: item.fields.filter(value => !value.typeMetadata) } } })),
    // Include every field in the additive pass. Newly-created shells already have
    // scalar fields, so the runner skips them; older shells receive any new scalar
    // fields as well as references.
    ...collections.flatMap(item => item.fields.map(value => ({ method: 'POST', path: '/wix-data/v2/collections/create-field', body: { dataCollectionId: item.id, field: value } }))),
    ...collections.map(item => ({ method: 'POST', path: '/wix-data/v2/collections/add-plugin', body: { dataCollectionId: item.id, plugin: structuredClone(publishPlugin) } })),
  ];
}
