"use client";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

interface FitToScreenProps {
  children: ReactNode;
  /**
   * Lower bound for the auto-scale so content can never shrink to an unreadable
   * size. If the content is so tall that even this scale overflows, it will be
   * clipped rather than scrolled — in practice the calendar comfortably fits
   * above this floor on any normal screen.
   */
  minScale?: number;
  /** Gap (px) to preserve between the scaled content and the viewport edges. */
  padding?: number;
  /** Extra classes for the full-screen centering container. */
  className?: string;
}

/**
 * FitToScreen — centers a single child in the viewport and scales it DOWN (never
 * up) so the whole thing fits without scrolling. This gives a "zoom to fit"
 * effect instead of a scrollbar: the content stays centered and fully visible on
 * short or zoomed-in windows.
 *
 * Implementation notes:
 * - `offsetWidth`/`offsetHeight` report the element's *layout* size, which is
 *   NOT affected by CSS `transform: scale()`. Measuring those avoids a feedback
 *   loop (scaling never changes the measured natural size).
 * - A ResizeObserver recomputes the scale when the content's natural size
 *   changes (e.g. selecting a date adds a line, or the flow advances a step),
 *   and a window `resize` listener handles viewport changes.
 */
export default function FitToScreen({
  children,
  minScale = 0.5,
  padding = 24,
  className = "",
}: FitToScreenProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const recompute = () => {
      // Natural (pre-transform) layout size of the content.
      const naturalW = el.offsetWidth;
      const naturalH = el.offsetHeight;
      if (!naturalW || !naturalH) return;

      const availW = window.innerWidth - padding * 2;
      const availH = window.innerHeight - padding * 2;

      const next = Math.min(1, availW / naturalW, availH / naturalH);
      setScale(Math.max(minScale, next));
    };

    recompute();

    const ro = new ResizeObserver(recompute);
    ro.observe(el);
    window.addEventListener("resize", recompute);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recompute);
    };
  }, [minScale, padding]);

  return (
    <div
      className={`flex h-screen w-full items-center justify-center overflow-hidden ${className}`}
    >
      <div
        ref={contentRef}
        style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}
      >
        {children}
      </div>
    </div>
  );
}
