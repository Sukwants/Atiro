const puppeteer = require('puppeteer');

const produced = require('./produced.js');

async function open(website, options) {
  const browser = await puppeteer.launch({ headless: 'new', defaultViewport: null, ...options });
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