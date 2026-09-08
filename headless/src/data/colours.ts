/**
 * The Edition One twelve-colour system.
 *
 * Client-supplied in the production frontend brief. Twelve colours mapped to
 * nine countries: Cameroon, Ghana and South Africa each carry two. These are not
 * national flags and must never be reduced to one colour per country.
 *
 * Hex values are representative samples from four unobstructed areas of each
 * panel of the source artwork. The artwork carries gentle gradients, so these are
 * review values rather than print colour specifications. The source raster is not
 * committed: repository and public-use permission is not confirmed.
 *
 * `textOn` and `contrast` were measured against the sampled value. `largeTextOnly`
 * marks a field that cannot carry normal-size text at 4.5:1 in either neutral.
 */
import type { CountrySlug } from './countries';

export type ColourSlug =
  | 'dark-green' | 'red' | 'yellow' | 'pink' | 'black' | 'white'
  | 'blue' | 'mint-green' | 'orange' | 'hot-pink' | 'purple' | 'green';

export interface EditionColour {
  /** Position in the source artwork, 1-12. */
  readonly index: number;
  readonly slug: ColourSlug;
  readonly name: string;
  readonly country: CountrySlug;
  readonly hex: string;
  /** CSS custom property carrying the field colour. */
  readonly variable: string;
  /** Measured accessible text colour for this field. */
  readonly textOn: '#ffffff' | '#24211e';
  /** Measured ratio of `textOn` against `hex`. */
  readonly contrast: number;
  /** True when no neutral reaches 4.5:1, so only large display text may sit on the field. */
  readonly largeTextOnly: boolean;
  /**
   * Reserved links. Each colour will later connect to an approved symbol,
   * designer and media record. Null until those relationships are approved.
   */
  readonly symbolId: null;
  readonly designerId: null;
  readonly mediaId: null;
}

export const editionColours: readonly EditionColour[] = [
  { index: 1,  slug: 'dark-green', name: 'Dark green', country: 'cameroon',                 hex: '#34514A', variable: '--edition-dark-green', textOn: '#ffffff', contrast: 8.67,  largeTextOnly: false, symbolId: null, designerId: null, mediaId: null },
  { index: 2,  slug: 'red',        name: 'Red',        country: 'kenya',                    hex: '#EA021A', variable: '--edition-red',        textOn: '#ffffff', contrast: 4.64,  largeTextOnly: false, symbolId: null, designerId: null, mediaId: null },
  { index: 3,  slug: 'yellow',     name: 'Yellow',     country: 'south-africa',             hex: '#D6BA06', variable: '--edition-yellow',     textOn: '#24211e', contrast: 8.30,  largeTextOnly: false, symbolId: null, designerId: null, mediaId: null },
  { index: 4,  slug: 'pink',       name: 'Pink',       country: 'ghana',                    hex: '#E5A09B', variable: '--edition-pink',       textOn: '#24211e', contrast: 7.50,  largeTextOnly: false, symbolId: null, designerId: null, mediaId: null },
  { index: 5,  slug: 'black',      name: 'Black',      country: 'morocco',                  hex: '#020605', variable: '--edition-black',      textOn: '#ffffff', contrast: 20.37, largeTextOnly: false, symbolId: null, designerId: null, mediaId: null },
  { index: 6,  slug: 'white',      name: 'White',      country: 'central-african-republic', hex: '#FCF7F8', variable: '--edition-white',      textOn: '#24211e', contrast: 15.10, largeTextOnly: false, symbolId: null, designerId: null, mediaId: null },
  { index: 7,  slug: 'blue',       name: 'Blue',       country: 'cameroon',                 hex: '#199EDC', variable: '--edition-blue',       textOn: '#24211e', contrast: 5.31,  largeTextOnly: false, symbolId: null, designerId: null, mediaId: null },
  { index: 8,  slug: 'mint-green', name: 'Mint green', country: 'ethiopia',                 hex: '#92D9CA', variable: '--edition-mint-green', textOn: '#24211e', contrast: 9.91,  largeTextOnly: false, symbolId: null, designerId: null, mediaId: null },
  { index: 9,  slug: 'orange',     name: 'Orange',     country: 'egypt',                    hex: '#D76921', variable: '--edition-orange',     textOn: '#24211e', contrast: 4.52,  largeTextOnly: false, symbolId: null, designerId: null, mediaId: null },
  { index: 10, slug: 'hot-pink',   name: 'Hot pink',   country: 'nigeria',                  hex: '#E3327C', variable: '--edition-hot-pink',   textOn: '#ffffff', contrast: 4.19,  largeTextOnly: true,  symbolId: null, designerId: null, mediaId: null },
  { index: 11, slug: 'purple',     name: 'Purple',     country: 'ghana',                    hex: '#540C84', variable: '--edition-purple',     textOn: '#ffffff', contrast: 11.91, largeTextOnly: false, symbolId: null, designerId: null, mediaId: null },
  { index: 12, slug: 'green',      name: 'Green',      country: 'south-africa',             hex: '#028201', variable: '--edition-green',      textOn: '#ffffff', contrast: 5.00,  largeTextOnly: false, symbolId: null, designerId: null, mediaId: null },
];

export const COLOUR_COUNT = editionColours.length;

export function coloursForCountry(country: CountrySlug): readonly EditionColour[] {
  return editionColours.filter((colour) => colour.country === country);
}

/** Inline custom properties so one panel can theme itself without a stylesheet entry per colour. */
export function colourStyle(colour: EditionColour): string {
  return `--panel:var(${colour.variable});--panel-on:${colour.textOn};`;
}
