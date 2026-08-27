import React, { useLayoutEffect, useState } from 'react';

interface FingerGuideProps {
  visible: boolean;
  targetRef: React.RefObject<HTMLElement>;
}

interface Position {
  top: number;
  left: number;
}

/**
 * FingerGuide — animated pointing indicator that draws the Recipient's
 * attention toward the Calendar_Component during the surprise reveal.
 *
 * Renders a pointing-up emoji (☝️) positioned just below the target element
 * (the calendar), so it points up at the grid without overlapping any date
 * cells or touch targets. Uses a subtle bounce + opacity pulse via the
 * `animate-fingerBounce` Tailwind utility. The element is `pointer-events-none`
 * so it never blocks interaction with the calendar controls.
 *
 * When `visible` is false the component renders nothing.
 *
 * Validates: Requirements 5.1, 5.2, 5.3, 5.4
 */
const FingerGuide: React.FC<FingerGuideProps> = ({ visible, targetRef }) => {
  const [pos, setPos] = useState<Position | null>(null);

  // Measure the target (calendar) and position the guide just below it,
  // pointing upward. Re-measure on resize/scroll so it stays anchored (Req 5.1).
  useLayoutEffect(() => {
    if (!visible) return;

    const measure = () => {
      const el = targetRef.current;
      if (!el) {
        setPos(null);
        return;
      }
      const rect = el.getBoundingClientRect();
      // 8px gap below the calendar so it never overlaps cells (Req 5.2, 5.4).
      setPos({ top: rect.bottom + 8, left: rect.left + rect.width / 2 });
    };

    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
  }, [visible, targetRef]);

  // Render nothing when not visible (Req 5.3).
  if (!visible) return null;

  // Fallback: target not yet measured — render centered below in normal flow.
  if (!pos) {
    return (
      <div
        className="flex justify-center mt-2 pointer-events-none select-none"
        aria-hidden="true"
      >
        <span className="text-3xl md:text-4xl animate-fingerBounce" role="img">
          ☝️
        </span>
      </div>
    );
  }

  return (
    <div
      className="fixed z-20 pointer-events-none select-none -translate-x-1/2"
      style={{ top: pos.top, left: pos.left }}
      aria-hidden="true"
    >
      <span className="text-3xl md:text-4xl animate-fingerBounce" role="img">
        ☝️
      </span>
    </div>
  );
};

export default FingerGuide;
