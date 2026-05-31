import http from 'http';
import { default as WebSocket } from 'ws';
import fs from 'fs';

const targets = await new Promise(res => http.get('http://localhost:9235/json', r => { let d=''; r.on('data',c=>d+=c); r.on('end',()=>res(JSON.parse(d))); }));
const ws = new WebSocket(targets[0].webSocketDebuggerUrl);
let cmdId = 1;
const pending = new Map();
ws.on('message', raw => { const m=JSON.parse(raw); if(m.id&&pending.has(m.id)){pending.get(m.id)(m.result);pending.delete(m.id);} });

ws.on('open', async () => {
  const send = (m,p={}) => new Promise(r=>{const id=cmdId++;pending.set(id,r);ws.send(JSON.stringify({id,method:m,params:p}));});
  
  await send('Page.navigate', { url: 'http://localhost:5173' });
  await new Promise(r => setTimeout(r, 6000));

  // Access ScrollTrigger via the module system exposed by Vite
  const gsapFix = await send('Runtime.evaluate', { expression: `
    (function() {
      // Try to get gsap from global scope or Vite module cache
      try {
        // Force ScrollTrigger to fire all triggers
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.getAll().forEach(t => { t.progress(1, false); t.kill(); });
        }
      } catch(e) {}
      
      // Nuclear: directly find all GSAP-animated elements by checking _gsap property
      document.querySelectorAll('*').forEach(el => {
        if (el._gsap) {
          el._gsap.opacity = 1;
          el._gsap.x = 0;
          el._gsap.y = 0;
          el._gsap.scaleX = 1;
        }
        // Also force via style
        const cs = window.getComputedStyle(el);
        if (cs.opacity === '0') {
          el.style.setProperty('opacity', '1', 'important');
        }
      });
      
      // Add a global style override
      const s = document.createElement('style');
      s.textContent = '* { opacity: 1 !important; }';
      document.head.appendChild(s);
      
      return 'done';
    })()
  ` });
  console.log('GSAP fix:', gsapFix.result?.value);
  
  await new Promise(r => setTimeout(r, 500));

  // Get full page dimensions
  const metrics = await send('Page.getLayoutMetrics', {});
  const totalH = Math.ceil(metrics.contentSize.height);
  console.log('Total page height:', totalH);

  // Take slices at different scroll positions
  const slice = async (name, yPos) => {
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${yPos})` });
    await new Promise(r => setTimeout(r, 300));
    const s = await send('Page.captureScreenshot', { 
      format: 'png', 
      clip: { x: 0, y: yPos, width: 1440, height: 900, scale: 1 },
      captureBeyondViewport: true
    });
    fs.writeFileSync(`C:/Users/Admin/Desktop/Projet1/CV-online/screenshots/${name}.png`, Buffer.from(s.data, 'base64'));
    console.log(`✅ ${name} @ y=${yPos}`);
  };

  // Get actual section positions
  const positions = await send('Runtime.evaluate', { expression: `
    JSON.stringify({
      about:      (document.getElementById('about')?.offsetTop || 0),
      experience: (document.getElementById('experience')?.offsetTop || 0),
      skills:     (document.getElementById('skills')?.offsetTop || 0),
      formation:  (document.getElementById('formation')?.offsetTop || 0),
      contact:    (document.getElementById('contact')?.offsetTop || 0),
    })
  ` });
  const pos = JSON.parse(positions.result?.value || '{}');
  console.log('Positions:', JSON.stringify(pos));

  await slice('s_about',      pos.about      || 900);
  await slice('s_experience', pos.experience || 1800);
  await slice('s_skills',     pos.skills     || 2800);
  await slice('s_formation',  pos.formation  || 3700);
  await slice('s_contact',    pos.contact    || 4600);

  ws.close(); process.exit(0);
});
