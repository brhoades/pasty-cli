#!/usr/bin/env node

import * as program from 'commander';
import { existsSync, readFileSync } from 'fs';

import { singleFile, stdinArbitraryData } from './pastefile';

program
  .version('0.0.1')
  .usage('[options] <file ...>')
  .option('-c, --code', 'Code files are being uploaded. Allows multiple.')
  .option('-i, --stdin', 'Read from STDIN until EOF.')
  .parse(process.argv);

if (program.stdin) {
  stdinArbitraryData(program);
} else if (!program.code) {
  singleFile(program);
}
