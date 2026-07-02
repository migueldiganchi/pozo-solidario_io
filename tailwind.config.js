/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      colors: {
        // New Design System Colors
        background: 'hsl(var(--background))', // Deep dark gray/blue
        surface: 'hsl(var(--surface))',       // Slightly lighter dark for cards/elements
        'surface-hover': 'hsl(var(--surface-hover))', // Even lighter dark for hover states
        primary: 'hsl(var(--primary))',       // Subtle, desaturated green/emerald
        'primary-hover': 'hsl(var(--primary-hover))', // Slightly brighter/lighter primary for hover
        'primary-light': 'hsl(var(--primary-light))', // Lighter primary for gradients
        'primary-dark': 'hsl(var(--primary-dark))',   // Darker primary for gradients
        gold: 'hsl(var(--gold))',             // Desaturated gold for highlights
        text: 'hsl(var(--text))',             // Off-white
        'text-secondary': 'hsl(var(--text-secondary))', // Lighter gray
        border: 'hsl(var(--border))',
        success: 'hsl(var(--success))',       // Desaturated green
        danger: 'hsl(var(--danger))',         // Desaturated red

        // Keeping old color names for compatibility if they are used elsewhere,
        // mapping them to the new design system for consistency.
        // If the old names are not used, they can be removed.
        foreground: 'hsl(var(--text))',
        accent: 'hsl(var(--primary))',
        muted: 'hsl(var(--text-secondary))',
        card: 'hsl(var(--surface))',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease forwards',
        'slide-up': 'slideUp 0.5s ease forwards',
        'pulse-slow': 'pulse 3s infinite',
        'count-up': 'countUp 1s ease forwards',
        'hover-lift': 'hoverLift 0.2s ease-out forwards',
        'hover-shadow': 'hoverShadow 0.2s ease-out forwards',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        hoverLift: {
          '0%': { transform: 'translateY(0) scale(1)' },
          '100%': { transform: 'translateY(-2px) scale(1.005)' },
        },
        hoverShadow: {
          '0%': { boxShadow: '0 0px 0px rgba(0,0,0,0)' },
          '100%': { boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }, // Subtle shadow
        },
      },
    },
  },
  plugins: [],
}
