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
  spot?: string; // optional precise meeting spot within the venue
  senderGender?: 'man' | 'woman'; // sender's gender, controls gendered wording
  /**
   * When true, the confession link was created with Evil Mode enabled. This is
   * intentionally NOT surfaced anywhere in the recipient UI — it only changes
   * what the *final* "No" click does (it secretly routes into the same happy
   * celebration flow used for "Yes"). The flag is packed into the obfuscated
   * proposal token (see {@link encodeProposalToken}) rather than a readable
   * `mode=evil`, so a recipient glancing at the URL can't tell. Legacy plaintext
   * links (which predate this feature) parse back to `false`.
   */
  evilMode?: boolean;
}

// --- Proposal payload obfuscation --------------------------------------------
// Rather than exposing `from`, `to`, `g` and (worst of all) `mode=evil` as
// readable query params, we pack the entire proposal payload into a single
// opaque token. The whole link then reads as uniform gibberish, so nothing —
// not the names, not the gender, and especially not Evil Mode — can be gleaned
// at a glance. Properties:
//   * salted            — a random byte per link, so the same payload produces a
//                          different token every time (no pattern-matching);
//   * reversible offline — no server or stored state needed to decode it;
//   * Unicode-safe       — names are UTF-8 encoded, so CJK names round-trip.
// This is obfuscation, not cryptography — it only needs to defeat a casual look
// (e.g. dropping the URL into a plain base64 decoder yields scrambled bytes).

/** Query-string key for the packed token. Reads like a generic short code. */
const PROPOSAL_TOKEN_PARAM = 'c';
/** Rolling XOR key mixed with the per-link salt to scramble the bytes. */
const OBF_KEY = [0x5d, 0x3b, 0xa7, 0xc3, 0x1f, 0x92];

/** The decoded contents of a proposal token. */
export interface ProposalPayload {
  from: string;
  to: string;
  gender: 'man' | 'woman';
  evil: boolean;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  // URL-safe base64 with padding stripped so the token stays clean in a link.
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToBytes(token: string): Uint8Array {
  const b64 = token.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/**
 * Pack a proposal payload into an opaque, salted, URL-safe token.
 *
 * Layout (before base64url): `[salt][utf8(json) XOR (key[i] ^ salt)]` where the
 * JSON is a compact positional array `[from, to, 'm'|'w', 0|1]`.
 */
export function encodeProposalToken(payload: ProposalPayload): string {
  const json = JSON.stringify([
    payload.from,
    payload.to,
    payload.gender === 'woman' ? 'w' : 'm',
    payload.evil ? 1 : 0,
  ]);
  const utf8 = new TextEncoder().encode(json);
  const salt = Math.floor(Math.random() * 256);
  const out = new Uint8Array(utf8.length + 1);
  out[0] = salt;
  for (let i = 0; i < utf8.length; i++) {
    out[i + 1] = (utf8[i] ^ OBF_KEY[i % OBF_KEY.length] ^ salt) & 0xff;
  }
  return bytesToBase64Url(out);
}

/**
 * Decode a token produced by {@link encodeProposalToken}. Returns `null` for
 * missing, malformed, or foreign tokens so callers can fall back to legacy
 * plaintext params.
 */
export function decodeProposalToken(token: string | null): ProposalPayload | null {
  if (!token) return null;
  try {
    const bytes = base64UrlToBytes(token);
    if (bytes.length < 2) return null;
    const salt = bytes[0];
    const utf8 = new Uint8Array(bytes.length - 1);
    for (let i = 0; i < utf8.length; i++) {
      utf8[i] = (bytes[i + 1] ^ OBF_KEY[i % OBF_KEY.length] ^ salt) & 0xff;
    }
    const arr = JSON.parse(new TextDecoder().decode(utf8));
    if (!Array.isArray(arr) || arr.length < 4) return null;
    const [from, to, g, evil] = arr;
    if (typeof from !== 'string' || typeof to !== 'string') return null;
    if (!validateName(from) || !validateName(to)) return null;
    return {
      from,
      to,
      gender: g === 'w' ? 'woman' : 'man',
      evil: evil === 1 || evil === true,
    };
  } catch {
    // Any decoding/JSON error means this isn't one of our tokens.
    return null;
  }
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
  const spot = params.get('spot');
  const senderGender: 'man' | 'woman' = params.get('g') === 'w' ? 'woman' : 'man';

  // Date-pass links stay plaintext (they're post-acceptance and carry no
  // secret): status + names + a valid date + venue route straight to the pass.
  if (
    status === 'accepted' &&
    from &&
    to &&
    date &&
    venue &&
    isValidIsoDate(date)
  ) {
    return { view: 'date-pass', from, to, date, venue, spot: spot ?? undefined };
  }

  // Preferred proposal format: a single opaque token holding names + gender +
  // the Evil Mode flag, so the whole URL is unreadable gibberish.
  const packed = decodeProposalToken(params.get(PROPOSAL_TOKEN_PARAM));
  if (packed) {
    return {
      view: 'proposal',
      from: packed.from,
      to: packed.to,
      senderGender: packed.gender,
      evilMode: packed.evil,
    };
  }

  // Legacy fallback: plaintext `from`/`to` links created before tokenisation.
  // These predate Evil Mode, so they are always treated as normal mode.
  if (from && to) {
    return { view: 'proposal', from, to, senderGender, evilMode: false };
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
 * @param gender - Sender's gender (controls gendered wording)
 * @param evil - When true, the Evil Mode flag is folded into the token so the
 *   final "No" secretly routes into the happy celebration flow.
 * @returns Full URL string, e.g. `https://host/path?c=Zk9hMm..` — everything
 *   (names, gender, Evil Mode) is packed into one opaque, salted token, so the
 *   recipient can't read the names or tell that Evil Mode is enabled.
 */
export function buildProposalUrl(
  from: string,
  to: string,
  gender: 'man' | 'woman' = 'man',
  evil = false
): string {
  const params = new URLSearchParams();
  // The whole payload lives in a single opaque token. Salting means even the
  // exact same inputs yield a different-looking link each time.
  params.set(
    PROPOSAL_TOKEN_PARAM,
    encodeProposalToken({ from, to, gender, evil })
  );
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
  venue: string,
  spot?: string
): string {
  const params = new URLSearchParams();
  params.set('from', from);
  params.set('to', to);
  params.set('status', 'accepted');
  params.set('date', date);
  params.set('venue', venue);
  if (spot && spot.trim().length > 0) {
    params.set('spot', spot.trim());
  }
  return `${baseUrl()}?${params.toString()}`;
}
