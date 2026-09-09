import { items as itemsModule } from '@wix/data';
import { media as wixMedia } from '@wix/sdk';
import type { Media, MediaRatio, UsagePermission } from './media';

const items = itemsModule;
const PUBLIC_COLLECTIONS = new Set([
  'SiteSettings', 'Pages', 'PageSections', 'Editions', 'Regions', 'Countries', 'EditionColours', 'Symbols',
  'Designers', 'Participations', 'Garments', 'Events', 'MediaAssets', 'Stories', 'PressItems',
  'PartnershipOptions', 'ContactChannels', 'ShopItems',
]);
const RATIOS = new Set<MediaRatio>(['16/9', '3/2', '4/5', '1/1', '21/9', '5/4']);
const PERMISSIONS = new Set<UsagePermission>(['web-display-approved', 'download-approved']);

type CmsItem = Record<string, unknown> & { _id?: string };

function assertPublishedCollection(collectionId: string): void {
  if (!PUBLIC_COLLECTIONS.has(collectionId) || collectionId.endsWith('__drafts')) {
    throw new Error(`Unsupported public CMS collection: ${collectionId}`);
  }
}

async function queryOne(collectionId: string, field: string, value: string): Promise<CmsItem | undefined> {
  assertPublishedCollection(collectionId);
  try {
    const result = await items.query(collectionId).eq(field, value).limit(1).find();
    return result.items?.[0] as CmsItem | undefined;
  } catch (error) {
    console.warn(`Published CMS query failed for ${collectionId}.`, error instanceof Error ? error.message : 'Unknown error');
    return undefined;
  }
}

async function getById(collectionId: string, itemId: string): Promise<CmsItem | undefined> {
  assertPublishedCollection(collectionId);
  try {
    return (await items.get(collectionId, itemId)) as CmsItem | undefined;
  } catch (error) {
    console.warn(`Published CMS item could not be read from ${collectionId}.`, error instanceof Error ? error.message : 'Unknown error');
    return undefined;
  }
}

function referenceId(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (!value || typeof value !== 'object') return undefined;
  const record = value as Record<string, unknown>;
  return typeof record._id === 'string' ? record._id : typeof record.id === 'string' ? record.id : undefined;
}

function imageSource(value: unknown, width: number, height: number): string | undefined {
  const raw = typeof value === 'string'
    ? value
    : value && typeof value === 'object' && typeof (value as Record<string, unknown>).url === 'string'
      ? String((value as Record<string, unknown>).url)
      : undefined;
  if (!raw) return undefined;
  return raw.startsWith('wix:image://') ? wixMedia.getScaledToFillImageUrl(raw, width, height, {}) : raw;
}

function asText(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function toMedia(item: CmsItem | undefined): Media | undefined {
  if (!item) return undefined;
  const width = typeof item.width === 'number' && item.width > 0 ? item.width : 1600;
  const height = typeof item.height === 'number' && item.height > 0 ? item.height : 900;
  const src = imageSource(item.image, width, height);
  const permission = asText(item.usagePermission) as UsagePermission | undefined;
  const decorative = item.decorative === true;
  const alt = asText(item.alt);
  if (!src || !permission || !PERMISSIONS.has(permission) || (!decorative && !alt)) return undefined;

  const ratioCandidate = asText(item.ratio) as MediaRatio | undefined;
  const ratio = ratioCandidate && RATIOS.has(ratioCandidate) ? ratioCandidate : '3/2';
  const creditLine = asText(item.creditLine);
  const creator = asText(item.creator);
  const copyrightHolder = asText(item.copyrightHolder);
  return {
    id: item._id ?? asText(item.slug) ?? 'cms-media',
    alt,
    decorative,
    ratio,
    focal: asText(item.focalPosition) ?? '50% 50%',
    desktop: { src, width, height },
    sizes: '100vw',
    caption: asText(item.caption),
    credit: creditLine || creator || copyrightHolder ? { creditLine, creator, copyrightHolder } : undefined,
    permission,
  };
}

async function referencedMedia(value: unknown): Promise<Media | undefined> {
  if (value && typeof value === 'object' && ('image' in value || 'usagePermission' in value)) {
    return toMedia(value as CmsItem);
  }
  const id = referenceId(value);
  return id ? toMedia(await getById('MediaAssets', id)) : undefined;
}

/** Reads only the published base collections. Draft shadow IDs are never accepted. */
export async function getPageHeroMedia(pageKey: string): Promise<Media | undefined> {
  const page = await queryOne('Pages', 'pageKey', pageKey);
  return referencedMedia(page?.heroAsset);
}

/** Resolves PageSections.page -> Pages and PageSections.mediaAsset -> MediaAssets. */
export async function getPageSectionMedia(pageKey: string, sectionKey: string): Promise<Media | undefined> {
  const page = await queryOne('Pages', 'pageKey', pageKey);
  const pageId = referenceId(page);
  if (!pageId) return undefined;
  const section = await queryOne('PageSections', 'sectionKey', sectionKey);
  if (!section || referenceId(section.page) !== pageId || section.isEnabled === false) return undefined;
  return referencedMedia(section.mediaAsset);
}
