"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import StarfieldCanvas from "./StarfieldCanvas";
import GlassCard from "./GlassCard";
import { translations, chromeLang, LANGUAGE_OPTIONS, type DisplayMode } from "../i18n";
import { buildProposalUrl, validateName } from "../utils/urlParams";

export interface CreationScreenProps {
  /** Current display/language mode (controlled by AppRouter). */
  mode: DisplayMode;
  /**
   * Called when the language selector changes the display mode.
   *
   * The design's minimal signature lists only `mode`, but the language selector
   * must keep working on the Creation screen too (Requirements 12.3, 14.3), so
   * the parent-owned mode setter is threaded through here as well.
   */
  onModeChange: (mode: DisplayMode) => void;
}

/**
 * Styled language selector dropdown shown in the top navigation bar.
 * Mirrors the selector used in ProposalFlow so switching stays consistent and
 * instant across all routed views (Requirement 12.3).
 */
function LanguageSelect({
  mode,
  onChange,
}: {
  mode: DisplayMode;
  onChange: (mode: DisplayMode) => void;
}) {
  return (
    <select
      value={mode}
      onChange={(e) => onChange(e.target.value as DisplayMode)}
      aria-label="Select language"
      className="rounded-full bg-slate-800/80 backdrop-blur-sm border border-white/15 text-white text-sm font-semibold px-4 py-2 shadow-lg cursor-pointer hover:bg-slate-700/80 focus:outline-none focus:ring-2 focus:ring-rose-400/50 min-h-[44px]"
    >
      {LANGUAGE_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-slate-800 text-white">
          {opt.label}
        </option>
      ))}
    </select>
  );
}

/** How long the "Link copied!" confirmation stays visible (Requirement 1.4). */
const COPIED_FEEDBACK_MS = 2000;

/**
 * CreationScreen — the initial screen shown when no usable URL parameters are
 * present. Lets the Sender enter their name and the Recipient's name to
 * generate a personalized, shareable proposal link.
 *
 * Behavior:
 * - Two controlled inputs (sender / recipient name) with min 44px touch targets
 *   for mobile (Requirements 1.1, 11.4).
 * - The Generate Link button is disabled until BOTH names are valid — i.e. they
 *   contain at least one non-whitespace character per `validateName`
 *   (Requirements 1.2, 1.3).
 * - On submit it constructs the URL via `buildProposalUrl(from, to)` and shows
 *   the result in a read-only field (Requirement 1.2).
 * - A Copy Link button copies the generated URL and shows a "Link copied!"
 *   confirmation for ~2 seconds, with a graceful fallback when the async
 *   Clipboard API is unavailable (Requirement 1.4).
 * - Wrapped in GlassCard over the shared StarfieldCanvas background to match the
 *   dark-space glassmorphism aesthetic (Requirement 14.2).
 */
export default function CreationScreen({ mode, onModeChange }: CreationScreenProps) {
  const t = translations[chromeLang(mode)];

  const [senderName, setSenderName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [gender, setGender] = useState<'man' | 'woman'>('man');
  // Sender-only prank toggle. When on, the generated link carries `mode=evil`
  // so the recipient's final "No" secretly leads to the happy ending. This flag
  // never appears in the recipient experience.
  const [evilMode, setEvilMode] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const linkInputRef = useRef<HTMLInputElement | null>(null);
  const copiedTimeoutRef = useRef<number | null>(null);

  // Both names must contain at least one non-whitespace character before the
  // proposal link can be generated (Requirements 1.2, 1.3).
  const canSubmit = useMemo(
    () => validateName(senderName) && validateName(recipientName),
    [senderName, recipientName]
  );

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

  const handleGenerate = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!canSubmit) return;
      // Trim so leading/trailing whitespace doesn't leak into the shared link,
      // while the validity check above still guarantees non-empty names.
      setGeneratedLink(
        buildProposalUrl(senderName.trim(), recipientName.trim(), gender, evilMode)
      );
      setCopied(false);
    },
    [canSubmit, senderName, recipientName, gender, evilMode]
  );

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

  /**
   * Copy the generated link to the clipboard. Prefers the async Clipboard API
   * and gracefully falls back to selecting the read-only field (and the legacy
   * execCommand copy) when it is unavailable or blocked — so the user can always
   * copy the link, even without clipboard permissions (Requirement 1.4).
   */
  const handleCopy = useCallback(async () => {
    if (!generatedLink) return;

    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(generatedLink);
        showCopiedFeedback();
        return;
      } catch {
        // Fall through to the manual-selection fallback below.
      }
    }

    // Fallback: select the link text and attempt a legacy copy so the value is
    // ready on the clipboard (or at least highlighted for a manual copy).
    const input = linkInputRef.current;
    if (input) {
      input.focus();
      input.select();
      input.setSelectionRange(0, generatedLink.length);
      try {
        const ok = document.execCommand?.("copy");
        if (ok) {
          showCopiedFeedback();
        }
      } catch {
        // Leave the text selected for a manual copy; no error surfaced to user.
      }
    }
  }, [generatedLink, showCopiedFeedback]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Shared dark-space starfield background (Requirement 14.2). */}
      <StarfieldCanvas brightened={false} />

      <nav className="fixed top-4 right-4 z-30">
        <LanguageSelect mode={mode} onChange={onModeChange} />
      </nav>

      {/* Scroll container: centers the card when it fits the viewport and
          becomes scrollable (without clipping the top) when the content is
          taller than the screen — e.g. once the generated link appears, or on
          short/zoomed windows. Body-level overflow is hidden globally, so this
          view manages its own vertical scroll instead of relying on the page. */}
      <div className="relative z-20 h-screen overflow-y-auto overscroll-contain">
        <div className="flex min-h-full flex-col items-center justify-center px-4 py-8">
          <GlassCard>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 text-center">
            {t.creationTitle}
          </h1>

          <form onSubmit={handleGenerate} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="sender-name" className="text-sm font-semibold text-white/80">
                {t.senderNameLabel}
              </label>
              <input
                id="sender-name"
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                autoComplete="off"
                className="w-full rounded-xl bg-slate-800/60 backdrop-blur-sm border border-white/15 text-white placeholder-white/30 px-4 py-3 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-rose-400/50 focus:border-rose-400/50 transition"
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-white/80">{t.genderLabel}</span>
              <div
                role="radiogroup"
                aria-label={t.genderLabel}
                className="grid grid-cols-2 gap-3"
              >
                {(['man', 'woman'] as const).map((g) => {
                  const active = gender === g;
                  return (
                    <button
                      key={g}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => {
                        setGender(g);
                        // Any previously generated link used the old gender; clear it
                        // so the sender regenerates with the correct wording.
                        setGeneratedLink(null);
                        setCopied(false);
                      }}
                      data-testid={`gender-${g}`}
                      className={`rounded-xl px-4 py-3 min-h-[44px] border font-semibold transition-all duration-150 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-rose-400/50 ${
                        active
                          ? "bg-rose-500/25 border-rose-300 text-white shadow-lg"
                          : "bg-slate-800/50 border-white/10 text-white/80 hover:bg-slate-700/70"
                      }`}
                    >
                      {g === "man" ? t.genderMan : t.genderWoman}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="recipient-name" className="text-sm font-semibold text-white/80">
                {t.recipientNameLabel}
              </label>
              <input
                id="recipient-name"
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                autoComplete="off"
                className="w-full rounded-xl bg-slate-800/60 backdrop-blur-sm border border-white/15 text-white placeholder-white/30 px-4 py-3 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-rose-400/50 focus:border-rose-400/50 transition"
              />
            </div>

            {/* Evil Mode toggle — sender-only prank switch. Never surfaced to the
                recipient; it just decides whether the final "No" leads to the
                happy ending. */}
            <div className="flex flex-col gap-2">
              <button
                type="button"
                role="switch"
                aria-checked={evilMode}
                data-testid="evil-mode-toggle"
                onClick={() => {
                  setEvilMode((prev) => !prev);
                  // Any previously generated link used the old setting; clear it
                  // so the sender regenerates with the correct mode.
                  setGeneratedLink(null);
                  setCopied(false);
                }}
                className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 min-h-[44px] border font-semibold transition-all duration-150 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-rose-400/50 ${
                  evilMode
                    ? "bg-rose-500/25 border-rose-300 text-white shadow-lg"
                    : "bg-slate-800/50 border-white/10 text-white/80 hover:bg-slate-700/70"
                }`}
              >
                <span>{t.evilModeLabel}</span>
                <span
                  aria-hidden="true"
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-150 ${
                    evilMode ? "bg-rose-400" : "bg-slate-600"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-150 ${
                      evilMode ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </span>
              </button>
              <p className="text-xs text-white/50 leading-relaxed">{t.evilModeHint}</p>
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="mt-1 w-full rounded-full bg-rose-500/80 backdrop-blur-sm text-white font-bold shadow-lg px-6 py-3 min-h-[44px] border border-white/10 transition-all duration-150 hover:bg-rose-500 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-rose-400/50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-rose-500/80"
            >
              {t.generateLink}
            </button>
          </form>

          {generatedLink && (
            <div className="mt-4 flex flex-col gap-3">
              <input
                ref={linkInputRef}
                type="text"
                value={generatedLink}
                readOnly
                aria-label={t.copyLink}
                onFocus={(e) => e.currentTarget.select()}
                className="w-full rounded-xl bg-slate-950/60 border border-white/15 text-white/90 text-sm px-4 py-3 min-h-[44px] select-all focus:outline-none focus:ring-2 focus:ring-rose-400/50"
              />

              <button
                type="button"
                onClick={handleCopy}
                aria-live="polite"
                className={`w-full rounded-full backdrop-blur-sm font-bold shadow-lg px-6 py-3 min-h-[44px] border border-white/10 transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-rose-400/50 ${
                  copied
                    ? "bg-green-500/80 text-white hover:bg-green-500"
                    : "bg-slate-700/70 text-white hover:bg-slate-600/80"
                }`}
              >
                {copied ? t.linkCopied : t.copyLink}
              </button>
            </div>
          )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
