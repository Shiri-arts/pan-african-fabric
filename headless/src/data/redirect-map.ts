/**
 * Proposed mappings from the superseded navigation to the revised routes.
 *
 * Documentation only. Nothing here is wired into routing or middleware.
 * Activation requires explicit approval, verified content equivalence and
 * published destinations, per the implementation brief.
 */
export interface ProposedRedirect {
  readonly from: string;
  readonly to: string;
  readonly reason: string;
}

export const proposedRedirects: readonly ProposedRedirect[] = [
  { from: '/initiative', to: '/about', reason: 'The Initiative is replaced by About as the "why" section.' },
  { from: '/exhibitions', to: '/events', reason: 'Exhibitions become one event type inside Events.' },
  { from: '/exhibitions/smithsonian-community-day-2026', to: '/events/inaugural-pan-african-fabric-fashion-showcase', reason: 'Superseded working slug. The confirmed title and detail route replace it.' },
  { from: '/media', to: '/press-contact', reason: 'Media and contact are merged into professional access.' },
  { from: '/future-editions', to: '/about', reason: 'No approved destination yet. Needs a decision before activation.' },
  { from: '/about-us', to: '/about', reason: 'Original live-site path.' },
  { from: '/mission', to: '/about', reason: 'Original live-site path.' },
  { from: '/designers', to: '/edition-one', reason: 'Original live-site path.' },
  { from: '/featured', to: '/events', reason: 'Original live-site path.' },
  { from: '/showcase', to: '/events', reason: 'Original live-site path.' },
  { from: '/journal', to: '/stories', reason: 'Original live-site path.' },
  { from: '/press', to: '/press-contact', reason: 'Original live-site path.' },
];

export const REDIRECT_STATUS = 'proposed-not-activated' as const;
