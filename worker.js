const _or = (v, f) => v ? v : f();
/* ЭЛЕКТРИЧЕСКИЙ МОЗГ v3 — Telegram-бот (Cloudflare Worker)
   Модель: временные / безвременные задачи + папки + заметки + фото.
   Без целей, типов, стадий, планов, геймификации. Финансы и брифинги сохранены.
   Стек: Telegram + Supabase (REST) + Workers (cron). Без ИИ. */

const PAGE = 8;
const CATEGORIES = [
// ── РАСХОДЫ ──
{
  name: 'Еда',
  emoji: '🍔',
  kind: 'expense',
  kw: ['еда', 'продукт', 'пятёроч', 'пятероч', 'магнит', 'перекрёсток', 'перекресток', 'ашан', 'лента', 'вкусвилл', 'дикси', 'окей', 'spar', 'спар', 'кафе', 'ресторан', 'столов', 'обед', 'ужин', 'завтрак', 'бургер', 'макдак', 'вкусно и точка', 'kfc', 'кфс', 'burger king', 'бургер кинг', 'додо', 'пицц', 'суши', 'роллы', 'шаурм', 'кофе', 'старбакс', 'шоколадниц', 'яндекс еда', 'деливери', 'delivery club', 'самокат продукт', 'кулинар', 'булочн', 'пекарн', 'фастфуд', 'вода', 'снек', 'чипсы']
}, {
  name: 'Транспорт',
  emoji: '🚕',
  kind: 'expense',
  kw: ['метро', 'автобус', 'трамвай', 'троллейбус', 'маршрутк', 'электричк', 'проезд', 'тройк', 'подорожник', 'такси', 'яндекс такси', 'убер', 'uber', 'ситимобил', 'bolt', 'болт', 'каршеринг', 'делимобиль', 'ситидрайв', 'бензин', 'заправк', 'азс', 'лукойл', 'роснефт', 'газпромнефт', 'парковк', 'whoosh', 'вуш', 'самокат аренд', 'ржд', 'аэроэкспресс', 'авиабилет', 'билет на поезд']
}, {
  name: 'Маркетплейсы',
  emoji: '📦',
  kind: 'expense',
  kw: ['озон', 'ozon', 'вайлдберриз', 'wildberries', 'вб', 'wb', 'яндекс маркет', 'market', 'алиэкспресс', 'aliexpress', 'али', 'сбермегамаркет', 'мегамаркет', 'lamoda', 'ламода', 'маркетплейс', 'пункт выдачи', 'пвз', 'заказ озон', 'заказ вб']
}, {
  name: 'Одежда',
  emoji: '👕',
  kind: 'expense',
  kw: ['одежд', 'обувь', 'кроссовк', 'кеды', 'джинс', 'футболк', 'платье', 'куртк', 'пальто', 'брюки', 'рубашк', 'свитер', 'бельё', 'белье', 'носки', 'zara', 'зара', 'h&m', 'uniqlo', 'юникло', 'bershka', 'спортмастер', 'decathlon', 'декатлон', 'adidas', 'адидас', 'nike', 'найк', 'puma', 'reebok', 'гардероб', 'шапк']
}, {
  name: 'Спорт',
  emoji: '🏋️',
  kind: 'expense',
  kw: ['абонемент', 'фитнес клуб', 'спортзал оплат', 'тренер оплат', 'протеин', 'спортпит', 'гейнер', 'гантел', 'коврик для йог', 'экипировк', 'секция оплат', 'бассейн абонемент', 'форма спортивн']
}, {
  name: 'Дом',
  emoji: '🏠',
  kind: 'expense',
  kw: ['мебель', 'икеа', 'ikea', 'хофф', 'hoff', 'леруа', 'leroy', 'оби', 'obi', 'посуд', 'бытовая техника', 'днс', 'dns', 'мвидео', 'эльдорадо', 'постельн', 'шторы', 'декор', 'обои', 'краск', 'инструмент', 'лампочк', 'бытовая хими', 'порошок', 'моющ', 'туалетн бумаг', 'салфетк', 'стиральн порошок']
}, {
  name: 'Здоровье',
  emoji: '💊',
  kind: 'expense',
  kw: ['аптек', 'лекарств', 'таблетк', 'витамин', 'бад', 'анализ оплат', 'врач оплат', 'клиник', 'стоматолог оплат', 'зубной оплат', 'массаж', 'очки', 'линзы', 'горздрав', 'ригла', 'озерки', 'медси', 'инвитро', 'гемотест', 'приём оплат']
}, {
  name: 'Связь',
  emoji: '📶',
  kind: 'expense',
  kw: ['связь', 'мобильн', 'мтс', 'mts', 'билайн', 'beeline', 'мегафон', 'megafon', 'теле2', 'tele2', 'йота', 'yota', 'симкарт', 'интернет домашн', 'ростелеком', 'дом ру', 'домру', 'роуминг', 'пополнить телефон']
}, {
  name: 'Развлечения',
  emoji: '🎮',
  kind: 'expense',
  kw: ['кино', 'билет в кино', 'театр', 'концерт', 'выставк', 'музей', 'клуб', 'бар', 'паб', 'боулинг', 'караоке', 'квест', 'аттракцион', 'развлечен', 'steam', 'playstation', 'xbox', 'настолк', 'бильярд', 'каток развлеч']
}, {
  name: 'Учёба',
  emoji: '📚',
  kind: 'expense',
  kw: ['курс оплат', 'обучени', 'учебник', 'книг', 'репетитор оплат', 'вебинар', 'интенсив', 'skillbox', 'скиллбокс', 'нетология', 'geekbrains', 'coursera', 'udemy', 'канцеляр', 'тетрад', 'распечатк', 'печать']
}, {
  name: 'Подарки',
  emoji: '🎁',
  kind: 'expense',
  kw: ['подарок', 'подарк', 'цвет', 'цветы', 'букет', 'открытк', 'сувенир', 'презент', 'подарочн']
}, {
  name: 'Другое',
  emoji: '•',
  kind: 'expense',
  kw: []
},
// ── ДОХОДЫ ──
{
  name: 'Зарплата',
  emoji: '💰',
  kind: 'income',
  kw: ['зарплат', 'зп', 'получк', 'оклад', 'аванс', 'зарплатн', 'выплата зп']
}, {
  name: 'Подработка',
  emoji: '💼',
  kind: 'income',
  kw: ['подработк', 'халтур', 'фриланс', 'шабашк', 'гонорар', 'чаевые', 'типс', 'заказ выполн']
}, {
  name: 'Подарок',
  emoji: '🎀',
  kind: 'income',
  kw: ['подарили', 'подарок деньг', 'дали денег', 'на др дали', 'презент деньг']
}, {
  name: 'Возврат долга',
  emoji: '↩️',
  kind: 'income',
  kw: ['вернул долг', 'вернули долг', 'возврат долг', 'отдали долг', 'долг вернули']
}, {
  name: 'Кэшбэк',
  emoji: '💳',
  kind: 'income',
  kw: ['кэшбэк', 'кешбэк', 'cashback', 'кэшбек', 'бонус', 'спасибо от сбера', 'баллы вернули']
}, {
  name: 'Инвестиции',
  emoji: '📈',
  kind: 'income',
  kw: ['дивиденд', 'купон', 'инвест доход', 'продал акци', 'прибыль с акци', 'проценты по вкладу', 'вклад процент']
}, {
  name: 'Случайный доход',
  emoji: '🍀',
  kind: 'income',
  kw: ['нашёл деньг', 'нашел деньг', 'выигрыш', 'приз', 'лотере', 'случайн доход']
}, {
  name: 'Другое',
  emoji: '•',
  kind: 'income',
  kw: []
}];
// ── Supabase ──
async function sb(env, method, path, {
  body,
  prefer
} = {}) {
  const res = await fetch("" + env.SUPABASE_URL + "/rest/v1/" + path + "", {
    method,
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: "Bearer " + env.SUPABASE_SERVICE_ROLE_KEY + "",
      'Content-Type': 'application/json',
      ...(prefer ? {
        Prefer: prefer
      } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error("SB " + method + " " + path + " " + res.status + ": " + t + "");
  }
  if (res.status === 204) return null;
  const txt = await res.text();
  return txt ? JSON.parse(txt) : null;
}
const dbSelect = (env, t, q = '') => sb(env, 'GET', "" + t + "?" + q + "");
const dbOne = async (env, t, q = '') => _or((await dbSelect(env, t, q))?.[0], () => null);
const dbInsert = (env, t, row) => sb(env, 'POST', t, {
  body: Array.isArray(row) ? row : [row],
  prefer: 'return=representation'
});
const dbInsertOne = async (env, t, row) => _or((await dbInsert(env, t, row))?.[0], () => null);
const dbUpdate = (env, t, q, patch) => sb(env, 'PATCH', "" + t + "?" + q + "", {
  body: patch,
  prefer: 'return=representation'
});
const dbDelete = (env, t, q) => sb(env, 'DELETE', "" + t + "?" + q + "");

// ── Telegram ──
async function tg(env, method, payload) {
  const res = await fetch("https://api.telegram.org/bot" + env.TELEGRAM_BOT_TOKEN + "/" + method + "", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  return res.json();
}
const send = (env, chatId, text, kb) => tg(env, 'sendMessage', {
  chat_id: chatId,
  text,
  parse_mode: 'HTML',
  disable_web_page_preview: true,
  ...(kb ? {
    reply_markup: kb
  } : {})
});
const edit = (env, chatId, msgId, text, kb) => tg(env, 'editMessageText', {
  chat_id: chatId,
  message_id: msgId,
  text,
  parse_mode: 'HTML',
  disable_web_page_preview: true,
  ...(kb ? {
    reply_markup: kb
  } : {})
});
const answer = (env, cbId, text) => tg(env, 'answerCallbackQuery', {
  callback_query_id: cbId,
  ...(text ? {
    text
  } : {})
});
const sendPhoto = (env, chatId, url, caption, kb) => tg(env, 'sendPhoto', {
  chat_id: chatId,
  photo: url,
  caption: _or(caption, () => ''),
  parse_mode: 'HTML',
  ...(kb ? {
    reply_markup: kb
  } : {})
});
async function screen(env, ctx, text, kb) {
  if (ctx.msgId) {
    const r = await edit(env, ctx.chatId, ctx.msgId, text, kb);
    if (r && r.ok === false) await send(env, ctx.chatId, text, kb);
  } else await send(env, ctx.chatId, text, kb);
}
const btn = (text, data) => ({
  text,
  callback_data: data
});
const ikb = rows => ({
  inline_keyboard: rows
});
const navRow = backData => [btn('⬅️ Назад', _or(backData, () => 'nav:menu')), btn('🏠 Меню', 'nav:menu')];
function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
const money = n => "" + Math.round(Number(n)).toLocaleString('ru-RU') + " ₽";

// ── Время / TZ ──
function tzOffsetMs(date, tz) {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  const p = dtf.formatToParts(date).reduce((a, x) => (a[x.type] = x.value, a), {});
  return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second) - date.getTime();
}
function localToUtc(y, mo, d, h, mi, tz) {
  const guess = Date.UTC(y, mo - 1, d, h, mi, 0);
  return new Date(guess - tzOffsetMs(new Date(guess), tz));
}
function nowParts(tz) {
  const p = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short'
  }).formatToParts(new Date()).reduce((a, x) => (a[x.type] = x.value, a), {});
  const dowMap = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6
  };
  return {
    y: +p.year,
    mo: +p.month,
    d: +p.day,
    h: +p.hour,
    mi: +p.minute,
    dow: dowMap[p.weekday],
    dateStr: "" + p.year + "-" + p.month + "-" + p.day + "",
    hhmm: "" + p.hour + ":" + p.minute + "",
    minOfDay: +p.hour * 60 + +p.minute
  };
}
const RU_MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const RU_DOW = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
function fmtDate(ds) {
  if (!ds) return 'без даты';
  const [y, m, d] = ds.split('-').map(Number);
  return "" + d + " " + RU_MONTHS[m - 1] + "";
}
function fmtShort(ds) {
  const [y, m, d] = ds.split('-').map(Number);
  return "" + String(d).padStart(2, '0') + "." + String(m).padStart(2, '0') + "";
}
function addDaysStr(ds, n) {
  const [y, m, d] = ds.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}
function dowOf(ds) {
  const [y, m, d] = ds.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}
function buildCalendar(y, mo, prefix, extraRow) {
  const first = new Date(Date.UTC(y, mo - 1, 1));
  const startDow = (first.getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(y, mo, 0)).getUTCDate();
  const rows = [];
  rows.push([btn('◀', "" + prefix + ":nav:" + y + ":" + mo + ":-1"), btn("" + RU_MONTHS[mo - 1] + " " + y + "", 'noop'), btn('▶', "" + prefix + ":nav:" + y + ":" + mo + ":1")]);
  rows.push(['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(w => btn(w, 'noop')));
  let week = [];
  for (let i = 0; i < startDow; i++) week.push(btn(' ', 'noop'));
  for (let d = 1; d <= days; d++) {
    const ds = "" + y + "-" + String(mo).padStart(2, '0') + "-" + String(d).padStart(2, '0') + "";
    week.push(btn(String(d), "" + prefix + ":pick:" + ds + ""));
    if (week.length === 7) {
      rows.push(week);
      week = [];
    }
  }
  if (week.length) {
    while (week.length < 7) week.push(btn(' ', 'noop'));
    rows.push(week);
  }
  if (extraRow) rows.push(extraRow);
  return ikb(rows);
}

// ── State ──
async function getState(env, uid) {
  const r = await dbOne(env, 'eb1_states', "telegram_user_id=eq." + uid + "");
  return _or(r, () => ({
    telegram_user_id: uid,
    state: null,
    data: {}
  }));
}
async function setState(env, uid, state, data = {}) {
  await sb(env, 'POST', 'eb1_states', {
    body: [{
      telegram_user_id: uid,
      state,
      data,
      updated_at: new Date().toISOString()
    }],
    prefer: 'resolution=merge-duplicates'
  });
}
async function clearState(env, uid) {
  await dbUpdate(env, 'eb1_states', "telegram_user_id=eq." + uid + "", {
    state: null,
    data: {}
  });
}

// ── Пользователь (без разрушающего пересева; категории сеем только если их нет) ──
async function ensureUser(env, from) {
  let u = await dbOne(env, 'eb1_users', "telegram_user_id=eq." + from.id + "");
  if (!u) u = await dbInsertOne(env, 'eb1_users', {
    telegram_user_id: from.id,
    username: _or(from.username, () => ''),
    first_name: _or(from.first_name, () => ''),
    tz: _or(env.DEFAULT_TIMEZONE, () => 'Europe/Moscow'),
    briefing_time: '07:00'
  });
  const cats = await dbSelect(env, 'eb1_finance_categories', "telegram_user_id=eq." + from.id + "&select=id&limit=1");
  if (_or(!cats, () => !cats.length)) {
    for (const c of CATEGORIES) {
      const cat = await dbInsertOne(env, 'eb1_finance_categories', {
        telegram_user_id: u.telegram_user_id,
        name: c.name,
        emoji: c.emoji,
        kind: c.kind
      });
      if (cat && c.kw && c.kw.length) await dbInsert(env, 'eb1_finance_category_keywords', c.kw.map(k => ({
        telegram_user_id: u.telegram_user_id,
        category_id: cat.id,
        keyword: k
      })));
    }
  }
  return u;
}

// ── Сопоставление по словам/стеммам ──
function tokenize(s) {
  return _or(s, () => '').toLowerCase().replace(/ё/g, 'е').split(/[^a-zа-я0-9]+/i).filter(Boolean);
}
function kwHit(text, toks, kw) {
  const k = _or(kw, () => '').toLowerCase().replace(/ё/g, 'е');
  if (!k) return false;
  if (k.indexOf(' ') !== -1) return text.indexOf(k) !== -1;
  for (const tk of toks) {
    if (tk.indexOf(k) === 0) return true;
  }
  return false;
}
async function computeBalance(env, uid) {
  const u = await dbOne(env, 'eb1_users', "telegram_user_id=eq." + uid + "&select=start_balance");
  const txs = await dbSelect(env, 'eb1_finance_transactions', "telegram_user_id=eq." + uid + "&select=amount,type");
  const adj = await dbSelect(env, 'eb1_balance_adjustments', "telegram_user_id=eq." + uid + "&select=amount");
  let bal = Number(_or(u?.start_balance, () => 0));
  for (const x of _or(txs, () => [])) bal += x.type === 'income' ? Number(x.amount) : -Number(x.amount);
  for (const a of _or(adj, () => [])) bal += Number(a.amount);
  return bal;
}
async function sumTx(env, uid, type, fromDate, toDate) {
  let q = "telegram_user_id=eq." + uid + "&type=eq." + type + "&select=amount,category_id,description,tx_date";
  if (fromDate) q += "&tx_date=gte." + fromDate + "";
  if (toDate) q += "&tx_date=lte." + toDate + "";
  return _or(await dbSelect(env, 'eb1_finance_transactions', q), () => []);
}
async function categorize(env, uid, words, kind) {
  const cats = await dbSelect(env, 'eb1_finance_categories', "telegram_user_id=eq." + uid + "&select=id,kind,name");
  const kws = await dbSelect(env, 'eb1_finance_category_keywords', "telegram_user_id=eq." + uid + "&select=category_id,keyword");
  const kindOf = Object.fromEntries(_or(cats, () => []).map(c => [c.id, c.kind]));
  const joined = words.join(' ');
  const text = joined.toLowerCase().replace(/ё/g, 'е');
  const toks = tokenize(joined);
  for (const k of _or(kws, () => [])) if (kindOf[k.category_id] === kind && kwHit(text, toks, k.keyword)) return k.category_id;
  const other = _or(cats, () => []).find(c => c.kind === kind && c.name === 'Другое');
  return other ? other.id : null;
}
async function parseQuickFinance(env, uid, raw) {
  const t = raw.trim();
  const m = t.match(/^([+-]?)(\d+(?:[.,]\d+)?)\s*(.*)$/);
  if (!m) return null;
  const sign = m[1];
  const amount = parseFloat(m[2].replace(',', '.'));
  if (_or(!isFinite(amount), () => amount <= 0)) return null;
  const rest = _or(m[3], () => '').trim();
  const words = rest ? rest.split(/\s+/) : [];
  const kind = sign === '+' ? 'income' : 'expense';
  const categoryId = words.length ? await categorize(env, uid, words, kind) : await categorize(env, uid, [], kind);
  return {
    amount,
    type: kind,
    categoryId,
    description: rest,
    hasWords: words.length > 0
  };
}
function chartUrl(config, w = 640, h = 420) {
  return "https://quickchart.io/chart?w=" + w + "&h=" + h + "&bkg=white&c=" + encodeURIComponent(JSON.stringify(config)) + "";
}
function pieChart(title, labels, values) {
  return chartUrl({
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: values
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: title
        }
      }
    }
  });
}
function lineChart(title, labels, values, label) {
  return chartUrl({
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: _or(label, () => title),
        data: values,
        fill: false,
        tension: 0.3
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: title
        }
      }
    }
  });
}

// ── Напоминания ──
const OFFSETS = {
  '1w': 7 * 24 * 60,
  '3d': 3 * 24 * 60,
  '1d': 24 * 60,
  '12h': 12 * 60,
  '3h': 3 * 60,
  '1h': 60,
  'at': 0
};
async function scheduleEventReminders(env, uid, kind, refId, label, fireBaseUtc, picks) {
  const rows = [];
  for (const key of picks) {
    const off = OFFSETS[key];
    if (off == null) continue;
    const at = new Date(fireBaseUtc.getTime() - off * 60000);
    if (at.getTime() <= Date.now()) continue;
    rows.push({
      telegram_user_id: uid,
      kind,
      ref_id: refId,
      fire_at: at.toISOString(),
      label
    });
  }
  if (rows.length) await dbInsert(env, 'eb1_reminders', rows);
}
function reminderPicksKeyboard(picks, hoursAway, prefix) {
  const opts = [['1w', 'За неделю', 7 * 24], ['3d', 'За 3 дня', 3 * 24], ['1d', 'За сутки', 24], ['12h', 'За 12 часов', 12], ['3h', 'За 3 часа', 3], ['1h', 'За час', 1], ['at', 'В момент', 0]];
  const rows = [];
  for (const [key, lbl, minH] of opts) {
    if (hoursAway != null && hoursAway <= minH && key !== 'at') continue;
    const on = picks.includes(key);
    rows.push([btn("" + (on ? '☑' : '☐') + " " + lbl + "", "" + prefix + ":rt:" + key + "")]);
  }
  rows.push([btn('✅ Готово', "" + prefix + ":rdone")]);
  return rows;
}
function fmtTs(date, tz) {
  const p = new Intl.DateTimeFormat('ru-RU', {
    timeZone: tz,
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).formatToParts(date).reduce((a, x) => (a[x.type] = x.value, a), {});
  return "" + p.day + "." + p.month + " " + p.hour + ":" + p.minute + "";
}

// ═══ ГЛАВНЫЙ ЭКРАН ═══
function mainMenuKb() {
  return ikb([[btn('⏰ Временные задачи', 'tt:menu')], [btn('♾️ Безвременные задачи', 'bz:menu')], [btn('💰 Финансы', 'fin:menu'), btn('⚙️ Настройки', 'set:menu')], [btn('❓ Как пользоваться', 'help:show')]]);
}
function taskDeadlineUtc(x, tz) {
  if (!x.due_date) return null;
  const [y, mo, d] = x.due_date.split('-').map(Number);
  const h = x.due_hour != null ? x.due_hour : 23;
  const mi = x.due_hour != null ? 0 : 59;
  return localToUtc(y, mo, d, h, mi, tz);
}
async function buildHome(env, uid, tz) {
  const today = nowParts(tz).dateStr;
  const end = addDaysStr(today, 7);
  const now = Date.now();
  const rows = await dbSelect(env, 'eb1_tasks', "telegram_user_id=eq." + uid + "&kind=eq.timed&archived=eq.false&status=neq.done&due_date=gte." + today + "&due_date=lte." + end + "&select=id,title,due_date,due_hour&order=due_date.asc,due_hour.asc");
  const fut = _or(rows, () => []).filter(x => {
    const dl = taskDeadlineUtc(x, tz);
    return dl && dl.getTime() >= now;
  });
  let t = '📋 <b>Ближайшие задачи (7 дней)</b>\n';
  const byDay = {};
  for (const x of fut) (byDay[x.due_date] = _or(byDay[x.due_date], () => [])).push(x);
  const days = Object.keys(byDay).sort();
  if (!days.length) t += '\n<i>Нет ближайших задач. Напиши текст — создам задачу.</i>';
  for (const d of days) {
    const label = d === today ? 'Сегодня' : d === addDaysStr(today, 1) ? 'Завтра' : fmtDate(d);
    t += "\n<b>" + label + "</b>\n";
    for (const x of byDay[d]) t += "" + (x.due_hour != null ? String(x.due_hour).padStart(2, '0') + ':00' : 'Без времени —') + " " + esc(x.title) + "\n";
  }
  return {
    text: t,
    kb: mainMenuKb()
  };
}
async function showMenu(env, ctx) {
  const {
    text,
    kb
  } = await buildHome(env, ctx.uid, ctx.user.tz);
  await screen(env, ctx, text, kb);
}
function timeStr(x) {
  return x.due_hour != null ? String(x.due_hour).padStart(2, '0') + ':00' : 'без времени';
}

// ═══ ВРЕМЕННЫЕ ЗАДАЧИ ═══
async function timedMenu(env, ctx) {
  const now = Date.now();
  const all = await dbSelect(env, 'eb1_tasks', "telegram_user_id=eq." + ctx.uid + "&kind=eq.timed&archived=eq.false&status=neq.done&select=id,title,due_date,due_hour,folder_id&order=due_date.asc,due_hour.asc");
  const fut = _or(all, () => []).filter(x => {
    const dl = taskDeadlineUtc(x, ctx.user.tz);
    return dl && dl.getTime() >= now;
  });
  const overdueN = _or(all, () => []).length - fut.length;
  const folders = await dbSelect(env, 'eb1_folders', "telegram_user_id=eq." + ctx.uid + "&kind=eq.timed&select=id,name&order=name.asc");
  const fmap = Object.fromEntries(_or(folders, () => []).map(f => [f.id, f.name]));
  let t = '⏰ <b>Временные задачи</b>\n';
  const kb = [];
  const noF = fut.filter(x => !x.folder_id);
  t += '\n<b>Без папки:</b>\n';
  if (noF.length) {
    for (const x of noF) {
      t += "" + (x.due_date ? fmtShort(x.due_date) : '') + " " + timeStr(x) + " " + esc(x.title) + "\n";
      kb.push([btn(("" + fmtShort(x.due_date) + " " + esc(x.title) + "").slice(0, 55), "task:open:" + x.id + "")]);
    }
  } else t += '<i>пусто</i>\n';
  for (const f of _or(folders, () => [])) {
    const inF = fut.filter(x => x.folder_id === f.id);
    if (!inF.length) continue;
    t += "\n📁 <b>" + esc(f.name) + ":</b>\n";
    for (const x of inF) {
      t += "" + fmtShort(x.due_date) + " " + timeStr(x) + " " + esc(x.title) + "\n";
      kb.push([btn(("📁 " + fmtShort(x.due_date) + " " + esc(x.title) + "").slice(0, 55), "task:open:" + x.id + "")]);
    }
  }
  kb.push([btn("📛 Просроченные (" + overdueN + ")", 'tt:overdue'), btn('🗂 Папки', 'fold:m:timed')]);
  kb.push([btn('🏠 Меню', 'nav:menu')]);
  await screen(env, ctx, t, ikb(kb));
}
async function timedOverdue(env, ctx) {
  const now = Date.now();
  const today = nowParts(ctx.user.tz).dateStr;
  const all = await dbSelect(env, 'eb1_tasks', "telegram_user_id=eq." + ctx.uid + "&kind=eq.timed&archived=eq.false&status=neq.done&due_date=lte." + today + "&select=id,title,due_date,due_hour&order=due_date.asc,due_hour.asc");
  const od = _or(all, () => []).filter(x => {
    const dl = taskDeadlineUtc(x, ctx.user.tz);
    return dl && dl.getTime() < now;
  });
  let t = '📛 <b>Просроченные задачи</b>\n\n';
  const kb = [];
  if (!od.length) t += '<i>нет</i>';else for (const x of od) {
    t += "" + fmtShort(x.due_date) + " " + timeStr(x) + " " + esc(x.title) + "\n";
    kb.push([btn(("" + fmtShort(x.due_date) + " " + esc(x.title) + "").slice(0, 55), "task:open:" + x.id + "")]);
  }
  kb.push([btn('⬅️ Назад', 'tt:menu'), btn('🏠 Меню', 'nav:menu')]);
  await screen(env, ctx, t, ikb(kb));
}

// ═══ БЕЗВРЕМЕННЫЕ ЗАДАЧИ ═══
async function timelessMenu(env, ctx) {
  const all = await dbSelect(env, 'eb1_tasks', "telegram_user_id=eq." + ctx.uid + "&kind=eq.timeless&archived=eq.false&status=neq.done&select=id,title,folder_id&order=created_at.desc");
  const folders = await dbSelect(env, 'eb1_folders', "telegram_user_id=eq." + ctx.uid + "&kind=eq.timeless&select=id,name&order=name.asc");
  let t = '♾️ <b>Безвременные задачи</b>\n';
  const kb = [];
  const noF = _or(all, () => []).filter(x => !x.folder_id);
  t += '\n<b>Без папки:</b>\n';
  if (noF.length) {
    for (const x of noF) {
      t += "• " + esc(x.title) + "\n";
      kb.push([btn(esc(x.title).slice(0, 55), "task:open:" + x.id + "")]);
    }
  } else t += '<i>пусто</i>\n';
  for (const f of _or(folders, () => [])) {
    const inF = _or(all, () => []).filter(x => x.folder_id === f.id);
    if (!inF.length) continue;
    t += "\n📁 <b>" + esc(f.name) + ":</b>\n";
    for (const x of inF) {
      t += "• " + esc(x.title) + "\n";
      kb.push([btn(("📁 " + esc(x.title) + "").slice(0, 55), "task:open:" + x.id + "")]);
    }
  }
  kb.push([btn('🗂 Папки', 'fold:m:timeless'), btn('🏠 Меню', 'nav:menu')]);
  await screen(env, ctx, t, ikb(kb));
}

// ═══ ПАПКИ ═══
async function folderManage(env, ctx, kind) {
  const fs = await dbSelect(env, 'eb1_folders', "telegram_user_id=eq." + ctx.uid + "&kind=eq." + kind + "&select=id,name&order=name.asc");
  let t = "🗂 <b>Папки</b> (" + (kind === 'timed' ? 'временные' : 'безвременные') + ")\n\n";
  const kb = [];
  if (fs && fs.length) {
    for (const f of fs) {
      t += "📁 " + esc(f.name) + "\n";
      kb.push([btn('✏️ ' + f.name.slice(0, 20), "fold:ren:" + kind + ":" + f.id + ""), btn('🗑', "fold:del:" + kind + ":" + f.id + "")]);
    }
  } else t += '<i>нет папок</i>';
  kb.push([btn('➕ Создать папку', "fold:new:" + kind + "")]);
  kb.push([btn('⬅️ Назад', kind === 'timed' ? 'tt:menu' : 'bz:menu')]);
  await screen(env, ctx, t, ikb(kb));
}

// ═══ КАРТОЧКА ЗАДАЧИ ═══
async function taskOpen(env, ctx, id) {
  const x = await dbOne(env, 'eb1_tasks', "telegram_user_id=eq." + ctx.uid + "&id=eq." + id + "");
  if (!x) return showMenu(env, ctx);
  const folder = x.folder_id ? await dbOne(env, 'eb1_folders', "id=eq." + x.folder_id + "&select=name") : null;
  const notes = await dbSelect(env, 'eb1_task_notes', "task_id=eq." + id + "&select=text,created_at&order=created_at.asc");
  const photos = await dbSelect(env, 'eb1_task_photos', "task_id=eq." + id + "&select=id,file_id&order=id.asc");
  if (photos && photos.length) {
    try {
      if (photos.length === 1) await sendPhoto(env, ctx.chatId, photos[0].file_id);else await tg(env, 'sendMediaGroup', {
        chat_id: ctx.chatId,
        media: photos.slice(0, 10).map(p => ({
          type: 'photo',
          media: p.file_id
        }))
      });
    } catch (e) {
      console.log('photo show', e.message);
    }
  }
  let t = "<b>" + esc(x.title) + "</b>\n";
  t += "Тип: " + (x.kind === 'timed' ? 'временная' : 'безвременная') + "\n";
  t += "Папка: " + (folder ? esc(folder.name) : 'без папки') + "\n";
  if (x.kind === 'timed') {
    t += "Дата: " + (x.due_date ? fmtDate(x.due_date) : '—') + "\n";
    t += "Время: " + (x.due_hour != null ? String(x.due_hour).padStart(2, '0') + ':00' : '—') + "\n";
  }
  t += '\n<b>История заметок</b>\n';
  if (notes && notes.length) for (const n of notes) t += "" + fmtTs(new Date(n.created_at), ctx.user.tz) + "\n" + esc(n.text) + "\n\n";else t += '<i>пока нет</i>\n';
  const kb = [];
  kb.push([btn('✅ Выполнено', "task:done:" + id + ""), btn('📝 Заметка', "task:note:" + id + "")]);
  if (x.kind === 'timed') kb.push([btn('📅 Перенести', "task:move:" + id + ""), btn('🔔 Напоминания', "task:rem:" + id + "")]);
  const prow = [btn('📷 Добавить фото', "task:photo:" + id + "")];
  if (photos && photos.length) prow.push(btn("🗑 Фото (" + photos.length + ")", "task:photos:" + id + ""));
  kb.push(prow);
  kb.push([btn('✏️ Изменить', "task:edit:" + id + ""), btn('🗑 Удалить', "task:del:" + id + "")]);
  kb.push(navRow('nav:menu'));
  await screen(env, ctx, t, ikb(kb));
}
async function taskDone(env, ctx, id) {
  await dbUpdate(env, 'eb1_tasks', "id=eq." + id + "&telegram_user_id=eq." + ctx.uid + "", {
    status: 'done',
    archived: true,
    done_at: new Date().toISOString()
  });
  await dbDelete(env, 'eb1_reminders', "kind=eq.task&ref_id=eq." + id + "&sent=eq.false");
  await answer(env, ctx.cbId, '✅ Готово');
  return showMenu(env, ctx);
}
async function taskPhotosManage(env, ctx, id) {
  const photos = await dbSelect(env, 'eb1_task_photos', "task_id=eq." + id + "&select=id&order=id.asc");
  const kb = [];
  _or(photos, () => []).forEach((p, i) => kb.push([btn("🗑 Удалить фото " + (i + 1) + "", "task:photodel:" + p.id + ":" + id + "")]));
  kb.push([btn('📷 Добавить ещё', "task:photo:" + id + "")]);
  kb.push([btn('⬅️ К задаче', "task:open:" + id + "")]);
  await screen(env, ctx, "📷 Фото: " + _or(photos, () => []).length + "/10\nУдаление — кнопкой ниже. Замена = удалить и добавить заново.", ikb(kb));
}

// ═══ МАСТЕР СОЗДАНИЯ ═══
async function taskWizardStart(env, ctx, title) {
  await setState(env, ctx.uid, 'w:kind', {
    title
  });
  await send(env, ctx.chatId, "Новая задача: <b>" + esc(title) + "</b>\nЭто временная или безвременная задача?", ikb([[btn('⏰ Временная', 'w:kind:timed'), btn('♾️ Безвременная', 'w:kind:timeless')], [btn('Отмена', 'nav:menu')]]));
}
async function wAskDate(env, ctx, data) {
  await setState(env, ctx.uid, 'w:date', data);
  const np = nowParts(ctx.user.tz);
  const cal = buildCalendar(np.y, np.mo, 'w:cal', [btn('Сегодня', 'w:date:' + np.dateStr), btn('Завтра', 'w:date:' + addDaysStr(np.dateStr, 1))]);
  cal.inline_keyboard.push([btn('🏠 В меню', 'nav:menu')]);
  await send(env, ctx.chatId, 'До какого числа нужно выполнить?', cal);
}
async function wAskTime(env, ctx, data) {
  await setState(env, ctx.uid, 'w:time', data);
  const rows = [];
  let r = [];
  for (let h = 6; h <= 23; h++) {
    r.push(btn("" + String(h).padStart(2, '0') + ":00", "w:time:" + h + ""));
    if (r.length === 4) {
      rows.push(r);
      r = [];
    }
  }
  if (r.length) rows.push(r);
  rows.push([btn('Без времени', 'w:time:none')]);
  rows.push([btn('⬅️ Назад', 'w:back:date'), btn('🏠 В меню', 'nav:menu')]);
  await send(env, ctx.chatId, 'Время:', ikb(rows));
}
async function wAskReminders(env, ctx, data) {
  const u = await dbOne(env, 'eb1_users', "telegram_user_id=eq." + ctx.uid + "&select=default_reminders");
  data.picks = _or(data.picks, () => u && u.default_reminders ? u.default_reminders.split(',') : ['1d', 'at']);
  await setState(env, ctx.uid, 'w:rem', data);
  let hoursAway = null;
  if (data.due_date) {
    const fire = taskDeadlineUtc({
      due_date: data.due_date,
      due_hour: data.due_hour
    }, ctx.user.tz);
    hoursAway = (fire.getTime() - Date.now()) / 3600000;
  }
  const rk = reminderPicksKeyboard(data.picks, hoursAway, 'w');
  rk.push([btn('⬅️ Назад', 'w:back:time'), btn('🏠 В меню', 'nav:menu')]);
  await send(env, ctx.chatId, '🔔 Напоминания:', ikb(rk));
}
async function wAskFolder(env, ctx, data) {
  await setState(env, ctx.uid, 'w:folder', data);
  await send(env, ctx.chatId, 'Поместить в папку?', ikb([[btn('Да', 'w:fyes'), btn('Нет', 'w:fno')], [btn('⬅️ Назад', 'w:fback'), btn('🏠 В меню', 'nav:menu')]]));
}
async function wFolderList(env, ctx, data) {
  const fs = await dbSelect(env, 'eb1_folders', "telegram_user_id=eq." + ctx.uid + "&kind=eq." + data.kind + "&select=id,name&order=name.asc");
  const kb = _or(fs, () => []).map(f => [btn('📁 ' + f.name, 'w:fset:' + f.id)]);
  kb.push([btn('➕ Новая папка', 'w:fnew')]);
  kb.push([btn('⬅️ Назад', 'w:fyesback')]);
  await screen(env, ctx, 'Выбери папку:', ikb(kb));
}
async function finalizeTask(env, ctx, data, folderId) {
  const timed = data.kind === 'timed';
  const row = {
    telegram_user_id: ctx.uid,
    kind: data.kind,
    title: _or(data.title, () => 'Задача'),
    due_date: timed ? _or(data.due_date, () => null) : null,
    due_hour: timed ? _or(data.due_hour === 0, () => data.due_hour) ? data.due_hour : null : null,
    folder_id: _or(folderId, () => null),
    status: 'active',
    archived: false
  };
  const task = await dbInsertOne(env, 'eb1_tasks', row);
  if (timed && row.due_date) {
    const fire = taskDeadlineUtc(row, ctx.user.tz);
    if (fire) await scheduleEventReminders(env, ctx.uid, 'task', task.id, row.title, fire, _or(data.picks, () => ['at']));
  }
  await clearState(env, ctx.uid);
  await send(env, ctx.chatId, '✅ Задача создана.', ikb([[btn('Открыть', "task:open:" + task.id + "")], [btn('🏠 Меню', 'nav:menu')]]));
}

// ═══ ПЕРЕНОС / ИЗМЕНЕНИЕ / НАПОМИНАНИЯ ═══
async function taskMove(env, ctx, id) {
  const np = nowParts(ctx.user.tz);
  await setState(env, ctx.uid, 'task:moving', {
    id: +id
  });
  await screen(env, ctx, 'На какую дату перенести?', buildCalendar(np.y, np.mo, 'task:movecal', [btn('⬅️ Отмена', "task:open:" + id + "")]));
}
async function taskEdit(env, ctx, id) {
  const x = await dbOne(env, 'eb1_tasks', "id=eq." + id + "&select=kind");
  const kb = [[btn('Название', "task:ren:" + id + "")]];
  if (x && x.kind === 'timed') kb.push([btn('Дата и время', "task:redate:" + id + ""), btn('Сделать безвременной', "task:settype:timeless:" + id + "")]);else kb.push([btn('Сделать временной', "task:settype:timed:" + id + "")]);
  kb.push([btn('Папка', "task:folder:" + id + "")]);
  kb.push(navRow("task:open:" + id + ""));
  await screen(env, ctx, '✏️ <b>Изменить</b>', ikb(kb));
}
async function taskFolderPick(env, ctx, id) {
  const x = await dbOne(env, 'eb1_tasks', "id=eq." + id + "&select=kind");
  if (!x) return showMenu(env, ctx);
  const fs = await dbSelect(env, 'eb1_folders', "telegram_user_id=eq." + ctx.uid + "&kind=eq." + x.kind + "&select=id,name&order=name.asc");
  const kb = [[btn('🚫 Без папки', "task:setfolder:0:" + id + "")]];
  _or(fs, () => []).forEach(f => kb.push([btn('📁 ' + f.name, "task:setfolder:" + f.id + ":" + id + "")]));
  kb.push([btn('⬅️ Назад', "task:edit:" + id + "")]);
  await screen(env, ctx, 'Выбери папку:', ikb(kb));
}
async function taskReminders(env, ctx, id) {
  const x = await dbOne(env, 'eb1_tasks', "telegram_user_id=eq." + ctx.uid + "&id=eq." + id + "");
  if (!x) return showMenu(env, ctx);
  if (_or(x.kind !== 'timed', () => !x.due_date)) {
    await answer(env, ctx.cbId, 'Напоминания только у временных задач с датой');
    return;
  }
  await setState(env, ctx.uid, 'task:remedit', {
    id: +id,
    picks: ['at'],
    due_date: x.due_date,
    due_hour: x.due_hour
  });
  const fire = taskDeadlineUtc(x, ctx.user.tz);
  const hoursAway = (fire.getTime() - Date.now()) / 3600000;
  const rk = reminderPicksKeyboard(['at'], hoursAway, 'tre');
  rk.push([btn('🕒 Своё время (ЧЧ:ММ)', 'tre:custom')]);
  rk.push([btn('⬅️ К задаче', "task:open:" + id + "")]);
  await screen(env, ctx, '🔔 Напоминания (перезапишут текущие):', ikb(rk));
}
function finMenuKb() {
  return ikb([[btn('➕ Добавить (доход)', 'fin:add:income'), btn('➖ Убрать (расход)', 'fin:add:expense')], [btn('💼 Баланс', 'fin:bal'), btn('📊 Аналитика', 'fin:an:today')], [btn('🐷 Сбережения', 'fin:save'), btn('🗂 Категории', 'fin:cat')], navRow('nav:menu')]);
}
async function finMenu(env, ctx) {
  const bal = await computeBalance(env, ctx.uid);
  const today = nowParts(ctx.user.tz).dateStr;
  const spent = (await sumTx(env, ctx.uid, 'expense', today, today)).reduce((s, x) => s + +x.amount, 0);
  await screen(env, ctx, "💰 <b>Финансы</b>\nБаланс: <b>" + money(bal) + "</b>\nСегодня расходы: " + money(spent) + "\n\nБыстрый ввод: «550 еда», «1000 пятёрочка», «+3000 зарплата».", finMenuKb());
}
async function finAddStart(env, ctx, kind) {
  await setState(env, ctx.uid, 'fin:amount', {
    type: kind
  });
  await screen(env, ctx, "" + (kind === 'income' ? '➕ Доход' : '➖ Расход') + "\nВведи сумму (можно с описанием: «550 пятёрочка»):", ikb([navRow('fin:menu')]));
}
async function finConfirm(env, ctx, parsed) {
  const cat = parsed.categoryId ? await dbOne(env, 'eb1_finance_categories', "id=eq." + parsed.categoryId + "&select=name,emoji") : null;
  const kind = _or(parsed.type, () => 'expense');
  await setState(env, ctx.uid, 'fin:confirm', {
    ...parsed,
    type: kind
  });
  let t = "<b>" + (kind === 'income' ? 'Доход' : 'Расход') + "</b>\nСумма: " + money(parsed.amount) + "\nКатегория: " + (cat ? "" + cat.emoji + " " + cat.name + "" : '—') + "\n";
  if (parsed.description) t += "Описание: " + esc(parsed.description) + "\n";
  t += "Дата: сегодня\n\nЗаписать?";
  await send(env, ctx.chatId, t, ikb([[btn('✅ Записать', 'fin:save_tx'), btn('✏️ Категория', 'fin:pick_cat')], [btn('🔁 Тип', 'fin:flip'), btn('❌ Отмена', 'fin:cancel')]]));
}
async function finSaveTx(env, ctx) {
  const st = await getState(env, ctx.uid);
  const d = st.data;
  if (!d?.amount) return finMenu(env, ctx);
  const today = nowParts(ctx.user.tz).dateStr;
  await dbInsert(env, 'eb1_finance_transactions', {
    telegram_user_id: ctx.uid,
    amount: d.amount,
    type: _or(d.type, () => 'expense'),
    category_id: _or(d.categoryId, () => null),
    description: _or(d.description, () => ''),
    tx_date: today
  });
  await clearState(env, ctx.uid);
  const bal = await computeBalance(env, ctx.uid);
  await send(env, ctx.chatId, "✅ Записано: " + money(d.amount) + "\nБаланс: " + money(bal) + "", finMenuKb());
}
async function finBalance(env, ctx) {
  const u = await dbOne(env, 'eb1_users', "telegram_user_id=eq." + ctx.uid + "&select=start_balance");
  const bal = await computeBalance(env, ctx.uid);
  await screen(env, ctx, "💼 <b>Баланс</b>\n\nТекущий: <b>" + money(bal) + "</b>\nСтартовый: " + money(_or(u?.start_balance, () => 0)) + "\n\nФормула: стартовый + доходы − расходы + корректировки.", ikb([[btn('✏️ Стартовый баланс', 'fin:setstart')], [btn('➕/➖ Корректировка', 'fin:adjust')], navRow('fin:menu')]));
}
async function finAnalytics(env, ctx, scope, customFrom, customTo) {
  const np = nowParts(ctx.user.tz);
  const today = np.dateStr;
  let from, to, label, prevFrom, prevTo;
  if (scope === 'today') {
    from = to = today;
    label = 'Сегодня';
    prevFrom = prevTo = addDaysStr(today, -1);
  } else if (scope === 'week') {
    from = addDaysStr(today, -6);
    to = today;
    label = 'Неделя';
    prevFrom = addDaysStr(today, -13);
    prevTo = addDaysStr(today, -7);
  } else if (scope === 'month') {
    from = "" + np.y + "-" + String(np.mo).padStart(2, '0') + "-01";
    to = today;
    label = 'Месяц';
    const pm = np.mo === 1 ? 12 : np.mo - 1;
    const py = np.mo === 1 ? np.y - 1 : np.y;
    prevFrom = "" + py + "-" + String(pm).padStart(2, '0') + "-01";
    prevTo = "" + py + "-" + String(pm).padStart(2, '0') + "-" + String(new Date(Date.UTC(py, pm, 0)).getUTCDate()).padStart(2, '0') + "";
  } else {
    from = customFrom;
    to = customTo;
    label = "" + fmtShort(from) + "–" + fmtShort(to) + "";
    prevFrom = prevTo = null;
  }
  const expRows = await sumTx(env, ctx.uid, 'expense', from, to);
  const exp = expRows.reduce((s, x) => s + +x.amount, 0);
  const inc = (await sumTx(env, ctx.uid, 'income', from, to)).reduce((s, x) => s + +x.amount, 0);
  const cats = await dbSelect(env, 'eb1_finance_categories', "telegram_user_id=eq." + ctx.uid + "&select=id,name,emoji");
  const catMap = Object.fromEntries(_or(cats, () => []).map(c => [c.id, "" + c.emoji + " " + c.name + ""]));
  const byCat = {};
  for (const x of expRows) {
    const k = _or(x.category_id, () => 0);
    byCat[k] = _or(byCat[k], () => 0) + +x.amount;
  }
  const top = Object.entries(byCat).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const nDays = Math.max(1, new Set(expRows.map(x => x.tx_date)).size);
  const avg = exp / nDays;
  const biggest = expRows.slice().sort((a, b) => b.amount - a.amount)[0];
  let prevExp = null;
  if (prevFrom) prevExp = (await sumTx(env, ctx.uid, 'expense', prevFrom, prevTo)).reduce((s, x) => s + +x.amount, 0);
  let t = "📊 <b>Аналитика — " + label + "</b>\n\nДоходы: " + money(inc) + "\nРасходы: " + money(exp) + "\nИтог: " + (inc - exp >= 0 ? '+' : '') + "" + money(inc - exp) + "\nБаланс сейчас: " + money(await computeBalance(env, ctx.uid)) + "\n";
  t += "Средняя трата в день: " + money(avg) + "\n";
  if (biggest) t += "Самая большая трата: " + money(biggest.amount) + "" + (biggest.description ? " (" + esc(biggest.description) + ")" : '') + "\n";
  if (prevExp != null) t += "Сравнение с прошлым периодом: " + (exp - prevExp >= 0 ? '+' : '') + "" + money(exp - prevExp) + "\n";
  t += '\n<b>Топ категорий:</b>\n';
  if (top.length) for (const [k, v] of top) t += "• " + _or(catMap[k], () => 'без категории') + " — " + money(v) + "\n";else t += '<i>нет данных</i>\n';
  const kb = [[btn('Сегодня', 'fin:an:today'), btn('Неделя', 'fin:an:week'), btn('Месяц', 'fin:an:month')], [btn('Выбрать период', 'fin:anperiod'), btn('📈 Графики', 'fin:charts:' + scope)], navRow('fin:menu')];
  await screen(env, ctx, t, ikb(kb));
}
async function finCharts(env, ctx, scope) {
  const np = nowParts(ctx.user.tz);
  const today = np.dateStr;
  let from, to;
  if (scope === 'today') {
    from = to = today;
  } else if (scope === 'week') {
    from = addDaysStr(today, -6);
    to = today;
  } else {
    from = "" + np.y + "-" + String(np.mo).padStart(2, '0') + "-01";
    to = today;
  }
  const rows = await sumTx(env, ctx.uid, 'expense', from, to);
  const cats = await dbSelect(env, 'eb1_finance_categories', "telegram_user_id=eq." + ctx.uid + "&select=id,name");
  const catMap = Object.fromEntries(_or(cats, () => []).map(c => [c.id, c.name]));
  const byCat = {};
  for (const x of rows) {
    const k = _or(catMap[x.category_id], () => 'Прочее');
    byCat[k] = _or(byCat[k], () => 0) + +x.amount;
  }
  const byDay = {};
  for (const x of rows) {
    byDay[x.tx_date] = _or(byDay[x.tx_date], () => 0) + +x.amount;
  }
  await answer(env, ctx.cbId, 'Рисую…');
  if (Object.keys(byCat).length) await sendPhoto(env, ctx.chatId, pieChart('Расходы по категориям', Object.keys(byCat), Object.values(byCat)), '🥧 Категории');
  const dks = Object.keys(byDay).sort();
  if (dks.length) await sendPhoto(env, ctx.chatId, lineChart('Расходы по дням', dks.map(fmtDate), dks.map(d => byDay[d]), 'Расход'), '📉 По дням');
  await send(env, ctx.chatId, 'Готово.', ikb([navRow('fin:menu')]));
}
async function finSavings(env, ctx) {
  const rows = await dbSelect(env, 'eb1_savings_goals', "telegram_user_id=eq." + ctx.uid + "&closed=eq.false&select=id,title,target,current&order=id.asc");
  let t = '🐷 <b>Сбережения</b>\n\n';
  const kb = [];
  if (!rows?.length) t += '<i>нет целей накопления</i>';else for (const s of rows) {
    const pct = Math.min(100, Math.round(s.current / Number(s.target) * 100));
    const f = Math.round(pct / 10);
    t += "" + esc(s.title) + "\n" + money(s.current) + " из " + money(s.target) + "\n" + '█'.repeat(f) + "" + '░'.repeat(10 - f) + " " + pct + "%\n\n";
    kb.push([btn(("➕ " + s.title + "").slice(0, 28), "fin:savadd:" + s.id + ""), btn('➖', "fin:savsub:" + s.id + ""), btn('🗑', "fin:savdel:" + s.id + "")]);
  }
  kb.push([btn('➕ Новая цель', 'fin:savnew')]);
  kb.push(navRow('fin:menu'));
  await screen(env, ctx, t, ikb(kb));
}
async function finCategories(env, ctx) {
  const cats = await dbSelect(env, 'eb1_finance_categories', "telegram_user_id=eq." + ctx.uid + "&select=id,name,emoji,kind&order=kind.asc,id.asc");
  let t = '🗂 <b>Категории</b>\n\n<b>Доходы:</b>\n';
  const kb = [];
  for (const c of _or(cats, () => []).filter(c => c.kind === 'income')) {
    t += "" + c.emoji + " " + c.name + "\n";
    kb.push([btn("" + c.emoji + " " + c.name + "", "fin:catopen:" + c.id + "")]);
  }
  t += '\n<b>Расходы:</b>\n';
  for (const c of _or(cats, () => []).filter(c => c.kind === 'expense')) {
    t += "" + c.emoji + " " + c.name + "\n";
    kb.push([btn("" + c.emoji + " " + c.name + "", "fin:catopen:" + c.id + "")]);
  }
  kb.push([btn('➕ Категория дохода', 'fin:catnew:income'), btn('➕ Категория расхода', 'fin:catnew:expense')]);
  kb.push(navRow('fin:menu'));
  await screen(env, ctx, t, ikb(kb));
}
async function finCatOpen(env, ctx, id) {
  const c = await dbOne(env, 'eb1_finance_categories', "telegram_user_id=eq." + ctx.uid + "&id=eq." + id + "");
  if (!c) return finCategories(env, ctx);
  const kws = await dbSelect(env, 'eb1_finance_category_keywords', "telegram_user_id=eq." + ctx.uid + "&category_id=eq." + id + "&select=keyword");
  await screen(env, ctx, "" + c.emoji + " <b>" + esc(c.name) + "</b> (" + (c.kind === 'income' ? 'доход' : 'расход') + ")\nКлючевые слова: " + _or(_or(kws, () => []).map(k => k.keyword).join(', '), () => '—') + "", ikb([[btn('✏️ Имя', "fin:catren:" + id + ""), btn('😀 Emoji', "fin:catemoji:" + id + "")], [btn('➕ Ключевое слово', "fin:catkw:" + id + "")], [btn('🗑 Удалить', "fin:catdel:" + id + "")], navRow('fin:cat')]));
}
async function setMenu(env, ctx) {
  const u = await dbOne(env, 'eb1_users', "telegram_user_id=eq." + ctx.uid + "");
  const dr = _or(u.default_reminders, () => '1d,at').split(',');
  const lbl = {
    '1w': 'неделя',
    '3d': '3 дня',
    '1d': 'сутки',
    '12h': '12ч',
    '3h': '3ч',
    '1h': 'час',
    'at': 'в момент'
  };
  await screen(env, ctx, "⚙️ <b>Настройки</b>\n\nУтренний брифинг: " + (u.briefing_enabled ? 'вкл' : 'выкл') + " в " + u.briefing_time + "\nВечерний брифинг: " + (u.evening_enabled ? 'вкл' : 'выкл') + " в " + _or(u.evening_time, () => '22:00') + "\nЧасовой пояс: " + u.tz + "\nСтандартные напоминания: " + dr.map(x => _or(lbl[x], () => x)).join(', ') + "", ikb([[btn(u.briefing_enabled ? '🔕 Утренний выкл' : '🔔 Утренний вкл', 'set:mtoggle'), btn('🕖 Время утра', 'set:mtime')], [btn(u.evening_enabled ? '🔕 Вечерний выкл' : '🔔 Вечерний вкл', 'set:etoggle'), btn('🕙 Время вечера', 'set:etime')], [btn('🔔 Стандартные напоминания', 'set:reminders')], [btn('🌍 Часовой пояс', 'set:tz')], navRow('nav:menu')]));
}
async function setReminders(env, ctx) {
  const u = await dbOne(env, 'eb1_users', "telegram_user_id=eq." + ctx.uid + "&select=default_reminders");
  const picks = _or(u.default_reminders, () => '1d,at').split(',');
  await screen(env, ctx, '🔔 <b>Стандартные напоминания</b>\nПодставляются при создании новой задачи:', ikb(reminderPicksKeyboard(picks, null, 'sdr')));
}

// ═══ БРИФИНГИ ═══
async function buildMorning(env, uid, tz) {
  const today = nowParts(tz).dateStr;
  const todayT = await dbSelect(env, 'eb1_tasks', "telegram_user_id=eq." + uid + "&kind=eq.timed&archived=eq.false&status=neq.done&due_date=eq." + today + "&select=title,due_hour&order=due_hour.asc");
  const up = await dbSelect(env, 'eb1_tasks', "telegram_user_id=eq." + uid + "&kind=eq.timed&archived=eq.false&status=neq.done&due_date=gt." + today + "&due_date=lte." + addDaysStr(today, 7) + "&select=title,due_date,due_hour&order=due_date.asc");
  const bz = await dbSelect(env, 'eb1_tasks', "telegram_user_id=eq." + uid + "&kind=eq.timeless&archived=eq.false&status=neq.done&select=title&limit=5");
  let t = '☀️ <b>Доброе утро!</b>\n\n📌 <b>Сегодня:</b>\n';
  if (todayT && todayT.length) for (const x of todayT) t += "" + (x.due_hour != null ? String(x.due_hour).padStart(2, '0') + ':00' : 'Без времени —') + " " + esc(x.title) + "\n";else t += '<i>на сегодня пусто</i>\n';
  t += '\n🗓 <b>Ближайшие:</b>\n';
  if (up && up.length) for (const x of up.slice(0, 8)) t += "" + fmtShort(x.due_date) + " " + esc(x.title) + "\n";else t += '<i>нет</i>\n';
  t += '\n♾️ <b>Безвременные:</b>\n';
  if (bz && bz.length) for (const x of bz) t += "• " + esc(x.title) + "\n";else t += '<i>нет</i>\n';
  return t;
}
async function buildEvening(env, uid, tz) {
  const today = nowParts(tz).dateStr;
  const now = Date.now();
  const done = await dbSelect(env, 'eb1_tasks', "telegram_user_id=eq." + uid + "&status=eq.done&done_at=gte." + today + "T00:00:00&select=title");
  const todayT = await dbSelect(env, 'eb1_tasks', "telegram_user_id=eq." + uid + "&kind=eq.timed&archived=eq.false&status=neq.done&due_date=eq." + today + "&select=title,due_hour");
  const notDone = _or(todayT, () => []).filter(x => {
    const dl = taskDeadlineUtc(x, tz);
    return dl && dl.getTime() < now;
  });
  const moved = await dbSelect(env, 'eb1_tasks', "telegram_user_id=eq." + uid + "&moved_at=gte." + today + "T00:00:00&select=title,due_date");
  const tom = await dbSelect(env, 'eb1_tasks', "telegram_user_id=eq." + uid + "&kind=eq.timed&archived=eq.false&status=neq.done&due_date=eq." + addDaysStr(today, 1) + "&select=title,due_hour&order=due_hour.asc");
  const bz = await dbSelect(env, 'eb1_tasks', "telegram_user_id=eq." + uid + "&kind=eq.timeless&archived=eq.false&status=neq.done&select=title&limit=5");
  let t = '🌙 <b>Итоги дня</b>\n\n✅ <b>Выполнено:</b>\n';
  if (done && done.length) for (const x of done) t += "• " + esc(x.title) + "\n";else t += '<i>ничего</i>\n';
  t += '\n❌ <b>Не выполнено (просрочено):</b>\n';
  if (notDone.length) for (const x of notDone) t += "• " + esc(x.title) + "\n";else t += '<i>всё закрыто 👍</i>\n';
  t += '\n📅 <b>Перенесено:</b>\n';
  if (moved && moved.length) for (const x of moved) t += "• " + esc(x.title) + " → " + (x.due_date ? fmtShort(x.due_date) : '—') + "\n";else t += '<i>нет</i>\n';
  t += '\n➡️ <b>Завтра:</b>\n';
  if (tom && tom.length) for (const x of tom) t += "" + (x.due_hour != null ? String(x.due_hour).padStart(2, '0') + ':00' : 'Без времени —') + " " + esc(x.title) + "\n";else t += '<i>пусто</i>\n';
  t += '\n♾️ <b>Безвременные:</b>\n';
  if (bz && bz.length) for (const x of bz) t += "• " + esc(x.title) + "\n";else t += '<i>нет</i>\n';
  return t;
}

// ═══ КАК ПОЛЬЗОВАТЬСЯ ═══
async function helpShow(env, ctx) {
  let t = '❓ <b>Как пользоваться</b>\n\n';
  t += '<b>Записать трату/доход</b> — начни с цифры:\n«550 еда», «1000 пятёрочка» — расход. «+3000 зарплата» — доход. Категория подставится сама.\n\n';
  t += '<b>Создать задачу</b> — просто напиши текст: «Купить молоко», «Посмотреть Интерстеллар». Бот спросит: временная или безвременная.\n';
  t += '• <b>Временная</b> — с дедлайном: дата, время, напоминания. После дедлайна уходит в «Просроченные».\n';
  t += '• <b>Безвременная</b> — без срока (бывшие цели): просто живёт в списке.\n\n';
  t += '<b>Папки</b> — свои группы (Фильмы, Учёба, Покупки…), отдельно для временных и безвременных. Создаются при добавлении задачи или в разделе «Папки».\n\n';
  t += '<b>Меню</b> — напиши слово «меню» (или /menu). «отмена»/«назад» отменяют шаг.\n\n';
  t += '<b>В задаче</b>: заметки (история, что и когда сделал), фото (до 10, показываются при открытии), перенос, напоминания, изменение, удаление.\n\n';
  t += '<b>Брифинги</b>: утром — задачи и безвременные; вечером — итоги дня. Время меняется в настройках.';
  await screen(env, ctx, t, ikb([[btn('🏠 Меню', 'nav:menu')]]));
}

// ═══ ТЕКСТ ═══
async function handleText(env, ctx, text) {
  const st = await getState(env, ctx.uid);
  const state = st.state;
  const data = _or(st.data, () => ({}));
  const low = text.trim().toLowerCase();
  if (['меню', 'menu', 'отмена', 'cancel', 'стоп'].includes(low)) {
    await clearState(env, ctx.uid);
    return showMenu(env, ctx);
  }
  if (state) {
    if (await stepText(env, ctx, state, data, text)) return;
  }
  if (/^[+-]?\d/.test(text.trim())) {
    const parsed = await parseQuickFinance(env, ctx.uid, text);
    if (parsed) return finConfirm(env, ctx, parsed);
  }
  return taskWizardStart(env, ctx, text.trim());
}
async function stepText(env, ctx, state, data, text) {
  const t = text.trim();
  const done = async (msg, kb) => {
    await clearState(env, ctx.uid);
    await send(env, ctx.chatId, msg, kb);
  };
  switch (state) {
    case 'w:fnewname':
      {
        const f = await dbInsertOne(env, 'eb1_folders', {
          telegram_user_id: ctx.uid,
          kind: data.kind,
          name: t
        });
        await finalizeTask(env, ctx, data, f.id);
        return true;
      }
    case 'task:note_add':
      {
        await dbInsert(env, 'eb1_task_notes', {
          telegram_user_id: ctx.uid,
          task_id: data.id,
          text: t
        });
        await done('✅ Заметка добавлена', ikb([[btn('Открыть', "task:open:" + data.id + "")]]));
        return true;
      }
    case 'task:ren':
      {
        await dbUpdate(env, 'eb1_tasks', "id=eq." + data.id + "", {
          title: t
        });
        await done('✅ Название изменено', ikb([[btn('Открыть', "task:open:" + data.id + "")]]));
        return true;
      }
    case 'task:remcustom':
      {
        const m = t.match(/^(\d{1,2}):(\d{2})$/);
        if (!m) {
          await send(env, ctx.chatId, 'Формат ЧЧ:ММ, напр. 08:30');
          return true;
        }
        const x = await dbOne(env, 'eb1_tasks', "id=eq." + data.id + "&select=title,due_date");
        const at = localToUtc(...x.due_date.split('-').map(Number), +m[1], +m[2], ctx.user.tz);
        if (at.getTime() <= Date.now()) {
          await send(env, ctx.chatId, 'Это время уже прошло');
          return true;
        }
        await dbInsert(env, 'eb1_reminders', {
          telegram_user_id: ctx.uid,
          kind: 'task',
          ref_id: data.id,
          fire_at: at.toISOString(),
          label: x.title
        });
        await done("✅ Напоминание на " + m[1] + ":" + m[2] + "", ikb([[btn('Открыть', "task:open:" + data.id + "")]]));
        return true;
      }
    case 'fold_new':
      {
        await dbInsertOne(env, 'eb1_folders', {
          telegram_user_id: ctx.uid,
          kind: data.kind,
          name: t
        });
        await clearState(env, ctx.uid);
        return folderManage(env, ctx, data.kind);
      }
    case 'fold_ren':
      {
        await dbUpdate(env, 'eb1_folders', "id=eq." + data.id + "", {
          name: t
        });
        await clearState(env, ctx.uid);
        return folderManage(env, ctx, data.kind);
      }
    case 'fin:amount':
      {
        const parsed = await parseQuickFinance(env, ctx.uid, t);
        if (!parsed) {
          await send(env, ctx.chatId, 'Не понял сумму. Пример: «550 еда».');
          return true;
        }
        parsed.type = _or(data.type, () => parsed.type);
        await finConfirm(env, ctx, parsed);
        return true;
      }
    case 'fin:catnew':
      {
        const m = t.match(/^(\S+)?\s*(.+)?$/);
        const emoji = m && m[1] && /\p{Extended_Pictographic}/u.test(m[1]) ? m[1] : '';
        const name = emoji ? _or(m[2], () => '').trim() : t;
        await dbInsertOne(env, 'eb1_finance_categories', {
          telegram_user_id: ctx.uid,
          name: _or(name, () => t),
          emoji,
          kind: _or(data.kind, () => 'expense')
        });
        await done('✅ Категория создана', ikb([[btn('Категории', 'fin:cat')]]));
        return true;
      }
    case 'fin:catren':
      {
        await dbUpdate(env, 'eb1_finance_categories', "id=eq." + data.id + "", {
          name: t
        });
        await done('✅ Готово', ikb([[btn('Открыть', "fin:catopen:" + data.id + "")]]));
        return true;
      }
    case 'fin:catemoji':
      {
        await dbUpdate(env, 'eb1_finance_categories', "id=eq." + data.id + "", {
          emoji: t
        });
        await done('✅ Готово', ikb([[btn('Открыть', "fin:catopen:" + data.id + "")]]));
        return true;
      }
    case 'fin:catkw':
      {
        await dbInsert(env, 'eb1_finance_category_keywords', {
          telegram_user_id: ctx.uid,
          category_id: data.id,
          keyword: t.toLowerCase()
        });
        await done('✅ Слово добавлено', ikb([[btn('Открыть', "fin:catopen:" + data.id + "")]]));
        return true;
      }
    case 'fin:setstart':
      {
        await dbUpdate(env, 'eb1_users', "telegram_user_id=eq." + ctx.uid + "", {
          start_balance: _or(parseFloat(t.replace(',', '.')), () => 0)
        });
        await done('✅ Стартовый баланс задан', ikb([[btn('Баланс', 'fin:bal')]]));
        return true;
      }
    case 'fin:adjust':
      {
        const v = parseFloat(t.replace(',', '.'));
        if (isFinite(v)) await dbInsert(env, 'eb1_balance_adjustments', {
          telegram_user_id: ctx.uid,
          amount: v,
          reason: 'корректировка'
        });
        await done('✅ Скорректировано', ikb([[btn('Баланс', 'fin:bal')]]));
        return true;
      }
    case 'fin:savnew':
      {
        const mm = t.match(/^(.+?)\s+(\d+(?:[.,]\d+)?)$/);
        if (!mm) {
          await send(env, ctx.chatId, 'Формат: «Ноутбук 120000»');
          return true;
        }
        await dbInsert(env, 'eb1_savings_goals', {
          telegram_user_id: ctx.uid,
          title: mm[1].trim(),
          target: parseFloat(mm[2].replace(',', '.'))
        });
        await done('✅ Цель создана', ikb([[btn('Сбережения', 'fin:save')]]));
        return true;
      }
    case 'fin:savadd':
      {
        const v = _or(parseFloat(t.replace(',', '.')), () => 0);
        const s = await dbOne(env, 'eb1_savings_goals', "id=eq." + data.id + "&select=current");
        await dbUpdate(env, 'eb1_savings_goals', "id=eq." + data.id + "", {
          current: Number(s.current) + v
        });
        await done('✅ Пополнено', ikb([[btn('Сбережения', 'fin:save')]]));
        return true;
      }
    case 'fin:savsub':
      {
        const v = _or(parseFloat(t.replace(',', '.')), () => 0);
        const s = await dbOne(env, 'eb1_savings_goals', "id=eq." + data.id + "&select=current");
        await dbUpdate(env, 'eb1_savings_goals', "id=eq." + data.id + "", {
          current: Math.max(0, Number(s.current) - v)
        });
        await done('✅ Уменьшено', ikb([[btn('Сбережения', 'fin:save')]]));
        return true;
      }
    case 'set:mtime':
      {
        if (/^\d{1,2}:\d{2}$/.test(t)) await dbUpdate(env, 'eb1_users', "telegram_user_id=eq." + ctx.uid + "", {
          briefing_time: t.padStart(5, '0')
        });
        await done('✅ Время утра задано', ikb([[btn('Настройки', 'set:menu')]]));
        return true;
      }
    case 'set:etime':
      {
        if (/^\d{1,2}:\d{2}$/.test(t)) await dbUpdate(env, 'eb1_users', "telegram_user_id=eq." + ctx.uid + "", {
          evening_time: t.padStart(5, '0')
        });
        await done('✅ Время вечера задано', ikb([[btn('Настройки', 'set:menu')]]));
        return true;
      }
    case 'set:tz':
      {
        await dbUpdate(env, 'eb1_users', "telegram_user_id=eq." + ctx.uid + "", {
          tz: t
        });
        await done('✅ Часовой пояс задан', ikb([[btn('Настройки', 'set:menu')]]));
        return true;
      }
  }
  return false;
}

// ═══ РОУТЕР CALLBACK ═══
async function handleCallback(env, ctx, data) {
  const p = data.split(':');
  const area = p[0];
  if (data === 'noop') return answer(env, ctx.cbId);
  if (area === 'nav') {
    await clearState(env, ctx.uid);
    return showMenu(env, ctx);
  }
  if (data === 'help:show') return helpShow(env, ctx);
  if (area === 'w') {
    const st = await getState(env, ctx.uid);
    const d = _or(st.data, () => ({}));
    if (p[1] === 'kind') {
      d.kind = p[2];
      if (p[2] === 'timed') return wAskDate(env, ctx, d);
      return wAskFolder(env, ctx, d);
    }
    if (p[1] === 'cal' && p[2] === 'nav') {
      let y = +p[3],
        mo = +p[4] + +p[5];
      if (mo < 1) {
        mo = 12;
        y--;
      }
      if (mo > 12) {
        mo = 1;
        y++;
      }
      const cal = buildCalendar(y, mo, 'w:cal', [btn('🏠 В меню', 'nav:menu')]);
      return edit(env, ctx.chatId, ctx.msgId, 'До какого числа нужно выполнить?', cal);
    }
    if (p[1] === 'cal' && p[2] === 'pick') {
      d.due_date = p[3];
      return wAskTime(env, ctx, d);
    }
    if (p[1] === 'date') {
      d.due_date = p[2];
      return wAskTime(env, ctx, d);
    }
    if (p[1] === 'time') {
      d.due_hour = p[2] === 'none' ? null : +p[2];
      return wAskReminders(env, ctx, d);
    }
    if (p[1] === 'rt') {
      d.picks = _or(d.picks, () => ['at']);
      const k = p[2];
      d.picks = d.picks.includes(k) ? d.picks.filter(x => x !== k) : [...d.picks, k];
      await setState(env, ctx.uid, 'w:rem', d);
      let h = null;
      if (d.due_date) {
        const f = taskDeadlineUtc({
          due_date: d.due_date,
          due_hour: d.due_hour
        }, ctx.user.tz);
        h = (f.getTime() - Date.now()) / 3600000;
      }
      const rk = reminderPicksKeyboard(d.picks, h, 'w');
      rk.push([btn('⬅️ Назад', 'w:back:time'), btn('🏠 В меню', 'nav:menu')]);
      return edit(env, ctx.chatId, ctx.msgId, '🔔 Напоминания:', ikb(rk));
    }
    if (p[1] === 'rdone') return wAskFolder(env, ctx, d);
    if (p[1] === 'back' && p[2] === 'date') return wAskDate(env, ctx, d);
    if (p[1] === 'back' && p[2] === 'time') return wAskTime(env, ctx, d);
    if (p[1] === 'fyes') return wFolderList(env, ctx, d);
    if (p[1] === 'fno') return finalizeTask(env, ctx, d, null);
    if (p[1] === 'fyesback') return wAskFolder(env, ctx, d);
    if (p[1] === 'fback') {
      if (d.kind === 'timed') return wAskReminders(env, ctx, d);
      return taskWizardStart(env, ctx, d.title);
    }
    if (p[1] === 'fset') return finalizeTask(env, ctx, d, +p[2]);
    if (p[1] === 'fnew') {
      await setState(env, ctx.uid, 'w:fnewname', d);
      return send(env, ctx.chatId, 'Название новой папки:');
    }
  }
  if (area === 'task') {
    switch (p[1]) {
      case 'open':
        return taskOpen(env, ctx, p[2]);
      case 'done':
        return taskDone(env, ctx, p[2]);
      case 'note':
        await setState(env, ctx.uid, 'task:note_add', {
          id: +p[2]
        });
        return send(env, ctx.chatId, 'Текст заметки:');
      case 'photo':
        await setState(env, ctx.uid, 'task:photo_add', {
          id: +p[2]
        });
        return send(env, ctx.chatId, 'Пришли фото (можно несколько, до 10). Когда хватит — нажми «Готово».', ikb([[btn('Готово', "task:open:" + p[2] + "")]]));
      case 'photos':
        return taskPhotosManage(env, ctx, p[2]);
      case 'photodel':
        {
          await dbDelete(env, 'eb1_task_photos', "id=eq." + p[2] + "&telegram_user_id=eq." + ctx.uid + "");
          return taskPhotosManage(env, ctx, p[3]);
        }
      case 'move':
        return taskMove(env, ctx, p[2]);
      case 'movecal':
        {
          if (p[2] === 'nav') {
            let y = +p[3],
              mo = +p[4] + +p[5];
            if (mo < 1) {
              mo = 12;
              y--;
            }
            if (mo > 12) {
              mo = 1;
              y++;
            }
            return edit(env, ctx.chatId, ctx.msgId, 'На какую дату перенести?', buildCalendar(y, mo, 'task:movecal'));
          }
          if (p[2] === 'pick') {
            const st = await getState(env, ctx.uid);
            const id = st.data.id;
            const x = await dbOne(env, 'eb1_tasks', "id=eq." + id + "&select=title,due_hour");
            await dbUpdate(env, 'eb1_tasks', "id=eq." + id + "", {
              due_date: p[3],
              moved_at: new Date().toISOString(),
              od1_sent: false,
              od3_sent: false,
              od24_sent: false,
              od_ack: false
            });
            await dbDelete(env, 'eb1_reminders', "kind=eq.task&ref_id=eq." + id + "&sent=eq.false");
            const fire = taskDeadlineUtc({
              due_date: p[3],
              due_hour: x ? x.due_hour : null
            }, ctx.user.tz);
            if (fire && fire.getTime() > Date.now()) await scheduleEventReminders(env, ctx.uid, 'task', id, x ? x.title : '', fire, ['at']);
            await clearState(env, ctx.uid);
            return taskOpen(env, ctx, id);
          }
          break;
        }
      case 'rem':
        return taskReminders(env, ctx, p[2]);
      case 'edit':
        return taskEdit(env, ctx, p[2]);
      case 'ren':
        await setState(env, ctx.uid, 'task:ren', {
          id: +p[2]
        });
        return send(env, ctx.chatId, 'Новое название:');
      case 'folder':
        return taskFolderPick(env, ctx, p[2]);
      case 'setfolder':
        {
          const fid = +p[2];
          await dbUpdate(env, 'eb1_tasks', "id=eq." + p[3] + "", {
            folder_id: fid === 0 ? null : fid
          });
          return taskOpen(env, ctx, p[3]);
        }
      case 'settype':
        {
          const kind = p[2];
          const id = p[3];
          if (kind === 'timeless') {
            await dbUpdate(env, 'eb1_tasks', "id=eq." + id + "", {
              kind: 'timeless',
              due_date: null,
              due_hour: null
            });
            await dbDelete(env, 'eb1_reminders', "kind=eq.task&ref_id=eq." + id + "&sent=eq.false");
            return taskOpen(env, ctx, id);
          }
          const np = nowParts(ctx.user.tz);
          await setState(env, ctx.uid, 'task:redating', {
            id: +id,
            makeTimed: true
          });
          return screen(env, ctx, 'Дата выполнения:', buildCalendar(np.y, np.mo, 'task:redatecal'));
        }
      case 'redate':
        {
          const np = nowParts(ctx.user.tz);
          await setState(env, ctx.uid, 'task:redating', {
            id: +p[2]
          });
          return screen(env, ctx, 'Новая дата:', buildCalendar(np.y, np.mo, 'task:redatecal'));
        }
      case 'redatecal':
        {
          if (p[2] === 'nav') {
            let y = +p[3],
              mo = +p[4] + +p[5];
            if (mo < 1) {
              mo = 12;
              y--;
            }
            if (mo > 12) {
              mo = 1;
              y++;
            }
            return edit(env, ctx.chatId, ctx.msgId, 'Дата:', buildCalendar(y, mo, 'task:redatecal'));
          }
          if (p[2] === 'pick') {
            const st = await getState(env, ctx.uid);
            const d = st.data;
            d.due_date = p[3];
            await setState(env, ctx.uid, 'task:redating', d);
            const rows = [];
            let r = [];
            for (let h = 6; h <= 23; h++) {
              r.push(btn("" + String(h).padStart(2, '0') + ":00", "task:redtime:" + h + ""));
              if (r.length === 4) {
                rows.push(r);
                r = [];
              }
            }
            if (r.length) rows.push(r);
            rows.push([btn('Без времени', 'task:redtime:none')]);
            return edit(env, ctx.chatId, ctx.msgId, 'Время:', ikb(rows));
          }
          break;
        }
      case 'redtime':
        {
          const st = await getState(env, ctx.uid);
          const d = st.data;
          const hour = p[2] === 'none' ? null : +p[2];
          const patch = {
            due_date: d.due_date,
            due_hour: hour,
            moved_at: new Date().toISOString(),
            od1_sent: false,
            od3_sent: false,
            od24_sent: false,
            od_ack: false
          };
          if (d.makeTimed) patch.kind = 'timed';
          await dbUpdate(env, 'eb1_tasks', "id=eq." + d.id + "", patch);
          await dbDelete(env, 'eb1_reminders', "kind=eq.task&ref_id=eq." + d.id + "&sent=eq.false");
          const x = await dbOne(env, 'eb1_tasks', "id=eq." + d.id + "&select=title");
          const fire = taskDeadlineUtc({
            due_date: d.due_date,
            due_hour: hour
          }, ctx.user.tz);
          if (fire && fire.getTime() > Date.now()) await scheduleEventReminders(env, ctx.uid, 'task', d.id, x ? x.title : '', fire, ['at']);
          await clearState(env, ctx.uid);
          return taskOpen(env, ctx, d.id);
        }
      case 'del':
        return screen(env, ctx, 'Удалить задачу?', ikb([[btn('🗑 Да', "task:delyes:" + p[2] + "")], [btn('Отмена', "task:open:" + p[2] + "")]]));
      case 'delyes':
        {
          await dbDelete(env, 'eb1_tasks', "id=eq." + p[2] + "&telegram_user_id=eq." + ctx.uid + "");
          await dbDelete(env, 'eb1_reminders', "kind=eq.task&ref_id=eq." + p[2] + "");
          await dbDelete(env, 'eb1_task_notes', "task_id=eq." + p[2] + "");
          await dbDelete(env, 'eb1_task_photos', "task_id=eq." + p[2] + "");
          return showMenu(env, ctx);
        }
      case 'odack':
        {
          await dbUpdate(env, 'eb1_tasks', "id=eq." + p[2] + "&telegram_user_id=eq." + ctx.uid + "", {
            od_ack: true
          });
          return answer(env, ctx.cbId, 'Отправлено в просроченные');
        }
    }
  }
  if (area === 'tt') {
    if (p[1] === 'menu') return timedMenu(env, ctx);
    if (p[1] === 'overdue') return timedOverdue(env, ctx);
  }
  if (area === 'bz') {
    if (p[1] === 'menu') return timelessMenu(env, ctx);
  }
  if (area === 'fold') {
    if (p[1] === 'm') return folderManage(env, ctx, p[2]);
    if (p[1] === 'new') {
      await setState(env, ctx.uid, 'fold_new', {
        kind: p[2]
      });
      return send(env, ctx.chatId, 'Название новой папки:');
    }
    if (p[1] === 'ren') {
      await setState(env, ctx.uid, 'fold_ren', {
        kind: p[2],
        id: +p[3]
      });
      return send(env, ctx.chatId, 'Новое имя папки:');
    }
    if (p[1] === 'del') {
      await dbUpdate(env, 'eb1_tasks', "folder_id=eq." + p[3] + "&telegram_user_id=eq." + ctx.uid + "", {
        folder_id: null
      });
      await dbDelete(env, 'eb1_folders', "id=eq." + p[3] + "&telegram_user_id=eq." + ctx.uid + "");
      return folderManage(env, ctx, p[2]);
    }
  }
  if (area === 'tre') {
    const st = await getState(env, ctx.uid);
    const d = _or(st.data, () => ({}));
    if (p[1] === 'rt') {
      const k = p[2];
      d.picks = d.picks.includes(k) ? d.picks.filter(x => x !== k) : [...d.picks, k];
      await setState(env, ctx.uid, 'task:remedit', d);
      const fire = taskDeadlineUtc({
        due_date: d.due_date,
        due_hour: d.due_hour
      }, ctx.user.tz);
      const h = (fire.getTime() - Date.now()) / 3600000;
      const rk = reminderPicksKeyboard(d.picks, h, 'tre');
      rk.push([btn('🕒 Своё время (ЧЧ:ММ)', 'tre:custom')]);
      rk.push([btn('⬅️ К задаче', "task:open:" + d.id + "")]);
      return edit(env, ctx.chatId, ctx.msgId, '🔔 Напоминания:', ikb(rk));
    }
    if (p[1] === 'custom') {
      await setState(env, ctx.uid, 'task:remcustom', {
        id: d.id
      });
      return send(env, ctx.chatId, 'Во сколько напомнить? Формат ЧЧ:ММ, напр. 08:30');
    }
    if (p[1] === 'rdone') {
      const x = await dbOne(env, 'eb1_tasks', "id=eq." + d.id + "&select=title");
      await dbDelete(env, 'eb1_reminders', "kind=eq.task&ref_id=eq." + d.id + "&sent=eq.false");
      const fire = taskDeadlineUtc({
        due_date: d.due_date,
        due_hour: d.due_hour
      }, ctx.user.tz);
      await scheduleEventReminders(env, ctx.uid, 'task', d.id, x ? x.title : '', fire, d.picks);
      await clearState(env, ctx.uid);
      return taskOpen(env, ctx, d.id);
    }
  }
  if (area === 'sdr') {
    const st = await getState(env, ctx.uid);
    let picks = st.data && st.data.picks;
    if (!picks) {
      const u = await dbOne(env, 'eb1_users', "telegram_user_id=eq." + ctx.uid + "&select=default_reminders");
      picks = _or(u.default_reminders, () => '1d,at').split(',');
    }
    if (p[1] === 'rt') {
      const k = p[2];
      picks = picks.includes(k) ? picks.filter(x => x !== k) : [...picks, k];
      await setState(env, ctx.uid, 'set:dr', {
        picks
      });
      return edit(env, ctx.chatId, ctx.msgId, '🔔 Стандартные напоминания:', ikb(reminderPicksKeyboard(picks, null, 'sdr')));
    }
    if (p[1] === 'rdone') {
      await dbUpdate(env, 'eb1_users', "telegram_user_id=eq." + ctx.uid + "", {
        default_reminders: picks.join(',')
      });
      await clearState(env, ctx.uid);
      return setMenu(env, ctx);
    }
  }
  if (area === 'fin') {
    switch (p[1]) {
      case 'menu':
        return finMenu(env, ctx);
      case 'add':
        return finAddStart(env, ctx, p[2]);
      case 'save_tx':
        return finSaveTx(env, ctx);
      case 'cancel':
        await clearState(env, ctx.uid);
        return finMenu(env, ctx);
      case 'flip':
        {
          const st = await getState(env, ctx.uid);
          const d = st.data;
          d.type = d.type === 'income' ? 'expense' : 'income';
          d.categoryId = await categorize(env, ctx.uid, _or(d.description, () => '').split(/\s+/), d.type);
          return finConfirm(env, ctx, d);
        }
      case 'pick_cat':
        {
          const st = await getState(env, ctx.uid);
          const kind = _or(st.data?.type, () => 'expense');
          const cats = await dbSelect(env, 'eb1_finance_categories', "telegram_user_id=eq." + ctx.uid + "&kind=eq." + kind + "&select=id,name,emoji");
          const kb = _or(cats, () => []).map(c => [btn("" + c.emoji + " " + c.name + "", "fin:setcat:" + c.id + "")]);
          kb.push([btn('Отмена', 'fin:cancel')]);
          return screen(env, ctx, 'Категория:', ikb(kb));
        }
      case 'setcat':
        {
          const st = await getState(env, ctx.uid);
          const d = st.data;
          d.categoryId = +p[2];
          return finConfirm(env, ctx, d);
        }
      case 'bal':
        return finBalance(env, ctx);
      case 'setstart':
        await setState(env, ctx.uid, 'fin:setstart', {});
        return send(env, ctx.chatId, 'Стартовый баланс (₽):');
      case 'adjust':
        await setState(env, ctx.uid, 'fin:adjust', {});
        return send(env, ctx.chatId, 'Корректировка (напр. 500 или -300):');
      case 'an':
        return finAnalytics(env, ctx, p[2]);
      case 'anperiod':
        {
          const np = nowParts(ctx.user.tz);
          await setState(env, ctx.uid, 'fin:per1', {});
          return screen(env, ctx, 'Начало периода:', buildCalendar(np.y, np.mo, 'fin:percal1'));
        }
      case 'percal1':
        {
          if (p[2] === 'nav') {
            let y = +p[3],
              mo = +p[4] + +p[5];
            if (mo < 1) {
              mo = 12;
              y--;
            }
            if (mo > 12) {
              mo = 1;
              y++;
            }
            return edit(env, ctx.chatId, ctx.msgId, 'Начало периода:', buildCalendar(y, mo, 'fin:percal1'));
          }
          if (p[2] === 'pick') {
            await setState(env, ctx.uid, 'fin:per2', {
              from: p[3]
            });
            const np = nowParts(ctx.user.tz);
            return edit(env, ctx.chatId, ctx.msgId, 'Конец периода:', buildCalendar(np.y, np.mo, 'fin:percal2'));
          }
          break;
        }
      case 'percal2':
        {
          if (p[2] === 'nav') {
            let y = +p[3],
              mo = +p[4] + +p[5];
            if (mo < 1) {
              mo = 12;
              y--;
            }
            if (mo > 12) {
              mo = 1;
              y++;
            }
            return edit(env, ctx.chatId, ctx.msgId, 'Конец периода:', buildCalendar(y, mo, 'fin:percal2'));
          }
          if (p[2] === 'pick') {
            const st = await getState(env, ctx.uid);
            const from = st.data.from;
            await clearState(env, ctx.uid);
            return finAnalytics(env, ctx, 'custom', from, p[3]);
          }
          break;
        }
      case 'charts':
        return finCharts(env, ctx, _or(p[2], () => 'month'));
      case 'save':
        return finSavings(env, ctx);
      case 'savnew':
        await setState(env, ctx.uid, 'fin:savnew', {});
        return send(env, ctx.chatId, '«Название сумма», напр. «Ноутбук 120000»:');
      case 'savadd':
        await setState(env, ctx.uid, 'fin:savadd', {
          id: +p[2]
        });
        return send(env, ctx.chatId, 'Сколько добавить (₽)?');
      case 'savsub':
        await setState(env, ctx.uid, 'fin:savsub', {
          id: +p[2]
        });
        return send(env, ctx.chatId, 'Сколько убрать (₽)?');
      case 'savdel':
        {
          await dbDelete(env, 'eb1_savings_goals', "id=eq." + p[2] + "&telegram_user_id=eq." + ctx.uid + "");
          return finSavings(env, ctx);
        }
      case 'cat':
        return finCategories(env, ctx);
      case 'catopen':
        return finCatOpen(env, ctx, p[2]);
      case 'catnew':
        await setState(env, ctx.uid, 'fin:catnew', {
          kind: p[2]
        });
        return send(env, ctx.chatId, 'Введи «😀 Название» или просто название:');
      case 'catren':
        await setState(env, ctx.uid, 'fin:catren', {
          id: +p[2]
        });
        return send(env, ctx.chatId, 'Новое имя категории:');
      case 'catemoji':
        await setState(env, ctx.uid, 'fin:catemoji', {
          id: +p[2]
        });
        return send(env, ctx.chatId, 'Новый emoji:');
      case 'catkw':
        await setState(env, ctx.uid, 'fin:catkw', {
          id: +p[2]
        });
        return send(env, ctx.chatId, 'Ключевое слово:');
      case 'catdel':
        {
          await dbDelete(env, 'eb1_finance_category_keywords', "category_id=eq." + p[2] + "&telegram_user_id=eq." + ctx.uid + "");
          await dbDelete(env, 'eb1_finance_categories', "id=eq." + p[2] + "&telegram_user_id=eq." + ctx.uid + "");
          return finCategories(env, ctx);
        }
    }
  }
  if (area === 'set') {
    switch (p[1]) {
      case 'menu':
        return setMenu(env, ctx);
      case 'mtoggle':
        {
          const u = await dbOne(env, 'eb1_users', "telegram_user_id=eq." + ctx.uid + "&select=briefing_enabled");
          await dbUpdate(env, 'eb1_users', "telegram_user_id=eq." + ctx.uid + "", {
            briefing_enabled: !u.briefing_enabled
          });
          return setMenu(env, ctx);
        }
      case 'etoggle':
        {
          const u = await dbOne(env, 'eb1_users', "telegram_user_id=eq." + ctx.uid + "&select=evening_enabled");
          await dbUpdate(env, 'eb1_users', "telegram_user_id=eq." + ctx.uid + "", {
            evening_enabled: !u.evening_enabled
          });
          return setMenu(env, ctx);
        }
      case 'mtime':
        await setState(env, ctx.uid, 'set:mtime', {});
        return send(env, ctx.chatId, 'Время утреннего брифинга (HH:MM):');
      case 'etime':
        await setState(env, ctx.uid, 'set:etime', {});
        return send(env, ctx.chatId, 'Время вечернего брифинга (HH:MM):');
      case 'reminders':
        return setReminders(env, ctx);
      case 'tz':
        await setState(env, ctx.uid, 'set:tz', {});
        return send(env, ctx.chatId, 'Часовой пояс (напр. Europe/Moscow):');
    }
  }
  return answer(env, ctx.cbId);
}

// ═══ CRON ═══
async function runCron(env) {
  const now = new Date();
  const nowMs = now.getTime();
  const due = await dbSelect(env, 'eb1_reminders', "sent=eq.false&kind=eq.task&fire_at=lte." + now.toISOString() + "&select=*&limit=100");
  for (const r of _or(due, () => [])) {
    try {
      const x = await dbOne(env, 'eb1_tasks', "id=eq." + r.ref_id + "&select=id,title,due_date,due_hour,status,archived");
      await dbUpdate(env, 'eb1_reminders', "id=eq." + r.id + "", {
        sent: true
      });
      if (_or(_or(!x, () => x.status === 'done'), () => x.archived)) continue;
      const note = await dbOne(env, 'eb1_task_notes', "task_id=eq." + x.id + "&select=text&order=created_at.desc");
      let t = '🔔 <b>Напоминание</b>\n\nЗадача:\n' + esc(x.title) + '\n';
      if (x.due_date) t += '\nВыполнить до:\n' + fmtDate(x.due_date) + (x.due_hour != null ? ' ' + String(x.due_hour).padStart(2, '0') + ':00' : '') + '\n';
      if (note && note.text) t += '\nПоследняя заметка:\n' + esc(note.text) + '\n';
      const kb = ikb([[btn('✅ Выполнено', 'task:done:' + x.id), btn('📅 Перенести', 'task:move:' + x.id)], [btn('📝 Добавить заметку', 'task:note:' + x.id), btn('🗑 Удалить', 'task:delyes:' + x.id)]]);
      await send(env, r.telegram_user_id, t, kb);
    } catch (e) {
      console.log('rem err', e.message);
    }
  }
  const users = await dbSelect(env, 'eb1_users', 'select=*');
  for (const u of _or(users, () => [])) {
    try {
      const np = nowParts(u.tz);
      if (u.briefing_enabled) {
        const [h, m] = _or(u.briefing_time, () => '07:00').split(':').map(Number);
        const tgt = h * 60 + m;
        if (np.minOfDay >= tgt && np.minOfDay < tgt + 5 && u.last_briefing_date !== np.dateStr) {
          await send(env, u.telegram_user_id, await buildMorning(env, u.telegram_user_id, u.tz), ikb([[btn('🏠 Меню', 'nav:menu')]]));
          await dbUpdate(env, 'eb1_users', "telegram_user_id=eq." + u.telegram_user_id + "", {
            last_briefing_date: np.dateStr
          });
        }
      }
      if (u.evening_enabled) {
        const [h, m] = _or(u.evening_time, () => '22:00').split(':').map(Number);
        const tgt = h * 60 + m;
        if (np.minOfDay >= tgt && np.minOfDay < tgt + 5 && u.last_evening_date !== np.dateStr) {
          await send(env, u.telegram_user_id, await buildEvening(env, u.telegram_user_id, u.tz), ikb([[btn('🏠 Меню', 'nav:menu')]]));
          await dbUpdate(env, 'eb1_users', "telegram_user_id=eq." + u.telegram_user_id + "", {
            last_evening_date: np.dateStr
          });
        }
      }
      const today = np.dateStr;
      const tasks = await dbSelect(env, 'eb1_tasks', "telegram_user_id=eq." + u.telegram_user_id + "&kind=eq.timed&archived=eq.false&status=neq.done&od_ack=eq.false&due_date=lte." + today + "&select=id,title,due_date,due_hour,od1_sent,od3_sent,od24_sent");
      for (const x of _or(tasks, () => [])) {
        const dl = taskDeadlineUtc(x, u.tz);
        if (!dl) continue;
        const eh = (nowMs - dl.getTime()) / 3600000;
        if (eh < 1) continue;
        let patch = null,
          txt = null;
        if (eh >= 24 && !x.od24_sent) {
          patch = {
            od24_sent: true
          };
          txt = '24 часа назад';
        } else if (eh >= 3 && !x.od3_sent) {
          patch = {
            od3_sent: true
          };
          txt = '3 часа назад';
        } else if (eh >= 1 && !x.od1_sent) {
          patch = {
            od1_sent: true
          };
          txt = '1 час назад';
        }
        if (!patch) continue;
        const kb = ikb([[btn('✅ Выполнено', 'task:done:' + x.id), btn('📅 Перенести', 'task:move:' + x.id)], [btn('🗑 Удалить', 'task:delyes:' + x.id), btn('📛 В просроченные', 'task:odack:' + x.id)]]);
        await send(env, u.telegram_user_id, '⏰ <b>Просрочено</b>\n\nЗадача «' + esc(x.title) + '» должна была завершиться ' + txt + '.', kb);
        await dbUpdate(env, 'eb1_tasks', "id=eq." + x.id + "", patch);
      }
    } catch (e) {
      console.log('user cron err', u.telegram_user_id, e.message);
    }
  }
}

// ═══ ВХОД ═══
export default {
  async fetch(request, env, ctx) {
    if (request.method !== 'POST') return new Response('Electric Brain v3 is running.');
    if (env.WEBHOOK_SECRET && request.headers.get('X-Telegram-Bot-Api-Secret-Token') !== env.WEBHOOK_SECRET) return new Response('forbidden', {
      status: 403
    });
    let update;
    try {
      update = await request.json();
    } catch {
      return new Response('ok');
    }
    ctx.waitUntil(processUpdate(env, update).catch(e => console.log('process err', e.message, e.stack)));
    return new Response('ok');
  },
  async scheduled(event, env, ctx) {
    ctx.waitUntil(runCron(env).catch(e => console.log('cron err', e.message)));
  }
};
async function processUpdate(env, update) {
  if (update.message && update.message.photo) {
    const msg = update.message;
    const from = msg.from;
    const user = await ensureUser(env, from);
    const c = {
      uid: from.id,
      chatId: msg.chat.id,
      user,
      msgId: null
    };
    const st = await getState(env, from.id);
    if (st.state === 'task:photo_add') {
      const id = st.data.id;
      const cnt = await dbSelect(env, 'eb1_task_photos', "task_id=eq." + id + "&select=id");
      if (_or(cnt, () => []).length >= 10) {
        await send(env, c.chatId, 'Уже 10 фото — это максимум.', ikb([[btn('Открыть', "task:open:" + id + "")]]));
        return;
      }
      const ph = msg.photo[msg.photo.length - 1];
      await dbInsert(env, 'eb1_task_photos', {
        telegram_user_id: from.id,
        task_id: id,
        file_id: ph.file_id
      });
      const n = _or(cnt, () => []).length + 1;
      await send(env, c.chatId, "📷 Фото добавлено (" + n + "/10). Пришли ещё или нажми «Готово».", ikb([[btn('Готово', "task:open:" + id + "")]]));
      return;
    }
    return;
  }
  if (update.message && update.message.text) {
    const msg = update.message;
    const from = msg.from;
    const user = await ensureUser(env, from);
    const c = {
      uid: from.id,
      chatId: msg.chat.id,
      user,
      msgId: null
    };
    const text = msg.text.trim();
    if (_or(text.startsWith('/start'), () => text.startsWith('/menu'))) {
      await clearState(env, from.id);
      return showMenu(env, c);
    }
    if (text.startsWith('/settings')) return setMenu(env, c);
    if (text.startsWith('/help')) return helpShow(env, c);
    return handleText(env, c, text);
  }
  if (update.callback_query) {
    const cq = update.callback_query;
    const from = cq.from;
    const user = await ensureUser(env, from);
    const c = {
      uid: from.id,
      chatId: cq.message.chat.id,
      user,
      msgId: cq.message.message_id,
      cbId: cq.id
    };
    try {
      await handleCallback(env, c, cq.data);
    } catch (e) {
      console.log('cb err', e.message, e.stack);
    }
    try {
      await answer(env, cq.id);
    } catch {}
  }
}
/* ===== НАДСТРОЙКА v4: разделы задач, карточка, фото-обложка ===== */
/* phone-safe: без запретных символов */

function _pad2(n){ n = String(n); return n.length < 2 ? ('0' + n) : n; }
function _createdRu(iso, tz){ try { return new Intl.DateTimeFormat('ru-RU', { timeZone: tz, day: 'numeric', month: 'long' }).format(new Date(iso)); } catch (e) { return ''; } }
function _lastNotes(notes){ var m = {}; for (var i = 0; i < notes.length; i++) { m[notes[i].task_id] = notes[i].text; } return m; }

/* ----- Обзор раздела (Временные/Безвременные) ----- */
async function xSectionView(env, ctx, kind){
  var isTimed = kind === 'timed';
  var uid = ctx.uid, tz = ctx.user.tz, now = Date.now();
  var tasks = _or(await dbSelect(env, 'eb1_tasks', 'telegram_user_id=eq.' + uid + '&kind=eq.' + kind + '&archived=eq.false&status=neq.done&select=id,title,folder_id,due_date,due_hour,created_at&order=created_at.desc'), function(){ return []; });
  if (isTimed) tasks = tasks.filter(function(x){ var dl = taskDeadlineUtc(x, tz); return dl && dl.getTime() >= now; });
  var folders = _or(await dbSelect(env, 'eb1_folders', 'telegram_user_id=eq.' + uid + '&kind=eq.' + kind + '&select=id,name&order=name.asc'), function(){ return []; });
  var notes = _or(await dbSelect(env, 'eb1_task_notes', 'telegram_user_id=eq.' + uid + '&select=task_id,text,created_at&order=created_at.asc'), function(){ return []; });
  var last = _lastNotes(notes);
  function line(x){ var s = '• ' + esc(x.title); if (last[x.id]) s += '\n<i>' + esc(last[x.id]) + '</i>'; return s; }

  var t = (isTimed ? '⏰ <b>Временные задачи</b>' : '♾️ <b>Безвременные задачи</b>') + '\n\n<b>Основные:</b>\n';
  var main = tasks.filter(function(x){ return !x.folder_id; });
  if (main.length) { for (var i = 0; i < main.length; i++) t += line(main[i]) + '\n'; } else t += '<i>пусто</i>\n';
  for (var f = 0; f < folders.length; f++) {
    var fl = folders[f];
    var inF = tasks.filter(function(x){ return x.folder_id === fl.id; });
    t += '\n<b>' + esc(fl.name) + ':</b>\n';
    if (inF.length) { for (var j = 0; j < inF.length; j++) t += line(inF[j]) + '\n'; } else t += '<i>пусто</i>\n';
  }

  var kc = isTimed ? 't' : 'z';
  var kb = [];
  kb.push([btn('➕ Создать задачу', 'xmk:' + kc), btn('✏️ Редактировать задачи', 'xed:' + kc)]);
  kb.push([btn('📁 Основные', 'xfo:' + kc + ':main')]);
  var row = [];
  for (var f2 = 0; f2 < folders.length; f2++) { row.push(btn('📁 ' + folders[f2].name, 'xfo:' + kc + ':' + folders[f2].id)); if (row.length === 2) { kb.push(row); row = []; } }
  if (row.length) kb.push(row);
  kb.push([btn('🗂 Редактировать папки', isTimed ? 'fold:m:timed' : 'fold:m:timeless')]);
  if (isTimed) {
    var allT = _or(await dbSelect(env, 'eb1_tasks', 'telegram_user_id=eq.' + uid + '&kind=eq.timed&archived=eq.false&status=neq.done&select=id,due_date,due_hour'), function(){ return []; });
    var odc = 0; for (var k = 0; k < allT.length; k++) { var dl2 = taskDeadlineUtc(allT[k], tz); if (dl2 && dl2.getTime() < now) odc++; }
    kb.push([btn('📛 Просроченные (' + odc + ')', 'tt:overdue')]);
  }
  kb.push([btn('🏠 Меню', 'nav:menu')]);
  await screen(env, ctx, t, ikb(kb));
}
timedMenu = async function(env, ctx){ return xSectionView(env, ctx, 'timed'); };
timelessMenu = async function(env, ctx){ return xSectionView(env, ctx, 'timeless'); };

/* ----- Открытие папки: задачи кнопками ----- */
async function xFolderOpen(env, ctx, kc, fid){
  var kind = kc === 't' ? 'timed' : 'timeless', isTimed = kind === 'timed', uid = ctx.uid, tz = ctx.user.tz, now = Date.now();
  var q = 'telegram_user_id=eq.' + uid + '&kind=eq.' + kind + '&archived=eq.false&status=neq.done&select=id,title,due_date,due_hour&order=created_at.desc';
  q += (fid === 'main') ? '&folder_id=is.null' : ('&folder_id=eq.' + fid);
  var tasks = _or(await dbSelect(env, 'eb1_tasks', q), function(){ return []; });
  if (isTimed) tasks = tasks.filter(function(x){ var dl = taskDeadlineUtc(x, tz); return dl && dl.getTime() >= now; });
  var name = 'Основные';
  if (fid !== 'main') { var fl = await dbOne(env, 'eb1_folders', 'id=eq.' + fid + '&select=name'); if (fl) name = fl.name; }
  var t = '📁 <b>' + esc(name) + '</b>\n';
  var kb = [];
  if (tasks.length) { for (var i = 0; i < tasks.length; i++) { var x = tasks[i]; var lbl = (isTimed && x.due_date) ? (fmtShort(x.due_date) + ' ' + x.title) : x.title; kb.push([btn(lbl.slice(0, 60), 'task:open:' + x.id)]); } }
  else t += '\n<i>нет задач</i>';
  kb.push([btn('⬅️ Назад', isTimed ? 'tt:menu' : 'bz:menu'), btn('🏠 Меню', 'nav:menu')]);
  await screen(env, ctx, t, ikb(kb));
}

/* ----- Редактировать задачи: переименовать/удалить ----- */
async function xEditList(env, ctx, kc){
  var kind = kc === 't' ? 'timed' : 'timeless', uid = ctx.uid;
  var tasks = _or(await dbSelect(env, 'eb1_tasks', 'telegram_user_id=eq.' + uid + '&kind=eq.' + kind + '&archived=eq.false&status=neq.done&select=id,title&order=created_at.desc'), function(){ return []; });
  var t = '✏️ <b>Редактировать задачи</b>';
  var kb = [];
  for (var i = 0; i < tasks.length; i++) { var x = tasks[i]; kb.push([btn('✏️ ' + x.title.slice(0, 28), 'task:ren:' + x.id), btn('🗑', 'task:del:' + x.id)]); }
  if (!tasks.length) t += '\n\n<i>нет задач</i>';
  kb.push([btn('⬅️ Назад', kind === 'timed' ? 'tt:menu' : 'bz:menu'), btn('🏠 Меню', 'nav:menu')]);
  await screen(env, ctx, t, ikb(kb));
}

/* ----- Все фото альбомом ----- */
async function xAllPhotos(env, ctx, id){
  var photos = _or(await dbSelect(env, 'eb1_task_photos', 'task_id=eq.' + id + '&select=file_id&order=id.asc'), function(){ return []; });
  if (!photos.length) return answer(env, ctx.cbId, 'Нет фото');
  try {
    if (photos.length === 1) await tg(env, 'sendPhoto', { chat_id: ctx.chatId, photo: photos[0].file_id });
    else await tg(env, 'sendMediaGroup', { chat_id: ctx.chatId, media: photos.slice(0, 10).map(function(p){ return { type: 'photo', media: p.file_id }; }) });
  } catch (e) { console.log('allphotos', e.message); }
  return answer(env, ctx.cbId);
}

/* ----- Карточка задачи (новый формат + фото-обложка с подписью и кнопками) ----- */
taskOpen = async function(env, ctx, id){
  var x = await dbOne(env, 'eb1_tasks', 'telegram_user_id=eq.' + ctx.uid + '&id=eq.' + id);
  if (!x) return showMenu(env, ctx);
  var tz = ctx.user.tz;
  var notes = _or(await dbSelect(env, 'eb1_task_notes', 'task_id=eq.' + id + '&select=text,created_at&order=created_at.asc'), function(){ return []; });
  var photos = _or(await dbSelect(env, 'eb1_task_photos', 'task_id=eq.' + id + '&select=file_id&order=id.asc'), function(){ return []; });

  var t = '';
  if (x.kind === 'timed') {
    var dl = '—';
    if (x.due_date) { dl = fmtDate(x.due_date); if (x.due_hour != null) dl += ' ' + _pad2(x.due_hour) + ':00'; }
    t += '🕒 <b>Срок:</b> ' + dl + '\n<b>' + esc(x.title) + '</b>\n';
  } else {
    t += '<b>' + esc(x.title) + '</b>\n';
  }
  if (notes.length) { t += '\n'; for (var i = 0; i < notes.length; i++) t += esc(notes[i].text) + '\n<i>' + fmtTs(new Date(notes[i].created_at), tz) + '</i>\n'; }
  if (x.kind !== 'timed') t += '\nСоздана ' + _createdRu(x.created_at, tz);

  var kb = [];
  kb.push([btn('✅ Выполнено', 'task:done:' + id), btn('📝 Заметка', 'task:note:' + id)]);
  if (x.kind === 'timed') kb.push([btn('📅 Перенести', 'task:move:' + id), btn('🔔 Напоминания', 'task:rem:' + id)]);
  var prow = [btn('📷 Добавить фото', 'task:photo:' + id)];
  if (photos.length) prow.push(btn('🗑 Фото (' + photos.length + ')', 'task:photos:' + id));
  kb.push(prow);
  if (photos.length > 1) kb.push([btn('🖼 Все фото (' + photos.length + ')', 'xallphotos:' + id)]);
  kb.push([btn('✏️ Изменить', 'task:edit:' + id), btn('🗑 Удалить', 'task:del:' + id)]);
  kb.push(navRow('nav:menu'));
  var markup = ikb(kb);

  if (photos.length) {
    if (ctx.msgId) { try { await tg(env, 'deleteMessage', { chat_id: ctx.chatId, message_id: ctx.msgId }); } catch (e) {} }
    var cap = t.length > 1000 ? (t.slice(0, 1000) + '…') : t;
    try { await tg(env, 'sendPhoto', { chat_id: ctx.chatId, photo: photos[0].file_id, caption: cap, parse_mode: 'HTML', reply_markup: markup }); }
    catch (e) { console.log('cardphoto', e.message); await send(env, ctx.chatId, t, markup); }
  } else {
    await screen(env, ctx, t, markup);
  }
};

/* ----- Роутер: новые префиксы ----- */
var _xPrevCb = handleCallback;
handleCallback = async function(env, ctx, data){
  var p = data.split(':');
  if (p[0] === 'xfo') return xFolderOpen(env, ctx, p[1], p[2]);
  if (p[0] === 'xed') return xEditList(env, ctx, p[1]);
  if (p[0] === 'xallphotos') return xAllPhotos(env, ctx, p[1]);
  if (p[0] === 'xmk') { var kind = p[1] === 't' ? 'timed' : 'timeless'; await setState(env, ctx.uid, 'x:newtitle', { kind: kind }); return send(env, ctx.chatId, 'Напиши название задачи:'); }
  return _xPrevCb(env, ctx, data);
};

/* ----- Текст: название для «Создать задачу» ----- */
var _xPrevHT = handleText;
handleText = async function(env, ctx, text){
  var st = await getState(env, ctx.uid);
  if (st.state === 'x:newtitle') {
    var title = text.trim(), low = title.toLowerCase();
    if (['меню', 'menu', 'отмена', 'cancel', 'стоп', 'назад'].indexOf(low) >= 0) { await clearState(env, ctx.uid); return showMenu(env, ctx); }
    var kind = (st.data && st.data.kind) ? st.data.kind : 'timeless';
    await clearState(env, ctx.uid);
    if (kind === 'timed') return wAskDate(env, ctx, { title: title, kind: 'timed' });
    return wAskFolder(env, ctx, { title: title, kind: 'timeless' });
  }
  return _xPrevHT(env, ctx, text);
};
/* ===== КОНЕЦ НАДСТРОЙКИ v4 ===== */
/* ===== НАДСТРОЙКА v5: безвременные задачи на главный экран ===== */
/* phone-safe: без запретных символов */
var _xHomePrev = buildHome;
buildHome = async function(env, uid, tz){
  var r = await _xHomePrev(env, uid, tz);
  var bz = _or(await dbSelect(env, 'eb1_tasks', 'telegram_user_id=eq.' + uid + '&kind=eq.timeless&archived=eq.false&status=neq.done&select=title&order=created_at.desc&limit=15'), function(){ return []; });
  var add = '\n\n♾️ <b>Безвременные:</b>\n';
  if (bz.length) { for (var i = 0; i < bz.length; i++) add += '• ' + esc(bz[i].title) + '\n'; }
  else add += '<i>нет</i>\n';
  return { text: r.text + add, kb: r.kb };
};
/* ===== КОНЕЦ НАДСТРОЙКИ v5 ===== */