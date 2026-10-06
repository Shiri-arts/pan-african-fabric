import { spawnSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { HEADLESS_SITE_ID, collections } from './manifest.mjs';

export const REQUIRED_BY_COLLECTION = Object.freeze({
  SiteSettings: ['siteName', 'canonicalOrigin'],
  Pages: ['pageKey', 'path', 'heroTitle'],
  PageSections: ['sectionKey', 'sectionType', 'page'],
  Editions: ['year', 'editionStatus'],
  Regions: ['regionKey', 'name'],
  Countries: ['countryName', 'edition', 'region'],
  EditionColours: ['colourName', 'hexValue', 'textHex', 'edition', 'country'],
  Symbols: ['approvedName'],
  Designers: ['displayName'],
  Participations: ['participationRole', 'participationStatus', 'edition', 'country', 'designer'],
  Garments: ['itemType', 'participation'],
  Events: ['eventType', 'eventStatus'],
  MediaAssets: ['assetType', 'usagePermission'],
  Stories: ['headline', 'category'],
  PressItems: ['itemType', 'headline'],
  PartnershipOptions: ['optionType', 'label'],
  ContactChannels: ['channelKey', 'label'],
  ShopItems: ['itemType'],
});

const URL_FIELDS = Object.freeze({
  SiteSettings: ['canonicalOrigin', 'instagramUrl', 'founderSiteUrl', 'announcementLinkUrl'],
  Pages: ['primaryCtaHref', 'secondaryCtaHref'], PageSections: ['ctaHref'],
  Symbols: ['publicSourceUrl'], Designers: ['professionalUrl', 'socialUrl'],
  Events: ['officialUrl', 'ticketUrl'], PressItems: ['externalUrl'],
});

const RICH_TEXT_FIELDS = Object.freeze({
  Pages: ['introduction'], PageSections: ['body'],
  Editions: ['statement', 'fabricDescription', 'colourNarrative', 'creativeProcess'],
  Regions: ['description'], Countries: ['introduction', 'interpretation', 'participationSummary', 'credits'],
  Symbols: ['meaning'], Designers: ['biography', 'statement'], Participations: ['statement'],
  Garments: ['description', 'publicCredits'], Events: ['overview', 'programme', 'admission', 'accessibility', 'publicPartnerCredits'],
  Stories: ['body'], PressItems: ['excerpt', 'body', 'usageNotes'], PartnershipOptions: ['description'],
  ShopItems: ['editorialStory', 'fulfilment'],
});

const hasValue = value => value !== undefined && value !== null && value !== '';
const itemId = item => item.id ?? item._id ?? item.data?._id ?? 'unknown';
const refId = value => typeof value === 'string' ? value : value?.id ?? value?._id;
const values = value => Array.isArray(value) ? value : hasValue(value) ? [value] : [];
const isPublished = item => item.state === 'published' || item.data?._publishStatus === 'PUBLISHED';
const HEX = /^#[0-9a-f]{6}$/i;

const relativeLuminance = hex => {
  const channels = [1, 3, 5].map(offset => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255)
    .map(channel => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
};

export function colourContrast(background, foreground) {
  if (!HEX.test(background) || !HEX.test(foreground)) return undefined;
  const values = [relativeLuminance(background), relativeLuminance(foreground)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

function urlIsSafe(value, { internalAllowed = false } = {}) {
  if (!hasValue(value)) return true;
  if (internalAllowed && typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')) return true;
  try { return ['https:', 'mailto:', 'tel:'].includes(new URL(value).protocol); } catch { return false; }
}

function canonicalOriginIsSafe(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' && parsed.username === '' && parsed.password === '' && parsed.pathname === '/' && !parsed.search && !parsed.hash;
  } catch { return false; }
}

function richTextLooksSafe(value) {
  if (!hasValue(value)) return true;
  const serialized = typeof value === 'string' ? value : JSON.stringify(value);
  return !/(?:<script\b|javascript\s*:|\bon\w+\s*=)/i.test(serialized);
}

/** Pure validation used by the CLI and tests. Input items are Wix data items plus a `state` property. */
export function validateContent(recordsByCollection) {
  const issues = [];
  const add = (severity, collection, item, field, code, message) => issues.push({
    severity, collection, itemId: itemId(item), field, code, message,
  });
  const indexes = new Map();
  for (const expected of collections) {
    const records = recordsByCollection[expected.id] ?? [];
    const index = new Map();
    for (const item of records) if (!index.has(itemId(item)) || isPublished(item)) index.set(itemId(item), item);
    indexes.set(expected.id, index);
    const seenSlugs = new Map();
    for (const item of records) {
      const data = item.data ?? {};
      const publicRecord = isPublished(item);
      if (publicRecord) {
        for (const field of ['title', 'slug', 'sourceVersion', 'approvedAt', ...(REQUIRED_BY_COLLECTION[expected.id] ?? [])]) {
          if (!hasValue(data[field])) add('error', expected.id, item, field, 'required-public-field', 'Published content is missing a required field.');
        }
      }
      if (hasValue(data.slug)) {
        const normalized = String(data.slug).trim().toLowerCase();
        const prior = seenSlugs.get(normalized);
        if (prior && prior !== itemId(item)) add('error', expected.id, item, 'slug', 'duplicate-slug', `Slug duplicates item ${prior}.`);
        else seenSlugs.set(normalized, itemId(item));
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized)) add('error', expected.id, item, 'slug', 'invalid-slug', 'Use lowercase letters, numbers and single hyphens.');
      }
      if (String(data.title ?? '').length > 90) add('warning', expected.id, item, 'title', 'long-title', 'Title exceeds the recommended 90 characters.');
      if (String(data.summary ?? '').length > 300) add('warning', expected.id, item, 'summary', 'long-summary', 'Summary exceeds the recommended 300 characters.');
      if (String(data.seoTitle ?? '').length > 60) add('warning', expected.id, item, 'seoTitle', 'long-seo-title', 'SEO title exceeds the recommended 60 characters.');
      if (String(data.seoDescription ?? '').length > 160) add('warning', expected.id, item, 'seoDescription', 'long-seo-description', 'SEO description exceeds the recommended 160 characters.');
      for (const field of URL_FIELDS[expected.id] ?? []) {
        if (!urlIsSafe(data[field], { internalAllowed: ['Pages', 'PageSections'].includes(expected.id) })) {
          add('error', expected.id, item, field, 'unsafe-url', 'URL must be an internal path or use HTTPS, mailto or tel.');
        }
      }
      if (expected.id === 'SiteSettings' && hasValue(data.canonicalOrigin) && !canonicalOriginIsSafe(data.canonicalOrigin)) {
        add('error', expected.id, item, 'canonicalOrigin', 'invalid-canonical-origin', 'Canonical origin must be an HTTPS origin without a path, query or fragment.');
      }
      for (const field of RICH_TEXT_FIELDS[expected.id] ?? []) {
        if (!richTextLooksSafe(data[field])) add('error', expected.id, item, field, 'unsafe-rich-text', 'Rich text contains script-like content or an unsafe URL.');
      }
    }
  }

  for (const expected of collections) {
    for (const item of recordsByCollection[expected.id] ?? []) {
      const data = item.data ?? {};
      for (const schemaField of expected.fields) {
        const target = schemaField.typeMetadata?.reference?.referencedCollectionId
          ?? schemaField.typeMetadata?.multiReference?.referencedCollectionId;
        if (!target) continue;
        for (const value of values(data[schemaField.key])) {
          const id = refId(value);
          if (!id) add('error', expected.id, item, schemaField.key, 'invalid-reference', 'Reference has no item ID.');
          else {
            const related = indexes.get(target)?.get(id);
            if (!related) add('error', expected.id, item, schemaField.key, 'missing-reference', `Referenced ${target} item ${id} is missing from the validation data.`);
            else if (isPublished(item) && !isPublished(related)) add('error', expected.id, item, schemaField.key, 'draft-dependency', `Published content references an unpublished ${target} item.`);
          }
        }
      }

      if (expected.id === 'Pages' && hasValue(data.path) && (!String(data.path).startsWith('/') || String(data.path).startsWith('//'))) {
        add('error', expected.id, item, 'path', 'invalid-route', 'Page path must be a root-relative route.');
      }
      if (expected.id === 'Pages') {
        if (data.navigationVisible && !hasValue(data.navigationLabel)) add('error', expected.id, item, 'navigationLabel', 'incomplete-navigation', 'Visible header navigation requires a label.');
        if (data.footerNavigationVisible && !hasValue(data.footerNavigationLabel)) add('error', expected.id, item, 'footerNavigationLabel', 'incomplete-navigation', 'Visible footer navigation requires a label.');
        if (data.navigationVisible && !Number.isInteger(data.navigationOrder)) add('error', expected.id, item, 'navigationOrder', 'invalid-navigation-order', 'Visible header navigation requires a whole-number order.');
        if (data.footerNavigationVisible && !Number.isInteger(data.footerNavigationOrder)) add('error', expected.id, item, 'footerNavigationOrder', 'invalid-navigation-order', 'Visible footer navigation requires a whole-number order.');
        if (hasValue(data.primaryCtaLabel) !== hasValue(data.primaryCtaHref)) add('error', expected.id, item, 'primaryCtaLabel', 'incomplete-cta', 'Primary CTA label and destination must be supplied together.');
        if (hasValue(data.secondaryCtaLabel) !== hasValue(data.secondaryCtaHref)) add('error', expected.id, item, 'secondaryCtaLabel', 'incomplete-cta', 'Secondary CTA label and destination must be supplied together.');
      }
      if (expected.id === 'PageSections') {
        if (hasValue(data.tone) && !['ivory', 'paper', 'surface', 'ink'].includes(data.tone)) add('error', expected.id, item, 'tone', 'unsupported-tone', 'Select one of the approved section tones.');
        if (hasValue(data.ctaLabel) !== hasValue(data.ctaHref)) add('error', expected.id, item, 'ctaLabel', 'incomplete-cta', 'CTA label and destination must be supplied together.');
        if (data.isEnabled && !Number.isInteger(data.displayOrder)) add('error', expected.id, item, 'displayOrder', 'invalid-section-order', 'Enabled sections require a whole-number display order.');
      }
      if (expected.id === 'Events') {
        const start = hasValue(data.startsAt) ? new Date(data.startsAt) : undefined;
        const end = hasValue(data.endsAt) ? new Date(data.endsAt) : undefined;
        if (start && Number.isNaN(start.valueOf())) add('error', expected.id, item, 'startsAt', 'invalid-date', 'Start date is invalid.');
        if (end && Number.isNaN(end.valueOf())) add('error', expected.id, item, 'endsAt', 'invalid-date', 'End date is invalid.');
        if (start && end && !Number.isNaN(start.valueOf()) && !Number.isNaN(end.valueOf()) && start >= end) add('error', expected.id, item, 'endsAt', 'invalid-date-range', 'End date must be later than start date.');
        if (data.isConfirmed && !['startsAt', 'endsAt', 'timezoneLabel', 'venue', 'location'].every(field => hasValue(data[field]))) add('error', expected.id, item, 'isConfirmed', 'incomplete-confirmed-event', 'Confirmed events require exact times, time zone, venue and location.');
      }
      if (expected.id === 'MediaAssets') {
        if (data.assetType === 'image') {
          if (!hasValue(data.image) || !(Number(data.width) > 0) || !(Number(data.height) > 0) || !hasValue(data.ratio) || !hasValue(data.focalPosition)) add('error', expected.id, item, 'image', 'incomplete-image', 'Images require a file, dimensions, ratio and focal position.');
          if (!data.decorative && !hasValue(data.alt)) add('error', expected.id, item, 'alt', 'missing-alt', 'Non-decorative images require alt text.');
        }
        if (isPublished(item) && !['web-display-approved', 'download-approved'].includes(data.usagePermission)) add('error', expected.id, item, 'usagePermission', 'media-not-approved', 'Published media requires explicit web-display approval.');
        if (data.downloadAllowed && data.usagePermission !== 'download-approved') add('error', expected.id, item, 'downloadAllowed', 'download-not-approved', 'Downloads require download-approved usage permission.');
      }
      if (expected.id === 'EditionColours') {
        for (const field of ['hexValue', 'textHex']) if (hasValue(data[field]) && !HEX.test(data[field])) add('error', expected.id, item, field, 'invalid-colour', 'Colour must use six-digit hexadecimal notation.');
        if (hasValue(data.contrastRatio) && !(Number(data.contrastRatio) > 0)) add('error', expected.id, item, 'contrastRatio', 'invalid-contrast', 'Contrast ratio must be a positive number.');
        const measuredContrast = hasValue(data.hexValue) && hasValue(data.textHex) ? colourContrast(data.hexValue, data.textHex) : undefined;
        if (isPublished(item) && measuredContrast !== undefined && measuredContrast < 4.5) add('error', expected.id, item, 'textHex', 'insufficient-contrast', 'Published colour labels require at least 4.5:1 contrast.');
        if (isPublished(item) && data.largeTextOnly) add('error', expected.id, item, 'largeTextOnly', 'large-text-only-colour', 'Published colour tiles must support normal-sized text.');
        if (measuredContrast !== undefined && hasValue(data.contrastRatio) && Math.abs(Number(data.contrastRatio) - measuredContrast) > 0.05) add('warning', expected.id, item, 'contrastRatio', 'stale-contrast-ratio', `Stored contrast ${data.contrastRatio} differs from the measured ${measuredContrast.toFixed(2)}.`);
      }
      if (expected.id === 'ContactChannels' && data.isEnabled && !data.publicUseVerified) add('error', expected.id, item, 'publicUseVerified', 'unverified-contact', 'Enabled contact channels must be verified for public use.');
      if (expected.id === 'ContactChannels' && hasValue(data.emailAddress) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.emailAddress)) add('error', expected.id, item, 'emailAddress', 'invalid-email', 'Email address is invalid.');
      if (expected.id === 'ShopItems' && data.commerceEnabled && !hasValue(data.wixProductId)) add('error', expected.id, item, 'wixProductId', 'missing-product', 'Commerce-enabled items require a Wix Stores product ID.');
    }
  }

  const unique = (collection, keyFor, field, code) => {
    const seen = new Map();
    for (const item of recordsByCollection[collection] ?? []) {
      const key = keyFor(item.data ?? {});
      if (!hasValue(key)) continue;
      const prior = seen.get(key);
      if (prior && prior !== itemId(item)) add('error', collection, item, field, code, `Value duplicates item ${prior}.`);
      else seen.set(key, itemId(item));
    }
  };
  unique('Pages', data => data.pageKey, 'pageKey', 'duplicate-page-key');
  unique('Pages', data => data.path, 'path', 'duplicate-page-path');
  unique('Regions', data => data.regionKey, 'regionKey', 'duplicate-region-key');
  unique('ContactChannels', data => data.channelKey, 'channelKey', 'duplicate-channel-key');
  unique('PageSections', data => refId(data.page) && data.sectionKey ? `${refId(data.page)}:${data.sectionKey}` : undefined, 'sectionKey', 'duplicate-page-section-key');
  unique('Countries', data => refId(data.edition) && data.slug ? `${refId(data.edition)}:${data.slug}` : undefined, 'slug', 'duplicate-edition-country');

  const publishedSettings = (recordsByCollection.SiteSettings ?? []).filter(isPublished);
  if (publishedSettings.length > 1) for (const item of publishedSettings.slice(1)) add('error', 'SiteSettings', item, 'slug', 'multiple-site-settings', 'Only one SiteSettings record may be published.');
  const highlighted = (recordsByCollection.Pages ?? []).filter(item => isPublished(item) && item.data?.navigationVisible && item.data?.navigationHighlighted);
  if (highlighted.length > 1) for (const item of highlighted.slice(1)) add('error', 'Pages', item, 'navigationHighlighted', 'multiple-highlighted-navigation-items', 'Only one visible header item may be highlighted.');

  for (const item of recordsByCollection.Participations ?? []) {
    const data = item.data ?? {};
    const country = indexes.get('Countries')?.get(refId(data.country));
    if (country && hasValue(data.edition) && refId(country.data?.edition) !== refId(data.edition)) add('error', 'Participations', item, 'edition', 'participation-edition-mismatch', 'Participation edition must match the country edition.');
  }
  for (const item of recordsByCollection.Garments ?? []) {
    const data = item.data ?? {};
    const participation = indexes.get('Participations')?.get(refId(data.participation));
    if (!participation) continue;
    for (const field of ['edition', 'country', 'designer']) {
      if (hasValue(data[field]) && refId(data[field]) !== refId(participation.data?.[field])) add('error', 'Garments', item, field, 'garment-participation-mismatch', `Garment ${field} must match its participation.`);
    }
  }
  return {
    valid: !issues.some(issue => issue.severity === 'error'),
    summary: { errors: issues.filter(issue => issue.severity === 'error').length, warnings: issues.filter(issue => issue.severity === 'warning').length },
    issues,
  };
}

async function runCli() {
  const config = JSON.parse(await readFile(new URL('../../wix.config.json', import.meta.url), 'utf8'));
  if (config.siteId !== HEADLESS_SITE_ID) throw new Error('Validation is restricted to the separate Headless site.');
  const cli = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const suppliedToken = process.env.WIX_CMS_ADMIN_TOKEN?.trim();
  const tokenResult = suppliedToken ? undefined : spawnSync(cli, ['wix', 'token', '--site', HEADLESS_SITE_ID], {
    cwd: fileURLToPath(new URL('../..', import.meta.url)), encoding: 'utf8', windowsHide: true, shell: process.platform === 'win32',
  });
  if (tokenResult?.status !== undefined && tokenResult.status !== 0) throw new Error(tokenResult.error?.message || tokenResult.stderr || 'Wix CLI authentication failed.');
  const token = suppliedToken || tokenResult?.stdout.trim();
  if (!token) throw new Error('A temporary site-scoped administrative token is required.');
  async function query(collectionId, includeDraftItems = false) {
    const response = await fetch('https://www.wixapis.com/wix-data/v2/items/query', {
      method: 'POST', redirect: 'error', signal: AbortSignal.timeout(30000),
      headers: { Authorization: `Bearer ${token}`, 'wix-site-id': HEADLESS_SITE_ID, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dataCollectionId: collectionId,
        query: { paging: { limit: 1000 } },
        consistentRead: true,
        ...(includeDraftItems ? { publishPluginOptions: { includeDraftItems: true } } : {}),
      }),
    });
    if (!response.ok) throw new Error(`Read-only CMS query failed for ${collectionId} (${response.status}).`);
    const body = await response.json();
    if (!Array.isArray(body.dataItems)) throw new Error(`CMS returned an invalid item list for ${collectionId}.`);
    if (body.dataItems.length === 1000) throw new Error(`${collectionId} reached the validation limit; add pagination before relying on this report.`);
    return body.dataItems;
  }
  const recordsByCollection = {};
  for (const expected of collections) {
    const [published, inclusive] = await Promise.all([query(expected.id), query(expected.id, true)]);
    const drafts = inclusive.filter(item => item.data?._publishStatus === 'DRAFT');
    recordsByCollection[expected.id] = [
      ...published.map(item => ({ ...item, state: 'published' })),
      ...drafts.map(item => ({ ...item, state: 'draft' })),
    ];
  }
  const result = validateContent(recordsByCollection);
  const report = { checkedAt: new Date().toISOString(), siteId: HEADLESS_SITE_ID, mutations: 0, ...result };
  const output = `${JSON.stringify(report, null, 2)}\n`;
  await writeFile(new URL('../../cms-validation-report.json', import.meta.url), output);
  console.log(output.trimEnd());
  if (!result.valid) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runCli().catch(error => { console.error(error.message); process.exitCode = 1; });
}
