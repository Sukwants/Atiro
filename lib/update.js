const { execSync } = require('child_process')
const axios = require('axios');
const semver = require('semver');
const chalk = require('chalk');
const moment = require('moment');

const config = require('./config.js');
const produced = require('./produced.js');

async function check() {              // Check new versions
  try {
    const result = await axios(`https://registry.npmjs.org/${require('../package.json').name}`);
    if (result.status != 200) throw 1;
    const latest = result.data['dist-tags'].latest;
    produced.setValue('update', 'latest_version', latest, true);
    produced.setValue('update', 'last_update_time', moment().valueOf(), true);
    return latest;
  } catch (error) {
    return 0;
  }
}

async function start() {              // Check new versions at the start
  if (moment().diff(moment(produced.getValue('update', 'last_update_time'))) <= 48 * 60 * 60 * 1000) {
    return;
  }
  if (config.getValue('update', 'type') != 'ignore') {  // Not ignore
    await check();
  }
}

async function update() {             // Manually update
  const res = await check();
  if (!res) {
    console.log(chalk.red('[Error]'), 'There is something wrong with the network.');
  } else if (!semver.gt(res, require('../package.json').version)) {
    console.log(chalk.blue('[Notice]'), 'You are already up to date!');
  } else {
    try {
      execSync('npm update -g atiro', { stdio: 'inherit' });
    } catch (error) {
      console.log(chalk.green('[Error]', 'Something went wrong when updating.'));
    }
  }
}

function query() {
  console.log(config.getValue('update', 'type'));
}

function set(val) {
  return () => { config.setValue('update', 'type', val) };
}

module.exports = {
  start: start,
  update: update,
  query: query,
  set: set
}