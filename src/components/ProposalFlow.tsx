"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import StarfieldCanvas from "./StarfieldCanvas";
import MeteorShower from "./MeteorShower";
import GlassCard from "./GlassCard";
import NoButton from "./NoButton";
import { substituteName } from "../utils/nameSubstitution";
import { translations, chromeLang, LANGUAGE_OPTIONS, type DisplayMode } from "../i18n";

const SLIDE_COUNT = translations.en.dialogues.length;

/**
 * Intentional surprise-reveal pause after the celebration completes
 * (Requirement 4.2). Chosen inside the 3-to-5-second window and exported as a
 * named constant so tests can advance fake timers deterministically.
 */
export const SURPRISE_REVEAL_PAUSE_MS = 4000;

/**
 * Hard upper bound for the surprise-reveal pause (Requirement 4.5). If the
 * primary pause timer somehow fails to fire, this guard force-completes the
 * pause so the flow always proceeds to date planning.
 */
export const SURPRISE_REVEAL_MAX_MS = 5000;

/**
 * Styled language selector dropdown shown in the top navigation bar.
 * Switching is instant (no reload) — it just changes the display mode.
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

function Disclaimer({
  mode,
  onContinue,
}: {
  mode: DisplayMode;
  onContinue: () => void;
}) {
  const t = translations[chromeLang(mode)];
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 text-center px-6 relative z-20">
      <GlassCard>
        <h1 className="text-4xl font-bold text-white mb-6">{t.disclaimerTitle}</h1>

        <p className="text-lg leading-relaxed max-w-xl text-white/90">
          {t.disclaimerLine1}<br />
          {t.disclaimerLine2}<br />
          {t.disclaimerLine3}
        </p>

        <div className="flex gap-4 mt-6 justify-center">
          <button
            onClick={onContinue}
            className="rounded-full bg-green-500/80 backdrop-blur-sm px-6 py-3 font-bold text-white hover:bg-green-500 transition border border-white/10 min-w-[44px] min-h-[44px]"
          >
            {t.continue}
          </button>

          <button
            onClick={() => window.close()}
            className="rounded-full bg-slate-700/60 backdrop-blur-sm px-6 py-3 font-bold text-white hover:bg-slate-600/70 transition border border-white/10 min-w-[44px] min-h-[44px]"
          >
            {t.leave}
          </button>
        </div>
      </GlassCard>
    </div>
  );
}

export interface ProposalFlowProps {
  /** Sender's name (reserved for future personalization / routing). */
  from: string;
  /** Recipient's name, substituted into dialogue placeholders (Requirement 3.1). */
  to: string;
  /** Current display/language mode (controlled by the parent). */
  mode: DisplayMode;
  /** Called when the language selector changes the display mode. */
  onModeChange: (mode: DisplayMode) => void;
  /**
   * Fired once the celebration completes (and, in a later task, after an
   * intentional surprise-reveal pause). Optional so the existing single-user
   * flow can render ProposalFlow without a date-planning consumer.
   */
  onDatePlanningReady?: () => void;
}

/**
 * ProposalFlow — the existing confession experience extracted from App.tsx.
 *
 * Contains the disclaimer → carousel → Yes/No → celebration → response flow,
 * including the StarfieldCanvas brightening and MeteorShower celebration.
 * The sender's name (`from`) is substituted into dialogue placeholders so the
 * proposal reads personally (Requirement 3.1). All original behavior is
 * preserved (Requirement 14).
 */
export default function ProposalFlow({
  from: _from,
  to,
  mode,
  onModeChange,
  onDatePlanningReady,
}: ProposalFlowProps) {
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [finalResponse, setFinalResponse] = useState<'none' | 'yes' | 'no'>('none');

  // Animation states
  const [brightened, setBrightened] = useState(false);
  const [meteorActive, setMeteorActive] = useState(false);

  // Timeout guard refs
  const brightenTimeoutRef = useRef<number | null>(null);
  const meteorTimeoutRef = useRef<number | null>(null);
  const meteorDelayRef = useRef<number | null>(null);

  // Surprise-reveal pause refs (Requirement 4.2, 4.5). `pauseTimeoutRef` holds
  // the intentional 3-to-5s pause; `pauseGuardRef` is the hard 5s force-complete
  // guard. `datePlanningFiredRef` ensures onDatePlanningReady runs exactly once
  // regardless of which timer wins the race.
  const pauseTimeoutRef = useRef<number | null>(null);
  const pauseGuardRef = useRef<number | null>(null);
  const datePlanningFiredRef = useRef(false);

  // Keep a stable reference to the date-planning callback so the celebration
  // completion path can invoke it without re-running effects on every render.
  const onDatePlanningReadyRef = useRef(onDatePlanningReady);
  useEffect(() => {
    onDatePlanningReadyRef.current = onDatePlanningReady;
  }, [onDatePlanningReady]);

  // Detect mobile on mount (viewport < 768px OR touch device) - Req 8.1
  useEffect(() => {
    const isTouchDevice = () => {
      return (
        (typeof window !== "undefined" &&
          ("ontouchstart" in window ||
            (window.navigator as any).maxTouchPoints > 0)) ||
        false
      );
    };

    const checkMobile = () => {
      setIsMobile(isTouchDevice() || window.innerWidth < 768);
    };

    checkMobile(); // Check on mount
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Sky brightening timeout guard: force-complete after 5s (Req 10.5)
  useEffect(() => {
    if (brightened) {
      brightenTimeoutRef.current = window.setTimeout(() => {
        // Force-complete: brightening is CSS-based so just clear the timeout
        brightenTimeoutRef.current = null;
      }, 5000);
    }
    return () => {
      if (brightenTimeoutRef.current !== null) {
        window.clearTimeout(brightenTimeoutRef.current);
        brightenTimeoutRef.current = null;
      }
    };
  }, [brightened]);

  // Meteor shower timeout guard: force-complete after 5s (Req 10.5)
  useEffect(() => {
    if (meteorActive) {
      meteorTimeoutRef.current = window.setTimeout(() => {
        // Force-complete meteor shower if it hasn't finished
        setMeteorActive(false);
        meteorTimeoutRef.current = null;
      }, 5000);
    }
    return () => {
      if (meteorTimeoutRef.current !== null) {
        window.clearTimeout(meteorTimeoutRef.current);
        meteorTimeoutRef.current = null;
      }
    };
  }, [meteorActive]);

  // Cleanup meteor delay + surprise-reveal pause timers on unmount to avoid
  // leaks and act() warnings.
  useEffect(() => {
    return () => {
      if (meteorDelayRef.current !== null) {
        window.clearTimeout(meteorDelayRef.current);
        meteorDelayRef.current = null;
      }
      if (pauseTimeoutRef.current !== null) {
        window.clearTimeout(pauseTimeoutRef.current);
        pauseTimeoutRef.current = null;
      }
      if (pauseGuardRef.current !== null) {
        window.clearTimeout(pauseGuardRef.current);
        pauseGuardRef.current = null;
      }
    };
  }, []);

  // Fire the date-planning transition exactly once, tearing down both pause
  // timers so neither the primary pause nor the guard can re-invoke it.
  const fireDatePlanningReady = useCallback(() => {
    if (datePlanningFiredRef.current) return;
    datePlanningFiredRef.current = true;
    if (pauseTimeoutRef.current !== null) {
      window.clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = null;
    }
    if (pauseGuardRef.current !== null) {
      window.clearTimeout(pauseGuardRef.current);
      pauseGuardRef.current = null;
    }
    onDatePlanningReadyRef.current?.();
  }, []);

  const handleMeteorComplete = useCallback(() => {
    setMeteorActive(false);
    if (meteorTimeoutRef.current !== null) {
      window.clearTimeout(meteorTimeoutRef.current);
      meteorTimeoutRef.current = null;
    }
    // Celebration is over. Begin the intentional surprise-reveal pause
    // (Requirement 4.2): the recipient sees only the happy message + GIF during
    // this window (Requirement 4.3), then the date-planning step is revealed
    // (Requirement 4.4). A separate 5s guard force-completes the pause if the
    // primary timer never fires (Requirement 4.5).
    pauseTimeoutRef.current = window.setTimeout(() => {
      pauseTimeoutRef.current = null;
      fireDatePlanningReady();
    }, SURPRISE_REVEAL_PAUSE_MS);
    pauseGuardRef.current = window.setTimeout(() => {
      pauseGuardRef.current = null;
      fireDatePlanningReady();
    }, SURPRISE_REVEAL_MAX_MS);
  }, [fireDatePlanningReady]);

  const handleNext = () => {
    if (currentSlide < SLIDE_COUNT - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handleYes = () => {
    setFinalResponse('yes');
    setBrightened(true);
    // Trigger meteor shower after 800ms delay (Req 3.1)
    meteorDelayRef.current = window.setTimeout(() => {
      setMeteorActive(true);
      meteorDelayRef.current = null;
    }, 800);
  };

  const handleNo = () => {
    setFinalResponse('no');
  };

  const lang = chromeLang(mode);
  const t = translations[lang];
  const isFinalSlide = currentSlide === SLIDE_COUNT - 1;

  // Substitute the recipient's name into dialogue placeholders (Requirement 3.1).
  // When no name is provided the template is left untouched, preserving the
  // original literal placeholder rendering for the default single-user flow.
  const withName = (text: string) => (to ? substituteName(text, to) : text);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Layer - always present (z-0) */}
      <StarfieldCanvas brightened={brightened} />

      {/* Meteor Shower Layer (z-10 via component inline style) */}
      <MeteorShower active={meteorActive} onComplete={handleMeteorComplete} />

      {/* Language selector — visible only on the Disclaimer screen */}
      {showDisclaimer && (
        <nav className="fixed top-4 right-4 z-30">
          <LanguageSelect mode={mode} onChange={onModeChange} />
        </nav>
      )}

      {showDisclaimer ? (
        <Disclaimer
          mode={mode}
          onContinue={() => setShowDisclaimer(false)}
        />
      ) : (
        <div className={`relative z-20 -mt-16 flex h-screen flex-col items-center justify-center px-4 ${isMobile ? 'pb-8' : ''}`}>
          {/* Conditional GIF display based on final response */}
          {finalResponse === 'yes' && (
            <img
              className={`mb-4 w-auto rounded-xl ${isMobile ? 'h-[150px]' : 'h-[180px]'}`}
              src="https://media.tenor.com/gUiu1zyxfzYAAAAi/bear-kiss-bear-kisses.gif"
              alt="Bear kiss"
            />
          )}
          {finalResponse === 'no' && (
            <img
              className={`mb-4 w-auto rounded-xl ${isMobile ? 'h-[150px]' : 'h-[180px]'}`}
              src="https://media1.tenor.com/m/Vkui9SCHCFAAAAAd/meme-emotional.gif"
              alt="Emotional"
            />
          )}
          {finalResponse === 'none' && (
            <img
              className={`mb-4 w-auto rounded-xl ${isMobile ? 'h-[150px]' : 'h-[180px]'}`}
              src="https://gifdb.com/images/high/cute-love-bear-roses-ou7zho5oosxnpo6k.gif"
              alt="Bear with roses"
            />
          )}

          {/* Carousel Content - Only show if no final response */}
          {finalResponse === 'none' && (
            <div className="w-full max-w-2xl px-4">
              {/* Message Box wrapped in GlassCard.
                  'en-zh' mode shows English + Chinese stacked; any single
                  language shows only that language. */}
              <GlassCard className="mb-8 text-center">
                <p className={`leading-relaxed font-medium text-white ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                  {mode === 'en-zh' ? (
                    <>
                      {withName(translations.en.dialogues[currentSlide])}
                      <br />
                      <span className={`text-white/60 ${isMobile ? 'text-sm' : 'text-lg'}`}>
                        {withName(translations.zh.dialogues[currentSlide])}
                      </span>
                    </>
                  ) : (
                    withName(t.dialogues[currentSlide])
                  )}
                </p>

                {/* Progress indicator */}
                <div className="flex justify-center gap-2 mt-8">
                  {t.dialogues.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? 'bg-rose-400 w-8'
                          : index < currentSlide
                          ? 'bg-rose-400/50 w-2'
                          : 'bg-white/20 w-2'
                      }`}
                    />
                  ))}
                </div>
              </GlassCard>

              {/* Next Button or Final Response Buttons */}
              <div className="flex justify-center">
                {!isFinalSlide ? (
                  <button
                    onClick={handleNext}
                    className={`rounded-full bg-rose-500/80 backdrop-blur-sm text-white font-bold shadow-lg hover:bg-rose-500 hover:scale-[1.05] active:scale-[0.98] transition-all duration-150 border border-white/10 min-w-[44px] min-h-[44px] ${
                      isMobile ? 'px-12 py-4 text-lg' : 'px-16 py-5 text-xl'
                    }`}
                  >
                    {t.next}
                  </button>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <p className={`font-bold text-white/80 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                      💕
                    </p>
                    <div className="flex gap-4 items-center">
                      {/* Yes button - large pill matching V1 sizing */}
                      <button
                        onClick={handleYes}
                        className={`rounded-full bg-rose-500/80 backdrop-blur-sm text-white font-bold shadow-lg hover:bg-rose-500 hover:scale-[1.05] active:scale-[0.98] transition-all duration-150 border border-white/10 ${
                          isMobile ? 'px-8 py-4 min-h-[60px] min-w-[160px]' : 'px-16 py-5 min-h-[70px] min-w-[220px]'
                        }`}
                      >
                        {t.accept}
                      </button>
                      {/* No button - localized progressive dodge button */}
                      <NoButton onReject={handleNo} labels={t.noStages} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Response screen wrapped in GlassCard when showing response */}
          {finalResponse !== 'none' && (
            <GlassCard className="text-center">
              <p className={`font-bold text-white ${isMobile ? 'text-xl' : 'text-2xl'}`}>
                {finalResponse === 'yes' ? t.happy : t.sad}
              </p>
            </GlassCard>
          )}
        </div>
      )}
    </div>
  );
}
