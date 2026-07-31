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
      },
      animation: {
        stampIn: 'stampIn 0.35s cubic-bezier(.2,.8,.2,1)',
      },
    },
  },
  plugins: [],
}
