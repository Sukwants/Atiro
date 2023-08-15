const fs = require('fs');
const chalk = require('chalk');

const config = require('./config.js');

const judgers = {
  'text': (out, ans) => {
    if (out === ans) {
      return true;
    } else {
      return false;
    }
  },
  'numb': (out, ans) => {
    out = out.split(/\s+/);
    ans = ans.split(/\s+/);
    if (out.length != ans.length) {
      return false;
    }
    for (let i = 0; i < out.length; i++) {
      if (parseInt(out[i]) != parseInt(ans[i])) {
        return false;
      }
    }
    return true;
  },
  'real': (out, ans) => {
    out = out.split(/\s+/);
    ans = ans.split(/\s+/);
    if (out.length != ans.length) {
      return false;
    }
    for (let i = 0; i < out.length; i++) {
      if (Math.abs(parseFloat(out[i]) - parseFloat(ans[i])) / parseFloat(ans[i]) > 1e-9) {
        return false;
      }
    }
    return true;
  }
};

module.exports = (data, options) => {
  try {
    if (!fs.existsSync(`${data}.ans`)) {
      return 0;
    }

    const out = fs.readFileSync(`${data}.out`).toString().replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/[ \t]+$/gm, '').replace(/\n+$/, '');
    const ans = fs.readFileSync(`${data}.ans`).toString().replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/[ \t]+$/gm, '').replace(/\n+$/, '');

    let checker = options.judg || config.getConfigValue('option', 'judg');
    if (!judgers[checker]) {
      console.log(chalk.yellow('[Warning]'), `No judger "${options.judg}" found, use "text" as default.`);
      checker = 'text';
    }

    if (judgers[checker](out, ans)) {
      console.log(chalk.green('[Accepted]'));
      return 0;
    } else {
      console.log(chalk.red('[Wrong Answer]'));
      return 1;
    }
  } catch (error) {
    console.log(chalk.gray('[Mysterious Error]'), 'Failed on judging.');
    process.exit(0);
  }
}