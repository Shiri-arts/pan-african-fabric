import type { Media, MediaRatio, UsagePermission } from './media';

export const PUBLIC_COLLECTION_IDS = [
  'SiteSettings', 'Pages', 'PageSections', 'Editions', 'Regions', 'Countries', 'EditionColours', 'Symbols',
  'Designers', 'Participations', 'Garments', 'Events', 'MediaAssets', 'Stories', 'PressItems',
  'PartnershipOptions', 'ContactChannels', 'ShopItems',
] as const;

export type PublicCollectionId = (typeof PUBLIC_COLLECTION_IDS)[number];
export type CmsItem = Readonly<Record<string, unknown> & { _id?: string }>;
export type SortDirection = 'asc' | 'desc';
export interface PublicQuery {
  readonly filters?: Readonly<Record<string, string | number | boolean>>;
  readonly sort: readonly { readonly field: string; readonly direction: SortDirection }[];
  readonly limit: number;
}
export interface PublicCmsSource {
  query(collectionId: PublicCollectionId, query: PublicQuery): Promise<readonly CmsItem[]>;
  get(collectionId: PublicCollectionId, itemId: string): Promise<CmsItem | undefined>;
}

export interface CmsEntity { readonly id: string; readonly title?: string; readonly slug?: string; readonly summary?: string; readonly displayOrder: number; }
export interface CmsPage extends CmsEntity {
  readonly pageKey: string; readonly path: string; readonly eyebrow?: string; readonly heroTitle?: string;
  readonly heroTagline?: string; readonly introduction?: CmsRichText; readonly heroAssetId?: string;
  readonly heroMetaLabels: readonly string[]; readonly primaryCtaLabel?: string; readonly primaryCtaHref?: string;
  readonly secondaryCtaLabel?: string; readonly secondaryCtaHref?: string; readonly seoTitle?: string;
  readonly seoDescription?: string; readonly robots?: string; readonly socialShareAssetId?: string;
}
export interface CmsPageSection extends CmsEntity {
  readonly pageId: string; readonly sectionKey: string; readonly sectionType?: string; readonly eyebrow?: string;
  readonly heading?: string; readonly subheading?: string; readonly quoteText?: string; readonly quoteAttribution?: string;
  readonly body?: CmsRichText; readonly ctaLabel?: string;
  readonly ctaHref?: string; readonly tone?: string; readonly layoutVariant?: string; readonly mediaCaption?: string;
  readonly isEnabled: boolean; readonly mediaAssetId?: string;
}
export interface CmsNavigationItem {
  readonly id: string; readonly label: string; readonly href: string; readonly location: 'primary' | 'footer';
  readonly displayOrder: number; readonly highlighted: boolean;
}
export interface CmsNavigationState {
  readonly configured: boolean;
  readonly items: readonly CmsNavigationItem[];
}
export interface CmsSiteSettings extends CmsEntity {
  readonly siteName?: string; readonly tagline?: string; readonly headerIdentity?: string; readonly footerStatement?: string;
  readonly copyrightText?: string; readonly defaultSeoTitlePattern?: string; readonly defaultSeoDescription?: string;
  readonly canonicalOrigin?: string; readonly instagramUrl?: string; readonly founderSiteUrl?: string;
  readonly announcementEnabled: boolean; readonly announcementText?: string; readonly announcementLinkLabel?: string;
  readonly announcementLinkUrl?: string;
  readonly primaryEditionId?: string; readonly defaultSeoAssetId?: string; readonly socialShareAssetId?: string;
}
export interface CmsEdition extends CmsEntity {
  readonly year?: number; readonly editionStatus?: string; readonly leadLine?: string;
  readonly statement?: CmsRichText; readonly fabricDescription?: CmsRichText; readonly colourNarrative?: CmsRichText;
  readonly creativeProcess?: CmsRichText; readonly heroAssetId?: string; readonly fabricAssetId?: string;
  readonly relatedEventIds: readonly string[];
}
export interface CmsRegion extends CmsEntity { readonly regionKey?: string; readonly name?: string; readonly description?: CmsRichText; }
export interface CmsCountry extends CmsEntity {
  readonly countryName: string; readonly regionLabel?: string; readonly profileStatus?: string; readonly regionNote?: string;
  readonly introduction?: CmsRichText; readonly interpretation?: CmsRichText; readonly participationSummary?: CmsRichText;
  readonly credits?: CmsRichText; readonly editionId?: string; readonly regionId?: string; readonly principalDesignerId?: string;
  readonly featuredSymbolId?: string; readonly heroAssetId?: string; readonly supportingAssetIds: readonly string[];
  readonly relatedEventIds: readonly string[];
}
export interface CmsEditionColour extends CmsEntity {
  readonly colourName: string; readonly hexValue: string; readonly textHex?: string; readonly sourcePosition?: number;
  readonly contrastRatio?: number; readonly largeTextOnly: boolean; readonly editionId?: string; readonly countryId?: string;
  readonly symbolId?: string; readonly mediaAssetId?: string;
}
export interface CmsSymbol extends CmsEntity {
  readonly approvedName?: string; readonly origin?: string; readonly acknowledgement?: string; readonly meaning?: CmsRichText;
  readonly publicSourceUrl?: string; readonly artworkAssetId?: string;
}
export interface CmsDesigner extends CmsEntity {
  readonly displayName: string; readonly studioName?: string; readonly professionalTitle?: string; readonly location?: string;
  readonly biography?: CmsRichText; readonly statement?: CmsRichText; readonly professionalUrl?: string;
  readonly socialUrl?: string; readonly portraitAssetId?: string;
}
export interface CmsParticipation extends CmsEntity {
  readonly participationRole?: string; readonly participationStatus?: string; readonly publicCredit?: string;
  readonly selectionContext?: string; readonly isPrincipal: boolean; readonly statement?: CmsRichText;
  readonly editionId?: string; readonly countryId?: string; readonly designerId?: string; readonly heroAssetId?: string;
}
export interface CmsGarment extends CmsEntity {
  readonly lookNumber?: string; readonly itemType?: string; readonly technique?: string; readonly collectionLabel?: string;
  readonly description?: CmsRichText; readonly publicCredits?: CmsRichText; readonly participationId?: string;
  readonly designerId?: string; readonly countryId?: string; readonly editionId?: string; readonly heroAssetId?: string;
  readonly galleryAssetIds: readonly string[]; readonly appearanceIds: readonly string[];
}
export interface CmsEvent extends CmsEntity {
  readonly eventType?: string; readonly dateLabel?: string; readonly timeLabel?: string; readonly timezoneLabel?: string;
  readonly venue?: string; readonly location?: string; readonly eventStatus?: string; readonly startsAt?: string;
  readonly endsAt?: string; readonly overview?: CmsRichText; readonly programme?: CmsRichText; readonly admission?: CmsRichText;
  readonly accessibility?: CmsRichText; readonly publicPartnerCredits?: CmsRichText; readonly officialUrl?: string;
  readonly ticketUrl?: string; readonly isConfirmed: boolean; readonly featured: boolean; readonly editionId?: string;
  readonly heroAssetId?: string; readonly galleryAssetIds: readonly string[]; readonly resourceIds: readonly string[];
  readonly countryIds: readonly string[]; readonly designerIds: readonly string[]; readonly participationIds: readonly string[];
}
export interface CmsStory extends CmsEntity {
  readonly headline: string; readonly category?: string; readonly excerpt?: string; readonly standfirst?: string;
  readonly authorCredit?: string; readonly dateLabel?: string; readonly body?: CmsRichText; readonly storyDate?: string;
  readonly publishedDate?: string; readonly heroAssetId?: string; readonly countryIds: readonly string[];
  readonly designerIds: readonly string[]; readonly eventIds: readonly string[];
}
export interface CmsPressItem extends CmsEntity {
  readonly itemType?: string; readonly headline: string; readonly publicationName?: string; readonly dateLabel?: string;
  readonly version?: string; readonly fileSizeLabel?: string; readonly excerpt?: CmsRichText; readonly body?: CmsRichText;
  readonly usageNotes?: CmsRichText; readonly itemDate?: string; readonly externalUrl?: string;
  readonly downloadAllowed: boolean; readonly assetId?: string; readonly relatedEventId?: string; readonly relatedStoryId?: string;
}
export interface CmsPartnershipOption extends CmsEntity {
  readonly optionType?: string; readonly label: string; readonly enquiryValue?: string; readonly description?: CmsRichText;
  readonly mediaAssetId?: string;
}
export interface CmsContactChannel extends CmsEntity {
  readonly channelKey: string; readonly label: string; readonly description?: string; readonly emailAddress?: string;
  readonly responseNote?: string;
}
export interface CmsShopItem extends CmsEntity {
  readonly wixProductId?: string; readonly itemType?: string; readonly availabilityLabel?: string; readonly variantLabel?: string;
  readonly editorialStory?: CmsRichText; readonly fulfilment?: CmsRichText; readonly commerceEnabled: boolean;
  readonly editionId?: string; readonly countryId?: string; readonly garmentId?: string; readonly heroAssetId?: string;
  readonly galleryAssetIds: readonly string[]; readonly relatedStoryIds: readonly string[];
}
/** Wix CMS RICH_TEXT is delivered as an HTML string. */
export type CmsRichText = string;

const PUBLIC_COLLECTIONS = new Set<string>(PUBLIC_COLLECTION_IDS);
const RATIOS = new Set<MediaRatio>(['16/9', '3/2', '4/5', '1/1', '21/9', '5/4']);
const PERMISSIONS = new Set<UsagePermission>(['web-display-approved', 'download-approved']);
const SAFE_HEX = /^#[0-9a-f]{6}$/i;
const SAFE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SAFE_PAGE_KEY = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DEFAULT_LIMIT = 100;

const relativeLuminance = (hex: string): number => {
  const channels = [1, 3, 5].map(offset => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255)
    .map(channel => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
};

export const colourContrast = (background: string, foreground: string): number | undefined => {
  if (!SAFE_HEX.test(background) || !SAFE_HEX.test(foreground)) return undefined;
  const values = [relativeLuminance(background), relativeLuminance(foreground)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
};

export function assertPublicCollection(collectionId: string): asserts collectionId is PublicCollectionId {
  if (!PUBLIC_COLLECTIONS.has(collectionId) || collectionId.endsWith('__drafts')) throw new Error(`Unsupported public CMS collection: ${collectionId}`);
}

const text = (value: unknown, max = 10000): string | undefined => {
  if (typeof value !== 'string') return undefined;
  const result = value.trim();
  return result && result.length <= max ? result : undefined;
};
const finiteNumber = (value: unknown): number | undefined => typeof value === 'number' && Number.isFinite(value) ? value : undefined;
const order = (value: unknown): number => finiteNumber(value) ?? Number.MAX_SAFE_INTEGER;
const bool = (value: unknown): boolean => value === true;
const ref = (value: unknown): string | undefined => typeof value === 'string' ? text(value, 100) : value && typeof value === 'object'
  ? text((value as Record<string, unknown>)._id, 100) ?? text((value as Record<string, unknown>).id, 100) : undefined;
const refs = (value: unknown): readonly string[] => Array.isArray(value) ? [...new Set(value.map(ref).filter((id): id is string => Boolean(id)))] : [];
const isoDate = (value: unknown): string | undefined => {
  if (value instanceof Date && Number.isFinite(value.getTime())) return value.toISOString();
  const raw = text(value, 100);
  return raw && Number.isFinite(Date.parse(raw)) ? new Date(raw).toISOString() : undefined;
};
export function safePublicUrl(value: unknown, options: { allowRelative?: boolean; allowMailto?: boolean } = {}): string | undefined {
  const raw = text(value, 2048);
  if (!raw || /[\u0000-\u001f\u007f]/.test(raw)) return undefined;
  if (options.allowRelative && raw.startsWith('/') && !raw.startsWith('//')) return raw;
  if (options.allowMailto && /^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(raw)) return raw;
  try { const parsed = new URL(raw); return parsed.protocol === 'https:' ? parsed.toString() : undefined; } catch { return undefined; }
}
const rich = (value: unknown): CmsRichText | undefined => {
  const html = text(value, 100000);
  if (!html || /<(?:script|style|iframe|object|embed|svg|math|form|input|button)\b/i.test(html)
    || /(?:javascript|vbscript|data):/i.test(html)) return undefined;
  return html;
};
const base = (item: CmsItem): CmsEntity | undefined => {
  const id = text(item._id, 100);
  if (!id) return undefined;
  return { id, title: text(item.title, 300), slug: text(item.slug, 180), summary: text(item.summary, 1000), displayOrder: order(item.displayOrder) };
};
const withBase = <T extends object>(item: CmsItem, mapped: T): (CmsEntity & T) | undefined => {
  const common = base(item); return common ? { ...common, ...mapped } : undefined;
};

function imageSource(value: unknown, width: number, height: number, scaleWixImage: (uri: string, width: number, height: number) => string): string | undefined {
  const raw = typeof value === 'string' ? value : value && typeof value === 'object' ? text((value as Record<string, unknown>).url, 4096) : undefined;
  if (!raw) return undefined;
  if (raw.startsWith('wix:image://')) return scaleWixImage(raw, width, height);
  return safePublicUrl(raw);
}
export function mapMedia(item: CmsItem | undefined, scaleWixImage: (uri: string, width: number, height: number) => string): Media | undefined {
  if (!item) return undefined;
  const width = finiteNumber(item.width) && Number(item.width) > 0 ? Number(item.width) : 1600;
  const height = finiteNumber(item.height) && Number(item.height) > 0 ? Number(item.height) : 900;
  const src = imageSource(item.image, width, height, scaleWixImage);
  const permission = text(item.usagePermission, 50) as UsagePermission | undefined;
  const decorative = bool(item.decorative);
  const alt = text(item.alt, 500);
  if (!src || !permission || !PERMISSIONS.has(permission) || (!decorative && !alt)) return undefined;
  const mobileWidth = finiteNumber(item.mobileWidth) && Number(item.mobileWidth) > 0 ? Number(item.mobileWidth) : width;
  const mobileHeight = finiteNumber(item.mobileHeight) && Number(item.mobileHeight) > 0 ? Number(item.mobileHeight) : height;
  const mobileSrc = imageSource(item.mobileImage, mobileWidth, mobileHeight, scaleWixImage);
  const ratioValue = text(item.ratio, 20) as MediaRatio | undefined;
  const creditLine = text(item.creditLine, 500); const creator = text(item.creator, 300); const copyrightHolder = text(item.copyrightHolder, 300);
  return {
    id: text(item._id, 100) ?? text(item.slug, 180) ?? 'cms-media', alt, decorative,
    ratio: ratioValue && RATIOS.has(ratioValue) ? ratioValue : '3/2', focal: text(item.focalPosition, 40) ?? '50% 50%',
    desktop: { src, width, height }, mobile: mobileSrc ? { src: mobileSrc, width: mobileWidth, height: mobileHeight } : undefined,
    desktopFrom: mobileSrc ? '48rem' : undefined, sizes: '100vw', caption: text(item.caption, 1000),
    credit: creditLine || creator || copyrightHolder ? { creditLine, creator, copyrightHolder } : undefined, permission,
  };
}

export function createCmsContentAccess(source: PublicCmsSource, scaleWixImage: (uri: string, width: number, height: number) => string) {
  const query = async (collectionId: PublicCollectionId, options: Partial<PublicQuery> = {}): Promise<readonly CmsItem[]> => {
    assertPublicCollection(collectionId);
    const requested = options.limit ?? DEFAULT_LIMIT;
    const limit = Math.max(1, Math.min(DEFAULT_LIMIT, Number.isFinite(requested) ? Math.floor(requested) : DEFAULT_LIMIT));
    try { return await source.query(collectionId, { filters: options.filters, sort: options.sort ?? [{ field: 'displayOrder', direction: 'asc' }, { field: '_id', direction: 'asc' }], limit }); }
    catch { return []; }
  };
  const get = async (collectionId: PublicCollectionId, id: string): Promise<CmsItem | undefined> => {
    assertPublicCollection(collectionId); if (!text(id, 100)) return undefined;
    try { return await source.get(collectionId, id); } catch { return undefined; }
  };
  const one = async (collectionId: PublicCollectionId, filters: Readonly<Record<string, string | number | boolean>>): Promise<CmsItem | undefined> =>
    (await query(collectionId, { filters, limit: 1, sort: [{ field: '_id', direction: 'asc' }] }))[0];
  const mediaFor = async (value: unknown): Promise<Media | undefined> => {
    if (value && typeof value === 'object' && ('image' in value || 'usagePermission' in value)) return mapMedia(value as CmsItem, scaleWixImage);
    const id = ref(value); return id ? mapMedia(await get('MediaAssets', id), scaleWixImage) : undefined;
  };

  const mapPage = (item: CmsItem): CmsPage | undefined => {
    const pageKey = text(item.pageKey, 100); const path = safePublicUrl(item.path, { allowRelative: true });
    if (!pageKey || !SAFE_PAGE_KEY.test(pageKey) || !path) return undefined;
    return withBase(item, { pageKey, path, eyebrow: text(item.eyebrow, 160), heroTitle: text(item.heroTitle, 300), heroTagline: text(item.heroTagline, 500),
      introduction: rich(item.introduction), heroAssetId: ref(item.heroAsset), heroMetaLabels: Array.isArray(item.heroMetaLabels)
        ? item.heroMetaLabels.map(value => text(value, 100)).filter((value): value is string => Boolean(value)).slice(0, 8) : [],
      primaryCtaLabel: text(item.primaryCtaLabel, 100), primaryCtaHref: safePublicUrl(item.primaryCtaHref, { allowRelative: true }),
      secondaryCtaLabel: text(item.secondaryCtaLabel, 100), secondaryCtaHref: safePublicUrl(item.secondaryCtaHref, { allowRelative: true }),
      seoTitle: text(item.seoTitle, 300), seoDescription: text(item.seoDescription, 500), robots: text(item.robots, 100), socialShareAssetId: ref(item.socialShareAsset) });
  };
  const mapEdition = (item: CmsItem): CmsEdition | undefined => withBase(item, { year: finiteNumber(item.year), editionStatus: text(item.editionStatus, 100),
    leadLine: text(item.leadLine, 500), statement: rich(item.statement), fabricDescription: rich(item.fabricDescription), colourNarrative: rich(item.colourNarrative),
    creativeProcess: rich(item.creativeProcess), heroAssetId: ref(item.heroAsset), fabricAssetId: ref(item.fabricAsset), relatedEventIds: refs(item.relatedEvents) });

  return Object.freeze({
    async getSiteSettings(): Promise<CmsSiteSettings | undefined> { const item = (await query('SiteSettings', { limit: 1 }))[0]; return item ? withBase(item, {
      siteName: text(item.siteName, 200), tagline: text(item.tagline, 300), headerIdentity: text(item.headerIdentity, 200), footerStatement: text(item.footerStatement, 1000),
      copyrightText: text(item.copyrightText, 500), defaultSeoTitlePattern: text(item.defaultSeoTitlePattern, 300), defaultSeoDescription: text(item.defaultSeoDescription, 500),
      canonicalOrigin: safePublicUrl(item.canonicalOrigin), instagramUrl: safePublicUrl(item.instagramUrl), founderSiteUrl: safePublicUrl(item.founderSiteUrl),
      announcementEnabled: bool(item.announcementEnabled), announcementText: text(item.announcementText, 500), announcementLinkLabel: text(item.announcementLinkLabel, 100),
      announcementLinkUrl: safePublicUrl(item.announcementLinkUrl, { allowRelative: true }), primaryEditionId: ref(item.primaryEdition),
      defaultSeoAssetId: ref(item.defaultSeoAsset), socialShareAssetId: ref(item.socialShareAsset),
    }) : undefined; },
    async getPrimaryNavigation(): Promise<readonly CmsNavigationItem[]> { return navigation('primary'); },
    async getFooterNavigation(): Promise<readonly CmsNavigationItem[]> { return navigation('footer'); },
    async getPrimaryNavigationState(): Promise<CmsNavigationState> { return navigationState('primary'); },
    async getFooterNavigationState(): Promise<CmsNavigationState> { return navigationState('footer'); },
    async getPageByKey(pageKey: string): Promise<CmsPage | undefined> { if (!SAFE_PAGE_KEY.test(pageKey)) return undefined; const item = await one('Pages', { pageKey }); return item ? mapPage(item) : undefined; },
    async getPageSections(pageKey: string): Promise<readonly CmsPageSection[]> {
      const page = await this.getPageByKey(pageKey); if (!page) return [];
      const sections: CmsPageSection[] = [];
      for (const item of await query('PageSections', { filters: { page: page.id } })) {
        const sectionKey = text(item.sectionKey, 100); if (!sectionKey || ref(item.page) !== page.id) continue;
        const section = withBase(item, { pageId: page.id, sectionKey, sectionType: text(item.sectionType, 100), eyebrow: text(item.eyebrow, 160), heading: text(item.heading, 300),
          subheading: text(item.subheading, 500), quoteText: text(item.quoteText, 2000), quoteAttribution: text(item.quoteAttribution, 500),
          body: rich(item.body), ctaLabel: text(item.ctaLabel, 100), ctaHref: safePublicUrl(item.ctaHref, { allowRelative: true }),
          tone: text(item.tone, 100), layoutVariant: text(item.layoutVariant, 100), mediaCaption: text(item.mediaCaption, 1000), isEnabled: item.isEnabled !== false,
          mediaAssetId: ref(item.mediaAsset) });
        if (section) sections.push(section);
      }
      return sections;
    },
    async getPrimaryEdition(): Promise<CmsEdition | undefined> { const settings = await this.getSiteSettings(); const item = settings?.primaryEditionId ? await get('Editions', settings.primaryEditionId) : (await query('Editions', { limit: 1, sort: [{ field: 'year', direction: 'desc' }, { field: '_id', direction: 'asc' }] }))[0]; return item ? mapEdition(item) : undefined; },
    async getEditionCountries(editionId: string): Promise<readonly CmsCountry[]> { return mapList('Countries', { edition: editionId }, mapCountry); },
    async getCountryBySlug(slug: string): Promise<CmsCountry | undefined> { return bySlug('Countries', slug, mapCountry); },
    async getEditionColours(editionId?: string): Promise<readonly CmsEditionColour[]> { return mapList('EditionColours', editionId ? { edition: editionId } : undefined, mapColour, [{ field: 'sourcePosition', direction: 'asc' }, { field: '_id', direction: 'asc' }]); },
    async getRegions(): Promise<readonly CmsRegion[]> { return mapList('Regions', undefined, item => withBase(item, { regionKey: text(item.regionKey, 100), name: text(item.name, 200), description: rich(item.description) })); },
    async getSymbols(): Promise<readonly CmsSymbol[]> { return mapList('Symbols', undefined, item => withBase(item, { approvedName: text(item.approvedName, 300), origin: text(item.origin, 300), acknowledgement: text(item.acknowledgement, 1000), meaning: rich(item.meaning), publicSourceUrl: safePublicUrl(item.publicSourceUrl), artworkAssetId: ref(item.artworkAsset) })); },
    async getDesigners(): Promise<readonly CmsDesigner[]> { return mapList('Designers', undefined, mapDesigner); },
    async getDesignerBySlug(slug: string): Promise<CmsDesigner | undefined> { return bySlug('Designers', slug, mapDesigner); },
    async getParticipations(filters: { editionId?: string; countryId?: string; designerId?: string } = {}): Promise<readonly CmsParticipation[]> { const f = compact({ edition: filters.editionId, country: filters.countryId, designer: filters.designerId }); return mapList('Participations', f, mapParticipation); },
    async getGarments(filters: { editionId?: string; countryId?: string; designerId?: string } = {}): Promise<readonly CmsGarment[]> { const f = compact({ edition: filters.editionId, country: filters.countryId, designer: filters.designerId }); return mapList('Garments', f, mapGarment); },
    async getUpcomingEvents(now: Date = new Date()): Promise<readonly CmsEvent[]> { const cutoff = Number.isFinite(now.getTime()) ? now.getTime() : Date.now(); return (await mapList('Events', { isConfirmed: true }, mapEvent, [{ field: 'startsAt', direction: 'asc' }, { field: '_id', direction: 'asc' }])).filter(event => event.startsAt && Date.parse(event.startsAt) >= cutoff); },
    async getEventBySlug(slug: string): Promise<CmsEvent | undefined> { return bySlug('Events', slug, mapEvent); },
    async getPublishedStories(): Promise<readonly CmsStory[]> { return mapList('Stories', undefined, mapStory, [{ field: 'publishedDate', direction: 'desc' }, { field: '_id', direction: 'asc' }]); },
    async getStoryBySlug(slug: string): Promise<CmsStory | undefined> { return bySlug('Stories', slug, mapStory); },
    async getPressItems(): Promise<readonly CmsPressItem[]> { return mapList('PressItems', undefined, mapPress, [{ field: 'itemDate', direction: 'desc' }, { field: '_id', direction: 'asc' }]); },
    async getPartnershipOptions(): Promise<readonly CmsPartnershipOption[]> { return mapList('PartnershipOptions', { isEnabled: true }, mapPartnership); },
    async getContactChannels(): Promise<readonly CmsContactChannel[]> { return mapList('ContactChannels', { isEnabled: true, publicUseVerified: true }, mapContact); },
    async getShopItems(): Promise<readonly CmsShopItem[]> { return mapList('ShopItems', undefined, mapShop); },
    async getShopItemBySlug(slug: string): Promise<CmsShopItem | undefined> { return bySlug('ShopItems', slug, mapShop); },
    async getMediaById(id: string): Promise<Media | undefined> { return mediaFor(id); },
    async getPageHeroMedia(pageKey: string): Promise<Media | undefined> { const page = await this.getPageByKey(pageKey); return page?.heroAssetId ? mediaFor(page.heroAssetId) : undefined; },
    async getPageSectionMedia(pageKey: string, sectionKey: string): Promise<Media | undefined> { const section = (await this.getPageSections(pageKey)).find(value => value.sectionKey === sectionKey); return section?.mediaAssetId ? mediaFor(section.mediaAssetId) : undefined; },
  });

  async function navigation(location: 'primary' | 'footer'): Promise<readonly CmsNavigationItem[]> {
    return (await navigationState(location)).items;
  }
  async function navigationState(location: 'primary' | 'footer'): Promise<CmsNavigationState> {
    const visibilityField = location === 'primary' ? 'navigationVisible' : 'footerNavigationVisible';
    const orderField = location === 'primary' ? 'navigationOrder' : 'footerNavigationOrder';
    const pages = await query('Pages', { sort: [{ field: orderField, direction: 'asc' }, { field: '_id', direction: 'asc' }] });
    const configured = pages.some(item => typeof item[visibilityField] === 'boolean');
    const items = pages.filter(item => item[visibilityField] === true).map(item => {
      const id = text(item._id, 100); const label = text(location === 'primary' ? item.navigationLabel : item.footerNavigationLabel, 100) ?? text(item.title, 100);
      const href = safePublicUrl(item.path, { allowRelative: true });
      return id && label && href ? { id, label, href, location, displayOrder: order(location === 'primary' ? item.navigationOrder : item.footerNavigationOrder), highlighted: bool(item.navigationHighlighted) } : undefined;
    }).filter((value): value is CmsNavigationItem => Boolean(value));
    return { configured, items };
  }
  async function mapList<T>(collection: PublicCollectionId, filters: Readonly<Record<string, string | number | boolean>> | undefined, mapper: (item: CmsItem) => T | undefined, sort?: PublicQuery['sort']): Promise<readonly T[]> {
    return (await query(collection, { filters, sort })).map(mapper).filter((value): value is T => Boolean(value));
  }
  async function bySlug<T>(collection: PublicCollectionId, slug: string, mapper: (item: CmsItem) => T | undefined): Promise<T | undefined> {
    if (!SAFE_SLUG.test(slug)) return undefined; const item = await one(collection, { slug }); return item ? mapper(item) : undefined;
  }
  function compact(values: Record<string, string | undefined>): Readonly<Record<string, string>> | undefined { const entries = Object.entries(values).filter((entry): entry is [string, string] => Boolean(entry[1])); return entries.length ? Object.fromEntries(entries) : undefined; }
  function mapCountry(item: CmsItem): CmsCountry | undefined { const countryName = text(item.countryName, 200); if (!countryName) return undefined; return withBase(item, { countryName, regionLabel: text(item.regionLabel, 200), profileStatus: text(item.profileStatus, 100), regionNote: text(item.regionNote, 1000), introduction: rich(item.introduction), interpretation: rich(item.interpretation), participationSummary: rich(item.participationSummary), credits: rich(item.credits), editionId: ref(item.edition), regionId: ref(item.region), principalDesignerId: ref(item.principalDesigner), featuredSymbolId: ref(item.featuredSymbol), heroAssetId: ref(item.heroAsset), supportingAssetIds: refs(item.supportingAssets), relatedEventIds: refs(item.relatedEvents) }); }
  function mapColour(item: CmsItem): CmsEditionColour | undefined {
    const colourName = text(item.colourName, 100); const hexValue = text(item.hexValue, 7); const textHex = text(item.textHex, 7);
    const contrastRatio = hexValue && textHex ? colourContrast(hexValue, textHex) : undefined;
    const largeTextOnly = bool(item.largeTextOnly);
    if (!colourName || !hexValue || !textHex || contrastRatio === undefined || contrastRatio < 4.5 || largeTextOnly) return undefined;
    return withBase(item, { colourName, hexValue, textHex, sourcePosition: finiteNumber(item.sourcePosition), contrastRatio, largeTextOnly,
      editionId: ref(item.edition), countryId: ref(item.country), symbolId: ref(item.symbol), mediaAssetId: ref(item.mediaAsset) });
  }
  function mapDesigner(item: CmsItem): CmsDesigner | undefined { const displayName = text(item.displayName, 300); if (!displayName) return undefined; return withBase(item, { displayName, studioName: text(item.studioName, 300), professionalTitle: text(item.professionalTitle, 300), location: text(item.location, 300), biography: rich(item.biography), statement: rich(item.statement), professionalUrl: safePublicUrl(item.professionalUrl), socialUrl: safePublicUrl(item.socialUrl), portraitAssetId: ref(item.portraitAsset) }); }
  function mapParticipation(item: CmsItem): CmsParticipation | undefined { return withBase(item, { participationRole: text(item.participationRole, 200), participationStatus: text(item.participationStatus, 100), publicCredit: text(item.publicCredit, 500), selectionContext: text(item.selectionContext, 1000), isPrincipal: bool(item.isPrincipal), statement: rich(item.statement), editionId: ref(item.edition), countryId: ref(item.country), designerId: ref(item.designer), heroAssetId: ref(item.heroAsset) }); }
  function mapGarment(item: CmsItem): CmsGarment | undefined { return withBase(item, { lookNumber: text(item.lookNumber, 100), itemType: text(item.itemType, 100), technique: text(item.technique, 300), collectionLabel: text(item.collectionLabel, 300), description: rich(item.description), publicCredits: rich(item.publicCredits), participationId: ref(item.participation), designerId: ref(item.designer), countryId: ref(item.country), editionId: ref(item.edition), heroAssetId: ref(item.heroAsset), galleryAssetIds: refs(item.galleryAssets), appearanceIds: refs(item.appearances) }); }
  function mapEvent(item: CmsItem): CmsEvent | undefined { return withBase(item, { eventType: text(item.eventType, 100), dateLabel: text(item.dateLabel, 200), timeLabel: text(item.timeLabel, 200), timezoneLabel: text(item.timezoneLabel, 100), venue: text(item.venue, 500), location: text(item.location, 500), eventStatus: text(item.eventStatus, 100), startsAt: isoDate(item.startsAt), endsAt: isoDate(item.endsAt), overview: rich(item.overview), programme: rich(item.programme), admission: rich(item.admission), accessibility: rich(item.accessibility), publicPartnerCredits: rich(item.publicPartnerCredits), officialUrl: safePublicUrl(item.officialUrl), ticketUrl: safePublicUrl(item.ticketUrl), isConfirmed: bool(item.isConfirmed), featured: bool(item.featured), editionId: ref(item.edition), heroAssetId: ref(item.heroAsset), galleryAssetIds: refs(item.galleryAssets), resourceIds: refs(item.resources), countryIds: refs(item.countries), designerIds: refs(item.designers), participationIds: refs(item.participations) }); }
  function mapStory(item: CmsItem): CmsStory | undefined { const headline = text(item.headline, 300) ?? text(item.title, 300); if (!headline) return undefined; return withBase(item, { headline, category: text(item.category, 100), excerpt: text(item.excerpt, 1000), standfirst: text(item.standfirst, 2000), authorCredit: text(item.authorCredit, 300), dateLabel: text(item.dateLabel, 200), body: rich(item.body), storyDate: isoDate(item.storyDate), publishedDate: isoDate(item.publishedDate), heroAssetId: ref(item.heroAsset), countryIds: refs(item.countries), designerIds: refs(item.designers), eventIds: refs(item.events) }); }
  function mapPress(item: CmsItem): CmsPressItem | undefined { const headline = text(item.headline, 300) ?? text(item.title, 300); if (!headline) return undefined; return withBase(item, { itemType: text(item.itemType, 100), headline, publicationName: text(item.publicationName, 300), dateLabel: text(item.dateLabel, 200), version: text(item.version, 100), fileSizeLabel: text(item.fileSizeLabel, 100), excerpt: rich(item.excerpt), body: rich(item.body), usageNotes: rich(item.usageNotes), itemDate: isoDate(item.itemDate), externalUrl: safePublicUrl(item.externalUrl), downloadAllowed: bool(item.downloadAllowed), assetId: ref(item.asset), relatedEventId: ref(item.relatedEvent), relatedStoryId: ref(item.relatedStory) }); }
  function mapPartnership(item: CmsItem): CmsPartnershipOption | undefined { const label = text(item.label, 200); if (!label || item.isEnabled === false) return undefined; return withBase(item, { optionType: text(item.optionType, 100), label, enquiryValue: text(item.enquiryValue, 300), description: rich(item.description), mediaAssetId: ref(item.mediaAsset) }); }
  function mapContact(item: CmsItem): CmsContactChannel | undefined { const channelKey = text(item.channelKey, 100); const label = text(item.label, 200); const email = text(item.emailAddress, 320); if (!channelKey || !label || !bool(item.publicUseVerified) || item.isEnabled === false) return undefined; return withBase(item, { channelKey, label, description: text(item.description, 1000), emailAddress: email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : undefined, responseNote: text(item.responseNote, 1000) }); }
  function mapShop(item: CmsItem): CmsShopItem | undefined { return withBase(item, { wixProductId: text(item.wixProductId, 100), itemType: text(item.itemType, 100), availabilityLabel: text(item.availabilityLabel, 200), variantLabel: text(item.variantLabel, 200), editorialStory: rich(item.editorialStory), fulfilment: rich(item.fulfilment), commerceEnabled: bool(item.commerceEnabled), editionId: ref(item.edition), countryId: ref(item.country), garmentId: ref(item.garment), heroAssetId: ref(item.heroAsset), galleryAssetIds: refs(item.galleryAssets), relatedStoryIds: refs(item.relatedStories) }); }
}
