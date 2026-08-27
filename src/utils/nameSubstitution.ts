/**
 * Name substitution utility for the proposal dialogue flow.
 *
 * The confession dialogues in `src/i18n.ts` contain bracketed placeholder tokens
 * where a name should appear (e.g. `[Their Name]`, `[名字]`, `[Su nombre]`). This
 * module provides a small pure function to substitute a real name into those
 * templates so the proposal feels personal (Requirement 3.1).
 *
 * Exported as named exports so both components (e.g. ProposalFlow) and property
 * tests can import the logic independently.
 */

/**
 * Regex source matching a single bracketed placeholder token such as
 * `[Their Name]` or `[名字]`. A placeholder is an opening `[`, followed by any
 * run of characters that are neither `[` nor `]`, followed by a closing `]`.
 *
 * Defined as a source string (not a shared RegExp instance) so callers can
 * construct fresh, non-stateful `RegExp` objects and avoid the `lastIndex`
 * pitfalls of a shared global-flagged regex.
 */
const PLACEHOLDER_SOURCE = '\\[[^[\\]]*\\]';

/**
 * Substitute a name into a dialogue template, replacing every bracketed
 * placeholder token with the provided name.
 *
 * @param template - Dialogue string that may contain `[...]` placeholder tokens
 * @param name - The name to insert in place of each placeholder
 * @returns The template with all placeholder tokens replaced by `name`
 *
 * @example
 * substituteName('[Their Name]… will you be mine?', 'Alex')
 * // → 'Alex… will you be mine?'
 */
export function substituteName(template: string, name: string): string {
  if (typeof template !== 'string') return template;
  // Use a replacer function so `name` is inserted literally. Passing the name
  // as the replacement string would let `$`-sequences (e.g. `$$`, `$&`, `$1`)
  // be interpreted as special replacement patterns instead of literal text.
  return template.replace(new RegExp(PLACEHOLDER_SOURCE, 'g'), () => name);
}

/**
 * Report whether a template contains at least one bracketed placeholder token.
 *
 * @param template - The dialogue string to inspect
 * @returns true if a `[...]` placeholder token is present
 */
export function containsPlaceholder(template: string): boolean {
  return new RegExp(PLACEHOLDER_SOURCE).test(template);
}
