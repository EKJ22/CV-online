const { execSync } = require('child_process');

// Install puppeteer if needed
try { require('puppeteer'); } catch(e) {
  execSync('npm install puppeteer --save-dev', { stdio: 'inherit', cwd: 'C:\\Users\\Admin\\Desktop\\Projet1\\CV-online\\app' });
}

const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 15000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'C:\\Users\\Admin\\Desktop\\Projet1\\CV-online\\screenshots\\cv_render.png', fullPage: false });
  console.log('Screenshot taken');
  await browser.close();
})().catch(e => console.error(e));
