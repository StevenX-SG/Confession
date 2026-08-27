import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  animate?: boolean;
  className?: string;
}

/**
 * GlassCard — Reusable dark glassmorphism card wrapper.
 *
 * Renders a semi-transparent card with backdrop blur, rounded corners,
 * and a subtle white border. Optionally applies a fade-in + slide-up
 * entry animation on mount using GPU-composited properties only.
 *
 * Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 7.1, 8.2
 */
const GlassCard: React.FC<GlassCardProps> = ({
  children,
  animate = true,
  className = '',
}) => {
  return (
    <div
      className={[
        // Glassmorphism styling (Req 4.1)
        'bg-slate-900/[0.2] backdrop-blur-[16px] rounded-[24px] border border-white/[0.15]',
        // Responsive width: 90% mobile, max-w-[560px] desktop, centered (Req 4.3, 4.4)
        'w-[90%] max-w-[560px] mx-auto',
        // Mobile padding & text sizing (Req 8.2)
        'p-6 text-sm md:text-base',
        // Entry animation using Tailwind utility (Req 4.2, 4.5, 7.1)
        animate ? 'animate-fadeSlideUp' : '',
        // Additional classes
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
};

export default GlassCard;
