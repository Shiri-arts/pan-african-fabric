/**
 * Media contract.
 *
 * Every image on this site is described by one of these records before it can
 * render. A record without an approved source renders a review placeholder, not
 * a broken image and never a stock substitute. Rights notes are internal: the
 * public page shows caption and credit line only.
 */
export type MediaRatio = '16/9' | '3/2' | '4/5' | '1/1' | '21/9' | '5/4';

export interface MediaSource {
  /** Path served from /public, or an approved same-origin asset path. */
  readonly src: string;
  readonly width: number;
  readonly height: number;
  /** Comma-separated candidates, when real responsive derivatives exist. */
  readonly srcset?: string;
}

export interface MediaCredit {
  readonly creator?: string;
  readonly copyrightHolder?: string;
  /** The line printed under the image, e.g. "Photograph: Name". */
  readonly creditLine?: string;
}

/** Internal only. Never rendered. Governs whether a download control may exist. */
export type UsagePermission = 'not-supplied' | 'review-only' | 'web-display-approved' | 'download-approved';

export interface Media {
  readonly id: string;
  /** Omitted when the image is decorative; then `decorative` must be true. */
  readonly alt?: string;
  readonly decorative?: boolean;
  readonly ratio: MediaRatio;
  /** Art-directed focal point as CSS object-position, e.g. "50% 30%". */
  readonly focal?: string;
  readonly desktop?: MediaSource;
  readonly mobile?: MediaSource;
  /** Breakpoint at which the desktop source takes over. */
  readonly desktopFrom?: string;
  readonly sizes?: string;
  readonly caption?: string;
  readonly credit?: MediaCredit;
  readonly permission: UsagePermission;
  /** Shown in the placeholder so a reviewer knows what belongs here. */
  readonly reviewNote?: string;
}

/** A slot with no approved file yet. Renders the art-directed placeholder. */
export const mediaSlot = (
  id: string,
  ratio: MediaRatio,
  reviewNote: string,
  options: { readonly caption?: string } = {},
): Media => ({ id, ratio, permission: 'not-supplied', reviewNote, caption: options.caption, decorative: false });

export function hasApprovedSource(media: Media): boolean {
  return Boolean(media.desktop ?? media.mobile) && media.permission !== 'not-supplied';
}

/** Only an explicit download approval may produce a download control. */
export function isDownloadable(media: Media): boolean {
  return media.permission === 'download-approved';
}
