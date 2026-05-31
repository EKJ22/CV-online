import http from 'http';
import { default as WebSocket } from 'ws';
import fs from 'fs';

const targets = await new Promise(res => http.get('http://localhost:9226/json', r => { let d=''; r.on('data',c=>d+=c); r.on('end',()=>res(JSON.parse(d))); }));
const ws = new WebSocket(targets[0].webSocketDebuggerUrl);
let cmdId = 1;
const pending = new Map();
const exceptions = [];

ws.on('message', raw => {
  const msg = JSON.parse(raw);
  if (msg.method === 'Runtime.exceptionThrown') exceptions.push(msg.params.exceptionDetails?.exception?.description);
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg.result); pending.delete(msg.id); }
});

ws.on('open', async () => {
  const send = (m, p = {}) => new Promise(r => { const id = cmdId++; pending.set(id, r); ws.send(JSON.stringify({id,method:m,params:p})); });
  await send('Runtime.enable');
  await send('Page.enable');
  await send('Page.navigate', { url: 'http://localhost:5173' });
  await new Promise(r => setTimeout(r, 6000));
  
  const rootLen = await send('Runtime.evaluate', { expression: 'document.getElementById("root").innerHTML.length' });
  console.log('ROOT length:', rootLen.result?.value);
  console.log('Exceptions:', exceptions.join(' | '));
  
  if (rootLen.result?.value > 0) {
    const shot = await send('Page.captureScreenshot', { format: 'png', clip: { x:0, y:0, width:1440, height:900, scale:1 } });
    fs.writeFileSync('C:/Users/Admin/Desktop/Projet1/CV-online/screenshots/cv_fixed.png', Buffer.from(shot.data, 'base64'));
    console.log('Screenshot saved');
  }
  
  ws.close();
  process.exit(0);
});
