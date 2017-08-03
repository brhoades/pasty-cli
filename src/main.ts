import * as program from 'commander';
import { existsSync, readFileSync } from 'fs';

import { uploadSingleFile } from './pastefile';

program
  .version('0.0.1')
  .usage('[options] <file ...>')
  .option('-c, --code', 'Code files are being uploaded. Allows multiple.')
  .parse(process.argv);

if (!program.code) {
  uploadSingleFile(program);
}
