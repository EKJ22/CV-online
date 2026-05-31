import http from 'http';
import { default as WebSocket } from 'ws';
import fs from 'fs';

const targets = await new Promise(res => http.get('http://localhost:9230/json', r => { let d=''; r.on('data',c=>d+=c); r.on('end',()=>res(JSON.parse(d))); }));
const ws = new WebSocket(targets[0].webSocketDebuggerUrl);
let cmdId = 1;
const pending = new Map();
const errors = [];

ws.on('message', raw => {
  const msg = JSON.parse(raw);
  if (msg.method === 'Runtime.exceptionThrown') errors.push(msg.params.exceptionDetails?.exception?.description || '');
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg.result); pending.delete(msg.id); }
});

ws.on('open', async () => {
  const send = (m,p={}) => new Promise(r=>{const id=cmdId++;pending.set(id,r);ws.send(JSON.stringify({id,method:m,params:p}));});
  await send('Runtime.enable');
  await send('Page.navigate', { url: 'http://localhost:5173' });
  await new Promise(r => setTimeout(r, 6000));
  console.log('Errors:', errors.join(' | '));

  const shot = async (name) => {
    const s = await send('Page.captureScreenshot', { format:'png', clip:{x:0,y:0,width:1440,height:900,scale:1} });
    fs.writeFileSync(`C:/Users/Admin/Desktop/Projet1/CV-online/screenshots/${name}.png`, Buffer.from(s.data,'base64'));
    console.log(`✅ ${name}`);
  };
  const scroll = async (sel) => {
    await send('Runtime.evaluate', { expression: `document.querySelector('${sel}')?.scrollIntoView({behavior:'instant'})` });
    await new Promise(r => setTimeout(r, 800));
  };

  await shot('tropic_hero');
  await scroll('#about'); await shot('tropic_about');
  await scroll('#experience'); await shot('tropic_exp');
  await scroll('#skills'); await shot('tropic_skills');
  await scroll('#contact'); await shot('tropic_contact');
  ws.close(); process.exit(0);
});
