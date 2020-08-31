/**
 * This file contains functions that import jTRACE XML files into representations that
 * TRACE.js can understand
 */
import parser from 'fast-xml-parser'
import { TraceWord } from './trace-param'

export const parseJtLexicon = (xmlString: string): TraceWord[] => {
  const parsed = parser.parse(xmlString)
  const lexeme = (parsed['lexicon'] && parsed['lexicon']['lexeme']) || []
  return lexeme.map(
    (lex: any): TraceWord => ({
      phon: lex['phonology'],
      freq: +lex['frequency'] || 0,
      label: lex['label'],
      prime: +lex['prime'] || 0,
    })
  )
}
