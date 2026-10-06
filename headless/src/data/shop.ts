/**
 * Shop.
 *
 * Editorial catalogue records. Price, stock, checkout and payment remain outside
 * this phase; available items can be ordered directly by email.
 */
import type { Media } from '../lib/media';

export interface ProductRecord {
  readonly slug: string;
  readonly title: string;
  readonly kind: string;
  /** Always null in the editorial catalogue. Price is confirmed directly by email. */
  readonly price: null;
  readonly availability: string | null;
  readonly gallery: readonly Media[];
  readonly story: string | null;
  readonly editionRelationship: string | null;
  readonly variantLabel: string | null;
  readonly fulfilment: string | null;
  readonly isSpecimen?: boolean;
}

export const products: readonly ProductRecord[] = [];

export const COMMERCE_ENABLED = false;

export const SHOP_EMAIL = 'info@shiriachuart.com';

export const productEnquiryHref = (title: string): string => {
  const subject = `Order enquiry: ${title}`;
  const body = `Hello,\n\nI would like to order ${title}. Please send me the price, payment and delivery details.\n\nThank you.`;
  return `mailto:${SHOP_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

export const productPath = (slug: string): string => `/shop/${slug}`;
