import { useState, useEffect, useRef } from 'react';
import { useDodge } from '../hooks/useDodge';

/**
 * Dodge stage configuration defining progressive NoButton behavior.
 * Stage labels are supplied by the caller (via the `labels` prop) so the text
 * can be localized; the dodge mechanics per stage are fixed here.
 * - Stage 0: no dodge
 * - Stage 1: no dodge
 * - Stage 2: dodge mode, 4 required dodges at 1.0x speed
 * - Stage 3: faster dodge mode, 4 required dodges at 1.3x speed
 */
const DODGE_STAGES = {
  stages: [
    { dodgeEnabled: false, requiredDodges: 0, speedMultiplier: 1.0 },
    { dodgeEnabled: false, requiredDodges: 0, speedMultiplier: 1.0 },
    { dodgeEnabled: true, requiredDodges: 4, speedMultiplier: 1.0 },
    { dodgeEnabled: true, requiredDodges: 4, speedMultiplier: 1.3 },
  ],
} as const;

interface NoButtonProps {
  onReject: () => void;
  /** Localized text for each of the 4 stages, in order. */
  labels: readonly [string, string, string, string];
}

/**
 * NoButton component with progressive dodge mechanics.
 *
 * Implements a 4-stage button that progressively resists being clicked:
 * - First click: advances from "No" to "Are you sure?"
 * - Second click: enters dodge mode requiring 4 dodges before clickable
 * - Third click: enters faster dodge mode requiring 4 dodges
 * - Final click: triggers rejection callback
 *
 * Uses CSS transform: translate() for position (GPU-friendly).
 * When entering dodge mode, immediately teleports away from cursor (V1 behavior).
 */
export default function NoButton({ onReject, labels }: NoButtonProps) {
  const [stage, setStage] = useState(0);
  const config = DODGE_STAGES.stages[stage];
  const stageText = labels[stage];
  const lastClickPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const { buttonRef, offset, isClickable, forceCheck } = useDodge({
    enabled: config.dodgeEnabled,
    requiredDodges: config.requiredDodges,
    speedMultiplier: config.speedMultiplier,
    // Reset dodge progress per stage, even when two stages need the same count.
    stageKey: stage,
    onDodgeComplete: () => {
      // Button becomes clickable — no additional action needed
    },
  });

  // When entering or advancing within a dodge stage, immediately force the button
  // away from the last click position. This prevents the user from clicking again
  // before the first mouse move triggers a dodge.
  const prevStage = useRef(stage);
  useEffect(() => {
    if (config.dodgeEnabled && stage !== prevStage.current) {
      // Stage changed while in (or entering) dodge mode — immediately teleport away
      const timer = setTimeout(() => {
        forceCheck(lastClickPos.current.x, lastClickPos.current.y);
      }, 10);
      prevStage.current = stage;
      return () => clearTimeout(timer);
    }
    prevStage.current = stage;
  }, [stage, config.dodgeEnabled, forceCheck]);

  const handleClick = (e: React.MouseEvent) => {
    // Track where the click happened so we can dodge away from it
    lastClickPos.current = { x: e.clientX, y: e.clientY };

    if (!isClickable) return;

    if (stage < DODGE_STAGES.stages.length - 1) {
      // Advance to next stage (monotonically increasing)
      setStage(stage + 1);
    } else {
      // Final stage click after required dodges — trigger rejection
      onReject();
    }
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        position: config.dodgeEnabled ? 'fixed' : 'relative',
        left: config.dodgeEnabled ? 'auto' : undefined,
        top: config.dodgeEnabled ? 'auto' : undefined,
      }}
      className={[
        // Rounded pill shape with glass-like dark styling - V1 large sizing
        'rounded-full',
        'bg-slate-700/60 backdrop-blur-sm',
        'border border-white/10',
        'text-white font-bold shadow-lg',
        // V1 button sizing: large pill matching Yes button
        'px-16 py-5 min-h-[70px] min-w-[220px]',
        'md:px-16 md:py-5 md:min-h-[70px] md:min-w-[220px]',
        'max-md:px-8 max-md:py-4 max-md:min-h-[60px] max-md:min-w-[160px]',
        // Instant dodge transition — respond under 1ms
        'transition-transform duration-[0ms]',
        // Visual feedback for clickable state
        isClickable
          ? 'cursor-pointer hover:bg-slate-600/70 hover:scale-[1.05] active:scale-[0.98]'
          : 'cursor-default opacity-90',
        // Z-index to stay above other elements when dodging
        config.dodgeEnabled ? 'z-50' : '',
        // Whitespace
        'whitespace-nowrap',
      ].filter(Boolean).join(' ')}
      aria-label={stageText}
    >
      {stageText}
    </button>
  );
}
