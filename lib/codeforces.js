const chalk = require('chalk');

const browser = require('./browser.js');
const { exit } = require('./utils.js');

const name = 'Codeforces';
const site = 'https://codeforces.com';

async function login() {
  try {
    const window = await browser.open('codeforces', { headless: false });
    const page = (await window.pages())[0];

    await page.goto(`${site}/enter`);

    await page.waitForNavigation();

    const text = await page.$eval('#header > div.lang-chooser:nth-child(2) > div:last-child', element => element.textContent);

    await browser.close('codeforces', window);

    if (!text.includes('Logout')) {
      throw 1;
    }
  } catch (error) {
    console.log(chalk.red('[Error]'), 'Login failed.');
    exit();
  }
}

module.exports = (program) => {
  program
    .command('login').alias('i')
    .description(`login to ${name}`)
    .action(login);
}