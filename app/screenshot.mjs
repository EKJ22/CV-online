import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 20000 });
await new Promise(r => setTimeout(r, 3000));
await page.screenshot({ path: 'C:/Users/Admin/Desktop/Projet1/CV-online/screenshots/cv_hero.png' });
console.log('Hero screenshot done');

// Scroll to About
await page.evaluate(() => document.getElementById('about')?.scrollIntoView());
await new Promise(r => setTimeout(r, 1500));
await page.screenshot({ path: 'C:/Users/Admin/Desktop/Projet1/CV-online/screenshots/cv_about.png' });
console.log('About screenshot done');

// Scroll to Skills
await page.evaluate(() => document.getElementById('skills')?.scrollIntoView());
await new Promise(r => setTimeout(r, 1500));
await page.screenshot({ path: 'C:/Users/Admin/Desktop/Projet1/CV-online/screenshots/cv_skills.png' });
console.log('Skills screenshot done');

// Full page
await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 2000));
await page.screenshot({ path: 'C:/Users/Admin/Desktop/Projet1/CV-online/screenshots/cv_full.png', fullPage: true });
console.log('Full page screenshot done');

await browser.close();
