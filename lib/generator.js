const { spawnSync } = require('child_process');
const fs = require('fs');
const chalk = require('chalk');

const { exit } = require('./utils.js');

module.exports = (file, ouf, index, seed) => {
  try {
    const result = spawnSync(file, [index, seed], { stdio: ['pipe', 'pipe', 'inherit'], maxBuffer: 64 * 1024 * 1024 });
    fs.writeFileSync(ouf, result.stdout);
  } catch (error) {
    console.log(chalk.gray('[Mysterious Error]'), 'Failed on generating.');
    exit();
  }
}