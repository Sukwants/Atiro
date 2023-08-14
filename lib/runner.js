const { spawnSync } = require('child_process');
const fs = require('fs');
const chalk = require('chalk');

const config = require('./config.js');

module.exports = (file, data, options) => {
  try {
    const input = fs.existsSync(`./${data}.in`) ? fs.readFileSync(`./${data}.in`).toString() : '';

    const startTime = process.hrtime.bigint();
    const result = spawnSync(`./${file}.exe`, { input: input, stdio: ['pipe', 'pipe', 'inherit'], timeout: isNaN(parseInt(options.time)) ? parseInt(options.time) : config.getConfigValue('options', 'time') });
    const endTime = process.hrtime.bigint();
    const runTime = Number(endTime - startTime) / 1e6;

    fs.writeFileSync(`./${data}.out`, result.stdout);
    let writeJudgInfo = (lines, color) => {
      let maxl = 0;
      for (let i = 0; i < lines.length; i++) {
        maxl = maxl > lines[i].length ? maxl : lines[i].length;
        if (!i) console.log(chalk.hex(color)('「' + lines[i]));
        else if (i == lines.length - 1) {
          let res = '';
          for (let j = 0; j < maxl - lines[i].length; j++) res = res + ' ';
          console.log(chalk.hex(color)('  ' + lines[i] + res + '」'));
        }
        else console.log(chalk.hex(color)('  ' + lines[i]));
      }
    }
    writeJudgInfo([`Return Value: ${result.status}`,
                   `Running Time: ${runTime.toFixed(0)}ms`], '#85929E');

    if (result.error) {
      if (result.signal) {
        console.log(chalk.blue('[Time Limit Exceeded]'));
      } else {
        console.log(chalk.magenta('[Runtime Error]'));
      }
      process.exit(0);
    }
  } catch (error) {
    console.log(chalk.gray('[Mysterious Error]'), 'Failed on running.');
    process.exit(0);
  }
}