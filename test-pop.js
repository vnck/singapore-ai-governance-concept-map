const puppeteer = require('puppeteer');
const express = require('express');
(async () => {
  const app = express();
  app.use(express.static('.'));
  const server = app.listen(8082, async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    page.on('console', msg => console.log('CONSOLE:', msg.text()));
    await page.goto('http://localhost:8082', { waitUntil: 'networkidle0' });
    
    const hasError = await page.evaluate(() => {
       try {
           document.querySelector('.popover-trigger').focus();
           // Wait a bit for transition
           return new Promise(resolve => {
               setTimeout(() => resolve(document.querySelector('.popover') !== null), 200);
           });
       } catch (e) {
           return e.toString();
       }
    });
    console.log('POPOVER CREATED:', hasError);
    await browser.close();
    server.close();
    process.exit(0);
  });
})();
