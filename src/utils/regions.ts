// Country/region support for venue suggestions.
//
// The person GENERATING the confession link picks their country. That choice is
// encoded into the link (see urlParams) so the recipient's venue step shows
// spots that make sense for that country. Picking "other" shows no presets — the
// recipient simply types their own venue (in any language/script), e.g.
// "La Pergola" or "Verona".

export type Region =
  | 'sg'
  | 'cn'
  | 'es'
  | 'fr'
  | 'it'
  | 'br'
  | 'de'
  | 'id'
  | 'other';

/** All valid region codes, for validation when decoding a link. */
export const REGION_CODES: readonly Region[] = [
  'sg', 'cn', 'es', 'fr', 'it', 'br', 'de', 'id', 'other',
];

/** The default region for legacy links and when nothing is selected. */
export const DEFAULT_REGION: Region = 'sg';

/**
 * Dropdown options in display order. Labels use a flag + the country's own
 * endonym (like the language selector), so they read naturally regardless of
 * the UI language.
 */
export const REGION_OPTIONS: { value: Region; label: string }[] = [
  { value: 'sg', label: '🇸🇬 Singapore' },
  { value: 'cn', label: '🇨🇳 中国' },
  { value: 'es', label: '🇪🇸 España' },
  { value: 'fr', label: '🇫🇷 France' },
  { value: 'it', label: '🇮🇹 Italia' },
  { value: 'br', label: '🇧🇷 Brasil' },
  { value: 'de', label: '🇩🇪 Deutschland' },
  { value: 'id', label: '🇮🇩 Indonesia' },
  { value: 'other', label: '🌍 Other' },
];

/**
 * Curated, well-known date/romantic spots per country. Names are proper nouns
 * kept in their local form (not translated), so they're recognizable to locals.
 * "other" is intentionally empty: the recipient enters their own venue.
 */
export const VENUES_BY_REGION: Record<Region, string[]> = {
  sg: ['Marina Bay', 'Gardens by the Bay', 'Jewel Changi Airport', 'Sentosa'],
  cn: ['外滩 (The Bund)', '颐和园 (Summer Palace)', '西湖 (West Lake)', '广州塔 (Canton Tower)'],
  es: ['Parque del Retiro', 'Park Güell', 'Plaza de España', 'La Alhambra'],
  fr: ['Tour Eiffel', 'Jardin du Luxembourg', 'Montmartre', 'Promenade des Anglais'],
  it: ['Verona', 'Piazza San Marco', 'Ponte Vecchio', 'Villa Borghese'],
  br: ['Praia de Copacabana', 'Cristo Redentor', 'Parque Ibirapuera', 'Jardim Botânico'],
  de: ['Brandenburger Tor', 'Englischer Garten', 'Kölner Dom', 'Elbphilharmonie'],
  id: ['Pantai Kuta', 'Malioboro', 'Kota Tua', 'Tanah Lot'],
  other: [],
};

/** Normalize an arbitrary string to a valid Region, falling back to the default. */
export function toRegion(value: string | null | undefined): Region {
  return (REGION_CODES as readonly string[]).includes(value ?? '')
    ? (value as Region)
    : DEFAULT_REGION;
}
