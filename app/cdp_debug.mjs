import http from 'http';
import { default as WebSocket } from 'ws';

const targets = await new Promise(res => http.get('http://localhost:9233/json', r => { let d=''; r.on('data',c=>d+=c); r.on('end',()=>res(JSON.parse(d))); }));
const ws = new WebSocket(targets[0].webSocketDebuggerUrl);
let cmdId = 1;
const pending = new Map();
ws.on('message', raw => { const m=JSON.parse(raw); if(m.id&&pending.has(m.id)){pending.get(m.id)(m.result);pending.delete(m.id);} });

ws.on('open', async () => {
  const send = (m,p={}) => new Promise(r=>{const id=cmdId++;pending.set(id,r);ws.send(JSON.stringify({id,method:m,params:p}));});
  await send('Page.navigate', { url: 'http://localhost:5173' });
  await new Promise(r => setTimeout(r, 5000));

  // Check what's happening with the about section
  const debug = await send('Runtime.evaluate', { expression: `
    const about = document.getElementById('about');
    const rect = about?.getBoundingClientRect();
    const style = about ? getComputedStyle(about) : {};
    const firstChild = about?.firstElementChild;
    const firstChildStyle = firstChild ? getComputedStyle(firstChild) : {};
    
    // Also check the .about-left element
    const aboutLeft = document.querySelector('.about-left');
    const aboutLeftStyle = aboutLeft ? getComputedStyle(aboutLeft) : {};
    
    JSON.stringify({
      aboutExists: !!about,
      aboutRect: rect ? {top: rect.top, left: rect.left, width: rect.width, height: rect.height} : null,
      aboutDisplay: style.display,
      aboutOpacity: style.opacity,
      aboutVisibility: style.visibility,
      firstChildOpacity: firstChildStyle.opacity,
      firstChildVisibility: firstChildStyle.visibility,
      aboutLeftOpacity: aboutLeftStyle.opacity,
      aboutLeftDisplay: aboutLeftStyle.display,
      aboutLeftTransform: aboutLeftStyle.transform,
      scrollY: window.scrollY,
      innerHeight: window.innerHeight,
    })
  ` });
  console.log(debug.result?.value);
  ws.close(); process.exit(0);
});
