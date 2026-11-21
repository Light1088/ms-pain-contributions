import assert from 'node:assert/strict';
import {makePlatform,stepPlatform,collectSwap,useSwap} from './mechanics.mjs';
const p=makePlatform(0);for(let i=0;i<60;i++)stepPlatform(p,45,1/60);assert.ok(Math.abs(p.t-.45)<1e-9,'45 units travelled in one second on a 100-unit path');
stepPlatform(p,45,2);assert.equal(p.t,1);assert.equal(p.dir,-1,'reverse at far endpoint');
stepPlatform(p,45,3);assert.equal(p.t,0);assert.equal(p.dir,1,'reverse at starting endpoint');
const still=makePlatform(.5);stepPlatform(still,0,100);assert.equal(still.t,.5,'zero speed stays still');stepPlatform(still,45,1,0);assert.equal(still.t,.5,'zero distance stays finite');
assert.equal(makePlatform(.5).dir,-1);assert.equal(makePlatform(2).t,1);
assert.equal(collectSwap(2,false),2,'no collection outside contact');assert.equal(collectSwap(2,true),3);assert.equal(collectSwap(4,true),4,'cap at four swaps');assert.equal(useSwap(0),0);assert.equal(useSwap(4),3);
console.log('PASS: movement timing, endpoint reversal, phase, zero-speed/distance, contact-gated collection and resource limits.');
