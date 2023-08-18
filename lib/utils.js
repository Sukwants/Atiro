const chalk = require('chalk');
const semver = require('semver');

const config = require('./config.js');
const produced = require('./produced.js');

function start() {
  config.load();
  produced.load();
}

function exit() {
  if (config.getValue('update', 'type') != 'ignore') {
    const latest = produced.getValue('update', 'latest_version');
    if (latest && semver.gt(latest, require('../package.json').version)) {
      console.log(chalk.blue('[Notice]'), `A new version ${latest} detected. Run \`${require('../package.json').name} update\` to update!`);
    }
  }
  process.exit(0);
}

module.exports = {
  start: start,
  exit: exit
}