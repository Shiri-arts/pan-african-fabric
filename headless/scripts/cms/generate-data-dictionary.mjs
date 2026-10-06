import { writeFile } from 'node:fs/promises';
import { collections } from './manifest.mjs';
import { REQUIRED_BY_COLLECTION } from './validate-content.mjs';

const usage = Object.freeze({
  SiteSettings: 'Global header, footer, defaults and announcement', Pages: 'Route hero, metadata and page-level CTAs',
  PageSections: 'Ordered reusable page section',
  Editions: 'Edition overview', Regions: 'Region grouping', Countries: 'Country profile', EditionColours: 'Country colour presentation',
  Symbols: 'Verified symbol explanation', Designers: 'Designer profile', Participations: 'Edition/country/designer attribution',
  Garments: 'Garment or accessory detail', Events: 'Event listing, detail and countdown', MediaAssets: 'Rights-aware media rendering',
  Stories: 'Story listing and article', PressItems: 'Press, release, coverage or download', PartnershipOptions: 'Partnership cards and choices',
  ContactChannels: 'Verified public contact route', ShopItems: 'Editorial bridge to Wix Stores',
});

const validationFor = field => {
  if (field.key === 'slug') return 'Lowercase letters, numbers and single hyphens; unique within collection';
  if (field.key === 'title') return 'Recommended maximum 90 characters';
  if (field.key === 'summary') return 'Recommended maximum 300 characters';
  if (field.key === 'seoTitle') return 'Recommended maximum 60 characters';
  if (field.key === 'seoDescription') return 'Recommended maximum 160 characters';
  if (field.key === 'hexValue' || field.key === 'textHex') return 'Six-digit hexadecimal colour; the measured pair must reach 4.5:1 contrast';
  if (field.key === 'contrastRatio') return 'Measured from Hex value and Text hex; stored value must match within 0.05';
  if (field.key === 'largeTextOnly') return 'Must be false for a published colour tile';
  if (field.type === 'URL' || field.key.endsWith('Href')) return 'Internal path where supported, or HTTPS/mailto/tel; scripts rejected';
  if (field.type === 'RICH_TEXT') return 'Wix rich content only; script-like content and unsafe URLs rejected';
  if (field.type === 'REFERENCE' || field.type === 'MULTI_REFERENCE') return 'Referenced record must exist; published records require published dependencies';
  if (field.type === 'DATETIME' || field.type === 'DATE') return 'Valid Wix date value';
  if (field.type === 'NUMBER') return 'Finite numeric value; field-specific constraints apply';
  if (field.type === 'BOOLEAN') return 'True or false';
  return 'Trimmed value; field-specific rules apply';
};

const dependencyFor = field => field.typeMetadata?.reference?.referencedCollectionId
  ?? field.typeMetadata?.multiReference?.referencedCollectionId
  ?? (field.key === 'approvedAt' ? 'Required before publication' : 'None');

let output = `# Wix CMS technical data dictionary

This document is generated from \`headless/scripts/cms/manifest.mjs\`. It describes the additive schema expected on the separate Wix Headless site. Wix system fields such as immutable item ID, created date, updated date and publish state are supplied by Wix and are not duplicated here.

Every published record requires \`title\`, \`slug\`, \`sourceVersion\` and \`approvedAt\`, plus the collection-specific required fields shown below. Fields marked **Internal** support provenance or validation and must not be rendered as public copy. A reference from a published record must point to a published dependency.

`;

for (const collection of collections) {
  const required = new Set(['title', 'slug', 'sourceVersion', 'approvedAt', ...(REQUIRED_BY_COLLECTION[collection.id] ?? [])]);
  output += `## ${collection.displayName} (\`${collection.id}\`)\n\nFrontend use: ${usage[collection.id]}.\n\n`;
  output += '| Field key | Dashboard label | Type | Required to publish | Visibility | Validation | Publication dependency |\n';
  output += '|---|---|---|---|---|---|---|\n';
  for (const field of collection.fields) {
    const visibility = ['sourceVersion', 'approvedAt'].includes(field.key) ? 'Internal' : 'Public or editorial control';
    output += `| \`${field.key}\` | ${field.displayName} | \`${field.type}\` | ${required.has(field.key) ? 'Yes' : 'Conditional/No'} | ${visibility} | ${validationFor(field)} | ${dependencyFor(field)} |\n`;
  }
  output += '\n';
}

output += `## Controlled values and cross-record rules

- \`PageSections.tone\`: \`ivory\`, \`paper\`, \`surface\` or \`ink\`.
- A visible page navigation entry requires its corresponding header or footer label; its destination is the validated page path.
- CTA labels and destinations are supplied together.
- A confirmed event requires exact start/end instants, time zone, venue and location; end must follow start.
- Non-decorative images require alt text. Display requires \`web-display-approved\` or \`download-approved\`; downloads require \`download-approved\`.
- Published edition colours require approved six-digit background and text values with measured contrast of at least 4.5:1. The frontend independently recomputes this ratio and omits unsafe pairs.
- An enabled contact channel requires \`publicUseVerified\`.
- A commerce-enabled shop item requires an existing Wix Stores product ID. Price, inventory and variants remain authoritative in Wix Stores.
- Multi-reference links must be written through Wix's reference APIs rather than ordinary array writes.
`;

await writeFile(new URL('../../../docs/cms-data-dictionary.md', import.meta.url), output);
console.log(`Wrote ${collections.length} collections and ${collections.reduce((total, item) => total + item.fields.length, 0)} fields.`);
