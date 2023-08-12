const fs = require('fs');
const chalk = require('chalk');

module.exports = (data) => {
  try {
    if (!data) data = 'TEST';

    if (!fs.existsSync(`./${data}.ans`)) {
      process.exit(0);
    }

    const out = fs.readFileSync(`./${data}.out`).toString().replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/[ \t]+$/gm, '').replace(/\n+$/, '');
    const ans = fs.readFileSync(`./${data}.ans`).toString().replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/[ \t]+$/gm, '').replace(/\n+$/, '');

    if (out === ans) {
      console.log(chalk.green('[Accepted]'));
    } else {
      console.log(chalk.red('[Wrong Answer]'));
    }
  } catch (error) {
    console.log(chalk.gray('[Mysterious Error]'));
    process.exit(0);
  }
}