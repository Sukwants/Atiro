#!/usr/bin/env node

const { program } = require('commander');

const compileCpp = require('./lib/compiler.js');
const runTest = require('./lib/runner.js');
const compareFiles = require('./lib/judger.js');

program
  .name('atiro')
  .description('Useless OI Tools')
  .version('0.0.8');

program
  .command('judge').alias('j')
  .description('judge the answer')
  .arguments('[file] [data]')
  .option('-c, --comp <comp>', 'specify compilation options')
  .option('-t, --time <time>', 'specify time limit')
  .action((file, data, options) => {
    compileCpp(file || 'TEST', options);
    runTest(file || 'TEST', data || file || 'TEST', options);
    compareFiles(data || file || 'TEST');
  });

program.parse(process.argv);