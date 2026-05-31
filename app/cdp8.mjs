import http from 'http';
import { default as WebSocket } from 'ws';

const targets = await new Promise(res => http.get('http://localhost:9229/json', r => { let d=''; r.on('data',c=>d+=c); r.on('end',()=>res(JSON.parse(d))); }));
const ws = new WebSocket(targets[0].webSocketDebuggerUrl);
let cmdId = 1;
const pending = new Map();
ws.on('message', raw => { const msg=JSON.parse(raw); if(msg.id&&pending.has(msg.id)){pending.get(msg.id)(msg.result);pending.delete(msg.id);} });

ws.on('open', async () => {
  const send = (m,p={}) => new Promise(r=>{const id=cmdId++;pending.set(id,r);ws.send(JSON.stringify({id,method:m,params:p}));});
  await send('Page.navigate', { url: 'http://localhost:5173' });
  await new Promise(r => setTimeout(r, 5000));

  const check = async (id, expectedText) => {
    const r = await send('Runtime.evaluate', { expression: `document.getElementById('${id}')?.textContent?.includes('${expectedText}')` });
    return { id, expectedText, found: r.result?.value };
  };

  const results = await Promise.all([
    check('hero', 'EZAN'),
    check('hero', 'KOUASSAN'),
    check('hero', 'Disponible'),
    check('about', 'Qui suis-je'),
    check('about', 'Abidjan'),
    check('about', 'Ivoirien'),
    check('experience', 'BAKER TILLY'),
    check('experience', 'Zero Trust'),
    check('experience', 'Ansible'),
    check('skills', 'Mikrotik MTCNA'),
    check('skills', 'Fortinet NSE'),
    check('formation', 'FortiGate'),
    check('formation', 'MTCNA'),
    check('formation', 'BTS'),
    check('contact', 'kouassanjacob@gmail.com'),
    check('contact', 'NGUESSAN'),
  ]);
  
  results.forEach(r => console.log(`${r.found ? '✅' : '❌'} #${r.id}: "${r.expectedText}"`));
  ws.close();
  process.exit(0);
});
