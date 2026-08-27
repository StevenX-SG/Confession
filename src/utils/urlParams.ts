/**
 * URL parameter parsing and construction utilities for the dynamic date-planning flow.
 *
 * All app state is derivable from URL search params, enabling shareable links and
 * refresh persistence without a backend. These functions are exported as named
 * exports so components and property tests can import them independently.
 */

/**
 * The view state derived from the current URL search parameters.
 *
 * - `creation`  — no usable params (or invalid/incomplete accepted params)
 * - `proposal`  — both `from` and `to` present without `status=accepted`
 * - `date-pass` — `from`, `to`, `status=accepted`, valid `date`, and `venue` all present
 */
export interface AppState {
  view: 'creation' | 'proposal' | 'date-pass';
  from?: string;
  to?: string;
  date?: string; // ISO YYYY-MM-DD
  venue?: string;
}

/**
 * Validate that a string is a real calendar date in ISO 8601 `YYYY-MM-DD` format.
 * Rejects malformed strings, out-of-range months/days, and invalid calendar dates
 * (e.g. Feb 29 on a non-leap year, April 31).
 *
 * @param str - The candidate date string
 * @returns true only if `str` is `YYYY-MM-DD` representing an existing date
 */
export function isValidIsoDate(str: string): boolean {
  if (typeof str !== 'string') return false;

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]); // 1-12
  const day = Number(match[3]); // 1-31

  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  // Build a UTC date and verify the components survive the round-trip.
  // This catches invalid calendar dates like 2023-02-29 or 2023-04-31.
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

/**
 * Validate a user-entered name. Rejects empty strings and strings composed
 * entirely of whitespace (spaces, tabs, newlines).
 *
 * @param str - The candidate name
 * @returns true if the name contains at least one non-whitespace character
 */
export function validateName(str: string): boolean {
  if (typeof str !== 'string') return false;
  return str.trim().length > 0;
}

/**
 * Parse the current URL's search parameters into an {@link AppState}.
 *
 * Routing rules:
 * - `status=accepted` + `from` + `to` + valid `date` + `venue` → `date-pass`
 * - `from` + `to` (without a complete accepted set) → `proposal`
 * - anything else (missing `to`, incomplete/invalid accepted params, etc.) → `creation`
 *
 * URL-encoded values (spaces, special characters) are decoded automatically by
 * `URLSearchParams`. Malformed params never throw — they fall back to `creation`.
 *
 * @returns The derived app state
 */
export function parseUrlParams(): AppState {
  const params = new URLSearchParams(window.location.search);
  const from = params.get('from');
  const to = params.get('to');
  const status = params.get('status');
  const date = params.get('date');
  const venue = params.get('venue');

  if (
    status === 'accepted' &&
    from &&
    to &&
    date &&
    venue &&
    isValidIsoDate(date)
  ) {
    return { view: 'date-pass', from, to, date, venue };
  }

  if (from && to) {
    return { view: 'proposal', from, to };
  }

  return { view: 'creation' };
}

/**
 * Build the base URL (origin + pathname) for the current page, without any
 * existing search parameters or hash.
 */
function baseUrl(): string {
  return `${window.location.origin}${window.location.pathname}`;
}

/**
 * Construct a shareable proposal URL containing URL-encoded `from` and `to`
 * parameters. Round-trips with {@link parseUrlParams} to preserve the original
 * name values.
 *
 * @param from - Sender name
 * @param to - Recipient name
 * @returns Full URL string, e.g. `https://host/path?from=Alex&to=Sam`
 */
export function buildProposalUrl(from: string, to: string): string {
  const params = new URLSearchParams();
  params.set('from', from);
  params.set('to', to);
  return `${baseUrl()}?${params.toString()}`;
}

/**
 * Construct a shareable confirmation URL containing URL-encoded `from`, `to`,
 * `status=accepted`, `date` (ISO), and `venue` parameters. Round-trips with
 * {@link parseUrlParams} to preserve the original values.
 *
 * @param from - Sender name
 * @param to - Recipient name
 * @param date - Confirmed date in ISO `YYYY-MM-DD` format
 * @param venue - Selected venue name
 * @returns Full URL string
 */
export function buildConfirmationUrl(
  from: string,
  to: string,
  date: string,
  venue: string
): string {
  const params = new URLSearchParams();
  params.set('from', from);
  params.set('to', to);
  params.set('status', 'accepted');
  params.set('date', date);
  params.set('venue', venue);
  return `${baseUrl()}?${params.toString()}`;
}
