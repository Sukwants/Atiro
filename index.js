#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');

const compile = require('./lib/compiler.js');
const run = require('./lib/runner.js');
const judge = require('./lib/judger.js');
const config = require('./lib/config.js');

config.loadConfig();

program
  .name('atiro')
  .description('Useless OI Tools')
  .version('0.0.8');

program
  .command('judge').alias('j')
  .description('judge the answer')
  .arguments('[file] [data]')
  .option('-c, --comp <comp>', 'specify compilation options')
  .option('-t, --time <time>', 'specify time limit')
  .option('-j, --judg <judg>', 'specify judger mode')
  .action((file, data, options) => {
    file = file || config.getConfigValue('file', 'name');
    data = data || file;
    compile(file, options);
    run(file, data, options);
    judge(data, options);
  });

program
  .command('config').alias('c')
  .description('set the configurations')
  .arguments('<key>')
  .option('-g, --get', 'get the config value')
  .option('-s, --set <value>', 'set the config value')
  .option('-u, --unset', 'unset the config value')
  .action((key, options) => {
    key = key.split('.');
    let type = key[0];
    key = key[1];
    if (!type || !key || !config.checkConfigKey(type, key)) {
      console.log(chalk.red('[Error]'), `No config key ${type}.${key} found.`);
    } else {
      if (options.get) {
        console.log(`${type}.${key}: ${config.getConfigValueTruly(type, key)}`);
      } else if (options.set) {
        config.setConfigValue(type, key, options.set);
      } else if (options.unset) {
        config.unsetConfigValue(type, key);
      }
    }
  })

program.parse(process.argv);