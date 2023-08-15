const { execSync } = require('child_process');
const fs = require('fs');
const chalk = require('chalk');

const config = require('./config.js');

module.exports = (file, options, checker) => {
  try {
    if (!fs.existsSync(`${file}.cpp`)) {
      console.log(chalk.cyan('[File Error]'), `${file}.cpp: Not Found`);
      process.exit(0);
    }
    execSync(`g++ "${file}.cpp" -o "${file}" ${options.comp !== undefined ? options.comp : config.getConfigValue('option', 'comp')}`, { stdio: 'inherit' });
    console.log(chalk.green(`[${checker ? 'Checker ' : ''}Compiled]`));
  } catch (error) {
    console.log(chalk.yellow(`[${checker ? 'Checker ' : ''}Compilation Error]`));
    process.exit(0);
  }
}