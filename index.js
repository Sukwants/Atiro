#!/usr/bin/env node

const { program } = require('commander');

const compileCpp = require('./lib/compiler.js');
const runTest = require('./lib/runner.js');
const compareFiles = require('./lib/judger.js');

program.version('0.0.4');

program
  .arguments('[file] [data]')
  .action((file, data) => {
    compileCpp(file);
    runTest(file, data);
    compareFiles(data);
  });

program.parse(process.argv);