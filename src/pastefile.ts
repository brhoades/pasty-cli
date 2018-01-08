import { post } from 'request';
import { lookup } from 'mime';
import { basename, resolve } from 'path';
import { CodeFile, encryptFile, Paste, PasteFile } from 'pasty-core';

import { error } from './util';
import { getFileContentsSync } from './io';

export function uploadPayload(paste: Paste, cb: (url: string) => void): void {
  let encryptedData: { data: Buffer, key: string } = encryptFile(paste);
  
  post({
    body: encryptedData.data,
    har: {
      headers: [
        {
          name: 'content-type',
          value: 'application/octet-stream',
        },
      ]
    },
    json: true,
    method: 'POST',
    url: 'https://pasty.brod.es/paste',
  }, (err, resp, body) => {
    if (resp.statusCode != 200) {
      error(`Status code HTTP${resp.statusCode} ${resp.statusMessage}`);
    }

    if (!body.filename) {
      console.error('Server did not provide a valid response.');
      console.dir(body);
      return;
    }

    let baseServer: string = 'https://p.brod.es';
    if (process.env.LOCAL_SERVER) {
      baseServer = process.env.LOCAL_SERVER;
    }

    cb(`${baseServer}/#/view/${encodeURIComponent(body.filename)}/${encodeURIComponent(encryptedData.key)}`);
  });
}

export function uploadFiles(program): void {
  const paste: Paste = Paste.empty()

  paste.files = program.args.map((relativeFN, i) => {
    let filename: string = resolve(relativeFN);
    let data: Buffer = getFileContentsSync(filename, error);
    let mimeString: string = lookup(filename);

    if (CodeFile.isReadable(mimeString)) {
      // TODO: arguments to disable auto
      return new CodeFile(i, basename(filename), data.toString('utf8'), 'auto', mimeString);
    }

    return new PasteFile(i, basename(filename), data.toString('base64'), mimeString);
  });

  uploadPayload(paste, console.log);
}

export function stdinArbitraryData(program): void {
  let data: Buffer;
  const paste: Paste = Paste.empty()

  process.stdin.resume();
  process.stdin.setEncoding('utf8');

  process.stdin.on('data', chunk => data += chunk);

  process.stdin.on('end', () => {
    paste.files.push(new CodeFile(0, '', data.toString('base64'), 'auto'));
    uploadPayload(paste, console.log);
  });
}
