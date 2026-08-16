import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        passport: {
          DEFAULT: '#0F3D3E',
          dark: '#0A2B2C',
          light: '#1B5E5F',
        },
        paper: '#F5EFE0',
        brass: '#C9A227',
        stamp: '#B33A3A',
        ink: '#122325',
      },
      fontFamily: {
        display: ['Instrument Serif', 'serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      keyframes: {
        stampIn: {
          '0%': { transform: 'scale(1.6) rotate(-8deg)', opacity: '0' },
          '60%': { transform: 'scale(0.92) rotate(-8deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(-8deg)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(var(--float-r, -6deg))' },
          '50%': { transform: 'translateY(-14px) rotate(var(--float-r, -6deg))' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        punch: {
          '0%': { transform: 'scale(1)' },
          '35%': { transform: 'scale(0.94)' },
          '100%': { transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-150% 0' },
          '100%': { backgroundPosition: '150% 0' },
        },
        bob: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(6px)' },
        },
      },
      animation: {
        stampIn: 'stampIn 0.35s cubic-bezier(.2,.8,.2,1)',
        float: 'float 7s ease-in-out infinite',
        marquee: 'marquee 26s linear infinite',
        punch: 'punch 0.4s cubic-bezier(.2,.8,.2,1)',
        shimmer: 'shimmer 2.8s ease-in-out infinite',
        bob: 'bob 2.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
