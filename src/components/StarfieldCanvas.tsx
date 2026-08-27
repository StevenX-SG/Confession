import React from 'react';
import { useStarfield } from '../hooks/useStarfield';

interface StarfieldCanvasProps {
  brightened: boolean;
}

/**
 * Full-viewport starfield background with twinkling stars and moonlight glow.
 * Sits behind all UI content at z-index 0.
 *
 * On `brightened=true`: background lightens, star opacities increase,
 * and moonlight shifts toward amber/gold — all via a 2s CSS transition.
 */
const StarfieldCanvas: React.FC<StarfieldCanvasProps> = ({ brightened }) => {
  const { stars } = useStarfield(200);

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        zIndex: 0,
        background: brightened
          ? 'linear-gradient(to bottom, #0F172A, #1E293B)'
          : 'linear-gradient(to bottom, #020617, #0F172A)',
        transition: 'background 2s ease-in-out',
      }}
    >
      {/* Stars */}
      {stars.map((star, index) => (
        <div
          key={index}
          className="star animate-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size * 2}px`,
            height: `${star.size * 2}px`,
            opacity: brightened
              ? Math.min(star.opacity + 0.2, 1.0)
              : star.opacity,
            animationDuration: `${star.twinkleSpeed}s`,
            animationDelay: `${star.twinkleDelay}s`,
            transition: 'opacity 2s ease-in-out',
          }}
        />
      ))}

      {/* Moonlight Glow - radial gradient overlay at top-right corner */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: brightened
            ? 'radial-gradient(ellipse at top right, rgba(217, 172, 106, 0.3) 0%, transparent 35%)'
            : 'radial-gradient(ellipse at top right, rgba(148, 163, 184, 0.15) 0%, transparent 35%)',
          transition: 'background 2s ease-in-out',
        }}
      />
    </div>
  );
};

export default StarfieldCanvas;
