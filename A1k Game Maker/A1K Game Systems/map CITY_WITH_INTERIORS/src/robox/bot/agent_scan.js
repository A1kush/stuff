
// A1K Agent Scan: map houses/doors/solids/ladders/zones into window.A1K_SCAN
(function(){
  const L = () => (window.st?.players?.[window.st.leader||0]) || null;
  function sample(){
    const st = window.st||{};
    const HOUSES = (window.Platform?.layers?.houses) || [];
    const SOLIDS = (window.Platform?.layers?.solids) || [];
    const LADDERS= (window.Platform?.layers?.ladders)||[];
    const ZONES  = (window.ZONES||[]).map((z,i)=>({i, name:z.name||('Z'+i), ax:z.ax||0}));
    const waypoints=[];
    for(const h of HOUSES){
      if(!h) continue;
      const kind = h.type||h.label||'house'; const door=h.door||{};
      waypoints.push({ id:h.id||kind, label:h.label||kind, kind, x:h.x||0,y:h.y||0,w:h.w||110,h:h.h||86,
        door:{x:door.x||((h.x||0)+(h.w||110)/2), y:door.y||h.y, r:door.r||34, w:door.w||42, h:door.h||36 } });
    }
    const doorStands = waypoints.map(wp => {
      const targets = SOLIDS.filter(p => p && p.type!=='ground' && Math.abs((p.y||0)-(wp.door.y||0))<10);
      const best = targets.sort((a,b)=>Math.abs((a.x+a.w/2)-wp.door.x)-Math.abs((b.x+b.w/2)-wp.door.x))[0];
      const standX = best ? Math.min(best.x+best.w-10, Math.max(best.x+10, wp.door.x)) : wp.door.x;
      return { id: wp.id, kind: wp.kind, label: wp.label, x: standX, y: (wp.door.y||0)-2 };
    });
    const pickups = (st.pickups||[]).filter(pk => pk && ['door','shop','arcade','pet_shop'].includes(pk.kind))
                     .map(pk => ({kind:pk.kind,x:pk.x||0,y:pk.y||0}));
    const enemies = (st.enemies||[]).filter(e=>e && !e.dead)
                     .map(e => ({x:e.x||0,y:e.y||0,hp:e.hp||0,boss:!!e.boss,elite:!!e.elite}));
    return { time:Date.now(), camX: st.camX||0, player: L()?{x:L().x||0,y:L().y||0}:null,
             zones:ZONES, houses:waypoints, doorStands, solids:SOLIDS.map(p=>({x:p.x,y:p.y,w:p.w,h:p.h,type:p.type})),
             ladders:LADDERS.map(l=>({x:l.x,y:l.y,w:l.w,h:l.h})), pickups, enemies };
  }
  let overlay, ctx, visible=false;
  function ensureOverlay(){
    if(overlay) return;
    const base = document.getElementById('cv'); if(!base) return;
    overlay = document.createElement('canvas'); overlay.width=base.width; overlay.height=base.height;
    Object.assign(overlay.style,{position:'absolute',left:base.style.left||'0px',top:base.style.top||'0px',zIndex:4000,pointerEvents:'none'});
    ctx = overlay.getContext('2d'); base.parentNode.appendChild(overlay);
  }
  function drawOverlay(scan){
    if(!ctx) return; const W=overlay.width, H=overlay.height;
    ctx.clearRect(0,0,W,H); ctx.save(); ctx.translate(-(window.st?.camX||0),0);
    ctx.globalAlpha=0.18; ctx.strokeStyle='#00E5FF'; for(let x=0;x<5000;x+=100){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    ctx.globalAlpha=1; ctx.fillStyle='#ffd56a';
    for(const wp of scan.houses){ ctx.fillRect((wp.door.x-2),(wp.door.y-2),4,4); ctx.fillText(wp.label||wp.kind, wp.door.x+6, wp.door.y-8); }
    ctx.fillStyle='#9fd7ff'; for(const s of scan.doorStands){ ctx.fillRect(s.x-2,s.y-2,4,4); }
    ctx.fillStyle='#a78bfa'; for(const z of scan.zones){ ctx.fillRect(z.ax-2,H-60,4,20); }
    ctx.restore();
  }
  const A1K_SCAN = window.A1K_SCAN = window.A1K_SCAN || { last:null, copy(){ try{ navigator.clipboard.writeText(JSON.stringify(this.last,null,2)); notify && notify('Scan copied','#c1ffc1'); }catch(_){ console.log(this.last); } } };
  function tick(){ A1K_SCAN.last = sample(); if(visible){ ensureOverlay(); if(overlay) drawOverlay(A1K_SCAN.last); } requestAnimationFrame(tick); }
  addEventListener('keydown',(e)=>{ if(e.code==='F7'){ visible=!visible; notify && notify(visible?'Scan ON':'Scan OFF','#a78bfa'); } if(e.ctrlKey&&e.altKey&&(e.key==='c'||e.key==='C')){ e.preventDefault(); A1K_SCAN.copy(); }}, true);
  if (document.readyState==='loading') addEventListener('DOMContentLoaded',()=>requestAnimationFrame(tick)); else requestAnimationFrame(tick);
  window.Agent = window.Agent || { target:null, gotoWaypoint(name){ const scan=A1K_SCAN.last||sample(); const wp=scan.doorStands.find(w=> (w.id===name)||(w.kind===name)||((w.label||'').toLowerCase().includes(String(name).toLowerCase())) ); if(wp){ this.target={x:wp.x,y:wp.y}; notify && notify('Agent → '+(wp.label||wp.kind),'#9fd7ff'); } }, gotoXY(x,y){ this.target={x,y}; notify&&notify(`Agent → (${x|0},${y|0})`,'#9fd7ff'); }, clear(){ this.target=null; } };
})(); 
