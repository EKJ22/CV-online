import http from 'http';
import { default as WebSocket } from 'ws';
import fs from 'fs';

const targets = await new Promise(res => http.get('http://localhost:9234/json', r => { let d=''; r.on('data',c=>d+=c); r.on('end',()=>res(JSON.parse(d))); }));
const ws = new WebSocket(targets[0].webSocketDebuggerUrl);
let cmdId = 1;
const pending = new Map();
ws.on('message', raw => { const m=JSON.parse(raw); if(m.id&&pending.has(m.id)){pending.get(m.id)(m.result);pending.delete(m.id);} });

ws.on('open', async () => {
  const send = (m,p={}) => new Promise(r=>{const id=cmdId++;pending.set(id,r);ws.send(JSON.stringify({id,method:m,params:p}));});

  // Inject BEFORE page scripts run: kill GSAP opacity on scroll-trigger elements
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `
    // After DOM is ready, inject a style that overrides GSAP inline opacity
    document.addEventListener('DOMContentLoaded', () => {
      const s = document.createElement('style');
      s.textContent = \`
        .about-left, .about-right, .soft-chip,
        .exp-card, .skill-item, .forma-card,
        .contact-headline, .contact-link {
          opacity: 1 !important;
          transform: none !important;
        }
      \`;
      document.head.appendChild(s);
    });
  ` });

  await send('Page.navigate', { url: 'http://localhost:5173' });
  await new Promise(r => setTimeout(r, 6000));

  // Full page screenshot
  const metrics = await send('Page.getLayoutMetrics', {});
  const { width, height } = metrics.contentSize;
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: Math.ceil(height), deviceScaleFactor: 1, mobile: false });
  const s = await send('Page.captureScreenshot', { format: 'png', clip: { x:0, y:0, width:1440, height: Math.ceil(height), scale:1 }, captureBeyondViewport: true });
  fs.writeFileSync('C:/Users/Admin/Desktop/Projet1/CV-online/screenshots/full_page.png', Buffer.from(s.data,'base64'));
  console.log(`Full page: ${Math.ceil(height)}px`);

  // Individual sections
  const shot = async (name, selector) => {
    const r = await send('Runtime.evaluate', { expression: `JSON.stringify(document.querySelector('${selector}')?.getBoundingClientRect())` });
    const rect = JSON.parse(r.result?.value || '{}');
    if (!rect.top) return;
    const scrolled = await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${rect.top}); window.scrollY` });
    await new Promise(r2 => setTimeout(r2, 600));
    await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    const sc = await send('Page.captureScreenshot', { format:'png', clip:{x:0,y:0,width:1440,height:900,scale:1} });
    fs.writeFileSync(`C:/Users/Admin/Desktop/Projet1/CV-online/screenshots/${name}.png`, Buffer.from(sc.data,'base64'));
    console.log(`✅ ${name}`);
  };

  await shot('sect_about',     '#about');
  await shot('sect_exp',       '#experience');
  await shot('sect_skills',    '#skills');
  await shot('sect_formation', '#formation');
  await shot('sect_contact',   '#contact');

  ws.close(); process.exit(0);
});
