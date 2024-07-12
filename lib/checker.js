const { spawnSync } = require('child_process');
const fs = require('fs');
const chalk = require('chalk');
const moment = require('moment');

const judgers = {
  'text': (out, ans, ouf, anf) => {
    out = out.split('\n');
    ans = ans.split('\n');
    if (out.length < ans.length) {
      return [false, 'Too few lines!'];
    } else if (out.length > ans.length) {
      return [false, 'Too many lines!'];
    }
    for (let i = 0; i < out.length; i++) {
      for (let j = 0; j < out[i].length || j < ans[i].length; j++) {
        if (out[i][j] != ans[i][j]) {
          return [false, `Differ on ${ouf}:${i + 1}:${j + 1} / ${anf}:${i + 1}:${j + 1}.`];
        }
      }
    }
    return [true];
  },
  'numb': (out, ans, ouf, anf) => {
    let ous = out.split('\n'),
        ant = ans.split('\n');
    out = out.split(/\s+/);
    ans = ans.split(/\s+/);
    if (out.length < ans.length) {
      return [false, 'Too few numbers!'];
    } else if (out.length > ans.length) {
      return [false, 'Too many numbers!'];
    }
    for (let i = 0; i < out.length; i++) {
      if (parseInt(out[i]) != parseInt(ans[i])) {
        let outl, outc, outcnt = -1;
        for (let j = 0; j < ous.length; j++) {
          for (let k = 0; k < ous[j].length; k++) {
            if (!/^\s$/.test(ous[j][k]) && (k == 0 || !/^\s$/.test(ous[j][k - 1])) && ++outcnt == i) {
              [outl, outc] = [j + 1, k + 1];
            }
          }
        }
        let ansl, ansc, anscnt = -1;
        for (let j = 0; j < ant.length; j++) {
          for (let k = 0; k < ant[j].length; k++) {
            if (!/^\s$/.test(ant[j][k]) && (k == 0 || !/^\s$/.test(ant[j][k - 1])) && ++anscnt == i) {
              [ansl, ansc] = [j + 1, k + 1];
            }
          }
        }
        return [false, `Differ on the ${i + 1}th number, ${ouf}:${outl}:${outc} / ${anf}:${ansl}:${ansc}.`];
      }
    }
    return [true];
  },
  'real': (out, ans, ouf, anf) => {
    let ous = out.split('\n'),
        ant = ans.split('\n');
    out = out.split(/\s+/);
    ans = ans.split(/\s+/);
    if (out.length < ans.length) {
      return [false, 'Too few numbers!'];
    } else if (out.length > ans.length) {
      return [false, 'Too many numbers!'];
    }
    for (let i = 0; i < out.length; i++) {
      if (Math.abs(parseFloat(out[i]) - parseFloat(ans[i])) / parseFloat(ans[i]) > 1e-9) {
        let outl, outc, outcnt = -1;
        for (let j = 0; j < ous.length; j++) {
          for (let k = 0; k < ous[j].length; k++) {
            if (!/^\s$/.test(ous[j][k]) && (k == 0 || !/^\s$/.test(ous[j][k - 1])) && ++outcnt == i) {
              [outl, outc] = [j + 1, k + 1];
            }
          }
        }
        let ansl, ansc, anscnt = -1;
        for (let j = 0; j < ant.length; j++) {
          for (let k = 0; k < ant[j].length; k++) {
            if (!/^\s$/.test(ant[j][k]) && (k == 0 || !/^\s$/.test(ant[j][k - 1])) && ++anscnt == i) {
              [ansl, ansc] = [j + 1, k + 1];
            }
          }
        }
        return [false, `Differ on the ${i + 1}th number, ${ouf}:${outl}:${outc} / ${anf}:${ansl}:${ansc}.`];
      }
    }
    return [true];
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

        const [result, message] = judgers[checker](out, ans, `${data}.out`, `${data}.ans`);

        if (result) {
          const currentTime = moment();
          if (currentTime.month() + 1 == 4 && currentTime.date() == 1) {
            const randomValue = Math.random();
            if (randomValue < 0.5) {
              console.log([chalk.red('[April Fool!]'), message].join(' '));
            } else {
              console.log([chalk.red('[Accepted]'), message].join(' '));
            }
          } else {
            console.log([chalk.green('[Accepted]'), message].join(' '));
          }
          return 0;
        } else {
          const currentTime = moment();
          if (currentTime.month() + 1 == 4 && currentTime.date() == 1) {
            const randomValue = Math.random();
            if (randomValue < 0.5) {
              console.log([chalk.green('[April Fool!]'), message].join(' '));
            } else {
              console.log([chalk.green('[Wrong Answer]'), message].join(' '));
            }
          } else {
            console.log([chalk.red('[Wrong Answer]'), message].join(' '));
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