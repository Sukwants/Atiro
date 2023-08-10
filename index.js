#!/usr/bin/env node

const { program } = require('commander');

const compileCpp = require('./lib/compiler.js');
const runTest = require('./lib/runner.js');
const compareFiles = require('./lib/judger.js');

program.version('1.0.0');

program
  .arguments('[file]')
  .action((file) => {
    compileCpp();
    runTest();
    compareFiles();
  });

program.parse(process.argv);