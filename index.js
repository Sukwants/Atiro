#!/usr/bin/env node

const { program } = require('commander');

const judger = require('./lib/judger.js');
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
  .option('-a, --allj', 'force judging all the tests')
  .action(judger);

program
  .command('config').alias('c')
  .description('set the configurations')
  .arguments('<key>')
  .option('-g, --get', 'get the config value')
  .option('-s, --set <value>', 'set the config value')
  .option('-u, --unset', 'unset the config value')
  .action(config.operateConfig)

program.parse(process.argv);