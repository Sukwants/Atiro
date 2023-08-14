const { execSync } = require('child_process');
const fs = require('fs');
const chalk = require('chalk');

const config = require('./config.js');

module.exports = (file, options) => {
  try {
    if (!fs.existsSync(`./${file}.cpp`)) {
      console.log(chalk.cyan('[File Error]'), `${file}.cpp: Not Found`);
      process.exit(0);
    }
    execSync(`g++ "${file}.cpp" -o "${file}.exe" ${options.comp || config.getConfigValue('options', 'comp')}`, { stdio: 'inherit' });
    console.log(chalk.green('[Compiled]'));
  } catch (error) {
    console.log(chalk.yellow('[Compilation Error]'));
    process.exit(0);
  }
}