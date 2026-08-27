/**
 * Venue validation utilities for the date-planning flow.
 *
 * Extracted as a pure function so the Continue-button-enabled rule can be
 * property-tested independently of the VenueSelector component (Property 9).
 */

/**
 * Determines whether a venue selection is valid for advancing the flow.
 *
 * A venue is valid if and only if it is a non-null string containing at least
 * one non-whitespace character. This covers both preset choices (which are
 * always non-empty) and custom text entries (which must not be blank or
 * whitespace-only).
 *
 * Requirement 7.4: THE Venue_Selector SHALL enable the Continue button only
 * when a venue is selected (or custom text is entered).
 *
 * @param venue The currently selected venue string, or null when nothing is chosen.
 * @returns true if the Continue button should be enabled, false otherwise.
 */
export function isVenueValid(venue: string | null | undefined): boolean {
  return venue != null && venue.trim().length > 0;
}
