/**
 * Route metadata contract.
 *
 * Production-quality metadata components are prepared for later CMS wiring, but
 * no production frontend URL and no approved social image exist, so no canonical
 * URL and no `og:image` are invented. Review builds stay `noindex, nofollow`.
 */
import { CANONICAL_ORIGIN, ROBOTS, SITE_NAME } from '../data/site';

export interface PageMeta {
  /** Page title without the site suffix. The home route passes undefined. */
  readonly title?: string;
  readonly description: string;
  /** Route path used to build a canonical URL once an origin is approved. */
  readonly path: string;
  readonly ogType?: 'website' | 'article';
  readonly structuredData?: Record<string, unknown>;
}

export interface ResolvedMeta {
  readonly documentTitle: string;
  readonly description: string;
  readonly canonical: string | null;
  readonly robots: string;
  readonly ogType: string;
  readonly siteName: string;
  readonly structuredData: Record<string, unknown> | undefined;
}

export function resolveMeta(meta: PageMeta): ResolvedMeta {
  return {
    documentTitle: meta.title ? `${meta.title} | ${SITE_NAME}` : SITE_NAME,
    description: meta.description,
    canonical: CANONICAL_ORIGIN ? new URL(meta.path, CANONICAL_ORIGIN).toString() : null,
    robots: ROBOTS,
    ogType: meta.ogType ?? 'website',
    siteName: SITE_NAME,
    structuredData: meta.structuredData,
  };
}
