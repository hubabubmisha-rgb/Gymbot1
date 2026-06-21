/* ЭЛЕКТРИЧЕСКИЙ МОЗГ v2 — Telegram-бот (Cloudflare Worker)
   Акцент на задачах. Без геймификации/профиля/привычек.
   Стек прежний: Telegram + Supabase (REST) + Workers (cron). Без ИИ. */


const TASK_TYPES = ['Учёба','Работа','Дом','Семья','Коммуникации','Здоровье','Спорт','Финансы','Платёж','Подписка','Другое'];
// приоритет: при нескольких совпадениях побеждает больший
const TYPE_PRIORITY = { 'Платёж':100,'Подписка':95,'Семья':90,'Здоровье':85,'Спорт':80,'Финансы':75,'Учёба':70,'Работа':65,'Дом':60,'Коммуникации':55,'Другое':0 };
const TYPE_KW = {
  'Учёба':['учеб','универ','институт','лекци','семинар','экзамен','зачёт','зачет','сесси','курсов','диплом','реферат','конспект','домашк','дз','контрольн','практик','препод','студент','расписан','пара','коллоквиум','олимпиад','репетитор','учебник','тест по','english','английск','испанск','выучить','повторить вопрос','повторить билет','подготовиться к экзам','готовиться к экз'],
  'Работа':['работ','совещан','митинг','созвон','планёрк','планерк','дедлайн','отчёт','отчет','презентац','проект','клиент','заказчик','договор','коммерч','офис','начальник','босс','коллег','рабоч почт','письмо по работе','резюме','собеседован','смена','командировк','kpi','спринт','таск','зум по работе','оффер'],
  'Дом':['убор','уборк','помыть','постирать','стирк','посуд','пылесос','мусор вынес','навести порядок','почин','лампочк','кран','розетк','полить цвет','погладить','коммуналк','счётчик','переезд','генеральн уборк','протереть','разобрать шкаф'],
  'Семья':['мам','мама','маме','папа','папе','отец','отцу','родител','бабушк','дедушк','сестр','брат','сын','дочь','дочк','жен','муж','супруг','ребёнок','ребенок','дет','семь','тёщ','тещ','свекров','племянник','внук','родн','крестн'],
  'Коммуникации':['позвон','звонок','набрать','написать','сообщени','смс','ответить на','перезвон','связаться','договорит','поздравить','спросить у','узнать у','уточнить у','отправить сообщ','ответить кому'],
  'Здоровье':['врач','доктор','поликлиник','больниц','анализ','сдать кровь','узи','флюорограф','прививк','вакцин','стоматолог','зубн','окулист','терапевт','рецепт','осмотр','диспансер','медосмотр','приём врача','прием врача','капельниц','перевязк','к врачу'],
  'Спорт':['трениров','спортзал','в зал','фитнес','пробежк','побегать','йог','растяжк','бассейн','поплавать','турник','отжимани','присед','кардио','велик','велосипед','лыж','каток','секци по','зарядк','качалк'],
  'Финансы':['бюджет','накопл','отложить деньг','откладыва','инвест','вклад','депозит','перевести деньг','занять денег','посчитать деньг','копилк','сбереж','финанс план','распределить бюджет'],
  'Платёж':['оплат','оплатить','платёж','платеж','счёт за','счет за','квитанц','кредит','ипотек','рассрочк','штраф','налог','госпошлин','взнос','заплатить','погасить','пополнить счёт','оплатить интернет','оплатить связь','оплатить квартиру'],
  'Подписка':['подписк','продлить','продлени','кинопоиск','нетфликс','netflix','spotify','спотифай','ютуб премиум','youtube premium','яндекс плюс','тариф продлить','megogo','okko','окко','иви','ivi','apple music','icloud','xbox','ps plus','steam подписк','premium продлить'],
};
function detectTaskType(title){
  const t = (title||'').toLowerCase();
  let best='Другое', bestP=-1;
  for(const type of Object.keys(TYPE_KW)){
    for(const kw of TYPE_KW[type]){ if(t.includes(kw)){ const p=TYPE_PRIORITY[type]||0; if(p>bestP){ bestP=p; best=type; } break; } }
  }
  return best;
}

// Категории финансов (kind: income|expense) с ключевыми словами (бренды/магазины/сервисы)
const CATEGORIES = [
  // ── РАСХОДЫ ──
  { name:'Еда', emoji:'🍔', kind:'expense', kw:['еда','продукт','пятёроч','пятероч','магнит','перекрёсток','перекресток','ашан','лента','вкусвилл','дикси','окей','spar','спар','кафе','ресторан','столов','обед','ужин','завтрак','бургер','макдак','вкусно и точка','kfc','кфс','burger king','бургер кинг','додо','пицц','суши','роллы','шаурм','кофе','старбакс','шоколадниц','яндекс еда','деливери','delivery club','самокат продукт','кулинар','булочн','пекарн','фастфуд','вода','снек','чипсы'] },
  { name:'Транспорт', emoji:'🚕', kind:'expense', kw:['метро','автобус','трамвай','троллейбус','маршрутк','электричк','проезд','тройк','подорожник','такси','яндекс такси','убер','uber','ситимобил','bolt','болт','каршеринг','делимобиль','ситидрайв','бензин','заправк','азс','лукойл','роснефт','газпромнефт','парковк','whoosh','вуш','самокат аренд','ржд','аэроэкспресс','авиабилет','билет на поезд'] },
  { name:'Маркетплейсы', emoji:'📦', kind:'expense', kw:['озон','ozon','вайлдберриз','wildberries','вб','wb','яндекс маркет','market','алиэкспресс','aliexpress','али','сбермегамаркет','мегамаркет','lamoda','ламода','маркетплейс','пункт выдачи','пвз','заказ озон','заказ вб'] },
  { name:'Одежда', emoji:'👕', kind:'expense', kw:['одежд','обувь','кроссовк','кеды','джинс','футболк','платье','куртк','пальто','брюки','рубашк','свитер','бельё','белье','носки','zara','зара','h&m','uniqlo','юникло','bershka','спортмастер','decathlon','декатлон','adidas','адидас','nike','найк','puma','reebok','гардероб','шапк'] },
  { name:'Спорт', emoji:'🏋️', kind:'expense', kw:['абонемент','фитнес клуб','спортзал оплат','тренер оплат','протеин','спортпит','гейнер','гантел','коврик для йог','экипировк','секция оплат','бассейн абонемент','форма спортивн'] },
  { name:'Дом', emoji:'🏠', kind:'expense', kw:['мебель','икеа','ikea','хофф','hoff','леруа','leroy','оби','obi','посуд','бытовая техника','днс','dns','мвидео','эльдорадо','постельн','шторы','декор','обои','краск','инструмент','лампочк','бытовая хими','порошок','моющ','туалетн бумаг','салфетк','стиральн порошок'] },
  { name:'Здоровье', emoji:'💊', kind:'expense', kw:['аптек','лекарств','таблетк','витамин','бад','анализ оплат','врач оплат','клиник','стоматолог оплат','зубной оплат','массаж','очки','линзы','горздрав','ригла','озерки','медси','инвитро','гемотест','приём оплат'] },
  { name:'Связь', emoji:'📶', kind:'expense', kw:['связь','мобильн','мтс','mts','билайн','beeline','мегафон','megafon','теле2','tele2','йота','yota','симкарт','интернет домашн','ростелеком','дом ру','домру','роуминг','пополнить телефон'] },
  { name:'Развлечения', emoji:'🎮', kind:'expense', kw:['кино','билет в кино','театр','концерт','выставк','музей','клуб','бар','паб','боулинг','караоке','квест','аттракцион','развлечен','steam','playstation','xbox','настолк','бильярд','каток развлеч'] },
  { name:'Учёба', emoji:'📚', kind:'expense', kw:['курс оплат','обучени','учебник','книг','репетитор оплат','вебинар','интенсив','skillbox','скиллбокс','нетология','geekbrains','coursera','udemy','канцеляр','тетрад','распечатк','печать'] },
  { name:'Подарки', emoji:'🎁', kind:'expense', kw:['подарок','подарк','цвет','цветы','букет','открытк','сувенир','презент','подарочн'] },
  { name:'Другое', emoji:'•', kind:'expense', kw:[] },
  // ── ДОХОДЫ ──
  { name:'Зарплата', emoji:'💰', kind:'income', kw:['зарплат','зп','получк','оклад','аванс','зарплатн','выплата зп'] },
  { name:'Подработка', emoji:'💼', kind:'income', kw:['подработк','халтур','фриланс','шабашк','гонорар','чаевые','типс','заказ выполн'] },
  { name:'Подарок', emoji:'🎀', kind:'income', kw:['подарили','подарок деньг','дали денег','на др дали','презент деньг'] },
  { name:'Возврат долга', emoji:'↩️', kind:'income', kw:['вернул долг','вернули долг','возврат долг','отдали долг','долг вернули'] },
  { name:'Кэшбэк', emoji:'💳', kind:'income', kw:['кэшбэк','кешбэк','cashback','кэшбек','бонус','спасибо от сбера','баллы вернули'] },
  { name:'Инвестиции', emoji:'📈', kind:'income', kw:['дивиденд','купон','инвест доход','продал акци','прибыль с акци','проценты по вкладу','вклад процент'] },
  { name:'Случайный доход', emoji:'🍀', kind:'income', kw:['нашёл деньг','нашел деньг','выигрыш','приз','лотере','случайн доход'] },
  { name:'Другое', emoji:'•', kind:'income', kw:[] },
];
const DEFAULT_TASK_TEMPLATES = ['Тренировка','Учёба','Уборка','Покупки','Позвонить','Сдать домашку','Подготовиться к экзамену'];

// ── Supabase ──
async function sb(env, method, path, { body, prefer } = {}) {
  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/${path}`, {
    method, headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type':'application/json', ...(prefer?{Prefer:prefer}:{}) },
    body: body ? JSON.stringify(body) : undefined });
  if (!res.ok) { const t = await res.text(); throw new Error(`SB ${method} ${path} ${res.status}: ${t}`); }
  if (res.status===204) return null;
  const txt = await res.text(); return txt ? JSON.parse(txt) : null;
}
const dbSelect = (env,t,q='') => sb(env,'GET',`${t}?${q}`);
const dbOne = async (env,t,q='') => (await dbSelect(env,t,q))?.[0]||null;
const dbInsert = (env,t,row) => sb(env,'POST',t,{ body:Array.isArray(row)?row:[row], prefer:'return=representation' });
const dbInsertOne = async (env,t,row) => (await dbInsert(env,t,row))?.[0]||null;
const dbUpdate = (env,t,q,patch) => sb(env,'PATCH',`${t}?${q}`,{ body:patch, prefer:'return=representation' });
const dbDelete = (env,t,q) => sb(env,'DELETE',`${t}?${q}`);

// ── Telegram ──
async function tg(env, method, payload) {
  const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) });
  return res.json();
}
const send = (env,chatId,text,kb) => tg(env,'sendMessage',{ chat_id:chatId, text, parse_mode:'HTML', disable_web_page_preview:true, ...(kb?{reply_markup:kb}:{}) });
const edit = (env,chatId,msgId,text,kb) => tg(env,'editMessageText',{ chat_id:chatId, message_id:msgId, text, parse_mode:'HTML', disable_web_page_preview:true, ...(kb?{reply_markup:kb}:{}) });
const answer = (env,cbId,text) => tg(env,'answerCallbackQuery',{ callback_query_id:cbId, ...(text?{text}:{}) });
const sendPhoto = (env,chatId,url,caption,kb) => tg(env,'sendPhoto',{ chat_id:chatId, photo:url, caption:caption||'', parse_mode:'HTML', ...(kb?{reply_markup:kb}:{}) });
async function screen(env, ctx, text, kb){ if (ctx.msgId){ const r=await edit(env,ctx.chatId,ctx.msgId,text,kb); if(r&&r.ok===false) await send(env,ctx.chatId,text,kb); } else await send(env,ctx.chatId,text,kb); }

const btn = (text,data) => ({ text, callback_data:data });
const ikb = (rows) => ({ inline_keyboard:rows });
const navRow = (backData) => [btn('⬅️ Назад', backData||'nav:menu'), btn('🏠 Меню','nav:menu')];
function esc(s){ return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
const money = (n) => `${Math.round(Number(n)).toLocaleString('ru-RU')} ₽`;

// ── Время / TZ ──
function tzOffsetMs(date, tz){ const dtf=new Intl.DateTimeFormat('en-US',{ timeZone:tz, hour12:false, year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit' }); const p=dtf.formatToParts(date).reduce((a,x)=>(a[x.type]=x.value,a),{}); return Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute,+p.second)-date.getTime(); }
function localToUtc(y,mo,d,h,mi,tz){ const guess=Date.UTC(y,mo-1,d,h,mi,0); return new Date(guess-tzOffsetMs(new Date(guess),tz)); }
function nowParts(tz){ const p=new Intl.DateTimeFormat('en-CA',{ timeZone:tz, hour12:false, year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',weekday:'short' }).formatToParts(new Date()).reduce((a,x)=>(a[x.type]=x.value,a),{}); const dowMap={ Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6 }; return { y:+p.year,mo:+p.month,d:+p.day,h:+p.hour,mi:+p.minute,dow:dowMap[p.weekday],dateStr:`${p.year}-${p.month}-${p.day}`,hhmm:`${p.hour}:${p.minute}`,minOfDay:+p.hour*60+ +p.minute }; }
const RU_MONTHS=['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
const RU_DOW=['Вс','Пн','Вт','Ср','Чт','Пт','Сб'];
function fmtDate(ds){ if(!ds) return 'без даты'; const [y,m,d]=ds.split('-').map(Number); return `${d} ${RU_MONTHS[m-1]}`; }
function fmtShort(ds){ const [y,m,d]=ds.split('-').map(Number); return `${String(d).padStart(2,'0')}.${String(m).padStart(2,'0')}`; }
function addDaysStr(ds,n){ const [y,m,d]=ds.split('-').map(Number); return new Date(Date.UTC(y,m-1,d+n)).toISOString().slice(0,10); }
function dowOf(ds){ const [y,m,d]=ds.split('-').map(Number); return new Date(Date.UTC(y,m-1,d)).getUTCDay(); }
function buildCalendar(y,mo,prefix,extraRow){
  const first=new Date(Date.UTC(y,mo-1,1)); const startDow=(first.getUTCDay()+6)%7; const days=new Date(Date.UTC(y,mo,0)).getUTCDate();
  const rows=[]; rows.push([btn('◀',`${prefix}:nav:${y}:${mo}:-1`), btn(`${RU_MONTHS[mo-1]} ${y}`,'noop'), btn('▶',`${prefix}:nav:${y}:${mo}:1`)]);
  rows.push(['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(w=>btn(w,'noop'))); let week=[]; for(let i=0;i<startDow;i++) week.push(btn(' ','noop'));
  for(let d=1;d<=days;d++){ const ds=`${y}-${String(mo).padStart(2,'0')}-${String(d).padStart(2,'0')}`; week.push(btn(String(d),`${prefix}:pick:${ds}`)); if(week.length===7){rows.push(week);week=[];} }
  if(week.length){ while(week.length<7) week.push(btn(' ','noop')); rows.push(week); } if(extraRow) rows.push(extraRow); return ikb(rows);
}

// ── State ──
async function getState(env,uid){ const r=await dbOne(env,'eb1_states',`telegram_user_id=eq.${uid}`); return r||{ telegram_user_id:uid, state:null, data:{} }; }
async function setState(env,uid,state,data={}){ await sb(env,'POST','eb1_states',{ body:[{ telegram_user_id:uid, state, data, updated_at:new Date().toISOString() }], prefer:'resolution=merge-duplicates' }); }
async function clearState(env,uid){ await dbUpdate(env,'eb1_states',`telegram_user_id=eq.${uid}`,{ state:null, data:{} }); }

// ── Пользователь / сид v2 ──
const SEED_VERSION = 2;
async function ensureUser(env, from){
  let u = await dbOne(env,'eb1_users',`telegram_user_id=eq.${from.id}`);
  if(!u) u = await dbInsertOne(env,'eb1_users',{ telegram_user_id:from.id, username:from.username||'', first_name:from.first_name||'', tz:env.DEFAULT_TIMEZONE||'Europe/Moscow', briefing_time:'07:00' });
  if(!u.seed_version || u.seed_version < SEED_VERSION){ await reseed(env,u.telegram_user_id); u.seed_version=SEED_VERSION; }
  return u;
}
async function reseed(env,uid){
  // чистим старые финансовые категории и ключевые слова, ставим новые (доход/расход раздельно)
  await dbDelete(env,'eb1_finance_category_keywords',`telegram_user_id=eq.${uid}`);
  await dbDelete(env,'eb1_finance_categories',`telegram_user_id=eq.${uid}`);
  for(const c of CATEGORIES){
    const cat=await dbInsertOne(env,'eb1_finance_categories',{ telegram_user_id:uid, name:c.name, emoji:c.emoji, kind:c.kind });
    if(cat && c.kw?.length) await dbInsert(env,'eb1_finance_category_keywords', c.kw.map(k=>({ telegram_user_id:uid, category_id:cat.id, keyword:k })));
  }
  // шаблоны задач (создаём только если пусто)
  const tpl=await dbSelect(env,'eb1_task_templates',`telegram_user_id=eq.${uid}&select=id`);
  if(!tpl?.length) await dbInsert(env,'eb1_task_templates', DEFAULT_TASK_TEMPLATES.map(t=>({ telegram_user_id:uid, title:t })));
  await dbUpdate(env,'eb1_users',`telegram_user_id=eq.${uid}`,{ seeded:true, seed_version:SEED_VERSION });
}

// ── Финансы: расчёты ──
async function computeBalance(env,uid){
  const u=await dbOne(env,'eb1_users',`telegram_user_id=eq.${uid}&select=start_balance`);
  const txs=await dbSelect(env,'eb1_finance_transactions',`telegram_user_id=eq.${uid}&select=amount,type`);
  const adj=await dbSelect(env,'eb1_balance_adjustments',`telegram_user_id=eq.${uid}&select=amount`);
  let bal=Number(u?.start_balance||0);
  for(const x of (txs||[])) bal += x.type==='income'?Number(x.amount):-Number(x.amount);
  for(const a of (adj||[])) bal += Number(a.amount);
  return bal;
}
async function sumTx(env,uid,type,fromDate,toDate){
  let q=`telegram_user_id=eq.${uid}&type=eq.${type}&select=amount,category_id,description,tx_date`;
  if(fromDate) q+=`&tx_date=gte.${fromDate}`; if(toDate) q+=`&tx_date=lte.${toDate}`;
  return (await dbSelect(env,'eb1_finance_transactions',q))||[];
}
async function categorize(env,uid,words,kind){
  const cats=await dbSelect(env,'eb1_finance_categories',`telegram_user_id=eq.${uid}&select=id,kind,name`);
  const kws=await dbSelect(env,'eb1_finance_category_keywords',`telegram_user_id=eq.${uid}&select=category_id,keyword`);
  const kindOf=Object.fromEntries((cats||[]).map(c=>[c.id,c.kind]));
  const text=words.join(' ').toLowerCase();
  for(const k of (kws||[])) if(kindOf[k.category_id]===kind && text.includes(k.keyword.toLowerCase())) return k.category_id;
  const other=(cats||[]).find(c=>c.kind===kind && c.name==='Другое'); return other?other.id:null;
}
async function parseQuickFinance(env,uid,raw){
  const t=raw.trim(); const m=t.match(/^([+-]?)(\d+(?:[.,]\d+)?)\s*(.*)$/); if(!m) return null;
  const sign=m[1]; const amount=parseFloat(m[2].replace(',','.')); if(!isFinite(amount)||amount<=0) return null;
  const rest=(m[3]||'').trim(); const words=rest?rest.split(/\s+/):[];
  const kind = sign==='+'?'income':'expense';
  const categoryId = words.length?await categorize(env,uid,words,kind):await categorize(env,uid,[],kind);
  return { amount, type:kind, categoryId, description:rest, hasWords:words.length>0 };
}

// ── Графики (QuickChart) ──
function chartUrl(config,w=640,h=420){ return `https://quickchart.io/chart?w=${w}&h=${h}&bkg=white&c=${encodeURIComponent(JSON.stringify(config))}`; }
function pieChart(title,labels,values){ return chartUrl({ type:'doughnut', data:{ labels, datasets:[{ data:values }] }, options:{ plugins:{ title:{ display:true, text:title } } } }); }
function lineChart(title,labels,values,label){ return chartUrl({ type:'line', data:{ labels, datasets:[{ label:label||title, data:values, fill:false, tension:0.3 }] }, options:{ plugins:{ title:{ display:true, text:title } } } }); }

// ── Напоминания ──
const OFFSETS={ '1w':7*24*60,'3d':3*24*60,'1d':24*60,'12h':12*60,'3h':3*60,'1h':60,'at':0 };
async function scheduleEventReminders(env,uid,kind,refId,label,fireBaseUtc,picks){
  const rows=[]; for(const key of picks){ const off=OFFSETS[key]; if(off==null) continue; const at=new Date(fireBaseUtc.getTime()-off*60000); if(at.getTime()<=Date.now()) continue; rows.push({ telegram_user_id:uid, kind, ref_id:refId, fire_at:at.toISOString(), label }); }
  if(rows.length) await dbInsert(env,'eb1_reminders',rows);
}
function reminderPicksKeyboard(picks,hoursAway,prefix){
  const opts=[['1w','За неделю',7*24],['3d','За 3 дня',3*24],['1d','За сутки',24],['12h','За 12 часов',12],['3h','За 3 часа',3],['1h','За час',1],['at','В момент',0]];
  const rows=[]; for(const [key,lbl,minH] of opts){ if(hoursAway!=null && hoursAway<=minH && key!=='at') continue; const on=picks.includes(key); rows.push([btn(`${on?'☑':'☐'} ${lbl}`,`${prefix}:rt:${key}`)]); }
  rows.push([btn('✅ Готово',`${prefix}:rdone`)]); return rows;
}
function nextRepeatDate(ds,repeat){ const [y,m,d]=ds.split('-').map(Number); let dt=new Date(Date.UTC(y,m-1,d)); if(repeat==='daily') dt.setUTCDate(dt.getUTCDate()+1); else if(repeat==='weekly') dt.setUTCDate(dt.getUTCDate()+7); else if(repeat==='monthly') dt.setUTCMonth(dt.getUTCMonth()+1); else if(repeat==='yearly') dt.setUTCFullYear(dt.getUTCFullYear()+1); else return null; return dt.toISOString().slice(0,10); }

// ═══ ГЛАВНЫЙ ЭКРАН (только задачи, 7 дней) ═══
function timePrefix(x){ return x.due_hour!=null ? `${String(x.due_hour).padStart(2,'0')}:00` : 'Без времени —'; }
function mainMenuKb(){
  return ikb([
    [btn('Сегодня','task:list:today'), btn('Завтра','task:list:tomorrow')],
    [btn('Неделя','task:list:week'), btn('Календарь','cal:menu')],
    [btn('➕ Новая задача','task:new'), btn('🎯 Цели','goal:menu')],
    [btn('💰 Финансы','fin:menu'), btn('⚙️ Настройки','set:menu')],
  ]);
}
async function buildHome(env,uid,tz){
  const today=nowParts(tz).dateStr; const end=addDaysStr(today,7);
  const tasks=await dbSelect(env,'eb1_tasks',`telegram_user_id=eq.${uid}&archived=eq.false&status=neq.done&due_date=not.is.null&due_date=gte.${today}&due_date=lte.${end}&select=id,title,due_date,due_hour&order=due_date.asc,due_hour.asc`);
  const noDate=await dbSelect(env,'eb1_tasks',`telegram_user_id=eq.${uid}&archived=eq.false&status=neq.done&due_date=is.null&select=id,title&limit=20`);
  let t='📋 <b>Ближайшие задачи (7 дней)</b>\n';
  const byDay={}; for(const x of (tasks||[])) (byDay[x.due_date]=byDay[x.due_date]||[]).push(x);
  const days=Object.keys(byDay).sort();
  if(!days.length && !(noDate||[]).length) t+='\n<i>Задач нет. Напиши текст — создам задачу.</i>\n';
  for(const d of days){
    let label = d===today?'Сегодня' : d===addDaysStr(today,1)?'Завтра' : fmtDate(d);
    t+=`\n<b>${label}</b>\n`;
    for(const x of byDay[d]) t+=`${timePrefix(x)} ${esc(x.title)}\n`;
  }
  if((noDate||[]).length){ t+='\n<b>Без срока</b>\n'; for(const x of noDate) t+=`Без времени — ${esc(x.title)}\n`; }
  return { text:t, kb:mainMenuKb() };
}
async function showMenu(env,ctx){ const { text,kb }=await buildHome(env,ctx.uid,ctx.user.tz); await screen(env,ctx,text,kb); }

// ═══ СПИСКИ / КАЛЕНДАРЬ ═══
async function taskListByRange(env,ctx,from,to,title){
  const rows=await dbSelect(env,'eb1_tasks',`telegram_user_id=eq.${ctx.uid}&archived=eq.false&status=neq.done&due_date=not.is.null&due_date=gte.${from}&due_date=lte.${to}&select=id,title,due_date,due_hour,type&order=due_date.asc,due_hour.asc`);
  let t=`<b>${title}</b>\n\n`; const kb=[];
  if(!rows?.length) t+='<i>пусто</i>';
  else { const byDay={}; for(const x of rows) (byDay[x.due_date]=byDay[x.due_date]||[]).push(x);
    for(const d of Object.keys(byDay).sort()){ t+=`<b>${fmtDate(d)}</b>\n`; for(const x of byDay[d]){ t+=`${timePrefix(x)} ${esc(x.title)}\n`; kb.push([btn(`${timePrefix(x)} ${x.title}`.slice(0,55),`task:open:${x.id}`)]); } t+='\n'; } }
  kb.push(navRow('nav:menu')); await screen(env,ctx,t,ikb(kb));
}
async function taskListScope(env,ctx,scope){
  const today=nowParts(ctx.user.tz).dateStr;
  if(scope==='today') return taskListByRange(env,ctx,today,today,'Сегодня');
  if(scope==='tomorrow'){ const d=addDaysStr(today,1); return taskListByRange(env,ctx,d,d,'Завтра'); }
  if(scope==='week') return taskListByRange(env,ctx,today,addDaysStr(today,7),'Неделя');
}
async function calMenu(env,ctx){
  await screen(env,ctx,'📅 <b>Календарь</b>', ikb([
    [btn('Сегодня','task:list:today'), btn('Завтра','task:list:tomorrow')],
    [btn('Неделя','task:list:week')],
    [btn('Выбрать дату','cal:pickdate')],
    [btn('Текущий месяц','cal:month')],
    navRow('nav:menu'),
  ]));
}
async function calMonth(env,ctx){
  const np=nowParts(ctx.user.tz); const from=`${np.y}-${String(np.mo).padStart(2,'0')}-01`; const to=`${np.y}-${String(np.mo).padStart(2,'0')}-${String(new Date(Date.UTC(np.y,np.mo,0)).getUTCDate()).padStart(2,'0')}`;
  return taskListByRange(env,ctx,from,to,`${RU_MONTHS[np.mo-1]} ${np.y}`);
}
async function calPickDate(env,ctx){ const np=nowParts(ctx.user.tz); await screen(env,ctx,'Выбери дату:', buildCalendar(np.y,np.mo,'cal:cal',[btn('⬅️ Назад','cal:menu')])); }
async function calShowDate(env,ctx,ds){ return taskListByRange(env,ctx,ds,ds,fmtDate(ds)); }

// ═══ КАРТОЧКА ЗАДАЧИ ═══
async function taskOpen(env,ctx,id){
  const x=await dbOne(env,'eb1_tasks',`telegram_user_id=eq.${ctx.uid}&id=eq.${id}`); if(!x) return showMenu(env,ctx);
  const stages=await dbSelect(env,'eb1_task_stage_history',`task_id=eq.${id}&select=new_stage,changed_at&order=changed_at.asc`);
  const plans=await dbSelect(env,'eb1_task_plans',`task_id=eq.${id}&select=text,created_at&order=created_at.asc`);
  let t=`✅ <b>${esc(x.title)}</b>\n`;
  t+=`Тип: ${esc(x.type||'Другое')}\n`;
  t+=`Дата: ${x.due_date?fmtDate(x.due_date):'без даты'}\n`;
  t+=`Время: ${x.due_hour!=null?String(x.due_hour).padStart(2,'0')+':00':'—'}\n`;
  if(x.repeat&&x.repeat!=='none') t+=`Повтор: ${x.repeat}\n`;
  t+='\n<b>История стадий</b>\n';
  if(stages?.length) for(const s of stages){ const ds=new Date(s.changed_at); t+=`${fmtTs(ds,ctx.user.tz)}\n${esc(s.new_stage)}\n`; } else t+='<i>пока нет</i>\n';
  t+='\n<b>История планов</b>\n';
  if(plans?.length) for(const pl of plans){ const ds=new Date(pl.created_at); t+=`${fmtTs(ds,ctx.user.tz)}\n${esc(pl.text)}\n`; } else t+='<i>пока нет</i>\n';
  await screen(env,ctx,t,ikb([
    [btn('✅ Выполнено',`task:done:${id}`), btn('📅 Перенести',`task:move:${id}`)],
    [btn('➕ Добавить стадию',`task:addstage:${id}`), btn('➕ Добавить план',`task:addplan:${id}`)],
    [btn('🔔 Напоминания',`task:rem:${id}`), btn('✏️ Изменить',`task:edit:${id}`)],
    [btn('🗑 Удалить',`task:del:${id}`)],
    navRow('nav:menu'),
  ]));
}
function fmtTs(date,tz){ const p=new Intl.DateTimeFormat('ru-RU',{ timeZone:tz, day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit' }).formatToParts(date).reduce((a,x)=>(a[x.type]=x.value,a),{}); return `${p.day}.${p.month} ${p.hour}:${p.minute}`; }
async function taskDone(env,ctx,id){
  const x=await dbOne(env,'eb1_tasks',`telegram_user_id=eq.${ctx.uid}&id=eq.${id}`); if(!x||x.status==='done') return showMenu(env,ctx);
  await dbUpdate(env,'eb1_tasks',`id=eq.${id}`,{ status:'done', archived:true, done_at:new Date().toISOString() });
  await dbDelete(env,'eb1_reminders',`kind=eq.task&ref_id=eq.${id}&sent=eq.false`);
  if(x.repeat&&x.repeat!=='none'&&x.due_date){ const next=nextRepeatDate(x.due_date,x.repeat); if(next){ const nt=await dbInsertOne(env,'eb1_tasks',{ telegram_user_id:ctx.uid, title:x.title, type:x.type, due_date:next, due_hour:x.due_hour, repeat:x.repeat }); if(nt&&next){ const fire=localToUtc(...next.split('-').map(Number),(x.due_hour??9),0,ctx.user.tz); await scheduleEventReminders(env,ctx.uid,'task',nt.id,`Задача: ${x.title}`,fire,['at']); } } }
  await answer(env,ctx.cbId,'✅ Готово'); await showMenu(env,ctx);
}

// ═══ МАСТЕР СОЗДАНИЯ ЗАДАЧИ ═══
async function taskWizardStart(env,ctx,presetTitle){
  if(presetTitle){ const type=detectTaskType(presetTitle); await setState(env,ctx.uid,'task:type',{ title:presetTitle, type }); return askType(env,ctx,{ title:presetTitle, type }, true); }
  await setState(env,ctx.uid,'task:title',{}); await screen(env,ctx,'➕ <b>Новая задача</b>\nВведи название:', ikb([navRow('nav:menu')]));
}
async function askType(env,ctx,data,isNew){
  await setState(env,ctx.uid,'task:type',data);
  const rows=[]; let r=[]; for(const ty of TASK_TYPES){ r.push(btn(ty===data.type?`• ${ty} •`:ty,`tw:type:${ty}`)); if(r.length===3){rows.push(r);r=[];} } if(r.length) rows.push(r);
  const txt=`Задача: <b>${esc(data.title)}</b>\nТип (предложен «${data.type}», можно поменять):`;
  if(isNew && !ctx.msgId) await send(env,ctx.chatId,txt,ikb(rows)); else await screen(env,ctx,txt,ikb(rows));
}
async function askDate(env,ctx,data){ await setState(env,ctx.uid,'task:date',data); const np=nowParts(ctx.user.tz); await send(env,ctx.chatId,'Дата:', buildCalendar(np.y,np.mo,'tw:cal',[btn('Сегодня','tw:date:'+np.dateStr), btn('Завтра','tw:date:'+addDaysStr(np.dateStr,1)), btn('Без даты','tw:date:none')])); }
async function askTime(env,ctx,data){ await setState(env,ctx.uid,'task:time',data); const rows=[]; let r=[]; for(let h=6;h<=23;h++){ r.push(btn(`${String(h).padStart(2,'0')}:00`,`tw:time:${h}`)); if(r.length===4){rows.push(r);r=[];} } if(r.length) rows.push(r); rows.push([btn('Без времени','tw:time:none')]); await send(env,ctx.chatId,'Время:', ikb(rows)); }
async function askReminders(env,ctx,data){
  const u=await dbOne(env,'eb1_users',`telegram_user_id=eq.${ctx.uid}&select=default_reminders`);
  data.picks = data.picks || (u?.default_reminders? u.default_reminders.split(',') : ['1d','at']);
  await setState(env,ctx.uid,'task:rem',data);
  let hoursAway=null; if(data.due_date&&data.due_date!=='none'){ const fire=localToUtc(...data.due_date.split('-').map(Number),(data.due_hour??9),0,ctx.user.tz); hoursAway=(fire.getTime()-Date.now())/3600000; }
  await send(env,ctx.chatId,'🔔 Напоминания:', ikb(reminderPicksKeyboard(data.picks,hoursAway,'tw')));
}
async function finalizeTask(env,ctx,data){
  const row={ telegram_user_id:ctx.uid, title:data.title||'Задача', type:data.type||'Другое', due_date:(data.due_date&&data.due_date!=='none')?data.due_date:null, due_hour:(data.due_hour===0||data.due_hour)?data.due_hour:null, repeat:'none' };
  const task=await dbInsertOne(env,'eb1_tasks',row);
  if(row.due_date){ const fire=localToUtc(...row.due_date.split('-').map(Number),(row.due_hour??9),0,ctx.user.tz); await scheduleEventReminders(env,ctx.uid,'task',task.id,`Задача: ${row.title}`,fire,data.picks||['at']); }
  await clearState(env,ctx.uid);
  await send(env,ctx.chatId,`✅ Задача создана.\nДобавить дополнительные данные?`, ikb([
    [btn('➕ Добавить стадию',`task:addstage:${task.id}`), btn('➕ Добавить план',`task:addplan:${task.id}`)],
    [btn('Готово',`task:open:${task.id}`)],
  ]));
}
// стадии / планы
async function taskAddStage(env,ctx,id){ await setState(env,ctx.uid,'task:stage_add',{ id:+id }); await send(env,ctx.chatId,'Опиши текущую стадию (например «5 из 50» или «не начал»):'); }
async function taskAddPlan(env,ctx,id){ await setState(env,ctx.uid,'task:plan_add',{ id:+id }); await send(env,ctx.chatId,'План: как ты собираешься выполнить задачу?'); }
// перенос
async function taskMove(env,ctx,id){ const np=nowParts(ctx.user.tz); await setState(env,ctx.uid,'task:moving',{ id:+id }); await screen(env,ctx,'На какую дату перенести?', buildCalendar(np.y,np.mo,'task:movecal')); }
// редактирование
async function taskEdit(env,ctx,id){
  await screen(env,ctx,'✏️ <b>Изменить</b>', ikb([
    [btn('Название',`task:ren:${id}`), btn('Тип',`task:retype:${id}`)],
    [btn('Дата и время',`task:redate:${id}`)],
    navRow(`task:open:${id}`),
  ]));
}
async function taskReminders(env,ctx,id){
  // пересоздаём напоминания для существующей задачи
  const x=await dbOne(env,'eb1_tasks',`telegram_user_id=eq.${ctx.uid}&id=eq.${id}`); if(!x) return showMenu(env,ctx);
  if(!x.due_date){ await answer(env,ctx.cbId,'Сначала задай дату'); return; }
  await setState(env,ctx.uid,'task:remedit',{ id:+id, picks:['at'], due_date:x.due_date, due_hour:x.due_hour });
  let hoursAway=null; const fire=localToUtc(...x.due_date.split('-').map(Number),(x.due_hour??9),0,ctx.user.tz); hoursAway=(fire.getTime()-Date.now())/3600000;
  await screen(env,ctx,'🔔 Напоминания (перезапишут текущие):', ikb(reminderPicksKeyboard(['at'],hoursAway,'tre')));
}

// ═══ ЦЕЛИ ═══
async function goalMenu(env,ctx){
  const rows=await dbSelect(env,'eb1_goals',`telegram_user_id=eq.${ctx.uid}&status=eq.active&select=id,title,stage&order=created_at.desc`);
  let t='🎯 <b>Цели</b>\n\n'; const kb=[];
  if(!rows?.length) t+='<i>пока нет целей</i>';
  else for(const g of rows){ t+=`<b>${esc(g.title)}</b>\nСтадия: ${esc(g.stage)||'—'}\n\n`; kb.push([btn(g.title.slice(0,55),`goal:open:${g.id}`)]); }
  kb.push([btn('➕ Новая цель','goal:new')]); kb.push(navRow('nav:menu'));
  await screen(env,ctx,t,ikb(kb));
}
async function goalOpen(env,ctx,id){
  const g=await dbOne(env,'eb1_goals',`telegram_user_id=eq.${ctx.uid}&id=eq.${id}`); if(!g) return goalMenu(env,ctx);
  const stages=await dbSelect(env,'eb1_goal_stage_history',`goal_id=eq.${id}&select=new_stage,changed_at&order=changed_at.asc`);
  const plans=await dbSelect(env,'eb1_goal_plans',`goal_id=eq.${id}&select=text,created_at&order=created_at.asc`);
  let t=`🎯 <b>${esc(g.title)}</b>\nСтадия: ${esc(g.stage)||'—'}\n`;
  t+='\n<b>История стадий</b>\n'; if(stages?.length) for(const s of stages) t+=`${fmtTs(new Date(s.changed_at),ctx.user.tz)}\n${esc(s.new_stage)}\n`; else t+='<i>пока нет</i>\n';
  t+='\n<b>История планов</b>\n'; if(plans?.length) for(const pl of plans) t+=`${fmtTs(new Date(pl.created_at),ctx.user.tz)}\n${esc(pl.text)}\n`; else t+='<i>пока нет</i>\n';
  await screen(env,ctx,t,ikb([
    [btn('➕ Добавить стадию',`goal:addstage:${id}`), btn('➕ Добавить план',`goal:addplan:${id}`)],
    [btn('✏️ Переименовать',`goal:ren:${id}`), btn('🏁 Закрыть',`goal:close:${id}`)],
    [btn('🗑 Удалить',`goal:del:${id}`)],
    navRow('goal:menu'),
  ]));
}

// ═══ ФИНАНСЫ ═══
function finMenuKb(){
  return ikb([
    [btn('➕ Добавить (доход)','fin:add:income'), btn('➖ Убрать (расход)','fin:add:expense')],
    [btn('💼 Баланс','fin:bal'), btn('📊 Аналитика','fin:an:today')],
    [btn('🐷 Сбережения','fin:save'), btn('🗂 Категории','fin:cat')],
    navRow('nav:menu'),
  ]);
}
async function finMenu(env,ctx){
  const bal=await computeBalance(env,ctx.uid); const today=nowParts(ctx.user.tz).dateStr;
  const spent=(await sumTx(env,ctx.uid,'expense',today,today)).reduce((s,x)=>s+ +x.amount,0);
  await screen(env,ctx,`💰 <b>Финансы</b>\nБаланс: <b>${money(bal)}</b>\nСегодня расходы: ${money(spent)}\n\nБыстрый ввод: «550 еда», «1000 пятёрочка», «+3000 зарплата».`, finMenuKb());
}
async function finAddStart(env,ctx,kind){ await setState(env,ctx.uid,'fin:amount',{ type:kind }); await screen(env,ctx,`${kind==='income'?'➕ Доход':'➖ Расход'}\nВведи сумму (можно с описанием: «550 пятёрочка»):`, ikb([navRow('fin:menu')])); }
async function finConfirm(env,ctx,parsed){
  const cat=parsed.categoryId?await dbOne(env,'eb1_finance_categories',`id=eq.${parsed.categoryId}&select=name,emoji`):null;
  const kind=parsed.type||'expense'; await setState(env,ctx.uid,'fin:confirm',{ ...parsed, type:kind });
  let t=`<b>${kind==='income'?'Доход':'Расход'}</b>\nСумма: ${money(parsed.amount)}\nКатегория: ${cat?`${cat.emoji} ${cat.name}`:'—'}\n`;
  if(parsed.description) t+=`Описание: ${esc(parsed.description)}\n`; t+=`Дата: сегодня\n\nЗаписать?`;
  await send(env,ctx.chatId,t,ikb([ [btn('✅ Записать','fin:save_tx'), btn('✏️ Категория','fin:pick_cat')], [btn('🔁 Тип','fin:flip'), btn('❌ Отмена','fin:cancel')] ]));
}
async function finSaveTx(env,ctx){
  const st=await getState(env,ctx.uid); const d=st.data; if(!d?.amount) return finMenu(env,ctx);
  const today=nowParts(ctx.user.tz).dateStr;
  await dbInsert(env,'eb1_finance_transactions',{ telegram_user_id:ctx.uid, amount:d.amount, type:d.type||'expense', category_id:d.categoryId||null, description:d.description||'', tx_date:today });
  await clearState(env,ctx.uid); const bal=await computeBalance(env,ctx.uid);
  await send(env,ctx.chatId,`✅ Записано: ${money(d.amount)}\nБаланс: ${money(bal)}`, finMenuKb());
}
async function finBalance(env,ctx){
  const u=await dbOne(env,'eb1_users',`telegram_user_id=eq.${ctx.uid}&select=start_balance`); const bal=await computeBalance(env,ctx.uid);
  await screen(env,ctx,`💼 <b>Баланс</b>\n\nТекущий: <b>${money(bal)}</b>\nСтартовый: ${money(u?.start_balance||0)}\n\nФормула: стартовый + доходы − расходы + корректировки.`, ikb([ [btn('✏️ Стартовый баланс','fin:setstart')], [btn('➕/➖ Корректировка','fin:adjust')], navRow('fin:menu') ]));
}
async function finAnalytics(env,ctx,scope,customFrom,customTo){
  const np=nowParts(ctx.user.tz); const today=np.dateStr; let from,to,label,prevFrom,prevTo;
  if(scope==='today'){ from=to=today; label='Сегодня'; prevFrom=prevTo=addDaysStr(today,-1); }
  else if(scope==='week'){ from=addDaysStr(today,-6); to=today; label='Неделя'; prevFrom=addDaysStr(today,-13); prevTo=addDaysStr(today,-7); }
  else if(scope==='month'){ from=`${np.y}-${String(np.mo).padStart(2,'0')}-01`; to=today; label='Месяц'; const pm=np.mo===1?12:np.mo-1; const py=np.mo===1?np.y-1:np.y; prevFrom=`${py}-${String(pm).padStart(2,'0')}-01`; prevTo=`${py}-${String(pm).padStart(2,'0')}-${String(new Date(Date.UTC(py,pm,0)).getUTCDate()).padStart(2,'0')}`; }
  else { from=customFrom; to=customTo; label=`${fmtShort(from)}–${fmtShort(to)}`; prevFrom=prevTo=null; }
  const expRows=await sumTx(env,ctx.uid,'expense',from,to); const exp=expRows.reduce((s,x)=>s+ +x.amount,0);
  const inc=(await sumTx(env,ctx.uid,'income',from,to)).reduce((s,x)=>s+ +x.amount,0);
  const cats=await dbSelect(env,'eb1_finance_categories',`telegram_user_id=eq.${ctx.uid}&select=id,name,emoji`); const catMap=Object.fromEntries((cats||[]).map(c=>[c.id,`${c.emoji} ${c.name}`]));
  const byCat={}; for(const x of expRows){ const k=x.category_id||0; byCat[k]=(byCat[k]||0)+ +x.amount; }
  const top=Object.entries(byCat).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const nDays=Math.max(1,new Set(expRows.map(x=>x.tx_date)).size); const avg=exp/nDays;
  const biggest=expRows.slice().sort((a,b)=>b.amount-a.amount)[0];
  let prevExp=null; if(prevFrom) prevExp=(await sumTx(env,ctx.uid,'expense',prevFrom,prevTo)).reduce((s,x)=>s+ +x.amount,0);
  let t=`📊 <b>Аналитика — ${label}</b>\n\nДоходы: ${money(inc)}\nРасходы: ${money(exp)}\nИтог: ${inc-exp>=0?'+':''}${money(inc-exp)}\nБаланс сейчас: ${money(await computeBalance(env,ctx.uid))}\n`;
  t+=`Средняя трата в день: ${money(avg)}\n`;
  if(biggest) t+=`Самая большая трата: ${money(biggest.amount)}${biggest.description?` (${esc(biggest.description)})`:''}\n`;
  if(prevExp!=null) t+=`Сравнение с прошлым периодом: ${exp-prevExp>=0?'+':''}${money(exp-prevExp)}\n`;
  t+='\n<b>Топ категорий:</b>\n'; if(top.length) for(const [k,v] of top) t+=`• ${catMap[k]||'без категории'} — ${money(v)}\n`; else t+='<i>нет данных</i>\n';
  const kb=[ [btn('Сегодня','fin:an:today'), btn('Неделя','fin:an:week'), btn('Месяц','fin:an:month')], [btn('Выбрать период','fin:anperiod'), btn('📈 Графики','fin:charts:'+scope)], navRow('fin:menu') ];
  await screen(env,ctx,t,ikb(kb));
}
async function finCharts(env,ctx,scope){
  const np=nowParts(ctx.user.tz); const today=np.dateStr; let from,to;
  if(scope==='today'){ from=to=today; } else if(scope==='week'){ from=addDaysStr(today,-6); to=today; } else { from=`${np.y}-${String(np.mo).padStart(2,'0')}-01`; to=today; }
  const rows=await sumTx(env,ctx.uid,'expense',from,to);
  const cats=await dbSelect(env,'eb1_finance_categories',`telegram_user_id=eq.${ctx.uid}&select=id,name`); const catMap=Object.fromEntries((cats||[]).map(c=>[c.id,c.name]));
  const byCat={}; for(const x of rows){ const k=catMap[x.category_id]||'Прочее'; byCat[k]=(byCat[k]||0)+ +x.amount; }
  const byDay={}; for(const x of rows){ byDay[x.tx_date]=(byDay[x.tx_date]||0)+ +x.amount; }
  await answer(env,ctx.cbId,'Рисую…');
  if(Object.keys(byCat).length) await sendPhoto(env,ctx.chatId,pieChart('Расходы по категориям',Object.keys(byCat),Object.values(byCat)),'🥧 Категории');
  const dks=Object.keys(byDay).sort(); if(dks.length) await sendPhoto(env,ctx.chatId,lineChart('Расходы по дням',dks.map(fmtDate),dks.map(d=>byDay[d]),'Расход'),'📉 По дням');
  await send(env,ctx.chatId,'Готово.', ikb([navRow('fin:menu')]));
}
async function finSavings(env,ctx){
  const rows=await dbSelect(env,'eb1_savings_goals',`telegram_user_id=eq.${ctx.uid}&closed=eq.false&select=id,title,target,current&order=id.asc`);
  let t='🐷 <b>Сбережения</b>\n\n'; const kb=[];
  if(!rows?.length) t+='<i>нет целей накопления</i>';
  else for(const s of rows){ const pct=Math.min(100,Math.round(s.current/Number(s.target)*100)); const f=Math.round(pct/10); t+=`${esc(s.title)}\n${money(s.current)} из ${money(s.target)}\n${'█'.repeat(f)}${'░'.repeat(10-f)} ${pct}%\n\n`; kb.push([btn(`➕ ${s.title}`.slice(0,28),`fin:savadd:${s.id}`), btn('➖',`fin:savsub:${s.id}`), btn('🗑',`fin:savdel:${s.id}`)]); }
  kb.push([btn('➕ Новая цель','fin:savnew')]); kb.push(navRow('fin:menu'));
  await screen(env,ctx,t,ikb(kb));
}
async function finCategories(env,ctx){
  const cats=await dbSelect(env,'eb1_finance_categories',`telegram_user_id=eq.${ctx.uid}&select=id,name,emoji,kind&order=kind.asc,id.asc`);
  let t='🗂 <b>Категории</b>\n\n<b>Доходы:</b>\n'; const kb=[];
  for(const c of (cats||[]).filter(c=>c.kind==='income')){ t+=`${c.emoji} ${c.name}\n`; kb.push([btn(`${c.emoji} ${c.name}`,`fin:catopen:${c.id}`)]); }
  t+='\n<b>Расходы:</b>\n'; for(const c of (cats||[]).filter(c=>c.kind==='expense')){ t+=`${c.emoji} ${c.name}\n`; kb.push([btn(`${c.emoji} ${c.name}`,`fin:catopen:${c.id}`)]); }
  kb.push([btn('➕ Категория дохода','fin:catnew:income'), btn('➕ Категория расхода','fin:catnew:expense')]); kb.push(navRow('fin:menu'));
  await screen(env,ctx,t,ikb(kb));
}
async function finCatOpen(env,ctx,id){
  const c=await dbOne(env,'eb1_finance_categories',`telegram_user_id=eq.${ctx.uid}&id=eq.${id}`); if(!c) return finCategories(env,ctx);
  const kws=await dbSelect(env,'eb1_finance_category_keywords',`telegram_user_id=eq.${ctx.uid}&category_id=eq.${id}&select=keyword`);
  await screen(env,ctx,`${c.emoji} <b>${esc(c.name)}</b> (${c.kind==='income'?'доход':'расход'})\nКлючевые слова: ${(kws||[]).map(k=>k.keyword).join(', ')||'—'}`, ikb([ [btn('✏️ Имя',`fin:catren:${id}`), btn('😀 Emoji',`fin:catemoji:${id}`)], [btn('➕ Ключевое слово',`fin:catkw:${id}`)], [btn('🗑 Удалить',`fin:catdel:${id}`)], navRow('fin:cat') ]));
}

// ═══ НАСТРОЙКИ ═══
async function setMenu(env,ctx){
  const u=await dbOne(env,'eb1_users',`telegram_user_id=eq.${ctx.uid}`);
  const dr=(u.default_reminders||'1d,at').split(',');
  const lbl={ '1w':'неделя','3d':'3 дня','1d':'сутки','12h':'12ч','3h':'3ч','1h':'час','at':'в момент' };
  await screen(env,ctx,`⚙️ <b>Настройки</b>\n\nУтренний брифинг: ${u.briefing_enabled?'вкл':'выкл'} в ${u.briefing_time}\nВечерний брифинг: ${u.evening_enabled?'вкл':'выкл'} в ${u.evening_time||'22:00'}\nЧасовой пояс: ${u.tz}\nСтандартные напоминания: ${dr.map(x=>lbl[x]||x).join(', ')}`, ikb([
    [btn(u.briefing_enabled?'🔕 Утренний выкл':'🔔 Утренний вкл','set:mtoggle'), btn('🕖 Время утра','set:mtime')],
    [btn(u.evening_enabled?'🔕 Вечерний выкл':'🔔 Вечерний вкл','set:etoggle'), btn('🕙 Время вечера','set:etime')],
    [btn('🔔 Стандартные напоминания','set:reminders')],
    [btn('🌍 Часовой пояс','set:tz')],
    navRow('nav:menu'),
  ]));
}
async function setReminders(env,ctx){
  const u=await dbOne(env,'eb1_users',`telegram_user_id=eq.${ctx.uid}&select=default_reminders`);
  const picks=(u.default_reminders||'1d,at').split(',');
  await screen(env,ctx,'🔔 <b>Стандартные напоминания</b>\nПодставляются при создании новой задачи:', ikb(reminderPicksKeyboard(picks,null,'sdr')));
}

// ═══ БРИФИНГИ ═══
async function buildMorning(env,uid,tz){
  const today=nowParts(tz).dateStr;
  const todayTasks=await dbSelect(env,'eb1_tasks',`telegram_user_id=eq.${uid}&archived=eq.false&status=neq.done&due_date=eq.${today}&select=title,due_hour&order=due_hour.asc`);
  const upcoming=await dbSelect(env,'eb1_tasks',`telegram_user_id=eq.${uid}&archived=eq.false&status=neq.done&due_date=gt.${today}&due_date=lte.${addDaysStr(today,7)}&select=title,due_date,due_hour&order=due_date.asc`);
  const goals=await dbSelect(env,'eb1_goals',`telegram_user_id=eq.${uid}&status=eq.active&select=title,stage&limit=5`);
  let t='☀️ <b>Доброе утро!</b>\n\n📌 <b>Задачи на сегодня:</b>\n';
  if(todayTasks?.length) for(const x of todayTasks) t+=`${x.due_hour!=null?String(x.due_hour).padStart(2,'0')+':00':'Без времени —'} ${esc(x.title)}\n`; else t+='<i>на сегодня пусто</i>\n';
  t+='\n🗓 <b>Ближайшие:</b>\n'; if(upcoming?.length) for(const x of upcoming.slice(0,8)) t+=`${fmtShort(x.due_date)} ${x.due_hour!=null?String(x.due_hour).padStart(2,'0')+':00':''} ${esc(x.title)}\n`; else t+='<i>нет</i>\n';
  t+='\n🎯 <b>Цели:</b>\n'; if(goals?.length) for(const g of goals) t+=`• ${esc(g.title)}${g.stage?` — ${esc(g.stage)}`:''}\n`; else t+='<i>нет</i>\n';
  return t;
}
async function buildEvening(env,uid,tz){
  const today=nowParts(tz).dateStr;
  const done=await dbSelect(env,'eb1_tasks',`telegram_user_id=eq.${uid}&status=eq.done&done_at=gte.${today}T00:00:00&select=title`);
  const notDone=await dbSelect(env,'eb1_tasks',`telegram_user_id=eq.${uid}&archived=eq.false&status=neq.done&due_date=eq.${today}&select=title,due_hour`);
  const moved=await dbSelect(env,'eb1_tasks',`telegram_user_id=eq.${uid}&moved_at=gte.${today}T00:00:00&select=title,due_date`);
  const tomorrow=await dbSelect(env,'eb1_tasks',`telegram_user_id=eq.${uid}&archived=eq.false&status=neq.done&due_date=eq.${addDaysStr(today,1)}&select=title,due_hour&order=due_hour.asc`);
  const goals=await dbSelect(env,'eb1_goals',`telegram_user_id=eq.${uid}&status=eq.active&select=title,stage&limit=5`);
  let t='🌙 <b>Итоги дня</b>\n\n✅ <b>Выполнено:</b>\n'; if(done?.length) for(const x of done) t+=`• ${esc(x.title)}\n`; else t+='<i>ничего</i>\n';
  t+='\n❌ <b>Не выполнено:</b>\n'; if(notDone?.length) for(const x of notDone) t+=`• ${esc(x.title)}\n`; else t+='<i>всё закрыто 👍</i>\n';
  t+='\n📅 <b>Перенесено сегодня:</b>\n'; if(moved?.length) for(const x of moved) t+=`• ${esc(x.title)} → ${x.due_date?fmtShort(x.due_date):'—'}\n`; else t+='<i>нет</i>\n';
  t+='\n➡️ <b>Завтра:</b>\n'; if(tomorrow?.length) for(const x of tomorrow) t+=`${x.due_hour!=null?String(x.due_hour).padStart(2,'0')+':00':'Без времени —'} ${esc(x.title)}\n`; else t+='<i>пусто</i>\n';
  t+='\n🎯 <b>Цели:</b>\n'; if(goals?.length) for(const g of goals) t+=`• ${esc(g.title)}${g.stage?` — ${esc(g.stage)}`:''}\n`; else t+='<i>нет</i>\n';
  return t;
}

// ═══ ТЕКСТ ═══
async function handleText(env,ctx,text){
  const st=await getState(env,ctx.uid); const state=st.state; const data=st.data||{};
  if(state){ if(await stepText(env,ctx,state,data,text)) return; }
  // нет активного шага → роутинг по первому символу
  if(/^[+-]?\d/.test(text.trim())){ const parsed=await parseQuickFinance(env,ctx.uid,text); if(parsed) return finConfirm(env,ctx,parsed); }
  // иначе — это задача
  return taskWizardStart(env,ctx,text.trim());
}
async function stepText(env,ctx,state,data,text){
  const t=text.trim(); const done=async(msg,kb)=>{ await clearState(env,ctx.uid); await send(env,ctx.chatId,msg,kb); };
  switch(state){
    case 'task:title': { data.title=t; data.type=detectTaskType(t); await askType(env,ctx,data,false); return true; }
    case 'fin:amount': { const parsed=await parseQuickFinance(env,ctx.uid,t); if(!parsed){ await send(env,ctx.chatId,'Не понял сумму. Пример: «550 еда».'); return true; } parsed.type=data.type||parsed.type; await finConfirm(env,ctx,parsed); return true; }
    case 'task:stage_add': { const x=await dbOne(env,'eb1_tasks',`id=eq.${data.id}&select=stage`); await dbInsert(env,'eb1_task_stage_history',{ telegram_user_id:ctx.uid, task_id:data.id, old_stage:x?.stage||'', new_stage:t }); await dbUpdate(env,'eb1_tasks',`id=eq.${data.id}`,{ stage:t }); await done('✅ Стадия добавлена', ikb([[btn('Открыть',`task:open:${data.id}`)]])); return true; }
    case 'task:plan_add': { await dbInsert(env,'eb1_task_plans',{ telegram_user_id:ctx.uid, task_id:data.id, text:t }); await done('✅ План добавлен', ikb([[btn('Открыть',`task:open:${data.id}`)]])); return true; }
    case 'task:ren': { await dbUpdate(env,'eb1_tasks',`id=eq.${data.id}`,{ title:t }); await done('✅ Название изменено', ikb([[btn('Открыть',`task:open:${data.id}`)]])); return true; }
    case 'goal:new': { const g=await dbInsertOne(env,'eb1_goals',{ telegram_user_id:ctx.uid, title:t }); await done('🎯 Цель создана', ikb([[btn('Открыть',`goal:open:${g.id}`)],[btn('🏠 Меню','nav:menu')]])); return true; }
    case 'goal:stage_add': { const g=await dbOne(env,'eb1_goals',`id=eq.${data.id}&select=stage`); await dbInsert(env,'eb1_goal_stage_history',{ telegram_user_id:ctx.uid, goal_id:data.id, old_stage:g?.stage||'', new_stage:t }); await dbUpdate(env,'eb1_goals',`id=eq.${data.id}`,{ stage:t }); await done('✅ Стадия добавлена', ikb([[btn('Открыть',`goal:open:${data.id}`)]])); return true; }
    case 'goal:plan_add': { await dbInsert(env,'eb1_goal_plans',{ telegram_user_id:ctx.uid, goal_id:data.id, text:t }); await done('✅ План добавлен', ikb([[btn('Открыть',`goal:open:${data.id}`)]])); return true; }
    case 'goal:ren': { await dbUpdate(env,'eb1_goals',`id=eq.${data.id}`,{ title:t }); await done('✅ Переименовано', ikb([[btn('Открыть',`goal:open:${data.id}`)]])); return true; }
    case 'fin:catnew': { const m=t.match(/^(\S+)?\s*(.+)?$/); const emoji=(m&&m[1]&&/\p{Extended_Pictographic}/u.test(m[1]))?m[1]:''; const name=emoji?(m[2]||'').trim():t; await dbInsertOne(env,'eb1_finance_categories',{ telegram_user_id:ctx.uid, name:name||t, emoji, kind:data.kind||'expense' }); await done('✅ Категория создана', ikb([[btn('Категории','fin:cat')]])); return true; }
    case 'fin:catren': { await dbUpdate(env,'eb1_finance_categories',`id=eq.${data.id}`,{ name:t }); await done('✅ Готово', ikb([[btn('Открыть',`fin:catopen:${data.id}`)]])); return true; }
    case 'fin:catemoji': { await dbUpdate(env,'eb1_finance_categories',`id=eq.${data.id}`,{ emoji:t }); await done('✅ Готово', ikb([[btn('Открыть',`fin:catopen:${data.id}`)]])); return true; }
    case 'fin:catkw': { await dbInsert(env,'eb1_finance_category_keywords',{ telegram_user_id:ctx.uid, category_id:data.id, keyword:t.toLowerCase() }); await done('✅ Слово добавлено', ikb([[btn('Открыть',`fin:catopen:${data.id}`)]])); return true; }
    case 'fin:setstart': { await dbUpdate(env,'eb1_users',`telegram_user_id=eq.${ctx.uid}`,{ start_balance:parseFloat(t.replace(',','.'))||0 }); await done('✅ Стартовый баланс задан', ikb([[btn('Баланс','fin:bal')]])); return true; }
    case 'fin:adjust': { const v=parseFloat(t.replace(',','.')); if(isFinite(v)) await dbInsert(env,'eb1_balance_adjustments',{ telegram_user_id:ctx.uid, amount:v, reason:'корректировка' }); await done('✅ Скорректировано', ikb([[btn('Баланс','fin:bal')]])); return true; }
    case 'fin:savnew': { const mm=t.match(/^(.+?)\s+(\d+(?:[.,]\d+)?)$/); if(!mm){ await send(env,ctx.chatId,'Формат: «Ноутбук 120000»'); return true; } await dbInsert(env,'eb1_savings_goals',{ telegram_user_id:ctx.uid, title:mm[1].trim(), target:parseFloat(mm[2].replace(',','.')) }); await done('✅ Цель создана', ikb([[btn('Сбережения','fin:save')]])); return true; }
    case 'fin:savadd': { const v=parseFloat(t.replace(',','.'))||0; const s=await dbOne(env,'eb1_savings_goals',`id=eq.${data.id}&select=current`); await dbUpdate(env,'eb1_savings_goals',`id=eq.${data.id}`,{ current:Number(s.current)+v }); await done('✅ Пополнено', ikb([[btn('Сбережения','fin:save')]])); return true; }
    case 'fin:savsub': { const v=parseFloat(t.replace(',','.'))||0; const s=await dbOne(env,'eb1_savings_goals',`id=eq.${data.id}&select=current`); await dbUpdate(env,'eb1_savings_goals',`id=eq.${data.id}`,{ current:Math.max(0,Number(s.current)-v) }); await done('✅ Уменьшено', ikb([[btn('Сбережения','fin:save')]])); return true; }
    case 'set:mtime': { if(/^\d{1,2}:\d{2}$/.test(t)) await dbUpdate(env,'eb1_users',`telegram_user_id=eq.${ctx.uid}`,{ briefing_time:t.padStart(5,'0') }); await done('✅ Время утра задано', ikb([[btn('Настройки','set:menu')]])); return true; }
    case 'set:etime': { if(/^\d{1,2}:\d{2}$/.test(t)) await dbUpdate(env,'eb1_users',`telegram_user_id=eq.${ctx.uid}`,{ evening_time:t.padStart(5,'0') }); await done('✅ Время вечера задано', ikb([[btn('Настройки','set:menu')]])); return true; }
    case 'set:tz': { await dbUpdate(env,'eb1_users',`telegram_user_id=eq.${ctx.uid}`,{ tz:t }); await done('✅ Часовой пояс задан', ikb([[btn('Настройки','set:menu')]])); return true; }
  }
  return false;
}

// ═══ РОУТЕР CALLBACK ═══
async function handleCallback(env,ctx,data){
  const p=data.split(':'); const area=p[0];
  if(data==='noop') return answer(env,ctx.cbId);
  if(area==='nav'){ await clearState(env,ctx.uid); return showMenu(env,ctx); }

  // мастер задачи
  if(area==='tw'){
    const st=await getState(env,ctx.uid); const d=st.data||{};
    if(p[1]==='type'){ d.type=p.slice(2).join(':'); await askDate(env,ctx,d); return; }
    if(p[1]==='cal'&&p[2]==='nav'){ let y=+p[3],mo=+p[4]+ +p[5]; if(mo<1){mo=12;y--;} if(mo>12){mo=1;y++;} return edit(env,ctx.chatId,ctx.msgId,'Дата:',buildCalendar(y,mo,'tw:cal',[btn('Без даты','tw:date:none')])); }
    if(p[1]==='cal'&&p[2]==='pick'){ d.due_date=p[3]; await askTime(env,ctx,d); return; }
    if(p[1]==='date'){ d.due_date=p[2]; if(p[2]==='none'){ d.due_hour=null; await askReminders(env,ctx,d); } else await askTime(env,ctx,d); return; }
    if(p[1]==='time'){ d.due_hour=p[2]==='none'?null:+p[2]; await askReminders(env,ctx,d); return; }
    if(p[1]==='rt'){ d.picks=d.picks||['at']; const k=p[2]; d.picks=d.picks.includes(k)?d.picks.filter(x=>x!==k):[...d.picks,k]; await setState(env,ctx.uid,'task:rem',d); let h=null; if(d.due_date&&d.due_date!=='none'){ const f=localToUtc(...d.due_date.split('-').map(Number),(d.due_hour??9),0,ctx.user.tz); h=(f.getTime()-Date.now())/3600000; } return edit(env,ctx.chatId,ctx.msgId,'🔔 Напоминания:',ikb(reminderPicksKeyboard(d.picks,h,'tw'))); }
    if(p[1]==='rdone') return finalizeTask(env,ctx,d);
  }
  // напоминания существующей задачи
  if(area==='tre'){
    const st=await getState(env,ctx.uid); const d=st.data||{};
    if(p[1]==='rt'){ const k=p[2]; d.picks=d.picks.includes(k)?d.picks.filter(x=>x!==k):[...d.picks,k]; await setState(env,ctx.uid,'task:remedit',d); const f=localToUtc(...d.due_date.split('-').map(Number),(d.due_hour??9),0,ctx.user.tz); const h=(f.getTime()-Date.now())/3600000; return edit(env,ctx.chatId,ctx.msgId,'🔔 Напоминания:',ikb(reminderPicksKeyboard(d.picks,h,'tre'))); }
    if(p[1]==='rdone'){ const x=await dbOne(env,'eb1_tasks',`id=eq.${d.id}&select=title`); await dbDelete(env,'eb1_reminders',`kind=eq.task&ref_id=eq.${d.id}&sent=eq.false`); const fire=localToUtc(...d.due_date.split('-').map(Number),(d.due_hour??9),0,ctx.user.tz); await scheduleEventReminders(env,ctx.uid,'task',d.id,`Задача: ${x?.title||''}`,fire,d.picks); await clearState(env,ctx.uid); return taskOpen(env,ctx,d.id); }
  }
  // стандартные напоминания в настройках
  if(area==='sdr'){
    const st=await getState(env,ctx.uid); let picks=st.data?.picks; if(!picks){ const u=await dbOne(env,'eb1_users',`telegram_user_id=eq.${ctx.uid}&select=default_reminders`); picks=(u.default_reminders||'1d,at').split(','); }
    if(p[1]==='rt'){ const k=p[2]; picks=picks.includes(k)?picks.filter(x=>x!==k):[...picks,k]; await setState(env,ctx.uid,'set:dr',{ picks }); return edit(env,ctx.chatId,ctx.msgId,'🔔 Стандартные напоминания:',ikb(reminderPicksKeyboard(picks,null,'sdr'))); }
    if(p[1]==='rdone'){ await dbUpdate(env,'eb1_users',`telegram_user_id=eq.${ctx.uid}`,{ default_reminders:picks.join(',') }); await clearState(env,ctx.uid); return setMenu(env,ctx); }
  }

  if(area==='task'){
    switch(p[1]){
      case 'new': return taskWizardStart(env,ctx);
      case 'list': return taskListScope(env,ctx,p[2]);
      case 'open': return taskOpen(env,ctx,p[2]);
      case 'done': return taskDone(env,ctx,p[2]);
      case 'addstage': return taskAddStage(env,ctx,p[2]);
      case 'addplan': return taskAddPlan(env,ctx,p[2]);
      case 'move': return taskMove(env,ctx,p[2]);
      case 'movecal': { if(p[2]==='nav'){ let y=+p[3],mo=+p[4]+ +p[5]; if(mo<1){mo=12;y--;} if(mo>12){mo=1;y++;} return edit(env,ctx.chatId,ctx.msgId,'Дата:',buildCalendar(y,mo,'task:movecal')); } if(p[2]==='pick'){ const st=await getState(env,ctx.uid); const id=st.data.id; const x=await dbOne(env,'eb1_tasks',`id=eq.${id}&select=title,due_hour`); await dbUpdate(env,'eb1_tasks',`id=eq.${id}`,{ due_date:p[3], moved_at:new Date().toISOString(), nudge3_sent:false, nudge7_sent:false }); await dbDelete(env,'eb1_reminders',`kind=eq.task&ref_id=eq.${id}&sent=eq.false`); const fire=localToUtc(...p[3].split('-').map(Number),(x?.due_hour??9),0,ctx.user.tz); await scheduleEventReminders(env,ctx.uid,'task',id,`Задача: ${x?.title||''}`,fire,['at']); await clearState(env,ctx.uid); return taskOpen(env,ctx,id); } break; }
      case 'rem': return taskReminders(env,ctx,p[2]);
      case 'edit': return taskEdit(env,ctx,p[2]);
      case 'ren': await setState(env,ctx.uid,'task:ren',{ id:+p[2] }); return send(env,ctx.chatId,'Новое название:');
      case 'retype': { const rows=[]; let r=[]; for(const ty of TASK_TYPES){ r.push(btn(ty,`task:settype:${ty}:${p[2]}`)); if(r.length===3){rows.push(r);r=[];} } if(r.length) rows.push(r); rows.push(navRow(`task:open:${p[2]}`)); return screen(env,ctx,'Выбери тип:',ikb(rows)); }
      case 'settype': { await dbUpdate(env,'eb1_tasks',`id=eq.${p[3]}`,{ type:p[2] }); return taskOpen(env,ctx,p[3]); }
      case 'redate': { const np=nowParts(ctx.user.tz); await setState(env,ctx.uid,'task:redating',{ id:+p[2] }); return screen(env,ctx,'Новая дата:',buildCalendar(np.y,np.mo,'task:redatecal',[btn('Без даты','task:redatenone:'+p[2])])); }
      case 'redatenone': { await dbUpdate(env,'eb1_tasks',`id=eq.${p[2]}`,{ due_date:null, due_hour:null }); await dbDelete(env,'eb1_reminders',`kind=eq.task&ref_id=eq.${p[2]}&sent=eq.false`); await clearState(env,ctx.uid); return taskOpen(env,ctx,p[2]); }
      case 'redatecal': { if(p[2]==='nav'){ let y=+p[3],mo=+p[4]+ +p[5]; if(mo<1){mo=12;y--;} if(mo>12){mo=1;y++;} return edit(env,ctx.chatId,ctx.msgId,'Дата:',buildCalendar(y,mo,'task:redatecal')); } if(p[2]==='pick'){ const st=await getState(env,ctx.uid); const d=st.data; d.due_date=p[3]; await setState(env,ctx.uid,'task:redating',d); const rows=[]; let r=[]; for(let h=6;h<=23;h++){ r.push(btn(`${String(h).padStart(2,'0')}:00`,`task:redtime:${h}`)); if(r.length===4){rows.push(r);r=[];} } if(r.length) rows.push(r); rows.push([btn('Без времени','task:redtime:none')]); return edit(env,ctx.chatId,ctx.msgId,'Время:',ikb(rows)); } break; }
      case 'redtime': { const st=await getState(env,ctx.uid); const d=st.data; const hour=p[2]==='none'?null:+p[2]; await dbUpdate(env,'eb1_tasks',`id=eq.${d.id}`,{ due_date:d.due_date, due_hour:hour, moved_at:new Date().toISOString() }); await dbDelete(env,'eb1_reminders',`kind=eq.task&ref_id=eq.${d.id}&sent=eq.false`); const x=await dbOne(env,'eb1_tasks',`id=eq.${d.id}&select=title`); const fire=localToUtc(...d.due_date.split('-').map(Number),(hour??9),0,ctx.user.tz); await scheduleEventReminders(env,ctx.uid,'task',d.id,`Задача: ${x?.title||''}`,fire,['at']); await clearState(env,ctx.uid); return taskOpen(env,ctx,d.id); }
      case 'del': return screen(env,ctx,'Удалить задачу?', ikb([[btn('🗑 Да',`task:delyes:${p[2]}`)],[btn('Отмена',`task:open:${p[2]}`)]]));
      case 'delyes': { await dbDelete(env,'eb1_tasks',`id=eq.${p[2]}&telegram_user_id=eq.${ctx.uid}`); await dbDelete(env,'eb1_reminders',`kind=eq.task&ref_id=eq.${p[2]}`); await dbDelete(env,'eb1_task_plans',`task_id=eq.${p[2]}`); await dbDelete(env,'eb1_task_stage_history',`task_id=eq.${p[2]}`); return showMenu(env,ctx); }
    }
  }

  if(area==='cal'){
    switch(p[1]){
      case 'menu': return calMenu(env,ctx);
      case 'month': return calMonth(env,ctx);
      case 'pickdate': return calPickDate(env,ctx);
      case 'cal': { if(p[2]==='nav'){ let y=+p[3],mo=+p[4]+ +p[5]; if(mo<1){mo=12;y--;} if(mo>12){mo=1;y++;} return edit(env,ctx.chatId,ctx.msgId,'Выбери дату:',buildCalendar(y,mo,'cal:cal',[btn('⬅️ Назад','cal:menu')])); } if(p[2]==='pick') return calShowDate(env,ctx,p[3]); break; }
    }
  }

  if(area==='goal'){
    switch(p[1]){
      case 'menu': return goalMenu(env,ctx);
      case 'new': await setState(env,ctx.uid,'goal:new',{}); return send(env,ctx.chatId,'Название цели:');
      case 'open': return goalOpen(env,ctx,p[2]);
      case 'addstage': await setState(env,ctx.uid,'goal:stage_add',{ id:+p[2] }); return send(env,ctx.chatId,'Опиши стадию (например «84.5 кг» или «135 из 400»):');
      case 'addplan': await setState(env,ctx.uid,'goal:plan_add',{ id:+p[2] }); return send(env,ctx.chatId,'План: как двигаешься к цели?');
      case 'ren': await setState(env,ctx.uid,'goal:ren',{ id:+p[2] }); return send(env,ctx.chatId,'Новое название цели:');
      case 'close': { await dbUpdate(env,'eb1_goals',`id=eq.${p[2]}`,{ status:'closed', closed_at:new Date().toISOString() }); await answer(env,ctx.cbId,'🏁 Цель закрыта'); return goalMenu(env,ctx); }
      case 'del': { await dbDelete(env,'eb1_goals',`id=eq.${p[2]}&telegram_user_id=eq.${ctx.uid}`); await dbDelete(env,'eb1_goal_plans',`goal_id=eq.${p[2]}`); await dbDelete(env,'eb1_goal_stage_history',`goal_id=eq.${p[2]}`); return goalMenu(env,ctx); }
    }
  }

  if(area==='fin'){
    switch(p[1]){
      case 'menu': return finMenu(env,ctx);
      case 'add': return finAddStart(env,ctx,p[2]);
      case 'save_tx': return finSaveTx(env,ctx);
      case 'cancel': await clearState(env,ctx.uid); return finMenu(env,ctx);
      case 'flip': { const st=await getState(env,ctx.uid); const d=st.data; d.type=d.type==='income'?'expense':'income'; d.categoryId=await categorize(env,ctx.uid,(d.description||'').split(/\s+/),d.type); return finConfirm(env,ctx,d); }
      case 'pick_cat': { const st=await getState(env,ctx.uid); const kind=st.data?.type||'expense'; const cats=await dbSelect(env,'eb1_finance_categories',`telegram_user_id=eq.${ctx.uid}&kind=eq.${kind}&select=id,name,emoji`); const kb=(cats||[]).map(c=>[btn(`${c.emoji} ${c.name}`,`fin:setcat:${c.id}`)]); kb.push([btn('Отмена','fin:cancel')]); return screen(env,ctx,'Категория:',ikb(kb)); }
      case 'setcat': { const st=await getState(env,ctx.uid); const d=st.data; d.categoryId=+p[2]; return finConfirm(env,ctx,d); }
      case 'bal': return finBalance(env,ctx);
      case 'setstart': await setState(env,ctx.uid,'fin:setstart',{}); return send(env,ctx.chatId,'Стартовый баланс (₽):');
      case 'adjust': await setState(env,ctx.uid,'fin:adjust',{}); return send(env,ctx.chatId,'Корректировка (напр. 500 или -300):');
      case 'an': return finAnalytics(env,ctx,p[2]);
      case 'anperiod': { const np=nowParts(ctx.user.tz); await setState(env,ctx.uid,'fin:per1',{}); return screen(env,ctx,'Начало периода:',buildCalendar(np.y,np.mo,'fin:percal1')); }
      case 'percal1': { if(p[2]==='nav'){ let y=+p[3],mo=+p[4]+ +p[5]; if(mo<1){mo=12;y--;} if(mo>12){mo=1;y++;} return edit(env,ctx.chatId,ctx.msgId,'Начало периода:',buildCalendar(y,mo,'fin:percal1')); } if(p[2]==='pick'){ await setState(env,ctx.uid,'fin:per2',{ from:p[3] }); const np=nowParts(ctx.user.tz); return edit(env,ctx.chatId,ctx.msgId,'Конец периода:',buildCalendar(np.y,np.mo,'fin:percal2')); } break; }
      case 'percal2': { if(p[2]==='nav'){ let y=+p[3],mo=+p[4]+ +p[5]; if(mo<1){mo=12;y--;} if(mo>12){mo=1;y++;} return edit(env,ctx.chatId,ctx.msgId,'Конец периода:',buildCalendar(y,mo,'fin:percal2')); } if(p[2]==='pick'){ const st=await getState(env,ctx.uid); const from=st.data.from; await clearState(env,ctx.uid); return finAnalytics(env,ctx,'custom',from,p[3]); } break; }
      case 'charts': return finCharts(env,ctx,p[2]||'month');
      case 'save': return finSavings(env,ctx);
      case 'savnew': await setState(env,ctx.uid,'fin:savnew',{}); return send(env,ctx.chatId,'«Название сумма», напр. «Ноутбук 120000»:');
      case 'savadd': await setState(env,ctx.uid,'fin:savadd',{ id:+p[2] }); return send(env,ctx.chatId,'Сколько добавить (₽)?');
      case 'savsub': await setState(env,ctx.uid,'fin:savsub',{ id:+p[2] }); return send(env,ctx.chatId,'Сколько убрать (₽)?');
      case 'savdel': { await dbDelete(env,'eb1_savings_goals',`id=eq.${p[2]}&telegram_user_id=eq.${ctx.uid}`); return finSavings(env,ctx); }
      case 'cat': return finCategories(env,ctx);
      case 'catopen': return finCatOpen(env,ctx,p[2]);
      case 'catnew': await setState(env,ctx.uid,'fin:catnew',{ kind:p[2] }); return send(env,ctx.chatId,'Введи «😀 Название» или просто название:');
      case 'catren': await setState(env,ctx.uid,'fin:catren',{ id:+p[2] }); return send(env,ctx.chatId,'Новое имя категории:');
      case 'catemoji': await setState(env,ctx.uid,'fin:catemoji',{ id:+p[2] }); return send(env,ctx.chatId,'Новый emoji:');
      case 'catkw': await setState(env,ctx.uid,'fin:catkw',{ id:+p[2] }); return send(env,ctx.chatId,'Ключевое слово:');
      case 'catdel': { await dbDelete(env,'eb1_finance_category_keywords',`category_id=eq.${p[2]}&telegram_user_id=eq.${ctx.uid}`); await dbDelete(env,'eb1_finance_categories',`id=eq.${p[2]}&telegram_user_id=eq.${ctx.uid}`); return finCategories(env,ctx); }
    }
  }

  if(area==='set'){
    switch(p[1]){
      case 'menu': return setMenu(env,ctx);
      case 'mtoggle': { const u=await dbOne(env,'eb1_users',`telegram_user_id=eq.${ctx.uid}&select=briefing_enabled`); await dbUpdate(env,'eb1_users',`telegram_user_id=eq.${ctx.uid}`,{ briefing_enabled:!u.briefing_enabled }); return setMenu(env,ctx); }
      case 'etoggle': { const u=await dbOne(env,'eb1_users',`telegram_user_id=eq.${ctx.uid}&select=evening_enabled`); await dbUpdate(env,'eb1_users',`telegram_user_id=eq.${ctx.uid}`,{ evening_enabled:!u.evening_enabled }); return setMenu(env,ctx); }
      case 'mtime': await setState(env,ctx.uid,'set:mtime',{}); return send(env,ctx.chatId,'Время утреннего брифинга (HH:MM):');
      case 'etime': await setState(env,ctx.uid,'set:etime',{}); return send(env,ctx.chatId,'Время вечернего брифинга (HH:MM):');
      case 'reminders': return setReminders(env,ctx);
      case 'tz': await setState(env,ctx.uid,'set:tz',{}); return send(env,ctx.chatId,'Часовой пояс (напр. Europe/Moscow):');
    }
  }

  if(area==='rem'&&p[1]==='snooze'){ const r=await dbOne(env,'eb1_reminders',`id=eq.${p[2]}&select=label,kind,ref_id,telegram_user_id`); if(r) await dbInsert(env,'eb1_reminders',{ telegram_user_id:r.telegram_user_id, kind:r.kind, ref_id:r.ref_id, label:r.label, fire_at:new Date(Date.now()+3600000).toISOString() }); return answer(env,ctx.cbId,'⏰ Через час'); }

  return answer(env,ctx.cbId);
}

// ═══ CRON ═══
async function runCron(env){
  const now=new Date();
  const due=await dbSelect(env,'eb1_reminders',`sent=eq.false&fire_at=lte.${now.toISOString()}&select=*&limit=100`);
  for(const r of (due||[])){
    try{ const kb=ikb([[btn('✅ Выполнено',`task:done:${r.ref_id}`),btn('⏰ Через час',`rem:snooze:${r.id}`)],[btn('📅 Перенести',`task:move:${r.ref_id}`),btn('🗑 Удалить',`task:delyes:${r.ref_id}`)]]);
      await send(env,r.telegram_user_id,`🔔 <b>Напоминание</b>\n${esc(r.label)}`,kb); await dbUpdate(env,'eb1_reminders',`id=eq.${r.id}`,{ sent:true }); }catch(e){ console.log('rem err',e.message); }
  }
  const users=await dbSelect(env,'eb1_users','select=*');
  for(const u of (users||[])){
    try{
      const np=nowParts(u.tz);
      if(u.briefing_enabled){ const [h,m]=(u.briefing_time||'07:00').split(':').map(Number); const tgt=h*60+m; if(np.minOfDay>=tgt&&np.minOfDay<tgt+5&&u.last_briefing_date!==np.dateStr){ await send(env,u.telegram_user_id,await buildMorning(env,u.telegram_user_id,u.tz)); await dbUpdate(env,'eb1_users',`telegram_user_id=eq.${u.telegram_user_id}`,{ last_briefing_date:np.dateStr }); } }
      if(u.evening_enabled){ const [h,m]=(u.evening_time||'22:00').split(':').map(Number); const tgt=h*60+m; if(np.minOfDay>=tgt&&np.minOfDay<tgt+5&&u.last_evening_date!==np.dateStr){ await send(env,u.telegram_user_id,await buildEvening(env,u.telegram_user_id,u.tz)); await dbUpdate(env,'eb1_users',`telegram_user_id=eq.${u.telegram_user_id}`,{ last_evening_date:np.dateStr }); } }
      // задачи без срока: пинги через 3 и 7 дней
      const noDate=await dbSelect(env,'eb1_tasks',`telegram_user_id=eq.${u.telegram_user_id}&archived=eq.false&status=neq.done&due_date=is.null&select=id,title,created_at,nudge3_sent,nudge7_sent`);
      for(const x of (noDate||[])){
        const ageDays=(Date.now()-new Date(x.created_at).getTime())/86400000;
        if(ageDays>=7 && !x.nudge7_sent){ await send(env,u.telegram_user_id,`⏳ Задача «${esc(x.title)}» уже 7 дней без срока.\nУдалить или назначить срок?`, ikb([[btn('📅 Назначить срок',`task:redate:${x.id}`),btn('🗑 Удалить',`task:delyes:${x.id}`)]])); await dbUpdate(env,'eb1_tasks',`id=eq.${x.id}`,{ nudge7_sent:true }); }
        else if(ageDays>=3 && !x.nudge3_sent){ await send(env,u.telegram_user_id,`⏳ Задача «${esc(x.title)}» уже 3 дня без срока.\nНазначить срок?`, ikb([[btn('📅 Назначить срок',`task:redate:${x.id}`)]])); await dbUpdate(env,'eb1_tasks',`id=eq.${x.id}`,{ nudge3_sent:true }); }
      }
    }catch(e){ console.log('user cron err',u.telegram_user_id,e.message); }
  }
}

// ═══ ВХОД ═══
export default {
  async fetch(request,env,ctx){
    if(request.method!=='POST') return new Response('Electric Brain v2 is running.');
    if(env.WEBHOOK_SECRET && request.headers.get('X-Telegram-Bot-Api-Secret-Token')!==env.WEBHOOK_SECRET) return new Response('forbidden',{ status:403 });
    let update; try{ update=await request.json(); }catch{ return new Response('ok'); }
    ctx.waitUntil(processUpdate(env,update).catch(e=>console.log('process err',e.message,e.stack)));
    return new Response('ok');
  },
  async scheduled(event,env,ctx){ ctx.waitUntil(runCron(env).catch(e=>console.log('cron err',e.message))); },
};
async function processUpdate(env,update){
  if(update.message && update.message.text){
    const msg=update.message; const from=msg.from; const user=await ensureUser(env,from);
    const c={ uid:from.id, chatId:msg.chat.id, user, msgId:null }; const text=msg.text.trim();
    if(text.startsWith('/start')||text.startsWith('/menu')){ await clearState(env,from.id); return showMenu(env,c); }
    if(text.startsWith('/settings')) return setMenu(env,c);
    if(text.startsWith('/help')) return send(env,c.chatId,'ℹ️ <b>Электрический мозг</b>\n\n• Любой текст без цифры в начале → создаётся задача.\n• Текст с цифры → финансы («550 еда», «+3000 зарплата»).\n• Остальное — через кнопки.\n\n/menu — меню',ikb([[btn('🏠 Меню','nav:menu')]]));
    return handleText(env,c,text);
  }
  if(update.callback_query){
    const cq=update.callback_query; const from=cq.from; const user=await ensureUser(env,from);
    const c={ uid:from.id, chatId:cq.message.chat.id, user, msgId:cq.message.message_id, cbId:cq.id };
    try{ await handleCallback(env,c,cq.data); }catch(e){ console.log('cb err',e.message,e.stack); }
    try{ await answer(env,cq.id); }catch{}
  }
}
/* === NADSTROYKA v3 (phone-safe) === */
(function(){
  var NEW_TYPES = ['Отношения','Развлечения','Фильмы'];
  for (var n=0;n<NEW_TYPES.length;n++){ if (TASK_TYPES.indexOf(NEW_TYPES[n])===-1) TASK_TYPES.splice(TASK_TYPES.length-1,0,NEW_TYPES[n]); }
  TYPE_PRIORITY['Отношения']=92; TYPE_PRIORITY['Развлечения']=45; TYPE_PRIORITY['Фильмы']=42;
  if (!TYPE_KW['Отношения']) TYPE_KW['Отношения']=['девушк','парн','свидани','романт','поцелу','обним','секс','минет','куни','анал','интим','флирт','любим','отношени'];
  if (!TYPE_KW['Развлечения']) TYPE_KW['Развлечения']=['кино','аквапарк','боулинг','караоке','концерт','выставк','музей','аттракцион','каток','квест','прогулк','развлеч'];
  if (!TYPE_KW['Фильмы']) TYPE_KW['Фильмы']=['посмотреть фильм','посмотреть','фильм','сериал','серию','эпизод','премьер','трейлер','дорам','аниме'];

  function tokenize(s){ return (s ? s : '').toLowerCase().replace(/ё/g,'е').split(/[^a-zа-я0-9]+/i).filter(Boolean); }
  function kwHit(text, toks, kw){
    var k = (kw ? kw : '').toLowerCase().replace(/ё/g,'е'); if(!k) return false;
    if (k.indexOf(' ') !== -1) return text.indexOf(k) !== -1;
    for (var i=0;i<toks.length;i++){ if (toks[i].indexOf(k)===0) return true; }
    return false;
  }
  detectTaskType = function(title){
    var text = (title ? title : '').toLowerCase().replace(/ё/g,'е'); var toks = tokenize(title);
    var best='Другое', bestP=-1;
    for (var type in TYPE_KW){ var arr=TYPE_KW[type]; if(!arr) continue;
      for (var i=0;i<arr.length;i++){ if (kwHit(text,toks,arr[i])){ var p=TYPE_PRIORITY[type]?TYPE_PRIORITY[type]:0; if(p>bestP){ bestP=p; best=type; } break; } } }
    return best;
  };
  categorize = async function(env, uid, words, kind){
    var cats = await dbSelect(env,'eb1_finance_categories','telegram_user_id=eq.'+uid+'&select=id,kind,name');
    var kws = await dbSelect(env,'eb1_finance_category_keywords','telegram_user_id=eq.'+uid+'&select=category_id,keyword');
    cats = cats?cats:[]; kws = kws?kws:[];
    var kindOf={}; for(var i=0;i<cats.length;i++) kindOf[cats[i].id]=cats[i].kind;
    var joined = words.join(' '); var text = joined.toLowerCase().replace(/ё/g,'е'); var toks = tokenize(joined);
    for (var j=0;j<kws.length;j++){ if (kindOf[kws[j].category_id]===kind && kwHit(text,toks,kws[j].keyword)) return kws[j].category_id; }
    for (var c=0;c<cats.length;c++){ if (cats[c].kind===kind && cats[c].name==='Другое') return cats[c].id; }
    return null;
  };

  askType = async function(env, ctx, data, isNew){
    await setState(env, ctx.uid, 'task:type', data);
    var txt = 'Задача: <b>' + esc(data.title) + '</b>\nПредложенный тип: <b>' + data.type + '</b>';
    var kb = [ [btn('✅ Верно','tw:type:'+data.type)], [btn('🔄 Поменять тип','tw:changetype')], [btn('⬅️ Назад','tw:back:title'), btn('🏠 В меню','nav:menu')] ];
    if (isNew && !ctx.msgId) await send(env, ctx.chatId, txt, ikb(kb)); else await screen(env, ctx, txt, ikb(kb));
  };
  async function showTypeList(env, ctx){
    var st = await getState(env, ctx.uid); var data = st.data?st.data:{};
    var rows=[]; var r=[];
    for (var i=0;i<TASK_TYPES.length;i++){ var ty=TASK_TYPES[i]; r.push(btn(ty===data.type?('• '+ty+' •'):ty, 'tw:type:'+ty)); if(r.length===3){ rows.push(r); r=[]; } }
    if (r.length) rows.push(r);
    rows.push([btn('⬅️ Назад','tw:back:type'), btn('🏠 В меню','nav:menu')]);
    await screen(env, ctx, 'Выбери тип:', ikb(rows));
  }
  askDate = async function(env, ctx, data){
    await setState(env, ctx.uid, 'task:date', data);
    var np = nowParts(ctx.user.tz);
    var extra = [btn('Сегодня','tw:date:'+np.dateStr), btn('Завтра','tw:date:'+addDaysStr(np.dateStr,1)), btn('Без даты','tw:date:none')];
    var cal = buildCalendar(np.y, np.mo, 'tw:cal', extra);
    cal.inline_keyboard.push([btn('⬅️ Назад','tw:back:type'), btn('🏠 В меню','nav:menu')]);
    await send(env, ctx.chatId, 'Дата:', cal);
  };
  askTime = async function(env, ctx, data){
    await setState(env, ctx.uid, 'task:time', data);
    var rows=[]; var r=[];
    for (var h=6;h<=23;h++){ r.push(btn((String(h).padStart(2,'0'))+':00', 'tw:time:'+h)); if(r.length===4){ rows.push(r); r=[]; } }
    if (r.length) rows.push(r);
    rows.push([btn('Без времени','tw:time:none')]);
    rows.push([btn('⬅️ Назад','tw:back:date'), btn('🏠 В меню','nav:menu')]);
    await send(env, ctx.chatId, 'Время:', ikb(rows));
  };
  askReminders = async function(env, ctx, data){
    var u = await dbOne(env,'eb1_users','telegram_user_id=eq.'+ctx.uid+'&select=default_reminders');
    var def = (u && u.default_reminders) ? u.default_reminders.split(',') : ['1d','at'];
    data.picks = data.picks ? data.picks : def;
    await setState(env, ctx.uid, 'task:rem', data);
    var hoursAway = null;
    if (data.due_date && data.due_date !== 'none'){ var arr = data.due_date.split('-').map(Number).concat([(data.due_hour==null?9:data.due_hour),0,ctx.user.tz]); var f = localToUtc.apply(null, arr); hoursAway=(f.getTime()-Date.now())/3600000; }
    var rk = reminderPicksKeyboard(data.picks, hoursAway, 'tw');
    rk.push([btn('⬅️ Назад','tw:back:time'), btn('🏠 В меню','nav:menu')]);
    await send(env, ctx.chatId, '🔔 Напоминания:', ikb(rk));
  };

  var _ht = handleText;
  handleText = async function(env, ctx, text){
    var low = (text?text:'').trim().toLowerCase();
    if (['меню','menu','отмена','cancel','стоп','назад'].indexOf(low) !== -1){ await clearState(env, ctx.uid); return showMenu(env, ctx); }
    return _ht(env, ctx, text);
  };
  var _mm = mainMenuKb;
  mainMenuKb = function(){ var kb=_mm(); kb.inline_keyboard.splice(3,0,[btn('✏️ Редактировать задачи','task:all')]); return kb; };

  async function taskAllList(env, ctx){
    var base = 'telegram_user_id=eq.'+ctx.uid+'&archived=eq.false&status=neq.done';
    var dated = await dbSelect(env,'eb1_tasks', base+'&due_date=not.is.null&select=id,title,due_date,due_hour&order=due_date.asc,due_hour.asc');
    var noDate = await dbSelect(env,'eb1_tasks', base+'&due_date=is.null&select=id,title&order=created_at.desc');
    var t = '✏️ <b>Все задачи</b>\nНажми на задачу, чтобы изменить время, дату или удалить.\n'; var kb=[];
    dated = dated?dated:[]; noDate = noDate?noDate:[];
    for (var i=0;i<dated.length;i++){ var x=dated[i]; var tm = x.due_hour!=null ? (String(x.due_hour).padStart(2,'0')+':00') : '—'; kb.push([btn((fmtShort(x.due_date)+' '+tm+' '+x.title).slice(0,60), 'task:open:'+x.id)]); }
    for (var j=0;j<noDate.length;j++){ var y=noDate[j]; kb.push([btn(('без срока — '+y.title).slice(0,60), 'task:open:'+y.id)]); }
    if (!kb.length) t += '\n<i>активных задач нет</i>';
    kb.push(navRow('nav:menu'));
    await screen(env, ctx, t, ikb(kb));
  }

  runCron = async function(env){
    var now = new Date();
    var due = await dbSelect(env,'eb1_reminders','sent=eq.false&fire_at=lte.'+now.toISOString()+'&select=*&limit=100'); due=due?due:[];
    for (var i=0;i<due.length;i++){ var r=due[i];
      try{ var kb = ikb([[btn('✅ Выполнено','task:done:'+r.ref_id), btn('⏰ Через час','rem:snooze:'+r.id)],[btn('📅 Перенести','task:move:'+r.ref_id), btn('🗑 Удалить','task:delyes:'+r.ref_id)]]);
        await send(env, r.telegram_user_id, '🔔 <b>Напоминание</b>\n'+esc(r.label), kb); await dbUpdate(env,'eb1_reminders','id=eq.'+r.id,{ sent:true }); }catch(e){ console.log('rem err', e.message); } }
    var home = ikb([[btn('🏠 Меню','nav:menu')]]);
    var users = await dbSelect(env,'eb1_users','select=*'); users=users?users:[];
    for (var w=0;w<users.length;w++){ var u=users[w];
      try{ var np = nowParts(u.tz);
        if (u.briefing_enabled){ var mt=(u.briefing_time?u.briefing_time:'07:00').split(':'); var tgt=(+mt[0])*60+(+mt[1]); if (np.minOfDay>=tgt && np.minOfDay<tgt+5 && u.last_briefing_date!==np.dateStr){ await send(env,u.telegram_user_id, await buildMorning(env,u.telegram_user_id,u.tz), home); await dbUpdate(env,'eb1_users','telegram_user_id=eq.'+u.telegram_user_id,{ last_briefing_date:np.dateStr }); } }
        if (u.evening_enabled){ var et=(u.evening_time?u.evening_time:'22:00').split(':'); var tgt2=(+et[0])*60+(+et[1]); if (np.minOfDay>=tgt2 && np.minOfDay<tgt2+5 && u.last_evening_date!==np.dateStr){ await send(env,u.telegram_user_id, await buildEvening(env,u.telegram_user_id,u.tz), home); await dbUpdate(env,'eb1_users','telegram_user_id=eq.'+u.telegram_user_id,{ last_evening_date:np.dateStr }); } }
        var nd = await dbSelect(env,'eb1_tasks','telegram_user_id=eq.'+u.telegram_user_id+'&archived=eq.false&status=neq.done&due_date=is.null&select=id,title,created_at,nudge3_sent,nudge7_sent'); nd=nd?nd:[];
        for (var k=0;k<nd.length;k++){ var x=nd[k]; var age=(Date.now()-new Date(x.created_at).getTime())/86400000;
          if (age>=7 && !x.nudge7_sent){ await send(env,u.telegram_user_id,'⏳ Задача «'+esc(x.title)+'» уже 7 дней без срока.\nУдалить или назначить срок?', ikb([[btn('📅 Назначить срок','task:redate:'+x.id), btn('🗑 Удалить','task:delyes:'+x.id)]])); await dbUpdate(env,'eb1_tasks','id=eq.'+x.id,{ nudge7_sent:true }); }
          else if (age>=3 && !x.nudge3_sent){ await send(env,u.telegram_user_id,'⏳ Задача «'+esc(x.title)+'» уже 3 дня без срока.\nНазначить срок?', ikb([[btn('📅 Назначить срок','task:redate:'+x.id)]])); await dbUpdate(env,'eb1_tasks','id=eq.'+x.id,{ nudge3_sent:true }); }
        }
      }catch(e){ console.log('user cron err', u.telegram_user_id, e.message); } }
  };

  var _hc = handleCallback;
  handleCallback = async function(env, ctx, data){
    if (data === 'task:all') return taskAllList(env, ctx);
    if (data === 'tw:changetype') return showTypeList(env, ctx);
    if (data === 'tw:back:title'){ await setState(env,ctx.uid,'task:title',{}); return screen(env, ctx, '➕ Новая задача\nВведи название:', ikb([navRow('nav:menu')])); }
    if (data === 'tw:back:type'){ var s2=await getState(env,ctx.uid); return askType(env, ctx, s2.data?s2.data:{}, false); }
    if (data === 'tw:back:date'){ var s3=await getState(env,ctx.uid); return askDate(env, ctx, s3.data?s3.data:{}); }
    if (data === 'tw:back:time'){ var s4=await getState(env,ctx.uid); return askTime(env, ctx, s4.data?s4.data:{}); }
    return _hc(env, ctx, data);
  };
})();
