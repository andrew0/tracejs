import { TraceWord } from './trace-param'

export const serializeJtLexicon = (lex: TraceWord[]) => {
  let result = '<?xml version="1.0" encoding="UTF-8"?>\n'
    + '<lexicon>\n'
  for (const word of lex) {
    let lexeme = '  <lexeme>\n'
    if (word.label) lexeme += `    <label>${word.label}</label>\n`
    lexeme += `    <phonology>${word.phon}</phonology>\n`
    if (word.freq) lexeme += `    <frequency>${word.freq}</frequency>\n`
    if (word.prime) lexeme += `    <prime>${word.prime}</prime>\n`
    lexeme += '  </lexeme>\n'
    result += lexeme
  }
  result += '</lexicon>'
  return result
}
