import { basename, resolve } from 'path';
import { existsSync, readFileSync } from 'fs';

export function getFileContentsSync(filename: string, error: (string) => void): Buffer {
  if (!existsSync(filename)) {
    error(`File does not exist "${filename}".`);
  }

  return readFileSync(filename);
}
