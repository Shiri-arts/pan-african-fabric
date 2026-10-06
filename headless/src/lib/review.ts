/**
 * Review-build accessors.
 *
 * Each function keeps the `import.meta.env.DEV` test inline so the constant folds
 * to `false` in a production build and the dynamic import becomes unreachable and
 * is removed. scripts/verify-production.mjs asserts the result.
 */
import type { ReviewCopy } from '../data/review-copy.server';
import type { StoryRecord } from '../data/stories';
import type { ProductRecord } from '../data/shop';

export async function loadReviewCopy(): Promise<ReviewCopy | undefined> {
  return import.meta.env.DEV ? (await import('../data/review-copy.server')).reviewCopy : undefined;
}

/** Stories visible to routing: approved records, plus the template specimen in review. */
export async function reviewStories(): Promise<readonly StoryRecord[]> {
  return import.meta.env.DEV ? [(await import('../data/review-fixtures.server')).specimenStory] : [];
}

export async function reviewProducts(): Promise<readonly ProductRecord[]> {
  return import.meta.env.DEV ? [(await import('../data/review-fixtures.server')).specimenProduct] : [];
}
