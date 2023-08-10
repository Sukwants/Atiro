[zh-CN](./README.md) | en-CN

# Atiro

Atiro is a Useless OI Tool that compiles and runs local code and judges a single set of local samples.

## Installation

This application needs to be installed on your computer before installing Atiro:

  - [Node.js](https://nodejs.org/)

Once Node.js is installed, you can install Atiro using npm.

```bash
$ npm install -g atiro
```

## Usage

Arito is now still in the early stages of development, so there are a number of restrictions on its use:

You need to have g++ on your computer that can be called globally from the command line, in other words, you need to have g++ and add it to the environment variable ``PATH``.

It can only be run under Windows.

It only allows ``TEST.cpp`` as source code filename, ``TEST.in`` as input filename, ``TEST.ans`` as answer filename, ``TEST.out`` as output filename, and ``TEST.err`` as error output filename.

Only C++ language is supported.

Specifying compilation options is not supported.

Specifying a time limit is not supported (default is $10\mathrm{s}$).

## Uninstallation

Uninstall Atiro using npm as you did when installing it.

```bash
$ npm uninstall -g Atiro
```

Uninstall Node.js if you no longer need it.

## Thanks

![Sukwants](https://avatars.githubusercontent.com/u/95968907?s=64&v=4) ![zhangyt](https://avatars.githubusercontent.com/u/115882588?s=64&v=4) ![赵悦岑](https://avatars.githubusercontent.com/u/96607031?s=64&v=4)
