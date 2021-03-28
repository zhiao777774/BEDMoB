module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {
      browsers: [
        // 指定支援的瀏覽器版本
        'Chrome >= 52',
        'FireFox >= 44',
        'Safari >= 7',
        'Explorer >= 11',
        'last 2 Edge versions',
      ]
    },
  },
}
