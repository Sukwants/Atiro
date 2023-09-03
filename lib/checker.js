const { spawnSync } = require('child_process');
const fs = require('fs');
const chalk = require('chalk');
const moment = require('moment');

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

module.exports =  {
  checkers: judgers,
  check: (data, checker) => {
    try {
      if (!fs.existsSync(`${data}.ans`)) {          // no .ans file, exit
        return 0;
      }

      if (judgers[checker]) {                       // use builtin checker
        const out = fs.readFileSync(`${data}.out`).toString().replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/[ \t]+$/gm, '').replace(/\n+$/, '');
        const ans = fs.readFileSync(`${data}.ans`).toString().replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/[ \t]+$/gm, '').replace(/\n+$/, '');

        if (judgers[checker](out, ans)) {
          const currentTime = moment();
          if (currentTime.month() + 1 == 4 && currentTime.date() == 1) {
            const randomValue = Math.random();
            if (randomValue < 0.5) {
              console.log(chalk.red('[April Fool!]'))
            } else {
              console.log(chalk.red('[Accepted]'))
            }
          } else {
            console.log(chalk.green('[Accepted]'));
          }
          return 0;
        } else {
          const currentTime = moment();
          if (currentTime.month() + 1 == 4 && currentTime.date() == 1) {
            const randomValue = Math.random();
            if (randomValue < 0.5) {
              console.log(chalk.green('[April Fool!]'))
            } else {
              console.log(chalk.green('[Wrong Answer]'));
            }
          } else {
            console.log(chalk.red('[Wrong Answer]'));
          }
          return 1;
        }
      } else {                                      // use written checker
        return spawnSync(checker, [`${data}.in`, `${data}.out`, `${data}.ans`], { stdio: 'inherit' }).status;
      }
    } catch (error) {
      console.log(chalk.gray('[Mysterious Error]'), 'Failed on judging.');
      return 1;
    }
  }
};