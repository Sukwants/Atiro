const { globSync } = require('glob');
const path = require('path');
const chalk = require('chalk');

const config = require('./config.js');
const compile = require('./compiler.js');
const run = require('./runner.js');
const { checkers, check } = require('./checker.js');

module.exports = async (file, data, options) => {
  try {
    file = file || config.getConfigValue('file', 'name');
    file = file.replace(/\.cpp$/, '');
    
    compile(file, options, 'Answer');

    let checker = options.judg || config.getConfigValue('option', 'judg');
    if (checker && !checkers[checker]) {
      checker = checker.replace(/\.cpp$/, '');
      compile(checker, options, 'Checker');
    }

    let interactor = options.grad || config.getConfigValue('option', 'grad');
    if (interactor) {
      interactor = interactor.replace(/\.cpp$/, '');
      compile(interactor, options, 'Interactor');
    }

    data = (data || (file + '*')).replace(/\\/g, '/');
    if (!data.endsWith('.in')) {
      data = data + '.in';
    }
    const dataList = globSync(data).sort();
    if (dataList.length == 0) {
      console.log(chalk.yellow('[Warning]'), 'No tests detected.')
    } else {
      if (!path.isAbsolute(file) && !file.startsWith('./')) {
        file = './' + file;
      }
      for (let data of dataList) {
        data = data.replace(/\.in$/, '');
        if (dataList.length > 1) {
          console.log(chalk.bold(chalk.hex('#85929E')(`Test ${data}:`)));
        }
        if (await run(file, data, interactor, options) || check(data, checker, options)) {
          if (!options.allj) {
            process.exit(0);
          }
        }
      }
    }
  } catch (error) {
    console.log(chalk.gray('[Mysterious Error]'), 'Failed on looking for data.');
    process.exit(0);
  }
}