"use client";
import { useCallback, useMemo, useRef, useState } from "react";
import { translations, chromeLang, type DisplayMode } from "../i18n";
import {
  generateCalendarGrid,
  formatDateHuman,
  isMonthBeforeCurrent,
} from "../utils/dateUtils";

export interface CalendarProps {
  /** Currently selected date as an ISO `YYYY-MM-DD` string, or null. */
  selectedDate: string | null;
  /** Called with the ISO date string when a selectable date cell is chosen. */
  onDateSelect: (isoDate: string) => void;
  /**
   * Signals the first (and any) interaction with the calendar — used by the
   * parent to dismiss the FingerGuide hint (Requirement 5.3). Fires on taps of
   * any calendar element (day cells and month-navigation controls).
   */
  onInteraction: () => void;
  /**
   * Current display/language mode. Not part of the minimal design signature,
   * but threaded through so the calendar's chrome (title, month names, day
   * headers, selected-date label) is localized consistently with sibling
   * components (Requirement 12.3).
   */
  mode: DisplayMode;
  /**
   * Optional Continue handler. When provided, a Continue button is rendered
   * below the grid, enabled only once a date is selected (Requirement 6.7).
   * The parent (DatePlanningFlow) advances the step from here.
   */
  onContinue?: () => void;
}

/**
 * CalendarComponent — an interactive monthly calendar grid for picking a date.
 *
 * Behavior:
 * - Renders a full month grid via {@link generateCalendarGrid}, with leading
 *   blank cells so each day lands under its correct weekday column
 *   (Requirement 6.1).
 * - Previous/Next month navigation. The Previous button is disabled whenever
 *   navigating back would land on a month before the current month
 *   (Requirements 6.2, 6.3) — i.e. you can never browse into the past.
 * - Past date cells are visually dimmed and non-interactive; tapping them is a
 *   no-op (Requirement 6.5).
 * - Selecting today or any future date highlights it with a rose accent and
 *   reports the ISO value via `onDateSelect` (Requirements 6.4, 6.8).
 * - The selected date is shown below the grid in a human-readable format
 *   (Requirement 6.7).
 * - Every cell is at least 44px for comfortable mobile touch targets, and the
 *   grid is fully responsive without horizontal scrolling (Requirements 6.6,
 *   11.1).
 *
 * The component keeps NO date state of its own beyond the currently viewed
 * month; the selected date is owned by the parent and passed in via
 * `selectedDate`, keeping this component a controlled input.
 */
export default function CalendarComponent({
  selectedDate,
  onDateSelect,
  onInteraction,
  mode,
  onContinue,
}: CalendarProps) {
  const t = translations[chromeLang(mode)];

  // A stable "today" reference for the component's lifetime. Computed once so
  // the past/today classification (and the min-navigable month) doesn't shift
  // mid-render across re-renders.
  const todayRef = useRef<Date>(new Date());
  const today = todayRef.current;

  // The month currently on screen. Initialize to the selected date's month when
  // one is already chosen (e.g. returning to the step), otherwise today's month.
  const [view, setView] = useState<{ year: number; month: number }>(() => {
    if (selectedDate) {
      const [y, m] = selectedDate.split("-").map(Number);
      if (Number.isFinite(y) && Number.isFinite(m)) {
        return { year: y, month: m - 1 };
      }
    }
    return { year: today.getFullYear(), month: today.getMonth() };
  });

  const days = useMemo(
    () => generateCalendarGrid(view.year, view.month, selectedDate, today),
    [view.year, view.month, selectedDate, today]
  );

  // Number of empty leading cells before the 1st, so day 1 sits under its
  // correct weekday column (Sunday-first grid).
  const leadingBlanks = days.length > 0 ? days[0].dayOfWeek : 0;

  // Previous navigation targets the month before the one on screen. Disable it
  // whenever that target month is before the current month (Requirement 6.3).
  const prevTarget = useMemo(() => {
    const month = view.month - 1;
    return month < 0
      ? { year: view.year - 1, month: 11 }
      : { year: view.year, month };
  }, [view]);

  const prevDisabled = isMonthBeforeCurrent(prevTarget.year, prevTarget.month, today);

  const goPrev = useCallback(() => {
    onInteraction();
    if (prevDisabled) return;
    setView(prevTarget);
  }, [onInteraction, prevDisabled, prevTarget]);

  const goNext = useCallback(() => {
    onInteraction();
    setView((v) => {
      const month = v.month + 1;
      return month > 11 ? { year: v.year + 1, month: 0 } : { year: v.year, month };
    });
  }, [onInteraction]);

  const handleSelect = useCallback(
    (iso: string, isPast: boolean) => {
      onInteraction();
      // Past dates are non-interactive: selecting one is a no-op (Req 6.5).
      if (isPast) return;
      onDateSelect(iso);
    },
    [onInteraction, onDateSelect]
  );

  const canContinue = selectedDate != null;

  return (
    <div className="flex flex-col gap-5" data-testid="calendar-component">
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          {t.calendarTitle}
        </h1>
        <p className="mt-1.5 text-sm md:text-base text-white/60">
          {t.calendarSubtitle}
        </p>
      </div>

      {/* Month navigation header (Requirement 6.2). */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={goPrev}
          disabled={prevDisabled}
          aria-label="Previous month"
          data-testid="calendar-prev"
          className="flex items-center justify-center rounded-full bg-white/[0.06] backdrop-blur-sm border border-sky-200/20 text-white text-xl min-h-[44px] min-w-[44px] transition-all duration-150 hover:bg-sky-400/15 hover:border-sky-200/40 active:scale-[0.96] focus:outline-none focus:ring-2 focus:ring-rose-400/50 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/[0.06]"
        >
          &#8249;
        </button>

        <div
          className="text-lg md:text-xl font-semibold text-white text-center"
          aria-live="polite"
          data-testid="calendar-month-label"
        >
          {t.monthNames[view.month]} {view.year}
        </div>

        <button
          type="button"
          onClick={goNext}
          aria-label="Next month"
          data-testid="calendar-next"
          className="flex items-center justify-center rounded-full bg-white/[0.06] backdrop-blur-sm border border-sky-200/20 text-white text-xl min-h-[44px] min-w-[44px] transition-all duration-150 hover:bg-sky-400/15 hover:border-sky-200/40 active:scale-[0.96] focus:outline-none focus:ring-2 focus:ring-rose-400/50"
        >
          &#8250;
        </button>
      </div>

      {/* Weekday headers (Sun-Sat), localized. */}
      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {t.dayHeaders.map((day, i) => (
          <div
            key={i}
            className="text-center text-xs md:text-sm font-semibold text-white/50 py-1"
            aria-hidden="true"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Day grid (Requirement 6.1). Cells are min 44px for mobile (Req 6.6). */}
      <div
        className="grid grid-cols-7 gap-1 md:gap-2"
        role="grid"
        aria-label={`${t.monthNames[view.month]} ${view.year}`}
      >
        {/* Leading blanks so day 1 aligns to its weekday column. */}
        {Array.from({ length: leadingBlanks }).map((_, i) => (
          <div key={`blank-${i}`} aria-hidden="true" />
        ))}

        {days.map((day) => {
          const base =
            "flex items-center justify-center aspect-square min-h-[44px] min-w-[44px] w-full rounded-xl text-sm md:text-base font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-rose-400/50";

          let stateClasses: string;
          if (day.isSelected) {
            // Selected: warm Midnight Rose moment — muted rose gradient, soft
            // rose glow, white text, gentle scale-up (Requirement 6.4).
            stateClasses =
              "bg-gradient-to-br from-rose-500/90 to-rose-400/80 text-white border border-rose-200/50 shadow-[0_0_22px_-2px_rgba(244,114,182,0.65)] scale-[1.08]";
          } else if (day.isPast) {
            // Past: quietly dimmed + non-interactive (Requirement 6.5).
            stateClasses =
              "bg-transparent text-white/20 border border-transparent cursor-not-allowed";
          } else if (day.isToday) {
            // Today: a subtle rose ring marks it without stealing focus.
            stateClasses =
              "bg-white/[0.05] text-white border border-rose-300/50 hover:bg-sky-400/10 hover:border-sky-200/50 hover:shadow-[0_0_16px_-2px_rgba(125,175,255,0.55)] hover:scale-[1.05] active:scale-[0.97] cursor-pointer";
          } else {
            // Unselected: faint translucent glass; hover blooms a soft
            // moonlight-blue glow rather than a heavy grey block.
            stateClasses =
              "bg-white/[0.04] text-white/90 border border-white/10 hover:bg-sky-400/10 hover:border-sky-200/50 hover:shadow-[0_0_16px_-2px_rgba(125,175,255,0.55)] hover:scale-[1.05] active:scale-[0.97] cursor-pointer";
          }

          return (
            <button
              key={day.iso}
              type="button"
              onClick={() => handleSelect(day.iso, day.isPast)}
              disabled={day.isPast}
              aria-pressed={day.isSelected}
              aria-label={formatDateHuman(day.iso, chromeLang(mode) === "zh" ? "zh-CN" : "en-GB")}
              aria-current={day.isToday ? "date" : undefined}
              data-testid={`calendar-day-${day.iso}`}
              data-past={day.isPast ? "true" : "false"}
              data-selected={day.isSelected ? "true" : "false"}
              className={`${base} ${stateClasses}`}
            >
              {day.date}
            </button>
          );
        })}
      </div>

      {/* Human-readable selected date (Requirement 6.7). */}
      {selectedDate && (
        <p className="text-center text-sm text-white/80" data-testid="calendar-selected-date">
          {t.selectedDateLabel.replace(
            "{date}",
            formatDateHuman(selectedDate, chromeLang(mode) === "zh" ? "zh-CN" : "en-GB")
          )}
        </p>
      )}

      {/* Continue button — enabled only once a date is selected (Req 6.7). */}
      {onContinue && (
        <button
          type="button"
          onClick={onContinue}
          disabled={!canContinue}
          data-testid="calendar-continue"
          className="mt-1 w-full rounded-full bg-gradient-to-r from-rose-500 to-rose-400 text-white font-bold shadow-[0_10px_30px_-8px_rgba(244,114,182,0.7)] px-6 py-3 min-h-[44px] border border-rose-200/30 transition-all duration-150 hover:from-rose-400 hover:to-rose-300 hover:scale-[1.02] hover:shadow-[0_12px_36px_-6px_rgba(244,114,182,0.85)] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-rose-300/60 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
        >
          {t.continue}
        </button>
      )}
    </div>
  );
}
