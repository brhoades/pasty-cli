import { post } from 'request';
import { lookup } from 'mime';
import { basename, resolve } from 'path';
import { encryptFile, Paste, PasteFile, CodeFile } from 'pasty-core';

import { error } from './util';
import { getFileContentsSync } from './io';

export function uploadPayload(payload, cb: (url: string) => void): void {
  let encryptedData: { data: string, key: string } = encryptFile(payload, 32);
  
  post({
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

    cb(`http://p.brod.es/#view/${encodeURIComponent(body.filename)}/${encodeURIComponent(encryptedData.key)}`);
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

  uploadPayload(paste.serialize(), console.log);
}

export function stdinArbitraryData(program): void {
  let data: Buffer;
  const paste: Paste = Paste.empty()

  process.stdin.resume();
  process.stdin.setEncoding('utf8');

  process.stdin.on('data', chunk => data += chunk);

  process.stdin.on('end', () => {
    paste.files.push(new CodeFile(0, '', data.toString('base64'), 'auto'));
    uploadPayload(paste.serialize(), console.log);
  });
}
