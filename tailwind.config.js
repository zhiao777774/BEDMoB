module.exports = {
  darkMode: false, // or 'media' or 'class'
  purge: {
    mode: 'layers',
    layers: ['base', 'components', 'utilities'],
    enabled: false,
    content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}']
  },
  theme: {
    extend: {
      fontFamily: {
        oswald: ['Oswald', 'sans-serif']
      },
      inset: {
        '11/20': '55%',
        '18': '4.5rem'
      },
      margin: {
        center: '0 auto'
      },
      zIndex: {
        '60': 60
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: [
    require('@tailwindcss/custom-forms')
  ]
}
