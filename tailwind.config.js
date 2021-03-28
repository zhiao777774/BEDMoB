module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  purge: {
    mode: 'layers',
    layers: ['base', 'components', 'utilities']
  },
  theme: {
    extend: {
      fontFamily: {
        oswald: ['Oswald', 'sans-serif']
      },
      inset: {
        '11/20': '55%'
      },
      margin: {
        center: '0 auto'
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
