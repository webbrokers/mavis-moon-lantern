// Feet positions stay beside the important silhouettes, not over their faces/socket.
export const approaches={
 lantern:{x:46,y:81,face:1},
 ribbon:{x:48,y:80,face:1},
 ghost:{x:21,y:71,face:1},
 bell:{x:43,y:72,face:-1},
 pumpkin:{x:84,y:73,face:1},
 kitchen:{x:48,y:69,face:1},
 library:{x:91,y:69,face:1}
};
export const ribbonPosition={left:80,top:76.5};
export function actorHeight(y){return 24+12*Math.max(0,Math.min(1,(y-68)/26));}
export function spritePosition(frame,columns,rows){return `${(frame%columns)*100/(columns-1)}% ${Math.floor(frame/columns)*100/(rows-1)}%`;}

export const hallBoxes={
 lantern:[58,38,9,25],ribbon:[51.4,68.8,3.8,2.5],ghost:[26,35,11,13.5],
 bell:[41.8,46.7,2.8,3.4],kitchen:[44.5,38,7,20],library:[93,35,7,26]
};
