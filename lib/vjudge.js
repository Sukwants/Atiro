const fs = require('fs');
const chalk = require('chalk');
const prompts = require('prompts');
const { exec } = require('child_process');

const webtool = require('./webtool.js');
const config = require('./config.js');
const produced = require('./produced.js');

const title = 'vjudge', key = 'vjudge';
const site = 'https://vjudge.net';

async function check(page) {
  await page.goto(site);

  const text = await page.$eval('#navbarResponsive', element => element ? element.textContent : '');

  if (!text.toLowerCase().includes('login')) return true;
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

    await page.goto(`${site}`);
    await page.click('a.nav-link.login');
    await page.waitForNavigation({ timeout: 0 });

    const text = await page.$eval('#navbarResponsive', element => element ? element.textContent : '');

    await webtool.close(key, browser);

    if (text.toLowerCase().includes('login')) {
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
  await page.goto(await page.$eval('#frame-description', node => node.src));
  const samples = await page.$$('table.vjudge_sample > tbody > tr');
  const res = [];
  for (let i = 0; i < samples.length; i++) {
    res.push({ in: await samples[i].evaluate(node => node.children[0].textContent),
              ans: await samples[i].evaluate(node => node.children[1].textContent) });
  }
  return res;
}

async function getProblem(page, contest, problem, file, data) {
  const samples = await getSamples(page, `${site}/problem/${problem}`)

  fs.writeFileSync(`${file}.cpp`, `// Atiro: vjudge ${problem}\n\n` + (fs.existsSync(`${file}.cpp`) ? fs.readFileSync(`${file}.cpp`).toString() : ''));

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

async function getContest(browser, contest) {}

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

    if (id.match(/problem\/([^\s\/?#]+)/)) {
      const res = id.match(/problem\/([^\s\/?#]+)/);
      const problem = res[1];
      await getProblem(page, undefined, problem, file, data);
    } else if (id.match(/^([^\s\/?#]+)$/)) {
      const res = id.match(/^([^\s\/?#]+)$/);
      const problem = res[1];
      await getProblem(page, undefined, problem, file, data);
    } else {
      console.log(chalk.red('[Error]'), 'No problem ID recognized.');
    }
    
    await webtool.close(key, browser);
  } catch (error) {
    console.log(chalk.red('[Error]'), 'Get failed.\nFor one possible reason, does it need permission to access?');
    if (browser) await browser.close();
  }
}

async function submitProblem(page, contest, problem, code) {
  await page.goto(`${site}/problem/${problem}`);
  await page.reload();
  await page.click('#btn-submit');
  const url = await page.url();

  const open_options = await page.$$('#submit-open > label');
  const opens = [];
  let defaultOpen;
  for (let i = 0, j = 0; i < open_options.length; i++) {
    const open = await open_options[i].evaluate(node => node.textContent.trim());
    opens.push({ title: open, value: await open_options[i].evaluate(node => node.children[0].id) });
    if (await open_options[i].evaluate(node => node.active)) {
      defaultOpen = j;
    }
    j++;
  }
  const open = (await prompts({
    type: 'select',
    name: 'open',
    message: 'Open:',
    choices: opens,
    initial: defaultOpen
  })).open;

  const lang_options = await page.$$('#submit-language > option');
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

  await page.click(`#${open}`);
  await page.select('#submit-language', lang);
  await page.$eval('#submit-solution', (node, code) => {
    node.value = code;
  }, code);
  await page.click('div.modal-footer > #btn-submit');
  await page.waitForSelector('#solutionModalLabel > a:first-child', { timeout: 5000 });

  console.log(chalk.green('[Success]'), 'Submit successfully.');

  if (process.platform == 'win32') {
    exec(`start ${await page.$eval('#solutionModalLabel > a:first-child', node => node.href)}`);
  } else if (process.platform == 'linux') {
    exec(`xdg-open ${await page.$eval('#solutionModalLabel > a:first-child', node => node.href)}`);
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
    if (code.match(/^\/\/\s*Atiro\s*:\s*vjudge\s+([^\s\/?#]+)/)) {
      const res = code.match(/^\/\/\s*Atiro\s*:\s*vjudge\s+([^\s\/?#]+)/);
      problem = res[1];
      code = code.replace(/^\/\/\s*Atiro\s*:\s*vjudge\s+([^\s\/?#]+)\s*/, '');
    }
    if (id) {
      if (id.match(/problem\/([^\s\/?#]+)/)) {
        const res = id.match(/problem\/([^\s\/?#]+)/);
        problem = res[1];
      } else if (id.match(/^([^\s\/?#]+)$/)) {
        const res = id.match(/^([^\s\/?#]+)$/);
        problem = res[1];
      }
    }
    if (!problem) {
      console.log(chalk.red('[Error]'), 'No problem ID recognized.');
      await browser.close();
      return;
    }

    await submitProblem(page, undefined, problem, code);
    
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