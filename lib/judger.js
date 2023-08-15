const { globSync } = require('glob');
const chalk = require('chalk');

const config = require('./config.js');
const compile = require('./compiler.js');
const run = require('./runner.js');
const check = require('./checker.js');

module.exports = (file, data, options) => {
  try {
    file = file || config.getConfigValue('file', 'name');
    
    compile(file, options);

    const dataList = globSync(((data || (file + '*')) + '.in').replace(/\\/g, '/')).sort();
    if (dataList.length == 0) {
      console.log(chalk.yellow('[Warning]'), 'No tests detected.')
    } else {
      for (let data of dataList) {
        data = data.replace(/\.in$/, '');
        if (dataList.length > 1) {
          console.log(chalk.bold(chalk.hex('#85929E')(`Test ${data}:`)));
        }
        if (run(file, data, options) || check(data, options)) {
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