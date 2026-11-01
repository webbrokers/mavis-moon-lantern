// A gesture-unlocked audio context also supports dialogue after asynchronous walking.
export class RecordedVoice {
 constructor(){this.clips=new Map();this.lookup=new Map();this.decoded=new Map();this.current=null;this.token=0;}
 unlock(){const Audio=globalThis.AudioContext||globalThis.webkitAudioContext;if(!Audio)return;if(!this.ctx)this.ctx=new Audio();this.ctx.resume().catch(()=>{});}
 async load(progress=()=>{}){
  try{
   const [catalog,manifest]=await Promise.all([fetch('dialogues.json?v=3').then(r=>r.json()),fetch('voices.json?v=6').then(r=>r.json())]);
   for(const [id,line]of Object.entries(catalog))if(manifest[id])this.lookup.set(line.who+'|'+line.text,manifest[id]);
   const pending=[...new Set(this.lookup.values())],total=pending.length;let done=0;
   await Promise.all(Array.from({length:6},async()=>{while(pending.length){const path=pending.pop();try{if(!this.clips.has(path)){const r=await fetch(path,{signal:AbortSignal.timeout(20000)});if(r.ok)this.clips.set(path,await r.arrayBuffer());}}catch{}finally{progress(++done,total);}}}));
   return total>0&&this.clips.size>=total;
  }catch{return false;}
 }
 stop(){this.token++;if(this.current){this.current.onended=null;try{this.current.stop();}catch{}this.current.disconnect();this.current=null;}this.onPlaying?.(false);}
 async play(text,who,enabled){
  this.stop();if(!enabled||!this.ctx)return;
  const path=this.lookup.get(who+'|'+text),bytes=this.clips.get(path);if(!bytes)return;const token=this.token;
  try{
   let buffer=this.decoded.get(path);if(!buffer){buffer=await this.ctx.decodeAudioData(bytes.slice(0));if(this.decoded.size>=12)this.decoded.delete(this.decoded.keys().next().value);this.decoded.set(path,buffer);}
   if(token!==this.token)return;
   const source=this.ctx.createBufferSource();source.buffer=buffer;source.connect(this.ctx.destination);this.current=source;
   source.onended=()=>{if(token===this.token)this.stop()};source.start();this.onPlaying?.(true);
  }catch{if(token===this.token)this.stop();}
 }
}
