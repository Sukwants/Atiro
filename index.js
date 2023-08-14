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
  .command('judge')
  .alias('j')
  .description('judge the answer')
  .arguments('[file] [data]')
  .option('-c, --comp <comp>', 'specify compilation options')
  .action((file, data, options) => {
    compileCpp(file || 'TEST', options.comp);
    runTest(file || 'TEST', data || file || 'TEST');
    compareFiles(data || file || 'TEST');
  });

program.parse(process.argv);