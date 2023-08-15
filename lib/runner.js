const { spawnSync } = require('child_process');
const fs = require('fs');
const chalk = require('chalk');

const config = require('./config.js');

module.exports = (file, data, options) => {
  try {
    const input = fs.readFileSync(`${data}.in`).toString();

    let timeLimit = options.time || config.getConfigValue('option', 'time');
    if (isNaN(parseInt(timeLimit))) {
      console.log(chalk.yellow('[Warning]'), `Time limit of "${timeLimit}" illegal, use 5000ms as default.`);
      timeLimit = 5000;
    } else {
      timeLimit = parseInt(timeLimit);
    }

    const startTime = process.hrtime.bigint();
    const result = spawnSync(`${file}.exe`, { input: input, stdio: ['pipe', 'pipe', 'inherit'], timeout: timeLimit });
    const endTime = process.hrtime.bigint();
    const runTime = Number(endTime - startTime) / 1e6;

    fs.writeFileSync(`${data}.out`, result.stdout);
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

    if (result.status || result.error) {
      if (result.signal) {
        console.log(chalk.blue('[Time Limit Exceeded]'));
        return 3;
      } else {
        console.log(chalk.magenta('[Runtime Error]'));
        return 2;
      }
    }
  } catch (error) {
    console.log(chalk.gray('[Mysterious Error]'), 'Failed on running.');
    process.exit(0);
  }
}