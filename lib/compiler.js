const { execSync } = require('child_process');
const fs = require('fs');
const chalk = require('chalk');
const path = require('path');

const config = require('./config.js');
const { exit } = require('./utils.js');

module.exports = (file, options, name) => {
  try {
    if (function () {
      if (config.getValue('judge', 'reco') === 'always' || options.reco) return true;
      try {
        const source_stats = fs.statSync(`${file}.cpp`);
        const exec_stats = fs.statSync(file + (process.platform == 'win32' ? '.exe' : ''));
        return source_stats.mtimeMs > exec_stats.mtimeMs;
      } catch (error) { return true; }
    }()) {
      if (!fs.existsSync(`${file}.cpp`)) {
        console.log(chalk.cyan('[File Error]'), `${file}.cpp: Not Found`);
        exit();
      }
      const compiler = config.getValue('compiler', 'path');
      const gcc = (compiler && fs.existsSync(compiler)) ? (fs.statSync(compiler).isFile() ? path.join(compiler, '..') : compiler) : null;
      execSync(`g++ "${file}.cpp" -o "${file}" ${options.comp !== undefined ? options.comp : config.getValue('judge', 'comp')}`, {
        stdio: 'inherit',
        env: {
          ...process.env,
          PATH: (gcc ? gcc + (process.platform == 'win32' ? ';' : ':') : '') + process.env.PATH
        }
      });
      console.log(chalk.green(`[${name ? name + ' ' : ''}Compiled]`));
    }
    else console.log(chalk.green(`[${name ? name + ' ' : ''}Compilation Skipped]`));
  } catch (error) {
    console.log(chalk.yellow(`[${name ? name + ' ' : ''}Compilation Error]`));
    exit();
  }
}