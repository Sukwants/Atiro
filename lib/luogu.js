const fs = require('fs');
const chalk = require('chalk');
const prompts = require('prompts');
const { exec } = require('child_process');

const webtool = require('./webtool.js');
const config = require('./config.js');
const produced = require('./produced.js');
const { exit } = require('./utils.js');

const title = 'Luogu', key = 'luogu';
const site = 'https://www.luogu.com.cn';

async function check(page) {
  await page.goto(site);

  const text = await page.$eval('nav.user-nav', element => element ? element.textContent : '');

  if (!text.toLowerCase().includes('登录')) return true;
  else return false;
}

async function login(options) {
  let browser, page;
  try {
    
    if (options.cookies != undefined) {
      let file = options.cookies;
      if (file != true) {
        fs.readFile(file, (cookies) => {
          produced.setValue('cookies', key, JSON.parse(cookies).map(cookie => {
            for (const key in cookie) {
              if (!cookie[key]) {
                cookie[key] = undefined;
              }
            }
            return cookie;
          }));
          console.log(chalk.green('[Success]'), 'Set cookies successfully.');
        });
      }
      else {
        console.log('enter cookies:');
        let cookies = "";
        process.stdin.on('data', (data) => {
          cookies += data;
          try {
            produced.setValue('cookies', key, JSON.parse(cookies).map(cookie => {
              for (const key in cookie) {
                if (!cookie[key]) {
                  cookie[key] = undefined;
                }
              }
              return cookie;
            }));
            process.stdin.pause();
            console.log(chalk.green('[Success]'), 'Set cookies successfully.');
          }
          catch (error) { }
        });
      }
      return;
    }
    
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

    await page.goto(`${site}/auth/login`);
    while (page.url().includes('/auth/login')) {
      await page.waitForNavigation({ timeout: 0 });
    }
    while (page.url().includes('/auth/unlock')) {
      await page.waitForNavigation({ timeout: 0 });
    }

    const text = await page.$eval('nav.user-nav', element => element ? element.textContent : '');

    await webtool.close(key, browser);

    if (text.toLowerCase().includes('登录')) {
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
  const samples = await page.$$('div.sample');
  const res = [];
  for (let i = 0; i < samples.length; i++) {
    res.push({ in: await samples[i].evaluate(node => node.getElementsByClassName('input')[0].getElementsByTagName('pre')[0].innerText),
              ans: await samples[i].evaluate(node => node.getElementsByClassName('output')[0].getElementsByTagName('pre')[0].innerText) });
  }
  return res;
}

async function getProblem(page, contest, problem, file, data) {
  const samples = await getSamples(page, `${site}/problem/${problem}${contest ? `?contestId=${contest}` : ''}`);

  fs.writeFileSync(`${file}.cpp`, `// Atiro: Luogu ${problem}${contest ? ` ${contest}` : ''}\n\n` + (fs.existsSync(`${file}.cpp`) ? fs.readFileSync(`${file}.cpp`).toString() : ''));

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

  await page.goto(`${site}/contest/${contest}#problems`);
  const problems = await page.$$('div.row-wrap > div.row > div.part');

  for (let i = 0; i < problems.length; i++) {
    const pid_contest = await problems[i].evaluate(node => node.getElementsByClassName('pid')[0].textContent.trim());
    const pid_global = (await problems[i].evaluate(node => node.getElementsByClassName('title color-default')[0].href)).match(/problem\/([A-Za-z]+[0-9_][A-Za-z0-9_]*)/)[1];

    const problemPage = await browser.newPage();
    await getProblem(problemPage, contest, pid_global, pid_contest, pid_contest);
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

    if (id.match(/problem\/([A-Za-z]+[0-9_][A-Za-z0-9_]*)?.*contestId=([0-9]+)/)) {
      const res = id.match(/problem\/([A-Za-z]+[0-9_][A-Za-z0-9_]*)?.*contestId=([0-9]+)/);
      const contest = res[2], problem = res[1];
      await getProblem(page, contest, problem, file, data);
    } else if (id.match(/problem\/([A-Za-z]+[0-9_][A-Za-z0-9_]*)/)) {
      const res = id.match(/problem\/([A-Za-z]+[0-9_][A-Za-z0-9_]*)/);
      const problem = res[1];
      await getProblem(page, undefined, problem, file, data);
    } else if (id.match(/^([A-Za-z]+[0-9_][A-Za-z0-9_]*)\s+([0-9]+)$/)) {
      const res = id.match(/^([A-Za-z]+[0-9_][A-Za-z0-9_]*)\s+([0-9]+)$/);
      const contest = res[2], problem = res[1];
      await getProblem(page, contest, problem, file, data);
    } else if (id.match(/^([A-Za-z]+[0-9_][A-Za-z0-9_]*)$/)) {
      const res = id.match(/^([A-Za-z]+[0-9_][A-Za-z0-9_]*)$/);
      const problem = res[1];
      await getProblem(page, undefined, problem, file, data);
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
  await page.goto(`${site}/problem/${problem}${contest ? `?contestId=${contest}` : ''}#submit`);

  const lang_options = await page.$$('div.lang-select > div.dropdown-wrap > div.dropdown > ul > li');
  const langs = [];
  let defaultLang, defaultLangTitle = await page.$eval('div.lang-select > div.text', node => node.textContent.trim());
  for (let i = 0, j = 0; i < lang_options.length; i++) {
    const lang = await lang_options[i].evaluate(node => node.textContent.trim());
    if (lang.toLowerCase().includes('c++') || lang.toLowerCase().includes('g++')) {
      langs.push({ title: lang, value: i + 1 });
      if (lang == defaultLangTitle) {
        defaultLang = j;
      }
      j++;
    }
  }
  if (!langs.length) {
    throw 1;
  }
  const lang = (await prompts({
    type: 'select',
    name: 'lang',
    message: 'Language:',
    choices: langs,
    initial: defaultLang
  })).lang;

  await page.$eval(`div.dropdown > ul > li:nth-child(${lang})`, node => node.click());
  await page.$eval('div.editor.ace_editor', (node, code) => {
    ace.edit(node).setValue(code);
  }, code);
  const buttons = await page.$$('button');
  for (let i = 0; i < buttons.length; i++) {
    if ((await buttons[i].evaluate(node => node.textContent)).includes('提交')) {
      await page.waitForFunction((node) => {
        return !node.disabled;
      }, { timeout: 5000 }, buttons[i]);
      await buttons[i].evaluate(node => node.click());

      setTimeout(() => {
        console.log(chalk.blue('[Notice]'), 'If you are waiting too long, manually check if it has been already submitted.')
      }, 5000);

      await page.waitForNavigation();
      break;
    }
  }

  if (!page.url().includes('/record')) {
    throw 1;
  }

  console.log(chalk.green('[Success]'), 'Submit successfully.');

  if (process.platform == 'win32') {
    exec(`start ${page.url()}`);
  } else if (process.platform == 'linux') {
    exec(`xdg-open ${page.url()}`);
  } else {
    console.log(`Submission Page: ${page.url()}`);
  }
}

async function submit(file, id) {
  let browser, page;
  try {
    file = (file || config.getValue('file', 'name')).replace(/\.cpp$/, '');

    if (!fs.existsSync(`${file}.cpp`)) {
      console.log(chalk.red('[Error]'), `No file "${file}.cpp" detected.`);
      return;
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
    if (code.match(/^\/\/\s*Atiro\s*:\s*Luogu\s+([A-Za-z]+[0-9_][A-Za-z0-9_]*)\s+([0-9]+)/)) {
      const res = code.match(/^\/\/\s*Atiro\s*:\s*Luogu\s+([A-Za-z]+[0-9_][A-Za-z0-9_]*)\s+([0-9]+)/);
      contest = res[2], problem = res[1];
      code = code.replace(/^\/\/\s*Atiro\s*:\s*Luogu\s+([A-Za-z]+[0-9_][A-Za-z0-9_]*)\s+([0-9]+)\s*/, '');
    } else if (code.match(/^\/\/\s*Atiro\s*:\s*Luogu\s+([A-Za-z]+[0-9_][A-Za-z0-9_]*)/)) {
      const res = code.match(/^\/\/\s*Atiro\s*:\s*Luogu\s+([A-Za-z]+[0-9_][A-Za-z0-9_]*)/);
      problem = res[1];
      code = code.replace(/^\/\/\s*Atiro\s*:\s*Luogu\s+([A-Za-z]+[0-9_][A-Za-z0-9_]*)\s*/, '');
    }
    if (id) {
      if (id.match(/problem\/([A-Za-z]+[0-9_][A-Za-z0-9_]*)?.*contestId=([0-9]+)/)) {
        const res = id.match(/problem\/([A-Za-z]+[0-9_][A-Za-z0-9_]*)?.*contestId=([0-9]+)/);
        contest = res[2], problem = res[1];
      } else if (id.match(/problem\/([A-Za-z]+[0-9_][A-Za-z0-9_]*)/)) {
        const res = id.match(/problem\/([A-Za-z]+[0-9_][A-Za-z0-9_]*)/);
        problem = res[1];
      } else if (id.match(/^([A-Za-z]+[0-9_][A-Za-z0-9_]*)\s+([0-9]+)$/)) {
        const res = id.match(/^([A-Za-z]+[0-9_][A-Za-z0-9_]*)\s+([0-9]+)$/);
        contest = res[2], problem = res[1];
      } else if (id.match(/^([A-Za-z]+[0-9_][A-Za-z0-9_]*)$/)) {
        const res = id.match(/^([A-Za-z]+[0-9_][A-Za-z0-9_]*)$/);
        problem = res[1];
      } else {
        console.log(chalk.red('[Error]'), 'No problem ID recognized.');
      }
    }
    if (!problem) {
      console.log(chalk.red('[Error]'), 'No problem ID recognized.');
      await browser.close();
      return;
    }

    await submitProblem(page, contest, problem, code);
    
    await webtool.close(key, browser);
  } catch (error) {
    console.log(chalk.red('[Error]'), 'Submit failed.\nFor one possible reason, please check whether you have logged in.');
    if (browser) await browser.close();
  } finally {
    exit();
  }
}

module.exports = (program) => {
  program
    .command('login').alias('i')
    .description(`login to ${title}`)
    .option('-c, --cookies [file]', 'set cookies')
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