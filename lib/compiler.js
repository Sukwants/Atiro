const { execSync } = require('child_process');
const fs = require('fs');
const chalk = require('chalk');

module.exports = () => {
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