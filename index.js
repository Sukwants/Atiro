#!/usr/bin/env node

const compileCpp = require('./lib/compiler.js');
const runTest = require('./lib/runner.js');
const compareFiles = require('./lib/judger.js');

function main() {
  compileCpp();
  runTest();
  compareFiles();
}

main();