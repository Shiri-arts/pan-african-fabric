import type {
  CmsEvent,
  CmsPageSection,
  CmsRichText,
  CmsShopItem,
  CmsStory,
} from './cms-content';
import { mediaSlot, type Media } from './media';
import type { EventKind, EventRecord } from '../data/events';
import { storyCategories, type StoryCategory, type StoryRecord } from '../data/stories';
import type { ProductRecord } from '../data/shop';
import { cmsRichTextPlainText } from './safe-rich-text';

type MediaLoader = (id: string) => Promise<Media | undefined>;

const EVENT_KINDS = new Set<EventKind>([
  'showcase', 'exhibition', 'workshop', 'competition', 'reception', 'talk', 'travelling',
]);

export function escapeCmsHeading(value: string | undefined, fallbackMarkup: string): string {
  if (!value) return fallbackMarkup;
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

export function cmsPlainText(value: CmsRichText | undefined): string | undefined {
  return cmsRichTextPlainText(value);
}

export function cmsStoryBlocks(value: CmsRichText | undefined): StoryRecord['body'] {
  return (cmsRichTextPlainText(value) ?? '').split(/\n\s*\n/).map(text => text.trim()).filter(Boolean)
    .map(text => ({ type: 'paragraph' as const, text }));
}

async function mediaOrSlot(id: string | undefined, loader: MediaLoader, ratio: Media['ratio'], note: string): Promise<Media> {
  return (id ? await loader(id) : undefined) ?? mediaSlot(id ?? `cms-${ratio.replace('/', '-')}`, ratio, note);
}

export async function presentCmsEvent(event: CmsEvent, getMedia: MediaLoader): Promise<EventRecord | undefined> {
  const kind = event.eventType as EventKind | undefined;
  if (!event.slug || !event.title || !kind || !EVENT_KINDS.has(kind) || !event.isConfirmed
    || !event.dateLabel || !event.venue || !event.location) return undefined;
  const startsAt = event.startsAt ?? null;
  const endsAt = event.endsAt ?? null;
  const isoDate = startsAt?.slice(0, 10);
  if (!isoDate || !/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return undefined;
  return {
    slug: event.slug,
    kind,
    title: event.title,
    dateLabel: event.dateLabel,
    isoDate,
    timeLabel: event.timeLabel ?? null,
    timezoneLabel: event.timezoneLabel ?? null,
    startsAt,
    endsAt,
    venue: event.venue,
    location: event.location,
    hero: await mediaOrSlot(event.heroAssetId, getMedia, '3/2', 'Approved event image with alt text, credit and web-display permission.'),
    officialUrl: null,
    isConfirmed: true,
  };
}

export async function presentCmsStory(story: CmsStory, getMedia: MediaLoader): Promise<StoryRecord | undefined> {
  const category = story.category as StoryCategory | undefined;
  const isoDate = story.storyDate ?? story.publishedDate;
  if (!story.slug || !story.headline || !category || !storyCategories.includes(category) || !isoDate || !story.dateLabel) return undefined;
  return {
    slug: story.slug,
    title: story.headline,
    category,
    dateLabel: story.dateLabel,
    isoDate,
    author: story.authorCredit ?? null,
    standfirst: story.standfirst ?? story.excerpt ?? null,
    hero: await mediaOrSlot(story.heroAssetId, getMedia, '3/2', 'Approved story image with alt text, credit and web-display permission.'),
    body: cmsStoryBlocks(story.body),
    // The current public access contract returns relationship IDs, while these
    // older view models contain slugs. Do not guess one from the other.
    relatedCountries: [],
    relatedEvents: [],
  };
}

export type CmsProductPresentation = ProductRecord & {
  readonly cmsId: string;
  readonly availabilityLabel: string | null;
  readonly commerceEnabled: boolean;
};

export async function presentCmsProduct(item: CmsShopItem, getMedia: MediaLoader): Promise<CmsProductPresentation | undefined> {
  if (!item.slug || !item.title || !item.itemType || item.commerceEnabled) return undefined;
  const assetIds = [...new Set([item.heroAssetId, ...item.galleryAssetIds].filter((id): id is string => Boolean(id)))];
  const gallery = (await Promise.all(assetIds.map(getMedia))).filter((media): media is Media => Boolean(media));
  return {
    cmsId: item.id,
    slug: item.slug,
    title: item.title,
    kind: item.itemType,
    price: null,
    availability: null,
    availabilityLabel: item.availabilityLabel ?? null,
    gallery,
    story: cmsPlainText(item.editorialStory) ?? null,
    editionRelationship: null,
    variantLabel: item.variantLabel ?? null,
    fulfilment: cmsPlainText(item.fulfilment) ?? null,
    commerceEnabled: false,
  };
}

export function sectionsByKey(sections: readonly CmsPageSection[]): ReadonlyMap<string, CmsPageSection> {
  return new Map(sections.filter(section => section.isEnabled).map(section => [section.sectionKey, section]));
}

export function sectionIsEnabled(sections: readonly CmsPageSection[], sectionKey: string, fallback = true): boolean {
  const configured = sections.find(section => section.sectionKey === sectionKey);
  return configured ? configured.isEnabled : fallback;
}
