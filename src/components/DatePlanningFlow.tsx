"use client";
import { useCallback, useRef, useState } from "react";
import GlassCard from "./GlassCard";
import DatePass from "./DatePass";
import CalendarComponent from "./CalendarComponent";
import FingerGuide from "./FingerGuide";
import VenueSelector from "./VenueSelector";
import ConfirmationScreen from "./ConfirmationScreen";
import { type DisplayMode } from "../i18n";
import { buildConfirmationUrl } from "../utils/urlParams";

export interface DatePlanningFlowProps {
  /** Sender's name (carried through into the confirmation URL). */
  from: string;
  /** Recipient's name (the one planning the date). */
  to: string;
  /** Current display/language mode (controlled by the parent). */
  mode: DisplayMode;
}

/**
 * The ordered steps of the date-planning flow.
 *
 * calendar → venue → confirm → done, advancing on each "continue"/confirm.
 * `done` renders the final DatePass once the URL has been updated.
 */
export type PlanningStep = "calendar" | "venue" | "confirm" | "done";

/**
 * DatePlanningFlow — orchestration shell for the post-acceptance date-planning
 * experience (calendar → venue → confirm → done).
 *
 * This component owns the flow's state machine:
 * - `step`         — the current {@link PlanningStep}.
 * - `selectedDate` — chosen date as an ISO `YYYY-MM-DD` string, or null.
 * - `selectedVenue`— chosen venue string, or null.
 * - `guideVisible` — whether the FingerGuide hint is still shown on the calendar
 *   step (dismissed on the Recipient's first calendar interaction, Req 5.3).
 *
 * Step transitions:
 * - Calendar: pick a date, then Continue → advances to `venue` (Requirement 4.4).
 * - Venue: pick a venue, then Continue → advances to `confirm`.
 * - Confirm: Confirm Date → updates the browser URL via `history.replaceState`
 *   with `from`, `to`, `status=accepted`, `date`, and URL-encoded `venue`
 *   (Requirement 8.2), then transitions to the Date Pass view (Requirement 8.3).
 *
 * The flow enters with the shared `fadeSlideUp` animation, applied through the
 * animating {@link GlassCard} wrapper (Requirement 4.4).
 *
 * The rich step UIs are composed here from their dedicated components:
 * - CalendarComponent  (task 6.1) + FingerGuide (task 6.2)
 * - VenueSelector      (task 7.1)
 * - ConfirmationScreen (task 7.3)
 * - DatePass           (task 9.1)
 */
export default function DatePlanningFlow({ from, to, mode }: DatePlanningFlowProps) {
  const [step, setStep] = useState<PlanningStep>("calendar");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null);

  // The FingerGuide hint points at the calendar until the Recipient interacts
  // with it for the first time (Requirement 5.3). `calendarRef` anchors the
  // guide to the rendered calendar so it points at the grid without overlapping
  // any cells (Requirements 5.1, 5.2, 5.4).
  const [guideVisible, setGuideVisible] = useState(true);
  const calendarRef = useRef<HTMLDivElement>(null);

  const handleDateSelect = useCallback((iso: string) => {
    setSelectedDate(iso);
  }, []);

  // Any calendar interaction (day tap or month navigation) dismisses the guide.
  const handleCalendarInteraction = useCallback(() => {
    setGuideVisible(false);
  }, []);

  // Calendar step → advance to venue once a date is selected (Requirement 4.4).
  const handleDateContinue = useCallback(() => {
    if (!selectedDate) return;
    setStep("venue");
  }, [selectedDate]);

  const handleVenueSelect = useCallback((venue: string) => {
    setSelectedVenue(venue);
  }, []);

  // Venue step → advance to confirm once a venue is selected.
  const handleVenueContinue = useCallback(() => {
    if (!selectedVenue || selectedVenue.trim().length === 0) return;
    setStep("confirm");
  }, [selectedVenue]);

  // Confirm step → update the URL in place (no navigation/history entry) so the
  // link is shareable and refresh-safe (Requirement 8.2), then reveal the Date
  // Pass view (Requirement 8.3).
  const handleConfirm = useCallback(() => {
    if (!selectedDate || !selectedVenue) return;
    const url = buildConfirmationUrl(from, to, selectedDate, selectedVenue);
    window.history.replaceState({}, "", url);
    setStep("done");
  }, [from, to, selectedDate, selectedVenue]);

  // Once confirmed, hand off to the Date Pass view (task 9.1). The URL has
  // already been updated, so a refresh at this point re-derives `date-pass`.
  if (step === "done" && selectedDate && selectedVenue) {
    return (
      <DatePass from={from} to={to} date={selectedDate} venue={selectedVenue} mode={mode} />
    );
  }

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center px-4 py-16"
      data-testid="date-planning-flow"
      data-step={step}
    >
      {/* GlassCard applies the shared fadeSlideUp entry animation (Req 4.4). */}
      <GlassCard>
        {/* Calendar step — full monthly grid with month nav + past-date
            disabling (task 6.1), guided by the FingerGuide hint (task 6.2). */}
        {step === "calendar" && (
          <div ref={calendarRef}>
            <CalendarComponent
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              onInteraction={handleCalendarInteraction}
              onContinue={handleDateContinue}
              mode={mode}
            />
          </div>
        )}

        {/* Venue step — preset venue cards + custom-venue input (task 7.1). */}
        {step === "venue" && (
          <VenueSelector
            selectedVenue={selectedVenue}
            onVenueSelect={handleVenueSelect}
            onContinue={handleVenueContinue}
            mode={mode}
          />
        )}

        {/* Confirm step — polished summary + Confirm → replaceState + Date Pass
            transition (task 7.3, Requirements 8.2, 8.3). */}
        {step === "confirm" && (
          <ConfirmationScreen
            from={from}
            to={to}
            date={selectedDate ?? ""}
            venue={selectedVenue ?? ""}
            onConfirm={handleConfirm}
            mode={mode}
          />
        )}
      </GlassCard>

      {/* Animated pointing hint drawing attention to the calendar during the
          surprise reveal; dismissed on first interaction (Requirement 5). */}
      <FingerGuide
        visible={step === "calendar" && guideVisible}
        targetRef={calendarRef}
      />
    </div>
  );
}
