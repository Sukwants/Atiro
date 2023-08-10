const fs = require('fs');
const chalk = require('chalk');

module.exports = (file) => {
  try {
    if (!file) file = 'TEST';

    if (!fs.existsSync(`./${file}.ans`)) {
      process.exit(0);
    }

    const content1 = fs.readFileSync(`./${file}.out`).toString().replace(/[ \t]+$/gm, '').replace(/[\r\n]+$/, '');
    const content2 = fs.readFileSync(`./${file}.ans`).toString().replace(/[ \t]+$/gm, '').replace(/[\r\n]+$/, '');

    if (content1 === content2) {
      console.log(chalk.green('[Accepted]'));
    } else {
      console.log(chalk.red('[Wrong Answer]'));
    }
  } catch (error) {
    console.log(chalk.gray('[Mysterious Error]'));
    process.exit(0);
  }
}