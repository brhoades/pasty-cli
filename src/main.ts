#!/usr/bin/env node

import * as program from 'commander';
import { existsSync, readFileSync } from 'fs';

import { uploadFiles, stdinArbitraryData } from './pastefile';

program
  .version('0.2.0')
  .usage('[options] <file ...>')
  .option('-i, --stdin', 'Read from STDIN until EOF.')
  .parse(process.argv);

if (program.stdin) {
  stdinArbitraryData(program);
} else {
  uploadFiles(program);
}
