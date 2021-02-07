import { TracePhone, TraceWord } from './trace-param';

export const serializeJtLexicon = (lex: TraceWord[]) => {
  let result = '<?xml version="1.0" encoding="UTF-8"?>\n<lexicon>\n';
  for (const word of lex) {
    let lexeme = '  <lexeme>\n';
    if (word.label) lexeme += `    <label>${word.label}</label>\n`;
    lexeme += `    <phonology>${word.phon}</phonology>\n`;
    if (word.freq) lexeme += `    <frequency>${word.freq}</frequency>\n`;
    if (word.prime) lexeme += `    <prime>${word.prime}</prime>\n`;
    lexeme += '  </lexeme>\n';
    result += lexeme;
  }
  result += '</lexicon>';
  return result;
};

const formatter = Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 10,
});
const serializeNumberArray = (nums: number[]) =>
  nums.map((x: number) => formatter.format(x)).join(' ');

export const serializeJtPhonology = (phonology: TracePhone[]) => {
  let result = '<?xml version="1.0" encoding="UTF-8"?>\n<phonemes>\n';
  for (const phon of phonology) {
    let phoneme = '  <phoneme>\n';
    phoneme += `    <symbol>${phon.label}</symbol>\n`;
    phoneme += `    <features>${serializeNumberArray(phon.features)}</features>\n`;
    phoneme += `    <durationScalar>${serializeNumberArray(phon.features)}</durationScalar>\n`;
    phoneme += '  </phoneme>\n';
    result += phoneme;
  }
  result += '</phonemes>';
  return result;
};
