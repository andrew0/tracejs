"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//const requirejs_ = require('requirejs');
const requirejs_1 = __importDefault(require("requirejs"));
requirejs_1.default.config({
    nodeRequire: require,
    packages: [
        { name: 'tcl', location: 'lib/Tcl.js/amd' }
    ]
});
requirejs_1.default(['tcl/interp'], Interp => {
    const I = Interp();
    I.registerCommand('annoy_user', args => {
        I.checkArgs(args, 1, 'string');
        console.log(args[1]);
    });
    I.TclEval('annoy_user "hello, world"', result => {
        switch (result.code) {
            case I.types.OK:
            case I.types.RETURN:
                break;
            case I.types.ERROR:
                console.warn('Uncaught error in Tcl script: ' + result.result);
                break;
            default:
                console.warn('Unexpected return code from Tcl script: ' + result.code);
        }
    });
});
//# sourceMappingURL=scripting.js.map