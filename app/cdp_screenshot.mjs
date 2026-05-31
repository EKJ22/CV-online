import http from 'http';

function getJson(url) {
  return new Promise((res, rej) => {
    http.get(url, r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
    }).on('error', rej);
  });
}

const targets = await getJson('http://localhost:9222/json');
const wsUrl = targets[0]?.webSocketDebuggerUrl;
if (!wsUrl) { console.error('No WS URL'); process.exit(1); }

// WebSocket CDP
const { default: WebSocket } = await import('ws');
const ws = new WebSocket(wsUrl);
let cmdId = 1;
const pending = new Map();

ws.on('open', async () => {
  const send = (method, params) => new Promise(r => {
    const id = cmdId++;
    pending.set(id, r);
    ws.send(JSON.stringify({ id, method, params }));
  });

  await send('Page.enable', {});
  await send('Page.navigate', { url: 'http://localhost:5173' });
  await send('Page.loadEventFired', {}).catch(() => {});
  await new Promise(r => setTimeout(r, 4000));
  const result = await send('Page.captureScreenshot', { format: 'png', quality: 90 });
  const fs = await import('fs');
  fs.writeFileSync('C:/Users/Admin/Desktop/Projet1/CV-online/screenshots/cv_cdp.png', Buffer.from(result.data, 'base64'));
  console.log('Screenshot saved');
  ws.close();
  process.exit(0);
});

ws.on('message', raw => {
  const msg = JSON.parse(raw);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg.result);
    pending.delete(msg.id);
  }
});

ws.on('error', e => { console.error('WS error', e.message); process.exit(1); });
