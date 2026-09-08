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
export interface NavigationSection {
  readonly href: string;
  readonly label: string;
}

export interface NavigationItem {
  readonly href: string;
  readonly label: string;
  /** Short purpose line from the brief, used as menu context, not as page copy. */
  readonly purpose: string;
  /**
   * Real sections of the destination page, previewed under the menu item. Every
   * anchor exists on that page; these are wayfinding labels, not page copy.
   */
  readonly sections?: readonly NavigationSection[];
}

export const navigation: readonly NavigationItem[] = [
  {
    href: '/about', label: 'About', purpose: 'The why',
    sections: [
      { href: '/about#origin', label: 'Origin' },
      { href: '/about#mission', label: 'Mission and vision' },
      { href: '/about#model', label: 'How it works' },
      { href: '/about#founder', label: 'The founder' },
      { href: '/about#milestones', label: 'Milestones' },
    ],
  },
  {
    href: '/edition-one', label: 'Edition One', purpose: 'The what',
    sections: [
      { href: '/edition-one#the-fabric', label: 'The fabric' },
      { href: '/edition-one#colours', label: 'The twelve colours' },
      { href: '/edition-one#regions', label: 'Five regions' },
      { href: '/edition-one#countries', label: 'The countries' },
      { href: '/edition-one#designers', label: 'The designers' },
      { href: '/edition-one#process', label: 'The creative process' },
      { href: '/edition-one#garments', label: 'Garments and accessories' },
    ],
  },
  {
    href: '/events', label: 'Events', purpose: 'Where it happens',
    sections: [
      { href: '/events#featured', label: 'Next event' },
      { href: '/events#upcoming', label: 'Upcoming' },
      { href: '/events#formats', label: 'Formats' },
      { href: '/events#archive', label: 'Archive' },
    ],
  },
  {
    href: '/stories', label: 'Stories', purpose: 'The living voice',
    sections: [
      { href: '/stories#index', label: 'All stories' },
      { href: '/stories#categories', label: 'Categories' },
    ],
  },
  {
    href: '/shop', label: 'Shop', purpose: 'Own a piece of the story',
    sections: [
      { href: '/shop#collection', label: 'Collection' },
      { href: '/shop#positions', label: 'What the shop will carry' },
    ],
  },
  {
    href: '/press-contact', label: 'Press and Contact', purpose: 'Professional access',
    sections: [
      { href: '/press-contact#fast-facts', label: 'Fast facts' },
      { href: '/press-contact#releases', label: 'Press releases' },
      { href: '/press-contact#assets', label: 'Media assets' },
      { href: '/press-contact#coverage', label: 'Coverage' },
      { href: '/press-contact#contact', label: 'Enquiries' },
    ],
  },
];

export const primaryAction: NavigationItem = {
  href: '/partner-with-us',
  label: 'Partner With Us',
  purpose: 'Primary call to action',
  sections: [
    { href: '/partner-with-us#why-partner', label: 'Why partner' },
    { href: '/partner-with-us#collaborators', label: 'Who we work with' },
    { href: '/partner-with-us#ways', label: 'Ways to collaborate' },
    { href: '/partner-with-us#enquiry', label: 'Start an enquiry' },
  ],
};

/** Every route the header can reach, in menu order, action last. */
export const menuItems: readonly NavigationItem[] = [...navigation, primaryAction];

/** Marks the active item for `aria-current`, including detail routes. */
export function isCurrent(href: string, pathname: string): boolean {
  const path = pathname.replace(/\/+$/, '') || '/';
  return path === href || path.startsWith(`${href}/`);
}
