import type { CmsNavigationItem, CmsRichText } from './cms-content';
import type { NavigationItem } from '../data/navigation';
import { cmsRichTextPlainText } from './safe-rich-text';

export function cmsPlainText(value: CmsRichText | undefined): string | undefined {
  return cmsRichTextPlainText(value);
}

export function escapedHeroTitle(value: string | undefined, fallbackMarkup: string, breakBeforeLastWord = false): string {
  if (!value?.trim()) return fallbackMarkup;
  const escaped = value.trim().replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
  if (!breakBeforeLastWord) return escaped;
  const split = escaped.lastIndexOf(' ');
  return split > 0 ? `${escaped.slice(0, split)}<span>${escaped.slice(split + 1)}</span>` : escaped;
}

export function mergeNavigation(cms: readonly CmsNavigationItem[], fallback: readonly NavigationItem[], useFallbackWhenEmpty = true): readonly NavigationItem[] {
  if (!cms.length) return useFallbackWhenEmpty ? fallback : [];
  const byHref = new Map(fallback.map(item => [item.href, item]));
  const merged: NavigationItem[] = [];
  for (const item of cms) {
    const existing = byHref.get(item.href);
    if (!existing) continue;
    merged.push({ ...existing, href: item.href, label: item.label });
  }
  return merged;
}

/*
  A credit line names who made the site; a copyright line names who holds the
  rights. The Site Settings copyright field currently holds a credit, and "©
  2026 Created by Shiri Achu." would read as neither, so wording that opens with
  a credit verb falls back to the site name instead of being reused here.
*/
const CREDIT_WORDING = /^(?:created|designed|developed|built|made|written|produced)\b/i;

/**
 * Builds the footer copyright line.
 *
 * The year is always the current one, so the line cannot go stale. Owner wording
 * comes from the Site Settings copyright field when it holds owner wording; a
 * stored line that already carries the symbol, the word "copyright" or a year has
 * those stripped first, so no symbol or year is ever duplicated. The site name is
 * the fallback, and no rights wording is invented.
 */
export function copyrightLine(
  storedText: string | undefined,
  siteName: string,
  year: number = new Date().getFullYear(),
): string {
  const stored = (storedText ?? '')
    .trim()
    .replace(/^(?:©|\(c\)|copyright)\s*/i, '')
    .replace(/^(?:©|\(c\)|copyright)\s*/i, '')
    .replace(/^\d{4}(?:\s*[-–—]\s*\d{4})?[\s,]*/, '')
    .trim();
  const owner = stored && !CREDIT_WORDING.test(stored) ? stored : '';
  return `© ${year} ${owner || siteName.trim()}`;
}

export function safeRobots(value: string | undefined, fallback: string): string {
  if (!value) return fallback;
  const tokens = value.toLowerCase().split(',').map(token => token.trim()).filter(Boolean);
  const allowed = new Set(['index', 'noindex', 'follow', 'nofollow', 'noarchive', 'nosnippet', 'noimageindex']);
  return tokens.length > 0 && tokens.every(token => allowed.has(token)) ? tokens.join(', ') : fallback;
}
