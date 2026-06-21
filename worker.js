/* ЭЛЕКТРИЧЕСКИЙ МОЗГ — Telegram-бот (Cloudflare Worker)
   Стек: Telegram Bot API + Supabase (REST) + Cloudflare Workers (cron). Без ИИ.
   ENV: TELEGRAM_BOT_TOKEN, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, WEBHOOK_SECRET, DEFAULT_TIMEZONE */

const IMP = {
  green:  { label: '🟢 Низкая',      rank: 0 },
  yellow: { label: '🟡 Средняя',     rank: 1 },
  orange: { label: '🟠 Высокая',     rank: 2 },
  red:    { label: '🔴 Критическая', rank: 3 },
};
const STATUS = { todo:'🔴 Не начато', doing:'🟡 В процессе', paused:'⏸ Отложено', done:'✅ Выполнено' };
const LEVELS = [
  { min:0,name:'Новичок' },{ min:100,name:'Собирающийся с мыслями' },{ min:300,name:'Организованный' },
  { min:700,name:'Системный' },{ min:1500,name:'Дисциплинированный' },{ min:3000,name:'Машина продуктивности' },{ min:6000,name:'Легенда' },
];
const HABIT_LEVELS = [
  { min:0,name:'Новичок' },{ min:3,name:'Любитель' },{ min:7,name:'Постоянный' },
  { min:21,name:'Эксперт' },{ min:50,name:'Мастер' },{ min:100,name:'Легенда' },
];
const RESPECT = { task:10, task_important:20, habit:5, streak7:50, streak30:250, goal_closed:100, weekly_viewed:5, all_done:20 };
const ACH = {
  task_first:'🥇 Первая задача выполнена', task_10:'🔟 10 задач выполнено', task_100:'💯 100 задач выполнено',
  habit_first:'🌱 Первая привычка создана', habit_7:'🔥 7 дней привычки', habit_30:'🏆 30 дней привычки',
  goal_first:'🎯 Первая цель закрыта', week_clean:'🧹 Неделя без просрочек',
  all_done:'🎉 Все задачи дня выполнены', weekly_first:'📊 Первый недельный разбор',
};
const DEFAULT_CATEGORIES = [
  { name:'Еда', emoji:'🍔', kind:'expense', kw:['еда','кафе','бургер','мак','ресторан','доставка','обед','ужин','завтрак','продукты','пятёрочка','магнит'] },
  { name:'Транспорт', emoji:'🚕', kind:'expense', kw:['автобус','метро','такси','бензин','заправка','яндекс такси','проезд','транспорт'] },
  { name:'Развлечения', emoji:'🎮', kind:'expense', kw:['кино','игра','развлечения','бар','клуб','концерт'] },
  { name:'Подписки', emoji:'📱', kind:'expense', kw:['кинопоиск','spotify','netflix','chatgpt','подписка','youtube'] },
  { name:'Одежда', emoji:'👕', kind:'expense', kw:['одежда','обувь','куртка','джинсы','футболка'] },
  { name:'Учёба', emoji:'📚', kind:'expense', kw:['учёба','книга','курс','учебник','репетитор'] },
  { name:'Дом', emoji:'🏠', kind:'expense', kw:['дом','квартира','коммуналка','мебель','ремонт'] },
  { name:'Здоровье', emoji:'💊', kind:'expense', kw:['аптека','лекарства','врач','здоровье','анализы'] },
  { name:'Подарки', emoji:'🎁', kind:'expense', kw:['подарок','подарки','цветы'] },
  { name:'Зарплата', emoji:'💰', kind:'income', kw:['зарплата','зп','аванс'] },
  { name:'Подработка', emoji:'💼', kind:'income', kw:['подработка','фриланс','халтура'] },
];
const DEFAULT_TASK_TEMPLATES = ['Тренировка','Учёба','Уборка','Покупки','Лекарства','Оплатить','Позвонить','Сдать домашку','Подготовиться к экзамену'];
const DEFAULT_HABIT_TEMPLATES = [
  { title:'Пить воду', type:'number', emoji:'💧' },{ title:'Читать', type:'yesno', emoji:'📖' },
  { title:'Тренировка', type:'yesno', emoji:'🏃' },{ title:'Чистить зубы вечером', type:'yesno', emoji:'🦷' },
  { title:'Английский', type:'yesno', emoji:'🇬🇧' },{ title:'Ложиться вовремя', type:'time', emoji:'😴' },
  { title:'Контроль веса', type:'number', emoji:'⚖️' },{ title:'Растяжка', type:'yesno', emoji:'🧘' },
];
const DEFAULT_PAYMENT_TEMPLATES = [
  { title:'Квартира', emoji:'🏠' },{ title:'Интернет', emoji:'📶' },{ title:'Связь', emoji:'📱' },
  { title:'Кредитка', emoji:'💳' },{ title:'Кредит', emoji:'🏦' },{ title:'Кинопоиск', emoji:'🎬' },{ title:'Spotify', emoji:'🎵' },
];
const DEFAULT_REWARDS = [
  { title:'🍕 Заказать пиццу', cost:1000 },{ title:'🎮 Купить игру', cost:5000 },{ title:'🛌 Выходной без дел', cost:700 },
];
const MOTIVATION = [
  'Полковник Сандерс запустил KFC после 60 лет, получив сотни отказов до первого «да».',
  'Джоан Роулинг собрала пачку отказов от издательств, прежде чем «Гарри Поттер» стал мировым явлением.',
  'Маленькое действие каждый день сильнее редкого рывка раз в месяц.',
  'Олег Тиньков начинал с мелкой торговли и десятков провалов до большого бизнеса.',
  'Дисциплина — это мост между целями и результатом.',
  'Джеймс Дайсон сделал 5126 неудачных прототипов пылесоса, и только 5127-й заработал.',
  'Уолт Дисней слышал, что ему «не хватает воображения», задолго до своей империи.',
  'Ты не обязан быть великим, чтобы начать, но надо начать, чтобы стать великим.',
  'Стивен Кинг выбрасывал «Кэрри» в мусор — рукопись достала из ведра жена.',
  'Лучшее время посадить дерево было 20 лет назад. Второе лучшее — сегодня.',
  'Томас Эдисон не «провалился» — он нашёл тысячи способов, которые не работают.',
  'Привычка сильнее мотивации: мотивация уходит, привычка остаётся.',
  'Каждый эксперт когда-то был новичком, который не сдался.',
  'Генри Форд банкротился дважды до того, как изменил мир.',
  'Сегодняшнее «неудобно» — это завтрашнее «легко».',
  'Не считай дни без срывов — строй систему, в которой срывы не страшны.',
  'Прогресс важнее совершенства. Сделай чуть-чуть — но сегодня.',
  'Говард Шульц вырос в бедном квартале и построил Starbucks из идеи, в которую мало кто верил.',
  'Сила не в том, чтобы не падать, а в том, чтобы вставать на день раньше срыва.',
  'Дело не в том, как ты начал, а в том, что ты не остановился.',
  'Маленькие проценты ежедневно складываются в гигантский рост за год.',
  'Завтра ты скажешь спасибо за то, что не сдался сегодня.',
];

// ── Supabase ──
async function sb(env, method, path, { body, prefer } = {}) {
  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type':'application/json', ...(prefer?{Prefer:prefer}:{}) },
    body: body ? JSON.stringify(body) : undefined,
  });
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
  const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`, {
    method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) });
  return res.json();
}
const send = (env,chatId,text,kb) => tg(env,'sendMessage',{ chat_id:chatId, text, parse_mode:'HTML', disable_web_page_preview:true, ...(kb?{reply_markup:kb}:{}) });
const edit = (env,chatId,msgId,text,kb) => tg(env,'editMessageText',{ chat_id:chatId, message_id:msgId, text, parse_mode:'HTML', disable_web_page_preview:true, ...(kb?{reply_markup:kb}:{}) });
const answer = (env,cbId,text) => tg(env,'answerCallbackQuery',{ callback_query_id:cbId, ...(text?{text}:{}) });
const sendPhoto = (env,chatId,url,caption,kb) => tg(env,'sendPhoto',{ chat_id:chatId, photo:url, caption:caption||'', parse_mode:'HTML', ...(kb?{reply_markup:kb}:{}) });
async function screen(env, ctx, text, kb){
  if (ctx.msgId){ const r=await edit(env,ctx.chatId,ctx.msgId,text,kb); if(r&&r.ok===false) await send(env,ctx.chatId,text,kb); }
  else await send(env,ctx.chatId,text,kb);
}

// ── Клавиатуры / утилиты ──
const btn = (text,data) => ({ text, callback_data:data });
const ikb = (rows) => ({ inline_keyboard:rows });
const navRow = (backData) => [btn('⬅️ Назад', backData||'nav:menu'), btn('🏠 В меню','nav:menu')];
function esc(s){ return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
const money = (n) => `${Math.round(Number(n)).toLocaleString('ru-RU')} ₽`;
function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

// ── Время / таймзона ──
function tzOffsetMs(date, tz){
  const dtf = new Intl.DateTimeFormat('en-US',{ timeZone:tz, hour12:false, year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit' });
  const p = dtf.formatToParts(date).reduce((a,x)=>(a[x.type]=x.value,a),{});
  return Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute,+p.second) - date.getTime();
}
function localToUtc(y,mo,d,h,mi,tz){
  const guess = Date.UTC(y,mo-1,d,h,mi,0);
  return new Date(guess - tzOffsetMs(new Date(guess),tz));
}
function nowParts(tz){
  const p = new Intl.DateTimeFormat('en-CA',{ timeZone:tz, hour12:false, year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',weekday:'short' })
    .formatToParts(new Date()).reduce((a,x)=>(a[x.type]=x.value,a),{});
  const dowMap = { Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6 };
  return { y:+p.year, mo:+p.month, d:+p.day, h:+p.hour, mi:+p.minute, dow:dowMap[p.weekday],
    dateStr:`${p.year}-${p.month}-${p.day}`, hhmm:`${p.hour}:${p.minute}`, minOfDay:+p.hour*60+ +p.minute };
}
const RU_MONTHS = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
function fmtDate(ds){ if(!ds) return 'без даты'; const [y,m,d]=ds.split('-').map(Number); return `${d} ${RU_MONTHS[m-1]}`; }
function addDaysStr(ds,n){ const [y,m,d]=ds.split('-').map(Number); return new Date(Date.UTC(y,m-1,d+n)).toISOString().slice(0,10); }
function buildCalendar(y,mo,prefix,extraRow){
  const first = new Date(Date.UTC(y,mo-1,1));
  const startDow = (first.getUTCDay()+6)%7;
  const days = new Date(Date.UTC(y,mo,0)).getUTCDate();
  const rows = [];
  rows.push([btn('◀',`${prefix}:nav:${y}:${mo}:-1`), btn(`${RU_MONTHS[mo-1]} ${y}`,'noop'), btn('▶',`${prefix}:nav:${y}:${mo}:1`)]);
  rows.push(['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(w=>btn(w,'noop')));
  let week=[]; for(let i=0;i<startDow;i++) week.push(btn(' ','noop'));
  for(let d=1;d<=days;d++){ const ds=`${y}-${String(mo).padStart(2,'0')}-${String(d).padStart(2,'0')}`; week.push(btn(String(d),`${prefix}:pick:${ds}`)); if(week.length===7){rows.push(week);week=[];} }
  if(week.length){ while(week.length<7) week.push(btn(' ','noop')); rows.push(week); }
  if(extraRow) rows.push(extraRow);
  return ikb(rows);
}

// ── State ──
async function getState(env,uid){ const r=await dbOne(env,'eb1_states',`telegram_user_id=eq.${uid}`); return r||{ telegram_user_id:uid, state:null, data:{} }; }
async function setState(env,uid,state,data={}){ await sb(env,'POST','eb1_states',{ body:[{ telegram_user_id:uid, state, data, updated_at:new Date().toISOString() }], prefer:'resolution=merge-duplicates' }); }
async function clearState(env,uid){ await dbUpdate(env,'eb1_states',`telegram_user_id=eq.${uid}`,{ state:null, data:{} }); }

// ── Пользователь / сид ──
async function ensureUser(env, from){
  let u = await dbOne(env,'eb1_users',`telegram_user_id=eq.${from.id}`);
  if(!u) u = await dbInsertOne(env,'eb1_users',{ telegram_user_id:from.id, username:from.username||'', first_name:from.first_name||'', tz:env.DEFAULT_TIMEZONE||'Europe/Moscow' });
  if(u && !u.seeded) await seedDefaults(env,u.telegram_user_id);
  return u;
}
async function seedDefaults(env,uid){
  for(const c of DEFAULT_CATEGORIES){
    const cat = await dbInsertOne(env,'eb1_finance_categories',{ telegram_user_id:uid, name:c.name, emoji:c.emoji, kind:c.kind });
    if(cat && c.kw?.length) await dbInsert(env,'eb1_finance_category_keywords', c.kw.map(k=>({ telegram_user_id:uid, category_id:cat.id, keyword:k })));
  }
  await dbInsert(env,'eb1_task_templates', DEFAULT_TASK_TEMPLATES.map(t=>({ telegram_user_id:uid, title:t })));
  await dbInsert(env,'eb1_habit_templates', DEFAULT_HABIT_TEMPLATES.map(h=>({ telegram_user_id:uid, ...h })));
  await dbInsert(env,'eb1_payment_templates', DEFAULT_PAYMENT_TEMPLATES.map(p=>({ telegram_user_id:uid, ...p })));
  await dbInsert(env,'eb1_rewards', DEFAULT_REWARDS.map(r=>({ telegram_user_id:uid, ...r })));
  await dbUpdate(env,'eb1_users',`telegram_user_id=eq.${uid}`,{ seeded:true });
}

// ── Респекты / уровни / ачивки / лог ──
function levelName(r){ let n=LEVELS[0].name; for(const l of LEVELS) if(r>=l.min) n=l.name; return n; }
async function addRespect(env,uid,amount,reason){
  if(!amount) return;
  await dbInsert(env,'eb1_respect_events',{ telegram_user_id:uid, amount, reason });
  const u = await dbOne(env,'eb1_users',`telegram_user_id=eq.${uid}&select=respects`);
  await dbUpdate(env,'eb1_users',`telegram_user_id=eq.${uid}`,{ respects:(u?.respects||0)+amount });
}
async function logAct(env,uid,action,detail=''){ await dbInsert(env,'eb1_activity_log',{ telegram_user_id:uid, action, detail }); }
async function unlock(env,uid,code){ try{ await dbInsert(env,'eb1_achievements',{ telegram_user_id:uid, code }); return ACH[code]||code; }catch{ return null; } }
async function checkTaskAchievements(env,uid,chatId){
  const done = await dbSelect(env,'eb1_tasks',`telegram_user_id=eq.${uid}&status=eq.done&select=id`);
  const n = done?.length||0; const hits=[];
  if(n>=1) hits.push(await unlock(env,uid,'task_first'));
  if(n>=10) hits.push(await unlock(env,uid,'task_10'));
  if(n>=100) hits.push(await unlock(env,uid,'task_100'));
  for(const h of hits.filter(Boolean)) await send(env,chatId,`🏅 Достижение: <b>${h}</b>`);
}

// ── Финансы: парсинг / расчёты / графики ──
async function categorize(env,uid,words){
  const kws = await dbSelect(env,'eb1_finance_category_keywords',`telegram_user_id=eq.${uid}&select=category_id,keyword`);
  const text = words.join(' ').toLowerCase();
  for(const k of (kws||[])) if(text.includes(k.keyword.toLowerCase())) return k.category_id;
  return null;
}
async function parseQuickFinance(env,uid,raw){
  const t = raw.trim();
  const m = t.match(/^([+-]?)(\d+(?:[.,]\d+)?)\s*(.*)$/);
  if(!m) return null;
  const sign=m[1]; const amount=parseFloat(m[2].replace(',','.'));
  if(!isFinite(amount)||amount<=0) return null;
  const rest=(m[3]||'').trim(); const words=rest?rest.split(/\s+/):[];
  const type = sign==='+'?'income':(sign==='-'?'expense':null);
  let categoryId=null, description='';
  if(words.length){ categoryId=await categorize(env,uid,words); description=rest; }
  return { amount, type, categoryId, description, hasWords:words.length>0 };
}
async function computeBalance(env,uid){
  const u = await dbOne(env,'eb1_users',`telegram_user_id=eq.${uid}&select=start_balance`);
  const txs = await dbSelect(env,'eb1_finance_transactions',`telegram_user_id=eq.${uid}&select=amount,type`);
  const adj = await dbSelect(env,'eb1_balance_adjustments',`telegram_user_id=eq.${uid}&select=amount`);
  let bal = Number(u?.start_balance||0);
  for(const x of (txs||[])) bal += x.type==='income'?Number(x.amount):-Number(x.amount);
  for(const a of (adj||[])) bal += Number(a.amount);
  return bal;
}
async function sumTx(env,uid,type,fromDate,toDate){
  let q=`telegram_user_id=eq.${uid}&type=eq.${type}&select=amount,category_id,tx_date`;
  if(fromDate) q+=`&tx_date=gte.${fromDate}`; if(toDate) q+=`&tx_date=lte.${toDate}`;
  return (await dbSelect(env,'eb1_finance_transactions',q))||[];
}
function chartUrl(config,w=640,h=420){ return `https://quickchart.io/chart?w=${w}&h=${h}&bkg=white&c=${encodeURIComponent(JSON.stringify(config))}`; }
function pieChart(title,labels,values){ return chartUrl({ type:'doughnut', data:{ labels, datasets:[{ data:values }] }, options:{ plugins:{ title:{ display:true, text:title } } } }); }
function lineChart(title,labels,values,label){ return chartUrl({ type:'line', data:{ labels, datasets:[{ label:label||title, data:values, fill:false, tension:0.3 }] }, options:{ plugins:{ title:{ display:true, text:title } } } }); }

// ── Напоминания ──
const OFFSETS = { '1w':7*24*60, '3d':3*24*60, '1d':24*60, '12h':12*60, '3h':3*60, '1h':60, 'at':0 };
async function scheduleEventReminders(env,uid,kind,refId,label,fireBaseUtc,picks){
  const rows=[];
  for(const key of picks){ const off=OFFSETS[key]; if(off==null) continue;
    const at=new Date(fireBaseUtc.getTime()-off*60000); if(at.getTime()<=Date.now()) continue;
    rows.push({ telegram_user_id:uid, kind, ref_id:refId, fire_at:at.toISOString(), label }); }
  if(rows.length) await dbInsert(env,'eb1_reminders',rows);
}
function reminderPicksKeyboard(picks,hoursAway,prefix){
  const opts=[['1w','За неделю',7*24],['3d','За 3 дня',3*24],['1d','За сутки',24],['12h','За 12 часов',12],['3h','За 3 часа',3],['1h','За час',1],['at','В момент события',0]];
  const rows=[];
  for(const [key,lbl,minH] of opts){ if(hoursAway!=null && hoursAway<=minH && key!=='at') continue; const on=picks.includes(key); rows.push([btn(`${on?'☑':'☐'} ${lbl}`,`${prefix}:rt:${key}`)]); }
  rows.push([btn('✅ Готово',`${prefix}:rdone`)]); return rows;
}
function nextRepeatDate(ds,repeat){
  const [y,m,d]=ds.split('-').map(Number); let dt=new Date(Date.UTC(y,m-1,d));
  if(repeat==='daily') dt.setUTCDate(dt.getUTCDate()+1);
  else if(repeat==='weekly') dt.setUTCDate(dt.getUTCDate()+7);
  else if(repeat==='monthly') dt.setUTCMonth(dt.getUTCMonth()+1);
  else if(repeat==='yearly') dt.setUTCFullYear(dt.getUTCFullYear()+1);
  else return null;
  return dt.toISOString().slice(0,10);
}

// ═══ ГЛАВНОЕ МЕНЮ ═══
async function buildToday(env,uid,tz){
  const np=nowParts(tz); const today=np.dateStr;
  const tasks = await dbSelect(env,'eb1_tasks',`telegram_user_id=eq.${uid}&status=neq.done&archived=eq.false&or=(due_date.eq.${today},due_date.is.null)&select=title,stage,importance,due_date&order=due_date.asc`);
  const goals = await dbSelect(env,'eb1_goals',`telegram_user_id=eq.${uid}&status=eq.active&select=title,stage&limit=3`);
  const habits = await dbSelect(env,'eb1_habits',`telegram_user_id=eq.${uid}&select=id,title`);
  const spent = (await sumTx(env,uid,'expense',today,today)).reduce((s,x)=>s+Number(x.amount),0);
  const bal = await computeBalance(env,uid);
  const u = await dbOne(env,'eb1_users',`telegram_user_id=eq.${uid}&select=respects`);
  const respects = u?.respects||0;
  let t='📍 <b>Сегодня</b>\n\n✅ <b>Задачи:</b>\n';
  if(tasks?.length){ const sorted=[...tasks].sort((a,b)=>(IMP[b.importance]?.rank||0)-(IMP[a.importance]?.rank||0));
    for(const x of sorted.slice(0,8)) t+=`• ${x.importance==='red'?'🔴 ':''}${esc(x.title)}${x.stage?` — <i>${esc(x.stage)}</i>`:''}\n`; }
  else t+='<i>нет активных задач</i>\n';
  t+='\n🎯 <b>Цели:</b>\n';
  if(goals?.length) for(const g of goals) t+=`• ${esc(g.title)}${g.stage?`\n   Стадия: ${esc(g.stage)}`:''}\n`; else t+='<i>нет активных целей</i>\n';
  t+='\n🔥 <b>Привычки:</b>\n';
  if(habits?.length) for(const h of habits.slice(0,6)) t+=`• ${esc(h.title)}\n`; else t+='<i>нет привычек</i>\n';
  t+=`\n💰 <b>Финансы:</b>\nСегодня: -${money(spent)}\nБаланс: ${money(bal)}\n`;
  t+=`\n🏆 Респекты: ${respects}\nУровень: ${levelName(respects)}`;
  const rows=[ [btn('✅ Задачи','task:menu'), btn('🎯 Цели','goal:menu')], [btn('💰 Финансы','fin:menu'), btn('🏆 Профиль','prof:menu')], [btn('⚙️ Настройки','set:menu')] ];
  const todays = await dbSelect(env,'eb1_tasks',`telegram_user_id=eq.${uid}&due_date=eq.${today}&archived=eq.false&select=status`);
  if(todays?.length && todays.every(x=>x.status==='done')) rows.unshift([btn('🎉 Я всё сделал','task:alldone')]);
  return { text:t, kb:ikb(rows) };
}
async function showMenu(env,ctx,u){ const { text,kb }=await buildToday(env,ctx.uid,u.tz); await screen(env,ctx,text,kb); }

// ═══ ЗАДАЧИ ═══
function taskMenuKb(){ return ikb([ [btn('➕ Новая задача','task:new')], [btn('📍 Сегодня','task:list:today'), btn('⚠️ Просрочено','task:overdue')], [btn('📋 Все','task:list:all'), btn('📅 Календарь','task:cal:today')], [btn('📦 Архив','task:archive'), btn('🧩 Шаблоны','task:tpl')], navRow('nav:menu') ]); }
async function taskMenu(env,ctx){ await screen(env,ctx,'✅ <b>Задачи</b>\nВыбери действие:', taskMenuKb()); }
async function taskList(env,ctx,scope){
  const today=nowParts(ctx.user.tz).dateStr;
  let q=`telegram_user_id=eq.${ctx.uid}&archived=eq.false&status=neq.done&select=id,title,stage,importance,due_date,due_hour&order=importance.desc`;
  if(scope==='today') q+=`&or=(due_date.eq.${today},due_date.is.null)`;
  const rows=await dbSelect(env,'eb1_tasks',q);
  let t=scope==='today'?'📍 <b>Задачи на сегодня</b>\n\n':'📋 <b>Все активные задачи</b>\n\n'; const kb=[];
  if(!rows?.length) t+='<i>пусто</i>';
  else for(const x of rows.slice(0,30)){ const star=x.importance==='red'?'🔴':(IMP[x.importance]?.label.split(' ')[0]||''); const when=x.due_date?` · ${fmtDate(x.due_date)}${x.due_hour!=null?` ${String(x.due_hour).padStart(2,'0')}:00`:''}`:''; kb.push([btn(`${star} ${x.title}${when}`.slice(0,60),`task:open:${x.id}`)]); }
  kb.push(navRow('task:menu')); await screen(env,ctx,t,ikb(kb));
}
async function taskOpen(env,ctx,id){
  const x=await dbOne(env,'eb1_tasks',`telegram_user_id=eq.${ctx.uid}&id=eq.${id}`); if(!x) return taskMenu(env,ctx);
  let t=`✅ <b>${esc(x.title)}</b>\n\nСтадия: ${esc(x.stage)||'—'}\nСтатус: ${STATUS[x.status]}\nВажность: ${IMP[x.importance]?.label}\n`;
  t+=`Дата: ${x.due_date?fmtDate(x.due_date):'без даты'}${x.due_hour!=null?`, ${String(x.due_hour).padStart(2,'0')}:00`:''}\n`;
  if(x.repeat!=='none') t+=`Повтор: ${x.repeat}\n`; if(x.note) t+=`\n📝 Заметка: ${esc(x.note)}\n`;
  await screen(env,ctx,t,ikb([ [btn('✅ Выполнено',`task:done:${id}`), btn('🔄 Стадия',`task:stage:${id}`)], [btn('🚦 Статус',`task:status:${id}`), btn('🚩 Важность',`task:imp:${id}`)], [btn('📝 Заметка',`task:note:${id}`), btn('📅 Перенести',`task:move:${id}`)], [btn('📜 История стадий',`task:hist:${id}`)], [btn('🗑 Удалить',`task:del:${id}`)], navRow('task:menu') ]));
}
async function taskDone(env,ctx,id){
  const x=await dbOne(env,'eb1_tasks',`telegram_user_id=eq.${ctx.uid}&id=eq.${id}`); if(!x||x.status==='done') return taskMenu(env,ctx);
  await dbUpdate(env,'eb1_tasks',`id=eq.${id}`,{ status:'done', archived:true, done_at:new Date().toISOString() });
  await dbDelete(env,'eb1_reminders',`kind=eq.task&ref_id=eq.${id}&sent=eq.false`);
  const r=(x.importance==='red'||x.importance==='orange')?RESPECT.task_important:RESPECT.task;
  await addRespect(env,ctx.uid,r,'Задача выполнена'); await logAct(env,ctx.uid,'task_done',x.title);
  if(x.repeat && x.repeat!=='none' && x.due_date){ const next=nextRepeatDate(x.due_date,x.repeat); if(next) await dbInsert(env,'eb1_tasks',{ telegram_user_id:ctx.uid, title:x.title, stage:x.stage, note:x.note, due_date:next, due_hour:x.due_hour, importance:x.importance, repeat:x.repeat, repeat_custom:x.repeat_custom }); }
  await answer(env,ctx.cbId,`+${r} респектов`); await checkTaskAchievements(env,ctx.uid,ctx.chatId); await taskMenu(env,ctx);
}
async function taskOverdue(env,ctx){
  const np=nowParts(ctx.user.tz);
  const rows=await dbSelect(env,'eb1_tasks',`telegram_user_id=eq.${ctx.uid}&archived=eq.false&status=neq.done&due_date=not.is.null&due_date=lt.${np.dateStr}&select=id,title,due_date&order=due_date.asc`);
  let t='⚠️ <b>Просроченные задачи</b>\n\n'; const kb=[];
  if(!rows?.length) t+='<i>нет просрочек 🎉</i>'; else for(const x of rows) kb.push([btn(`${x.title} · ${fmtDate(x.due_date)}`.slice(0,60),`task:open:${x.id}`)]);
  kb.push(navRow('task:menu')); await screen(env,ctx,t,ikb(kb));
}
async function taskArchive(env,ctx){
  const rows=await dbSelect(env,'eb1_tasks',`telegram_user_id=eq.${ctx.uid}&status=eq.done&select=title,done_at&order=done_at.desc&limit=30`);
  let t='📦 <b>Архив выполненных</b>\n\n'; if(!rows?.length) t+='<i>пусто</i>'; else for(const x of rows) t+=`✅ ${esc(x.title)}\n`;
  await screen(env,ctx,t,ikb([navRow('task:menu')]));
}
async function taskCalendar(env,ctx,scope){
  const np=nowParts(ctx.user.tz); let from,to,title;
  if(scope==='today'){from=to=np.dateStr;title='Сегодня';} else if(scope==='tomorrow'){from=to=addDaysStr(np.dateStr,1);title='Завтра';}
  else if(scope==='week'){from=np.dateStr;to=addDaysStr(np.dateStr,7);title='Неделя';} else {from=np.dateStr;to=addDaysStr(np.dateStr,30);title='Месяц';}
  const tasks=await dbSelect(env,'eb1_tasks',`telegram_user_id=eq.${ctx.uid}&archived=eq.false&due_date=not.is.null&due_date=gte.${from}&due_date=lte.${to}&select=title,due_date,importance,due_hour&order=due_date.asc`);
  const pays=await dbSelect(env,'eb1_payments',`telegram_user_id=eq.${ctx.uid}&archived=eq.false&next_date=not.is.null&next_date=gte.${from}&next_date=lte.${to}&select=title,amount,next_date&order=next_date.asc`);
  let t=`📅 <b>Календарь — ${title}</b>\n\n`; const byDay={};
  for(const x of (tasks||[])) (byDay[x.due_date]=byDay[x.due_date]||[]).push(`✅ ${esc(x.title)}${x.due_hour!=null?` ${String(x.due_hour).padStart(2,'0')}:00`:''}`);
  for(const p of (pays||[])) (byDay[p.next_date]=byDay[p.next_date]||[]).push(`💳 ${esc(p.title)} ${money(p.amount)}`);
  const days=Object.keys(byDay).sort(); if(!days.length) t+='<i>ничего не запланировано</i>'; else for(const d of days) t+=`<b>${fmtDate(d)}</b>\n${byDay[d].join('\n')}\n\n`;
  await screen(env,ctx,t,ikb([ [btn('Сегодня','task:cal:today'), btn('Завтра','task:cal:tomorrow')], [btn('Неделя','task:cal:week'), btn('Месяц','task:cal:month')], navRow('task:menu') ]));
}
async function taskTemplates(env,ctx){
  const rows=await dbSelect(env,'eb1_task_templates',`telegram_user_id=eq.${ctx.uid}&select=id,title&order=id.asc`);
  const kb=(rows||[]).map(r=>[btn(`➕ ${r.title}`,`task:tplnew:${r.id}`), btn('🗑',`task:tpldel:${r.id}`)]); kb.push(navRow('task:menu'));
  await screen(env,ctx,'🧩 <b>Шаблоны задач</b>\nНажми, чтобы создать по шаблону. 🗑 — удалить шаблон.', ikb(kb));
}
// мастер задачи
async function taskWizardStart(env,ctx,presetTitle){
  if(presetTitle){ await setState(env,ctx.uid,'task:stage',{ title:presetTitle }); return send(env,ctx.chatId,`Задача: <b>${esc(presetTitle)}</b>\nВведи <b>стадию</b> (или «Пропустить»):`, ikb([[btn('Пропустить','tw:stageskip')]])); }
  await setState(env,ctx.uid,'task:title',{}); await screen(env,ctx,'➕ <b>Новая задача</b>\nВведи <b>название</b>:', ikb([navRow('task:menu')]));
}
async function taskWizardText(env,ctx,state,data,text){
  if(state==='task:title'){ data.title=text.trim(); await setState(env,ctx.uid,'task:stage',data); return send(env,ctx.chatId,'Введи <b>стадию</b> (или «Пропустить»):', ikb([[btn('Пропустить','tw:stageskip')]])); }
  if(state==='task:stage'){ data.stage=text.trim(); return askTaskDate(env,ctx,data); }
  if(state==='task:note'){ data.note=text.trim(); return finalizeTask(env,ctx,data); }
}
async function askTaskDate(env,ctx,data){ await setState(env,ctx.uid,'task:date',data); const np=nowParts(ctx.user.tz); await send(env,ctx.chatId,'Выбери <b>дату</b>:', buildCalendar(np.y,np.mo,'tw:cal',[btn('Сегодня','tw:date:'+np.dateStr), btn('Завтра','tw:date:'+addDaysStr(np.dateStr,1)), btn('Без даты','tw:date:none')])); }
async function askTaskTime(env,ctx,data){ await setState(env,ctx.uid,'task:time',data); const rows=[]; let r=[]; for(let h=8;h<=23;h++){ r.push(btn(`${String(h).padStart(2,'0')}:00`,`tw:time:${h}`)); if(r.length===4){rows.push(r);r=[];} } if(r.length) rows.push(r); rows.push([btn('Без времени','tw:time:none')]); await send(env,ctx.chatId,'Выбери <b>время</b> (до часа):', ikb(rows)); }
async function askTaskImportance(env,ctx,data){ await setState(env,ctx.uid,'task:imp',data); await send(env,ctx.chatId,'Выбери <b>важность</b>:', ikb([ [btn(IMP.green.label,'tw:imp:green'), btn(IMP.yellow.label,'tw:imp:yellow')], [btn(IMP.orange.label,'tw:imp:orange'), btn(IMP.red.label,'tw:imp:red')] ])); }
async function askTaskRepeat(env,ctx,data){ await setState(env,ctx.uid,'task:repeat',data); await send(env,ctx.chatId,'Повторять задачу?', ikb([ [btn('Не повторять','tw:rep:none'), btn('Каждый день','tw:rep:daily')], [btn('Каждую неделю','tw:rep:weekly'), btn('Каждый месяц','tw:rep:monthly')], [btn('Каждый год','tw:rep:yearly')] ])); }
async function askTaskReminders(env,ctx,data){
  data.picks=data.picks||['at']; await setState(env,ctx.uid,'task:rem',data);
  let hoursAway=null; if(data.due_date&&data.due_date!=='none'){ const fire=localToUtc(...data.due_date.split('-').map(Number),(data.due_hour??9),0,ctx.user.tz); hoursAway=(fire.getTime()-Date.now())/3600000; }
  await send(env,ctx.chatId,'🔔 Выбери <b>напоминания</b> (можно несколько):', ikb(reminderPicksKeyboard(data.picks,hoursAway,'tw')));
}
async function finalizeTask(env,ctx,data){
  const row={ telegram_user_id:ctx.uid, title:data.title||'Без названия', stage:data.stage||'', note:data.note||'', importance:data.importance||'yellow', repeat:data.repeat||'none', due_date:(data.due_date&&data.due_date!=='none')?data.due_date:null, due_hour:(data.due_hour===0||data.due_hour)?data.due_hour:null };
  const task=await dbInsertOne(env,'eb1_tasks',row);
  if(row.due_date){ const fire=localToUtc(...row.due_date.split('-').map(Number),(row.due_hour??9),0,ctx.user.tz); await scheduleEventReminders(env,ctx.uid,'task',task.id,`Задача: ${row.title}`,fire,data.picks||['at']); }
  await logAct(env,ctx.uid,'task_create',row.title); await clearState(env,ctx.uid);
  await send(env,ctx.chatId,`✅ Задача сохранена: <b>${esc(row.title)}</b>`, ikb([[btn('Открыть',`task:open:${task.id}`)],[btn('🏠 В меню','nav:menu')]]));
}

// ═══ ФИНАНСЫ ═══
function finMenuKb(){ return ikb([ [btn('➖ Расход','fin:add:expense'), btn('➕ Доход','fin:add:income')], [btn('📋 Операции','fin:ops:today'), btn('📊 Аналитика','fin:an')], [btn('💼 Баланс','fin:bal'), btn('🎯 Лимиты','fin:lim')], [btn('💳 Платежи и подписки','fin:pay'), btn('🐷 Сбережения','fin:save')], [btn('🗂 Категории','fin:cat'), btn('📈 Графики','fin:charts')], navRow('nav:menu') ]); }
async function finMenu(env,ctx){ const bal=await computeBalance(env,ctx.uid); const today=nowParts(ctx.user.tz).dateStr; const spent=(await sumTx(env,ctx.uid,'expense',today,today)).reduce((s,x)=>s+Number(x.amount),0); await screen(env,ctx,`💰 <b>Финансы</b>\nБаланс: <b>${money(bal)}</b>\nСегодня потрачено: ${money(spent)}\n\nБыстрый ввод: «550 еда» или «+3000 подработка».`, finMenuKb()); }
async function finAddStart(env,ctx,type){ await setState(env,ctx.uid,'fin:amount',{ type }); await screen(env,ctx,`${type==='income'?'➕ Доход':'➖ Расход'}\nВведи сумму (можно с описанием: «550 бургер кинг»):`, ikb([navRow('fin:menu')])); }
async function finConfirm(env,ctx,parsed){
  const cat=parsed.categoryId?await dbOne(env,'eb1_finance_categories',`id=eq.${parsed.categoryId}&select=name,emoji`):null;
  const type=parsed.type||'expense'; await setState(env,ctx.uid,'fin:confirm',{ ...parsed, type });
  let t=`Похоже, это ${type==='income'?'доход':'расход'}:\n<b>${money(parsed.amount)}</b>\nКатегория: ${cat?`${cat.emoji} ${cat.name}`:'без категории'}\n`;
  if(parsed.description) t+=`Описание: ${esc(parsed.description)}\n`; t+='\nЗаписать?';
  await send(env,ctx.chatId,t,ikb([ [btn('✅ Записать','fin:save_tx'), btn('✏️ Категория','fin:pick_cat')], [btn('🔁 Тип','fin:flip'), btn('❌ Отмена','fin:cancel')] ]));
}
async function finSaveTx(env,ctx){
  const st=await getState(env,ctx.uid); const d=st.data; if(!d?.amount) return finMenu(env,ctx);
  const today=nowParts(ctx.user.tz).dateStr;
  await dbInsert(env,'eb1_finance_transactions',{ telegram_user_id:ctx.uid, amount:d.amount, type:d.type||'expense', category_id:d.categoryId||null, description:d.description||'', tx_date:today });
  await logAct(env,ctx.uid,d.type==='income'?'income_add':'expense_add',`${d.amount}`); await clearState(env,ctx.uid);
  let warn=''; if((d.type||'expense')==='expense'&&d.categoryId) warn=await limitWarning(env,ctx.uid,d.categoryId,ctx.user.tz);
  const bal=await computeBalance(env,ctx.uid);
  await send(env,ctx.chatId,`✅ Записано: ${money(d.amount)}\nБаланс: ${money(bal)}${warn}`, finMenuKb());
}
async function limitWarning(env,uid,categoryId,tz){
  const lim=await dbOne(env,'eb1_limits',`telegram_user_id=eq.${uid}&category_id=eq.${categoryId}&select=monthly_limit`); if(!lim) return '';
  const np=nowParts(tz); const from=`${np.y}-${String(np.mo).padStart(2,'0')}-01`;
  const spent=(await sumTx(env,uid,'expense',from,np.dateStr)).filter(x=>x.category_id===categoryId).reduce((s,x)=>s+Number(x.amount),0);
  const pct=Math.round(spent/Number(lim.monthly_limit)*100);
  return pct>=90?`\n⚠️ Лимит почти исчерпан: ${pct}% (${money(spent)} из ${money(lim.monthly_limit)})`:'';
}
async function finOps(env,ctx,scope){
  const np=nowParts(ctx.user.tz); let from=np.dateStr;
  if(scope==='week') from=addDaysStr(np.dateStr,-7); else if(scope==='month') from=`${np.y}-${String(np.mo).padStart(2,'0')}-01`;
  const rows=await dbSelect(env,'eb1_finance_transactions',`telegram_user_id=eq.${ctx.uid}&tx_date=gte.${from}&tx_date=lte.${np.dateStr}&select=id,amount,type,description,category_id&order=created_at.desc&limit=40`);
  const cats=await dbSelect(env,'eb1_finance_categories',`telegram_user_id=eq.${ctx.uid}&select=id,name,emoji`);
  const catMap=Object.fromEntries((cats||[]).map(c=>[c.id,`${c.emoji} ${c.name}`]));
  let t=`📋 <b>Операции (${scope==='today'?'сегодня':scope==='week'?'неделя':'месяц'})</b>\n\n`; const kb=[];
  if(!rows?.length) t+='<i>пусто</i>'; else for(const x of rows){ const sign=x.type==='income'?'+':'-'; kb.push([btn(`${sign}${Math.round(x.amount)}₽ ${catMap[x.category_id]||''} ${x.description||''}`.slice(0,60),`fin:op:${x.id}`)]); }
  kb.push([btn('Сегодня','fin:ops:today'), btn('Неделя','fin:ops:week'), btn('Месяц','fin:ops:month')]); kb.push(navRow('fin:menu'));
  await screen(env,ctx,t,ikb(kb));
}
async function finOpOpen(env,ctx,id){
  const x=await dbOne(env,'eb1_finance_transactions',`telegram_user_id=eq.${ctx.uid}&id=eq.${id}`); if(!x) return finOps(env,ctx,'today');
  await screen(env,ctx,`${x.type==='income'?'➕ Доход':'➖ Расход'}: ${money(x.amount)}\n${x.description||''}`, ikb([ [btn('✏️ Сумма',`fin:oped:amount:${id}`), btn('✏️ Категория',`fin:oped:cat:${id}`)], [btn('🗑 Удалить',`fin:opdel:${id}`)], navRow('fin:ops:today') ]));
}
async function finBalance(env,ctx){
  const u=await dbOne(env,'eb1_users',`telegram_user_id=eq.${ctx.uid}&select=start_balance`); const bal=await computeBalance(env,ctx.uid);
  await screen(env,ctx,`💼 <b>Баланс</b>\n\nТекущий: <b>${money(bal)}</b>\nСтартовый: ${money(u?.start_balance||0)}\n\nФормула: стартовый + доходы − расходы + корректировки.`, ikb([ [btn('✏️ Стартовый баланс','fin:setstart')], [btn('➕/➖ Корректировка','fin:adjust')], navRow('fin:menu') ]));
}
async function finAnalytics(env,ctx){
  const np=nowParts(ctx.user.tz); const today=np.dateStr; const wkFrom=addDaysStr(today,-7); const moFrom=`${np.y}-${String(np.mo).padStart(2,'0')}-01`;
  const prevWkFrom=addDaysStr(today,-14), prevWkTo=addDaysStr(today,-8);
  const dayE=(await sumTx(env,ctx.uid,'expense',today,today)).reduce((s,x)=>s+ +x.amount,0);
  const wkE=(await sumTx(env,ctx.uid,'expense',wkFrom,today)).reduce((s,x)=>s+ +x.amount,0);
  const moRows=await sumTx(env,ctx.uid,'expense',moFrom,today); const moE=moRows.reduce((s,x)=>s+ +x.amount,0);
  const prevWk=(await sumTx(env,ctx.uid,'expense',prevWkFrom,prevWkTo)).reduce((s,x)=>s+ +x.amount,0);
  const moInc=(await sumTx(env,ctx.uid,'income',moFrom,today)).reduce((s,x)=>s+ +x.amount,0);
  const cats=await dbSelect(env,'eb1_finance_categories',`telegram_user_id=eq.${ctx.uid}&select=id,name,emoji`);
  const catMap=Object.fromEntries((cats||[]).map(c=>[c.id,`${c.emoji} ${c.name}`]));
  const byCat={}; for(const x of moRows){ const k=x.category_id||0; byCat[k]=(byCat[k]||0)+ +x.amount; }
  const top=Object.entries(byCat).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const days=Math.max(1,new Set(moRows.map(x=>x.tx_date)).size); const avg=moE/days;
  let t='📊 <b>Аналитика</b>\n\n';
  t+=`Сегодня: ${money(dayE)}\nНеделя: ${money(wkE)}\nМесяц: ${money(moE)}\nДоход за месяц: ${money(moInc)}\nСредняя трата в день: ${money(avg)}\nПрогноз месяца: ${money(avg*30)}\nНеделя vs прошлая: ${wkE-prevWk>=0?'+':''}${money(wkE-prevWk)}\n\n<b>Топ категорий (месяц):</b>\n`;
  if(top.length) for(const [k,v] of top) t+=`• ${catMap[k]||'без категории'} — ${money(v)}\n`; else t+='<i>нет данных</i>\n';
  await screen(env,ctx,t,ikb([[btn('📈 Графики','fin:charts')], navRow('fin:menu')]));
}
async function finCharts(env,ctx){
  const np=nowParts(ctx.user.tz); const moFrom=`${np.y}-${String(np.mo).padStart(2,'0')}-01`;
  const rows=await sumTx(env,ctx.uid,'expense',moFrom,np.dateStr);
  const cats=await dbSelect(env,'eb1_finance_categories',`telegram_user_id=eq.${ctx.uid}&select=id,name`); const catMap=Object.fromEntries((cats||[]).map(c=>[c.id,c.name]));
  const byCat={}; for(const x of rows){ const k=catMap[x.category_id]||'Прочее'; byCat[k]=(byCat[k]||0)+ +x.amount; }
  const byDay={}; for(const x of rows){ byDay[x.tx_date]=(byDay[x.tx_date]||0)+ +x.amount; }
  await answer(env,ctx.cbId,'Рисую графики…');
  if(Object.keys(byCat).length) await sendPhoto(env,ctx.chatId,pieChart('Расходы по категориям (месяц)',Object.keys(byCat),Object.values(byCat)),'🥧 Категории за месяц');
  const dks=Object.keys(byDay).sort(); if(dks.length) await sendPhoto(env,ctx.chatId,lineChart('Расходы по дням',dks.map(fmtDate),dks.map(d=>byDay[d]),'Расход'),'📉 По дням');
  await send(env,ctx.chatId,'Готово.', ikb([navRow('fin:menu')]));
}
async function finCategories(env,ctx){
  const cats=await dbSelect(env,'eb1_finance_categories',`telegram_user_id=eq.${ctx.uid}&select=id,name,emoji&order=id.asc`);
  const kb=(cats||[]).map(c=>[btn(`${c.emoji} ${c.name}`,`fin:catopen:${c.id}`)]); kb.push([btn('➕ Новая категория','fin:catnew')]); kb.push(navRow('fin:menu'));
  await screen(env,ctx,'🗂 <b>Категории</b>', ikb(kb));
}
async function finCatOpen(env,ctx,id){
  const c=await dbOne(env,'eb1_finance_categories',`telegram_user_id=eq.${ctx.uid}&id=eq.${id}`); if(!c) return finCategories(env,ctx);
  const kws=await dbSelect(env,'eb1_finance_category_keywords',`telegram_user_id=eq.${ctx.uid}&category_id=eq.${id}&select=keyword`);
  await screen(env,ctx,`${c.emoji} <b>${esc(c.name)}</b>\nКлючевые слова: ${(kws||[]).map(k=>k.keyword).join(', ')||'—'}`, ikb([ [btn('✏️ Переименовать',`fin:catren:${id}`), btn('😀 Emoji',`fin:catemoji:${id}`)], [btn('➕ Ключевое слово',`fin:catkw:${id}`)], [btn('🗑 Удалить категорию',`fin:catdel:${id}`)], navRow('fin:cat') ]));
}
async function finLimits(env,ctx){
  const np=nowParts(ctx.user.tz); const from=`${np.y}-${String(np.mo).padStart(2,'0')}-01`;
  const lims=await dbSelect(env,'eb1_limits',`telegram_user_id=eq.${ctx.uid}&select=category_id,monthly_limit`);
  const cats=await dbSelect(env,'eb1_finance_categories',`telegram_user_id=eq.${ctx.uid}&select=id,name,emoji`); const catMap=Object.fromEntries((cats||[]).map(c=>[c.id,c]));
  const moRows=await sumTx(env,ctx.uid,'expense',from,np.dateStr);
  let t='🎯 <b>Лимиты по категориям (месяц)</b>\n\n';
  if(!lims?.length) t+='<i>лимитов нет</i>\n'; else for(const l of lims){ const c=catMap[l.category_id]; if(!c) continue; const spent=moRows.filter(x=>x.category_id===l.category_id).reduce((s,x)=>s+ +x.amount,0); const pct=Math.round(spent/Number(l.monthly_limit)*100); t+=`${c.emoji} ${c.name}\nПотрачено ${money(spent)} из ${money(l.monthly_limit)} (${pct}%)\n\n`; }
  await screen(env,ctx,t,ikb([[btn('➕ Задать лимит','fin:limset')], navRow('fin:menu')]));
}
async function finPayments(env,ctx){
  const rows=await dbSelect(env,'eb1_payments',`telegram_user_id=eq.${ctx.uid}&archived=eq.false&select=id,title,amount,next_date&order=next_date.asc`);
  const kb=(rows||[]).map(p=>[btn(`${p.title} · ${money(p.amount)} · ${p.next_date?fmtDate(p.next_date):'—'}`.slice(0,60),`fin:payopen:${p.id}`)]);
  kb.push([btn('➕ Новый платёж','fin:paynew'), btn('🧩 Шаблоны','fin:paytpl')]); kb.push(navRow('fin:menu'));
  await screen(env,ctx,'💳 <b>Платежи и подписки</b>', ikb(kb));
}
async function finPayOpen(env,ctx,id){
  const p=await dbOne(env,'eb1_payments',`telegram_user_id=eq.${ctx.uid}&id=eq.${id}`); if(!p) return finPayments(env,ctx);
  let t=`💳 <b>${esc(p.title)}</b>\nСумма: ${money(p.amount)}\nСледующий платёж: ${p.next_date?fmtDate(p.next_date):'—'} ${String(p.next_hour).padStart(2,'0')}:00\nПериодичность: ${p.periodicity}\nВажность: ${IMP[p.importance]?.label}\nНапоминания: ${[p.remind_3d&&'за 3 дня',p.remind_1d&&'за сутки',p.remind_day&&'в день'].filter(Boolean).join(', ')||'—'}`;
  await screen(env,ctx,t,ikb([ [btn('✅ Оплачено',`fin:paypaid:${id}`), btn('📅 Перенести',`fin:paymove:${id}`)], [btn('✏️ Сумма',`fin:payamt:${id}`)], [btn('🗑 Удалить',`fin:paydel:${id}`)], navRow('fin:pay') ]));
}
async function finPayTemplates(env,ctx){
  const rows=await dbSelect(env,'eb1_payment_templates',`telegram_user_id=eq.${ctx.uid}&select=id,title,emoji&order=id.asc`);
  const kb=(rows||[]).map(r=>[btn(`➕ ${r.emoji} ${r.title}`,`fin:paytplnew:${r.id}`), btn('🗑',`fin:paytpldel:${r.id}`)]); kb.push(navRow('fin:pay'));
  await screen(env,ctx,'🧩 <b>Шаблоны платежей</b>', ikb(kb));
}
async function payWizardStart(env,ctx,title){
  if(title){ await setState(env,ctx.uid,'pay:amount',{ title }); return send(env,ctx.chatId,`Платёж: <b>${esc(title)}</b>\nВведи сумму (₽):`, ikb([navRow('fin:pay')])); }
  await setState(env,ctx.uid,'pay:title',{}); await send(env,ctx.chatId,'➕ Введи <b>название</b> платежа:', ikb([navRow('fin:pay')]));
}
async function finSavings(env,ctx){
  const rows=await dbSelect(env,'eb1_savings_goals',`telegram_user_id=eq.${ctx.uid}&closed=eq.false&select=id,title,target,current&order=id.asc`);
  let t='🐷 <b>Сбережения</b>\n\n'; const kb=[];
  if(!rows?.length) t+='<i>нет целей накопления</i>'; else for(const s of rows){ const pct=Math.min(100,Math.round(s.current/Number(s.target)*100)); const f=Math.round(pct/10); t+=`${esc(s.title)}\n${money(s.current)} / ${money(s.target)}\n${'█'.repeat(f)}${'░'.repeat(10-f)} ${pct}%\n\n`; kb.push([btn(`➕ ${s.title}`.slice(0,30),`fin:savadd:${s.id}`), btn('➖',`fin:savsub:${s.id}`), btn('🗑',`fin:savdel:${s.id}`)]); }
  kb.push([btn('➕ Новая цель накопления','fin:savnew')]); kb.push(navRow('fin:menu'));
  await screen(env,ctx,t,ikb(kb));
}

// ═══ ЦЕЛИ ═══
function goalMenuKb(){ return ikb([ [btn('➕ Новая цель','goal:new')], [btn('📋 Мои цели','goal:list')], [btn('🔥 Привычки','habit:menu')], navRow('nav:menu') ]); }
async function goalMenu(env,ctx){ await screen(env,ctx,'🎯 <b>Цели</b>', goalMenuKb()); }
async function goalList(env,ctx){
  const rows=await dbSelect(env,'eb1_goals',`telegram_user_id=eq.${ctx.uid}&status=eq.active&select=id,title,stage&order=created_at.desc`);
  const kb=(rows||[]).map(g=>[btn(`${g.title}${g.stage?` · ${g.stage}`:''}`.slice(0,60),`goal:open:${g.id}`)]); kb.push(navRow('goal:menu'));
  await screen(env,ctx,'📋 <b>Активные цели</b>', ikb(kb));
}
async function goalOpen(env,ctx,id){
  const g=await dbOne(env,'eb1_goals',`telegram_user_id=eq.${ctx.uid}&id=eq.${id}`); if(!g) return goalMenu(env,ctx);
  let t=`🎯 <b>${esc(g.title)}</b>\nСтадия: ${esc(g.stage)||'—'}\n`; if(g.note) t+=`📝 ${esc(g.note)}\n`;
  await screen(env,ctx,t,ikb([ [btn('🔄 Стадия',`goal:stage:${id}`), btn('📝 Заметка прогресса',`goal:note:${id}`)], [btn('📜 История стадий',`goal:hist:${id}`), btn('🗒 История заметок',`goal:notes:${id}`)], [btn('🏁 Закрыть цель',`goal:close:${id}`), btn('🗑 Удалить',`goal:del:${id}`)], navRow('goal:list') ]));
}
async function goalClose(env,ctx,id){
  const g=await dbOne(env,'eb1_goals',`telegram_user_id=eq.${ctx.uid}&id=eq.${id}`); if(!g) return goalMenu(env,ctx);
  await dbUpdate(env,'eb1_goals',`id=eq.${id}`,{ status:'closed', closed_at:new Date().toISOString() });
  await addRespect(env,ctx.uid,RESPECT.goal_closed,'Цель закрыта'); await logAct(env,ctx.uid,'goal_close',g.title);
  const a=await unlock(env,ctx.uid,'goal_first'); if(a) await send(env,ctx.chatId,`🏅 ${a}`);
  await answer(env,ctx.cbId,`+${RESPECT.goal_closed} респектов`); await goalMenu(env,ctx);
}

// ═══ ПРИВЫЧКИ ═══
function habitMenuKb(){ return ikb([ [btn('➕ Новая привычка','habit:new')], [btn('📋 Мои привычки','habit:list')], [btn('🧩 Шаблоны','habit:tpl'), btn('📊 Статистика','habit:stats')], navRow('goal:menu') ]); }
async function habitMenu(env,ctx){ await screen(env,ctx,'🔥 <b>Привычки</b>', habitMenuKb()); }
async function habitList(env,ctx){
  const today=nowParts(ctx.user.tz).dateStr;
  const rows=await dbSelect(env,'eb1_habits',`telegram_user_id=eq.${ctx.uid}&select=id,title&order=id.asc`); const kb=[];
  for(const h of (rows||[])){ const log=await dbOne(env,'eb1_habit_logs',`habit_id=eq.${h.id}&log_date=eq.${today}&select=id`); kb.push([btn(`${log?'✅':'⬜'} ${h.title}`.slice(0,50),`habit:open:${h.id}`)]); }
  kb.push(navRow('habit:menu')); await screen(env,ctx,'📋 <b>Мои привычки</b> (✅ — отмечена сегодня)', ikb(kb));
}
async function habitStats(env,uid,id){
  const tz=(await dbOne(env,'eb1_users',`telegram_user_id=eq.${uid}&select=tz`))?.tz||'Europe/Moscow';
  const today=nowParts(tz).dateStr; const from=addDaysStr(today,-29);
  const logs=await dbSelect(env,'eb1_habit_logs',`habit_id=eq.${id}&log_date=gte.${from}&log_date=lte.${today}&done=eq.true&select=log_date`);
  const set=new Set((logs||[]).map(l=>l.log_date));
  let streak=0, cur=today; while(set.has(cur)){ streak++; cur=addDaysStr(cur,-1); }
  let cal=''; for(let i=29;i>=0;i--){ const d=addDaysStr(today,-i); cal+=set.has(d)?'🟩':'⬜'; if((29-i)%7===6) cal+='\n'; }
  return { streak, total:set.size, last30:'Календарь (30 дней):\n'+cal };
}
async function habitOpen(env,ctx,id){
  const h=await dbOne(env,'eb1_habits',`telegram_user_id=eq.${ctx.uid}&id=eq.${id}`); if(!h) return habitMenu(env,ctx);
  const { streak,total,last30 }=await habitStats(env,ctx.uid,id);
  const lvl=HABIT_LEVELS.reduce((a,l)=>streak>=l.min?l.name:a,HABIT_LEVELS[0].name);
  let t=`🔥 <b>${esc(h.title)}</b>\nТип: ${h.type==='yesno'?'да/нет':h.type==='number'?'числовая':'временная'}\n`;
  if(h.type==='number'&&h.target_number) t+=`Цель: ${h.target_number}\n`; if(h.type==='time'&&h.target_time) t+=`Цель: до ${h.target_time}\n`;
  t+=`Серия: 🔥 ${streak} дн.\nРекорд: 🏆 ${Math.max(h.best_streak,streak)} дн.\nЗа 30 дней: ${total} (${Math.round(total/30*100)}%)\nУровень: ${lvl}\n\n${last30}`;
  await screen(env,ctx,t,ikb([ [btn('✅ Отметить сегодня',`habit:log:${id}`), btn('❌ Снять',`habit:unlog:${id}`)], [btn('⏰ Напоминание',`habit:remind:${id}`), btn('🗑 Удалить',`habit:del:${id}`)], navRow('habit:list') ]));
}
async function habitLog(env,ctx,id,done){
  const today=nowParts(ctx.user.tz).dateStr;
  if(done){
    await sb(env,'POST','eb1_habit_logs',{ body:[{ telegram_user_id:ctx.uid, habit_id:id, log_date:today, done:true }], prefer:'resolution=merge-duplicates' });
    await addRespect(env,ctx.uid,RESPECT.habit,'Привычка выполнена');
    const { streak }=await habitStats(env,ctx.uid,id); const h=await dbOne(env,'eb1_habits',`id=eq.${id}&select=best_streak`);
    if(streak>(h?.best_streak||0)) await dbUpdate(env,'eb1_habits',`id=eq.${id}`,{ best_streak:streak });
    if(streak===7){ await addRespect(env,ctx.uid,RESPECT.streak7,'7 дней'); const a=await unlock(env,ctx.uid,'habit_7'); if(a) await send(env,ctx.chatId,`🏅 ${a}`); }
    if(streak===30){ await addRespect(env,ctx.uid,RESPECT.streak30,'30 дней'); const a=await unlock(env,ctx.uid,'habit_30'); if(a) await send(env,ctx.chatId,`🏅 ${a}`); }
    await logAct(env,ctx.uid,'habit_done',String(id)); await answer(env,ctx.cbId,`🔥 Серия: ${streak}`);
  } else { await dbDelete(env,'eb1_habit_logs',`habit_id=eq.${id}&log_date=eq.${today}`); await answer(env,ctx.cbId,'Отметка снята'); }
  await habitOpen(env,ctx,id);
}
async function habitTemplates(env,ctx){
  const rows=await dbSelect(env,'eb1_habit_templates',`telegram_user_id=eq.${ctx.uid}&select=id,title,emoji&order=id.asc`);
  const kb=(rows||[]).map(r=>[btn(`➕ ${r.emoji} ${r.title}`,`habit:tplnew:${r.id}`), btn('🗑',`habit:tpldel:${r.id}`)]); kb.push(navRow('habit:menu'));
  await screen(env,ctx,'🧩 <b>Шаблоны привычек</b>', ikb(kb));
}
async function habitStatsScreen(env,ctx){
  const rows=await dbSelect(env,'eb1_habits',`telegram_user_id=eq.${ctx.uid}&select=id,title,best_streak`);
  let best=null, bestStreak=-1; const cur=[];
  for(const h of (rows||[])){ const { streak }=await habitStats(env,ctx.uid,h.id); cur.push(`• ${h.title}: 🔥 ${streak} (рекорд ${Math.max(h.best_streak,streak)})`); if(streak>bestStreak){ bestStreak=streak; best=h.title; } }
  let t='📊 <b>Статистика привычек</b>\n\n'+(best?`Лучшая серия сейчас: ${best} (${bestStreak} дн.)\n\n`:'')+(cur.join('\n')||'<i>нет привычек</i>');
  await screen(env,ctx,t,ikb([navRow('habit:menu')]));
}
async function finalizeHabit(env,ctx,data){
  const row={ telegram_user_id:ctx.uid, title:data.title, type:data.type||'yesno', target_number:data.target||null, target_time:data.target_time||null };
  const h=await dbInsertOne(env,'eb1_habits',row); await logAct(env,ctx.uid,'habit_create',row.title); const a=await unlock(env,ctx.uid,'habit_first'); await clearState(env,ctx.uid);
  await send(env,ctx.chatId,`🔥 Привычка создана: <b>${esc(row.title)}</b>${a?`\n🏅 ${a}`:''}`, ikb([[btn('Открыть',`habit:open:${h.id}`)],[btn('🏠 В меню','nav:menu')]]));
}

// ═══ ПРОФИЛЬ ═══
async function profMenu(env,ctx){
  const u=await dbOne(env,'eb1_users',`telegram_user_id=eq.${ctx.uid}&select=respects`); const r=u?.respects||0;
  await screen(env,ctx,`🏆 <b>Профиль</b>\n\nРеспекты: <b>${r}</b>\nУровень: ${levelName(r)}`, ikb([ [btn('🏅 Достижения','prof:ach'), btn('🛍 Награды','prof:rewards')], [btn('🕘 История активности','prof:act'), btn('📦 Архив задач','task:archive')], [btn('🎯 Закрытые цели','prof:goals'), btn('📊 Статистика привычек','habit:stats')], navRow('nav:menu') ]));
}
async function profAch(env,ctx){
  const got=await dbSelect(env,'eb1_achievements',`telegram_user_id=eq.${ctx.uid}&select=code`); const set=new Set((got||[]).map(a=>a.code));
  let t='🏅 <b>Достижения</b>\n\n'; for(const [code,label] of Object.entries(ACH)) t+=`${set.has(code)?'✅':'🔒'} ${label}\n`;
  await screen(env,ctx,t,ikb([navRow('prof:menu')]));
}
async function profRewards(env,ctx){
  const u=await dbOne(env,'eb1_users',`telegram_user_id=eq.${ctx.uid}&select=respects`);
  const rows=await dbSelect(env,'eb1_rewards',`telegram_user_id=eq.${ctx.uid}&select=id,title,cost&order=cost.asc`);
  const kb=(rows||[]).map(r=>[btn(`${r.title} — ${r.cost}`.slice(0,40),`prof:buy:${r.id}`), btn('🗑',`prof:rewdel:${r.id}`)]); kb.push([btn('➕ Новая награда','prof:rewnew')]); kb.push(navRow('prof:menu'));
  await screen(env,ctx,`🛍 <b>Магазин наград</b>\nУ тебя: ${u?.respects||0} респектов`, ikb(kb));
}
async function profBuy(env,ctx,id){
  const r=await dbOne(env,'eb1_rewards',`telegram_user_id=eq.${ctx.uid}&id=eq.${id}`); const u=await dbOne(env,'eb1_users',`telegram_user_id=eq.${ctx.uid}&select=respects`); if(!r) return profRewards(env,ctx);
  if((u?.respects||0)<r.cost){ await answer(env,ctx.cbId,'Недостаточно респектов'); return; }
  await dbUpdate(env,'eb1_users',`telegram_user_id=eq.${ctx.uid}`,{ respects:u.respects-r.cost });
  await dbInsert(env,'eb1_reward_purchases',{ telegram_user_id:ctx.uid, reward_id:id, title:r.title, cost:r.cost });
  await logAct(env,ctx.uid,'reward_buy',r.title); await answer(env,ctx.cbId,`Куплено: ${r.title}`); await profRewards(env,ctx);
}
async function profActivity(env,ctx){
  const rows=await dbSelect(env,'eb1_activity_log',`telegram_user_id=eq.${ctx.uid}&select=action,detail&order=created_at.desc&limit=25`);
  const names={ task_create:'➕ задача', task_done:'✅ задача', task_delete:'🗑 задача', goal_create:'🎯 цель', goal_close:'🏁 цель', habit_create:'🌱 привычка', habit_done:'🔥 привычка', expense_add:'➖ расход', income_add:'➕ доход', finance_delete:'🗑 операция', payment_create:'💳 платёж', payment_paid:'✅ платёж', reward_buy:'🛍 награда' };
  let t='🕘 <b>История активности</b>\n\n'; if(!rows?.length) t+='<i>пусто</i>'; else for(const a of rows) t+=`${names[a.action]||a.action} ${a.detail?esc(a.detail):''}\n`;
  await screen(env,ctx,t,ikb([navRow('prof:menu')]));
}
async function profGoals(env,ctx){
  const rows=await dbSelect(env,'eb1_goals',`telegram_user_id=eq.${ctx.uid}&status=eq.closed&select=title,stage&order=closed_at.desc&limit=20`);
  let t='🎯 <b>Закрытые цели</b>\n\n'; if(!rows?.length) t+='<i>пока нет</i>'; else for(const g of rows) t+=`🏁 ${esc(g.title)}${g.stage?` — ${esc(g.stage)}`:''}\n`;
  await screen(env,ctx,t,ikb([navRow('prof:menu')]));
}

// ═══ НАСТРОЙКИ ═══
async function setMenu(env,ctx){
  const u=await dbOne(env,'eb1_users',`telegram_user_id=eq.${ctx.uid}`);
  await screen(env,ctx,`⚙️ <b>Настройки</b>\n\nЧасовой пояс: ${u.tz}\nУтренний брифинг: ${u.briefing_enabled?'вкл':'выкл'} в ${u.briefing_time}\nНедельный разбор: ${u.weekly_enabled?'вкл':'выкл'}, ${['Вс','Пн','Вт','Ср','Чт','Пт','Сб'][u.weekly_dow]} ${u.weekly_time}`, ikb([ [btn(u.briefing_enabled?'🔕 Выключить брифинг':'🔔 Включить брифинг','set:brieftoggle')], [btn('🕗 Время брифинга','set:brieftime')], [btn(u.weekly_enabled?'🔕 Выключить недельный':'🔔 Включить недельный','set:weeklytoggle')], [btn('🌍 Часовой пояс','set:tz')], navRow('nav:menu') ]));
}

// ═══ БРИФИНГ / НЕДЕЛЬНЫЙ ═══
async function buildBriefing(env,uid,tz){
  const np=nowParts(tz); const today=np.dateStr;
  const tasks=await dbSelect(env,'eb1_tasks',`telegram_user_id=eq.${uid}&archived=eq.false&status=neq.done&or=(due_date.eq.${today},due_date.is.null)&select=title,stage,importance,note&order=importance.desc`);
  const goals=await dbSelect(env,'eb1_goals',`telegram_user_id=eq.${uid}&status=eq.active&select=title,stage&limit=5`);
  const habits=await dbSelect(env,'eb1_habits',`telegram_user_id=eq.${uid}&select=title&limit=10`);
  const pays=await dbSelect(env,'eb1_payments',`telegram_user_id=eq.${uid}&archived=eq.false&next_date=not.is.null&next_date=gte.${today}&next_date=lte.${addDaysStr(today,3)}&select=title,amount,next_date&order=next_date.asc`);
  const bal=await computeBalance(env,uid); const spent=(await sumTx(env,uid,'expense',today,today)).reduce((s,x)=>s+ +x.amount,0);
  const u=await dbOne(env,'eb1_users',`telegram_user_id=eq.${uid}&select=respects`);
  let t='Доброе утро ☀️\n\n📌 <b>Задачи на сегодня:</b>\n';
  if(tasks?.length) tasks.slice(0,10).forEach((x,i)=>{ t+=`${i+1}. ${x.importance==='red'?'🔴 ':''}${esc(x.title)}\n${x.stage?`   Стадия: ${esc(x.stage)}\n`:''}${x.note?`   📝 ${esc(x.note)}\n`:''}   Важность: ${IMP[x.importance]?.label}\n`; }); else t+='<i>задач нет</i>\n';
  t+='\n🎯 <b>Цели:</b>\n'+((goals?.length)?goals.map(g=>`• ${esc(g.title)}${g.stage?` — ${esc(g.stage)}`:''}`).join('\n'):'<i>нет</i>')+'\n';
  t+='\n🔥 <b>Привычки:</b>\n'+((habits?.length)?habits.map(h=>`• ${esc(h.title)}`).join('\n'):'<i>нет</i>')+'\n';
  t+=`\n💰 <b>Финансы:</b>\nСегодня потрачено: ${money(spent)}\nБаланс: ${money(bal)}\n`;
  t+='\n🔔 <b>Скоро платежи:</b>\n'+((pays?.length)?pays.map(p=>`• ${fmtDate(p.next_date)} — ${esc(p.title)} ${money(p.amount)}`).join('\n'):'<i>нет</i>')+'\n';
  t+=`\n🏆 Респекты: ${u?.respects||0}\nУровень: ${levelName(u?.respects||0)}\n\n💬 <b>Мотивация дня:</b>\n${pick(MOTIVATION)}`;
  return t;
}
async function buildWeekly(env,uid,tz){
  const np=nowParts(tz); const today=np.dateStr; const from=addDaysStr(today,-7);
  const closed=await dbSelect(env,'eb1_tasks',`telegram_user_id=eq.${uid}&status=eq.done&done_at=gte.${from}T00:00:00&select=title`);
  const created=await dbSelect(env,'eb1_tasks',`telegram_user_id=eq.${uid}&created_at=gte.${from}T00:00:00&select=id`);
  const overdue=await dbSelect(env,'eb1_tasks',`telegram_user_id=eq.${uid}&status=neq.done&archived=eq.false&due_date=not.is.null&due_date=lt.${today}&select=id`);
  const inc=(await sumTx(env,uid,'income',from,today)).reduce((s,x)=>s+ +x.amount,0);
  const expRows=await sumTx(env,uid,'expense',from,today); const exp=expRows.reduce((s,x)=>s+ +x.amount,0);
  const cats=await dbSelect(env,'eb1_finance_categories',`telegram_user_id=eq.${uid}&select=id,name,emoji`); const catMap=Object.fromEntries((cats||[]).map(c=>[c.id,`${c.emoji} ${c.name}`]));
  const byCat={}; for(const x of expRows){ const k=x.category_id||0; byCat[k]=(byCat[k]||0)+ +x.amount; } const top=Object.entries(byCat).sort((a,b)=>b[1]-a[1])[0];
  const goals=await dbSelect(env,'eb1_goals',`telegram_user_id=eq.${uid}&status=eq.active&select=title,stage&limit=5`);
  const u=await dbOne(env,'eb1_users',`telegram_user_id=eq.${uid}&select=respects`);
  let t='📊 <b>Итоги недели</b>\n\n';
  t+=`✅ Закрытые задачи: ${closed?.length||0}\n🆕 Новые: ${created?.length||0}\n⚠️ Просрочено: ${overdue?.length||0}\n\n💰 <b>Финансы:</b>\nДоходы: ${money(inc)}\nРасходы: ${money(exp)}\n`;
  if(top) t+=`Больше всего: ${catMap[top[0]]||'без категории'} — ${money(top[1])}\n`;
  t+='\n🎯 <b>Цели:</b>\n'+((goals?.length)?goals.map(g=>`• ${esc(g.title)}${g.stage?` — ${esc(g.stage)}`:''}`).join('\n'):'<i>нет</i>')+`\n\n🏆 Респекты всего: ${u?.respects||0}`;
  return t;
}

// ═══ ОБРАБОТКА ТЕКСТА ═══
async function handleText(env,ctx,text){
  const st=await getState(env,ctx.uid); const state=st.state; const data=st.data||{};
  if(state && state.startsWith('task:') && (state==='task:title'||state==='task:stage'||state==='task:note')) return taskWizardText(env,ctx,state,data,text);
  if(state==='fin:amount'){ const parsed=await parseQuickFinance(env,ctx.uid,text); if(!parsed) return send(env,ctx.chatId,'Не понял сумму. Введи число, напр. «550 еда».'); parsed.type=data.type||parsed.type||'expense'; return finConfirm(env,ctx,parsed); }
  if(state){ if(await extraTextStep(env,ctx,state,data,text)) return; if(await genericTextStep(env,ctx,state,data,text)) return; }
  const parsed=await parseQuickFinance(env,ctx.uid,text); if(parsed) return finConfirm(env,ctx,parsed);
  await send(env,ctx.chatId,'Не понял. Открой меню:', ikb([[btn('🏠 В меню','nav:menu')]]));
}
async function extraTextStep(env,ctx,state,data,text){
  const t=text.trim();
  if(state==='fin:opamt'){ await dbUpdate(env,'eb1_finance_transactions',`id=eq.${data.id}`,{ amount:parseFloat(t.replace(',','.'))||0 }); await clearState(env,ctx.uid); await send(env,ctx.chatId,'✅ Сумма обновлена', ikb([[btn('Операции','fin:ops:today')]])); return true; }
  if(state==='fin:opcat'){ const cat=await dbOne(env,'eb1_finance_categories',`telegram_user_id=eq.${ctx.uid}&name=ilike.${encodeURIComponent(t)}&select=id`); if(cat) await dbUpdate(env,'eb1_finance_transactions',`id=eq.${data.id}`,{ category_id:cat.id }); await clearState(env,ctx.uid); await send(env,ctx.chatId,'✅ Категория обновлена', ikb([[btn('Операции','fin:ops:today')]])); return true; }
  if(state==='habit:remind'){ if(/^\d{1,2}:\d{2}$/.test(t)) await dbUpdate(env,'eb1_habits',`id=eq.${data.id}`,{ reminder_time:t.padStart(5,'0') }); await clearState(env,ctx.uid); await send(env,ctx.chatId,'✅ Напоминание задано', ikb([[btn('Открыть',`habit:open:${data.id}`)]])); return true; }
  return false;
}
async function genericTextStep(env,ctx,state,data,text){
  const t=text.trim();
  const done=async(msg,kb)=>{ await clearState(env,ctx.uid); await send(env,ctx.chatId,msg,kb); };
  switch(state){
    case 'goal:new': { const g=await dbInsertOne(env,'eb1_goals',{ telegram_user_id:ctx.uid, title:t }); await logAct(env,ctx.uid,'goal_create',t); await done(`🎯 Цель создана: <b>${esc(t)}</b>`, ikb([[btn('Открыть',`goal:open:${g.id}`)],[btn('🏠 В меню','nav:menu')]])); return true; }
    case 'goal:stage': { const g=await dbOne(env,'eb1_goals',`id=eq.${data.id}&telegram_user_id=eq.${ctx.uid}`); await dbInsert(env,'eb1_goal_stage_history',{ telegram_user_id:ctx.uid, goal_id:data.id, old_stage:g?.stage||'', new_stage:t }); await dbUpdate(env,'eb1_goals',`id=eq.${data.id}`,{ stage:t }); await done('✅ Стадия обновлена', ikb([[btn('Открыть',`goal:open:${data.id}`)]])); return true; }
    case 'goal:note': { await dbInsert(env,'eb1_goal_notes',{ telegram_user_id:ctx.uid, goal_id:data.id, text:t }); await done('✅ Заметка прогресса добавлена', ikb([[btn('Открыть',`goal:open:${data.id}`)]])); return true; }
    case 'habit:new': { data.title=t; await setState(env,ctx.uid,'habit:type',data); await send(env,ctx.chatId,'Тип привычки?', ikb([[btn('✅ Да/нет','ht:type:yesno')],[btn('🔢 Числовая','ht:type:number')],[btn('⏰ Временная','ht:type:time')]])); return true; }
    case 'habit:number': { data.target=parseFloat(t.replace(',','.'))||null; await finalizeHabit(env,ctx,data); return true; }
    case 'habit:time': { data.target_time=t; await finalizeHabit(env,ctx,data); return true; }
    case 'pay:title': { data.title=t; await setState(env,ctx.uid,'pay:amount',data); await send(env,ctx.chatId,'Введи сумму (₽):'); return true; }
    case 'pay:amount': { data.amount=parseFloat(t.replace(',','.'))||0; await setState(env,ctx.uid,'pay:date',data); const np=nowParts(ctx.user.tz); await send(env,ctx.chatId,'Дата следующего платежа:', buildCalendar(np.y,np.mo,'pw:cal')); return true; }
    case 'fin:catnew': { const m=t.match(/^(\S+)?\s*(.+)?$/); const emoji=(m&&m[1]&&/\p{Extended_Pictographic}/u.test(m[1]))?m[1]:''; const name=emoji?(m[2]||'').trim():t; await dbInsertOne(env,'eb1_finance_categories',{ telegram_user_id:ctx.uid, name:name||t, emoji }); await done('✅ Категория создана', ikb([[btn('К категориям','fin:cat')]])); return true; }
    case 'fin:catren': { await dbUpdate(env,'eb1_finance_categories',`id=eq.${data.id}`,{ name:t }); await done('✅ Переименовано', ikb([[btn('Открыть',`fin:catopen:${data.id}`)]])); return true; }
    case 'fin:catemoji': { await dbUpdate(env,'eb1_finance_categories',`id=eq.${data.id}`,{ emoji:t }); await done('✅ Emoji обновлён', ikb([[btn('Открыть',`fin:catopen:${data.id}`)]])); return true; }
    case 'fin:catkw': { await dbInsert(env,'eb1_finance_category_keywords',{ telegram_user_id:ctx.uid, category_id:data.id, keyword:t.toLowerCase() }); await done('✅ Ключевое слово добавлено', ikb([[btn('Открыть',`fin:catopen:${data.id}`)]])); return true; }
    case 'fin:setstart': { await dbUpdate(env,'eb1_users',`telegram_user_id=eq.${ctx.uid}`,{ start_balance:parseFloat(t.replace(',','.'))||0 }); await done('✅ Стартовый баланс задан', ikb([[btn('Баланс','fin:bal')]])); return true; }
    case 'fin:adjust': { const v=parseFloat(t.replace(',','.')); if(isFinite(v)) await dbInsert(env,'eb1_balance_adjustments',{ telegram_user_id:ctx.uid, amount:v, reason:'ручная корректировка' }); await done('✅ Баланс скорректирован', ikb([[btn('Баланс','fin:bal')]])); return true; }
    case 'fin:limset': { const mm=t.match(/^(.+?)\s+(\d+(?:[.,]\d+)?)$/); if(!mm){ await send(env,ctx.chatId,'Формат: «Еда 10000»'); return true; } const cat=await dbOne(env,'eb1_finance_categories',`telegram_user_id=eq.${ctx.uid}&name=ilike.${encodeURIComponent(mm[1].trim())}&select=id`); if(!cat){ await send(env,ctx.chatId,'Категория не найдена'); return true; } await sb(env,'POST','eb1_limits',{ body:[{ telegram_user_id:ctx.uid, category_id:cat.id, monthly_limit:parseFloat(mm[2].replace(',','.')) }], prefer:'resolution=merge-duplicates' }); await done('✅ Лимит задан', ikb([[btn('Лимиты','fin:lim')]])); return true; }
    case 'fin:savnew': { const mm=t.match(/^(.+?)\s+(\d+(?:[.,]\d+)?)$/); if(!mm){ await send(env,ctx.chatId,'Формат: «Ноутбук 120000»'); return true; } await dbInsert(env,'eb1_savings_goals',{ telegram_user_id:ctx.uid, title:mm[1].trim(), target:parseFloat(mm[2].replace(',','.')) }); await done('✅ Цель накопления создана', ikb([[btn('Сбережения','fin:save')]])); return true; }
    case 'fin:savadd': { const v=parseFloat(t.replace(',','.'))||0; const s=await dbOne(env,'eb1_savings_goals',`id=eq.${data.id}&select=current`); await dbUpdate(env,'eb1_savings_goals',`id=eq.${data.id}`,{ current:Number(s.current)+v }); await done('✅ Пополнено', ikb([[btn('Сбережения','fin:save')]])); return true; }
    case 'fin:savsub': { const v=parseFloat(t.replace(',','.'))||0; const s=await dbOne(env,'eb1_savings_goals',`id=eq.${data.id}&select=current`); await dbUpdate(env,'eb1_savings_goals',`id=eq.${data.id}`,{ current:Math.max(0,Number(s.current)-v) }); await done('✅ Уменьшено', ikb([[btn('Сбережения','fin:save')]])); return true; }
    case 'fin:payamt': { await dbUpdate(env,'eb1_payments',`id=eq.${data.id}`,{ amount:parseFloat(t.replace(',','.'))||0 }); await done('✅ Сумма обновлена', ikb([[btn('Открыть',`fin:payopen:${data.id}`)]])); return true; }
    case 'task:note_open': { await dbUpdate(env,'eb1_tasks',`id=eq.${data.id}`,{ note:t }); await done('✅ Заметка сохранена', ikb([[btn('Открыть',`task:open:${data.id}`)]])); return true; }
    case 'task:stage_open': { const x=await dbOne(env,'eb1_tasks',`id=eq.${data.id}&select=stage`); await dbInsert(env,'eb1_task_stage_history',{ telegram_user_id:ctx.uid, task_id:data.id, old_stage:x?.stage||'', new_stage:t }); await dbUpdate(env,'eb1_tasks',`id=eq.${data.id}`,{ stage:t }); await done('✅ Стадия обновлена', ikb([[btn('Открыть',`task:open:${data.id}`)]])); return true; }
    case 'prof:rewnew': { const mm=t.match(/^(.+?)\s+(\d+)$/); if(!mm){ await send(env,ctx.chatId,'Формат: «Пицца 1000»'); return true; } await dbInsert(env,'eb1_rewards',{ telegram_user_id:ctx.uid, title:mm[1].trim(), cost:parseInt(mm[2]) }); await done('✅ Награда добавлена', ikb([[btn('Награды','prof:rewards')]])); return true; }
    case 'set:brieftime': { if(/^\d{1,2}:\d{2}$/.test(t)) await dbUpdate(env,'eb1_users',`telegram_user_id=eq.${ctx.uid}`,{ briefing_time:t.padStart(5,'0') }); await done('✅ Время брифинга задано', ikb([[btn('Настройки','set:menu')]])); return true; }
    case 'set:tz': { await dbUpdate(env,'eb1_users',`telegram_user_id=eq.${ctx.uid}`,{ tz:t }); await done('✅ Часовой пояс задан', ikb([[btn('Настройки','set:menu')]])); return true; }
  }
  return false;
}

// ═══ РОУТЕР CALLBACK ═══
async function handleCallback(env,ctx,data){
  const p=data.split(':'); const area=p[0];
  if(data==='noop') return answer(env,ctx.cbId);
  if(area==='nav'){ await clearState(env,ctx.uid); if(p[1]==='menu') return showMenu(env,ctx,ctx.user); }

  if(area==='tw'){
    const st=await getState(env,ctx.uid); const d=st.data||{};
    if(p[1]==='stageskip'){ d.stage=''; return askTaskDate(env,ctx,d); }
    if(p[1]==='cal'&&p[2]==='nav'){ let y=+p[3],mo=+p[4]+ +p[5]; if(mo<1){mo=12;y--;} if(mo>12){mo=1;y++;} return edit(env,ctx.chatId,ctx.msgId,'Выбери дату:',buildCalendar(y,mo,'tw:cal',[btn('Без даты','tw:date:none')])); }
    if(p[1]==='cal'&&p[2]==='pick'){ d.due_date=p[3]; return askTaskTime(env,ctx,d); }
    if(p[1]==='date'){ d.due_date=p[2]; if(p[2]==='none'){ d.due_hour=null; return askTaskImportance(env,ctx,d); } return askTaskTime(env,ctx,d); }
    if(p[1]==='time'){ d.due_hour=p[2]==='none'?null:+p[2]; return askTaskImportance(env,ctx,d); }
    if(p[1]==='imp'){ d.importance=p[2]; return askTaskRepeat(env,ctx,d); }
    if(p[1]==='rep'){ d.repeat=p[2]; return askTaskReminders(env,ctx,d); }
    if(p[1]==='rt'){ d.picks=d.picks||['at']; const k=p[2]; d.picks=d.picks.includes(k)?d.picks.filter(x=>x!==k):[...d.picks,k]; await setState(env,ctx.uid,'task:rem',d); let hoursAway=null; if(d.due_date&&d.due_date!=='none'){ const fire=localToUtc(...d.due_date.split('-').map(Number),(d.due_hour??9),0,ctx.user.tz); hoursAway=(fire.getTime()-Date.now())/3600000; } return edit(env,ctx.chatId,ctx.msgId,'🔔 Выбери напоминания:',ikb(reminderPicksKeyboard(d.picks,hoursAway,'tw'))); }
    if(p[1]==='rdone') return finalizeTask(env,ctx,d);
    return answer(env,ctx.cbId);
  }
  if(area==='ht'){
    const st=await getState(env,ctx.uid); const d=st.data||{};
    if(p[1]==='type'){ d.type=p[2]; if(p[2]==='number'){ await setState(env,ctx.uid,'habit:number',d); return send(env,ctx.chatId,'Введи числовую цель (напр. 2):'); } if(p[2]==='time'){ await setState(env,ctx.uid,'habit:time',d); return send(env,ctx.chatId,'Введи целевое время (напр. 23:00):'); } return finalizeHabit(env,ctx,d); }
  }
  if(area==='pw'){
    const st=await getState(env,ctx.uid); const d=st.data||{};
    if(p[1]==='cal'&&p[2]==='nav'){ let y=+p[3],mo=+p[4]+ +p[5]; if(mo<1){mo=12;y--;} if(mo>12){mo=1;y++;} return edit(env,ctx.chatId,ctx.msgId,'Дата платежа:',buildCalendar(y,mo,'pw:cal')); }
    if(p[1]==='cal'&&p[2]==='pick'){ d.next_date=p[3]; const row={ telegram_user_id:ctx.uid, title:d.title, amount:d.amount||0, next_date:d.next_date, periodicity:'monthly', importance:'orange' }; const pay=await dbInsertOne(env,'eb1_payments',row); const fire=localToUtc(...d.next_date.split('-').map(Number),12,0,ctx.user.tz); await scheduleEventReminders(env,ctx.uid,'payment',pay.id,`Платёж: ${row.title}`,fire,['3d','1d','at']); await logAct(env,ctx.uid,'payment_create',row.title); await clearState(env,ctx.uid); return send(env,ctx.chatId,`✅ Платёж создан: <b>${esc(row.title)}</b> ${money(row.amount)}`, ikb([[btn('Открыть',`fin:payopen:${pay.id}`)],[btn('🏠 В меню','nav:menu')]])); }
  }

  if(area==='task'){
    switch(p[1]){
      case 'menu': return taskMenu(env,ctx);
      case 'new': return taskWizardStart(env,ctx);
      case 'list': return taskList(env,ctx,p[2]);
      case 'open': return taskOpen(env,ctx,p[2]);
      case 'done': return taskDone(env,ctx,p[2]);
      case 'overdue': return taskOverdue(env,ctx);
      case 'archive': return taskArchive(env,ctx);
      case 'cal': return taskCalendar(env,ctx,p[2]);
      case 'tpl': return taskTemplates(env,ctx);
      case 'tplnew': { const tpl=await dbOne(env,'eb1_task_templates',`id=eq.${p[2]}&select=title`); return taskWizardStart(env,ctx,tpl?.title||'Задача'); }
      case 'tpldel': { await dbDelete(env,'eb1_task_templates',`id=eq.${p[2]}&telegram_user_id=eq.${ctx.uid}`); return taskTemplates(env,ctx); }
      case 'stage': { await setState(env,ctx.uid,'task:stage_open',{ id:+p[2] }); return send(env,ctx.chatId,'Введи новую стадию:'); }
      case 'note': { await setState(env,ctx.uid,'task:note_open',{ id:+p[2] }); return send(env,ctx.chatId,'Введи заметку:'); }
      case 'status': return screen(env,ctx,'Выбери статус:', ikb([[btn(STATUS.todo,`task:setst:todo:${p[2]}`)],[btn(STATUS.doing,`task:setst:doing:${p[2]}`)],[btn(STATUS.paused,`task:setst:paused:${p[2]}`)],navRow(`task:open:${p[2]}`)]));
      case 'setst': { await dbUpdate(env,'eb1_tasks',`id=eq.${p[3]}`,{ status:p[2] }); return taskOpen(env,ctx,p[3]); }
      case 'imp': return screen(env,ctx,'Выбери важность:', ikb([[btn(IMP.green.label,`task:setimp:green:${p[2]}`)],[btn(IMP.yellow.label,`task:setimp:yellow:${p[2]}`)],[btn(IMP.orange.label,`task:setimp:orange:${p[2]}`)],[btn(IMP.red.label,`task:setimp:red:${p[2]}`)],navRow(`task:open:${p[2]}`)]));
      case 'setimp': { await dbUpdate(env,'eb1_tasks',`id=eq.${p[3]}`,{ importance:p[2] }); return taskOpen(env,ctx,p[3]); }
      case 'move': { const np=nowParts(ctx.user.tz); await setState(env,ctx.uid,'task:moving',{ id:+p[2] }); return screen(env,ctx,'На какую дату перенести?',buildCalendar(np.y,np.mo,'task:movecal')); }
      case 'movecal': { if(p[2]==='nav'){ let y=+p[3],mo=+p[4]+ +p[5]; if(mo<1){mo=12;y--;} if(mo>12){mo=1;y++;} return edit(env,ctx.chatId,ctx.msgId,'Дата:',buildCalendar(y,mo,'task:movecal')); } if(p[2]==='pick'){ const st=await getState(env,ctx.uid); await dbUpdate(env,'eb1_tasks',`id=eq.${st.data.id}`,{ due_date:p[3] }); await clearState(env,ctx.uid); return taskOpen(env,ctx,st.data.id); } break; }
      case 'hist': { const h=await dbSelect(env,'eb1_task_stage_history',`task_id=eq.${p[2]}&select=old_stage,new_stage&order=changed_at.asc`); let t='📜 <b>История стадий</b>\n\n'; if(!h?.length) t+='<i>пусто</i>'; else h.forEach(r=>t+=`${esc(r.old_stage||'—')} → ${esc(r.new_stage)}\n`); await screen(env,ctx,t,ikb([navRow(`task:open:${p[2]}`)])); const nums=(h||[]).map(r=>parseFloat(String(r.new_stage).replace(',','.'))).filter(v=>isFinite(v)); if(nums.length>=2) await sendPhoto(env,ctx.chatId,lineChart('Прогресс стадии',nums.map((_,i)=>String(i+1)),nums,'Значение'),'📈 Прогресс'); return; }
      case 'del': return screen(env,ctx,'Точно удалить задачу?', ikb([[btn('🗑 Да, удалить',`task:delyes:${p[2]}`)],[btn('Отмена',`task:open:${p[2]}`)]]));
      case 'delyes': { await dbDelete(env,'eb1_tasks',`id=eq.${p[2]}&telegram_user_id=eq.${ctx.uid}`); await dbDelete(env,'eb1_reminders',`kind=eq.task&ref_id=eq.${p[2]}`); await logAct(env,ctx.uid,'task_delete',''); return taskMenu(env,ctx); }
      case 'alldone': { await addRespect(env,ctx.uid,RESPECT.all_done,'Все задачи дня'); const a=await unlock(env,ctx.uid,'all_done'); await answer(env,ctx.cbId,`🎉 +${RESPECT.all_done}!`); if(a) await send(env,ctx.chatId,`🏅 ${a}\n\n💬 ${pick(MOTIVATION)}`); return showMenu(env,ctx,ctx.user); }
    }
  }

  if(area==='fin'){
    switch(p[1]){
      case 'menu': return finMenu(env,ctx);
      case 'add': return finAddStart(env,ctx,p[2]);
      case 'save_tx': return finSaveTx(env,ctx);
      case 'cancel': await clearState(env,ctx.uid); return finMenu(env,ctx);
      case 'flip': { const st=await getState(env,ctx.uid); const d=st.data; d.type=d.type==='income'?'expense':'income'; return finConfirm(env,ctx,d); }
      case 'pick_cat': { const cats=await dbSelect(env,'eb1_finance_categories',`telegram_user_id=eq.${ctx.uid}&select=id,name,emoji`); const kb=(cats||[]).map(c=>[btn(`${c.emoji} ${c.name}`,`fin:setcat:${c.id}`)]); kb.push([btn('Отмена','fin:cancel')]); return screen(env,ctx,'Выбери категорию:',ikb(kb)); }
      case 'setcat': { const st=await getState(env,ctx.uid); const d=st.data; d.categoryId=+p[2]; return finConfirm(env,ctx,d); }
      case 'ops': return finOps(env,ctx,p[2]);
      case 'op': return finOpOpen(env,ctx,p[2]);
      case 'opdel': { await dbDelete(env,'eb1_finance_transactions',`id=eq.${p[2]}&telegram_user_id=eq.${ctx.uid}`); await logAct(env,ctx.uid,'finance_delete',''); return finOps(env,ctx,'today'); }
      case 'oped': { await setState(env,ctx.uid,p[2]==='amount'?'fin:opamt':'fin:opcat',{ id:+p[3] }); return send(env,ctx.chatId,p[2]==='amount'?'Новая сумма:':'Напиши название категории:'); }
      case 'an': return finAnalytics(env,ctx);
      case 'charts': return finCharts(env,ctx);
      case 'bal': return finBalance(env,ctx);
      case 'setstart': await setState(env,ctx.uid,'fin:setstart',{}); return send(env,ctx.chatId,'Введи стартовый баланс (₽):');
      case 'adjust': await setState(env,ctx.uid,'fin:adjust',{}); return send(env,ctx.chatId,'Введи корректировку (напр. 500 или -300):');
      case 'lim': return finLimits(env,ctx);
      case 'limset': await setState(env,ctx.uid,'fin:limset',{}); return send(env,ctx.chatId,'Введи «Категория сумма», напр. «Еда 10000»:');
      case 'cat': return finCategories(env,ctx);
      case 'catopen': return finCatOpen(env,ctx,p[2]);
      case 'catnew': await setState(env,ctx.uid,'fin:catnew',{}); return send(env,ctx.chatId,'Введи «😀 Название» или просто название:');
      case 'catren': await setState(env,ctx.uid,'fin:catren',{ id:+p[2] }); return send(env,ctx.chatId,'Новое название:');
      case 'catemoji': await setState(env,ctx.uid,'fin:catemoji',{ id:+p[2] }); return send(env,ctx.chatId,'Новый emoji:');
      case 'catkw': await setState(env,ctx.uid,'fin:catkw',{ id:+p[2] }); return send(env,ctx.chatId,'Ключевое слово:');
      case 'catdel': { await dbDelete(env,'eb1_finance_category_keywords',`category_id=eq.${p[2]}&telegram_user_id=eq.${ctx.uid}`); await dbDelete(env,'eb1_finance_categories',`id=eq.${p[2]}&telegram_user_id=eq.${ctx.uid}`); return finCategories(env,ctx); }
      case 'pay': return finPayments(env,ctx);
      case 'paynew': return payWizardStart(env,ctx);
      case 'payopen': return finPayOpen(env,ctx,p[2]);
      case 'paytpl': return finPayTemplates(env,ctx);
      case 'paytplnew': { const tpl=await dbOne(env,'eb1_payment_templates',`id=eq.${p[2]}&select=title`); return payWizardStart(env,ctx,tpl?.title||'Платёж'); }
      case 'paytpldel': { await dbDelete(env,'eb1_payment_templates',`id=eq.${p[2]}&telegram_user_id=eq.${ctx.uid}`); return finPayTemplates(env,ctx); }
      case 'payamt': await setState(env,ctx.uid,'fin:payamt',{ id:+p[2] }); return send(env,ctx.chatId,'Новая сумма (₽):');
      case 'paypaid': { const pay=await dbOne(env,'eb1_payments',`id=eq.${p[2]}`); const today=nowParts(ctx.user.tz).dateStr; await dbInsert(env,'eb1_finance_transactions',{ telegram_user_id:ctx.uid, amount:pay.amount, type:'expense', category_id:pay.category_id, description:pay.title, tx_date:today }); if(pay.periodicity&&pay.periodicity!=='none'&&pay.next_date){ const nd=nextRepeatDate(pay.next_date,pay.periodicity); await dbUpdate(env,'eb1_payments',`id=eq.${p[2]}`,{ next_date:nd }); const fire=localToUtc(...nd.split('-').map(Number),12,0,ctx.user.tz); await scheduleEventReminders(env,ctx.uid,'payment',pay.id,`Платёж: ${pay.title}`,fire,['3d','1d','at']); } await dbDelete(env,'eb1_reminders',`kind=eq.payment&ref_id=eq.${p[2]}&sent=eq.false`); await logAct(env,ctx.uid,'payment_paid',pay.title); await answer(env,ctx.cbId,'✅ Оплачено и записано в расходы'); return finPayments(env,ctx); }
      case 'paymove': { const np=nowParts(ctx.user.tz); await setState(env,ctx.uid,'pay:moving',{ id:+p[2] }); return screen(env,ctx,'Новая дата платежа:',buildCalendar(np.y,np.mo,'fin:paymovecal')); }
      case 'paymovecal': { if(p[2]==='nav'){ let y=+p[3],mo=+p[4]+ +p[5]; if(mo<1){mo=12;y--;} if(mo>12){mo=1;y++;} return edit(env,ctx.chatId,ctx.msgId,'Дата:',buildCalendar(y,mo,'fin:paymovecal')); } if(p[2]==='pick'){ const st=await getState(env,ctx.uid); await dbUpdate(env,'eb1_payments',`id=eq.${st.data.id}`,{ next_date:p[3] }); await clearState(env,ctx.uid); return finPayOpen(env,ctx,st.data.id); } break; }
      case 'paydel': { await dbDelete(env,'eb1_payments',`id=eq.${p[2]}&telegram_user_id=eq.${ctx.uid}`); await dbDelete(env,'eb1_reminders',`kind=eq.payment&ref_id=eq.${p[2]}`); return finPayments(env,ctx); }
      case 'save': return finSavings(env,ctx);
      case 'savnew': await setState(env,ctx.uid,'fin:savnew',{}); return send(env,ctx.chatId,'Введи «Название сумма», напр. «Ноутбук 120000»:');
      case 'savadd': await setState(env,ctx.uid,'fin:savadd',{ id:+p[2] }); return send(env,ctx.chatId,'Сколько добавить (₽)?');
      case 'savsub': await setState(env,ctx.uid,'fin:savsub',{ id:+p[2] }); return send(env,ctx.chatId,'Сколько убрать (₽)?');
      case 'savdel': { await dbDelete(env,'eb1_savings_goals',`id=eq.${p[2]}&telegram_user_id=eq.${ctx.uid}`); return finSavings(env,ctx); }
    }
  }

  if(area==='goal'){
    switch(p[1]){
      case 'menu': return goalMenu(env,ctx);
      case 'new': await setState(env,ctx.uid,'goal:new',{}); return send(env,ctx.chatId,'Введи название цели:');
      case 'list': return goalList(env,ctx);
      case 'open': return goalOpen(env,ctx,p[2]);
      case 'stage': await setState(env,ctx.uid,'goal:stage',{ id:+p[2] }); return send(env,ctx.chatId,'Новая стадия цели:');
      case 'note': await setState(env,ctx.uid,'goal:note',{ id:+p[2] }); return send(env,ctx.chatId,'Заметка прогресса:');
      case 'hist': { const h=await dbSelect(env,'eb1_goal_stage_history',`goal_id=eq.${p[2]}&select=old_stage,new_stage&order=changed_at.asc`); let t='📜 История стадий\n\n'; if(!h?.length) t+='пусто'; else h.forEach(r=>t+=`${esc(r.old_stage||'—')} → ${esc(r.new_stage)}\n`); await screen(env,ctx,t,ikb([navRow(`goal:open:${p[2]}`)])); const nums=(h||[]).map(r=>parseFloat(String(r.new_stage).replace(',','.'))).filter(v=>isFinite(v)); if(nums.length>=2) await sendPhoto(env,ctx.chatId,lineChart('Прогресс цели',nums.map((_,i)=>String(i+1)),nums,'Значение'),'📈'); return; }
      case 'notes': { const n=await dbSelect(env,'eb1_goal_notes',`goal_id=eq.${p[2]}&select=text&order=created_at.desc&limit=20`); let t='🗒 Заметки прогресса\n\n'; if(!n?.length) t+='пусто'; else n.forEach(x=>t+=`• ${esc(x.text)}\n`); return screen(env,ctx,t,ikb([navRow(`goal:open:${p[2]}`)])); }
      case 'close': return goalClose(env,ctx,p[2]);
      case 'del': { await dbDelete(env,'eb1_goals',`id=eq.${p[2]}&telegram_user_id=eq.${ctx.uid}`); return goalMenu(env,ctx); }
    }
  }

  if(area==='habit'){
    switch(p[1]){
      case 'menu': return habitMenu(env,ctx);
      case 'new': await setState(env,ctx.uid,'habit:new',{}); return send(env,ctx.chatId,'Введи название привычки:');
      case 'list': return habitList(env,ctx);
      case 'open': return habitOpen(env,ctx,p[2]);
      case 'log': return habitLog(env,ctx,p[2],true);
      case 'unlog': return habitLog(env,ctx,p[2],false);
      case 'tpl': return habitTemplates(env,ctx);
      case 'tplnew': { const tpl=await dbOne(env,'eb1_habit_templates',`id=eq.${p[2]}&select=title,type`); return finalizeHabit(env,ctx,{ title:tpl?.title||'Привычка', type:tpl?.type||'yesno' }); }
      case 'tpldel': { await dbDelete(env,'eb1_habit_templates',`id=eq.${p[2]}&telegram_user_id=eq.${ctx.uid}`); return habitTemplates(env,ctx); }
      case 'stats': return habitStatsScreen(env,ctx);
      case 'remind': await setState(env,ctx.uid,'habit:remind',{ id:+p[2] }); return send(env,ctx.chatId,'Во сколько напоминать (HH:MM)?');
      case 'del': { await dbDelete(env,'eb1_habit_logs',`habit_id=eq.${p[2]}`); await dbDelete(env,'eb1_habits',`id=eq.${p[2]}&telegram_user_id=eq.${ctx.uid}`); return habitMenu(env,ctx); }
    }
  }

  if(area==='prof'){
    switch(p[1]){
      case 'menu': return profMenu(env,ctx);
      case 'ach': return profAch(env,ctx);
      case 'rewards': return profRewards(env,ctx);
      case 'buy': return profBuy(env,ctx,p[2]);
      case 'rewnew': await setState(env,ctx.uid,'prof:rewnew',{}); return send(env,ctx.chatId,'Введи «Название цена», напр. «Пицца 1000»:');
      case 'rewdel': { await dbDelete(env,'eb1_rewards',`id=eq.${p[2]}&telegram_user_id=eq.${ctx.uid}`); return profRewards(env,ctx); }
      case 'act': return profActivity(env,ctx);
      case 'goals': return profGoals(env,ctx);
    }
  }

  if(area==='set'){
    switch(p[1]){
      case 'menu': return setMenu(env,ctx);
      case 'brieftoggle': { const u=await dbOne(env,'eb1_users',`telegram_user_id=eq.${ctx.uid}&select=briefing_enabled`); await dbUpdate(env,'eb1_users',`telegram_user_id=eq.${ctx.uid}`,{ briefing_enabled:!u.briefing_enabled }); return setMenu(env,ctx); }
      case 'weeklytoggle': { const u=await dbOne(env,'eb1_users',`telegram_user_id=eq.${ctx.uid}&select=weekly_enabled`); await dbUpdate(env,'eb1_users',`telegram_user_id=eq.${ctx.uid}`,{ weekly_enabled:!u.weekly_enabled }); return setMenu(env,ctx); }
      case 'brieftime': await setState(env,ctx.uid,'set:brieftime',{}); return send(env,ctx.chatId,'Введи время брифинга (HH:MM):');
      case 'tz': await setState(env,ctx.uid,'set:tz',{}); return send(env,ctx.chatId,'Введи часовой пояс (напр. Europe/Moscow):');
    }
  }

  if(area==='rem' && p[1]==='snooze'){ const r=await dbOne(env,'eb1_reminders',`id=eq.${p[2]}&select=label,kind,ref_id,telegram_user_id`); if(r){ await dbInsert(env,'eb1_reminders',{ telegram_user_id:r.telegram_user_id, kind:r.kind, ref_id:r.ref_id, label:r.label, fire_at:new Date(Date.now()+3600000).toISOString() }); } return answer(env,ctx.cbId,'⏰ Напомню через час'); }

  return answer(env,ctx.cbId);
}

// ═══ CRON ═══
async function runCron(env){
  const now=new Date();
  const due=await dbSelect(env,'eb1_reminders',`sent=eq.false&fire_at=lte.${now.toISOString()}&select=*&limit=100`);
  for(const r of (due||[])){
    try{
      let kb;
      if(r.kind==='task') kb=ikb([[btn('✅ Выполнено',`task:done:${r.ref_id}`),btn('⏰ Через час',`rem:snooze:${r.id}`)],[btn('📅 Перенести',`task:move:${r.ref_id}`),btn('🗑 Удалить',`task:delyes:${r.ref_id}`)]]);
      else if(r.kind==='payment') kb=ikb([[btn('✅ Оплачено',`fin:paypaid:${r.ref_id}`)],[btn('📅 Перенести',`fin:paymove:${r.ref_id}`),btn('🗑 Удалить',`fin:paydel:${r.ref_id}`)]]);
      await send(env,r.telegram_user_id,`🔔 <b>Напоминание</b>\n${esc(r.label)}`,kb);
      await dbUpdate(env,'eb1_reminders',`id=eq.${r.id}`,{ sent:true });
    }catch(e){ console.log('rem err',e.message); }
  }
  const users=await dbSelect(env,'eb1_users','select=*');
  for(const u of (users||[])){
    try{
      const np=nowParts(u.tz);
      if(u.briefing_enabled){ const [bh,bm]=(u.briefing_time||'08:00').split(':').map(Number); const target=bh*60+bm; if(np.minOfDay>=target&&np.minOfDay<target+5&&u.last_briefing_date!==np.dateStr){ await send(env,u.telegram_user_id,await buildBriefing(env,u.telegram_user_id,u.tz)); await dbUpdate(env,'eb1_users',`telegram_user_id=eq.${u.telegram_user_id}`,{ last_briefing_date:np.dateStr }); } }
      if(u.weekly_enabled&&np.dow===u.weekly_dow){ const [wh,wm]=(u.weekly_time||'19:00').split(':').map(Number); const target=wh*60+wm; if(np.minOfDay>=target&&np.minOfDay<target+5&&u.last_weekly_date!==np.dateStr){ await send(env,u.telegram_user_id,await buildWeekly(env,u.telegram_user_id,u.tz)); await dbUpdate(env,'eb1_users',`telegram_user_id=eq.${u.telegram_user_id}`,{ last_weekly_date:np.dateStr }); } }
      const habits=await dbSelect(env,'eb1_habits',`telegram_user_id=eq.${u.telegram_user_id}&reminder_time=not.is.null&select=id,title,reminder_time,target_time,type`);
      for(const h of (habits||[])){ const [hh,hm]=h.reminder_time.split(':').map(Number); const target=hh*60+hm; if(np.minOfDay>=target&&np.minOfDay<target+5){ const log=await dbOne(env,'eb1_habit_logs',`habit_id=eq.${h.id}&log_date=eq.${np.dateStr}&select=id`); if(!log){ const extra=h.type==='time'&&h.target_time?`\nЦель: до ${h.target_time}`:''; await send(env,u.telegram_user_id,`🔥 Привычка: <b>${esc(h.title)}</b>${extra}`,ikb([[btn('✅ Выполнено',`habit:log:${h.id}`),btn('❌ Пропущено',`habit:unlog:${h.id}`)]])); } } }
    }catch(e){ console.log('user cron err',u.telegram_user_id,e.message); }
  }
}

// ═══ ВХОДНАЯ ТОЧКА ═══
export default {
  async fetch(request,env,ctx){
    if(request.method!=='POST') return new Response('Electric Brain is running.');
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
    const c={ uid:from.id, chatId:msg.chat.id, user, msgId:null };
    const text=msg.text.trim();
    if(text.startsWith('/start')||text.startsWith('/menu')){ await clearState(env,from.id); return showMenu(env,c,user); }
    if(text.startsWith('/settings')) return setMenu(env,c);
    if(text.startsWith('/help')) return send(env,c.chatId,'ℹ️ <b>Электрический мозг</b>\n\nЯ помню твои обязательства: задачи, цели, привычки, финансы, платежи и напоминания.\n\n• Быстрый ввод финансов: «550 еда», «+3000 подработка».\n• Остальное — через кнопки меню.\n\n/menu — открыть меню', ikb([[btn('🏠 В меню','nav:menu')]]));
    return handleText(env,c,text);
  }
  if(update.callback_query){
    const cq=update.callback_query; const from=cq.from; const user=await ensureUser(env,from);
    const c={ uid:from.id, chatId:cq.message.chat.id, user, msgId:cq.message.message_id, cbId:cq.id };
    try{ await handleCallback(env,c,cq.data); }catch(e){ console.log('cb err',e.message,e.stack); }
    try{ await answer(env,cq.id); }catch{}
    return;
  }
}
