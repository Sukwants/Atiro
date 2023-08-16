const { globSync } = require('glob');
const path = require('path');
const chalk = require('chalk');

const config = require('./config.js');
const compile = require('./compiler.js');
const run = require('./runner.js');
const { checkers, check } = require('./checker.js');

module.exports = async (file, data, options) => {
  try {
    file = file || config.getConfigValue('file', 'name');                     // process answer file path (1/2)
    file = file.replace(/\.cpp$/, '');
    
    compile(file, options, 'Answer');

    let checker = options.judg || config.getConfigValue('option', 'judg');    // process checker file path
    if (checker && !checkers[checker]) {
      checker = checker.replace(/\.cpp$/, '');
      compile(checker, options, 'Checker');
      if (!path.isAbsolute(checker) && !checker.startsWith('./')) {
        checker = './' + checker;
      }
    }

    let interactor = options.grad || config.getConfigValue('option', 'grad'); // process interactor file path
    if (interactor) {
      interactor = interactor.replace(/\.cpp$/, '');
      compile(interactor, options, 'Interactor');
      if (!path.isAbsolute(interactor) && !interactor.startsWith('./')) {
        interactor = './' + interactor;
      }
    }

    data = (data || (file + '*')).replace(/\\/g, '/');                        // search for data
    if (!data.endsWith('.in')) {
      data = data + '.in';
    }
    let dataList = globSync(data);
    if (dataList.length == 0) {
      console.log(chalk.yellow('[Warning]'), 'No tests detected.')
    } else {
      if (!path.isAbsolute(file) && !file.startsWith('./')) {                 // process answer file path (2/2)
        file = './' + file;
      }
      for (let i = 0; i < dataList.length; i++) {                             // erase .in suffix and sort
        dataList[i] = dataList[i].replace(/\.in$/, '');
      }
      dataList.sort();
      for (let data of dataList) {
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