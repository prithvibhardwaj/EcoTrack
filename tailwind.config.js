/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#010d05',
          900: '#021a0b',
          800: '#042f14',
          700: '#064820',
          600: '#09632e',
          500: '#0d803c',
          400: '#13a84f',
          300: '#1fd468',
          200: '#5fe695',
          100: '#a8f5c4',
          50:  '#e4fdf0',
        },
        navy: {
          950: '#010409',
          900: '#020812',
          800: '#050f24',
          700: '#091a3d',
          600: '#0e2558',
          500: '#1535a0',  
          400: '#2a50c8',
          300: '#4d72e4',
          200: '#7b9ef5',
          100: '#b4c8fb',
          50:  '#e8effe',
        },
        accent: {
          blue: '#3b82f6',
          'blue-bright': '#60a5fa',
          'blue-glow': '#93c5fd',
          cyan: '#06b6d4',
          'cyan-glow': '#67e8f9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Orbitron', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(13, 128, 60, 0.4), 0 0 60px rgba(13, 128, 60, 0.15)',
        'glow-green-sm': '0 0 10px rgba(13, 128, 60, 0.35)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.4), 0 0 60px rgba(59, 130, 246, 0.15)',
        'glow-blue-sm': '0 0 10px rgba(59, 130, 246, 0.3)',
        'glow-cyan': '0 0 15px rgba(6, 182, 212, 0.4)',
        'card': '0 4px 24px rgba(0,0,0,0.4), 0 1px 4px rgba(0,0,0,0.3)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.4)',
      },
      backgroundImage: {
        'grid-pattern': `linear-gradient(rgba(13,128,60,0.07) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(13,128,60,0.07) 1px, transparent 1px)`,
        'hero-gradient': 'linear-gradient(135deg, #010d05 0%, #020f1a 50%, #010d05 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(4,47,20,0.7) 0%, rgba(5,15,36,0.7) 100%)',
        'green-blue-gradient': 'linear-gradient(135deg, #0d803c 0%, #1535a0 100%)',
        'green-glow-gradient': 'linear-gradient(135deg, #042f14 0%, #091a3d 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'scan': 'scan 2s linear infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'spin-slow': 'spin 8s linear infinite',
        'border-flow': 'borderFlow 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(13,128,60,0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(13,128,60,0.8), 0 0 60px rgba(13,128,60,0.4)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        borderFlow: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
      },
    },
  },
  plugins: [],
}