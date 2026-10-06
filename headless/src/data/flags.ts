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

/**
 * Each flag's aspect ratio, read from its SVG viewBox.
 *
 * The card reserves the exact shape of the flag it is about to show, so the flag
 * sits flush with no letterbox band around it and the card does not shift as the
 * file loads. Ratios are the official ones: 3:2 for most, 2:1 for Nigeria and
 * Ethiopia, and a handful of others.
 */
const RATIOS: Readonly<Record<string, number>> = {
  ao: 1.5,
  bf: 1.5,
  bi: 1.6667,
  bj: 1.5,
  bw: 1.5,
  cd: 1.3333,
  cf: 1.5,
  cg: 1.5,
  ci: 1.5,
  cm: 1.5,
  cv: 1.7,
  dj: 1.5,
  dz: 1.5,
  eg: 1.5,
  eh: 2.0,
  er: 2.0,
  et: 2.0,
  ga: 1.3333,
  gh: 1.5,
  gm: 1.5,
  gn: 1.5,
  gq: 1.5,
  gw: 2.0,
  ke: 1.5,
  km: 1.6667,
  lr: 1.9,
  ls: 1.5,
  ly: 2.0,
  ma: 1.5,
  mg: 1.5,
  ml: 1.5,
  mr: 1.5,
  mu: 1.5,
  mw: 1.5,
  mz: 1.5,
  na: 1.5,
  ne: 1.1667,
  ng: 2.0,
  rw: 1.5,
  sc: 2.0,
  sd: 2.0,
  sl: 1.5,
  sn: 1.5,
  so: 1.5,
  ss: 2.0,
  st: 2.0,
  sz: 1.5,
  td: 1.5,
  tg: 1.618,
  tn: 1.5,
  tz: 1.5,
  ug: 1.5,
  za: 1.5,
  zm: 1.5,
  zw: 2.0,
};

/** Width divided by height for a country's flag, for reserving its box. */
export function flagRatio(name?: string, slug?: string): number | undefined {
  const code = countryCode(name, slug);
  return code ? RATIOS[code] : undefined;
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
