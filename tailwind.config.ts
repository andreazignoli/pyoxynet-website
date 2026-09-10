import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          // Accent as TEXT: flips with the theme, because #00dc82 on a light
          // ground is 1.75:1. `fill` is the brand green itself and never
          // flips, so buttons and the mark stay exactly as they are.
          DEFAULT: 'rgb(var(--accent-rgb) / <alpha-value>)',
          fill: '#00dc82',
          blue: '#155799',
          green: '#159957',
        },
        // The themed ink ramp that replaced the white/NN utilities.
        ink: {
          strong: 'rgb(var(--ink-strong) / <alpha-value>)',
          body: 'rgb(var(--ink-body) / <alpha-value>)',
          subtle: 'rgb(var(--ink-subtle) / <alpha-value>)',
          faint: 'rgb(var(--ink-faint) / <alpha-value>)',
        },
        // The beta/caution marker. amber-400 is 1.9:1 on a light ground.
        warn: 'rgb(var(--warn-rgb) / <alpha-value>)',
        hairline: 'rgb(var(--hairline) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        // The demo stage. Fixed values, deliberately outside the themed ramp:
        // the product demos are a dark cinematic surface that stays dark when
        // the rest of the page is in the light theme, the way a video does.
        // Neutrals carry a faint green cast so the brand accent sits in them
        // rather than on them.
        demo: {
          void: '#070808',
          bg: '#0a0b0b',
          panel: '#0f1111',
          raised: '#151817',
          line: '#1d2120',
          line2: '#2b302f',
          ink: '#e7e9e8',
          dim: '#9aa2a0',
          faint: '#5f6665',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', ...fontFamily.sans],
        mono: ['var(--font-geist-mono)', ...fontFamily.mono],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-accent': 'linear-gradient(135deg, #00dc82 0%, #155799 100%)',
        'hero-overlay': 'linear-gradient(to bottom, rgba(10,10,10,0.5) 0%, rgba(10,10,10,0.85) 100%)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        caret: {
          '0%, 45%': { opacity: '1' },
          '55%, 100%': { opacity: '0' },
        },
        'signal-pulse': {
          '0%': { opacity: '0.9', transform: 'scale(1)' },
          '70%, 100%': { opacity: '0', transform: 'scale(2.6)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.6s ease-out',
        caret: 'caret 1.05s steps(1) infinite',
        'signal-pulse': 'signal-pulse 2.2s cubic-bezier(0.25,0.46,0.45,0.94) infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
