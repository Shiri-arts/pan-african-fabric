/**
 * Revised primary navigation.
 *
 * This supersedes the Phase 1 menu. `The Initiative`, `Exhibitions`, `Media` and
 * `Future Editions` are removed as primary labels. Proposed mappings from the old
 * paths are recorded in ./redirect-map.ts for later review; no redirect is active.
 *
 * `Partner With Us` is the primary global call to action and stays visually
 * distinct. The logo always returns to `/`.
 */
export interface NavigationItem {
  readonly href: string;
  readonly label: string;
  /** Short purpose line from the brief, used as menu context, not as page copy. */
  readonly purpose: string;
}

export const navigation: readonly NavigationItem[] = [
  { href: '/about', label: 'About', purpose: 'The why' },
  { href: '/edition-one', label: 'Edition One', purpose: 'The what' },
  { href: '/events', label: 'Events', purpose: 'Where it happens' },
  { href: '/stories', label: 'Stories', purpose: 'The living voice' },
  { href: '/shop', label: 'Shop', purpose: 'Own a piece of the story' },
  { href: '/press-contact', label: 'Press and Contact', purpose: 'Professional access' },
];

export const primaryAction: NavigationItem = {
  href: '/partner-with-us',
  label: 'Partner With Us',
  purpose: 'Primary call to action',
};

/** Every route the header can reach, in menu order, action last. */
export const menuItems: readonly NavigationItem[] = [...navigation, primaryAction];

/** Marks the active item for `aria-current`, including detail routes. */
export function isCurrent(href: string, pathname: string): boolean {
  const path = pathname.replace(/\/+$/, '') || '/';
  return path === href || path.startsWith(`${href}/`);
}
