const repl = require('repl')
const tracejs = require('../')

const r = repl.start('> ')
Object.defineProperty(r.context, 'tracejs', {
  configurable: false,
  enumerable: true,
  value: tracejs
})
