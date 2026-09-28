const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto('http://localhost:8086', { waitUntil: 'networkidle0' });
  await browser.close();
  process.exit(0);
})();
