const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  await page.screenshot({ path: 'screenshot.png' });
  const content = await page.content();
  if (content.includes('the be to of and a in that have I')) {
    console.log('Test passed: Words are visible on the page.');
  } else {
    console.error('Test failed: Words are not visible on the page.');
    process.exit(1);
  }
  await browser.close();
})();
