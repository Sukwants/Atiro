const fs = require('fs');
const chalk = require('chalk');

module.exports = () => {
  try {
    if (!fs.existsSync('./TEST.ans')) {
      process.exit(0);
    }

    const content1 = fs.readFileSync('TEST.out').toString().replace(/[ \t]+$/gm, '').replace(/[\r\n]+$/, '');
    const content2 = fs.readFileSync('TEST.ans').toString().replace(/[ \t]+$/gm, '').replace(/[\r\n]+$/, '');

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