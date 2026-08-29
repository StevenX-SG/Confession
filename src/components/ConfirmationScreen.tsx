"use client";
import { translations, chromeLang, dateLocale, type DisplayMode } from "../i18n";
import { formatDateHuman } from "../utils/dateUtils";

export interface ConfirmationScreenProps {
  /** Sender's name (from the URL params). */
  from: string;
  /** Recipient's name (from the URL params). */
  to: string;
  /** Selected date as an ISO `YYYY-MM-DD` string. */
  date: string;
  /** Selected venue string (preset choice or custom text). */
  venue: string;
  /** Optional precise meeting spot within the venue. */
  spot?: string;
  /**
   * Confirms the plan. Parent-owned: the parent (DatePlanningFlow) performs the
   * URL update via `history.replaceState` and transitions to the Date Pass view
   * (Requirements 8.2, 8.3). This component only surfaces the Confirm action.
   */
  onConfirm: () => void;
  /**
   * Current display/language mode. Not part of the minimal design signature,
   * but threaded through so the confirmation chrome (title, labels, button) is
   * localized consistently with its sibling step components — CalendarComponent
   * and VenueSelector (Requirement 12.3).
   */
  mode: DisplayMode;
}

/**
 * ConfirmationScreen — the final review step of the date-planning flow.
 *
 * Behavior:
 * - Shows both names with a heart separator, mirroring the Date Pass styling so
 *   the review reads as a preview of the confirmed plan (Requirement 8.1).
 * - Renders the selected date in a human-readable format via `formatDateHuman`,
 *   localized to the current mode, alongside the selected venue (Requirement
 *   8.1).
 * - A Confirm Date button invokes `onConfirm`; the parent then updates the URL
 *   and reveals the Date Pass (Requirements 8.2, 8.3).
 *
 * Like its sibling step components (CalendarComponent, VenueSelector), this
 * renders content-only and is wrapped by the parent's animating GlassCard, so
 * it inherits the shared dark-space glassmorphism aesthetic and entry animation.
 */
export default function ConfirmationScreen({
  from,
  to,
  date,
  venue,
  spot,
  onConfirm,
  mode,
}: ConfirmationScreenProps) {
  const t = translations[chromeLang(mode)];
  const humanDate = formatDateHuman(date, dateLocale(mode));

  return (
    <div className="flex flex-col gap-5" data-testid="confirmation-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
        {t.confirmTitle}
      </h1>

      {/* Both names with a heart separator, previewing the Date Pass (Req 8.1). */}
      <p
        className="text-xl md:text-2xl font-bold text-white text-center"
        data-testid="confirmation-names"
      >
        {from} ❤️ {to}
      </p>

      {/* Selected date + venue summary (Req 8.1). */}
      <dl className="flex flex-col gap-3 rounded-xl bg-slate-800/50 border border-white/10 px-4 py-4 text-white/90">
        <div className="flex items-center justify-between gap-4">
          <dt className="font-semibold text-white/70">{t.confirmDate}</dt>
          <dd className="text-right font-semibold" data-testid="confirmation-date">
            {humanDate}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="font-semibold text-white/70">{t.confirmVenue}</dt>
          <dd className="text-right font-semibold" data-testid="confirmation-venue">
            {venue}
          </dd>
        </div>
        {spot && spot.trim().length > 0 && (
          <div className="flex items-center justify-between gap-4">
            <dt className="font-semibold text-white/70">{t.meetingPointLabel}</dt>
            <dd className="text-right font-semibold" data-testid="confirmation-spot">
              {spot}
            </dd>
          </div>
        )}
      </dl>

      <button
        type="button"
        onClick={onConfirm}
        data-testid="confirmation-confirm-button"
        className="mt-1 w-full rounded-full bg-rose-500/80 backdrop-blur-sm text-white font-bold shadow-lg px-6 py-3 min-h-[44px] border border-white/10 transition-all duration-150 hover:bg-rose-500 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-rose-400/50"
      >
        {t.confirmButton}
      </button>
    </div>
  );
}
