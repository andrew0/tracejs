import requirejs from 'requirejs'
import { createDefaultConfig } from '../trace-param'
import jsonScript from './json-tcl'

requirejs.config({
  nodeRequire: require,
  packages: [
    { name: 'tcl', location: '../lib/Tcl.js/amd' }
  ]
})

requirejs(['tcl/interp'], Interp => {
  const I = Interp()

  //const config = createDefaultConfig()
  I.registerCommand('create_trace_config', args => {
    const checkres = res => {
      // if (res.code !== I.types.OK) {
      //   console.error('create_trace_config returned error: ' + res.result)
      // }
      console.log(res)
    }

    I.TclEval('set foo bar', checkres)
    I.TclEval('set foo', checkres)
    //I.exec('set d1 [json::json2dict_tcl $jsonstr]', checkres)
    //I.exec('dict get $d1 foo', checkres)

    // for (const [key, value] of Object.entries(config)) {
    //   I.TclEval(`dict set conf "${key}" "${value}"`, checkres)
    // }
    //I.checkArgs(args, 1, 'string')
    //console.log(args[1])
  })

  I.TclEval('create_trace_config test', result => {
    switch (result.code) {
      case I.types.OK:
      case I.types.RETURN:
        break
      case I.types.ERROR:
        console.warn('Uncaught error in Tcl script: '+result.result)
        break
      default:
        console.warn('Unexpected return code from Tcl script: '+result.code)
    }
  })
})
