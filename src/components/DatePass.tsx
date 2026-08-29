"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import StarfieldCanvas from "./StarfieldCanvas";
import GlassCard from "./GlassCard";
import { translations, chromeLang, type DisplayMode } from "../i18n";
import { formatDateHuman } from "../utils/dateUtils";

export interface DatePassProps {
  /** Sender's name. */
  from: string;
  /** Recipient's name. */
  to: string;
  /** Confirmed date in ISO YYYY-MM-DD format. */
  date: string;
  /** Selected venue name. */
  venue: string;
  /** Optional precise meeting spot within the venue. */
  spot?: string;
  /** Current display/language mode (controlled by AppRouter). */
  mode: DisplayMode;
}

/** How long the "Link copied!" confirmation stays visible (Requirement 9.2). */
const COPIED_FEEDBACK_MS = 2000;

/**
 * Detect Web Share API availability once. Support does not change at runtime,
 * so it is resolved a single time and used to decide whether to render the
 * Share button (Requirements 9.3, 9.4). Guarded for non-browser environments.
 */
function isWebShareSupported(): boolean {
  return (
    typeof navigator !== "undefined" && typeof navigator.share === "function"
  );
}

/**
 * DatePass — the confirmed-date "ticket".
 *
 * Renders a polished digital ticket/card once a date + venue have been
 * confirmed (or when the app loads directly with `status=accepted` params):
 * - Both names joined with a heart separator (Requirement 10.2).
 * - The confirmed date in a human-readable format via `formatDateHuman`,
 *   localized to the current mode (Requirement 10.3).
 * - The selected venue (Requirement 10.4).
 * - A "DATE CONFIRMED" badge (Requirement 10.5).
 * - Wrapped in GlassCard over the shared StarfieldCanvas, matching the
 *   dark-space glassmorphism aesthetic with rose accents (Requirement 10.6).
 *
 * Sharing (Requirement 9):
 * - Copy Link copies the current URL and shows a "Link copied!" confirmation
 *   for ~2 seconds, with a graceful fallback when the async Clipboard API is
 *   unavailable (Requirements 9.1, 9.2).
 * - A Share button invokes the native share dialog where the Web Share API is
 *   available, and is hidden otherwise (Requirements 9.3, 9.4).
 *
 * The layout is mobile-responsive with min 44px touch targets (Requirement
 * 11.3).
 */
export default function DatePass({ from, to, date, venue, spot, mode }: DatePassProps) {
  const t = translations[chromeLang(mode)];
  const humanDate = formatDateHuman(
    date,
    chromeLang(mode) === "zh" ? "zh-CN" : "en-GB"
  );

  const [copied, setCopied] = useState(false);
  // Resolve Web Share support once on mount (Requirements 9.3, 9.4).
  const [canShare] = useState<boolean>(() => isWebShareSupported());

  const copiedTimeoutRef = useRef<number | null>(null);

  // Clean up the pending "copied" reset timer on unmount to avoid setting state
  // after the component has been removed.
  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current !== null) {
        window.clearTimeout(copiedTimeoutRef.current);
        copiedTimeoutRef.current = null;
      }
    };
  }, []);

  const showCopiedFeedback = useCallback(() => {
    setCopied(true);
    if (copiedTimeoutRef.current !== null) {
      window.clearTimeout(copiedTimeoutRef.current);
    }
    copiedTimeoutRef.current = window.setTimeout(() => {
      setCopied(false);
      copiedTimeoutRef.current = null;
    }, COPIED_FEEDBACK_MS);
  }, []);

  /** The shareable link is simply the current confirmed URL. */
  const shareUrl = useCallback(
    () => (typeof window !== "undefined" ? window.location.href : ""),
    []
  );

  /**
   * Copy the current URL to the clipboard. Prefers the async Clipboard API and
   * gracefully falls back to a legacy selection-based copy so the user can
   * always share the link, even without clipboard permissions (Requirements
   * 9.1, 9.2).
   */
  const handleCopy = useCallback(async () => {
    const url = shareUrl();
    if (!url) return;

    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(url);
        showCopiedFeedback();
        return;
      } catch {
        // Fall through to the legacy fallback below.
      }
    }

    // Fallback: write the URL into a temporary textarea and attempt execCommand.
    try {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand?.("copy");
      document.body.removeChild(textarea);
      if (ok) showCopiedFeedback();
    } catch {
      // No error surfaced to the user; Copy simply has no effect if blocked.
    }
  }, [shareUrl, showCopiedFeedback]);

  /**
   * Invoke the native share sheet with the confirmed link (Requirement 9.3).
   * Only rendered when the Web Share API is available.
   */
  const handleShare = useCallback(async () => {
    const url = shareUrl();
    if (!url || !navigator.share) return;
    try {
      await navigator.share({
        title: t.datePassTitle,
        text: `${from} ❤️ ${to}`,
        url,
      });
    } catch {
      // User cancelled or share failed — silently ignore (no error UI).
    }
  }, [shareUrl, t.datePassTitle, from, to]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Shared dark-space starfield background, brightened to feel celebratory
          (Requirement 10.6). */}
      <StarfieldCanvas brightened={true} />

      <div className="relative z-20 flex min-h-screen flex-col items-center justify-center px-4 py-16">
        <GlassCard className="text-center" >
          <div data-testid="date-pass">
            {/* "DATE CONFIRMED" badge (Requirement 10.5). */}
            <span
              data-testid="date-pass-badge"
              className="inline-block rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 mb-6"
            >
              {t.dateConfirmedBadge}
            </span>

            {/* Ticket title (Requirement 10.6). */}
            <h1 className="text-sm font-semibold uppercase tracking-widest text-white/50 mb-3">
              {t.datePassTitle}
            </h1>

            {/* Both names with a heart separator (Requirement 10.2). */}
            <p
              data-testid="date-pass-names"
              className="text-2xl md:text-3xl font-bold text-white mb-8"
            >
              {from} <span className="text-rose-400">❤️</span> {to}
            </p>

            {/* Perforated divider evoking a real ticket stub. */}
            <div className="relative my-6" aria-hidden="true">
              <div className="border-t border-dashed border-white/20" />
              <span className="absolute -left-6 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-slate-950/60" />
              <span className="absolute -right-6 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-slate-950/60" />
            </div>

            {/* Date + venue details (Requirements 10.3, 10.4). */}
            <dl className="flex flex-col gap-4 text-left">
              <div className="flex flex-col gap-1">
                <dt className="text-xs font-semibold uppercase tracking-wider text-rose-300/80">
                  {t.confirmDate}
                </dt>
                <dd
                  data-testid="date-pass-date"
                  className="text-lg font-semibold text-white"
                >
                  {humanDate}
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-xs font-semibold uppercase tracking-wider text-rose-300/80">
                  {t.confirmVenue}
                </dt>
                <dd
                  data-testid="date-pass-venue"
                  className="text-lg font-semibold text-white"
                >
                  {venue}
                </dd>
              </div>
              {spot && spot.trim().length > 0 && (
                <div className="flex flex-col gap-1">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-rose-300/80">
                    {t.meetingPointLabel}
                  </dt>
                  <dd
                    data-testid="date-pass-spot"
                    className="text-lg font-semibold text-white"
                  >
                    {spot}
                  </dd>
                </div>
              )}
            </dl>

            {/* Sharing actions (Requirement 9). Stacks on mobile, side-by-side
                on larger screens. */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleCopy}
                aria-live="polite"
                data-testid="date-pass-copy-button"
                className={`w-full rounded-full backdrop-blur-sm font-bold shadow-lg px-6 py-3 min-h-[44px] border border-white/10 transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-rose-400/50 ${
                  copied
                    ? "bg-green-500/80 text-white hover:bg-green-500"
                    : "bg-rose-500/80 text-white hover:bg-rose-500"
                }`}
              >
                {copied ? t.linkCopied : t.copyLink}
              </button>

              {canShare && (
                <button
                  type="button"
                  onClick={handleShare}
                  data-testid="date-pass-share-button"
                  className="w-full rounded-full bg-slate-700/70 backdrop-blur-sm text-white font-bold shadow-lg px-6 py-3 min-h-[44px] border border-white/10 transition-all duration-150 hover:bg-slate-600/80 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-rose-400/50"
                >
                  {t.shareButton}
                </button>
              )}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
