import http from 'http';
import { default as WebSocket } from 'ws';
import fs from 'fs';

const targets = await new Promise(res => http.get('http://localhost:9231/json', r => { let d=''; r.on('data',c=>d+=c); r.on('end',()=>res(JSON.parse(d))); }));
const ws = new WebSocket(targets[0].webSocketDebuggerUrl);
let cmdId = 1;
const pending = new Map();
ws.on('message', raw => { const m=JSON.parse(raw); if(m.id&&pending.has(m.id)){pending.get(m.id)(m.result);pending.delete(m.id);} });

ws.on('open', async () => {
  const send = (m,p={}) => new Promise(r=>{const id=cmdId++;pending.set(id,r);ws.send(JSON.stringify({id,method:m,params:p}));});
  const shot = async (name) => {
    const s = await send('Page.captureScreenshot', { format:'png', clip:{x:0,y:0,width:1440,height:900,scale:1} });
    fs.writeFileSync(`C:/Users/Admin/Desktop/Projet1/CV-online/screenshots/${name}.png`, Buffer.from(s.data,'base64'));
    console.log(`✅ ${name}`);
  };

  await send('Page.navigate', { url: 'http://localhost:5173' });
  await new Promise(r => setTimeout(r, 5000));

  // Force all GSAP-hidden elements visible
  await send('Runtime.evaluate', { expression: `
    document.querySelectorAll('*').forEach(el => {
      const s = el.style;
      if (s.opacity === '0' || s.opacity === 0) s.opacity = '1';
      if (s.transform && s.transform.includes('translateY')) s.transform = '';
      if (s.transform && s.transform.includes('translateX')) s.transform = '';
    });
    'ok'
  ` });
  await new Promise(r => setTimeout(r, 400));

  const scroll = async (sel) => {
    await send('Runtime.evaluate', { expression: `document.querySelector('${sel}')?.scrollIntoView({behavior:'instant'})` });
    await new Promise(r => setTimeout(r, 600));
  };

  await scroll('#about');    await shot('forced_about');
  await scroll('#experience'); await shot('forced_exp');
  await scroll('#skills');   await shot('forced_skills');
  await scroll('#formation'); await shot('forced_forma');
  await scroll('#contact');  await shot('forced_contact');

  ws.close(); process.exit(0);
});
