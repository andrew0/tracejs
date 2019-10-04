"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const builder = __importStar(require("xmlbuilder"));
const trace_param_1 = require("./trace-param");
const numberArrayToString = (arr) => arr.map(a => a % 1 ? a.toString() : a.toFixed(1)).join(' ');
const createParametersObj = config => ({
    'StringParam': [
        { 'name': 'modelInput', 'StringValue': '-^br^pt-' },
        { 'name': 'resting_frq_on', 'StringValue': 'false' },
        { 'name': 'weight_frq_on', 'StringValue': 'false' },
        { 'name': 'post_frq_on', 'StringValue': 'false' },
        { 'name': 'resting_prim_on', 'StringValue': 'false' },
        { 'name': 'weight_prim_on', 'StringValue': 'false' },
        { 'name': 'post_prim_on', 'StringValue': 'false' },
        { 'name': 'continuumSpec', 'StringValue': '' },
        { 'name': 'user', 'StringValue': 'user' },
        { 'name': 'dateTime', 'StringValue': 'dateTime' },
        { 'name': 'comment', 'StringValue': 'comment' }
    ],
    'DecimalParam': [
        { 'name': 'alpha.if', 'DecimalValue': '1.0' },
        { 'name': 'alpha.fp', 'DecimalValue': '0.02' },
        { 'name': 'alpha.pw', 'DecimalValue': '0.05' },
        { 'name': 'alpha.pf', 'DecimalValue': '0.0' },
        { 'name': 'alpha.wp', 'DecimalValue': '0.02' },
        { 'name': 'decay.f', 'DecimalValue': '0.02' },
        { 'name': 'decay.p', 'DecimalValue': '0.03' },
        { 'name': 'decay.w', 'DecimalValue': '0.05' },
        { 'name': 'gamma.f', 'DecimalValue': '0.04' },
        { 'name': 'gamma.p', 'DecimalValue': '0.04' },
        { 'name': 'gamma.w', 'DecimalValue': '0.03' },
        { 'name': 'min', 'DecimalValue': '-0.3' },
        { 'name': 'max', 'DecimalValue': '1.0' },
        { 'name': 'rest.f', 'DecimalValue': '-0.1' },
        { 'name': 'rest.p', 'DecimalValue': '-0.1' },
        { 'name': 'rest.w', 'DecimalValue': '-0.1' },
        { 'name': 'atten', 'DecimalValue': '1.0' },
        { 'name': 'bias', 'DecimalValue': '0.0' },
        { 'name': 'learningRate', 'DecimalValue': '0.0' },
        { 'name': 'noiseSD', 'DecimalValue': '0.0' },
        { 'name': 'stochasticity', 'DecimalValue': '0.02' },
        { 'name': 'resting_frq_scale', 'DecimalValue': '0.0' },
        { 'name': 'resting_frq_constant', 'DecimalValue': '1.0' },
        { 'name': 'weight_frq_scale', 'DecimalValue': '0.13' },
        { 'name': 'weight_frq_constant', 'DecimalValue': '1.0' },
        { 'name': 'post_frq_constant', 'DecimalValue': '0.0' },
        { 'name': 'resting_prim_scale', 'DecimalValue': '0.0' },
        { 'name': 'resting_prim_constant', 'DecimalValue': '0.0' },
        { 'name': 'weight_prim_scale', 'DecimalValue': '0.0' },
        { 'name': 'weight_prim_constant', 'DecimalValue': '0.0' },
        { 'name': 'post_prim_constant', 'DecimalValue': '0.0' }
    ],
    'IntValue': [
        { 'name': 'fSlices', 'IntValue': '90' },
        { 'name': 'deltaSlices', 'IntValue': '6' },
        { 'name': 'nreps', 'IntValue': '1' },
        { 'name': 'slicesPerPhon', 'IntValue': '3' },
        { 'name': 'lengthNormalization', 'IntValue': '0' }
    ],
    'IntParamRep': {
        'name': 'FETSPREAD',
        'IntValue': config.spread
    },
    'DecimalParamRep': {
        'name': 'spreadScale',
        'DecimalValue': config.spreadScale
    },
    'lexicon': {
        'lexicon-name': 'null',
        'lexeme': config.lexicon.map(lex => ({
            'phonology': lex.phon,
            'frequency': lex.freq
        }))
    },
    'phonology': {
        'languageName': 'default',
        'phonemes': config.phonology.map(phon => ({
            'symbol': phon.label,
            'features': numberArrayToString(phon.features),
            'durationScalar': numberArrayToString(phon.durationScalar),
            'allophonicRelations': 'false false false false false false false false false false false false false false false' // TODO
        }))
    }
});
const createScriptObj = (desc, config) => ({
    'jt': {
        '@xmlns': 'http://xml.netbeans.org/examples/targetNS',
        'description': {
            '#text': desc
        },
        'script': {
            'action': [
                {
                    'set-parameters': {
                        'parameters': createParametersObj(config)
                    }
                },
                {
                    'save-simulation-to-txt': {
                        'file': {
                            'name': 'test'
                        }
                    }
                }
            ]
        }
    }
});
/*const createRootJt = desc => builder.create('jt')
  .att('xmlns', 'http://xml.netbeans.org/examples/targetNS')
  .att('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance')
  .ele('description', null, desc).up()

const createScript = root => root.ele('script')

const setScriptParameters = (script, parameters) => {
  let parameters = script
    .ele('action')
      .ele('set-parameters')
        .ele('parameters')
          .ele('StringParam')
            .ele('name', null, 'modelInput').up()
            .ele('StringValue', '-^br^pt-').up()
            .up()
    //     .ele('lexicon')
    //       .ele('lexicon-name', null, 'null').up()
    //       .ele('lexeme')
    //     .up()
    //   .up()
    // .up()
}
// xml = xml.ele('xmlbuilder')
//     .ele('repo', {'type': 'git'}, 'git://github.com/oozcitak/xmlbuilder-js.git')
//   .end({ pretty: true})*/
const xml = builder.create(createScriptObj('test description', trace_param_1.createDefaultConfig()));
console.log(xml.end({ pretty: true }));
//# sourceMappingURL=json-to-jt.js.map