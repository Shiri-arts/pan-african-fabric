/**
 * National flags for African countries.
 *
 * A country card shows its country's flag, which is what tells Cameroon, Ghana
 * and Ethiopia apart: all three carry green, yellow and red, and only the star,
 * the emblem or the disc distinguishes them.
 *
 * The flag is resolved from the country's name, or from its slug, so a country
 * added to a later edition shows its flag with no upload and no code change.
 *
 * The files live in public/flags, one SVG per ISO 3166-1 alpha-2 code, and are
 * served from this origin: nothing is fetched from a third party at runtime. They
 * come from the svg-country-flags set (public domain, npm svg-country-flags
 * 1.2.10), which keeps each flag's official proportions rather than forcing them
 * all into one ratio. The set here covers the 54 member states of the African
 * Union and Western Sahara, 169KB in total; a country outside it resolves to
 * nothing and its card falls back to the plain ground.
 *
 * Aliases exist because a record may hold a short name, a former name or an
 * English exonym. They are alternative names for the same state, never a guess.
 */

/** ISO 3166-1 alpha-2 code for each African country, by name and by known alias. */
const CODES: Readonly<Record<string, string>> = {
  algeria: 'dz',
  angola: 'ao',
  benin: 'bj',
  botswana: 'bw',
  'burkina faso': 'bf',
  burundi: 'bi',
  'cabo verde': 'cv',
  'cape verde': 'cv',
  cameroon: 'cm',
  cameroun: 'cm',
  'central african republic': 'cf',
  chad: 'td',
  comoros: 'km',
  'democratic republic of the congo': 'cd',
  'democratic republic of congo': 'cd',
  'dr congo': 'cd',
  'drc': 'cd',
  congo: 'cg',
  'republic of the congo': 'cg',
  'congo brazzaville': 'cg',
  "cote d'ivoire": 'ci',
  'cote divoire': 'ci',
  'ivory coast': 'ci',
  djibouti: 'dj',
  egypt: 'eg',
  'equatorial guinea': 'gq',
  eritrea: 'er',
  eswatini: 'sz',
  swaziland: 'sz',
  ethiopia: 'et',
  gabon: 'ga',
  gambia: 'gm',
  'the gambia': 'gm',
  ghana: 'gh',
  guinea: 'gn',
  'guinea bissau': 'gw',
  kenya: 'ke',
  lesotho: 'ls',
  liberia: 'lr',
  libya: 'ly',
  madagascar: 'mg',
  malawi: 'mw',
  mali: 'ml',
  mauritania: 'mr',
  mauritius: 'mu',
  morocco: 'ma',
  maroc: 'ma',
  mozambique: 'mz',
  namibia: 'na',
  niger: 'ne',
  nigeria: 'ng',
  rwanda: 'rw',
  'sao tome and principe': 'st',
  'sao tome et principe': 'st',
  senegal: 'sn',
  seychelles: 'sc',
  'sierra leone': 'sl',
  somalia: 'so',
  'south africa': 'za',
  'south sudan': 'ss',
  sudan: 'sd',
  tanzania: 'tz',
  'united republic of tanzania': 'tz',
  togo: 'tg',
  tunisia: 'tn',
  uganda: 'ug',
  zambia: 'zm',
  zimbabwe: 'zw',
  'western sahara': 'eh',
  'sahrawi arab democratic republic': 'eh',
};

/**
 * Folds a name or a slug to the form the table is keyed by: accents removed,
 * lower case, punctuation and separators reduced to single spaces.
 *
 * Nothing is stripped beyond that. Dropping words like "democratic" or
 * "republic of" would collapse the Democratic Republic of the Congo onto the
 * Republic of the Congo, which are different states with different flags, so
 * every variant name is listed explicitly above instead.
 */
function normalise(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z']+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** The country's ISO 3166-1 alpha-2 code, from its name or its slug. */
export function countryCode(name?: string, slug?: string): string | undefined {
  for (const candidate of [name, slug]) {
    if (!candidate?.trim()) continue;
    const key = normalise(candidate);
    const code = CODES[key] ?? CODES[key.replace(/ /g, '')];
    if (code) return code;
  }
  return undefined;
}

/**
 * Same-origin path to the country's flag, or undefined when the country is
 * outside the set. A caller may pass an approved CMS image URL, which wins: that
 * is the override path for a flag supplied through the media library later.
 */
export function flagSource(name?: string, slug?: string, override?: string): string | undefined {
  if (override?.trim()) return override;
  const code = countryCode(name, slug);
  return code ? `/flags/${code}.svg` : undefined;
}
