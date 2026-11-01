// One source for the five-room quest, inventory and recorded Russian dialogue.
export const lines={};
const L=(id,text,who='Мэвис')=>(lines[id]={text,who},id);
export const intro=[
 L('intro1','Вечер перед Хэллоуином. В отеле зажглись тыквы, а гости готовятся к празднику.','Рассказчик'),
 L('intro2','Странно… Лунный алтарь погас. Куда же делся его кристалл?'),
 L('intro3','Ещё недавно он был здесь! Без кристалла праздничные огни не зажгутся.','Привидение'),
 L('intro4','Я помогу! Осмотрю алтарь, поищу следы и расспрошу гостей. Каждая мелочь может стать уликой.')];
L('welcome','В отеле всё кажется обычным. Но где-то здесь прячется разгадка.');
L('wrong','Не подходит. Сохраню эту вещь — она ещё пригодится!');
L('wrongFunny','Хорошая идея, но волшебство сегодня работает по другим правилам!');
L('select','Теперь выбери предмет в комнате или другую вещь в рюкзаке.');
L('cancel','Вещь снова в рюкзаке.');
L('full','Рюкзак полон. Попробую сначала применить одну из находок.');
L('already','Это уже у меня. Продолжим поиски!');
L('altar','Гнездо в алтаре пустое! Здесь должен быть лунный кристалл.');
L('ghost','Ах да, теперь помню! Маленький гость с таким бантиком искал светильник. Потом он убежал на кухню.','Привидение');
L('ghostKnown','Значит, наш гость помогал малышам! Хорошо бы найти для них другой свет.','Привидение');
L('bell','Дзинь! Привидение на связи! Чем могу помочь?','Привидение');
L('bellLook','Звонок для гостей. Интересно, привидения тоже вздрагивают?');
L('ribbonFound','Фиолетовый бантик… Он зацепился за листья. Интересно, кто его потерял?');
L('chef','Маленький дракон искал фонарик. Возьми пустой со стола. А ключ со звездой открывает шкаф в библиотеке.','Повар');
L('chefRibbon','Этот бантик я видел у дракончика! Он очень спешил помочь друзьям.','Повар');
L('keyHigh','Ключ слишком высоко. Чем бы его подцепить?');
L('keyGot','Получилось! Ключ у меня, а половник верну повару.');
L('fridge','В холодильнике дрожит желе. Не бойся, желе, я просто смотрю!');
L('oven','Печенье почти готово! Пахнет тыквой и корицей.','Повар');
L('cabinetLocked','На замке звёздочка. Нужен ключ с таким же знаком.');
L('cabinetOpen','Ключ подошёл! В шкафу лежит лунная линза.');
L('librarian','У лунного света много секретов. Некоторые видны только через особое стекло.','Библиотекарь');
L('book','Лунный цветок распускается в сумерках и светится всю ночь. К рассвету его лепестки закрываются.','Библиотекарь');
L('singing','Тише, книжки! Это библиотека, а не хор привидений.','Библиотекарь');
L('beam','Здесь лунный свет особенно яркий. Интересно, что покажет линза?');
L('tracks','Линза проявила маленькие следы. Они ведут на чердак!');
L('plant','Этот цветок светится сам по себе. Возьму один, остальные пусть растут.');
L('greenPumpkin','Апчхи! Кажется, у тыквы щекочет нос от цветочной пыльцы.');
L('combined','Получилось! Теперь у меня маленький кусочек лунного света.');
L('dragon','Я взял кристалл, потому что мышата боялись темноты. Без света они не уснут.','Дракончик');
L('dragonRibbon','Ой, это кусочек моего бантика! Я зацепился за алтарь.','Дракончик');
L('crystalWait','Кристалл нужен для праздника. Но сначала найдём другой свет для малышей.');
L('exchange','Спасибо! Теперь мышатам не страшно. Вот кристалл. В следующий раз я сначала спрошу!','Дракончик');
L('bats','Три маленьких носика! Тише, малыши засыпают.');
L('chest','Здесь мягкие одеяла. Даже самые храбрые монстры любят уют.');
L('win','Тайна раскрыта! Кристалл вернулся, мышата спят, и теперь всем светло!');
L('ending','Праздничные огни зажглись. Мэвис раскрыла тайну и помогла друзьям. Счастливого Хэллоуина!','Рассказчик');
L('outside','Как хорошо на улице! Но сейчас нам туда не надо — загадка ждёт внутри отеля.');
L('hintHall','Сегодня в холле чего-то не хватает. Присмотрюсь внимательнее.');
L('hintKey','На кухне возьми половник и примени его к ключу на высокой полке.');
L('hintCabinet','Ключ со звездой подходит к шкафу в библиотеке.');
L('hintFlower','Возьми пустой фонарик на кухне и лунный цветок в оранжерее.');
L('hintCombine','Выбери цветок, нажми «Применить», затем нажми на пустой фонарик в рюкзаке.');
L('hintDragon','Отнеси цветочный фонарик дракончику на чердак.');
L('hintReturn','Вернись в холл и примени кристалл к лунному алтарю.');
export const items={
 ribbon:{name:'Фиолетовая лента',icon:'🎀',look:L('itemRibbon','Кусочек фиолетового бантика. Кто-то потерял его возле алтаря.','Рассказчик')},
 ladle:{name:'Половник',icon:'🥄',look:L('itemLadle','Длинная ручка с крючком. Можно достать что-нибудь с высокой полки.','Рассказчик')},
 key:{name:'Ключ со звездой',icon:'🗝️',look:L('itemKey','Маленький ключ со звездой. Такой же знак есть на библиотечном шкафу.','Рассказчик')},
 lamp:{name:'Пустой фонарик',icon:'🏮',look:L('itemLamp','Фонарик целый, но внутри темно. Ему нужен безопасный источник света.','Рассказчик')},
 lens:{name:'Лунная линза',icon:'🔎',look:L('itemLens','В лунном свете эта линза показывает невидимые следы.','Рассказчик')},
 flower:{name:'Лунный цветок',icon:'🪷',look:L('itemFlower','Прохладные лепестки светятся даже в тени. И совсем не обжигают пальцы.','Рассказчик')},
 flowerLamp:{name:'Цветочный фонарик',icon:'🌸',look:L('itemFlowerLamp','Мягкий свет на всю ночь. То, что нужно испуганным мышатам.','Рассказчик')},
 crystal:{name:'Лунный кристалл',icon:'💎',look:L('itemCrystal','Лунный кристалл. Теперь можно вернуть его в алтарь и зажечь праздник!','Рассказчик')}
};
const O=(name,box,line,extra={})=>({name,box,line,...extra});
const door=(name,box,to)=>O(name,box,null,{to});
export const rooms={
 hall:{name:'Холл отеля',background:'assets/lobby-v4.png',objects:{}},
 kitchen:{name:'Кухня',background:'assets/kitchen.png',objects:{
 hall:door('В холл',[3,16,12,34],'hall'),chef:O('Повар-мумия',[22,26,13,16],'chef',{talk:true}),
 oven:O('Тыквенное печенье',[42,28,15,13],'oven'),fridge:O('Холодильник',[81,20,13,30],'fridge',{action:'Открыть'}),
 highKey:O('Ключ на полке',[58,23,5.85,5.85],'keyHigh',{icon:'🗝️',point:{x:63,y:70}}),
 ladle:O('Половник',[76,49,4.5,6],'itemLadle',{item:'ladle',icon:'🥄'}),
 lamp:O('Пустой фонарик',[69,33,4.5,7],'itemLamp',{item:'lamp',icon:'🏮'})}},
 library:{name:'Библиотека',background:'assets/library.png',objects:{
 hall:door('В холл',[5,16,12,38],'hall'),greenhouse:door('В оранжерею',[83,14,14,41],'greenhouse'),
 librarian:O('Библиотекарь',[24,19,13,27],'librarian',{talk:true}),cabinet:O('Шкаф со звездой',[63,20,13,35],'cabinetLocked'),
 lens:O('Лунная линза',[67,46,8,10],'itemLens',{item:'lens',icon:'🔎'}),
 book:O('Книга о лунных цветах',[38,34,22,14],'book'),books:O('Поющие книги',[46,18,12,21],'singing',{action:'Послушать'})}},
 greenhouse:{name:'Оранжерея',background:'assets/greenhouse.png',objects:{
 library:door('В библиотеку',[3,23,12,33],'library'),attic:door('На чердак',[85,25,14,33],'attic'),
 beam:O('Пятно лунного света',[38,53,18,14],'beam'),flower:O('Лунный цветок',[64,43,10,13],'plant',{item:'flower',icon:'🪷'}),
 greenPumpkin:O('Тыква в цветах',[27,44,8,7],'greenPumpkin',{action:'Пощекотать'})}},
 attic:{name:'Чердак',background:'assets/attic.png',objects:{
 greenhouse:door('В оранжерею',[4,17,16,39],'greenhouse'),dragon:O('Дракончик',[57,34,13,17],'dragon',{talk:true}),
 bats:O('Мышата',[78,38,17,11],'bats'),chest:O('Сундук с одеялами',[29,40,22,13],'chest'),
 atticCrystal:O('Подвешенный кристалл',[80.5,24,4.5,8],'crystalWait',{icon:'💎'}),
 atticLamp:O('Фонарик для мышат',[73,57,8,11],'bats',{icon:'🌸'})}}
};
export const newQuest=()=>({room:'hall',bag:[],flags:{},won:false});
export function visible(q,id){return !(id==='ribbon'&&q.bag.includes('ribbon')||id==='ladle'&&(q.bag.includes('ladle')||q.flags.keyGot)||id==='lamp'&&q.flags.lampTaken||id==='highKey'&&q.flags.keyGot||id==='lens'&&(!q.flags.cabinetOpen||q.flags.lensTaken)||id==='flower'&&q.flags.flowerTaken||id==='atticCrystal'&&q.flags.exchanged||id==='atticLamp'&&!q.flags.exchanged);}
export {hint} from './hints.mjs';
export function act(q,id,action='look',selected=null){
 const obj=rooms[q.room].objects[id];
 const remove=x=>{q.bag=q.bag.filter(v=>v!==x)};
 if(action==='apply'){
  if(!q.bag.includes(selected))return 'wrong';
  if((selected==='flower'&&id==='lamp'||selected==='lamp'&&id==='flower')&&q.bag.includes(id)){remove('flower');remove('lamp');q.bag.push('flowerLamp');return 'combined';}
  if(selected==='ladle'&&id==='highKey'&&q.room==='kitchen'&&!q.flags.keyGot){remove('ladle');q.bag.push('key');q.flags.keyGot=true;return 'keyGot';}
  if(selected==='key'&&id==='cabinet'&&q.room==='library'){remove('key');q.flags.cabinetOpen=true;return 'cabinetOpen';}
  if(selected==='lens'&&id==='beam'&&q.room==='greenhouse'){q.flags.tracks=true;return 'tracks';}
  if(selected==='flowerLamp'&&id==='dragon'&&q.room==='attic'){remove('flowerLamp');q.bag.push('crystal');q.flags.exchanged=true;q.flags.dragonMet=true;return 'exchange';}
  if(selected==='crystal'&&id==='lantern'&&q.room==='hall'){remove('crystal');q.won=true;return 'win';}
  if(selected==='ribbon'&&['ghost','chef','dragon'].includes(id)){if(id==='ghost')q.flags.ribbonShown=true;if(id==='dragon')q.flags.dragonMet=true;return id==='ghost'?'ghost':id+'Ribbon';}
  return ['bats','greenPumpkin','bell'].includes(id)?'wrongFunny':'wrong';
 }
 if(obj?.to){q.room=obj.to;return 'welcome';}
 if(action==='take'){
  const item=id==='ribbon'?'ribbon':obj?.item;if(!item)return 'wrong';
  if(!visible(q,id)||q.bag.includes(item))return 'already';
  if(q.bag.length>=5)return 'full';
  q.bag.push(item);q.flags[item+'Taken']=true;return item==='ribbon'?'ribbonFound':items[item].look;
 }
 if(id==='fridge'&&action==='play')q.flags.fridgeOpen=!q.flags.fridgeOpen;
 if(id==='dragon')q.flags.dragonMet=true;
 if(id==='lantern'){q.flags.altar=true;return q.won?'ending':'altar';}
 if(id==='ghost')return conversation(q,'ghost');
 if(id==='librarian'&&action==='talk')return conversation(q,'librarian');
 if(id==='book')q.flags.bookRead=true;
 if(id==='bell')return action==='ring'?'bell':'bellLook';
 if(id==='ribbon')return 'itemRibbon';
 if(id==='cabinet'&&q.flags.cabinetOpen)return 'cabinetOpen';
 if(id==='beam'&&q.flags.tracks)return 'tracks';
 return obj?.line||'outside';
}

// Conversations advance only when the player chooses Talk again.
L('ghostHello','Привет, Мэвис! Как твои дела? Уже готова к празднику?','Привидение');
L('mavisMissing','Привет! Вообще-то, кажется, у нас загадка. Кристалл из алтаря пропал!');
L('ghostSurprise','Пропал? Вот так новость… Я весь вечер встречаю гостей и ничего не заметил.','Привидение');
L('mavisWitness','А ты случайно не видел здесь кого-нибудь, кто мог его взять?');
L('ghostUnsure','Даже не знаю… Вроде кого-то видел, но здесь столько гостей! Можешь посмотреть в записной книге.','Привидение');
L('ghostThinking','Всё пытаюсь вспомнить. Иногда маленькая деталь помогает лучше целой страницы записей.','Привидение');
L('guestNote','«Гость с фиолетовым бантиком. Прибыл с тремя сонными друзьями». Имя расплылось от кляксы.');
L('libraryQuestion','Ты сегодня ищешь сказку или ответ на трудный вопрос?','Библиотекарь');
L('libraryAnswer','Скорее ответ. Может ли что-нибудь светиться всю ночь и не быть свечкой?');
L('libraryFlower','Бывает лунный цветок. Его лепестки светятся всю ночь. А тебе больше нравятся звёзды или цветы?','Библиотекарь');
L('mavisStars','Звёзды! Хотя цветы, которые умеют светиться, — это почти маленькие звёзды.');
L('libraryReply','Чудесное сравнение! Пожалуй, запишу его на полях. Только никому не говори: я обычно не разрешаю писать в книгах.','Библиотекарь');
L('startMystery','Кристалл ведь не мог просто исчезнуть… Здесь наверняка осталась какая-нибудь мелочь.');
export function conversation(q,id){
 if(id==='ghost'){
  const stage=q.flags.ghostTalkStage||0;q.flags.ghostTalkStage=Math.min(2,stage+1);
  return stage===0?['ghostHello','mavisMissing','ghostSurprise']:stage===1?['mavisWitness','ghostUnsure']:['ghostThinking'];
 }
 if(id==='librarian'){
  if(q.flags.libraryTalked)return ['libraryFlower','mavisStars','libraryReply'];
  q.flags.libraryTalked=true;return ['libraryQuestion','libraryAnswer','libraryFlower','mavisStars','libraryReply'];
 }
 return [];
}
const entries={
 hall:['Тыквы улыбаются, часы тикают… А алтарь молчит.','Снова знакомый холл. Что изменилось с прошлого раза?','Люблю этот холл. Особенно когда все его огни на месте.'],
 kitchen:['М-м-м, корица! Здесь даже привидение проголодается.','Повар всё ещё колдует над ужином. Только бы не отвлечь его надолго.','Отсюда совершенно невозможно уйти, не подумав о печенье.'],
 library:['Как тихо… Кажется, даже пыль здесь шепчет.','Здесь столько историй. Может, одна из них пересекается с моей?','Книги опять поменялись местами? Или мне показалось?'],
 greenhouse:['Ночью этот сад совсем другой. Листья будто серебряные.','Здесь пахнет влажной землёй и чем-то сладким.','Луна заглядывает в каждое стекло. Как любопытно!'],
 attic:['Тс-с… Кажется, здесь кто-то устраивается на ночлег.','Здесь так уютно. Словно весь чердак завернули в одеяло.','Буду потише: у маленьких ушей очень чуткий сон.']
};
for(const [room,texts]of Object.entries(entries))texts.forEach((text,i)=>L('entry_'+room+'_'+i,text));
export function enterLine(q){const key='visits_'+q.room,n=q.flags[key]||0;q.flags[key]=n+1;return 'entry_'+q.room+'_'+(n%3);}
