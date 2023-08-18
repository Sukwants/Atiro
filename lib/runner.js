const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const chalk = require('chalk');

const config = require('./config.js');
const { exit } = require('./utils.js');

function writeJudgInfo(content, color) {            // add '「' at the very beginning and '」' at the very ending 
  const lines = content.split('\n');
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

  return 0;
}

module.exports = async (file, inf, ouf, interactor, timeLimit) => {
  try {
    if (!interactor) {                                                         // traditional runner
      const input = fs.readFileSync(inf).toString();

      const startTime = process.hrtime.bigint();
      const result = spawnSync(file, { input: input, stdio: ['pipe', 'pipe', 'inherit'], timeout: timeLimit });
      const endTime = process.hrtime.bigint();
      const runTime = Number(endTime - startTime) / 1e6;
      
      writeJudgInfo(`Return Value: ${result.status}\nRunning Time: ${runTime.toFixed(0)}ms`, '#708090');

      if (result.time > timeLimit) {
        console.log(chalk.blue('[Time Limit Exceeded]'));
        return 1;
      } else if (result.status != 0) {
        console.log(chalk.magenta('[Runtime Error]'));
        return 1;
      } else {
        fs.writeFileSync(ouf, result.stdout);
        return 0;
      }

    } else {                                                                   // interaction
      const startTime = process.hrtime.bigint();
      const answer = spawn(file, { stdio: ['pipe', 'pipe', 'inherit'], timeout: timeLimit });
      const grader = spawn(interactor, [inf, ouf], { stdio: ['pipe', 'pipe', 'inherit'] });

      answer.stdout.pipe(grader.stdin);                                        // connect input and output
      grader.stdout.pipe(answer.stdin);
      grader.stdin.write('\n');

      const res = await Promise.all([                                          // wait for program running
        new Promise((resolve, reject) => {
          answer.on('close', (code, signal) => {
            resolve({
              value: code,
              signal: signal,
              time: Number(process.hrtime.bigint() - startTime) / 1e6
            });
          });
        }),
        new Promise((resolve, reject) => {
          grader.on('close', (code, signal) => {
            resolve({
              value: code,
              signal: signal,
              time: Number(process.hrtime.bigint() - startTime) / 1e6
            });
          });
        })]);

      writeJudgInfo(`Return Value: ${res[0].value}\nRunning Time: ${res[0].time.toFixed(0)}ms`, '#708090');

      if (res[0].time > timeLimit) {
        console.log(chalk.blue('[Time Limit Exceeded]'));
        return 1;
      } else if (res[0].value != 0) {
        console.log(chalk.magenta('[Runtime Error]'));
        return 1;
      } else {
        return res[1].value != 0;
      }
      
    }
  } catch (error) {
    console.log(chalk.gray('[Mysterious Error]'), 'Failed on running.');
    exit();
  }
}