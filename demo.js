import {makePlatform,stepPlatform,collectSwap,useSwap} from './mechanics.mjs';
const $=id=>document.getElementById(id);
const platformCanvas=$('platformCanvas'),swapCanvas=$('swapCanvas');
let platforms=[0,.5,1].map(makePlatform),paused=false,speed=45,last=null,position=20,count=2;
const MAX=4,keys=new Set();
function surface(canvas){const r=canvas.getBoundingClientRect(),d=window.devicePixelRatio||1,w=Math.round(r.width*d),h=Math.round(r.height*d);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}const c=canvas.getContext('2d');c.setTransform(d,0,0,d,0,0);return{c,w:r.width,h:r.height};}
function grid(c,w,h){c.fillStyle='#112233';c.fillRect(0,0,w,h);c.strokeStyle='#223d53';c.lineWidth=1;for(let x=20;x<w;x+=30){c.beginPath();c.moveTo(x,0);c.lineTo(x,h);c.stroke();}for(let y=20;y<h;y+=30){c.beginPath();c.moveTo(0,y);c.lineTo(w,y);c.stroke();}}
function drawPlatforms(){const{c,w,h}=surface(platformCanvas);grid(c,w,h);const labels=['Start phase 0','Start phase 0.5','Start phase 1'];platforms.forEach((p,i)=>{const x=w*(i+1)/4,start=h-48,end=45,y=start+(end-start)*p.t;c.strokeStyle='#8daabd';c.setLineDash([5,5]);c.beginPath();c.moveTo(x,start);c.lineTo(x,end);c.stroke();c.setLineDash([]);c.fillStyle=['#47bdeb','#ffc66b','#99dbb1'][i];c.fillRect(x-35,y-6,70,12);c.font='13px system-ui';c.textAlign='center';c.fillStyle='#e8f2fa';c.fillText(labels[i],x,h-15);});}
// Collision overlap represents the original pickup's enter/exit contact gate.
function touching(){return Math.abs(position-75)<=7;}
function updateUI(){ $('count').textContent=`Swaps: ${count} / ${MAX}`;$('collect').disabled=!touching()||count>=MAX;$('spend').disabled=count===0; }
function drawSwap(){const{c,w,h}=surface(swapCanvas);grid(c,w,h);const left=35,right=w-35,y=h*.58,px=left+(right-left)*position/100,gx=left+(right-left)*.75;
 c.strokeStyle='#a7c4d7';c.beginPath();c.moveTo(left,y+24);c.lineTo(right,y+24);c.stroke();
 c.fillStyle=touching()?'#ffe0a0':'#ffc66b';c.fillRect(gx-15,y-15,30,30);c.fillStyle='#47bdeb';c.fillRect(px-13,y-23,26,46);
 c.fillStyle='#e8f2fa';c.font='14px system-ui';c.textAlign='center';c.fillText('Player',px,y+48);c.fillText('Swap pickup',gx,y-37);c.fillText(touching()?'Touching pickup — press E':'Move toward the gold pickup',w/2,28);updateUI();}
function move(amount){const old=touching();position=Math.max(0,Math.min(100,position+amount));if(old!==touching())$('message').textContent=touching()?'Touching pickup. Collect adds one swap per press.':'Outside pickup: collection is disabled.';drawSwap();}
function collect(){const old=count;count=collectSwap(count,touching());$('message').textContent=count>old?'Collected one swap.':count===MAX?'Already at the four-swap limit.':'Move onto the pickup before collecting.';drawSwap();}
function spend(){count=useSwap(count);$('message').textContent=count?'Used one swap.':'No swaps left. Visit the pickup or use the test shortcut.';drawSwap();}
function refill(){count=MAX;$('message').textContent='Testing shortcut: swaps restored to four.';drawSwap();}
$('pause').onclick=()=>{paused=!paused;$('pause').textContent=paused?'Resume platforms':'Pause platforms';$('platformStatus').textContent=paused?'Platforms paused.':'Platforms running.';};
$('restart').onclick=()=>{platforms=[0,.5,1].map(makePlatform);drawPlatforms();$('platformStatus').textContent=paused?'Starting phases restored; platforms paused.':'Starting phases restored; platforms running.';};
$('speed').oninput=e=>{speed=Number(e.target.value);$('speedValue').textContent=speed+' units/s';};
$('left').onclick=()=>move(-5);$('right').onclick=()=>move(5);$('collect').onclick=collect;$('spend').onclick=spend;$('refill').onclick=refill;
$('reset').onclick=()=>{position=20;count=2;keys.clear();$('message').textContent='Resource test reset. Move right to reach the pickup.';drawSwap();};
window.addEventListener('keydown',e=>{if(e.target.matches('input,textarea,select'))return;const k=e.key.toLowerCase();if(['a','d','arrowleft','arrowright'].includes(k)){keys.add(k);e.preventDefault();}if(!e.repeat){if(k==='e'){collect();e.preventDefault();}if(k==='c'){refill();e.preventDefault();}}});
window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));window.addEventListener('blur',()=>keys.clear());
function frame(time){const dt=last===null?0:Math.min((time-last)/1000,.05);last=time;if(!paused)platforms.forEach(p=>stepPlatform(p,speed,dt));let direction=0;if(keys.has('a')||keys.has('arrowleft'))direction--;if(keys.has('d')||keys.has('arrowright'))direction++;if(direction)move(direction*35*dt);drawPlatforms();drawSwap();requestAnimationFrame(frame);}
requestAnimationFrame(frame);
