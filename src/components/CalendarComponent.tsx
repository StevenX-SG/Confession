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
      <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
        {t.calendarTitle}
      </h1>

      {/* Month navigation header (Requirement 6.2). */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={goPrev}
          disabled={prevDisabled}
          aria-label="Previous month"
          data-testid="calendar-prev"
          className="flex items-center justify-center rounded-full bg-slate-700/60 backdrop-blur-sm border border-white/10 text-white text-xl min-h-[44px] min-w-[44px] transition-all duration-150 hover:bg-slate-600/70 active:scale-[0.96] focus:outline-none focus:ring-2 focus:ring-rose-400/50 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-slate-700/60"
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
          className="flex items-center justify-center rounded-full bg-slate-700/60 backdrop-blur-sm border border-white/10 text-white text-xl min-h-[44px] min-w-[44px] transition-all duration-150 hover:bg-slate-600/70 active:scale-[0.96] focus:outline-none focus:ring-2 focus:ring-rose-400/50"
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
            // Selected: rose accent highlight (Requirement 6.4).
            stateClasses =
              "bg-rose-500 text-white border border-rose-300 shadow-lg scale-[1.03]";
          } else if (day.isPast) {
            // Past: visually disabled + non-interactive (Requirement 6.5).
            stateClasses =
              "bg-slate-800/30 text-white/25 border border-transparent cursor-not-allowed";
          } else if (day.isToday) {
            stateClasses =
              "bg-slate-700/50 text-white border border-rose-400/60 hover:bg-slate-600/70 hover:scale-[1.03] active:scale-[0.97] cursor-pointer";
          } else {
            stateClasses =
              "bg-slate-800/50 text-white/90 border border-white/10 hover:bg-slate-700/70 hover:scale-[1.03] active:scale-[0.97] cursor-pointer";
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
          className="mt-1 w-full rounded-full bg-rose-500/80 backdrop-blur-sm text-white font-bold shadow-lg px-6 py-3 min-h-[44px] border border-white/10 transition-all duration-150 hover:bg-rose-500 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-rose-400/50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-rose-500/80"
        >
          {t.continue}
        </button>
      )}
    </div>
  );
}
