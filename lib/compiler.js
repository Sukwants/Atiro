const { execSync } = require('child_process');
const fs = require('fs');
const chalk = require('chalk');

const config = require('./config.js');
const { exit } = require('./utils.js');

module.exports = (file, options, name) => {
  try {
    if (!fs.existsSync(`${file}.cpp`)) {
      console.log(chalk.cyan('[File Error]'), `${file}.cpp: Not Found`);
      exit();
    }
    execSync(`g++ "${file}.cpp" -o "${file}" ${options.comp !== undefined ? options.comp : config.getValue('option', 'comp')}`, { stdio: 'inherit' });
    console.log(chalk.green(`[${name ? name + ' ' : ''}Compiled]`));
  } catch (error) {
    console.log(chalk.yellow(`[${name ? name + ' ' : ''}Compilation Error]`));
    exit();
  }
}