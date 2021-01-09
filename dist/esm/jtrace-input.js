/**
 * This file contains functions that import jTRACE XML files into representations that
 * TRACE.js can understand
 */
import { parse } from 'fast-xml-parser';
import { TracePhoneRole } from './trace-param';
export const parseJtLexicon = (xmlString) => {
    const parsed = parse(xmlString);
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
export const parseJtPhonology = (xmlString) => {
    const parsed = parse(xmlString);
    const phoneme = (parsed.phonemes && parsed.phonemes.phoenem) || [];
    return phoneme.map((phon) => ({
        label: phon.symbol,
        features: parseNumberArray(phon.features),
        durationScalar: parseNumberArray(phon.durationScalar),
        phonologicalRole: TracePhoneRole.NORMAL,
    }));
};
//# sourceMappingURL=jtrace-input.js.map