import * as fs from 'fs';
import { parseJtLexicon, parseJtPhonology } from './jtrace-input';

export function loadJtLexicon(filepath: string) {
  return parseJtLexicon(fs.readFileSync(filepath).toString());
}

export function loadJtPhonology(filepath: string) {
  return parseJtPhonology(fs.readFileSync(filepath).toString());
}
