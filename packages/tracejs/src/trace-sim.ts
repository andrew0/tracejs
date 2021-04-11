// This file is excluded from browser builds (see trace-sim-browser.js)

import * as fs from 'fs';
import * as path from 'path';
import { Writable } from 'stream';

import TraceSimBase from './trace-sim-base';

function writeFile(filepath: string, data: any[][][]) {
  const numRows = data[0]?.length || 0;
  const allCycles: any[][] = [];
  for (let row = 0; row < numRows; row++) {
    for (let cycle = 0; cycle < data.length; cycle++) {
      allCycles.push([cycle, ...data[cycle][row]]);
    }
  }

  const dir = path.dirname(filepath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filepath, allCycles.map((row) => row.join(', ')).join('\n'));
}

function write(stream: Writable, data: any) {
  return new Promise<void>((resolve) => {
    if (!stream.write(data)) {
      stream.once('drain', resolve);
    } else {
      process.nextTick(resolve);
    }
  });
}

export default class TraceSim extends TraceSimBase {
  writeFiles(dir: string, prefix = '') {
    const prefixUnderscore = prefix ? `${prefix}_` : '';

    const { input, feature, phoneme, word } = this.getSimData();
    writeFile(path.join(dir, `${prefixUnderscore}input.csv`), input);
    writeFile(path.join(dir, `${prefixUnderscore}feature.csv`), feature);
    writeFile(path.join(dir, `${prefixUnderscore}phoneme.csv`), phoneme);
    writeFile(path.join(dir, `${prefixUnderscore}word.csv`), word);
  }

  async appendInputData(file: Writable, prefix?: string[]) {
    return write(file, this.serializeInputData(prefix));
  }

  async appendFeatureData(file: Writable, prefix?: string[]) {
    return write(file, this.serializeFeatureData(prefix));
  }

  async appendPhonemeData(file: Writable, prefix?: string[]) {
    return write(file, this.serializePhonemeData(prefix));
  }

  async appendWordData(file: Writable, prefix?: string[]) {
    return write(file, this.serializeWordData(prefix));
  }

  async appendLevelsAndFlowData(file: Writable, prefix?: string[]) {
    return write(file, this.serializeLevelsAndFlowData(prefix));
  }

  async appendFiles(files: Writable[], prefix?: string[]) {
    await Promise.all([
      this.appendInputData(files[0], prefix),
      this.appendFeatureData(files[1], prefix),
      this.appendPhonemeData(files[2], prefix),
      this.appendWordData(files[3], prefix),
      this.appendLevelsAndFlowData(files[4], prefix),
    ]);
  }
}
