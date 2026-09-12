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

export function safeRobots(value: string | undefined, fallback: string): string {
  if (!value) return fallback;
  const tokens = value.toLowerCase().split(',').map(token => token.trim()).filter(Boolean);
  const allowed = new Set(['index', 'noindex', 'follow', 'nofollow', 'noarchive', 'nosnippet', 'noimageindex']);
  return tokens.length > 0 && tokens.every(token => allowed.has(token)) ? tokens.join(', ') : fallback;
}
