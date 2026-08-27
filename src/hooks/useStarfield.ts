import { useMemo } from 'react';

export interface Star {
  x: number;           // Position as percentage (0-100)
  y: number;           // Position as percentage (0-100)
  size: number;        // Radius in px (0.5 - 2.5)
  opacity: number;     // Base opacity (0.3 - 1.0)
  twinkleSpeed: number; // Animation duration in seconds (2 - 6)
  twinkleDelay: number; // Animation delay in seconds (0 - 5)
}

/**
 * Generates an array of Star objects with randomized properties.
 * Exported separately for testability.
 */
export function generateStars(count: number): Star[] {
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 0.5 + Math.random() * 2,
      opacity: 0.3 + Math.random() * 0.7,
      twinkleSpeed: 2 + Math.random() * 4,
      twinkleDelay: Math.random() * 5,
    });
  }
  return stars;
}

/**
 * Hook that generates and memoizes a starfield.
 * Stars are generated once on mount and do not re-generate on re-renders.
 */
export function useStarfield(starCount: number = 200): { stars: Star[] } {
  const stars = useMemo(() => generateStars(starCount), []);
  return { stars };
}
