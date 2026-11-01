import {kitchenFloor,kitchenPath,kitchenPoints} from './kitchen-layout.mjs';
import {hintKey} from './hints.mjs';
import {enterFullscreen} from './fullscreen.mjs';
import {rooms,items,lines,intro,act,newQuest,visible,hint,enterLine} from './world.mjs?v=16';
import {RecordedVoice} from './voice.mjs?v=18';
import {ambience,ambientReply} from './ambience.mjs?v=13';
import {floorPoint,planPath} from './navigation.mjs';
import {approaches,hallBoxes,actorHeight,spritePosition} from './scene-layout.mjs';
import {HallAudio} from './audio.mjs?v=8';
'use strict';
(() => {
const $ = s => document.querySelector(s);
const KEY = 'mavis-hall-draft-v1';
const fresh = () => ({version:1,started:false,storySeen:false,lanternSeen:false,ribbonTaken:false,ghostTalked:false,ribbonShown:false,completed:false,voice:true,reduced:false,sound:true,music:true,effects:true,musicVolume:.35});
let state=fresh();
try {const saved=JSON.parse(localStorage.getItem(KEY)); if(saved?.version===1) for(const k of Object.keys(state)) if(typeof saved[k]===typeof state[k]) state[k]=saved[k];} catch{}
try{if(!localStorage.getItem('mavis-recorded-voice-v1')){state.voice=true;localStorage.setItem('mavis-recorded-voice-v1','1');}}catch{}
let quest=newQuest();
try {const q=JSON.parse(localStorage.getItem('mavis-quest-v2'));if(q&&rooms[q.room]&&Array.isArray(q.bag)&&q.bag.every(x=>items[x])&&q.flags)quest=q;else if(state.ribbonTaken)quest.bag=['ribbon'];}catch{}
let selected=false, inventoryOpen=false, busy=false, moving=false, pos={x:39,y:86}, route=null, lastTime=0, hintLevel=0, lastHintKey='', lastSpeaker='Мэвис', lastLine='', audioCtx, storyActive=false, storyIndex=0, walkFrame=0, walkElapsed=0, pickupMotion=null, lastFootstep=-1;
const hallAudio=new HallAudio();
let conversationLines=null,conversationIndex=0,transition=null;
const story=intro.map(id=>[lines[id].who,lines[id].text]);
let menuItem=null;
const voicePlayer=new RecordedVoice();
voicePlayer.onPlaying=playing=>{hallAudio.apply({...state,musicVolume:state.musicVolume*(playing?.32:1)});$('#repeat').classList.toggle('speaking',playing);$('#repeat').dataset.playing=String(playing);};
const actor=$('#actor'),scene=$('#scene'), menu=$('#actions');
const hallObjects={
 lantern:{name:'Лунный алтарь',x:62,y:84,menu:[['◎','Осмотреть','look']]},
 ribbon:{name:'Фиолетовая лента',x:70,y:88,menu:[['◎','Осмотреть','look'],['✋','Взять','take']]},
 ghost:{name:'Администратор',x:33,y:69,menu:[['◌','Поговорить','talk']]},
 bell:{name:'Звонок',x:42,y:69,menu:[['◎','Осмотреть','look'],['♫','Позвонить','ring']]},
 kitchen:{name:'Кухня',x:48,y:69,menu:[['➜','На кухню','enter']]},
 library:{name:'Библиотека',x:91,y:69,menu:[['➜','В библиотеку','enter']]}
};
let objects=hallObjects;
const itemOrder=['ribbon','ladle','key','lamp','lens','flower','flowerLamp','crystal'];
const itemArt=id=>`<span aria-hidden="true" class="item-art art-${id}"></span>`;
const ambientVisits={};
for(const [id,entry] of Object.entries(ambience)){
 objects[id]={name:entry.name,menu:entry.menu||[['◎','Посмотреть','look']]};
 let button=scene.querySelector('[data-object="'+id+'"]');
 if(!button){button=document.createElement('button');scene.insertBefore(button,actor);}
 button.className='hotspot ambient-hotspot';button.dataset.object=id;button.setAttribute('aria-label',entry.name);
 const [left,top,width,height]=entry.box;Object.assign(button.style,{left:left+'%',top:top+'%',width:width+'%',height:height+'%'});
}
function discover(id,action){
 cancelWalk();menu.hidden=true;
 if(action==='apply'){selected=false;inventoryOpen=false;render();speak('wrong');return;}
 const key=id+':'+action,count=ambientVisits[key]||0;ambientVisits[key]=count+1;
 if(id==='guestBook'&&(quest.flags.ghostTalkStage||0)>=2){quest.flags.guestBookRead=true;save();speak('guestNote');}else say(ambientReply(id,action,count));
 const target=scene.querySelector('[data-object="'+id+'"]');
 target.classList.remove('discovered');void target.offsetWidth;target.classList.add('discovered');
 setTimeout(()=>target.classList.remove('discovered'),1200);
 if(action!=='look'){
  chime(action==='tickle'?440+count%3*110:660);
  const effect=document.createElement('span');effect.className='ambient-reaction';effect.textContent=action==='tickle'?'Хи-хи!':id==='keys'?'♫':id==='flowers'?'❀':id==='candles'?'≈':'✦';
  const [x,y,w]=ambience[id].box;effect.style.left=(x+w/2)+'%';effect.style.top=Math.max(5,y)+'%';scene.append(effect);setTimeout(()=>effect.remove(),1300);
 }
}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));localStorage.setItem('mavis-quest-v2',JSON.stringify(quest))}catch{}}
function speech(text){voicePlayer.play(text,lastSpeaker,state.sound&&state.voice&&state.started&&$('#intro').hidden);}
function say(text,who='Мэвис'){lastLine=text;lastSpeaker=who;$('#line').textContent=text;$('#speaker').textContent=who;$('.speaker-mark').textContent=who==='Мэвис'?'М':who.slice(0,1);$('.speaker-mark').classList.toggle('other-speaker',who!=='Мэвис');speech(text);$('#repeat').hidden=!state.voice||!state.sound||!voicePlayer.lookup.has(who+'|'+text)}
function speak(id){
 if(Array.isArray(id)){conversationLines=id;conversationIndex=0;cancelWalk();storyActive=true;$('#story-controls').hidden=false;$('#story-skip').hidden=true;showConversation();return;}
 const line=lines[id];if(line)say(line.text,line.who);
}
function showConversation(){speak(conversationLines[conversationIndex]);$('#story-progress').textContent=`${conversationIndex+1} / ${conversationLines.length}`;$('#story-next').textContent=conversationIndex===conversationLines.length-1?'Понятно ✓':'Дальше →';}
function roomGreeting(){speak(enterLine(quest));save();}

function chime(freq=660){hallAudio.chime(freq)}
const assetsReady={walk:false,pickup:false};
let gameReady=false;
const loadedImages=new Map();
const loadingAssets=[['Холл','assets/lobby-v4.png'],['Мэвис','assets/mavis.png'],['Кнопки и рюкзак','assets/ui-atlas-v2.png'],['Находки','assets/items-atlas.png'],['Ходьба','assets/mavis-walk-grok.png','walk'],['Подбор предмета','assets/mavis-pickup-grok.png','pickup']];
loadingAssets.push(['Ночной отель','assets/title-hotel.png'],['Лента','assets/ribbon.png'],['Следы','assets/moon-tracks.png'],['Кристалл','assets/moon-crystal.png']);
loadingAssets.push(...Object.entries(rooms).filter(([id])=>id!=='hall').map(([id,r])=>[r.name,r.background]));
async function preloadGame(){
 gameReady=false;$('#start').disabled=true;$('#load-retry').hidden=true;
 let done=0;$('#load-progress').value=0;$('#load-status').textContent='Загружаем отель…';
 $('#load-detail').textContent='Загружаем записанные голоса…';
 const voiceReady=await voicePlayer.load((done,total)=>{$('#load-progress').value=Math.round(done/total*50);$('#load-detail').textContent=`Голоса: ${done} из ${total}`;});
 const results=await Promise.allSettled(loadingAssets.map(async([name,url,sprite])=>{
  if(!loadedImages.has(url)){
   const image=new Image();image.src=url;let timer;
   try{await Promise.race([image.decode(),new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('timeout')),30000)})]);loadedImages.set(url,image)}finally{clearTimeout(timer)}
  }
  if(sprite){assetsReady[sprite]=true;actor.classList.add(sprite+'-ready')}
  done++;$('#load-progress').value=50+Math.round(done/loadingAssets.length*50);$('#load-detail').textContent=`Готово: ${done} из ${loadingAssets.length}`;
 }));
 if(!voiceReady||results.some(r=>r.status==='rejected')){
  $('#load-status').textContent='Не всё удалось загрузить';$('#load-detail').textContent='Проверь соединение и попробуй ещё раз.';$('#load-retry').hidden=false;return;
 }
 gameReady=true;$('#load-progress').value=100;$('#load-status').textContent='Отель готов — 100%';$('#load-detail').textContent='Комнаты, анимации и голоса готовы';$('#start').disabled=false;
}
$('#load-retry').addEventListener('click',preloadGame);
preloadGame();
function placeActor(){actor.style.left=pos.x+'%';actor.style.bottom=(100-pos.y)+'%';actor.style.height=(actorHeight(pos.y)*(quest.room==='kitchen'?1.3:1))+'%';}
function placeItemMenu(){
 const slot=$('#slots .selected'),popup=$('#inventory-actions');if(!slot||!inventoryOpen)return;
 const r=slot.getBoundingClientRect(),panel=$('.inventory').getBoundingClientRect();
 const half=popup.offsetHeight/2;
 popup.style.top=Math.max(half+8,Math.min(panel.height-half-8,r.top-panel.top+r.height/2))+'px';
}
function unsuitableItem(){return lines.wrong.text;}
function makeRoom(from=null){
 cancelWalk();menu.hidden=true;selected=false;inventoryOpen=false;menuItem=null;
 scene.querySelectorAll('[data-object],.kitchen-foreground').forEach(el=>el.remove());
 if(quest.room==='kitchen'){const front=document.createElement('img');front.src='assets/kitchen.png';front.alt='';front.className='kitchen-foreground';scene.append(front);}
 const hall=quest.room==='hall',room=rooms[quest.room];
 $('.background').src=hall?'assets/lobby-v4.png':room.background;
 $('.background').alt=room.name;scene.setAttribute('aria-label',room.name);scene.dataset.room=quest.room;
 $('.room-label').textContent=room.name;$('.ghost-motion').hidden=!hall;
 objects=hall?hallObjects:room.objects;
 for(const [id,obj]of Object.entries(objects)){
  const el=document.createElement('button');el.className='hotspot '+(hall?id:'world-hotspot');el.dataset.object=id;el.setAttribute('aria-label',obj.name);
  const box=hall?(hallBoxes[id]||ambience[id]?.box):obj.box;
  if(box){const [x,y,w,h]=box;Object.assign(el.style,{left:x+'%',top:y+'%',width:w+'%',height:h+'%'});}
  if(hall&&id==='ribbon')el.innerHTML=itemArt('ribbon');
  else if(hall&&id==='bell')el.innerHTML='<svg><use href="#bell-art"/></svg>';
  else if(obj.icon){el.classList.add('world-item');el.innerHTML=itemArt(obj.item||({highKey:'key',atticCrystal:'crystal',atticLamp:'flowerLamp'}[id]));}
  scene.insertBefore(el,actor);
 }
 const arrival=from?(hall?(from==='kitchen'?{x:48,y:69}:{x:88,y:69}):(from==='hall'||from==='library'||from==='greenhouse'&&quest.room==='attic'?{x:22,y:68}:{x:79,y:68})):null;
 pos=quest.room==='kitchen'?{x:32,y:61}:arrival||(hall?{x:39,y:87}:{x:39,y:79});placeActor();render();
}
function render(){
 for(const el of scene.querySelectorAll('[data-object]'))el.hidden=!visible(quest,el.dataset.object);
 $('#slots').innerHTML=Array.from({length:5},(_,i)=>{const id=quest.bag[i];return id?`<button class="slot ${selected===id||menuItem===id&&inventoryOpen?'selected':''}" data-item="${id}" aria-label="${items[id].name}" aria-pressed="${selected===id}">${itemArt(id)}</button>`:`<button class="slot" disabled aria-label="Пустая ячейка ${i+1}"></button>`}).join('');
 $('.game-frame').classList.remove('item-selected');$('#inventory-actions').hidden=!inventoryOpen;requestAnimationFrame(placeItemMenu);
 $('#bag-tip').innerHTML=selected?'Выбери цель<br>или другую вещь':'Нажми на вещь,<br>чтобы выбрать';
 $('#objective').textContent=quest.won?'Тайна раскрыта':quest.bag.includes('crystal')?'Вернуть кристалл в холл':quest.flags.dragonMet?'Помочь мышатам':'Найти лунный кристалл';
 $('#sound').classList.toggle('active',state.sound);$('#sound').setAttribute('aria-label',state.sound?'Выключить весь звук':'Включить весь звук');$('#sound').setAttribute('aria-pressed',String(state.sound));$('#sound').textContent=state.sound?'♫ Музыка и звуки включены':'♫ Музыка и звуки выключены';
 $('#voice-setting').checked=state.voice;$('#repeat').hidden=!state.voice||!state.sound||!voicePlayer.lookup.has(lastSpeaker+'|'+lastLine);
 $('#music-setting').checked=state.music;$('#effects-setting').checked=state.effects;$('#music-volume').value=state.musicVolume;$('#motion-setting').checked=state.reduced;
 document.body.classList.toggle('reduced',state.reduced);hallAudio.apply(state);
 scene.classList.toggle('celebrating',quest.won&&quest.room==='hall');
 let interior=$('#open-interior');if(!interior){interior=document.createElement('div');interior.id='open-interior';interior.setAttribute('aria-hidden','true');scene.insertBefore(interior,actor);}interior.className=quest.room==='kitchen'?'fridge-interior':'cabinet-interior';interior.innerHTML=quest.room==='kitchen'?'<span class="jelly">••</span>':'';interior.hidden=!(quest.room==='kitchen'&&quest.flags.fridgeOpen||quest.room==='library'&&quest.flags.cabinetOpen);
 let tracks=$('#moon-tracks');if(!tracks){tracks=document.createElement('div');tracks.id='moon-tracks';tracks.setAttribute('aria-hidden','true');tracks.innerHTML='<img src="assets/moon-tracks.png" alt="">';scene.append(tracks);}tracks.hidden=quest.room!=='greenhouse'||!quest.flags.tracks;
 let gem=$('#altar-gem');if(!gem){gem=document.createElement('span');gem.id='altar-gem';gem.innerHTML='<img src="assets/moon-crystal.png" alt="">';gem.setAttribute('aria-hidden','true');scene.append(gem);}gem.hidden=!(quest.won&&quest.room==='hall');
}
$('#slots').addEventListener('click',e=>{const slot=e.target.closest('[data-item]');if(!slot||busy||storyActive)return;const id=slot.dataset.item;cancelWalk();menu.hidden=true;
 if(selected&&selected!==id){const reply=act(quest,id,'apply',selected);selected=false;inventoryOpen=false;menuItem=null;save();render();speak(reply);return;}
 selected=false;inventoryOpen=menuItem===id?!inventoryOpen:true;menuItem=id;render();
});
function cancelWalk(){route=null;moving=false;actor.classList.remove('walking');$('#destination').hidden=true}
function walk(x,y,callback,exiting=false){
 if(busy||storyActive)return;menu.hidden=true;
 if(quest.room==='hall'&&y>82)x=Math.max(25,Math.min(83,x));
 const points=quest.room==='hall'?planPath(pos,floorPoint(x,y)):quest.room==='kitchen'?kitchenPath(pos,{x,y},exiting):exiting?[roomFloor(pos.x,70),{x,y}]:[roomFloor(x,y)];route={points,callback};moving=true;walkElapsed=0;walkFrame=0;
 actor.classList.add('walking');faceTarget(points[0]);lastFootstep=-1;$('.walk-sprite').style.backgroundPosition='0% 0%';
 const end=points.at(-1),dot=$('#destination');dot.style.left=end.x+'%';dot.style.top=end.y+'%';dot.hidden=false;
}
function roomFloor(x,y){if(quest.room==='kitchen')return kitchenFloor(x,y);return {x:Math.max(y>75?42:36,Math.min(73,x)),y:Math.max(68,Math.min(91,y))};}
function faceTarget(p){if(Math.abs(p.x-pos.x)>.1)actor.classList.toggle('facing-left',p.x<pos.x)}
function animate(now){
 const dt=Math.min((now-lastTime)/1000,.06)||0;lastTime=now;
 if(transition){
  const age=now-transition.start;
  if(age>=500&&!transition.switched){transition.switched=true;const from=quest.room;quest.room=transition.to;makeRoom(from);save();}
  const opacity=age<500?Math.floor(age/100+1)/5:Math.max(0,1-Math.floor((age-500)/100)/5);
  $('#scene-fade').style.opacity=opacity;
  if(age>=1000){transition=null;busy=false;$('#scene-fade').hidden=true;roomGreeting();}
 }
 if(route){
  const target=route.points[0],dx=target.x-pos.x,dy=target.y-pos.y;
  const distance=Math.hypot(dx,dy),step=18*dt*actorHeight(pos.y)/36;
  if(distance<=step+.1){
   pos={...target};route.points.shift();
   if(!route.points.length){const cb=route.callback;cancelWalk();cb?.()}else faceTarget(route.points[0]);
  }else{pos.x+=dx/distance*step;pos.y+=dy/distance*step;}
  placeActor();
 }
 if(moving){
  walkElapsed+=dt;walkFrame=Math.floor(walkElapsed*24)%28;
  $('.walk-sprite').style.backgroundPosition=spritePosition(walkFrame,7,4);
  const stepIndex=Math.floor(walkElapsed*24/14);if(stepIndex!==lastFootstep){lastFootstep=stepIndex;hallAudio.step();}
 }
 if(pickupMotion){
  pickupMotion.elapsed+=dt;const frame=Math.min(47,Math.floor(pickupMotion.elapsed*12));
  $('.pickup-sprite').style.backgroundPosition=spritePosition(frame,8,6);
  if(frame>=20&&!pickupMotion.collected){pickupMotion.collected=true;pickupMotion.reply=act(quest,pickupMotion.id,'take');save();render();chime(880);}
  if(pickupMotion.elapsed>=4){const reply=pickupMotion.reply;pickupMotion=null;actor.classList.remove('picking-up');busy=false;speak(reply);}
 }
 requestAnimationFrame(animate);
}
function pose(name,ms,callback){busy=true;actor.classList.add(name);setTimeout(()=>{actor.classList.remove(name);busy=false;callback?.()},ms)}
function perform(id,action){
 if(busy)return;
 if(quest.room==='hall'&&ambience[id]){discover(id,action);return;}
 const obj=objects[id];if(!obj)return;
 const destination=quest.room==='hall'&&['kitchen','library'].includes(id)?id:obj.to;
 if(destination&&action!=='apply'){
  const p=quest.room==='hall'?approaches[id]:quest.room==='kitchen'?{x:12,y:53}:{x:obj.box[0]+obj.box[2]/2,y:68};
  walk(p.x,p.y,()=>{busy=true;voicePlayer.stop();selected=false;inventoryOpen=false;$('#scene-fade').hidden=false;$('#scene-fade').style.opacity=0;transition={to:destination,start:performance.now(),switched:false};},true);return;
 }
 const roomPoints={chef:{x:46,y:69,face:-1},ladle:{x:46,y:69,face:-1},lamp:{x:48,y:69,face:-1},librarian:{x:42,y:70,face:-1},dragon:{x:49,y:73,face:1},book:{x:62,y:71,face:-1},bats:{x:69,y:72,face:1}};
 const point=quest.room==='hall'?approaches[id]:((quest.room==='kitchen'&&kitchenPoints[id])||roomPoints[id]||obj.point||{x:Math.max(36,Math.min(73,obj.box[0]-8)),y:72,face:1});
 walk(point.x,point.y,()=>{
  actor.classList.toggle('facing-left',point.face<0);
  if(action==='take'&&visible(quest,id)&&assetsReady.pickup){busy=true;pickupMotion={elapsed:0,collected:false,id};$('.pickup-sprite').style.backgroundPosition='0% 0%';actor.classList.add('picking-up');return;}
  const previous=quest.room,wasWon=quest.won;
  const reply=act(quest,id,action,selected);selected=false;inventoryOpen=false;menuItem=null;save();
  if(quest.room!==previous)makeRoom();else render();speak(reply);
  if(action==='ring'||['combined','keyGot','cabinetOpen','exchange','win'].includes(reply))chime(880);
  if(!wasWon&&quest.won)pose('happy',1100,()=>{$('#complete-dialog').showModal();});
 });
}
function openActions(id,el){
 cancelWalk();const obj=objects[id];let options=obj.menu;
 if(!options)options=obj.talk?[['◌','Поговорить','talk'],['◎','Посмотреть','look']]:obj.to?[['➜',obj.name,'enter']]:[['◎','Посмотреть','look'],...(obj.item?[['✋','Взять','take']]:obj.action?[['✦',obj.action,'play']]:[])];
 menu.replaceChildren();for(const [icon,label,action]of options){const b=document.createElement('button');b.textContent=icon+' '+label;b.addEventListener('click',e=>{e.stopPropagation();menu.hidden=true;perform(id,action)});menu.append(b)}
 const r=el.getBoundingClientRect(),s=scene.getBoundingClientRect();menu.hidden=false;const x=r.left-s.left+r.width/2,half=menu.offsetWidth/2;
 menu.style.left=Math.max(half+8,Math.min(s.width-half-8,x))+'px';menu.style.top=Math.max(menu.offsetHeight+10,r.top-s.top-8)+'px';
}
scene.addEventListener('click',e=>{
 if(!state.started||busy||storyActive)return;
 const el=e.target.closest('[data-object]');
 if(el){e.stopPropagation();const id=el.dataset.object;if(inventoryOpen){inventoryOpen=false;render();}if(selected)perform(id,'apply');else if(quest.room==='hall'&&ambience[id]&&!ambience[id].menu)perform(id,'look');else openActions(id,el);return;}
 if(e.target.closest('button')||e.target.closest('#actions'))return;
 if(selected||inventoryOpen){selected=false;inventoryOpen=false;menuItem=null;render();speak('cancel');return;}
 menu.hidden=true;const r=scene.getBoundingClientRect();walk((e.clientX-r.left)/r.width*100,(e.clientY-r.top)/r.height*100);
});
$('#hint').addEventListener('click',e=>{e.stopPropagation();if(busy||storyActive)return;cancelWalk();menu.hidden=true;const key=quest.room+':'+hintKey(quest);if(key!==lastHintKey){lastHintKey=key;hintLevel=0;}say(hint(quest,hintLevel++));});
$('#inspect-item').addEventListener('click',()=>{if(busy||storyActive||!menuItem)return;const id=menuItem;inventoryOpen=false;selected=false;menuItem=null;render();speak(items[id].look);});
$('#apply-item').addEventListener('click',()=>{if(busy||storyActive||!menuItem)return;inventoryOpen=false;selected=menuItem;menuItem=null;render();speak('select');});
$('#repeat').addEventListener('click',()=>{if(lastLine)say(lastLine,lastSpeaker)});
function toggleVoice(value){state.voice=value;save();render();if(!value)voicePlayer.stop();else {voicePlayer.unlock();speech(lastLine);}}
$('#sound').addEventListener('click',()=>{state.sound=!state.sound;save();render();hallAudio.start(state);if(!state.sound)voicePlayer.stop()});
for(const [id,key] of [['music-setting','music'],['effects-setting','effects']])$('#'+id).addEventListener('change',e=>{state[key]=e.target.checked;save();render();hallAudio.start(state)});
$('#music-volume').addEventListener('input',e=>{state.musicVolume=Number(e.target.value);save();hallAudio.apply(state)});
$('#voice-setting').addEventListener('change',e=>toggleVoice(e.target.checked));$('#motion-setting').addEventListener('change',e=>{state.reduced=e.target.checked;save();render()});
function updateFullscreen(){
 const active=!!(document.fullscreenElement||document.webkitFullscreenElement);
 $('#fullscreen').textContent=active?'⊡':'⛶';$('#fullscreen').setAttribute('aria-label',active?'Выйти из полного экрана':'Развернуть на весь экран');$('#fullscreen').title=active?'Выйти из полного экрана':'На весь экран';
}
$('#fullscreen').addEventListener('click',async()=>{
 try{
  if(document.fullscreenElement||document.webkitFullscreenElement){const exit=document.exitFullscreen||document.webkitExitFullscreen;if(exit)await exit.call(document);}
  else{if(!await enterFullscreen())throw new Error('unavailable');}
  updateFullscreen();
 }catch{$('#fullscreen-help').showModal()}
});
document.addEventListener('fullscreenchange',updateFullscreen);document.addEventListener('webkitfullscreenchange',updateFullscreen);
$('#settings').addEventListener('click',()=>{if(busy)return;cancelWalk();menu.hidden=true;selected=false;inventoryOpen=false;render();voicePlayer.stop();$('#settings-dialog').showModal()});
for(const b of document.querySelectorAll('[data-close]'))b.addEventListener('click',()=>{$('#'+b.dataset.close).close();render()});
$('#reset').addEventListener('click',()=>{$('#settings-dialog').close();$('#reset-dialog').showModal()});
$('#confirm-reset').addEventListener('click',()=>{cancelWalk();storyActive=false;$('#story-controls').hidden=true;conversationLines=null;state=fresh();quest=newQuest();makeRoom();voicePlayer.stop();selected=false;inventoryOpen=false;hintLevel=0;lastHintKey='';if('speechSynthesis'in window)speechSynthesis.cancel();save();render();pos={x:39,y:86};placeActor();hallAudio.suspend();$('#reset-dialog').close();$('#intro').hidden=false;say('Скоро праздник! Почему лунный алтарь погас?')});
function showStoryLine(){
 const [who,text]=story[storyIndex];say(text,who);
 $('#story-progress').textContent=`${storyIndex+1} / ${story.length}`;
 $('#story-next').textContent=storyIndex===story.length-1?'Искать улики →':'Дальше →';
 $('#objective').textContent='Вечер перед Хэллоуином';
}
function beginStory(){conversationLines=null;$('#story-skip').hidden=false;cancelWalk();selected=false;inventoryOpen=false;menu.hidden=true;storyActive=true;storyIndex=0;render();$('#story-controls').hidden=false;showStoryLine();}
function finishStory(){storyActive=false;state.storySeen=true;save();$('#story-controls').hidden=true;render();speak('startMystery');}
$('#story-next').addEventListener('click',()=>{
 if(conversationLines){if(++conversationIndex<conversationLines.length)showConversation();else {conversationLines=null;storyActive=false;$('#story-controls').hidden=true;render();}return;}
 if(++storyIndex>=story.length)finishStory();else showStoryLine();
});
$('#story-skip').addEventListener('click',finishStory);
$('#replay-story').addEventListener('click',()=>{$('#settings-dialog').close();quest.room='hall';makeRoom();beginStory()});
$('#start').addEventListener('click',()=>{if(!gameReady)return;void enterFullscreen().then(updateFullscreen);voicePlayer.unlock();state.started=true;save();$('#intro').hidden=true;hallAudio.start(state);chime(523);if(!state.storySeen)beginStory();else roomGreeting()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!busy){selected=false;inventoryOpen=false;menu.hidden=true;cancelWalk();render()}});
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelWalk();hallAudio.suspend();voicePlayer.stop()}else if(state.started&&$('#intro').hidden)hallAudio.resume()});
window.addEventListener('resize',()=>{menu.hidden=true;requestAnimationFrame(placeItemMenu)});
makeRoom();placeActor();render();say('Скоро праздник! Почему лунный алтарь погас?');requestAnimationFrame(animate);
})();
