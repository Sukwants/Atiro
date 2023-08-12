const { spawnSync } = require('child_process');
const fs = require('fs');
const chalk = require('chalk');

module.exports = (file) => {
  try {
    if (!file) file = 'TEST';

    const input = fs.existsSync(`./${file}.in`) ? fs.readFileSync(`./${file}.in`).toString() : '';

    const startTime = process.hrtime.bigint();
    const result = spawnSync(`./${file}.exe`, { input: input, timeout: 10000 });
    const endTime = process.hrtime.bigint();
    const runTime = Number(endTime - startTime) / 1e6;

    fs.writeFileSync(`./${file}.out`, result.stdout);
    console.log(result.stderr.toString());
    console.log('----------------------------------------')
    console.log(`Return Value: ${result.status}`);
    console.log(`Running Time: ${runTime.toFixed(0)}ms`);

    if (result.error) {
      if (result.signal) {
        console.log(chalk.blue('[Time Limit Exceeded]'));
      } else {
        console.log(chalk.magenta('[Runtime Error]'));
      }
      process.exit(0);
    }
  } catch (error) {
    console.log(chalk.gray('[Mysterious Error]'));
    process.exit(0);
  }
}