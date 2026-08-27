"use client";
import { useCallback, useState } from "react";
import { translations, chromeLang, type DisplayMode } from "../i18n";
import { isVenueValid } from "../utils/venueValidation";

/**
 * Preset venue choices offered before the custom option (Requirement 7.2).
 * Declared `as const` so the values are a readonly string tuple.
 */
export const PRESET_VENUES = [
  "Marina Bay",
  "Gardens by the Bay",
  "Jewel Changi Airport",
  "Sentosa",
] as const;

/** A sentinel comparison helper so the readonly tuple can be membership-tested. */
function isPresetVenue(value: string | null): boolean {
  return value != null && (PRESET_VENUES as readonly string[]).includes(value);
}

export interface VenueSelectorProps {
  /** Currently selected venue string, or null when nothing is chosen yet. */
  selectedVenue: string | null;
  /** Called with the chosen venue string (preset value or custom text). */
  onVenueSelect: (venue: string) => void;
  /** Advances the flow to the confirmation step (parent-owned). */
  onContinue: () => void;
  /**
   * Current display/language mode. Not part of the minimal design signature,
   * but threaded through so the selector's chrome (title, custom label,
   * placeholder, continue button) is localized consistently with its sibling
   * components (Requirement 12.3).
   */
  mode: DisplayMode;
}

/**
 * VenueSelector — lets the Recipient choose where the date should happen.
 *
 * Behavior:
 * - Renders the four {@link PRESET_VENUES} plus a "Custom venue" option as
 *   radio-style selectable cards (Requirements 7.1, 7.2). Exactly one option is
 *   active at a time.
 * - Selecting the Custom option reveals a text input for a free-form venue name
 *   (Requirement 7.3). Its value is reported upward via `onVenueSelect`.
 * - The Continue button is enabled only when a non-empty venue is selected —
 *   either a preset choice or non-whitespace custom text (Requirement 7.4).
 * - Every option and control has a minimum 44px touch target and the options
 *   stack vertically for comfortable mobile tapping (Requirements 7.5, 11.2).
 *
 * The component is controlled: the selected venue is owned by the parent and
 * passed in via `selectedVenue`. A small amount of local state tracks whether
 * the Custom option is active and its current text so the UI can distinguish a
 * blank custom entry from "nothing selected".
 */
export default function VenueSelector({
  selectedVenue,
  onVenueSelect,
  onContinue,
  mode,
}: VenueSelectorProps) {
  const t = translations[chromeLang(mode)];

  // Whether the Custom option is the active choice. Initialize from the
  // incoming selection: a non-null value that isn't a preset means the custom
  // path was taken (e.g. returning to this step).
  const [isCustom, setIsCustom] = useState<boolean>(
    () => selectedVenue != null && !isPresetVenue(selectedVenue)
  );

  // The current custom-venue text. Seeded from a non-preset incoming selection.
  const [customText, setCustomText] = useState<string>(() =>
    selectedVenue != null && !isPresetVenue(selectedVenue) ? selectedVenue : ""
  );

  const handlePresetSelect = useCallback(
    (venue: string) => {
      setIsCustom(false);
      onVenueSelect(venue);
    },
    [onVenueSelect]
  );

  const handleCustomSelect = useCallback(() => {
    setIsCustom(true);
    // Report the current custom text (possibly empty) so the parent's selection
    // reflects the custom path; Continue stays disabled until text is entered.
    onVenueSelect(customText);
  }, [customText, onVenueSelect]);

  const handleCustomTextChange = useCallback(
    (text: string) => {
      setCustomText(text);
      onVenueSelect(text);
    },
    [onVenueSelect]
  );

  // Continue is enabled iff a non-empty venue is selected: a preset choice, or
  // custom text with at least one non-whitespace character (Requirement 7.4).
  const canContinue = isVenueValid(selectedVenue);

  const optionBase =
    "flex items-center gap-3 w-full text-left rounded-xl px-4 py-3 min-h-[44px] border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-rose-400/50 cursor-pointer active:scale-[0.99]";

  const renderRadio = (active: boolean) => (
    <span
      aria-hidden="true"
      className={[
        "flex items-center justify-center shrink-0 h-5 w-5 rounded-full border-2 transition-colors",
        active ? "border-rose-300" : "border-white/40",
      ].join(" ")}
    >
      {active && <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />}
    </span>
  );

  return (
    <div className="flex flex-col gap-5" data-testid="venue-selector">
      <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
        {t.venueTitle}
      </h1>

      {/* Options stack vertically on all sizes for easy mobile tapping (Req 11.2). */}
      <div role="radiogroup" aria-label={t.venueTitle} className="flex flex-col gap-3">
        {PRESET_VENUES.map((venue) => {
          const active = !isCustom && selectedVenue === venue;
          return (
            <button
              key={venue}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => handlePresetSelect(venue)}
              data-testid={`venue-option-${venue}`}
              data-selected={active ? "true" : "false"}
              className={`${optionBase} ${
                active
                  ? "bg-rose-500/25 border-rose-300 text-white shadow-lg"
                  : "bg-slate-800/50 border-white/10 text-white/90 hover:bg-slate-700/70"
              }`}
            >
              {renderRadio(active)}
              <span className="font-semibold">{venue}</span>
            </button>
          );
        })}

        {/* Custom venue option — reveals a text input when active (Req 7.3). */}
        <button
          type="button"
          role="radio"
          aria-checked={isCustom}
          onClick={handleCustomSelect}
          data-testid="venue-option-custom"
          data-selected={isCustom ? "true" : "false"}
          className={`${optionBase} ${
            isCustom
              ? "bg-rose-500/25 border-rose-300 text-white shadow-lg"
              : "bg-slate-800/50 border-white/10 text-white/90 hover:bg-slate-700/70"
          }`}
        >
          {renderRadio(isCustom)}
          <span className="font-semibold">{t.customVenueLabel}</span>
        </button>
      </div>

      {isCustom && (
        <div className="flex flex-col gap-2">
          <label htmlFor="custom-venue" className="text-sm font-semibold text-white/80">
            {t.customVenueLabel}
          </label>
          <input
            id="custom-venue"
            type="text"
            value={customText}
            onChange={(e) => handleCustomTextChange(e.target.value)}
            placeholder={t.customVenuePlaceholder}
            aria-label={t.customVenueLabel}
            autoComplete="off"
            autoFocus
            data-testid="venue-custom-input"
            className="w-full rounded-xl bg-slate-800/60 backdrop-blur-sm border border-white/15 text-white placeholder-white/30 px-4 py-3 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-rose-400/50 focus:border-rose-400/50 transition"
          />
        </div>
      )}

      <button
        type="button"
        onClick={onContinue}
        disabled={!canContinue}
        data-testid="venue-continue"
        className="mt-1 w-full rounded-full bg-rose-500/80 backdrop-blur-sm text-white font-bold shadow-lg px-6 py-3 min-h-[44px] border border-white/10 transition-all duration-150 hover:bg-rose-500 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-rose-400/50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-rose-500/80"
      >
        {t.continue}
      </button>
    </div>
  );
}
