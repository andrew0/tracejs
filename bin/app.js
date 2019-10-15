#!/usr/bin/env node

const repl = require('repl')
const fs = require('fs')
const tracejs = require('../')

if (process.argv.length > 2) {
  let contents
  try {
    contents = fs.readFileSync(process.argv[2], 'utf8')
  } catch {
    console.error('Error loading file "' + process.argv[2] + '"')
    process.exit(1)
  }

  // patch require function to return 'tracejs' package
  const oldRequire = require
  require = function() {
    if (arguments[0] == 'tracejs') {
      return tracejs
    }
    return oldRequire.apply(this, arguments)
  }

  eval(contents)
} else {
  const r = repl.start('> ')
  Object.defineProperty(r.context, 'tracejs', {
    configurable: false,
    enumerable: true,
    value: tracejs
  })
}
