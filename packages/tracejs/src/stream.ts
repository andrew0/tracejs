import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';

export function openFileHandle(filename: string): any {
  const file = fs.createWriteStream(filename, { flags: 'a' });
  const compress = zlib.createGzip();
  compress.pipe(file);
  return compress;
}

export function openFileHandles(dir: string, prefix?: string): any[] {
  const fullPrefix = prefix ? `${prefix}-` : '';
  return ['input', 'feature', 'phoneme', 'word'].map((base) =>
    openFileHandle(path.join(dir, `${fullPrefix}${base}.csv.gz`))
  );
}

export function closeFileHandles(handles: any[]) {
  handles.map((handle) => handle.end());
}
