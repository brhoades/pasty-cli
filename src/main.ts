import * as program from 'commander';
import { encryptFile } from 'pasty-core';
import * as colors from 'colors';
import { basename, resolve } from 'path';
import { existsSync, readFileSync } from 'fs';
import { lookup } from 'mime';
import * as request from 'request';

program
  .version('0.0.1')
  .usage('[options] <file ...>')
  .option('-c, --code', 'Code files are being uploaded. Allows multiple.')
  .parse(process.argv);

function error(message: string): void {
  console.log(colors.red(`Error: ${message}`));
  process.exit(1);
}

if (!program.code) {
  if (program.args.length > 1) {
    error('Only multiple code files can be uploaded as part of a single paste.');
  }

  let file: string = resolve(program.args[0]);

  if (!existsSync(file)) {
    error(`File does not exist "${file}".`);
  }

  let data: string = readFileSync(file).toString('base64');
  let mimeString: string = lookup(file);

  const payload = {
    name: basename(file),
    data,
    mime: mimeString,
    type: "file"
  };

  // encrypt
  let encryptedData: { data: string, key: string } = encryptFile(JSON.stringify(payload), 32);
  
  request.post({
    method: 'POST',
    url: 'https://pasty.brod.es/paste',
    json: true,
    form: {
      data: encryptedData.data,
    }
  }, (err, resp, body) => {
    if (resp.statusCode != 200) {
      error(`Status code HTTP${resp.statusCode} ${resp.statusMessage}`);
    }

    console.log(`http://p.brod.es/#view/${encodeURIComponent(body.filename)}/${encodeURIComponent(encryptedData.key)}`);
  });
}
