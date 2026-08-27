import { useEffect, useRef } from 'react';
import { useMeteorShower, Meteor } from '../hooks/useMeteorShower';

interface MeteorShowerProps {
  active: boolean;
  onComplete: () => void;
}

/**
 * MeteorShower component renders 5-6 diagonal meteor streaks
 * moving from upper-left to lower-right across the viewport.
 * Triggered by the `active` prop; calls `onComplete` when done.
 *
 * Each meteor is a thin glowing diagonal streak that translates from
 * upper-left toward lower-right using GPU-composited transform/opacity.
 */
export default function MeteorShower({ active, onComplete }: MeteorShowerProps) {
  const { meteors, triggerShower, isActive, cancelShower } = useMeteorShower();
  const prevIsActiveRef = useRef(false);

  // Trigger the shower when `active` prop becomes true; cancel cleanly when it
  // becomes false while a shower is still in progress (Req 10.2, 10.3).
  useEffect(() => {
    if (active) {
      triggerShower();
    } else if (isActive) {
      cancelShower();
    }
  }, [active, triggerShower, isActive, cancelShower]);

  // Detect when isActive transitions from true → false to call onComplete
  useEffect(() => {
    if (prevIsActiveRef.current && !isActive) {
      onComplete();
    }
    prevIsActiveRef.current = isActive;
  }, [isActive, onComplete]);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 10 }}
      aria-hidden="true"
    >
      {meteors.map((meteor) => (
        <MeteorStreak key={meteor.id} meteor={meteor} />
      ))}
    </div>
  );
}

/**
 * Individual meteor streak element.
 * Uses inline animation referencing the `meteorDiagonal` keyframe
 * from tailwind.config.js which translates from (0,0) to (110vw, 110vh).
 * The element is rotated 45deg and styled with a gradient trail + glow.
 */
function MeteorStreak({ meteor }: { meteor: Meteor }) {
  const { startX, startY, length, duration, delay, hue } = meteor;

  // Glowing trail colors derived from the meteor's hue (blue-to-pink range)
  const trailColor = `hsla(${hue}, 80%, 70%, 0.9)`;
  const glowColor = `hsla(${hue}, 70%, 60%, 0.6)`;

  return (
    // Outer wrapper: handles the diagonal travel across the screen (pure translate)
    <div
      className="absolute will-change-transform"
      style={{
        left: `${startX}vw`,
        top: `${startY}vh`,
        opacity: 0,
        animation: `meteorDiagonal ${duration}ms linear ${delay}ms forwards`,
      }}
    >
      {/* Inner streak: rotated to look like a diagonal trail aligned with travel direction */}
      <div
        style={{
          width: '2px',
          height: `${length}px`,
          borderRadius: '9999px',
          background: `linear-gradient(to bottom, ${trailColor}, transparent)`,
          boxShadow: `0 0 6px 2px ${glowColor}, 0 0 12px 4px ${glowColor}`,
          transform: 'rotate(45deg)',
        }}
      />
    </div>
  );
}
