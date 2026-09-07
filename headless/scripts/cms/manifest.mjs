/** Phase 1 private schemas. No items, publication plugins, or public permissions. */
export const EXISTING_EDITOR_SITE_ID = 'cf6dc8aa-2320-4c66-b52e-44252adf69f3';
export const privatePermissions = Object.freeze({ insert: 'ADMIN', update: 'ADMIN', remove: 'ADMIN', read: 'ADMIN' });
const field = (key, type = 'TEXT', extra = {}) => ({ key, displayName: key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()), type, ...extra });
const fields = (type, names) => names.split(' ').map(key => field(key, type));
const reference = (key, target, multiple = false) => field(key, multiple ? 'MULTI_REFERENCE' : 'REFERENCE', {
  typeMetadata: { [multiple ? 'multiReference' : 'reference']: { referencedCollectionId: target } },
});
const shared = [
  ...fields('TEXT', 'title slug summary sourceVersion'),
  field('displayOrder', 'NUMBER'), field('approvedAt', 'DATETIME'),
];
const collection = (id, ownFields) => ({ id, displayName: id, displayField: 'title', fields: [...shared, ...ownFields.map(value => {
  if (value.type !== 'MULTI_REFERENCE') return value;
  const reciprocal = id === 'Countries' && value.key === 'relatedEvents' ? 'countries'
    : id === 'Events' && value.key === 'countries' ? 'relatedEvents'
    : id[0].toLowerCase() + id.slice(1) + value.key[0].toUpperCase() + value.key.slice(1);
  return { ...value, typeMetadata: { multiReference: { ...value.typeMetadata.multiReference, referencingFieldKey: reciprocal, referencingDisplayName: `${id} / ${value.displayName}` } } };
})], permissions: { ...privatePermissions } });

export const collections = [
  collection('Editions', [field('year', 'NUMBER'), field('editionStatus'), field('statement', 'RICH_TEXT'), reference('heroAsset', 'MediaAssets'), reference('relatedEvents', 'Events', true)]),
  collection('Countries', [...fields('TEXT', 'countryName regionLabel'), ...fields('RICH_TEXT', 'introduction interpretation participationSummary'), reference('edition', 'Editions'), reference('principalDesigner', 'Designers'), reference('featuredSymbol', 'Symbols'), reference('heroAsset', 'MediaAssets'), reference('relatedEvents', 'Events', true)]),
  collection('Symbols', [...fields('TEXT', 'approvedName origin acknowledgement'), field('meaning', 'RICH_TEXT'), field('publicSourceUrl', 'URL'), reference('artworkAsset', 'MediaAssets')]),
  collection('Designers', [...fields('TEXT', 'displayName studioName professionalTitle location'), ...fields('RICH_TEXT', 'biography statement'), ...fields('URL', 'professionalUrl socialUrl'), reference('portraitAsset', 'MediaAssets')]),
  collection('Garments', [...fields('TEXT', 'lookNumber technique'), ...fields('RICH_TEXT', 'description publicCredits'), reference('designer', 'Designers'), reference('country', 'Countries'), reference('edition', 'Editions'), reference('heroAsset', 'MediaAssets'), reference('galleryAssets', 'MediaAssets', true), reference('appearances', 'Events', true)]),
  collection('Events', [...fields('TEXT', 'eventType startTimeLocal timezone venue city countryName eventStatus'), ...fields('DATE', 'startDate endDate'), ...fields('RICH_TEXT', 'overview publicPartnerCredits'), field('officialUrl', 'URL'), reference('heroAsset', 'MediaAssets'), reference('galleryAssets', 'MediaAssets', true), reference('resources', 'MediaAssets', true), reference('countries', 'Countries', true), reference('designers', 'Designers', true)]),
  collection('MediaAssets', [...fields('TEXT', 'filename assetType alt caption location creator copyrightHolder creditLine usageTerms downloadLabel'), field('image', 'IMAGE'), field('document', 'DOCUMENT'), field('video', 'VIDEO'), field('date', 'DATE'), field('downloadAllowed', 'BOOLEAN'), field('focalX', 'NUMBER', { numberRange: { min: 0, max: 1 } }), field('focalY', 'NUMBER', { numberRange: { min: 0, max: 1 } })]),
  collection('Stories', [...fields('TEXT', 'headline excerpt authorCredit'), field('body', 'RICH_TEXT'), field('storyDate', 'DATE'), reference('heroAsset', 'MediaAssets'), reference('countries', 'Countries', true), reference('designers', 'Designers', true), reference('events', 'Events', true)]),
];

export function assertNewSite(siteId) {
  if (siteId === EXISTING_EDITOR_SITE_ID || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(siteId ?? '')) {
    throw new Error('A verified, separate Headless site ID is required. Existing Editor site access is forbidden.');
  }
}

export function assertPrivateCollection(actual, expected) {
  if (actual?.id !== expected.id || Object.keys(privatePermissions).some(key => actual.permissions?.[key] !== 'ADMIN')) {
    throw new Error(`Private permissions could not be verified for ${expected.id}.`);
  }
  for (const wanted of expected.fields) {
    const found = actual.fields?.find(value => value.key === wanted.key);
    const target = value => value?.typeMetadata?.reference?.referencedCollectionId ?? value?.typeMetadata?.multiReference?.referencedCollectionId;
    if (!found || found.type !== wanted.type || target(found) !== target(wanted) || found.typeMetadata?.multiReference?.referencingFieldKey !== wanted.typeMetadata?.multiReference?.referencingFieldKey) {
      throw new Error(`Schema mismatch for ${expected.id}.${wanted.key}.`);
    }
  }
}

/** All shells are created before any references, resolving circular relationships. */
export function creationPlan() {
  return [
    ...collections.map(item => ({ method: 'POST', path: '/wix-data/v2/collections', body: { collection: { ...item, fields: item.fields.filter(value => !value.typeMetadata) } } })),
    ...collections.flatMap(item => item.fields.filter(value => value.typeMetadata).map(value => ({ method: 'POST', path: '/wix-data/v2/collections/create-field', body: { dataCollectionId: item.id, field: value } }))),
  ];
}
