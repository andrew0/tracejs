const { createVuePlugin } = require('vite-plugin-vue2')

module.exports = {
  rollupInputOptions: {
    external: ['chart.js'],
  },
  plugins: [createVuePlugin()],
}
