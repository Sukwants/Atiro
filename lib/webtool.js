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
  const browser = await puppeteer.launch({
    executablePath: config.getValue('browser', 'path'),
    args: ['--disable-blink-features=AutomationControlled', '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36'],
    headless: 'new',
    defaultViewport: null,
    ...options });
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

function setCookies(website, cookies) {
  if (typeof cookies == 'string') {
    cookies = JSON.parse(cookies);
  }
  produced.setValue('cookies', website, cookies.map(cookie => {
    for (const key in cookie) {
      if (cookie[key] === null) {
        cookie[key] = undefined;
      }
    }
    return cookie;
  }));
}

module.exports = {
  open: open,
  close: close,
  setCookies: setCookies
}