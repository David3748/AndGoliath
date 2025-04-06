/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Modified Dracula theme colors
        primary: '#B39DFF', // Brighter purple for text
        secondary: '#FF79C6', // Pink
        background: '#0F111D', // Much darker blue background
        'current-line': '#1A1D2E', // Much darker current line
        foreground: '#F8F8F2', // Foreground
        comment: '#6272A4', // Comment
        cyan: '#8BE9FD',
        green: '#50FA7B',
        orange: '#FFB86C',
        pink: '#FF79C6',
        purple: '#9580FF', // Keep darker purple for large elements
        red: '#FF5555',
        yellow: '#F1FA8C',
        // Slingshot theme colors with modified dracula
        slingshot: {
          wood: '#B39DFF', // Brighter purple
          leather: '#FF79C6', // Pink
          stone: '#F8F8F2', // Foreground (white)
          elastic: '#6272A4' // Comment (muted blue)
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'slingshot-pull': 'slingshot-pull 1.5s ease-in-out infinite',
        'stone-ready': 'stone-ready 2s ease-in-out infinite',
      },
      keyframes: {
        'slingshot-pull': {
          '0%, 100%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(1.1)' },
        },
        'stone-ready': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            'p, ul, ol, li': { // Apply serif font to paragraphs and lists
              fontFamily: theme('fontFamily.serif'),
            },
            'h1, h2, h3, h4, h5, h6': { // Explicitly target headings
              fontFamily: theme('fontFamily.serif'),
              color: theme('colors.foreground'), // Set heading color to foreground
            },
            // ... other customizations ...
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}