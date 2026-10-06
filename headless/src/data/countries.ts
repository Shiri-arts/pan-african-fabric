/**
 * Edition One countries and the five-region framework.
 *
 * Country names, slugs and the nine-country roster are client-supplied. Region
 * grouping follows the working grouping in the supplied brief and is recorded in
 * docs/phase-1/content-inventory.json. Cameroon's grouping is flagged there for
 * founder confirmation and is surfaced as a working label, never as a corrected
 * fact. No symbol meaning, biography, interpretation or credit is stored here.
 */
export type CountrySlug =
  | 'cameroon' | 'nigeria' | 'ghana' | 'ethiopia' | 'kenya'
  | 'egypt' | 'morocco' | 'central-african-republic' | 'south-africa';

export type RegionSlug = 'west-africa' | 'east-africa' | 'north-africa' | 'central-africa' | 'southern-africa';

export interface Region {
  readonly slug: RegionSlug;
  readonly name: string;
}

export const regions: readonly Region[] = [
  { slug: 'north-africa', name: 'North Africa' },
  { slug: 'west-africa', name: 'West Africa' },
  { slug: 'central-africa', name: 'Central Africa' },
  { slug: 'east-africa', name: 'East Africa' },
  { slug: 'southern-africa', name: 'Southern Africa' },
];

export const REGION_COUNT = regions.length;

export interface Country {
  readonly slug: CountrySlug;
  readonly name: string;
  readonly region: RegionSlug;
  /** Set when the working regional grouping still needs founder confirmation. */
  readonly regionNote?: string;
  /**
   * Whether an approved content package exists for this country. Every entry is
   * `false` in this handoff: no hero media, introduction, symbol, biography,
   * interpretation, garment imagery or credits have been approved.
   */
  readonly hasApprovedProfile: boolean;
}

export const countries: readonly Country[] = [
  { slug: 'cameroon', name: 'Cameroon', region: 'west-africa', regionNote: 'Working grouping from the supplied brief. Regional placement is awaiting founder confirmation.', hasApprovedProfile: false },
  { slug: 'nigeria', name: 'Nigeria', region: 'west-africa', hasApprovedProfile: false },
  { slug: 'ghana', name: 'Ghana', region: 'west-africa', hasApprovedProfile: false },
  { slug: 'ethiopia', name: 'Ethiopia', region: 'east-africa', hasApprovedProfile: false },
  { slug: 'kenya', name: 'Kenya', region: 'east-africa', hasApprovedProfile: false },
  { slug: 'egypt', name: 'Egypt', region: 'north-africa', hasApprovedProfile: false },
  { slug: 'morocco', name: 'Morocco', region: 'north-africa', hasApprovedProfile: false },
  { slug: 'central-african-republic', name: 'Central African Republic', region: 'central-africa', hasApprovedProfile: false },
  { slug: 'south-africa', name: 'South Africa', region: 'southern-africa', hasApprovedProfile: false },
];

export const COUNTRY_COUNT = countries.length;

export const countryPath = (slug: CountrySlug): string => `/edition-one/${slug}`;

export function findCountry(slug: string | undefined): Country | undefined {
  return countries.find((country) => country.slug === slug);
}

export function regionName(slug: RegionSlug): string {
  return regions.find((region) => region.slug === slug)?.name ?? '';
}

/** Countries in the order the region list is presented. */
export function countriesByRegion(): readonly { readonly region: Region; readonly members: readonly Country[] }[] {
  return regions.map((region) => ({ region, members: countries.filter((country) => country.region === region.slug) }));
}

/** Neighbouring entries for the country template's previous/next control. */
export function adjacentCountries(slug: CountrySlug): { readonly previous: Country; readonly next: Country } {
  const index = countries.findIndex((country) => country.slug === slug);
  const total = countries.length;
  return {
    previous: countries[(index - 1 + total) % total]!,
    next: countries[(index + 1) % total]!,
  };
}
