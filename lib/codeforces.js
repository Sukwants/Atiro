const fs = require('fs');
const chalk = require('chalk');
const prompts = require('prompts');
const { exec } = require('child_process');

const webtool = require('./webtool.js');
const config = require('./config.js');
const produced = require('./produced.js');

const title = 'Codeforces', key = 'codeforces';
const site = 'https://codeforces.com';

async function check(page) {
  await page.goto(site);

  const text = await page.$eval('#header > div.lang-chooser', element => element ? element.textContent : '');

  if (!text.toLowerCase().includes('enter')) return true;
  else return false;
}

async function login() {
  let browser, page;
  try {
    console.log('Checking login status...');

    browser = await webtool.open(key);
    page = (await browser.pages())[0];

    const res = await check(page);
    await webtool.close(key, browser);
    if (res) {
      console.log('You have already logged in.');
      return;
    }

    console.log('Please continue in the browser...');

    browser = await webtool.open(key, { headless: false });
    page = (await browser.pages())[0];

    await page.goto(`${site}/enter`);
    while (page.url() == `${site}/enter`) {
      await page.waitForNavigation({ timeout: 0 });
    }

    const text = await page.$eval('#header > div.lang-chooser', element => element ? element.textContent : '');

    await webtool.close(key, browser);

    if (text.toLowerCase().includes('enter')) {
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
    produced.unsetValue('cookies', key);
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
    if (await samples[i].evaluate(node => node.parentElement.className.toLowerCase().includes('input'))
     && await samples[i + 1].evaluate(node => node.parentElement.className.toLowerCase().includes('output')))
      res.push({ in: await samples[i].evaluate(node => node.innerText), ans: await samples[i + 1].evaluate(node => node.innerText) });
  }
  return res;
}

async function getProblem(page, contest, problem, file, data) {
  const samples = await getSamples(page, `${site}/contest/${contest}/problem/${problem}`);

  fs.writeFileSync(`${file}.cpp`, `// Atiro: Codeforces ${contest} ${problem}\n\n` + (fs.existsSync(`${file}.cpp`) ? fs.readFileSync(`${file}.cpp`).toString() : ''));

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

    browser = await webtool.open(key);
    page = (await browser.pages())[0];

    // if (!(await check(page))) {
    //   console.log(chalk.blue('[Notice]'), 'Please login first.');
    //   await browser.close();
    //   return;
    // }

    if (id.match(/contest\/([0-9]+)\/problem\/([A-Za-z]+[0-9]*)/)) {
      const res = id.match(/contest\/([0-9]+)\/problem\/([A-Za-z]+[0-9]*)/);
      const contest = res[1], problem = res[2];
      await getProblem(page, contest, problem, file, data);
    } else if (id.match(/problemset\/problem\/([0-9]+)\/([A-Za-z]+[0-9]*)/)) {
      const res = id.match(/problemset\/problem\/([0-9]+)\/([A-Za-z]+[0-9]*)/);
      const contest = res[1], problem = res[2];
      await getProblem(page, contest, problem, file, data);
    } else if (id.match(/^([0-9]+)\s*([A-Za-z]+[0-9]*)$/)) {
      const res = id.match(/^([0-9]+)\s*([A-Za-z]+[0-9]*)$/);
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
    
    await webtool.close(key, browser);
  } catch (error) {
    console.log(chalk.red('[Error]'), 'Get failed.\nFor one possible reason, does it need permission to access?');
    if (browser) await browser.close();
  }
}

async function submitProblem(page, contest, problem, code) {
  await page.goto(`${site}/contest/${contest}/submit`);

  const lang_options = await page.$$('select[name=programTypeId] > option');
  const langs = [];
  let defaultLang;
  for (let i = 0, j = 0; i < lang_options.length; i++) {
    const lang = await lang_options[i].evaluate(node => node.textContent.trim());
    if (lang.toLowerCase().includes('c++') || lang.toLowerCase().includes('g++')) {
      langs.push({ title: lang, value: await lang_options[i].evaluate(node => node.value) });
      if (await lang_options[i].evaluate(node => node.selected)) {
        defaultLang = j;
      }
      j++;
    }
  }
  const lang = (await prompts({
    type: 'select',
    name: 'lang',
    message: 'Language:',
    choices: langs,
    initial: defaultLang
  })).lang;

  await page.select('select[name=submittedProblemIndex]', problem);
  await page.select('select[name=programTypeId]', lang);
  await page.evaluate((code) => {
    ace.edit('editor').setValue(code);
    $('#sourceCodeTextarea').val(code);
  }, code);
  await page.click('#singlePageSubmitButton');
  await page.waitForNavigation();

  if (!(await page.url()).includes('submission')) {
    throw 1;
  }

  console.log(chalk.green('[Success]'), 'Submit successfully.');

  if (process.platform == 'win32') {
    exec(`start ${await page.url()}`);
  } else if (process.platform == 'linux') {
    exec(`xdg-open ${await page.url()}`);
  } else {
    console.log(`Submission Page: ${await page.url()}`);
  }
}

async function submit(file, id) {
  let browser, page;
  try {
    file = (file || config.getValue('file', 'name')).replace(/\.cpp$/, '');

    if (!fs.existsSync(`${file}.cpp`)) {
      console.log(chalk.red('[Error]'), `No file "${file}.cpp" detected.`);
    }

    browser = await webtool.open(key);
    page = (await browser.pages())[0];

    // if (!(await check(page))) {
    //   console.log(chalk.blue('[Notice]'), 'Please login first.');
    //   await browser.close();
    //   return;
    // }

    let code = fs.readFileSync(`${file}.cpp`).toString().replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    let contest, problem;
    if (code.match(/^\/\/\s*Atiro\s*:\s*Codeforces\s+([0-9]+)\s+([A-Za-z]+[0-9]*)/)) {
      const res = code.match(/^\/\/\s*Atiro\s*:\s*Codeforces\s+([0-9]+)\s+([A-Za-z]+[0-9]*)/);
      contest = res[1], problem = res[2];
      code = code.replace(/^\/\/\s*Atiro\s*:\s*Codeforces\s+([0-9]+)\s+([A-Za-z]+[0-9]*)\s*/, '');
    }
    if (id) {
      if (id.match(/contest\/([0-9]+)\/problem\/([A-Za-z]+[0-9]*)/)) {
        const res = id.match(/contest\/([0-9]+)\/problem\/([A-Za-z]+[0-9]*)/);
        contest = res[1], problem = res[2];
      } else if (id.match(/problemset\/problem\/([0-9]+)\/([A-Za-z]+[0-9]*)/)) {
        const res = id.match(/problemset\/problem\/([0-9]+)\/([A-Za-z]+[0-9]*)/);
        contest = res[1], problem = res[2];
      } else if (id.match(/^([0-9]+)\s*([A-Za-z]+[0-9]*)$/)) {
        const res = id.match(/^([0-9]+)\s*([A-Za-z]+[0-9]*)$/);
        contest = res[1], problem = res[2];
      }
    }
    if (!contest || !problem) {
      console.log(chalk.red('[Error]'), 'No problem or contest ID recognized.');
      await browser.close();
      return;
    }

    await submitProblem(page, contest, problem, code);
    
    await webtool.close(key, browser);
  } catch (error) {
    console.log(chalk.red('[Error]'), 'Submit failed.\nFor one possible reason, please check whether you have logged in.');
    if (browser) await browser.close();
  }
}

module.exports = (program) => {
  program
    .command('login').alias('i')
    .description(`login to ${title}`)
    .action(login);
  
  program
    .command('logout').alias('o')
    .description(`logout from ${title}`)
    .action(logout);

  program
    .command('get').alias('g')
    .description(`get exactly one or a contest of problem(s) from ${title}`)
    .arguments('<id> [file] [data]')
    .action(get);

  program
    .command('submit').alias('s')
    .description(`submit code to ${title}`)
    .arguments('[file] [id]')
    .action(submit);
}