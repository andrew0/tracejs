// This file is excluded from browser builds (see trace-sim-browser.js)

import * as fs from 'fs';
import * as path from 'path';

import TraceSimBase from './trace-sim-base';

function writeFiles(dir: string, data: any[][][]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  data.forEach((cycle, index) => {
    const filepath = path.join(dir, index.toString().padStart(4, '0')) + '.csv';
    fs.writeFileSync(filepath, cycle.map((row) => row.join(', ')).join('\n'));
  });
}

export default class TraceSim extends TraceSimBase {
  public writeFiles(dir: string) {
    const { input, feature, phoneme, word } = this.getSimData();
    writeFiles(path.join(dir, 'input'), input);
    writeFiles(path.join(dir, 'feature'), feature);
    writeFiles(path.join(dir, 'phoneme'), phoneme);
    writeFiles(path.join(dir, 'word'), word);
  }
}
