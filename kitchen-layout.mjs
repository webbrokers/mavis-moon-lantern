// The island ends above the horizontal passage at y=61.
export const kitchenPoints={
 chef:{x:45,y:61,face:-1},oven:{x:50,y:57,face:-1},
 highKey:{x:61,y:57,face:1},lamp:{x:68,y:57,face:1},
 ladle:{x:72,y:64,face:1},fridge:{x:77,y:59,face:1}
};
export function kitchenFloor(x,y){
 y=Math.max(57,Math.min(91,y));
 const left=y<61?46:y<66?30:Math.min(46,30+(y-66)*2);
 return {x:Math.max(left,Math.min(77,x)),y};
}
export function kitchenPath(from,target,exiting=false){
 const end=exiting?target:kitchenFloor(target.x,target.y),points=[];
 // Route below the chef's island before approaching either doorway or stove.
 if(from.x<46||end.x<46){
  if(from.y<61&&from.x>=46)points.push({x:from.x,y:61});
  if(from.x<46)points.push({x:from.x,y:61},{x:46,y:61});
  if(end.x<46)points.push({x:46,y:61},{x:end.x,y:61});
  else points.push({x:end.x,y:61});
 }
 points.push(end);return points;
}
