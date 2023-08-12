#!/usr/bin/env node

const { program } = require('commander');

const compileCpp = require('./lib/compiler.js');
const runTest = require('./lib/runner.js');
const compareFiles = require('./lib/judger.js');

program.version('0.0.5');

program
  .arguments('[file] [data]')
  .action((file, data) => {
    compileCpp(file || 'TEST');
    runTest(file || 'TEST', data || file || 'TEST');
    compareFiles(data || file || 'TEST');
  });

program.parse(process.argv);