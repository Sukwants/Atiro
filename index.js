#!/usr/bin/env node

const { program } = require('commander');

const utils = require('./lib/utils.js');
const judger = require('./lib/judger.js');
const config = require('./lib/config.js');
const update = require('./lib/update.js');
const codeforces = require('./lib/codeforces.js');
const atcoder = require('./lib/atcoder.js');
const luogu = require('./lib/luogu.js');
const vjudge = require('./lib/vjudge.js');
const eastereggs = require('./lib/eastereggs.js');
const download = require('./lib/download.js');
const { reset } = require('./lib/data.js');

async function main() {

  utils.start();

  await update.start();

  program
    .name(require('./package.json').name)
    .description('Useless OI Tools')
    .version(require('./package.json').version, '-v, --version');

  program.addHelpText('after', `
Turn to https://github.com/Sukwants/Atiro#readme to get more information!`);

  program
    .command('judge').alias('j')
    .description('judge the answer')
    .arguments('[file] [data]')
    .option('-c, --comp <comp>', 'specify compilation options')
    .option('-t, --time <time>', 'specify time limit')
    .option('-j, --judg <judg>', 'specify judger')
    .option('-g, --grad <grad>', 'specify grader')
    .option('-s, --solv <solv>', 'specify solver')
    .option('-m, --make <make>', 'specify maker')
    .option('-a, --allj', 'force judging all the tests')
    .action(judger);

  codeforces(program.command('codeforces').alias('cf').description('OJ tools for Codeforces'));
  atcoder(program.command('atcoder').alias('at').description('OJ tools for AtCoder'));
  luogu(program.command('luogu').alias('lg').description('OJ tools for Luogu'));
  vjudge(program.command('vjudge').alias('vj').description('OJ tools for vjudge'))

  program
    .command('download').alias('d')
    .description('download some common resources')
    .arguments('<file>')
    .action(download);

  program
    .command('config').alias('c')
    .description('set the configurations')
    .arguments('<key>')
    .option('-g, --get', 'get the config value')
    .option('-s, --set <value>', 'set the config value')
    .option('-u, --unset', 'unset the config value')
    .action(config.operate);

  const commandUpdate = program
    .command('update').alias('u')
    .description(`detect new version`)
    .action(update.update);
  commandUpdate
    .command('type').alias('t')
    .description('query the detection type now')
    .action(update.query);
  commandUpdate
    .command('notice').alias('n')
    .description('notice when there is a new version')
    .action(update.set('notice'));
  commandUpdate
    .command('ignore').alias('i')
    .description('ignore new versions')
    .action(update.set('ignore'));
  
  program
    .command('reset').alias('r')
    .description('clear all of the data')
    .action(reset);

  switch (process.argv.slice(2).join(' ').trim()) {
    case 'or orita':
      eastereggs.atiro_or_orita();
      break;
    case '😉😉😉':
      eastereggs.art_of_code();
      break;
    default:
      program.parse(process.argv);
      break;
  }

  process.on('beforeExit', () => {
    utils.exit();
  });

}

main();