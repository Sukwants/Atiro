const { execSync } = require('child_process');
const fs = require('fs');
const chalk = require('chalk');
const path = require('path');

const config = require('./config.js');
const { exit } = require('./utils.js');

module.exports = (file, options, name) => {
  try {
    if (!fs.existsSync(`${file}.cpp`)) {
      console.log(chalk.cyan('[File Error]'), `${file}.cpp: Not Found`);
      exit();
    }
    const compiler = config.getValue('compiler', 'path');
    const gcc = (compiler && fs.existsSync(compiler)) ? (fs.statSync(compiler).isFile() ? path.join(compiler, '..') : compiler) : null;
    execSync(`g++ "${file}.cpp" -o "${file}" ${options.comp !== undefined ? options.comp : config.getValue('option', 'comp')}`, {
      stdio: 'inherit',
      env: {
        ...process.env,
        PATH: (gcc ? gcc + (process.platform == 'win32' ? ';' : ':') : '') + process.env.PATH
      }
    });
    console.log(chalk.green(`[${name ? name + ' ' : ''}Compiled]`));
  } catch (error) {
    console.log(chalk.yellow(`[${name ? name + ' ' : ''}Compilation Error]`));
    exit();
  }
}