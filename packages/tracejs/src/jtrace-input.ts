/**
 * This file contains functions that import jTRACE XML files into representations that
 * TRACE.js can understand
 */
import { XMLParser } from 'fast-xml-parser';
import * as t from 'typanion';
import { TracePhone, TracePhoneRole, TraceWord } from './trace-param';

export const parseJtLexicon = (xmlString: string): TraceWord[] => {
  const parsed = new XMLParser().parse(xmlString);
  const lexeme = (parsed.lexicon && parsed.lexicon.lexeme) || [];
  return lexeme.map(
    (lex: any): TraceWord => ({
      phon: lex.phonology,
      freq: +lex.frequency || 0,
      label: lex.label,
      prime: +lex.prime || 0,
    })
  );
};

const parseNumberArray = (str: string) =>
  str
    .trim()
    .split(' ')
    .map((x: string) => Number(x) || 0);

export const parseJtPhonology = (xmlString: string): TracePhone[] => {
  const parsed = new XMLParser().parse(xmlString);
  const phoneme = parsed.phonology?.phonemes?.phoneme ?? parsed.phonemes?.phoneme ?? [];
  return phoneme.map(
    (phon: any): TracePhone => ({
      label: phon.symbol,
      features: parseNumberArray(phon.features),
      durationScalar: parseNumberArray(phon.durationScalar),
      phonologicalRole: TracePhoneRole.NORMAL,
    })
  );
};

const isPhonology = t.isArray(
  t.isObject({
    label: t.isString(),
    features: t.isArray(t.isNumber()),
    durationScalar: t.isArray(t.isNumber()),
    phonologicalRole: t.isOneOf([
      t.isLiteral(TracePhoneRole.NORMAL),
      t.isLiteral(TracePhoneRole.AMBIG),
      t.isLiteral(TracePhoneRole.ALLOPHONE),
      t.isLiteral(TracePhoneRole.OTHER),
    ]),
  })
);

export const parseJsonPhonology = (obj: unknown): TracePhone[] => {
  const errors: string[] = [];
  if (isPhonology(obj, { errors })) {
    return obj;
  }

  throw Object.assign(new Error(JSON.stringify(errors)), { errors });
};

const isLexicon = t.isArray(
  t.isObject({
    phon: t.isString(),
    freq: t.isNumber(),
    label: t.isOptional(t.isString()),
    prime: t.isNumber(),
  })
);

export const parseJsonLexicon = (obj: unknown): TraceWord[] => {
  const errors: string[] = [];
  if (isLexicon(obj, { errors })) {
    return obj;
  }

  throw Object.assign(new Error(JSON.stringify(errors)), { errors });
};
