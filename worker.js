const EXERCISES = {
  bench: ["Жим лёжа", "Грудь"],
  incline: ["Жим на наклонной", "Грудь"],
  machine_press: ["Жим в тренажёре", "Грудь"],
  pec_deck: ["Бабочка", "Грудь"],
  lat: ["Тяга верхнего блока", "Спина"],
  row: ["Тяга горизонтального блока", "Спина"],
  pullover: ["Пуловер", "Спина"],
  squat: ["Приседания", "Ноги"],
  leg_press: ["Платформа", "Ноги"],
  leg_ext: ["Разгибание ног", "Ноги"],
  calves: ["Икры", "Ноги"],
  lateral: ["Подъём гантелей", "Плечи"],
  rear: ["Бабочка на заднюю дельту", "Плечи"],
  zcurl: ["Подъём Z-грифа", "Руки"],
  scott: ["Скамья Скотта", "Руки"],
  triceps: ["Разгибание на блоке", "Руки"],
  hammer: ["Молотки", "Руки"],
  abs: ["Скручивания", "Пресс"],
  bike: ["Велосипед", "Кардио"],
  walk: ["Ходьба", "Кардио"],
  run: ["Бег", "Кардио"],
  ellipse: ["Эллипс", "Кардио"]
};

const GROUPS = {
  chest: ["💥 Грудь", ["bench", "incline", "machine_press", "pec_deck"]],
  back: ["🔙 Спина", ["lat", "row", "pullover"]],
  legs: ["🦵 Ноги", ["squat", "leg_press", "leg_ext", "calves"]],
  shoulders: ["🏋️ Плечи", ["lateral", "rear"]],
  arms: ["💪 Руки", ["zcurl", "scott", "triceps", "hammer"]],
  abs: ["🔥 Пресс", ["abs"]],
  cardio: ["🚴 Кардио", ["bike", "walk", "run", "ellipse"]]
};

export default {
  async fetch(request, env) {
    try {
      if (request.method === "GET") {
        return new Response("Gym Bot v1.0 работает 🚀");
      }

      if (request.method === "POST") {
        const update = await request.json();

        if (update.message) {
          await handleMessage(env, update.message);
        }

        if (update.callback_query) {
          await handleCallback(env, update.callback_query);
        }

        return new Response("ok");
      }

      return new Response("Method not allowed", { status: 405 });
    } catch (err) {
      return new Response("Worker error: " + err.message, { status: 500 });
    }
  }
};

async function handleMessage(env, msg) {
  const chatId = msg.chat.id;
  const text = (msg.text || "").trim();

  await ensureUser(env, msg.from);

  if (text === "/start" || text.toLowerCase() === "меню") {
    await sendMessage(env, chatId, "🏋️ Gym Bot v1.0\n\nГлавное меню:", mainMenu());
    return;
  }

  if (text.startsWith("/log ")) {
    await saveResultFromText(env, chatId, msg.from.id, text);
    return;
  }

  await sendMessage(
    env,
    chatId,
    "Пока управляй ботом через кнопки 👇\n\nДля записи результата:\n/log bench 80 8",
    mainMenu()
  );
}

async function handleCallback(env, cq) {
  const chatId = cq.message.chat.id;
  const msgId = cq.message.message_id;
  const data = cq.data;

  await answerCallback(env, cq.id);
  await ensureUser(env, cq.from);

  if (data === "menu") {
    await editMessage(env, chatId, msgId, "🏋️ Главное меню:", mainMenu());
    return;
  }

  if (data === "trainings") {
    await editMessage(env, chatId, msgId, "🏋️ Тренировки\n\nВыбери действие:", trainingsMenu());
    return;
  }

  if (data === "gym_checkin") {
    const r = await saveGymVisit(env, cq.from);

    await editMessage(
      env,
      chatId,
      msgId,
      r.ok
        ? "✅ Посещение сохранено!\n\nТренировка записана в базу данных."
        : "⚠️ Не смог сохранить посещение.\n\nСтатус: " + r.status + "\nОтвет: " + r.text,
      navMenu("trainings")
    );
    return;
  }

  if (data === "free_workout") {
    await editMessage(env, chatId, msgId, "🆓 Свободная тренировка\n\nВыбери группу мышц:", muscleGroupsMenu());
    return;
  }

  if (data.startsWith("group:")) {
    const groupId = data.replace("group:", "");
    const group = GROUPS[groupId];
    await editMessage(env, chatId, msgId, group[0] + "\n\nВыбери упражнение:", exercisesMenu(groupId));
    return;
  }

  if (data.startsWith("ex:")) {
    const exId = data.replace("ex:", "");
    await editMessage(env, chatId, msgId, exerciseText(exId), exerciseMenu(exId));
    return;
  }

  if (data.startsWith("hist:")) {
    const exId = data.replace("hist:", "");
    const text = await historyText(env, cq.from.id, exId);
    await editMessage(env, chatId, msgId, text, navMenu("ex:" + exId));
    return;
  }

  if (data.startsWith("log_help:")) {
    const exId = data.replace("log_help:", "");
    const ex = EXERCISES[exId];

    await editMessage(
      env,
      chatId,
      msgId,
      "✍️ Запись результата\n\n" +
        ex[0] +
        "\n\nОтправь отдельным сообщением:\n\n/log " +
        exId +
        " 80 8\n\nГде 80 — вес, 8 — повторы.",
      navMenu("ex:" + exId)
    );
    return;
  }

  if (data === "programs") {
    await editMessage(env, chatId, msgId, programsText(), navMenu("menu"));
    return;
  }

  if (data === "analytics") {
    const text = await analyticsText(env, cq.from.id);
    await editMessage(env, chatId, msgId, text, navMenu("menu"));
    return;
  }

  if (data === "profile") {
    await editMessage(env, chatId, msgId, profileText(cq.from), navMenu("menu"));
    return;
  }

  if (data === "friends") {
    await editMessage(env, chatId, msgId, friendsText(), navMenu("menu"));
    return;
  }

  if (data === "food_supps") {
    await editMessage(env, chatId, msgId, "🍽 Питание/БАДы\n\nВыбери раздел:", foodSuppsMenu());
    return;
  }

  if (data === "food") {
    await editMessage(env, chatId, msgId, nutritionText(), navMenu("food_supps"));
    return;
  }

  if (data === "supps") {
    await editMessage(env, chatId, msgId, "💊 Пей креатин, чувак. Пока на этом всё 💪", navMenu("food_supps"));
    return;
  }

  if (data === "timer_90") {
    await editMessage(env, chatId, msgId, "⏱ Таймер 90 секунд\n\nПока текстовый. Позже сделаем уведомление.", navMenu("trainings"));
    return;
  }
}

function mainMenu() {
  return {
    inline_keyboard: [
      [{ text: "🏋️ Тренировки", callback_data: "trainings" }],
      [{ text: "📋 Программы тренировок", callback_data: "programs" }],
      [{ text: "📊 Аналитика", callback_data: "analytics" }],
      [{ text: "👥 Друзья", callback_data: "friends" }],
      [{ text: "👤 Профиль", callback_data: "profile" }],
      [{ text: "🍽 Питание/БАДы", callback_data: "food_supps" }]
    ]
  };
}

function trainingsMenu() {
  return {
    inline_keyboard: [
      [{ text: "✅ Я в зале", callback_data: "gym_checkin" }],
      [{ text: "🆓 Свободная тренировка", callback_data: "free_workout" }],
      [{ text: "📋 Тренировка по программе", callback_data: "programs" }],
      [{ text: "🏠 В меню", callback_data: "menu" }]
    ]
  };
}

function muscleGroupsMenu() {
  return {
    inline_keyboard: [
      [{ text: "💥 Грудь", callback_data: "group:chest" }],
      [{ text: "🔙 Спина", callback_data: "group:back" }],
      [{ text: "🦵 Ноги", callback_data: "group:legs" }],
      [{ text: "🏋️ Плечи", callback_data: "group:shoulders" }],
      [{ text: "💪 Руки", callback_data: "group:arms" }],
      [{ text: "🔥 Пресс", callback_data: "group:abs" }],
      [{ text: "🚴 Кардио", callback_data: "group:cardio" }],
      [{ text: "⬅️ Назад", callback_data: "trainings" }, { text: "🏠 В меню", callback_data: "menu" }]
    ]
  };
}

function exercisesMenu(groupId) {
  const ids = GROUPS[groupId][1];
  const rows = ids.map((id) => [{ text: EXERCISES[id][0], callback_data: "ex:" + id }]);
  rows.push([{ text: "⬅️ Назад", callback_data: "free_workout" }, { text: "🏠 В меню", callback_data: "menu" }]);
  return { inline_keyboard: rows };
}

function exerciseText(exId) {
  const ex = EXERCISES[exId];

  return (
    "🏋️ " +
    ex[0] +
    "\n\nГруппа: " +
    ex[1] +
    "\n\nТехника:\n• двигайся подконтрольно\n• не гонись за весом\n• держи амплитуду\n• выдох на усилии\n\nФото добавим следующим этапом."
  );
}

function exerciseMenu(exId) {
  return {
    inline_keyboard: [
      [{ text: "✍️ Записать результат", callback_data: "log_help:" + exId }],
      [{ text: "📊 История", callback_data: "hist:" + exId }],
      [{ text: "⏱ Таймер 90 сек", callback_data: "timer_90" }],
      [{ text: "⬅️ Назад", callback_data: "free_workout" }, { text: "🏠 В меню", callback_data: "menu" }]
    ]
  };
}

function navMenu(backTo) {
  return {
    inline_keyboard: [[{ text: "⬅️ Назад", callback_data: backTo }, { text: "🏠 В меню", callback_data: "menu" }]]
  };
}

function foodSuppsMenu() {
  return {
    inline_keyboard: [
      [{ text: "🍽 Питание", callback_data: "food" }],
      [{ text: "💊 БАДы", callback_data: "supps" }],
      [{ text: "⬅️ Назад", callback_data: "menu" }, { text: "🏠 В меню", callback_data: "menu" }]
    ]
  };
}

function programsText() {
  return "📋 Программы тренировок\n\nСкоро добавим:\n• 10 фуллбади\n• 10 сплитов\n• программы с упором\n• свои программы\n• прогрессию в жиме";
}

function friendsText() {
  return "👥 Друзья\n\nСкоро добавим:\n• добавить друга по ID\n• заявки в друзья\n• разрешение смотреть тренировки\n• сообщение друзьям";
}

function profileText(from) {
  return (
    "👤 Профиль\n\n" +
    "Имя: " +
    (from.first_name || "—") +
    "\nUsername: " +
    (from.username ? "@" + from.username : "—") +
    "\nID: " +
    from.id +
    "\n\nСкоро добавим рост, вес, возраст, уровень и приватность."
  );
}

function nutritionText() {
  return (
    "🍽 ПИТАНИЕ — без занудства\n\n" +
    "Слушай сюда, чемпион 🦾\n\n" +
    "🥩 Белок — это святое.\n2+ грамма белка на кг веса.\n\n" +
    "🥑 Жиры — нужны, но без фанатизма.\nОколо 1–1.2 г на кг веса.\n\n" +
    "🍚 Углеводы — рубильник «сушка / масса».\n• Сушка → углеводы вниз 📉\n• Масса → углеводы вверх 📈\n\n" +
    "😴 Сон.\nСпи 7–9 часов. Мышцы растут не в зале, а пока ты спишь 💪"
  );
}

async function saveGymVisit(env, from) {
  await ensureUser(env, from);

  const res = await fetch(env.SUPABASE_URL + "/rest/v1/gym_visits", {
    method: "POST",
    headers: supabaseHeaders(env, "return=representation"),
    body: JSON.stringify({
      user_id: from.id
    })
  });

  return {
    ok: res.ok,
    status: res.status,
    text: await res.text()
  };
}

async function ensureUser(env, from) {
  if (!from) return;

  await fetch(env.SUPABASE_URL + "/rest/v1/users?on_conflict=id", {
    method: "POST",
    headers: supabaseHeaders(env, "resolution=merge-duplicates"),
    body: JSON.stringify({
      id: from.id,
      username: from.username || null,
      first_name: from.first_name || null,
      last_name: from.last_name || null
    })
  });
}

async function saveResultFromText(env, chatId, userId, text) {
  const parts = text.split(" ");
  const exId = parts[1];
  const weight = Number(parts[2]);
  const reps = Number(parts[3]);

  if (!exId || !EXERCISES[exId] || !weight || !reps) {
    await sendMessage(env, chatId, "❌ Формат такой:\n/log bench 80 8", mainMenu());
    return;
  }

  const ex = EXERCISES[exId];

  const res = await fetch(env.SUPABASE_URL + "/rest/v1/workout_results", {
    method: "POST",
    headers: supabaseHeaders(env, "return=representation"),
    body: JSON.stringify({
      telegram_id: userId,
      exercise: ex[0],
      weight,
      reps
    })
  });

  if (!res.ok) {
    await sendMessage(env, chatId, "⚠️ Не сохранилось.\nСтатус: " + res.status + "\n" + (await res.text()), mainMenu());
    return;
  }

  await sendMessage(env, chatId, "✅ Записал!\n\n" + ex[0] + ": " + weight + " кг × " + reps, {
    inline_keyboard: [
      [{ text: "📊 История", callback_data: "hist:" + exId }],
      [{ text: "🏠 В меню", callback_data: "menu" }]
    ]
  });
}

async function historyText(env, userId, exId) {
  const ex = EXERCISES[exId];

  const rows = await supabaseGet(
    env,
    "workout_results?telegram_id=eq." +
      userId +
      "&exercise=eq." +
      encodeURIComponent(ex[0]) +
      "&select=weight,reps,created_at&order=created_at.desc&limit=10"
  );

  let text = "📊 История\n\n" + ex[0] + "\n";

  if (!rows || rows.length === 0) {
    return text + "\nПока нет записей.";
  }

  for (const r of rows) {
    const d = new Date(r.created_at).toLocaleDateString("ru-RU");
    text += "\n• " + d + " — " + r.weight + " кг × " + r.reps;
  }

  return text;
}

async function analyticsText(env, userId) {
  const visits = await supabaseGet(env, "gym_visits?user_id=eq." + userId + "&select=id");
  const results = await supabaseGet(env, "workout_results?telegram_id=eq." + userId + "&select=id");

  return (
    "📊 Аналитика\n\n" +
    "Посещений зала: " +
    (visits ? visits.length : 0) +
    "\nЗаписей результатов: " +
    (results ? results.length : 0) +
    "\n\nГрафики добавим следующим этапом."
  );
}

async function supabaseGet(env, path) {
  const res = await fetch(env.SUPABASE_URL + "/rest/v1/" + path, {
    method: "GET",
    headers: supabaseHeaders(env)
  });

  if (!res.ok) return [];
  return await res.json();
}

function supabaseHeaders(env, prefer) {
  const headers = {
    apikey: env.SUPABASE_KEY,
    Authorization: "Bearer " + env.SUPABASE_KEY,
    "Content-Type": "application/json"
  };

  if (prefer) headers.Prefer = prefer;

  return headers;
}

async function sendMessage(env, chatId, text, keyboard) {
  const payload = { chat_id: chatId, text };
  if (keyboard) payload.reply_markup = keyboard;

  await fetch("https://api.telegram.org/bot" + env.BOT_TOKEN + "/sendMessage", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });
}

async function editMessage(env, chatId, msgId, text, keyboard) {
  const payload = { chat_id: chatId, message_id: msgId, text };
  if (keyboard) payload.reply_markup = keyboard;

  await fetch("https://api.telegram.org/bot" + env.BOT_TOKEN + "/editMessageText", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });
}

async function answerCallback(env, callbackId) {
  await fetch("https://api.telegram.org/bot" + env.BOT_TOKEN + "/answerCallbackQuery", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackId })
  });
}