import { items as itemsModule } from '@wix/data';
import { media as wixMedia } from '@wix/sdk';
import { createCmsContentAccess, type CmsItem, type PublicCmsSource, type PublicCollectionId, type PublicQuery } from './cms-content';

export * from './cms-content';

const source: PublicCmsSource = {
  async query(collectionId: PublicCollectionId, options: PublicQuery): Promise<readonly CmsItem[]> {
    let request = itemsModule.query(collectionId);
    for (const [field, value] of Object.entries(options.filters ?? {})) request = request.eq(field, value);
    for (const sort of options.sort) request = sort.direction === 'asc' ? request.ascending(sort.field) : request.descending(sort.field);
    const result = await request.limit(options.limit).find();
    return (result.items ?? []) as CmsItem[];
  },
  async get(collectionId: PublicCollectionId, itemId: string): Promise<CmsItem | undefined> {
    return (await itemsModule.get(collectionId, itemId)) as CmsItem | undefined;
  },
};

const cms = createCmsContentAccess(source, (uri, width, height) => wixMedia.getScaledToFillImageUrl(uri, width, height, {}));

export const getSiteSettings = cms.getSiteSettings.bind(cms);
export const getPrimaryNavigation = cms.getPrimaryNavigation.bind(cms);
export const getFooterNavigation = cms.getFooterNavigation.bind(cms);
export const getPrimaryNavigationState = cms.getPrimaryNavigationState.bind(cms);
export const getFooterNavigationState = cms.getFooterNavigationState.bind(cms);
export const getPageByKey = cms.getPageByKey.bind(cms);
export const getPageSections = cms.getPageSections.bind(cms);
export const getPrimaryEdition = cms.getPrimaryEdition.bind(cms);
export const getEditionCountries = cms.getEditionCountries.bind(cms);
export const getCountryBySlug = cms.getCountryBySlug.bind(cms);
export const getEditionColours = cms.getEditionColours.bind(cms);
export const getRegions = cms.getRegions.bind(cms);
export const getSymbols = cms.getSymbols.bind(cms);
export const getDesigners = cms.getDesigners.bind(cms);
export const getDesignerBySlug = cms.getDesignerBySlug.bind(cms);
export const getParticipations = cms.getParticipations.bind(cms);
export const getGarments = cms.getGarments.bind(cms);
export const getUpcomingEvents = cms.getUpcomingEvents.bind(cms);
export const getEventBySlug = cms.getEventBySlug.bind(cms);
export const getPublishedStories = cms.getPublishedStories.bind(cms);
export const getStoryBySlug = cms.getStoryBySlug.bind(cms);
export const getPressItems = cms.getPressItems.bind(cms);
export const getPartnershipOptions = cms.getPartnershipOptions.bind(cms);
export const getContactChannels = cms.getContactChannels.bind(cms);
export const getShopItems = cms.getShopItems.bind(cms);
export const getShopItemBySlug = cms.getShopItemBySlug.bind(cms);
export const getMediaById = cms.getMediaById.bind(cms);

// Preserve the initial Phase 1 API while routing it through the same safe access layer.
export const getPageHeroMedia = cms.getPageHeroMedia.bind(cms);
export const getPageSectionMedia = cms.getPageSectionMedia.bind(cms);
