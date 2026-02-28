const path = require("path");
/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    path.join(__dirname, "./app/**/*.{js,jsx,ts,tsx}"),
    path.join(__dirname, "./src/**/*.{js,jsx,ts,tsx}"),
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10D9A5',
          dark: '#0DB88E',
          light: '#5FE8C5',
        },
        background: {
          primary: '#0F1E1C',
          secondary: '#1A2E2A',
          tertiary: '#243832',
          dark: '#1C2B3A',
        },
        status: {
          taken: '#10D9A5',
          next: '#FF8A3D',
          missed: '#E74C3C',
          warning: '#F39C12',
          info: '#3498DB',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#A0AEC0',
          tertiary: '#8A95A5',
          accent: '#10D9A5',
          muted: '#6B7280',
        },
        ui: {
          border: '#2D3748',
          input: '#2A3F3B',
          icon: '#10D9A5',
          iconSecondary: '#4A5568',
        },
      },
      fontFamily: {
        sans: [
          'System',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '32px',
      },
      fontSize: {
        'h1': ['32px', { lineHeight: '40px', fontWeight: '800' }],
        'h2': ['24px', { lineHeight: '32px', fontWeight: '700' }],
        'h3': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '26px' }],
        'body': ['16px', { lineHeight: '24px' }],
        'body-sm': ['14px', { lineHeight: '20px' }],
        'caption': ['12px', { lineHeight: '16px' }],
      },
    },
  },
  plugins: [],
}
