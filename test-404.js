const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('request', req => {
    // some browsers request favicon.ico
  });
  
  await page.goto('http://localhost:8089', { waitUntil: 'networkidle0' });
  await browser.close();
  process.exit(0);
})();
