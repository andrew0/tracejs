"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This file contains functions that import jTRACE XML files into representations that
 * TRACE.js can understand
 */
const fast_xml_parser_1 = __importDefault(require("fast-xml-parser"));
exports.parseJtLexicon = (xmlString) => {
    const parsed = fast_xml_parser_1.default.parse(xmlString);
    const lexeme = (parsed['lexicon'] && parsed['lexicon']['lexeme']) || [];
    return lexeme.map((lex) => ({
        phon: lex['phonology'],
        freq: +lex['frequency'] || 0,
        label: lex['label'],
        prime: +lex['prime'] || 0
    }));
};
//# sourceMappingURL=jtrace-input.js.map