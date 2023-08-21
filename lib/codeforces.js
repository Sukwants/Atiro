const fs = require('fs');
const chalk = require('chalk');

const webtool = require('./webtool.js');
const config = require('./config.js');
const produced = require('./produced.js');

const name = 'Codeforces';
const site = 'https://codeforces.com';

async function check(page) {
  await page.goto(site);

  const text = await page.$eval('#header > div.lang-chooser', element => element ? element.textContent : '');

  if (text.includes('Logout')) return true;
  else return false;
}

async function login() {
  let browser, page;
  try {
    console.log('Checking login status...');

    browser = await webtool.open('codeforces');
    page = (await browser.pages())[0];

    const res = await check(page);
    await webtool.close('codeforces', browser);
    if (res) {
      console.log('You have already logged in.');
      return;
    }

    console.log('Please continue in the browser...');

    browser = await webtool.open('codeforces', { headless: false });
    page = (await browser.pages())[0];

    await page.goto(`${site}/enter`);
    while (page.url() == `${site}/enter`) {
      await page.waitForNavigation({ timeout: 0 });
    }

    const text = await page.$eval('#header > div.lang-chooser', element => element ? element.textContent : '');

    await webtool.close('codeforces', browser);

    if (!text.includes('Logout')) {
      throw 1;
    }

    console.log(chalk.green('[Success]'), 'Login successfully.');
  } catch (error) {
    console.log(chalk.red('[Error]'), 'Login failed.');
    if (browser) await browser.close();
  }
}

async function logout() {
  try {
    produced.unsetValue('cookies', 'codeforces');
    console.log(chalk.green('[Success]'), 'Logout successfully.');
  } catch (error) {
    console.log(chalk.red('[Error]'), 'Logout failed.');
  }
}

async function getSamples(page, url) {
  await page.goto(url);
  const samples = await page.$$('div.sample-test > div > pre');
  const res = [];
  for (let i = 0; i + 1 < samples.length; i++) {
    if (await samples[i].evaluate(node => node.parentElement.className.includes('input'))
     && await samples[i + 1].evaluate(node => node.parentElement.className.includes('output')))
      res.push({ in: await samples[i].evaluate(node => node.textContent), ans: await samples[i + 1].evaluate(node => node.textContent) });
  }
  return res;
}

async function getProblem(page, contest, problem, file, data) {
  const samples = await getSamples(page, `${site}/contest/${contest}/problem/${problem}`);

  fs.writeFileSync(`${file}.cpp`, `// Atiro: ${contest} ${problem}\n\n` + (fs.existsSync(`${file}.cpp`) ? fs.readFileSync(`${file}.cpp`).toString() : ''));

  if (samples.length == 0) {
    console.log(chalk.blue('[Notice]'), 'No samples detected.');
  } else if (samples.length == 1) {
    fs.writeFileSync(`${data}.in`, samples[0].in);
    fs.writeFileSync(`${data}.ans`, samples[0].ans);
  } else if (samples.length > 1) {
    for (let i = 0; i < samples.length; i++) {
      fs.writeFileSync(`${data}${i + 1}.in`, samples[i].in);
      fs.writeFileSync(`${data}${i + 1}.ans`, samples[i].ans);
    }
  }
}

async function getContest(browser, contest) {
  const page = (await browser.pages())[0];

  await page.goto(`${site}/contest/${contest}`);
  const problems = await page.$$('table.problems > tbody > tr > td.id');

  for (let i = 0; i < problems.length; i++) {
    const problem = await problems[i].evaluate(node => node.textContent.trim());
    
    const problemPage = await browser.newPage();
    await getProblem(problemPage, contest, problem, problem, problem);
    await problemPage.close();
  }
}

async function get(id, file, data) {
  let browser, page;
  try {
    file = (file || config.getValue('file', 'name')).replace(/\.cpp$/, '');
    data = (data || file).replace(/\.in$/, '');

    browser = await webtool.open('codeforces');
    page = (await browser.pages())[0];

    if (!(await check(page))) {
      console.log(chalk.blue('[Notice]'), 'Please login first.');
      await browser.close();
      return;
    }

    if (id.match(/contest\/([0-9]+)\/problem\/([A-Za-z][A-Za-z0-9]*)/)) {
      const res = id.match(/contest\/([0-9]+)\/problem\/([A-Za-z][A-Za-z0-9]*)/);
      const contest = res[1], problem = res[2];
      await getProblem(page, contest, problem, file, data);
    } else if (id.match(/problemset\/problem\/([0-9]+)\/([A-Za-z][A-Za-z0-9]*)/)) {
      const res = id.match(/problemset\/problem\/([0-9]+)\/([A-Za-z][A-Za-z0-9]*)/);
      const contest = res[1], problem = res[2];
      await getProblem(page, contest, problem, file, data);
    } else if (id.match(/^([0-9]+)\s*([A-Za-z][A-Za-z0-9]*)$/)) {
      const res = id.match(/^([0-9]+)\s*([A-Za-z][A-Za-z0-9]*)$/);
      const contest = res[1], problem = res[2];
      await getProblem(page, contest, problem, file, data);
    } else if (id.match(/contest\/([0-9]+)/)) {
      const contest = id.match(/contest\/([0-9]+)/)[1];
      await getContest(browser, contest);
    } else if (id.match(/^([0-9]+)$/)) {
      const contest = id.match(/^([0-9]+)$/)[1];
      await getContest(browser, contest);
    } else {
      console.log(chalk.red('[Error]'), 'No problem or contest ID recognized.');
    }
    
    await webtool.close('codeforces', browser);
  } catch (error) {
    console.log(chalk.red('[Error]'), 'Get failed.');
    if (browser) await browser.close();
  }
}

async function submitProblem(page, contest, problem, code) {
  await page.goto(`${site}/contest/${contest}/submit`);

  await page.select('select[name=submittedProblemIndex]', problem);
  await page.type('#editor', code);


}

async function submit(file, id) {
  let browser, page;
  try {
    file = (file || config.getValue('file', 'name')).replace(/\.cpp$/, '');

    if (!fs.existsSync(`${file}.cpp`)) {
      console.log(chalk.red('[Error]'), `No file "${file}.cpp" detected.`);
    }

    const code = fs.readFileSync(`${file}.cpp`).toString();

    let contest, problem;
    if (code.match(/^\/\/\s*Atiro\s*:\s*([0-9]+)\s*([A-Za-z][A-Za-z0-9]*)/)) {
      const res = code.match(/^\/\/\s*Atiro\s*:\s*([0-9]+)\s*([A-Za-z][A-Za-z0-9]*)/);
      contest = res[1], problem = res[2];
      code = code.replace(/^\/\/\s*Atiro\s*:\s*([0-9]+)\s*([A-Za-z][A-Za-z0-9]*)\s*/, '');
    }
    if (id) {
      if (id.match(/contest\/([0-9]+)\/problem\/([A-Za-z][A-Za-z0-9]*)/)) {
        const res = id.match(/contest\/([0-9]+)\/problem\/([A-Za-z][A-Za-z0-9]*)/);
        contest = res[1], problem = res[2];
      } else if (id.match(/problemset\/problem\/([0-9]+)\/([A-Za-z][A-Za-z0-9]*)/)) {
        const res = id.match(/problemset\/problem\/([0-9]+)\/([A-Za-z][A-Za-z0-9]*)/);
        contest = res[1], problem = res[2];
      } else if (id.match(/^([0-9]+)\s*([A-Za-z][A-Za-z0-9]*)$/)) {
        const res = id.match(/^([0-9]+)\s*([A-Za-z][A-Za-z0-9]*)$/);
        contest = res[1], problem = res[2];
      }
    }
    if (!contest || !problem) {
      console.log(chalk.red('[Error]'), 'No problem or contest ID recognized.');
      return;
    }

    browser = await webtool.open('codeforces', { headless: false });
    page = (await browser.pages())[0];

    if (!(await check(page))) {
      console.log(chalk.blue('[Notice]'), 'Please login first.');
      await browser.close();
      return;
    }

    await submitProblem(page, contest, problem, code);
    
    await webtool.close('codeforces', browser);
  } catch (error) {
    console.log(chalk.red('[Error]'), 'Submit failed.');
    if (browser) await browser.close();
  }
}

module.exports = (program) => {
  program
    .command('login').alias('i')
    .description(`login to ${name}`)
    .action(login);
  
  program
    .command('logout').alias('o')
    .description(`logout from ${name}`)
    .action(logout);

  program
    .command('get').alias('g')
    .description(`get exactly one or a contest of problem(s) from ${name}`)
    .arguments('<id> [file] [data]')
    .action(get);

  program
    .command('submit').alias('s')
    .description(`submit code to ${name}`)
    .arguments('[file] [id]')
    .action(submit);
}