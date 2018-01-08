pasty-cli
====================
pasty-cli is a Typescript command line tool that interfaces with
[pasty-server](https://github.com/brhoades/pasty-server) to allow anonymous uploading,
downloading, and sharing of pastes, collections of files. All pastes are encrypted
client-side before transmission for storage. Submitted pastes are solely tied to a
server-provided identifier and are typically hosted from a public S3 bucket. The
corresponding AES key to each paste never leaves the client, rendering server knowledge of the
paste's existence useless. No identifying information about the paste's origin is
retained outside of your terminal.

Installation
-----------
From npm:

```bash
npm install -g pasty-cli
```

or using `yarn`:

```bash
yarn gobal add pasty-cli
```

Development installation
----------------------------
Clone this project and run:

```bash
yarn install
```

To build the CLI tool into `dist/`:

```bash
yarn build
```

Usage
-----
To view builtin help run:

```bash
pasty --help

  Usage: pasty [options] <file ...>


  Options:

    -V, --version  output the version number
    -i, --stdin    Read from STDIN until EOF.
    -h, --help     output usage information
```

Basic usage of pasty involves passing a list of files:

```bash
$ pasty image.png main.js lib.js

https://p.brod.es/#/view/fileid/somekey
```

Which will then return a URL, using a hardcoded URL as a base: `https://p.brod.es/#/view/fileid/somekey`

Alternatively, you can use stdin to create a paste:

```bash
$ dmesg | pasty -i

https://p.brod.es/#/view/fileid/somekey
```

Changelog
-----------
See [Changelog](CHANGELOG.md)
