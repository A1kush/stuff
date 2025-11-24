
// A1K AI Bot - procedural sprite, follow, shots, skills, leader-mode
(function(){
  const $ = sel => document.querySelector(sel);
  const now = () => performance.now();
  const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));
  const leaderObj = () => (window.st?.players?.[window.st.leader||0]) || null;
  const baseCanvas = () => document.getElementById('cv');

  // UI: ensure summon button exists (placement handled by previous agent snippet or fallback here)
  function ensureButton(){
    if (document.getElementById('btnAISummon')) return;
    const btn = document.createElement('button');
    btn.id = 'btnAISummon'; btn.className = 'btn-micro micro-ai'; btn.title = 'Summon AI (B)';
    btn.innerHTML = 'AI';
    document.body.appendChild(btn);
    // baseline placement near joystick if no dynamic placer exists
    btn.style.position='fixed'; btn.style.left='16px'; btn.style.bottom='186px'; btn.style.zIndex=50;
    btn.addEventListener('click', ()=> Bot.toggle() );
  }

  // Overlay
  let overlay, octx, W=1280,H=720;
  function ensureOverlay(){
    if (overlay && overlay.parentNode) return;
    const base = baseCanvas(); if(!base) return;
    W = base.width||base.clientWidth||1280; H = base.height||base.clientHeight||720;
    overlay = document.createElement('canvas'); overlay.width=W; overlay.height=H; overlay.id='botFx';
    Object.assign(overlay.style,{position:'absolute',left:base.style.left||'0',top:base.style.top||'0',pointerEvents:'none',zIndex:5000});
    base.parentNode.appendChild(overlay); octx = overlay.getContext('2d');
  }
  function syncOverlaySize(){
    const base=baseCanvas(); if(!base||!overlay) return;
    const w=base.width,h=base.height; if(w&&h&&(overlay.width!==w||overlay.height!==h)){overlay.width=w;overlay.height=h;W=w;H=h;}
  }

  // Drawing
  function drawBot(ctx,x,y,t,flip=false){
    ctx.save(); ctx.translate(x|0,y|0); if(flip) ctx.scale(-1,1);
    const pulse = 0.85 + 0.15*Math.sin(t*0.008);
    // shadow
    ctx.globalAlpha = 0.75; ctx.fillStyle='#000000'; ctx.beginPath(); ctx.ellipse(0,14,14,6,0,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
    // body
    ctx.fillStyle='#0a0b10'; ctx.strokeStyle='#00E5FF'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(-10,-14); ctx.quadraticCurveTo(0,-22,10,-14); ctx.lineTo(10,10); ctx.quadraticCurveTo(0,18,-10,10); ctx.closePath(); ctx.fill(); ctx.stroke();
    // visor
    ctx.fillStyle='#A78BFA'; ctx.beginPath(); ctx.roundRect(-8,-8,16,10,4); ctx.fill();
    // antenna
    ctx.strokeStyle='#FF3B3B'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(0,-16); ctx.lineTo(0,-22); ctx.stroke(); ctx.beginPath(); ctx.arc(0,-24,3,0,Math.PI*2); ctx.stroke();
    // aura
    ctx.globalCompositeOperation='lighter'; ctx.globalAlpha = 0.2 + 0.2*pulse; ctx.fillStyle='#00E5FF'; ctx.beginPath(); ctx.arc(0,-2,18,0,Math.PI*2); ctx.fill();
    ctx.globalAlpha=1; ctx.globalCompositeOperation='source-over'; ctx.restore();
  }
  function makeShot(x,y,vx,vy){ return {x,y,vx,vy,r:4,life:1200,born:now()}; }
  function drawShot(ctx,s,t){
    ctx.save(); ctx.translate(s.x,s.y); ctx.globalCompositeOperation='lighter'; ctx.fillStyle='#00E5FF';
    ctx.beginPath(); ctx.arc(0,0,s.r,0,Math.PI*2); ctx.fill();
    ctx.globalCompositeOperation='source-over'; ctx.strokeStyle='#A78BFA'; ctx.lineWidth=1.5; ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(-s.vx*0.05,-s.vy*0.05); ctx.stroke(); ctx.restore();
  }
  function enemyAABB(e){ const w=e.w||24,h=e.h||24; return {x:(e.x||0)-w/2,y:(e.y||0)-h/2,w,h}; }
  function shotHitsEnemy(s,e){ const a=enemyAABB(e); const cx= Math.max(a.x,Math.min(s.x,a.x+a.w)); const cy=Math.max(a.y,Math.min(s.y,a.y+a.h)); const dx=s.x-cx, dy=s.y-cy; return (dx*dx+dy*dy) <= (s.r*s.r); }

  // Bot brain
  const Bot = {
    active:false, x:0,y:0,vx:0,vy:0, speed:260, desiredOffset:90, fireCD:0, shots:[], hp:9999, leaderMode:false,
    summon(){ const L=leaderObj(); if(!L) return false; this.active=true; this.x=(L.x||0)-this.desiredOffset; this.y=L.y||0; this.vx=this.vy=0; this.shots.length=0; this.fireCD=0; this.spawnTime=now(); try{ notify && notify('AI Bot summoned','#c1ffc1'); }catch(_){}
      if(this.leaderMode){ try{ notify && notify('AI leads: ON','#9fd7ff'); }catch(_){}} return true; },
    dismiss(){ this.active=false; this.shots.length=0; try{ notify && notify('AI Bot dismissed','#ff7a6a'); }catch(_){} },
    toggle(){ this.active?this.dismiss():this.summon(); },
    setLeaderMode(on){ this.leaderMode=!!on; },
    targetEnemy(){ const st=window.st; if(!st?.enemies?.length) return null; let best=null,bestD=1e12; for(const e of st.enemies){ if(!e||e.dead) continue; const dx=(this.x-(e.x||0)), dy=(this.y-(e.y||0)); const d=dx*dx+dy*dy; if(d<bestD){best=e;bestD=d;} } return best; },
    tryFire(dt){ this.fireCD -= dt; if(this.fireCD>0) return; const t=this.targetEnemy(); if(!t) return; const dx=(t.x||0)-this.x, dy=(t.y||0)-this.y; const L=Math.hypot(dx,dy)||1; const sp=560; this.shots.push(makeShot(this.x+10,this.y-6,(dx/L)*sp,(dy/L)*sp)); this.fireCD=180; try{ VFX&&VFX.play&&VFX.play('muzzle',{x:this.x+12,y:this.y-6,size:0.8}); }catch(_){}},
    cast(i){ // simple skills: 0 burst, 1 arc, 2 beam
      if(!this.active) return;
      if(i===0){ for(let k=0;k<8;k++){ const a=(k/8)*Math.PI*2; const sp=520; this.shots.push(makeShot(this.x,this.y,Math.cos(a)*sp,Math.sin(a)*sp)); } try{VFX.play&&VFX.play('shock',{x:this.x,y:this.y,size:1.1});}catch(_){}
      } else if(i===1){ const t=this.targetEnemy(); const baseA = t?Math.atan2((t.y-this.y),(t.x-this.x)) : 0; for(let k=-2;k<=2;k++){ const a=baseA+k*0.18; this.shots.push(makeShot(this.x,this.y,Math.cos(a)*600,Math.sin(a)*600)); } try{VFX.play&&VFX.play('arc',{x:this.x,y:this.y,size:1.0});}catch(_){}
      } else if(i===2){ // beam: fast shots line
        for(let d=0; d<6; d++){ this.shots.push(makeShot(this.x+10+ d*20,this.y-6,800,0)); }
        try{VFX.play&&VFX.play('laser',{x:this.x+12,y:this.y-6,size:1.2});}catch(_){}
      }
    },
    updateShots(dt){
      const st=window.st; const dmg=22; const keep=[]; const T=now();
      for(const s of this.shots){
        s.x += s.vx*(dt/1000); s.y += s.vy*(dt/1000);
        if (T - s.born > s.life) continue;
        let hit=false;
        if(st?.enemies?.length){
          for(const e of st.enemies){
            if(!e||e.dead) continue;
            if(shotHitsEnemy(s,e)){ hit=true; try{ e.hp=Math.max(0,(e.hp||50)-dmg); if(e.hp===0) e.dead=true; VFX&&VFX.play&&VFX.play('spark',{x:s.x,y:s.y,size:1.0}); }catch(_){}
              break;
            }
          }
        }
        if(!hit) keep.push(s);
      }
      this.shots=keep;
    },
    followLeader(dt){
      const L=leaderObj(); if(!L) return;
      const wx = (L.x||0) - this.desiredOffset, wy = L.y||0;
      const dx=wx-this.x, dy=wy-this.y; const d=Math.hypot(dx,dy);
      if(d>2){ const vx=(dx/d)*this.speed, vy=(dy/d)*this.speed; this.x += vx*(dt/1000); this.y += vy*(dt/1000); }
      if(d>1200){ this.x=wx; this.y=wy; }
    },
    leadPlayer(dt){ // push player to follow AI
      if(!this.leaderMode) return;
      const L=leaderObj(); if(!L) return;
      const dx = (this.x - (L.x||0));
      try{
        if(Math.abs(dx)>8){ if(dx>0){window.press&&window.press('right'); window.release&&window.release('left');} else {window.press&&window.press('left'); window.release&&window.release('right');} }
        else { window.release&&window.release('left'); window.release&&window.release('right'); }
      }catch(_){}
    },
    update(dt){ if(!this.active) return; this.followLeader(dt); this.tryFire(dt); this.updateShots(dt); this.leadPlayer(dt); },
    draw(ctx,t){ if(!this.active) return; const L=leaderObj(); const flip=L?(this.x<L.x):false; drawBot(ctx,this.x,this.y,t,flip); for(const s of this.shots) drawShot(ctx,s,t); }
  };

  // RAF hook
  function hookRAF(){
    const bRAF = window.requestAnimationFrame;
    if (!bRAF || bRAF.__aiBotHook) return;
    window.requestAnimationFrame = function(cb){
      return bRAF(function(ts){
        try{ ensureOverlay(); syncOverlaySize(); if(octx){ octx.clearRect(0,0,overlay.width,overlay.height); Bot.draw(octx,ts);} }catch(_){}
        return cb(ts);
      });
    };
    window.requestAnimationFrame.__aiBotHook = true;
  }
  function wrapUpdate(){
    const original = window.update;
    if (typeof original !== 'function' || original.__aiBotWrapped) return;
    const wrapped = function(){
      const t0 = now();
      const res = original.apply(this, arguments);
      const t1 = now();
      Bot.update(t1 - (window.__AI_LAST||t1));
      window.__AI_LAST = t1;
      return res;
    };
    wrapped.__aiBotWrapped = true;
    window.update = wrapped;
  }

  // Input
  addEventListener('keydown', (e)=>{ if(e.repeat) return;
    if(e.key==='b'||e.key==='B'){ e.preventDefault(); Bot.toggle(); }
    if(e.key==='x'||e.key==='X'){ Bot.cast(0); }
    if(e.key==='y'||e.key==='Y'){ Bot.cast(1); }
    if(e.key==='z'||e.key==='Z'){ Bot.cast(2); }
    if(e.key==='l'||e.key==='L'){ Bot.setLeaderMode(!Bot.leaderMode); try{ notify && notify('AI leads: '+(Bot.leaderMode?'ON':'OFF'),'#9fd7ff'); }catch(_){}} }, true);

  // Self test
  function selfTest(){ try{ const ok = Bot.summon(); if(!ok) return;
    setTimeout(()=>{ for(let i=0;i<6;i++) setTimeout(()=>Bot.tryFire(0), i*80); }, 300); } catch(_){ } }
  addEventListener('keydown', (e)=>{ if(e.key==='B'&&e.ctrlKey&&e.shiftKey){ e.preventDefault(); selfTest(); } });

  // boot
  function boot(){ ensureButton(); wrapUpdate(); hookRAF(); }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot); else boot();

  // expose
  window.AIBotSystem = Bot;
  window.AI_SUMMON = () => Bot.toggle();
})();
