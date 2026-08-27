/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        midnight: {
          950: '#020617',
          900: '#0F172A',
          800: '#1E293B',
        },
        moonlight: {
          DEFAULT: 'rgba(148, 163, 184, 0.15)',
          bright: 'rgba(148, 163, 184, 0.3)',
        },
        glass: {
          bg: 'rgba(15, 23, 42, 0.6)',
          border: 'rgba(255, 255, 255, 0.1)',
        },
        rose: {
          300: '#FDA4AF',
          400: '#FB7185',
          500: '#F43F5E',
        },
      },
      keyframes: {
        twinkle: {
          '0%': { opacity: '1' },
          '50%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeSlideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        /*
         * Note: the `fingerBounce` and `meteorDiagonal` keyframes live in
         * valentine.css instead of here.
         *
         * - `meteorDiagonal` is applied by MeteorShower via an inline
         *   `animation:` string (not an `animate-*` utility), so Tailwind would
         *   purge it from the production build if it were defined here.
         * - `fingerBounce` is applied by FingerGuide via the
         *   `animate-fingerBounce` utility below, whose `animation` shorthand
         *   references the keyframe defined in valentine.css by name.
         */
      },
      animation: {
        twinkle: 'twinkle 4s ease-in-out infinite',
        fadeSlideUp: 'fadeSlideUp 500ms ease-out forwards',
        fingerBounce: 'fingerBounce 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
