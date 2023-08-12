#!/usr/bin/env node

const { program } = require('commander');

const compileCpp = require('./lib/compiler.js');
const runTest = require('./lib/runner.js');
const compareFiles = require('./lib/judger.js');

console.log(process.argv);

program
  .name('atiro')
  .description('Useless OI Tools')
  .version('0.0.6');

program
  .arguments('[file] [data]')
  .action((file, data) => {
    compileCpp(file || 'TEST');
    runTest(file || 'TEST', data || file || 'TEST');
    compareFiles(data || file || 'TEST');
  });

program.parse(process.argv);