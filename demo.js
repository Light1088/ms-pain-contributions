import {makePlatform,stepPlatform,collectSwap,useSwap} from './mechanics.mjs';
const $=id=>document.getElementById(id);
const platformCanvas=$('platformCanvas'),swapCanvas=$('swapCanvas');
let platforms=[0,.5,1].map(makePlatform),paused=false,speed=45,last=null,position=20,count=2;
const MAX=4,keys=new Set();
let guideRun=0,guiding=false;
const interactiveIds=["left","right","collect","spend","refill"];
function setGuiding(value){guiding=value;keys.clear();$("guided").disabled=value;interactiveIds.forEach(id=>$(id).disabled=value);updateUI();}
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function surface(canvas){const r=canvas.getBoundingClientRect(),d=window.devicePixelRatio||1,w=Math.round(r.width*d),h=Math.round(r.height*d);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}const c=canvas.getContext('2d');c.setTransform(d,0,0,d,0,0);return{c,w:r.width,h:r.height};}
function grid(c,w,h){c.fillStyle='#112233';c.fillRect(0,0,w,h);c.strokeStyle='#223d53';c.lineWidth=1;for(let x=20;x<w;x+=30){c.beginPath();c.moveTo(x,0);c.lineTo(x,h);c.stroke();}for(let y=20;y<h;y+=30){c.beginPath();c.moveTo(0,y);c.lineTo(w,y);c.stroke();}}
function drawPlatforms(){const{c,w,h}=surface(platformCanvas);grid(c,w,h);const labels=['Start phase 0','Start phase 0.5','Start phase 1'];platforms.forEach((p,i)=>{const x=w*(i+1)/4,start=h-48,end=45,y=start+(end-start)*p.t;c.strokeStyle='#8daabd';c.setLineDash([5,5]);c.beginPath();c.moveTo(x,start);c.lineTo(x,end);c.stroke();c.setLineDash([]);c.fillStyle=['#47bdeb','#ffc66b','#99dbb1'][i];c.fillRect(x-35,y-6,70,12);c.font='13px system-ui';c.textAlign='center';c.fillStyle='#e8f2fa';c.fillText(labels[i],x,h-15);});}
// Collision overlap represents the original pickup's enter/exit contact gate.
function touching(){return Math.abs(position-75)<=7;}
function updateUI(){ $('count').textContent=`Shadow ability: ${count} / ${MAX} uses left`;$('collect').disabled=guiding||!touching()||count>=MAX;$('spend').disabled=guiding||count===0; }
function drawSwap(){const{c,w,h}=surface(swapCanvas);grid(c,w,h);const left=35,right=w-35,y=h*.58,px=left+(right-left)*position/100,gx=left+(right-left)*.75;
 c.strokeStyle='#a7c4d7';c.beginPath();c.moveTo(left,y+24);c.lineTo(right,y+24);c.stroke();
 c.fillStyle=touching()?'#ffe0a0':'#ffc66b';c.fillRect(gx-15,y-15,30,30);c.fillStyle='#47bdeb';c.fillRect(px-13,y-23,26,46);
 c.fillStyle='#e8f2fa';c.font='14px system-ui';c.textAlign='center';c.fillText('Player',px,y+48);c.fillText('Restores 1 use',gx,y-37);c.fillText(count>=MAX?'All 4 uses available — use one first':touching()?'Touching item — restore 1 use (E)':'Move the blue player toward the gold item',w/2,28);updateUI();}
function move(amount){const old=touching();position=Math.max(0,Math.min(100,position+amount));if(old!==touching())$('message').textContent=touching()?'Touching the gold item. Press E to restore one use of the shadow ability.':'Move onto the gold item before restoring a use of the shadow ability.';drawSwap();}
function collect(){const old=count;count=collectSwap(count,touching());$('message').textContent=count>old?`Restored 1 use of the shadow ability: ${old}/4 → ${count}/4.`:count===MAX?'All 4 uses are available. Simulate using one first, then restore it.':'Move onto the gold item before restoring a switch.';drawSwap();}
function spend(){const old=count;count=useSwap(count);$('message').textContent=old?`Simulated using 1 use of the shadow ability: ${old}/4 → ${count}/4. Use the gold item to restore it.`:'No uses of the shadow ability left. Reach the gold item to restore one.';drawSwap();}
function refill(){count=MAX;$('message').textContent='Testing shortcut: all 4 uses of the shadow ability restored.';drawSwap();}
$('pause').onclick=()=>{paused=!paused;$('pause').textContent=paused?'Resume platforms':'Pause platforms';$('platformStatus').textContent=paused?'Platforms paused.':'Platforms running.';};
$('restart').onclick=()=>{platforms=[0,.5,1].map(makePlatform);drawPlatforms();$('platformStatus').textContent=paused?'Starting phases restored; platforms paused.':'Starting phases restored; platforms running.';};
$('speed').oninput=e=>{speed=Number(e.target.value);$('speedValue').textContent=speed+' units/s';};
$('left').onclick=()=>move(-5);$('right').onclick=()=>move(5);$('collect').onclick=collect;$('spend').onclick=spend;$('refill').onclick=refill;
$('reset').onclick=()=>{guideRun++;setGuiding(false);position=20;count=2;keys.clear();$('guideStatus').textContent='Watch the counter go from 2 → 1 → 2 as one use of the shadow ability is used and restored. No controls needed.';$('message').textContent='Reset: 2 uses of the shadow ability left out of 4. Move right to the gold item.';drawSwap();};
$('guided').onclick=async()=>{
 const run=++guideRun;
 setGuiding(true);position=20;count=2;drawSwap();
 $('guideStatus').textContent='1 of 4 · You have 2 uses of the shadow ability left. In the game, taking control of the shadow instead of the main character uses one.';
 $('message').textContent='Starting with 2 uses of the shadow ability left out of 4.';
 await wait(1800);if(run!==guideRun)return;
 spend();$('guideStatus').textContent='2 of 4 · Simulate taking control of the shadow instead of the main character: uses of the shadow ability left decrease from 2 to 1.';
 await wait(1800);if(run!==guideRun)return;
 $('guideStatus').textContent='3 of 4 · Move onto the gold item. It can restore a use of the shadow ability only while the player touches it.';
 while(position<75){if(run!==guideRun)return;move(Math.min(1,75-position));await wait(20);}
 await wait(900);if(run!==guideRun)return;
 collect();$('guideStatus').textContent='4 of 4 · The gold item restores one use of the shadow ability: 1/4 → 2/4. The maximum is 4.';
 await wait(1800);if(run!==guideRun)return;
 setGuiding(false);$('guideStatus').textContent='Example complete: one use of the shadow ability used, then restored. Try “Use ability (counter example)”, then “Restore 1 use” to repeat it.';
};
window.addEventListener('keydown',e=>{if(guiding||e.target.matches('input,textarea,select'))return;const k=e.key.toLowerCase();if(['a','d','arrowleft','arrowright'].includes(k)){keys.add(k);e.preventDefault();}if(!e.repeat){if(k==='e'){collect();e.preventDefault();}if(k==='c'){refill();e.preventDefault();}}});
window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));window.addEventListener('blur',()=>keys.clear());
function frame(time){const dt=last===null?0:Math.min((time-last)/1000,.05);last=time;if(!paused)platforms.forEach(p=>stepPlatform(p,speed,dt));let direction=0;if(keys.has('a')||keys.has('arrowleft'))direction--;if(keys.has('d')||keys.has('arrowright'))direction++;if(direction)move(direction*35*dt);drawPlatforms();drawSwap();requestAnimationFrame(frame);}
requestAnimationFrame(frame);
