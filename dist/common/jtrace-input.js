"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseJtPhonology = exports.parseJtLexicon = void 0;
/**
 * This file contains functions that import jTRACE XML files into representations that
 * TRACE.js can understand
 */
const fast_xml_parser_1 = require("fast-xml-parser");
const trace_param_1 = require("./trace-param");
exports.parseJtLexicon = (xmlString) => {
    const parsed = fast_xml_parser_1.parse(xmlString);
    const lexeme = (parsed.lexicon && parsed.lexicon.lexeme) || [];
    return lexeme.map((lex) => ({
        phon: lex.phonology,
        freq: +lex.frequency || 0,
        label: lex.label,
        prime: +lex.prime || 0,
    }));
};
const parseNumberArray = (str) => str
    .trim()
    .split(' ')
    .map((x) => Number(x) || 0);
exports.parseJtPhonology = (xmlString) => {
    const parsed = fast_xml_parser_1.parse(xmlString);
    const phoneme = (parsed.phonemes && parsed.phonemes.phoenem) || [];
    return phoneme.map((phon) => ({
        label: phon.symbol,
        features: parseNumberArray(phon.features),
        durationScalar: parseNumberArray(phon.durationScalar),
        phonologicalRole: trace_param_1.TracePhoneRole.NORMAL,
    }));
};
//# sourceMappingURL=jtrace-input.js.map