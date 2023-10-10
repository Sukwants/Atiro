const axios = require('axios');
const semver = require('semver');
const chalk = require('chalk');
const moment = require('moment');

const config = require('./config.js');
const produced = require('./produced.js');
const { exit } = require('./utils.js');

async function check() {              // Check new versions
  try {
    const result = await axios('https://api.github.com/repos/Sukwants/Atiro/releases/latest', { timeout: 3000 });
    if (result.status != 200) throw 1;
    const latest = result.data.tag_name;
    produced.setValue('update', 'latest_version', latest, true);
    produced.setValue('update', 'last_update_time', moment().valueOf(), true);
    return latest;
  } catch (error) {
    produced.setValue('update', 'last_update_time', moment().subtract(36, "hours").valueOf(), true);
    return 0;
  }
}

async function start() {              // Check new versions at the start
  if (moment().diff(moment(produced.getValue('update', 'last_update_time'))) > 48 * 60 * 60 * 1000
   && config.getValue('update', 'type') == 'notice') {  // Notice
    await check();
  }
}

async function update() {             // Manually update
  const res = await check();
  if (!res) {
    console.log(chalk.red('[Error]'), 'There is something wrong with the network.');
    exit({ noticeNewVersion: false });
  }
  if (!semver.gt(res, require('../package.json').version)) {
    console.log(chalk.blue('[Notice]'), 'You are already up to date!');
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
