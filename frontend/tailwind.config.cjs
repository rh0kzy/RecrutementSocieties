module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0052CC',
        secondary: '#0747A6',
        success: '#36B37E',
        warning: '#FFAB00',
        error: '#DE350B',
        info: '#6554C0',
        text: {
          primary: '#172B4D',
          secondary: '#5E6C84',
        },
        border: '#DFE1E6',
        background: '#F4F5F7',
      },
      fontFamily: {
        primary: ['Inter', 'sans-serif'],
        secondary: ['Poppins', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'low': '0 1px 3px rgba(0,0,0,0.08)',
        'medium': '0 4px 8px rgba(0,0,0,0.12)',
        'high': '0 8px 16px rgba(0,0,0,0.16)',
      },
    },
  },
  plugins: [],
}
