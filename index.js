#!/usr/bin/env node

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const chalk = require('chalk');

function compileCpp() {
  try {
    if (!fs.existsSync('./TEST.cpp')) {
      console.log(chalk.cyan('[File Error]'), 'TEST.cpp: Not Found');
      process.exit(0);
    }
    
    execSync('g++ -o TEST.exe TEST.cpp', { stdio: 'inherit' });
    console.log(chalk.green('[Compiled]'));
  } catch (error) {
    console.log(chalk.yellow('[Compilation Error]'));
    process.exit(0);
  }
}

function runTest() {
  try {
    const startTime = process.hrtime.bigint();

    const result = spawnSync('TEST.exe', { input: fs.existsSync('./TEST.in') ? fs.readFileSync('./TEST.in').toString() : '', timeout: 10000 });
    fs.writeFileSync('./TEST.out', result.stdout);
    fs.writeFileSync('./TEST.err', result.stderr);

    const endTime = process.hrtime.bigint();

    const runTime = Number(endTime - startTime) / 1e6;

    console.log(`Return Value: ${result.status}`);
    console.log(`Running Time: ${runTime.toFixed(0)}ms`);

    if (result.error) {
      if (result.signal) {
        console.log(chalk.blue('[Time Limit Exceeded]'));
      } else {
        console.log(chalk.magenta('[Runtime Error]'));
      }
      process.exit(0);
    }
  } catch (error) {
    console.log(chalk.gray('[Mysterious Error]'));
    process.exit(0);
  }
}

function compareFiles() {
  try {
    if (!fs.existsSync('./TEST.ans')) {
      process.exit(0);
    }

    const content1 = fs.readFileSync('TEST.out').toString().replace(/[ \t]+$/gm, '').replace(/[\r\n]+$/, '');
    const content2 = fs.readFileSync('TEST.ans').toString().replace(/[ \t]+$/gm, '').replace(/[\r\n]+$/, '');

    if (content1 === content2) {
      console.log(chalk.green('[Accepted]'));
    } else {
      console.log(chalk.red('[Wrong Answer]'));
    }
  } catch (error) {
    console.log(chalk.gray('[Mysterious Error]'));
    process.exit(0);
  }
}

function main() {
  compileCpp();
  runTest();
  compareFiles();
}

main();