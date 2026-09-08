/**
 * Site-level facts and external destinations.
 *
 * An external link renders only when `verified` is true. The Instagram handle and
 * founder site were supplied in the brief but their destinations have not been
 * confirmed for public linking, and the work email has not been confirmed for
 * public use, so all three are held back. Flipping `verified` is the only change
 * needed once the client confirms each one.
 */
export const SITE_NAME = 'The Pan-African Fabric';

/** Client-approved in the implementation brief. */
export const TAGLINE = 'One Fabric. Many African Stories.';

export interface ExternalLink {
  readonly label: string;
  readonly href: string;
  readonly verified: boolean;
  /** Shown in the review build so a reviewer knows what is outstanding. */
  readonly pending?: string;
}

export const externalLinks: readonly ExternalLink[] = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/thepanafricanfabric/',
    verified: false,
    pending: 'Confirm this is the official account before it is linked publicly.',
  },
  {
    label: 'Shiri Achu Art',
    href: 'https://shiriachuart.com',
    verified: false,
    pending: 'Confirm the founder site should be linked from this initiative.',
  },
];

export interface ContactChannel {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  /** Null until the address is confirmed for public use. Never publish a guess. */
  readonly address: string | null;
  readonly pending?: string;
}

export const contactChannels: readonly ContactChannel[] = [
  {
    id: 'media',
    label: 'Media and press enquiries',
    description: 'Interviews, images, and coverage requests.',
    address: null,
    pending: 'A public media address has not been confirmed. Info@thepanafricanfabric.com was supplied as a work address; its public use is still pending.',
  },
  {
    id: 'general',
    label: 'General enquiries',
    description: 'Questions about the initiative and its programme.',
    address: null,
    pending: 'A public general address has not been confirmed.',
  },
  {
    id: 'partnership',
    label: 'Partnership and hosting enquiries',
    description: 'Museums, embassies, universities, sponsors and cultural organisations.',
    address: null,
    pending: 'Routing for partnership enquiries has not been confirmed.',
  },
];

/** Counts stated in the implementation brief. Structural facts, not cultural claims. */
export const fastFacts: readonly { readonly value: string; readonly label: string }[] = [
  { value: '12', label: 'Colours in Edition One' },
  { value: '09', label: 'Countries' },
  { value: '05', label: 'African regions' },
  { value: '01', label: 'Fabric' },
];

/**
 * Review builds stay out of search indexes and no production URL has been
 * approved, so no canonical origin is invented.
 */
export const CANONICAL_ORIGIN: string | null = null;
export const ROBOTS = 'noindex, nofollow' as const;
