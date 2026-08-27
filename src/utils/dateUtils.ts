// Calendar and date-formatting utilities for the date-planning flow.
//
// All functions here are PURE: they never read the global clock (`new Date()`)
// on their own. Callers must pass `today` / `selectedIso` explicitly so the
// functions are deterministic and easy to unit/property test.
//
// ISO strings are always built from LOCAL date components (getFullYear /
// getMonth / getDate). We deliberately avoid `Date.prototype.toISOString()`,
// which serializes in UTC and can shift the calendar day for users in negative
// or positive timezone offsets.

/**
 * A single cell in the monthly calendar grid.
 */
export interface CalendarDay {
  /** Day of month (1-31). */
  date: number;
  /** ISO 8601 date string, YYYY-MM-DD. */
  iso: string;
  /** True when this cell represents `today`. */
  isToday: boolean;
  /** True when this cell is strictly before `today`. */
  isPast: boolean;
  /** True when this cell matches `selectedIso`. */
  isSelected: boolean;
  /** Day of week: 0 = Sunday, 6 = Saturday. */
  dayOfWeek: number;
}

/**
 * Number of days in a given month.
 *
 * @param year - Full year (e.g. 2026).
 * @param month - Month index, 0-based (0 = January, 11 = December), matching
 *   the JS `Date` convention.
 * @returns The count of days in that month (28-31), accounting for leap years.
 */
export function getDaysInMonth(year: number, month: number): number {
  // Day 0 of the *next* month rolls back to the last day of `month`.
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Convert a `Date` to an ISO 8601 date string (YYYY-MM-DD) using its LOCAL
 * calendar components. Zero-padded. Does not include a time component.
 *
 * @param date - The date to serialize.
 * @returns The YYYY-MM-DD string.
 */
export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // getMonth is 0-based
  const day = date.getDate();
  return `${pad4(year)}-${pad2(month)}-${pad2(day)}`;
}

/**
 * Determine whether a date is strictly in the past relative to `today`.
 *
 * Comparison is done on the calendar day only (times are ignored). Today and
 * any future date are NOT considered past.
 *
 * @param iso - The candidate date as an ISO string (YYYY-MM-DD).
 * @param today - The reference "now" date.
 * @returns True when `iso` falls before the calendar day of `today`.
 */
export function isDatePast(iso: string, today: Date): boolean {
  const todayIso = toIsoDate(today);
  // ISO YYYY-MM-DD strings are lexicographically ordered by date, so a plain
  // string comparison is a correct chronological comparison.
  return iso < todayIso;
}

/**
 * Build the ordered list of day cells for a given month.
 *
 * The returned array contains exactly one entry per day that exists in the
 * month (length === getDaysInMonth(year, month)). Each entry is flagged as
 * today / past / selected relative to the supplied `today` and `selectedIso`.
 *
 * @param year - Full year.
 * @param month - Month index, 0-based (JS `Date` convention).
 * @param selectedIso - Currently selected date (ISO string) or null.
 * @param today - The reference "now" date.
 * @returns One `CalendarDay` per day in the month, in ascending date order.
 */
export function generateCalendarGrid(
  year: number,
  month: number,
  selectedIso: string | null,
  today: Date
): CalendarDay[] {
  const daysInMonth = getDaysInMonth(year, month);
  const todayIso = toIsoDate(today);
  const days: CalendarDay[] = [];

  for (let date = 1; date <= daysInMonth; date++) {
    const cellDate = new Date(year, month, date);
    const iso = toIsoDate(cellDate);
    days.push({
      date,
      iso,
      isToday: iso === todayIso,
      isPast: iso < todayIso,
      isSelected: selectedIso != null && iso === selectedIso,
      dayOfWeek: cellDate.getDay(),
    });
  }

  return days;
}

/**
 * Format an ISO date string as a human-readable string, e.g.
 * "Sunday, 30 August 2026".
 *
 * @param iso - The date as an ISO string (YYYY-MM-DD).
 * @param locale - BCP 47 locale tag. Defaults to English ('en-GB' for the
 *   "weekday, day month year" ordering).
 * @returns The localized, human-readable date string.
 */
export function formatDateHuman(iso: string, locale: string = 'en-GB'): string {
  const [year, month, day] = iso.split('-').map(Number);
  // Construct with local components to avoid a UTC day shift.
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Determine whether the month identified by {year, month} falls strictly before
 * the current month of `today` (compared at month granularity, ignoring day).
 *
 * This is the guard behind "disable navigation to months before the current
 * month" (Requirement 6.3): the calendar's previous-month button is disabled
 * whenever the displayed month is the current month or earlier, i.e. when the
 * month you would navigate to is before the current month.
 *
 * @param year - Full year of the candidate month.
 * @param month - Month index, 0-based (JS `Date` convention).
 * @param today - The reference "now" date.
 * @returns True when {year, month} is strictly before the current month.
 */
export function isMonthBeforeCurrent(
  year: number,
  month: number,
  today: Date
): boolean {
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  return year < currentYear || (year === currentYear && month < currentMonth);
}

/** Zero-pad a number to 2 digits. */
function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

/** Zero-pad a number to 4 digits (for years). */
function pad4(n: number): string {
  return String(n).padStart(4, '0');
}
