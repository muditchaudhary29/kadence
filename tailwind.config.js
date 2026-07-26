/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090b",
        card: "#121215",
        "card-hover": "#18181c",
        border: "#27272a",
        accent: {
          primary: "#6366f1",
          hover: "#4f46e5",
          purple: "#a855f7",
          cyan: "#06b6d4",
          emerald: "#10b981",
          amber: "#f59e0b",
          rose: "#f43f5e"
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wave-bar': 'waveBar 1.2s ease-in-out infinite alternate',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)' },
          '50%': { boxShadow: '0 0 30px rgba(168, 85, 247, 0.8)' },
        },
        waveBar: {
          '0%': { height: '8px' },
          '100%': { height: '48px' },
        }
      }
    },
  },
  plugins: [],
}
