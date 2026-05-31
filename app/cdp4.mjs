import http from 'http';
import { default as WebSocket } from 'ws';

const targets = await new Promise(res => http.get('http://localhost:9225/json', r => { let d=''; r.on('data',c=>d+=c); r.on('end',()=>res(JSON.parse(d))); }));
const ws = new WebSocket(targets[0].webSocketDebuggerUrl);
let cmdId = 1;
const pending = new Map();
const allEvents = [];

ws.on('message', raw => {
  const msg = JSON.parse(raw);
  if (msg.method === 'Runtime.exceptionThrown') {
    allEvents.push('EXCEPTION: ' + JSON.stringify(msg.params.exceptionDetails, null, 2));
  }
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg.result); pending.delete(msg.id); }
});

ws.on('open', async () => {
  const send = (m, p = {}) => new Promise(r => { const id = cmdId++; pending.set(id, r); ws.send(JSON.stringify({id,method:m,params:p})); });
  await send('Runtime.enable');
  await send('Page.navigate', { url: 'http://localhost:5173' });
  await new Promise(r => setTimeout(r, 5000));
  console.log(allEvents.join('\n---\n'));
  ws.close();
  process.exit(0);
});
