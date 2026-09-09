/** No administrative transport enters the frontend bundle. Publication is gated in Phase 1. */
const collections = new Set([
  'SiteSettings', 'Pages', 'PageSections', 'Editions', 'Regions', 'Countries', 'EditionColours', 'Symbols',
  'Designers', 'Participations', 'Garments', 'Events', 'MediaAssets', 'Stories', 'PressItems',
  'PartnershipOptions', 'ContactChannels', 'ShopItems',
]);
export const PUBLICATION_STATE = 'disabled-phase-1';
export function getPublicContent(collectionId) {
  if (!collections.has(collectionId)) throw new Error('Unknown editorial collection.');
  return Object.freeze({ items: Object.freeze([]), state: PUBLICATION_STATE });
}
