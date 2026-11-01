// Original miniature: a mischievous 3/4 detective waltz, 32 bars / 60 seconds.
// Six eighth-note ticks per bar at 96 quarter notes per minute.
export const TICK_SECONDS=60/96/2;
const melody=[
 [74,0,77,81,77,76],[74,0,72,74,77,0],[72,0,69,72,77,76],[72,0,71,72,76,0],
 [74,77,79,0,77,74],[77,0,76,74,72,0],[73,76,81,0,79,76],[74,0,0,69,72,73],
 [77,0,81,84,81,77],[79,0,77,76,74,0],[81,0,79,77,76,77],[79,0,76,72,76,0],
 [79,81,82,0,81,79],[77,0,74,69,74,77],[76,0,73,76,81,79],[77,76,74,0,0,0],
 [74,0,0,77,0,0],[72,0,0,74,0,0],[69,0,0,72,0,0],[67,0,0,72,0,0],
 [70,0,0,74,0,0],[69,0,0,74,0,0],[73,0,76,0,73,0],[74,0,0,0,0,0],
 [74,77,81,0,77,76],[74,0,77,79,77,74],[77,81,84,0,81,77],[79,0,76,72,76,79],
 [79,82,81,0,79,77],[77,0,76,74,72,69],[73,76,81,0,79,73],[74,0,0,0,0,0]
];
const harmony=[[50,57,62,65],[46,53,58,62],[41,48,57,60],[48,55,60,64],[43,50,58,62],[50,57,62,65],[45,52,61,64],[50,57,62,65]];
export const SCORE_TICKS=melody.length*6;
export function musicEvents(tick){
 const beat=((tick%SCORE_TICKS)+SCORE_TICKS)%SCORE_TICKS;
 const bar=Math.floor(beat/6),step=beat%6,section=Math.floor(bar/8),chord=harmony[bar%8],events=[];
 const tone=(midi,duration,volume,type='sine',offset=0)=>events.push({midi,duration,volume,type,offset});
 const n=melody[bar][step],quiet=section===2;
 if(n){
  tone(n-(quiet?12:0),quiet?.8:.42,quiet?.10:.135,section===1?'triangle':'sine');
  if(!quiet)tone(n+12,.24,.018); // Small bell overtone, never a piercing lead.
 }
 if(step===0)tone(chord[0],.5,quiet?.10:.17,'triangle');
 if(step===2||step===4){
  for(const note of chord.slice(1))tone(note,.28,quiet?.022:.040,'triangle',.008);
 }
 if(section===1&&step===5)tone(chord[1]+12,.2,.04);
 if(section===3&&step===3)tone(chord[2]+12,.3,.045);
 if((section===1||section===3)&&(step===2||step===5))events.push({noise:true,duration:.045,volume:.018,offset:.008});
 // Leave the final half bar open so the beginning returns naturally.
 return bar===31&&step>=3?[]:events;
}
