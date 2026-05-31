import http from 'http';
import { default as WebSocket } from 'ws';
import fs from 'fs';

const targets = await new Promise(res => http.get('http://localhost:9228/json', r => { let d=''; r.on('data',c=>d+=c); r.on('end',()=>res(JSON.parse(d))); }));
const ws = new WebSocket(targets[0].webSocketDebuggerUrl);
let cmdId = 1;
const pending = new Map();

ws.on('message', raw => {
  const msg = JSON.parse(raw);
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg.result); pending.delete(msg.id); }
});

ws.on('open', async () => {
  const send = (m, p = {}) => new Promise(r => { const id = cmdId++; pending.set(id, r); ws.send(JSON.stringify({id,method:m,params:p})); });
  await send('Runtime.enable');
  await send('Page.navigate', { url: 'http://localhost:5173' });
  await new Promise(r => setTimeout(r, 5000));

  // Force all GSAP animations to complete + remove opacity:0 for screenshot
  await send('Runtime.evaluate', { expression: `
    // Kill all GSAP tweens and set final state
    gsap.globalTimeline.progress(1, false);
    // Also force all elements visible
    document.querySelectorAll('[style*="opacity: 0"]').forEach(el => el.style.opacity = '1');
    document.querySelectorAll('[style*="opacity:0"]').forEach(el => el.style.opacity = '1');
    'done'
  ` });
  await new Promise(r => setTimeout(r, 500));

  // Scroll to About
  await send('Runtime.evaluate', { expression: "document.getElementById('about').scrollIntoView({behavior:'instant'})" });
  await new Promise(r => setTimeout(r, 800));
  let shot = await send('Page.captureScreenshot', { format: 'png', clip: { x:0, y:0, width:1440, height:900, scale:1 } });
  fs.writeFileSync('C:/Users/Admin/Desktop/Projet1/CV-online/screenshots/about_forced.png', Buffer.from(shot.data, 'base64'));

  // Skills  
  await send('Runtime.evaluate', { expression: "document.getElementById('skills').scrollIntoView({behavior:'instant'})" });
  await new Promise(r => setTimeout(r, 800));
  shot = await send('Page.captureScreenshot', { format: 'png', clip: { x:0, y:0, width:1440, height:900, scale:1 } });
  fs.writeFileSync('C:/Users/Admin/Desktop/Projet1/CV-online/screenshots/skills_forced.png', Buffer.from(shot.data, 'base64'));

  // Contact
  await send('Runtime.evaluate', { expression: "document.getElementById('contact').scrollIntoView({behavior:'instant'})" });
  await new Promise(r => setTimeout(r, 800));
  shot = await send('Page.captureScreenshot', { format: 'png', clip: { x:0, y:0, width:1440, height:900, scale:1 } });
  fs.writeFileSync('C:/Users/Admin/Desktop/Projet1/CV-online/screenshots/contact_forced.png', Buffer.from(shot.data, 'base64'));

  console.log('All forced screenshots saved');
  ws.close();
  process.exit(0);
});
