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

Use Arito through the command line in your working directory:

```bash
$ atiro [file] [data]
```

The meaning of this command is to compile and run `file.cpp`, which reads data from `data.in` and outputs into `data.out`, and compare the output with the standard answer, `data.ans`.

If `file` is not specified, it defaults to `TEST`. If `data` is not specified, it defaults to the same filename as `file`. If `data.ans` is not found, no answer comparison will be performed.

Arito is now still in the early stages of development, so there are a number of restrictions on its use:

- You need to have g++ on your computer that can be called globally from the command line, in other words, you need to have g++ and add it to the environment variable ``PATH``.

- It can only be run under Windows.

- Only C++ language is supported.

- Specifying compilation options is not supported.

- Specifying a time limit is not supported (default is $5\mathrm{s}$).

- Specifying comparison ways is not supported

## Uninstallation

Uninstall Atiro using npm as you did when installing it.

```bash
$ npm uninstall -g Atiro
```

Uninstall Node.js if you no longer need it.

## Thanks

[![Sukwants](https://avatars.githubusercontent.com/u/95968907?s=64&v=4)](https://github.com/Sukwants) [![zhangyt](https://avatars.githubusercontent.com/u/115882588?s=64&v=4)](https://github.com/zzhangyutian) [![赵悦岑](https://avatars.githubusercontent.com/u/96607031?s=64&v=4)](https://github.com/2745518585)
