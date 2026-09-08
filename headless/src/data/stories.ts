/**
 * Stories.
 *
 * No approved story has been supplied. The index and article template are complete
 * and render an honest empty state. A structural specimen used to review the
 * article template lives in ./review-fixtures.server.ts and exists only in the
 * local review build.
 */
import type { Media } from '../lib/media';

export type StoryCategory =
  | 'Behind the scenes' | 'Country story' | 'Designer story' | 'Announcement'
  | 'Partnership' | 'Founder reflection' | 'Interview' | 'Preparation' | 'Milestone';

export const storyCategories: readonly StoryCategory[] = [
  'Behind the scenes', 'Country story', 'Designer story', 'Announcement',
  'Partnership', 'Founder reflection', 'Interview', 'Preparation', 'Milestone',
];

export interface StoryRecord {
  readonly slug: string;
  readonly title: string;
  readonly category: StoryCategory;
  readonly dateLabel: string;
  readonly isoDate: string;
  /** Author credit. Null when the byline has not been approved. */
  readonly author: string | null;
  readonly standfirst: string | null;
  readonly hero: Media;
  readonly body: readonly { readonly type: 'paragraph' | 'subheading' | 'pullquote'; readonly text: string }[];
  readonly relatedCountries: readonly string[];
  readonly relatedEvents: readonly string[];
  /** Only ever true for a review specimen. */
  readonly isSpecimen?: boolean;
}

export const stories: readonly StoryRecord[] = [];

export const storyPath = (slug: string): string => `/stories/${slug}`;
