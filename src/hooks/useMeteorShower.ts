import { useState, useCallback, useRef, useEffect } from 'react';

export interface Meteor {
  id: number;
  delay: number;       // Staggered start (100-400ms apart)
  duration: number;    // Travel time (1000-1500ms)
  startX: number;      // Starting vw position (-10 to 20)
  startY: number;      // Starting vh position (-10 to 10)
  length: number;      // Trail length in px (80-150)
  hue: number;         // Color hue (240-320, blue to pink range)
}

/**
 * Generates an array of Meteor objects with staggered delays and randomized properties.
 * Exported separately for testability.
 */
export function generateMeteors(count: number): Meteor[] {
  const meteors: Meteor[] = [];
  for (let i = 0; i < count; i++) {
    meteors.push({
      id: i,
      delay: i * (100 + Math.random() * 300),   // Staggered 100-400ms apart
      duration: 1000 + Math.random() * 500,      // 1000-1500ms travel time
      startX: 30 + Math.random() * 70,           // Start at 30vw to 100vw (right side, spread across)
      startY: -15 + Math.random() * 25,          // Start at -15vh to 10vh (top area)
      length: 80 + Math.random() * 70,           // Trail 80-150px
      hue: 240 + Math.random() * 80,             // Blue (240) to pink (320)
    });
  }
  return meteors;
}

/**
 * Hook that manages a meteor shower animation.
 * - triggerShower() spawns 5-6 meteors and sets isActive to true
 * - Idempotent: calling triggerShower() while active is a no-op
 * - Auto-cleanup: after the last meteor animation completes (≤3000ms), clears meteors and sets isActive to false
 * - Cancels all pending timeouts on unmount
 */
export function useMeteorShower(): {
  meteors: Meteor[];
  triggerShower: () => void;
  isActive: boolean;
  cancelShower: () => void;
} {
  const [meteors, setMeteors] = useState<Meteor[]>([]);
  const [isActive, setIsActive] = useState(false);
  const timeoutsRef = useRef<number[]>([]);
  const isActiveRef = useRef(false);

  // Keep the ref in sync with state for use in the callback
  const syncIsActive = (value: boolean) => {
    isActiveRef.current = value;
    setIsActive(value);
  };

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((id) => window.clearTimeout(id));
    timeoutsRef.current = [];
  }, []);

  const triggerShower = useCallback(() => {
    // Idempotent: no-op if already active
    if (isActiveRef.current) return;

    const count = 5 + Math.round(Math.random()); // 5 or 6 meteors
    const newMeteors = generateMeteors(count);

    setMeteors(newMeteors);
    syncIsActive(true);

    // Calculate when the last meteor finishes:
    // last meteor's delay + its duration, capped at 3000ms
    const maxCompletionTime = Math.min(
      Math.max(...newMeteors.map((m) => m.delay + m.duration)),
      3000
    );

    // Schedule cleanup after all meteors have finished animating
    const cleanupTimeout = window.setTimeout(() => {
      setMeteors([]);
      syncIsActive(false);
    }, maxCompletionTime);

    timeoutsRef.current.push(cleanupTimeout);
  }, []);

  // Cancel an in-progress shower immediately: clear pending timeouts, remove all
  // meteor DOM elements (by clearing state), and reset to inactive (Req 10.2, 10.3).
  const cancelShower = useCallback(() => {
    clearAllTimeouts();
    setMeteors([]);
    syncIsActive(false);
  }, [clearAllTimeouts]);

  // Cleanup all timeouts on unmount
  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);

  return { meteors, triggerShower, isActive, cancelShower };
}
