// Coordinates are percentages of the room. The altar occupies the central floor.
export const altar = {left:50,right:75,bottom:79};
export function floorPoint(x,y){
 x=Math.max(9,Math.min(93,x)); y=Math.max(68,Math.min(94,y));
 if(x>=altar.left&&x<=altar.right)y=Math.max(82,y);
 return {x,y};
}
export function crossesAltar(a,b){
 let lo=0,hi=1;
 for(const [start,delta,min,max] of [[a.x,b.x-a.x,altar.left,altar.right],[a.y,b.y-a.y,0,altar.bottom]]){
  if(Math.abs(delta)<1e-9){if(start<min||start>max)return false;continue;}
  const t1=(min-start)/delta,t2=(max-start)/delta;
  lo=Math.max(lo,Math.min(t1,t2));hi=Math.min(hi,Math.max(t1,t2));
  if(lo>hi)return false;
 }
 return true;
}
export function planPath(start,target){
 const end=floorPoint(target.x,target.y);
 return crossesAltar(start,end)?[{x:start.x,y:85},{x:end.x,y:85},end]:[end];
}
