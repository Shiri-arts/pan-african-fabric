/**
 * LOCAL REVIEW SPECIMENS — NOT CONTENT.
 *
 * These records exist so the reusable story and product templates can be seen and
 * tested at every breakpoint while no approved records exist. They are deliberately
 * self-describing: each field states what belongs in the slot. They contain no
 * lorem ipsum, no fabricated cultural fact, no invented byline, no price and no
 * availability, and they resolve to HTTP 404 in production because the arrays that
 * routing reads stay empty outside the review build.
 *
 * Reached only through a dynamic import guarded by `import.meta.env.DEV`.
 */
import type { StoryRecord } from './stories';
import type { ProductRecord } from './shop';
import { mediaSlot } from '../lib/media';

export const specimenStory: StoryRecord = {
  slug: 'story-template-specimen',
  title: 'Story template specimen',
  category: 'Behind the scenes',
  dateLabel: 'Publication date appears here',
  isoDate: '2026-09-07',
  author: 'Approved author credit appears here',
  standfirst:
    'This specimen shows the standfirst position, length and typography of the article template. It is not a story and carries no editorial claim.',
  hero: mediaSlot('story-specimen-hero', '3/2', 'Approved story hero image with alt text, focal point, caption, credit and reuse permission.'),
  body: [
    { type: 'paragraph', text: 'Body paragraphs sit at this measure so the reading line stays under 65 characters. Approved story copy replaces this specimen text without any layout change.' },
    { type: 'subheading', text: 'Subheading position' },
    { type: 'paragraph', text: 'A second paragraph demonstrates spacing between blocks, the reading-progress indicator and the behaviour of the sticky article metadata at narrow widths.' },
    { type: 'pullquote', text: 'A pull quote sits here. Real quotations require an approved, attributed source.' },
    { type: 'paragraph', text: 'The closing paragraph shows how related countries, designers and events are offered at the end of an article.' },
  ],
  relatedCountries: ['cameroon', 'ghana'],
  relatedEvents: ['inaugural-pan-african-fabric-fashion-showcase'],
  isSpecimen: true,
};

export const specimenProduct: ProductRecord = {
  slug: 'product-template-specimen',
  title: 'Product template specimen',
  kind: 'Template preview',
  price: null,
  availability: null,
  gallery: [
    mediaSlot('product-specimen-1', '4/5', 'Approved product photograph, front view.'),
    mediaSlot('product-specimen-2', '4/5', 'Approved product photograph, detail view.'),
    mediaSlot('product-specimen-3', '4/5', 'Approved product photograph, in use or scale reference.'),
  ],
  story:
    'The product story sits here. It explains how the piece relates to the fabric and the edition. Approved copy replaces this specimen without layout change.',
  editionRelationship: 'Edition relationship line appears here, connecting the piece to Edition One.',
  variantLabel: 'Variant control position',
  fulfilment: 'Fulfilment and delivery information position',
  isSpecimen: true,
};
