import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Calculate the new dodge position for the button using random teleport (V1 style).
 * Picks a random position on screen that is far enough from the cursor.
 * Exported separately for property-based testing.
 *
 * @param buttonRect - The button's DOMRect (without offset applied)
 * @param cursorPos - Current cursor/touch position
 * @param currentOffset - Current transform offset applied to the button
 * @param speed - Speed multiplier (unused in random teleport, kept for API compat)
 * @param viewportWidth - Current viewport width
 * @param viewportHeight - Current viewport height
 * @returns New offset { x, y } clamped to viewport bounds
 */
export function calculateDodgePosition(
  buttonRect: DOMRect,
  cursorPos: { x: number; y: number },
  currentOffset: { x: number; y: number },
  speed: number,
  viewportWidth: number,
  viewportHeight: number
): { x: number; y: number } {
  const padding = 20;
  const btnWidth = buttonRect.width;
  const btnHeight = buttonRect.height;

  // Available space for button placement
  const maxX = viewportWidth - btnWidth - padding;
  const maxY = viewportHeight - btnHeight - padding;

  if (maxX <= padding || maxY <= padding) return currentOffset;

  // Minimum distance from cursor for the new position
  const minDistFromCursor = 150 * speed;

  // Try to find a random position far from cursor (up to 20 attempts)
  let bestX = currentOffset.x;
  let bestY = currentOffset.y;
  let bestDist = 0;

  for (let attempt = 0; attempt < 20; attempt++) {
    // Random absolute position for the button
    const absX = padding + Math.random() * (maxX - padding);
    const absY = padding + Math.random() * (maxY - padding);

    // Calculate offset needed to place button at this absolute position
    const offsetX = absX - buttonRect.left;
    const offsetY = absY - buttonRect.top;

    // Check distance from cursor to this new button center
    const newCenterX = absX + btnWidth / 2;
    const newCenterY = absY + btnHeight / 2;
    const dist = Math.sqrt(
      (newCenterX - cursorPos.x) ** 2 + (newCenterY - cursorPos.y) ** 2
    );

    if (dist > minDistFromCursor) {
      return { x: offsetX, y: offsetY };
    }

    // Track the best (farthest) attempt in case none exceed threshold
    if (dist > bestDist) {
      bestDist = dist;
      bestX = offsetX;
      bestY = offsetY;
    }
  }

  // Return the best attempt found
  return { x: bestX, y: bestY };
}

/** Proximity threshold in pixels — dodge triggers when cursor is within this distance */
const PROXIMITY_THRESHOLD = 250;

interface UseDodgeConfig {
  enabled: boolean;
  requiredDodges: number;
  speedMultiplier: number;
  onDodgeComplete: () => void;
  /**
   * Identifier for the current dodge stage. When it changes, dodge progress is
   * reset. Keying on this (rather than requiredDodges) means two consecutive
   * stages that require the SAME number of dodges still reset correctly.
   */
  stageKey?: number | string;
}

interface UseDodgeReturn {
  buttonRef: React.RefObject<HTMLButtonElement>;
  offset: { x: number; y: number };
  dodgeCount: number;
  isClickable: boolean;
  forceCheck: (cursorX: number, cursorY: number) => void;
}

export function useDodge(config: UseDodgeConfig): UseDodgeReturn {
  const { enabled, requiredDodges, speedMultiplier, onDodgeComplete, stageKey } = config;

  const buttonRef = useRef<HTMLButtonElement>(null!);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dodgeCount, setDodgeCount] = useState(0);

  // Track whether dodging is complete
  const isClickable = !enabled || dodgeCount >= requiredDodges;

  // Use refs for values that event handlers need but shouldn't trigger re-subscription
  const offsetRef = useRef(offset);
  const dodgeCountRef = useRef(dodgeCount);
  const isClickableRef = useRef(isClickable);
  const onDodgeCompleteRef = useRef(onDodgeComplete);
  const touchActiveRef = useRef(false);

  // Keep refs in sync
  useEffect(() => {
    offsetRef.current = offset;
  }, [offset]);

  useEffect(() => {
    dodgeCountRef.current = dodgeCount;
  }, [dodgeCount]);

  useEffect(() => {
    isClickableRef.current = isClickable;
  }, [isClickable]);

  useEffect(() => {
    onDodgeCompleteRef.current = onDodgeComplete;
  }, [onDodgeComplete]);

  // Reset state when enabled changes
  useEffect(() => {
    if (!enabled) {
      setOffset({ x: 0, y: 0 });
      setDodgeCount(0);
    }
  }, [enabled]);

  // Reset dodgeCount when entering a new dodge stage. Keyed on `stageKey` (the
  // caller's stage id) so consecutive stages requiring the SAME number of
  // dodges still reset. Falls back to requiredDodges when no stageKey is given.
  const resetToken = stageKey ?? requiredDodges;
  const prevResetToken = useRef(resetToken);
  useEffect(() => {
    if (enabled && resetToken !== prevResetToken.current) {
      setDodgeCount(0);
    }
    prevResetToken.current = resetToken;
  }, [enabled, resetToken]);

  // Core dodge handler
  const handleCursorMove = useCallback(
    (cursorX: number, cursorY: number) => {
      if (!enabled || isClickableRef.current) return;

      const button = buttonRef.current;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const currentOff = offsetRef.current;

      // Calculate actual button center (rect already includes transform in most browsers,
      // but we use the original rect position + offset for consistency)
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Check proximity threshold
      const distToCursor = Math.sqrt(
        (centerX - cursorX) ** 2 + (centerY - cursorY) ** 2
      );

      if (distToCursor > PROXIMITY_THRESHOLD) return;

      // Calculate new position
      // We need the "original" rect without offset to feed into calculateDodgePosition.
      // Since getBoundingClientRect already includes the CSS transform, we subtract
      // the current offset to get the base rect.
      const baseRect = new DOMRect(
        rect.left - currentOff.x,
        rect.top - currentOff.y,
        rect.width,
        rect.height
      );

      const newOffset = calculateDodgePosition(
        baseRect,
        { x: cursorX, y: cursorY },
        currentOff,
        speedMultiplier,
        window.innerWidth,
        window.innerHeight
      );

      // Only count as a dodge if position actually changed
      if (newOffset.x !== currentOff.x || newOffset.y !== currentOff.y) {
        setOffset(newOffset);
        const newCount = dodgeCountRef.current + 1;
        setDodgeCount(newCount);

        // Check if dodge requirement is met
        if (newCount >= requiredDodges) {
          onDodgeCompleteRef.current();
        }
      }
    },
    [enabled, speedMultiplier, requiredDodges]
  );

  // Set up event listeners
  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      handleCursorMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchActiveRef.current) {
        touchActiveRef.current = true;
      }
      // Use first touch point as cursor position (Req 6.5)
      const touch = e.touches[0];
      if (touch) {
        handleCursorMove(touch.clientX, touch.clientY);
      }
    };

    const handleTouchEnd = () => {
      // Stop tracking until next touch (Req 10.4)
      touchActiveRef.current = false;
    };

    const handleTouchStart = () => {
      touchActiveRef.current = true;
    };

    // Resize handler: recalculate bounds and clamp offset within 100ms (Req 10.1)
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const button = buttonRef.current;
        if (!button) return;

        const rect = button.getBoundingClientRect();
        const currentOff = offsetRef.current;

        // Get base rect (without current offset)
        const baseRect = new DOMRect(
          rect.left - currentOff.x,
          rect.top - currentOff.y,
          rect.width,
          rect.height
        );

        // Clamp current offset to new viewport bounds
        const padding = 20;
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        const maxX = vw - baseRect.right - padding;
        const minX = -baseRect.left + padding;
        const maxY = vh - baseRect.bottom - padding;
        const minY = -baseRect.top + padding;

        const clampedX = Math.max(minX, Math.min(maxX, currentOff.x));
        const clampedY = Math.max(minY, Math.min(maxY, currentOff.y));

        if (clampedX !== currentOff.x || clampedY !== currentOff.y) {
          setOffset({ x: clampedX, y: clampedY });
        }
      }, 100);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('resize', handleResize);
      if (resizeTimeout) clearTimeout(resizeTimeout);
    };
  }, [enabled, handleCursorMove]);

  // Force a dodge check at a given cursor position (used when entering a dodge
  // stage). The entry teleport COUNTS as the stage's first dodge, so a stage
  // configured with requiredDodges: N shows N total moves (1 teleport + N-1
  // cursor-driven dodges).
  const forceCheck = useCallback(
    (cursorX: number, cursorY: number) => {
      if (!enabled) return;

      const button = buttonRef.current;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const currentOff = offsetRef.current;

      const baseRect = new DOMRect(
        rect.left - currentOff.x,
        rect.top - currentOff.y,
        rect.width,
        rect.height
      );

      const newOffset = calculateDodgePosition(
        baseRect,
        { x: cursorX, y: cursorY },
        currentOff,
        speedMultiplier,
        window.innerWidth,
        window.innerHeight
      );

      if (newOffset.x !== currentOff.x || newOffset.y !== currentOff.y) {
        setOffset(newOffset);
        const newCount = dodgeCountRef.current + 1;
        setDodgeCount(newCount);
        if (newCount >= requiredDodges) {
          onDodgeCompleteRef.current();
        }
      }
    },
    [enabled, speedMultiplier, requiredDodges]
  );

  return {
    buttonRef,
    offset,
    dodgeCount,
    isClickable,
    forceCheck,
  };
}
