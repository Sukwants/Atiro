#!/usr/bin/env node

const { program } = require('commander');

const utils = require('./lib/utils.js');
const judger = require('./lib/judger.js');
const config = require('./lib/config.js');
const update = require('./lib/update.js');

async function main() {
  config.loadConfig();
  
  await update.start();
  
  program
    .name(require('./package.json').name)
    .description('Useless OI Tools')
    .version(require('./package.json').version);
  
  program
    .command('config').alias('c')
    .description('set the configurations')
    .arguments('<key>')
    .option('-g, --get', 'get the config value')
    .option('-s, --set <value>', 'set the config value')
    .option('-u, --unset', 'unset the config value')
    .action(config.operateConfig);
  
  program
    .command('judge').alias('j')
    .description('judge the answer')
    .arguments('[file] [data]')
    .option('-c, --comp <comp>', 'specify compilation options')
    .option('-t, --time <time>', 'specify time limit')
    .option('-j, --judg <judg>', 'specify judger')
    .option('-g, --grad <grad>', 'specify grader')
    .option('-a, --allj', 'force judging all the tests')
    .action(judger);
  
  const commandUpdate = program
    .command('update').alias('u')
    .description(`update ${require('./package.json').name}`)
    .action(update.update);
  commandUpdate
    .command('type').alias('t')
    .description('query the update type now')
    .action(update.query);
  commandUpdate
    .command('notice').alias('n')
    .description('notice when there is a new version')
    .action(update.set('notice'));
  commandUpdate
    .command('auto').alias('a')
    .description('auto update to the new version')
    .action(update.set('auto'));
  commandUpdate
    .command('ignore').alias('i')
    .description('ignore new versions')
    .action(update.set('ignore'));
  
  program.parse(process.argv);

  utils.exit();
}

main();