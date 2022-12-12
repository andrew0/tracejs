import { TracePhone, TraceWord } from './trace-param';

export const serializeJtLexicon = (lex: TraceWord[]) => {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<lexicon>',
    ...lex.map((word) => [
      '  <lexeme>',
      ...(word.label ? [`    <label>${word.label}</label>`] : []),
      `    <phonology>${word.phon}</phonology>`,
      ...(word.freq ? [`    <frequency>${word.freq}</frequency>`] : []),
      ...(word.prime ? [`    <prime>${word.prime}</prime>`] : []),
      '  </lexeme>',
    ]),
    '</lexicon>',
    '',
  ];
};

const formatter = Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 10,
});
const serializeNumberArray = (nums: number[]) =>
  nums.map((x: number) => formatter.format(x)).join(' ');

export const serializeJtPhonology = (phonology: TracePhone[]) => {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<phonology>',
    '  <phonemes>',
    ...phonology.map((phon) => [
      '    <phoneme>',
      `      <symbol>${phon.label}</symbol>`,
      `      <features>${serializeNumberArray(phon.features)}</features>`,
      `      <durationScalar>${serializeNumberArray(phon.features)}</durationScalar>`,
      `    </phoneme>`,
    ]),
    '  </phonemes>',
    '</phonology>',
    '',
  ].join('\n');
};
