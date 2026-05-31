import http from 'http';
import { default as WebSocket } from 'ws';

function getJson(url) {
  return new Promise((res, rej) => {
    http.get(url, r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
    }).on('error', rej);
  });
}

const targets = await getJson('http://localhost:9223/json');
const wsUrl = targets[0]?.webSocketDebuggerUrl;

const ws = new WebSocket(wsUrl);
let cmdId = 1;
const pending = new Map();
let eventResolvers = {};

ws.on('open', async () => {
  const send = (method, params = {}) => new Promise(r => {
    const id = cmdId++;
    pending.set(id, r);
    ws.send(JSON.stringify({ id, method, params }));
  });

  // Navigate
  await send('Page.enable', {});
  await send('Page.navigate', { url: 'http://localhost:5173' });
  
  // Wait for load
  await new Promise(r => setTimeout(r, 6000));
  
  // Check DOM
  const evalResult = await send('Runtime.evaluate', {
    expression: `JSON.stringify({
      bodyBg: getComputedStyle(document.body).backgroundColor,
      rootBg: getComputedStyle(document.getElementById('root')).backgroundColor,
      rootHTML: document.getElementById('root').innerHTML.substring(0, 500),
      title: document.title,
      bodyClass: document.body.className
    })`
  });
  console.log('DOM info:', evalResult.result?.value);
  
  // Screenshot
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  const fs = await import('fs');
  fs.writeFileSync('C:/Users/Admin/Desktop/Projet1/CV-online/screenshots/cv_cdp2.png', Buffer.from(shot.data, 'base64'));
  
  ws.close();
  process.exit(0);
});

ws.on('message', raw => {
  const msg = JSON.parse(raw);
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg.result); pending.delete(msg.id); }
});
