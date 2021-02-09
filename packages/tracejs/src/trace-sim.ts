// This file is excluded from browser builds (see trace-sim-browser.js)

import * as fs from 'fs';
import * as path from 'path';

import TraceSimBase from './trace-sim-base';

function writeFile(filepath: string, data: any[][][]) {
  const numRows = data[0]?.length || 0;
  const allCycles: any[][] = [];
  for (let row = 0; row < numRows; row++) {
    for (let cycle = 0; cycle < data.length; cycle++) {
      allCycles.push([cycle, ...data[cycle][row]])
    }
  }

  const dir = path.dirname(filepath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filepath, allCycles.map((row) => row.join(', ')).join('\n'));
}

export default class TraceSim extends TraceSimBase {
  public writeFiles(dir: string, prefix = '') {
    const prefixUnderscore = prefix ? `${prefix}_` : '';

    const { input, feature, phoneme, word } = this.getSimData();
    writeFile(path.join(dir, `${prefixUnderscore}input.csv`), input);
    writeFile(path.join(dir, `${prefixUnderscore}feature.csv`), feature);
    writeFile(path.join(dir, `${prefixUnderscore}phoneme.csv`), phoneme);
    writeFile(path.join(dir, `${prefixUnderscore}word.csv`), word);
  }
}
