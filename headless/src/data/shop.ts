/**
 * Shop.
 *
 * No approved product, price, availability, variant, fulfilment term or commerce
 * integration exists. The storefront and product templates are complete and render
 * a truthful "Shop collection coming soon" state. No functional Add to Cart,
 * checkout, price, stock, discount, preorder or payment control is rendered
 * anywhere, in any build.
 */
import type { Media } from '../lib/media';

export interface ProductRecord {
  readonly slug: string;
  readonly title: string;
  readonly kind: string;
  /** Always null in this phase. A price may only come from an approved source. */
  readonly price: null;
  readonly availability: null;
  readonly gallery: readonly Media[];
  readonly story: string | null;
  readonly editionRelationship: string | null;
  readonly variantLabel: string | null;
  readonly fulfilment: string | null;
  readonly isSpecimen?: boolean;
}

export const products: readonly ProductRecord[] = [];

export const COMMERCE_ENABLED = false;

export const productPath = (slug: string): string => `/shop/${slug}`;
