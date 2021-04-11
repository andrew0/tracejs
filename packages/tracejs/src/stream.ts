import * as fs from 'fs';
import * as path from 'path';
import * as stream from 'stream';
import * as zlib from 'zlib';

export function openFileHandle(filename: string): stream.Writable {
  const file = fs.createWriteStream(filename, { flags: 'a' });
  const compress = zlib.createGzip();
  compress.pipe(file);
  return compress;
}

export function openFileHandles(dir: string, prefix?: string): stream.Writable[] {
  const fullPrefix = prefix ? `${prefix}-` : '';
  return ['input', 'feature', 'phoneme', 'word', 'levels_and_flow'].map((base) =>
    openFileHandle(path.join(dir, `${fullPrefix}${base}.csv.gz`))
  );
}

export function closeFileHandles(handles: stream.Writable[]) {
  handles.map((handle) => handle.end());
}
