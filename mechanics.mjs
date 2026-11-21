// Browser adaptation of selected C# gameplay rules from the supplied project scripts.
export function makePlatform(phase=0) { const t=Math.max(0,Math.min(1,phase)); return {t,dir:t>=.5?-1:1}; }
export function stepPlatform(platform,speed,dt,distance=100) {
  if(distance<.0001)return;
  platform.t+=platform.dir*speed*dt/distance;
  if(platform.t>=1){platform.t=1;platform.dir=-1;}
  if(platform.t<=0){platform.t=0;platform.dir=1;}
}
export function collectSwap(count,touching,max=4) { return touching&&count<max?count+1:count; }
export function useSwap(count) { return Math.max(0,count-1); }
