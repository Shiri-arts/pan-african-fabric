/** Registry shared with server tooling. Public runtime queries live in wix-cms.ts. */
const collections = new Set([
  'SiteSettings', 'Pages', 'PageSections', 'Editions', 'Regions', 'Countries', 'EditionColours', 'Symbols',
  'Designers', 'Participations', 'Garments', 'Events', 'MediaAssets', 'Stories', 'PressItems',
  'PartnershipOptions', 'ContactChannels', 'ShopItems',
]);
export const PUBLICATION_STATE = 'published-only';
export function publicCollection(collectionId) {
  if (!collections.has(collectionId)) throw new Error('Unknown editorial collection.');
  if (collectionId.endsWith('__drafts')) throw new Error('Draft collections are never public.');
  return Object.freeze({ collectionId, state: PUBLICATION_STATE });
}
