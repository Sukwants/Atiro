const { spawnSync } = require('child_process');
const fs = require('fs');
const chalk = require('chalk');

module.exports = () => {
    try {
    const startTime = process.hrtime.bigint();

    const result = spawnSync('TEST.exe', { input: fs.existsSync('./TEST.in') ? fs.readFileSync('./TEST.in').toString() : '', timeout: 10000 });
    fs.writeFileSync('./TEST.out', result.stdout);
    fs.writeFileSync('./TEST.err', result.stderr);

    const endTime = process.hrtime.bigint();

    const runTime = Number(endTime - startTime) / 1e6;

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