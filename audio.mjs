import {musicEvents,TICK_SECONDS} from './music-score.mjs';
// Original arranged detective waltz and procedural footsteps. No external audio downloads.
export class HallAudio {
 constructor(){this.started=false;this.config={sound:true,music:true,effects:true,musicVolume:.35};this.timer=null;this.beat=0;}
 async start(config){
  this.config={...this.config,...config};this.started=true;
  try{
   if(!this.ctx){
    const Audio=globalThis.AudioContext||globalThis.webkitAudioContext;if(!Audio)return;
    this.ctx=new Audio();this.master=this.ctx.createGain();this.musicBus=this.ctx.createGain();this.effectsBus=this.ctx.createGain();
    this.musicBus.connect(this.master);this.effectsBus.connect(this.master);this.master.connect(this.ctx.destination);
    this.noise=this.ctx.createBuffer(1,Math.ceil(this.ctx.sampleRate*.12),this.ctx.sampleRate);
    const data=this.noise.getChannelData(0);let seed=19;
    for(let i=0;i<data.length;i++){seed=(seed*16807)%2147483647;data[i]=((seed/2147483647)*2-1)*(1-i/data.length);}
   }
   await this.ctx.resume();this.apply(this.config);this.nextBeat=this.ctx.currentTime+.06;
   if(!this.timer)this.timer=setInterval(()=>this.schedule(),100);
  }catch{/* The game remains playable if audio is unavailable. */}
 }
 apply(config){this.config={...this.config,...config};if(!this.ctx)return;const t=this.ctx.currentTime;
  this.master.gain.setTargetAtTime(this.config.sound ? .7 : 0,t,.03);
  this.musicBus.gain.setTargetAtTime(this.config.music?this.config.musicVolume*.5:0,t,.08);
  this.effectsBus.gain.setTargetAtTime(this.config.effects ? .55 : 0,t,.02);
 }
 note(freq,time,duration,volume,bus,type='sine'){
  const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=type;o.frequency.value=freq;
  g.gain.setValueAtTime(0,time);g.gain.linearRampToValueAtTime(volume,time+.012);g.gain.exponentialRampToValueAtTime(.0001,time+duration);
  o.connect(g);g.connect(bus);o.start(time);o.stop(time+duration+.02);o.onended=()=>{o.disconnect();g.disconnect()};
 }
 schedule(){
  if(!this.ctx||this.ctx.state!=='running')return;
  if(this.nextBeat<this.ctx.currentTime-.2)this.nextBeat=this.ctx.currentTime+.04;
  while(this.nextBeat<this.ctx.currentTime+.2){
   if(this.config.sound&&this.config.music){
    for(const event of musicEvents(this.beat)){
     const t=this.nextBeat+(event.offset||0);
     if(event.noise)this.brush(t,event.volume,event.duration);
     else this.note(440*2**((event.midi-69)/12),t,event.duration,event.volume,this.musicBus,event.type);
    }
   }
   this.beat++;this.nextBeat+=TICK_SECONDS;
  }
 }
 brush(time,volume,duration){
  const source=this.ctx.createBufferSource(),filter=this.ctx.createBiquadFilter(),gain=this.ctx.createGain();
  source.buffer=this.noise;filter.type='bandpass';filter.frequency.value=1700;filter.Q.value=.65;
  gain.gain.setValueAtTime(volume,time);gain.gain.exponentialRampToValueAtTime(.0001,time+duration);
  source.connect(filter);filter.connect(gain);gain.connect(this.musicBus);source.start(time);source.stop(time+duration);
  source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect()};
 }

 step(){if(!this.ctx||this.ctx.state!=='running'||!this.config.sound||!this.config.effects)return;
  const t=this.ctx.currentTime,s=this.ctx.createBufferSource(),filter=this.ctx.createBiquadFilter(),g=this.ctx.createGain();
  s.buffer=this.noise;filter.type='lowpass';filter.frequency.value=850;g.gain.setValueAtTime(.12,t);g.gain.exponentialRampToValueAtTime(.0001,t+.09);
  s.connect(filter);filter.connect(g);g.connect(this.effectsBus);s.start();s.onended=()=>{s.disconnect();filter.disconnect();g.disconnect()};
  this.note(115,t,.075,.10,this.effectsBus,'triangle');
 }
 chime(freq){if(!this.ctx||this.ctx.state!=='running'||!this.config.sound||!this.config.effects)return;this.note(freq,this.ctx.currentTime,.4,.09,this.effectsBus);}
 suspend(){clearInterval(this.timer);this.timer=null;if(this.ctx)this.ctx.suspend().catch(()=>{});}
 resume(){if(this.started)return this.start(this.config);}
}
