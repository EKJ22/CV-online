import http from 'http';
import { default as WebSocket } from 'ws';
import fs from 'fs';

const targets = await new Promise(res => http.get('http://localhost:9232/json', r => { let d=''; r.on('data',c=>d+=c); r.on('end',()=>res(JSON.parse(d))); }));
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

  // Inject CSS override — force everything visible
  await send('DOM.enable', {});
  await send('CSS.enable', {});
  await send('CSS.addRule', { styleSheetId: await send('CSS.createStyleSheet', { frameId: (await send('Page.getFrameTree',{})).frameTree.frame.id }).then(r=>r.styleSheetId), ruleText: '* { opacity: 1 !important; transform: none !important; }' }).catch(() => {});
  
  // Fallback: use Runtime.evaluate to inject style tag
  await send('Runtime.evaluate', { expression: `
    const style = document.createElement('style');
    style.textContent = '* { opacity: 1 !important; transform: none !important; }';
    document.head.appendChild(style);
    'done'
  ` });
  await new Promise(r => setTimeout(r, 800));

  const scroll = async (sel) => {
    await send('Runtime.evaluate', { expression: `document.querySelector('${sel}')?.scrollIntoView({behavior:'instant',block:'start'})` });
    await new Promise(r => setTimeout(r, 600));
  };

  await scroll('#about');     await shot('v2_about');
  await scroll('#experience'); await shot('v2_exp');
  await scroll('#skills');    await shot('v2_skills');
  await scroll('#contact');   await shot('v2_contact');

  ws.close(); process.exit(0);
});
