import http from 'http';
import { default as WebSocket } from 'ws';

const targets = await new Promise(res => http.get('http://localhost:9224/json', r => { let d=''; r.on('data',c=>d+=c); r.on('end',()=>res(JSON.parse(d))); }));
const ws = new WebSocket(targets[0].webSocketDebuggerUrl);
let cmdId = 1;
const pending = new Map();
const consoleErrors = [];
const netErrors = [];

ws.on('open', async () => {
  const send = (m, p = {}) => new Promise(r => { const id = cmdId++; pending.set(id, r); ws.send(JSON.stringify({id,method:m,params:p})); });
  
  await send('Runtime.enable');
  await send('Page.enable');
  await send('Network.enable');
  
  ws.on('message', raw => {
    const msg = JSON.parse(raw);
    if (msg.method === 'Runtime.consoleAPICalled') {
      const args = msg.params.args.map(a => a.value || a.description || '').join(' ');
      if (args) consoleErrors.push(`[${msg.params.type}] ${args}`);
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      consoleErrors.push('[EXCEPTION] ' + (msg.params.exceptionDetails?.text || JSON.stringify(msg.params)));
    }
    if (msg.method === 'Network.loadingFailed') {
      netErrors.push('[NET FAIL] ' + JSON.stringify(msg.params));
    }
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg.result); pending.delete(msg.id); }
  });
  
  await send('Page.navigate', { url: 'http://localhost:5173' });
  await new Promise(r => setTimeout(r, 6000));
  
  const rootContent = await send('Runtime.evaluate', { expression: 'document.getElementById("root").innerHTML.substring(0, 200)' });
  console.log('ROOT HTML:', rootContent.result?.value);
  console.log('CONSOLE ERRORS:', JSON.stringify(consoleErrors.slice(0, 10)));
  console.log('NET ERRORS:', JSON.stringify(netErrors.slice(0, 5)));
  
  ws.close();
  process.exit(0);
});

ws.on('message', raw => {
  const msg = JSON.parse(raw);
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg.result); pending.delete(msg.id); }
});
