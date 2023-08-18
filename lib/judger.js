const { globSync } = require('glob');
const path = require('path');
const chalk = require('chalk');

const { exit } = require('./utils.js');
const config = require('./config.js');
const compile = require('./compiler.js');
const generate = require('./generator.js');
const run = require('./runner.js');
const { checkers, check } = require('./checker.js');

function generateRandomString(length) {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomString = '';

  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
  }

  return randomString;
}

async function judge(file, data, solver, interactor, checker, timeLimit, allj) {
  if ((solver && await run(solver, `${data}.in`, `${data}.ans`, interactor, timeLimit * 10))
    || await run(file, `${data}.in`, `${data}.out`, interactor, timeLimit)
    || check(data, checker)) {
    if (!allj) {
      exit();
    }
  }
}

async function judger(file, data, options) {
  try {
    file = file || config.getValue('file', 'name');                     // process answer file path (1/2)
    file = file.replace(/\.cpp$/, '');
    
    compile(file, options, 'Answer');                                   // compile answer

    let checker = options.judg != undefined ? options.judg : config.getValue('option', 'judg');    // process checker file path
    if (checker && !checkers[checker]) {
      checker = checker.replace(/\.cpp$/, '');
      compile(checker, options, 'Checker');
      if (!path.isAbsolute(checker) && !checker.startsWith('./')) {
        checker = './' + checker;
      }
    }

    let interactor = options.grad != undefined ? options.grad : config.getValue('option', 'grad'); // process interactor file path
    if (interactor) {
      interactor = interactor.replace(/\.cpp$/, '');
      compile(interactor, options, 'Interactor');
      if (!path.isAbsolute(interactor) && !interactor.startsWith('./')) {
        interactor = './' + interactor;
      }
    }

    let solver = options.solv != undefined ? options.solv : config.getValue('option', 'solv');     // process solver file path
    if (solver) {
      solver = solver.replace(/\.cpp$/, '');
      compile(solver, options, 'Solver');
      if (!path.isAbsolute(solver) && !solver.startsWith('./')) {
        solver = './' + solver;
      }
    }

    let generator = options.make != undefined ? options.make : config.getValue('option', 'make');  // process generator file path
    if (generator) {
      generator = generator.replace(/\.cpp$/, '');
      compile(generator, options, 'Generator');
      if (!path.isAbsolute(generator) && !generator.startsWith('./')) {
        generator = './' + generator;
      }
    }
          
    let timeLimit = options.time || config.getValue('option', 'time');   // process time limit
    if (isNaN(parseInt(timeLimit))) {
      console.log(chalk.yellow('[Warning]'), `Time limit of "${timeLimit}" illegal, use 5000ms as default.`);
      timeLimit = 5000;
    } else {
      timeLimit = parseInt(timeLimit);
    }

    if (!generator) {

      data = (data || (file + '*')).replace(/\\/g, '/');                        // search for data
      if (!data.endsWith('.in')) {
        data = data + '.in';
      }
      let dataList = globSync(data);
  
      if (dataList.length == 0) {
        console.log(chalk.blue('[Notice]'), 'No tests detected.');
      } else {
        
        if (!path.isAbsolute(file) && !file.startsWith('./')) {                 // process answer file path (2/2)
          file = './' + file;
        }
        for (let i = 0; i < dataList.length; i++) {                             // erase .in suffix and sort
          dataList[i] = dataList[i].replace(/\.in$/, '');
        }
        dataList.sort();
  
        for (let data of dataList) {
          if (dataList.length > 1) {
            console.log(chalk.bold(chalk.hex('#708090')(`Test ${data}:`)));
          }
          await judge(file, data, solver, interactor, checker, timeLimit, options.allj);
        }
      }

    } else {
      
      data = (data || file).replace(/\.in$/, '');
      for (let i = 1; true; i++) {
        const seed = generateRandomString(10);
        console.log(chalk.bold(chalk.hex('#708090')(`Test #${i} (${seed}):`)));
        generate(generator, `${data}.in`, i, seed);
        console.log(chalk.hex('#708090')('Generated.'));
        await judge(file, data, solver, interactor, checker, timeLimit, options.allj);
      }
    }

  } catch (error) {
    console.log(chalk.gray('[Mysterious Error]'), 'Failed on judging.');
    exit();
  }
}

module.exports = judger;