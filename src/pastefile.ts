import { post } from 'request';
import { lookup } from 'mime';
import { basename, resolve } from 'path';
import { encryptFile } from 'pasty-core';

import { error } from './util';
import { getFileContentsSync } from './io';

export function uploadPayload(payload, cb: (url: string) => void): void {
  let encryptedData: { data: string, key: string } = encryptFile(JSON.stringify(payload), 32);
  
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

export function uploadSingleFile(program): void {
  if (program.args.length > 1) {
    error('Only multiple code files can be uploaded as part of a single paste.');
  }

  let file: string = resolve(program.args[0]);
  let data: string = getFileContentsSync(file, error).toString('base64');

  let mimeString: string = lookup(file);

  const payload = {
    name: basename(file),
    data,
    mime: mimeString,
    type: "file"
  };

  uploadPayload(payload, console.log);
}
