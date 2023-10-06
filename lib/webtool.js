const puppeteer = require('puppeteer-core');
const chalk = require('chalk');
const { exit } = require('./utils.js');

const config = require('./config.js');
const produced = require('./produced.js');

async function open(website, options) {
  if (!config.getValue('browser', 'path')) {
    console.log(chalk.blue('[Notice]'), `Please specify the browser path first. Run \`${require('../package.json').name} config browser.path --set /path/to/browser\`!`);
    exit();
  }
  const browser = await puppeteer.launch({ executablePath: config.getValue('browser', 'path'), headless: 'new', defaultViewport: null, ...options });
  const page = (await browser.pages())[0];
  const cookies = produced.getValue('cookies', website);
  for (let cookie of cookies) {
    await page.setCookie(cookie);
  }
  return browser;
}

async function close(website, browser) {
  const pages = await browser.pages();
  for (let page of pages) {
    produced.setValue('cookies', website, await page.cookies());
  }
  await browser.close();
}

module.exports = {
  open: open,
  close: close
}