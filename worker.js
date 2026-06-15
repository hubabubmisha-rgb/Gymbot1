const VISIT_COOLDOWN_HOURS = 3;

const EX = {
  bench: ["Жим лёжа", "Грудь"],
  incline_bench: ["Жим на наклонной", "Грудь"],
  machine_press: ["Жим в тренажёре", "Грудь"],
  pec_deck: ["Бабочка", "Грудь"],
  crossover: ["Кроссовер", "Грудь"],
  dumbbell_press: ["Жим гантелей лёжа", "Грудь"],

  lat_pulldown: ["Тяга верхнего блока", "Спина"],
  lat_machine: ["Тяга верхнего блока в тренажёре", "Спина"],
  seated_row: ["Тяга горизонтального блока", "Спина"],
  pullover: ["Пуловер", "Спина"],
  pullups: ["Подтягивания", "Спина"],
  dumbbell_row: ["Тяга гантели одной рукой", "Спина"],

  squat: ["Приседания", "Ноги"],
  leg_press: ["Платформа", "Ноги"],
  leg_ext: ["Разгибание на квадрицепс", "Ноги"],
  leg_curl: ["Задняя поверхность бедра в тренажёре", "Ноги"],
  calves: ["Икры", "Ноги"],
  lunges: ["Выпады", "Ноги"],
  romanian: ["Румынская тяга", "Ноги"],

  shoulder_press: ["Жим гантелей сидя", "Плечи", "Передняя дельта"],
  front_raise: ["Подъём перед собой", "Плечи", "Передняя дельта"],
  lateral_raise: ["Подъём гантелей", "Плечи", "Средняя дельта"],
  cable_lateral: ["Разгибание в кроссовере", "Плечи", "Средняя дельта"],
  rear_deck: ["Бабочка на заднюю дельту", "Плечи", "Задняя дельта"],
  face_pull: ["Тяга каната к лицу", "Плечи", "Задняя дельта"],

  scott: ["Скамья Скотта", "Руки", "Бицепс"],
  zbar_curl: ["Подъём Z-грифа", "Руки", "Бицепс"],
  dumbbell_sitting: ["Гантели сидя", "Руки", "Бицепс"],
  dumbbell_standing: ["Гантели стоя", "Руки", "Бицепс"],
  hammer: ["Молотки", "Руки", "Предплечье"],
  reverse_curl: ["Подъём обратным хватом", "Руки", "Предплечье"],
  farmer: ["Фермерская прогулка", "Руки", "Предплечье"],
  triceps_pushdown: ["Разгибание на блоке", "Руки", "Трицепс"],
  overhead_triceps: ["Разгибание на блоке из-за головы", "Руки", "Трицепс"],
  french_press: ["Французский жим", "Руки", "Трицепс"],
  close_grip: ["Узкий жим", "Руки", "Трицепс"],

  crunch: ["Скручивания", "Пресс"],
  leg_raise: ["Подъём ног", "Пресс"],
  plank: ["Планка", "Пресс"],

  bike: ["Велосипед", "Кардио"],
  walk: ["Ходьба", "Кардио"],
  run: ["Бег", "Кардио"],
  ellipse: ["Эллипс", "Кардио"]
};

const GROUPS = {
  chest: ["Грудь", ["bench", "incline_bench", "machine_press", "pec_deck", "crossover", "dumbbell_press"]],
  back: ["Спина", ["lat_pulldown", "lat_machine", "seated_row", "pullover", "pullups", "dumbbell_row"]],
  legs: ["Ноги", ["squat", "leg_press", "leg_ext", "leg_curl", "calves", "lunges", "romanian"]],
  abs: ["Пресс", ["crunch", "leg_raise", "plank"]],
  cardio: ["Кардио", ["bike", "walk", "run", "ellipse"]]
};

const SUBGROUPS = {
  shoulders: {
    title: "Плечи",
    subs: {
      front: ["Передняя дельта", ["shoulder_press", "front_raise"]],
      middle: ["Средняя дельта", ["lateral_raise", "cable_lateral"]],
      rear: ["Задняя дельта", ["rear_deck", "face_pull"]]
    }
  },
  arms: {
    title: "Руки",
    subs: {
      biceps: ["Бицепс", ["scott", "zbar_curl", "dumbbell_sitting", "dumbbell_standing"]],
      triceps: ["Трицепс", ["triceps_pushdown", "overhead_triceps", "french_press", "close_grip"]],
      forearm: ["Предплечье", ["hammer", "reverse_curl", "farmer"]]
    }
  }
};

const PROGRAMS = {
  fb_beginner: p("Фуллбади: новичок", [
    ["Жим лёжа 3x8", "Тяга верхнего блока 3x10", "Приседания 3x8", "Подъём гантелей 3x12", "Разгибание на блоке 2x12", "Скамья Скотта 2x12"],
    ["Жим на наклонной 3x10", "Тяга горизонтального блока 3x10", "Платформа 3x12", "Бабочка на заднюю дельту 3x15", "Молотки 2x12", "Французский жим 2x12"]
  ]),
  fb_classic: p("Фуллбади: классика", [
    ["Жим лёжа 4x8", "Тяга верхнего блока 4x10", "Платформа 4x10", "Подъём гантелей 3x12", "Подъём Z-грифа 3x10", "Разгибание на блоке 3x10"],
    ["Жим на наклонной 4x10", "Тяга горизонтального блока 4x10", "Приседания 4x8", "Бабочка 3x12", "Гантели сидя 3x10", "Французский жим 3x10"]
  ]),
  fb_chest: p("Фуллбади: упор грудь", [
    ["Жим лёжа 4x8", "Жим на наклонной 4x10", "Бабочка 3x15", "Тяга верхнего блока 3x10", "Платформа 3x12", "Разгибание на блоке 3x12"],
    ["Жим в тренажёре 4x10", "Кроссовер 3x15", "Тяга горизонтального блока 3x10", "Разгибание ног 3x12", "Подъём гантелей 3x15", "Скамья Скотта 3x12"]
  ]),
  fb_back: p("Фуллбади: упор спина", [
    ["Тяга верхнего блока 4x10", "Тяга горизонтального блока 4x10", "Пуловер 3x12", "Жим лёжа 3x10", "Платформа 3x12", "Молотки 3x12"],
    ["Тяга верхнего блока в тренажёре 4x10", "Тяга гантели одной рукой 3x10", "Подтягивания 3 подхода", "Жим на наклонной 3x10", "Задняя поверхность бедра 3x12", "Бабочка на заднюю дельту 3x15"]
  ]),
  fb_legs: p("Фуллбади: упор ноги", [
    ["Приседания 4x8", "Платформа 4x10", "Разгибание ног 3x12", "Задняя поверхность бедра 3x12", "Жим лёжа 3x10", "Тяга верхнего блока 3x10"],
    ["Платформа 4x12", "Румынская тяга 3x10", "Икры 4x15", "Жим на наклонной 3x10", "Тяга горизонтального блока 3x10", "Подъём гантелей 3x15"]
  ]),
  fb_shoulders: p("Фуллбади: упор плечи", [
    ["Жим гантелей сидя 4x8", "Подъём гантелей 4x15", "Бабочка на заднюю дельту 4x15", "Жим лёжа 3x10", "Тяга верхнего блока 3x10", "Платформа 3x12"],
    ["Разгибание в кроссовере 4x15", "Тяга каната к лицу 4x15", "Жим на наклонной 3x10", "Тяга горизонтального блока 3x10", "Приседания 3x8", "Разгибание на блоке 3x12"]
  ]),
  fb_arms: p("Фуллбади: упор руки", [
    ["Подъём Z-грифа 4x10", "Скамья Скотта 3x12", "Разгибание на блоке 4x10", "Французский жим 3x10", "Жим лёжа 3x8", "Тяга верхнего блока 3x10"],
    ["Гантели сидя 3x12", "Молотки 3x12", "Разгибание из-за головы 3x12", "Узкий жим 3x8", "Платформа 3x12", "Подъём гантелей 3x15"]
  ]),
  fb_strength: p("Фуллбади: силовая", [
    ["Жим лёжа 5x5", "Приседания 5x5", "Тяга верхнего блока 4x8", "Жим гантелей сидя 4x6", "Подъём Z-грифа 3x8", "Разгибание на блоке 3x8"],
    ["Жим на наклонной 4x6", "Платформа 5x8", "Тяга горизонтального блока 4x8", "Французский жим 3x8", "Скамья Скотта 3x8"]
  ]),
  fb_home: p("Фуллбади: дом", [
    ["Отжимания 4 подхода", "Выпады 4x12", "Планка 3 подхода", "Скручивания 4x15", "Бег или ходьба 20-30 мин"],
    ["Приседания без веса 4x20", "Отжимания узкие 4 подхода", "Подъём ног 4x12", "Планка 3 подхода", "Ходьба 30 мин"]
  ]),
  fb_fatloss: p("Фуллбади: жиросжигание", [
    ["Платформа 4x15", "Жим в тренажёре 3x12", "Тяга верхнего блока 3x12", "Подъём гантелей 3x15", "Скручивания 3x20", "Кардио 20 мин"],
    ["Приседания 4x12", "Жим на наклонной 3x12", "Тяга горизонтального блока 3x12", "Бабочка 3x15", "Планка 3 подхода", "Кардио 20 мин"]
  ]),
  split_ppl: p("Сплит: Push / Pull / Legs", [
    ["Push", "Жим лёжа 4x8", "Жим на наклонной 4x10", "Жим гантелей сидя 3x10", "Подъём гантелей 3x15", "Разгибание на блоке 4x12"],
    ["Pull", "Тяга верхнего блока 4x10", "Тяга горизонтального блока 4x10", "Пуловер 3x12", "Бабочка на заднюю дельту 3x15", "Подъём Z-грифа 3x12"],
    ["Legs", "Приседания 4x8", "Платформа 4x12", "Разгибание ног 3x15", "Задняя поверхность бедра 3x12", "Икры 4x15"]
  ]),
  split_upper_lower: p("Сплит: верх / низ", [
    ["Верх", "Жим лёжа 4x8", "Тяга верхнего блока 4x10", "Жим на наклонной 3x10", "Тяга горизонтального блока 3x10", "Подъём гантелей 3x15", "Руки 4 упражнения"],
    ["Низ", "Приседания 4x8", "Платформа 4x12", "Разгибание ног 3x15", "Задняя поверхность бедра 3x12", "Икры 4x15", "Пресс 3 подхода"]
  ]),
  split_classic: p("Сплит: грудь / спина / ноги", [
    ["Грудь", "Жим лёжа 4x8", "Жим на наклонной 4x10", "Жим в тренажёре 3x10", "Бабочка 3x15"],
    ["Спина", "Тяга верхнего блока 4x10", "Тяга горизонтального блока 4x10", "Тяга верхнего блока в тренажёре 3x10", "Пуловер 3x12"],
    ["Ноги", "Приседания 4x8", "Платформа 4x12", "Разгибание ног 3x15", "Задняя поверхность бедра 3x12", "Икры 4x15"]
  ]),
  split_chest: p("Сплит: упор грудь", [
    ["Грудь тяжёлая", "Жим лёжа 5x5", "Жим на наклонной 4x8", "Жим в тренажёре 3x10", "Бабочка 3x15"],
    ["Спина + руки", "Тяга верхнего блока 4x10", "Тяга горизонтального блока 4x10", "Скамья Скотта 3x12", "Разгибание на блоке 3x12"],
    ["Грудь объёмная", "Жим на наклонной 4x10", "Жим гантелей лёжа 3x12", "Кроссовер 3x15", "Бабочка 3x15"],
    ["Ноги + плечи", "Платформа 4x12", "Приседания 3x8", "Подъём гантелей 4x15", "Бабочка на заднюю дельту 3x15"]
  ]),
  split_back: p("Сплит: упор спина", [
    ["Спина ширина", "Тяга верхнего блока 5x10", "Тяга верхнего блока в тренажёре 4x10", "Пуловер 4x12"],
    ["Грудь + плечи", "Жим лёжа 4x8", "Жим на наклонной 3x10", "Подъём гантелей 4x15"],
    ["Спина толщина", "Тяга горизонтального блока 5x10", "Тяга гантели одной рукой 4x10", "Бабочка на заднюю дельту 4x15"],
    ["Ноги + руки", "Платформа 4x12", "Разгибание ног 3x15", "Подъём Z-грифа 3x12", "Разгибание на блоке 3x12"]
  ]),
  split_legs: p("Сплит: упор ноги", [
    ["Ноги тяжело", "Приседания 5x5", "Платформа 4x10", "Разгибание ног 3x15", "Икры 4x15"],
    ["Верх", "Жим лёжа 4x8", "Тяга верхнего блока 4x10", "Подъём гантелей 3x15", "Руки 4 упражнения"],
    ["Ноги объём", "Платформа 5x12", "Задняя поверхность бедра 4x12", "Выпады 3x12", "Икры 4x20"]
  ]),
  split_shoulders: p("Сплит: упор плечи", [
    ["Плечи тяжело", "Жим гантелей сидя 4x8", "Подъём гантелей 4x12", "Бабочка на заднюю дельту 4x15"],
    ["Грудь + трицепс", "Жим лёжа 4x8", "Жим на наклонной 3x10", "Разгибание на блоке 4x12"],
    ["Спина + бицепс", "Тяга верхнего блока 4x10", "Тяга горизонтального блока 4x10", "Подъём Z-грифа 4x12"],
    ["Плечи объём", "Разгибание в кроссовере 4x15", "Тяга каната к лицу 4x15", "Подъём перед собой 3x12"]
  ]),
  split_arms: p("Сплит: упор руки", [
    ["Бицепс + трицепс", "Подъём Z-грифа 4x10", "Скамья Скотта 3x12", "Разгибание на блоке 4x10", "Французский жим 3x10"],
    ["Грудь + спина", "Жим лёжа 4x8", "Тяга верхнего блока 4x10", "Жим на наклонной 3x10", "Тяга горизонтального блока 3x10"],
    ["Ноги + плечи", "Платформа 4x12", "Приседания 3x8", "Подъём гантелей 4x15", "Бабочка на заднюю дельту 3x15"],
    ["Руки объём", "Гантели сидя 3x12", "Молотки 3x12", "Разгибание из-за головы 3x12", "Узкий жим 3x8", "Фермерская прогулка 3 подхода"]
  ]),
  split_beginner: p("Сплит: новичок", [
    ["Верх", "Жим лёжа 3x10", "Тяга верхнего блока 3x10", "Жим в тренажёре 3x12", "Тяга горизонтального блока 3x12", "Подъём гантелей 3x15"],
    ["Низ", "Платформа 4x12", "Разгибание ног 3x15", "Задняя поверхность бедра 3x12", "Икры 4x15", "Скручивания 3x15"]
  ]),
  split_bench: p("Сплит: силовой жим", [
    ["Жим тяжёлый", "Жим лёжа 5x5", "Жим на наклонной 4x6", "Узкий жим 4x6", "Разгибание на блоке 3x10"],
    ["Спина", "Тяга верхнего блока 4x8", "Тяга горизонтального блока 4x8", "Пуловер 3x12", "Бабочка на заднюю дельту 4x15"],
    ["Жим объём", "Жим лёжа 4x8", "Жим в тренажёре 4x10", "Бабочка 3x15", "Французский жим 3x10"],
    ["Ноги + плечи", "Приседания 4x8", "Платформа 4x12", "Жим гантелей сидя 3x10", "Подъём гантелей 3x15"]
  ])
};

export default {
  async fetch(request, env) {
    try {
      if (request.method === "GET") return new Response("Gym Bot v3 работает");
      if (request.method === "POST") {
        const update = await request.json();
        if (update.message) await handleMessage(env, update.message);
        if (update.callback_query) await handleCallback(env, update.callback_query);
        return new Response("ok");
      }
      return new Response("Method not allowed", { status: 405 });
    } catch (e) {
      return new Response("Worker error: " + e.message, { status: 500 });
    }
  }
};

function p(name, days) {
  return { name, days };
}

async function handleMessage(env, msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const text = (msg.text || "").trim();

  await ensureUser(env, msg.from);
  const st = await getState(env, userId);

  if (text === "/start" || text.toLowerCase() === "меню") {
    await clearState(env, userId);
    return sendMessage(env, chatId, mainText(msg.from), mainMenu());
  }

  if (st?.state === "set_input") return handleSetInput(env, msg, st);
  if (st?.state === "set_note") return handleSetNote(env, msg, st);
  if (st?.state === "friend_add") return handleFriendAdd(env, msg);
  if (st?.state === "custom_name") return handleCustomName(env, msg);
  if (st?.state === "prof_height") return handleProfInput(env, msg, "height");
  if (st?.state === "prof_weight") return handleProfInput(env, msg, "weight");
  if (st?.state === "prof_age") return handleProfInput(env, msg, "age");
  if (st?.state === "water_custom") return handleWaterCustom(env, msg);
  if (st?.state === "water_goal") return handleWaterGoal(env, msg);

  return sendMessage(env, chatId, "Используй кнопки ниже 👇", mainMenu());
}

async function handleCallback(env, cq) {
  const chatId = cq.message.chat.id;
  const msgId = cq.message.message_id;
  const userId = cq.from.id;
  const data = cq.data;

  await answerCallback(env, cq.id);
  await ensureUser(env, cq.from);

  if (data === "menu") return editMessage(env, chatId, msgId, mainText(cq.from), mainMenu());
  if (data === "trainings") return editMessage(env, chatId, msgId, "🏋️ Тренировки", trainingsMenu());
  if (data === "free") {
    await ensureVisitOncePer3Hours(env, cq.from);
    return editMessage(env, chatId, msgId, "Свободная тренировка\n\nВыбери группу:", muscleGroupsMenu());
  }
  if (data === "log") {
    await ensureVisitOncePer3Hours(env, cq.from);
    return editMessage(env, chatId, msgId, "Записать результат\n\nВыбери упражнение:", muscleGroupsMenu());
  }

  if (data.startsWith("group:")) {
    const g = data.split(":")[1];
    if (SUBGROUPS[g]) return editMessage(env, chatId, msgId, SUBGROUPS[g].title + "\n\nВыбери раздел:", subGroupsMenu(g));
    return editMessage(env, chatId, msgId, GROUPS[g][0] + "\n\nВыбери упражнение:", exercisesMenu(GROUPS[g][1], "free"));
  }

  if (data.startsWith("sub:")) {
    const [, g, s] = data.split(":");
    const sub = SUBGROUPS[g].subs[s];
    return editMessage(env, chatId, msgId, sub[0] + "\n\nВыбери упражнение:", exercisesMenu(sub[1], "group:" + g));
  }

  if (data.startsWith("ex:")) {
    const id = data.split(":")[1];
    return editMessage(env, chatId, msgId, await exerciseText(env, userId, id), exerciseMenu(id));
  }

  if (data.startsWith("set:")) {
    const id = data.split(":")[1];
    await setState(env, userId, "set_input", { exercise_id: id });
    return editMessage(env, chatId, msgId, "Запись подхода\n\n" + EX[id][0] + "\n\nВведи вес и повторы одним сообщением.\n\nПример: 80 8", navMenu("ex:" + id));
  }

  if (data.startsWith("hist:")) {
    const id = data.split(":")[1];
    return editMessage(env, chatId, msgId, await historyText(env, userId, id), navMenu("ex:" + id));
  }

  if (data.startsWith("note:")) {
    const id = data.split(":")[1];
    await setState(env, userId, "set_note", { exercise_id: id });
    const existing = await getNote(env, userId, id);
    return editMessage(env, chatId, msgId,
      "✏️ Заметка к упражнению\n\n" + EX[id][0] +
      (existing ? "\n\nТекущая заметка:\n" + existing : "\n\nЗаметки пока нет.") +
      "\n\nНапиши новый текст одним сообщением (заменит старый).",
      navMenu("ex:" + id));
  }

  if (data === "programs") return editMessage(env, chatId, msgId, "📋 Программы тренировок", programsMenu());
  if (data === "program_full") return editMessage(env, chatId, msgId, "Фуллбади:", programListMenu("fb"));
  if (data === "program_split") return editMessage(env, chatId, msgId, "Сплиты:", programListMenu("split"));
  if (data.startsWith("program:")) {
    const id = data.split(":")[1];
    await ensureVisitOncePer3Hours(env, cq.from);
    return editMessage(env, chatId, msgId, programText(id), programMenu(id));
  }
  if (data.startsWith("saveprog:")) {
    const id = data.split(":")[1];
    await saveProgram(env, userId, PROGRAMS[id].name, "suggested", PROGRAMS[id]);
    return editMessage(env, chatId, msgId, "✅ Программа сохранена в Мои тренировки:\n\n" + PROGRAMS[id].name, navMenu("my_trainings"));
  }

  if (data === "my_trainings") return editMessage(env, chatId, msgId, await myTrainingsText(env, userId), await myTrainingsMenu(env, userId));
  if (data.startsWith("myprog:")) {
    const id = data.split(":")[1];
    return editMessage(env, chatId, msgId, await customProgramText(env, id), customProgramMenu(id));
  }
  if (data.startsWith("delprog:")) {
    const id = data.split(":")[1];
    await supabaseDelete(env, "custom_programs?id=eq." + id);
    return editMessage(env, chatId, msgId, "Программа удалена.", navMenu("my_trainings"));
  }
  if (data === "custom_program") {
    await setState(env, userId, "custom_name", {});
    return editMessage(env, chatId, msgId, "Создание своей программы\n\nНапиши название программы одним сообщением.", navMenu("my_trainings"));
  }

  if (data === "pick") {
    await setState(env, userId, "pick", {});
    return editMessage(env, chatId, msgId, "Подбор тренировки\n\nКак тренируем ноги?", pickMenu("legs"));
  }
  if (data.startsWith("pick:")) return handlePick(env, cq, data);

  if (data === "analytics") return editMessage(env, chatId, msgId, await analyticsText(env, userId), navMenu("menu"));

  // ---------- Профиль ----------
  if (data === "profile") return editMessage(env, chatId, msgId, await profileText(env, cq.from), profileMenu());
  if (data === "profile_edit") {
    await setState(env, userId, "prof_height", {});
    return editMessage(env, chatId, msgId, "✏️ Заполнение профиля\n\nВведи рост в сантиметрах (например 175).", navMenu("profile"));
  }
  if (data.startsWith("prof_sex:")) {
    const sex = data.split(":")[1];
    await supabasePatch(env, "users?id=eq." + userId, { sex });
    return editMessage(env, chatId, msgId, "Пол сохранён.\n\nКакой у тебя уровень активности?", activityMenu());
  }
  if (data.startsWith("prof_activity:")) {
    const activity = data.split(":")[1];
    await supabasePatch(env, "users?id=eq." + userId, { activity });
    await clearState(env, userId);
    return editMessage(env, chatId, msgId, await profileText(env, cq.from), profileMenu());
  }

  // ---------- Приватность ----------
  if (data === "privacy") return editMessage(env, chatId, msgId, "🔒 Приватность\n\nЧто видят друзья. Нажми, чтобы переключить.", await privacyMenu(env, userId));
  if (data.startsWith("priv:")) {
    const field = "priv_" + data.split(":")[1];
    const u = await getUser(env, userId);
    const cur = u && u[field] !== false;
    await supabasePatch(env, "users?id=eq." + userId, { [field]: !cur });
    return editMessage(env, chatId, msgId, "🔒 Приватность\n\nЧто видят друзья. Нажми, чтобы переключить.", await privacyMenu(env, userId));
  }

  // ---------- Восстановление ----------
  if (data === "recovery") return editMessage(env, chatId, msgId, "🧖 Восстановление\n\nСон и баня — половина результата. Выбери раздел:", recoveryMenu());
  if (data === "rec_sleep") return editMessage(env, chatId, msgId, sleepText(), navMenu("recovery"));
  if (data === "rec_sauna") return editMessage(env, chatId, msgId, saunaText(), navMenu("recovery"));

  // ---------- Друзья ----------
  if (data === "friends") return editMessage(env, chatId, msgId, "👥 Друзья", friendsMenu());
  if (data === "friend_add") {
    await setState(env, userId, "friend_add", {});
    return editMessage(env, chatId, msgId, "Добавить друга\n\nПопроси друга открыть Профиль и прислать тебе ID.\n\nВведи ID друга сообщением.", navMenu("friends"));
  }
  if (data === "friend_list") return editMessage(env, chatId, msgId, await friendListText(env, userId), navMenu("friends"));
  if (data === "friend_requests") return editMessage(env, chatId, msgId, await friendRequestsText(env, userId), navMenu("friends"));
  if (data === "friend_privacy") return editMessage(env, chatId, msgId, "🔒 Приватность\n\nЧто видят друзья. Нажми, чтобы переключить.", await privacyMenu(env, userId));
  if (data === "friend_msg") return editMessage(env, chatId, msgId, "✉️ Сообщение друзьям\n\nРассылка всем друзьям подключается в Фазе 4 (вместе с принятием заявок и совместной тренировкой).", navMenu("friends"));

  // ---------- Питание и БАДы ----------
  if (data === "food_supps") return editMessage(env, chatId, msgId, "🍽 Питание и БАДы", foodMenu());
  if (data === "food_principles") return editMessage(env, chatId, msgId, nutritionText(), navMenu("food_supps"));
  if (data === "food_recipes") return editMessage(env, chatId, msgId, "🥗 Рецепты\n\nВыбери приём пищи:", recipesMenu());
  if (data.startsWith("recipe:")) return editMessage(env, chatId, msgId, recipeText(data.split(":")[1]), navMenu("food_recipes"));
  if (data === "supps") return editMessage(env, chatId, msgId, suppsText(), navMenu("food_supps"));

  // ---------- Вода ----------
  if (data === "water") return editMessage(env, chatId, msgId, await waterText(env, userId), waterMenu());
  if (data.startsWith("water_add:")) {
    await addWater(env, userId, Number(data.split(":")[1]));
    return editMessage(env, chatId, msgId, await waterText(env, userId), waterMenu());
  }
  if (data === "water_custom") {
    await setState(env, userId, "water_custom", {});
    return editMessage(env, chatId, msgId, "💧 Введи объём в мл (например 300).", navMenu("water"));
  }
  if (data === "water_goal") {
    await setState(env, userId, "water_goal", {});
    return editMessage(env, chatId, msgId, "🎯 Введи дневную цель по воде в мл (например 2500).", navMenu("water"));
  }
}

// ===================== МЕНЮ =====================

function mainText(from) {
  return "🏠 Главное меню\n\nПривет, " + (from.first_name || "друг") + "! 💪 Что делаем сегодня?";
}

function mainMenu() {
  return { inline_keyboard: [
    [{ text: "🏋️ Тренировки", callback_data: "trainings" }],
    [{ text: "📋 Программы тренировок", callback_data: "programs" }],
    [{ text: "📊 Аналитика", callback_data: "analytics" }],
    [{ text: "🍽 Питание и БАДы", callback_data: "food_supps" }],
    [{ text: "🧖 Восстановление", callback_data: "recovery" }],
    [{ text: "👥 Друзья", callback_data: "friends" }],
    [{ text: "👤 Профиль", callback_data: "profile" }]
  ]};
}

function trainingsMenu() {
  return { inline_keyboard: [
    [{ text: "Свободная тренировка", callback_data: "free" }],
    [{ text: "Записать результат", callback_data: "log" }],
    [{ text: "Тренировка по программе", callback_data: "programs" }],
    [{ text: "Главное меню", callback_data: "menu" }]
  ]};
}

function muscleGroupsMenu() {
  return { inline_keyboard: [
    [{ text: "Грудь", callback_data: "group:chest" }],
    [{ text: "Спина", callback_data: "group:back" }],
    [{ text: "Ноги", callback_data: "group:legs" }],
    [{ text: "Плечи", callback_data: "group:shoulders" }],
    [{ text: "Руки", callback_data: "group:arms" }],
    [{ text: "Пресс", callback_data: "group:abs" }],
    [{ text: "Кардио", callback_data: "group:cardio" }],
    [{ text: "Назад", callback_data: "trainings" }, { text: "Главное меню", callback_data: "menu" }]
  ]};
}

function subGroupsMenu(g) {
  const rows = Object.keys(SUBGROUPS[g].subs).map(s => [{ text: SUBGROUPS[g].subs[s][0], callback_data: "sub:" + g + ":" + s }]);
  rows.push([{ text: "Назад", callback_data: "free" }, { text: "Главное меню", callback_data: "menu" }]);
  return { inline_keyboard: rows };
}

function exercisesMenu(ids, back) {
  const rows = ids.map(id => [{ text: EX[id][0], callback_data: "ex:" + id }]);
  rows.push([{ text: "Назад", callback_data: back }, { text: "Главное меню", callback_data: "menu" }]);
  return { inline_keyboard: rows };
}

async function exerciseText(env, userId, id) {
  const e = EX[id];
  let t = e[0] + "\n\nГруппа: " + e[1] + (e[2] ? "\nРаздел: " + e[2] : "");
  const note = await getNote(env, userId, id);
  if (note) t += "\n\n✏️ Заметка: " + note;
  return t + "\n\nВыбери действие.";
}

function exerciseMenu(id) {
  return { inline_keyboard: [
    [{ text: "Записать подход", callback_data: "set:" + id }],
    [{ text: "История", callback_data: "hist:" + id }],
    [{ text: "✏️ Заметка", callback_data: "note:" + id }],
    [{ text: "Назад", callback_data: "free" }, { text: "Главное меню", callback_data: "menu" }]
  ]};
}

function programsMenu() {
  return { inline_keyboard: [
    [{ text: "Фуллбади", callback_data: "program_full" }],
    [{ text: "Сплиты", callback_data: "program_split" }],
    [{ text: "🗂 Мои тренировки", callback_data: "my_trainings" }],
    [{ text: "➕ Создать свою программу", callback_data: "custom_program" }],
    [{ text: "🎯 Подобрать тренировку", callback_data: "pick" }],
    [{ text: "Главное меню", callback_data: "menu" }]
  ]};
}

function programListMenu(type) {
  const rows = [];
  for (const id of Object.keys(PROGRAMS)) {
    if (type === "fb" && id.startsWith("fb_")) rows.push([{ text: PROGRAMS[id].name, callback_data: "program:" + id }]);
    if (type === "split" && id.startsWith("split_")) rows.push([{ text: PROGRAMS[id].name, callback_data: "program:" + id }]);
  }
  rows.push([{ text: "Назад", callback_data: "programs" }, { text: "Главное меню", callback_data: "menu" }]);
  return { inline_keyboard: rows };
}

function programText(id) {
  const pr = PROGRAMS[id];
  let t = pr.name + "\n\n";
  pr.days.forEach((d, i) => {
    t += "День " + (i + 1) + "\n";
    d.forEach(x => t += "• " + x + "\n");
    t += "\n";
  });
  return t.trim();
}

function programMenu(id) {
  return { inline_keyboard: [
    [{ text: "Сохранить в мои тренировки", callback_data: "saveprog:" + id }],
    [{ text: "Назад", callback_data: id.startsWith("fb_") ? "program_full" : "program_split" }, { text: "Главное меню", callback_data: "menu" }]
  ]};
}

function pickMenu(step) {
  return { inline_keyboard: [
    [{ text: "Чуть-чуть", callback_data: "pick:" + step + ":low" }],
    [{ text: "Нормально", callback_data: "pick:" + step + ":mid" }],
    [{ text: "Хорошо", callback_data: "pick:" + step + ":high" }],
    [{ text: "Назад", callback_data: "programs" }]
  ]};
}

async function handlePick(env, cq, data) {
  const [, step, value] = data.split(":");
  const userId = cq.from.id;
  const st = await getState(env, userId);
  const answers = st?.data || {};
  answers[step] = value;

  const next = { legs: "chest", chest: "back", back: "shoulders", shoulders: "arms" }[step];
  if (next) {
    await setState(env, userId, "pick", answers);
    const names = { chest: "грудь", back: "спину", shoulders: "плечи", arms: "руки" };
    return editMessage(env, cq.message.chat.id, cq.message.message_id, "Как тренируем " + names[next] + "?", pickMenu(next));
  }

  const program = buildPickedProgram(answers);
  await saveProgram(env, userId, program.name, "picked", program);
  await clearState(env, userId);
  return editMessage(env, cq.message.chat.id, cq.message.message_id, pickedProgramText(program), navMenu("my_trainings"));
}

function buildPickedProgram(a) {
  const days = [];
  const day1 = ["Жим лёжа 3x8", "Тяга верхнего блока 3x10", "Платформа 3x12"];
  const day2 = ["Жим на наклонной 3x10", "Тяга горизонтального блока 3x10", "Приседания 3x8"];

  if (a.chest === "high") day1.push("Бабочка 3x15", "Кроссовер 3x15");
  if (a.back === "high") day1.push("Пуловер 3x12", "Тяга верхнего блока в тренажёре 3x10");
  if (a.legs === "high") day2.push("Разгибание ног 3x15", "Задняя поверхность бедра 3x12");
  if (a.shoulders === "high") day2.push("Подъём гантелей 4x15", "Бабочка на заднюю дельту 3x15");
  if (a.arms === "high") day2.push("Подъём Z-грифа 3x12", "Разгибание на блоке 3x12");

  if (a.chest === "mid") day1.push("Бабочка 3x12");
  if (a.back === "mid") day1.push("Пуловер 3x12");
  if (a.legs === "mid") day2.push("Разгибание ног 3x12");
  if (a.shoulders === "mid") day2.push("Подъём гантелей 3x15");
  if (a.arms === "mid") day2.push("Подъём Z-грифа 2x12", "Разгибание на блоке 2x12");

  days.push(day1, day2);
  return { name: "Подобранная программа", days };
}

function pickedProgramText(program) {
  return "✅ Готово. Я подобрал и сохранил программу в Мои тренировки.\n\n" + programTextFromObject(program);
}

function programTextFromObject(pr) {
  let t = pr.name + "\n\n";
  pr.days.forEach((d, i) => {
    t += "День " + (i + 1) + "\n";
    d.forEach(x => t += "• " + x + "\n");
    t += "\n";
  });
  return t.trim();
}

// ===================== ЗАПИСЬ ПОДХОДОВ =====================

async function handleSetInput(env, msg, st) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const exId = st.data.exercise_id;
  const parts = msg.text.trim().replace(",", ".").split(/\s+/);
  const weight = Number(parts[0]);
  const reps = Number(parts[1]);

  if (!weight || !reps) return sendMessage(env, chatId, "Нужно так: 80 8", navMenu("ex:" + exId));

  await ensureVisitOncePer3Hours(env, msg.from);
  await supabaseInsert(env, "workout_sets", {
    user_id: userId,
    exercise_id: exId,
    exercise_name: EX[exId][0],
    weight,
    reps
  });

  await clearState(env, userId);

  return sendMessage(env, chatId, "✅ Сохранено\n\n" + EX[exId][0] + "\n" + weight + " кг x " + reps, {
    inline_keyboard: [
      [{ text: "Ещё подход", callback_data: "set:" + exId }],
      [{ text: "✏️ Заметка", callback_data: "note:" + exId }],
      [{ text: "История", callback_data: "hist:" + exId }],
      [{ text: "Назад", callback_data: "ex:" + exId }, { text: "Главное меню", callback_data: "menu" }]
    ]
  });
}

async function handleSetNote(env, msg, st) {
  const userId = msg.from.id;
  const exId = st.data.exercise_id;
  const note = msg.text.trim();
  await saveNote(env, userId, exId, note);
  await clearState(env, userId);
  return sendMessage(env, msg.chat.id, "✏️ Заметка сохранена для упражнения «" + EX[exId][0] + "».", navMenu("ex:" + exId));
}

async function historyText(env, userId, exId) {
  const rows = await supabaseGet(env, "workout_sets?user_id=eq." + userId + "&exercise_id=eq." + exId + "&select=weight,reps,created_at&order=created_at.desc&limit=10");
  let t = "История\n\n" + EX[exId][0] + "\n";
  if (!rows.length) return t + "\nПока нет записей.";
  for (const r of rows) t += "\n• " + new Date(r.created_at).toLocaleDateString("ru-RU") + " — " + r.weight + " кг x " + r.reps;
  return t;
}

// ===================== ЗАМЕТКИ =====================

async function getNote(env, userId, exId) {
  const rows = await supabaseGet(env, "exercise_notes?user_id=eq." + userId + "&exercise_id=eq." + exId + "&select=note&limit=1");
  return rows[0] ? rows[0].note : null;
}

async function saveNote(env, userId, exId, note) {
  await fetch(env.SUPABASE_URL + "/rest/v1/exercise_notes?on_conflict=user_id,exercise_id", {
    method: "POST",
    headers: supabaseHeaders(env, "resolution=merge-duplicates"),
    body: JSON.stringify({ user_id: userId, exercise_id: exId, note, updated_at: new Date().toISOString() })
  });
}

// ===================== АНАЛИТИКА (база, расширим в Ф3) =====================

async function analyticsText(env, userId) {
  const visits = await supabaseGet(env, "gym_visits?user_id=eq." + userId + "&select=id");
  const sets = await supabaseGet(env, "workout_sets?user_id=eq." + userId + "&select=exercise_name,weight,reps,created_at&order=created_at.desc&limit=20");
  let t = "📊 Аналитика\n\nПосещений: " + visits.length + "\nПодходов: " + sets.length + "\n";
  if (sets.length) {
    t += "\nПоследние подходы:";
    sets.slice(0, 8).forEach(s => t += "\n• " + s.exercise_name + " — " + s.weight + "x" + s.reps);
  }
  t += "\n\nРасширенная аналитика с графиками, тоннажем и любимым упражнением — в Фазе 3.";
  return t;
}

// ===================== ПРОФИЛЬ + БЖУ =====================

async function profileText(env, from) {
  const u = await getUser(env, from.id);
  let t = "👤 Профиль\n\nИмя: " + (from.first_name || "—") +
    "\nUsername: " + (from.username ? "@" + from.username : "—") +
    "\nID: " + from.id + "  (покажи другу, чтобы он добавил тебя)\n";

  const sexMap = { m: "мужской", f: "женский" };
  const actMap = { low: "низкая", mid: "средняя", high: "высокая" };
  t += "\nРост: " + (u?.height ? u.height + " см" : "—") +
    "\nВес: " + (u?.weight ? u.weight + " кг" : "—") +
    "\nВозраст: " + (u?.age ? u.age : "—") +
    "\nПол: " + (u?.sex ? sexMap[u.sex] : "—") +
    "\nАктивность: " + (u?.activity ? actMap[u.activity] : "средняя") + "\n";

  t += bjuText(u);
  return t;
}

function bjuText(u) {
  if (!u || !u.weight || !u.height || !u.age || !u.sex) {
    return "\n📐 Заполни рост, вес, возраст и пол — и я посчитаю рекомендуемые калории и БЖУ на похудение, поддержание и массу.";
  }
  const w = Number(u.weight), h = Number(u.height), a = Number(u.age);
  const bmr = u.sex === "m"
    ? 10 * w + 6.25 * h - 5 * a + 5
    : 10 * w + 6.25 * h - 5 * a - 161;
  const factor = { low: 1.375, mid: 1.55, high: 1.725 }[u.activity || "mid"];
  const tdee = Math.round(bmr * factor);

  const goals = [
    ["Похудение", tdee - 600, 2.0],
    ["Поддержание", tdee, 1.8],
    ["Масса", tdee + 400, 1.8]
  ];

  let t = "\n🍽 Рекомендации (формула Mifflin-St Jeor)\nПоддержание ≈ " + tdee + " ккал/день\n";
  for (const [name, kcal, protPerKg] of goals) {
    const prot = Math.round(protPerKg * w);
    const fat = Math.round(0.9 * w);
    const carbs = Math.max(0, Math.round((kcal - prot * 4 - fat * 9) / 4));
    t += "\n" + name + ": " + kcal + " ккал\n   Б " + prot + " г · Ж " + fat + " г · У " + carbs + " г";
  }
  t += "\n\nПохудение — дефицит ~600 ккал (диапазон 500–700), масса — профицит ~400 (300–500).";
  return t;
}

function profileMenu() {
  return { inline_keyboard: [
    [{ text: "✏️ Изменить данные", callback_data: "profile_edit" }],
    [{ text: "🔒 Приватность", callback_data: "privacy" }],
    [{ text: "Главное меню", callback_data: "menu" }]
  ]};
}

async function handleProfInput(env, msg, field) {
  const userId = msg.from.id;
  const chatId = msg.chat.id;
  const v = Number(msg.text.trim().replace(",", "."));
  const limits = { height: [100, 250], weight: [30, 300], age: [10, 100] };
  const [min, max] = limits[field];
  if (!v || v < min || v > max) {
    return sendMessage(env, chatId, "Введи число от " + min + " до " + max + ".", navMenu("profile"));
  }
  await supabasePatch(env, "users?id=eq." + userId, { [field]: v });

  if (field === "height") {
    await setState(env, userId, "prof_weight", {});
    return sendMessage(env, chatId, "Рост сохранён. Теперь введи вес в кг (например 72).", navMenu("profile"));
  }
  if (field === "weight") {
    await setState(env, userId, "prof_age", {});
    return sendMessage(env, chatId, "Вес сохранён. Теперь введи возраст (например 28).", navMenu("profile"));
  }
  // age
  await clearState(env, userId);
  return sendMessage(env, chatId, "Возраст сохранён. Укажи пол:", {
    inline_keyboard: [
      [{ text: "Мужской", callback_data: "prof_sex:m" }, { text: "Женский", callback_data: "prof_sex:f" }]
    ]
  });
}

function activityMenu() {
  return { inline_keyboard: [
    [{ text: "Низкая (сидячий образ, 0–1 трен/нед)", callback_data: "prof_activity:low" }],
    [{ text: "Средняя (3–4 трен/нед)", callback_data: "prof_activity:mid" }],
    [{ text: "Высокая (5+ трен/нед, физ. работа)", callback_data: "prof_activity:high" }]
  ]};
}

// ===================== ПРИВАТНОСТЬ =====================

async function privacyMenu(env, userId) {
  const u = await getUser(env, userId);
  const on = (f) => (u && u[f] !== false) ? "✅ вкл" : "🚫 выкл";
  return { inline_keyboard: [
    [{ text: "Тренировки: " + on("priv_workouts"), callback_data: "priv:workouts" }],
    [{ text: "Аналитика: " + on("priv_analytics"), callback_data: "priv:analytics" }],
    [{ text: "Профиль: " + on("priv_profile"), callback_data: "priv:profile" }],
    [{ text: "Онлайн-статус: " + on("priv_online"), callback_data: "priv:online" }],
    [{ text: "Назад", callback_data: "profile" }, { text: "Главное меню", callback_data: "menu" }]
  ]};
}

// ===================== ВОССТАНОВЛЕНИЕ =====================

function recoveryMenu() {
  return { inline_keyboard: [
    [{ text: "😴 Сон", callback_data: "rec_sleep" }],
    [{ text: "🧖 Баня и сауна", callback_data: "rec_sauna" }],
    [{ text: "Главное меню", callback_data: "menu" }]
  ]};
}

function sleepText() {
  return "😴 Идеальный сон\n\n" +
"Сон — это не пауза, а главная фаза роста. Именно ночью выделяется гормон роста, восстанавливаются мышечные волокна, перезагружается нервная система и закрепляется всё, чему ты научилась за день. Можно идеально тренироваться и питаться, но при хроническом недосыпе прогресс встанет, а тяга к сладкому и кортизол вырастут.\n\n" +
"Сколько спать. Взрослому нужно 7–9 часов. При активных тренировках стремись к верхней границе — 8–9 часов. Важна не только длительность, но и регулярность: ложиться и вставать в одно и то же время, включая выходные. Стабильный режим ценнее, чем «отоспаться» раз в неделю.\n\n" +
"За 1–2 часа до сна:\n" +
"• Приглуши свет, убери яркие экраны или включи ночной режим — синий свет тормозит выработку мелатонина.\n" +
"• Никакого кофеина после 14–15 часов (он живёт в крови 6–8 часов).\n" +
"• Последний приём пищи — за 2–3 часа, без тяжёлой и жирной еды. Лёгкий белок (творог, казеин) перед сном допустим.\n" +
"• Алкоголь рушит глубокие фазы сна, даже если кажется, что «помогает уснуть».\n\n" +
"Спальня:\n" +
"• Прохладно: 18–20 °C. В тепле сон поверхностный.\n" +
"• Темно: плотные шторы или маска. Полная темнота = больше мелатонина.\n" +
"• Тихо: беруши или белый шум.\n" +
"• Кровать только для сна — не работай и не листай ленту в постели.\n\n" +
"Ритуал засыпания. Тёплый душ за час до сна, лёгкая растяжка, дыхание 4-7-8 (вдох на 4 счёта, задержка на 7, выдох на 8), чтение бумажной книги. Если не уснула за 20 минут — встань, займись спокойным делом при тусклом свете и вернись, когда появится сонливость.\n\n" +
"Утро. Сразу после пробуждения — дневной свет (выйди на улицу или к окну на 5–10 минут). Это запускает циркадные ритмы и помогает легче засыпать вечером.\n\n" +
"Связь с тренировками. После тяжёлой тренировки потребность во сне растёт. Если спишь мало — снижай объём, иначе копится переутомление. Один-два хороших ночных сна восстанавливают сильнее любых добавок.";
}

function saunaText() {
  return "🧖 Баня, сауна и хамам\n\n" +
"Тепловые процедуры ускоряют восстановление: расширяются сосуды, улучшается кровоток в мышцах, быстрее уходят продукты обмена, расслабляются зажатые после нагрузки мышцы, снижается стресс и улучшается сон. Регулярные сауны также тренируют сердечно-сосудистую систему.\n\n" +
"Хамам (турецкая баня). Мягкий пар, температура 40–50 °C, влажность под 100%. Самый щадящий формат — его можно посещать после каждой тренировки, в том числе силовой. Влажное тепло мягко прогревает мышцы, снимает забитость и не перегружает сердце. После тренировки достаточно 10–15 минут: это расслабит тело и ускорит восстановление.\n\n" +
"Сауна (финская). Сухой жар 80–100 °C. Мощнее и нагружает сердце сильнее, поэтому сразу после тяжёлой силовой её лучше не злоупотреблять. Оптимально — 2–3 захода по 8–12 минут с перерывами, либо в отдельный от тренировки день. Между заходами обязательно остывай и пей воду.\n\n" +
"Русская баня. Влажный пар 60–80 °C плюс парение веником. Хорошо разгоняет кровь и глубоко прогревает. Заходы по 5–10 минут, 2–4 раза, с полным остыванием между ними.\n\n" +
"Методы парения веником (русская баня):\n" +
"• Опахивание — лёгкие движения веником над телом, нагнетают горячий воздух, разогревают.\n" +
"• Поглаживание — веник скользит по телу, расслабляет.\n" +
"• Постёгивание — лёгкие быстрые касания по мышцам, усиливают приток крови.\n" +
"• Похлёстывание — более активные удары по крупным мышцам, разгоняют кровь.\n" +
"• Компресс — горячий веник прижимают к мышце на пару секунд, снимает забитость. Двигайся от стоп к спине, парь лёжа, голову держи прохладной (шапка обязательна).\n\n" +
"Контрастные процедуры. После захода — прохладный душ, обливание или бассейн на 10–30 секунд. Контраст тренирует сосуды, бодрит и усиливает восстановление. Начинай мягко: прохладная, а не ледяная вода, без резкого ныряния с разгорячённым сердцем.\n\n" +
"Душ и гигиена. Перед баней — тёплый душ, смыть косметику и пот. После каждого захода ополаскивайся. В конце — тёплый душ и тщательно высушись, чтобы не замёрзнуть.\n\n" +
"Вода и безопасность. Потеря жидкости большая — пей воду или травяной чай до, между заходами и после (алкоголь под запретом). Не парься натощак и сразу после плотной еды. Выходи при головокружении, тошноте или сильном сердцебиении. Противопоказания: высокое давление, болезни сердца, острые воспаления, беременность без согласования с врачом.\n\n" +
"Итог: хамам — мягко и можно после каждой тренировки; сауну и русскую баню дозируй и не совмещай с самой тяжёлой силовой в один заход.";
}

// ===================== ДРУЗЬЯ =====================

function friendsMenu() {
  return { inline_keyboard: [
    [{ text: "Добавить друга по ID", callback_data: "friend_add" }],
    [{ text: "Список друзей", callback_data: "friend_list" }],
    [{ text: "Заявки", callback_data: "friend_requests" }],
    [{ text: "🔒 Приватность", callback_data: "friend_privacy" }],
    [{ text: "✉️ Сообщение друзьям", callback_data: "friend_msg" }],
    [{ text: "Главное меню", callback_data: "menu" }]
  ]};
}

async function handleFriendAdd(env, msg) {
  const friendId = Number(msg.text.trim());
  if (!friendId) return sendMessage(env, msg.chat.id, "Нужен числовой ID друга.", navMenu("friends"));
  await supabaseInsert(env, "friends", { user_id: msg.from.id, friend_id: friendId, status: "pending", can_view_workouts: false });
  await clearState(env, msg.from.id);
  return sendMessage(env, msg.chat.id, "Заявка другу создана.\n\nПринятие заявок и уведомления подключим в Фазе 4.", navMenu("friends"));
}

async function friendListText(env, userId) {
  const rows = await supabaseGet(env, "friends?user_id=eq." + userId + "&select=friend_id,status,can_view_workouts");
  if (!rows.length) return "Список друзей пуст.";
  let t = "Список друзей";
  rows.forEach(r => t += "\n• ID " + r.friend_id + " — " + r.status + (r.can_view_workouts ? " — видит тренировки" : ""));
  return t;
}

async function friendRequestsText(env, userId) {
  const rows = await supabaseGet(env, "friends?friend_id=eq." + userId + "&status=eq.pending&select=user_id,status");
  if (!rows.length) return "Заявок нет.";
  let t = "Заявки";
  rows.forEach(r => t += "\n• От ID " + r.user_id);
  return t;
}

// ===================== МОИ ТРЕНИРОВКИ =====================

async function myTrainingsText(env, userId) {
  const rows = await supabaseGet(env, "custom_programs?user_id=eq." + userId + "&select=id,name,source&order=created_at.desc");
  if (!rows.length) return "🗂 Мои тренировки\n\nПока пусто. Сохрани готовую программу или создай свою.";
  let t = "🗂 Мои тренировки\n";
  rows.forEach(r => t += "\n• " + r.name + " (" + r.source + ")");
  return t;
}

async function myTrainingsMenu(env, userId) {
  const rowsData = await supabaseGet(env, "custom_programs?user_id=eq." + userId + "&select=id,name&order=created_at.desc&limit=20");
  const rows = rowsData.map(r => [{ text: r.name, callback_data: "myprog:" + r.id }]);
  rows.push([{ text: "➕ Создать свою программу", callback_data: "custom_program" }]);
  rows.push([{ text: "🎯 Подобрать тренировку", callback_data: "pick" }]);
  rows.push([{ text: "Назад", callback_data: "programs" }, { text: "Главное меню", callback_data: "menu" }]);
  return { inline_keyboard: rows };
}

async function customProgramText(env, id) {
  const rows = await supabaseGet(env, "custom_programs?id=eq." + id + "&select=name,data&limit=1");
  if (!rows.length) return "Программа не найдена.";
  return programTextFromObject(rows[0].data);
}

function customProgramMenu(id) {
  return { inline_keyboard: [
    [{ text: "Редактировать", callback_data: "custom_program" }],
    [{ text: "Удалить", callback_data: "delprog:" + id }],
    [{ text: "Назад", callback_data: "my_trainings" }, { text: "Главное меню", callback_data: "menu" }]
  ]};
}

async function handleCustomName(env, msg) {
  const name = msg.text.trim();
  await saveProgram(env, msg.from.id, name, "custom", { name, days: [["Пока пусто. Полноценный конструктор упражнений — в Фазе 2."]] });
  await clearState(env, msg.from.id);
  return sendMessage(env, msg.chat.id, "Программа создана:\n\n" + name, navMenu("my_trainings"));
}

// ===================== ПИТАНИЕ =====================

function foodMenu() {
  return { inline_keyboard: [
    [{ text: "🥗 Рецепты", callback_data: "food_recipes" }],
    [{ text: "📖 Принципы питания", callback_data: "food_principles" }],
    [{ text: "💧 Вода", callback_data: "water" }],
    [{ text: "💊 БАДы", callback_data: "supps" }],
    [{ text: "Главное меню", callback_data: "menu" }]
  ]};
}

function nutritionText() {
  return "📖 Принципы питания\n\n" +
"Главное правило — баланс калорий. Хочешь худеть — ешь меньше, чем тратишь; набирать — больше. Точные цифры под твой вес и цель бот считает в Профиле, как только заполнишь данные.\n\n" +
"Белок — фундамент. 1.8–2.2 г на кг веса. На похудении держи ближе к верхней границе: белок сохраняет мышцы и хорошо насыщает. Источники: курица, индейка, рыба, яйца, творог, греческий йогурт, бобовые.\n\n" +
"Жиры — не враг. 0.8–1 г на кг. Нужны для гормонов и усвоения витаминов. Источники: оливковое масло, орехи, авокадо, жирная рыба, яйца. Избегай трансжиров (фастфуд, маргарин).\n\n" +
"Углеводы — топливо. Остаток калорий после белка и жиров. Делай упор на сложные: крупы, цельнозерновой хлеб, овощи, фрукты. Быстрые углеводы удобны вокруг тренировки.\n\n" +
"Клетчатка и овощи. Минимум 400 г овощей в день — насыщение, пищеварение, микроэлементы.\n\n" +
"Вода. 30–40 мл на кг веса. Следи за этим в разделе 💧 Вода.\n\n" +
"Режим. 3–5 приёмов в день, как удобно. Частота вторична — важна суточная сумма калорий и белка. Не гонись за идеалом каждый день: стабильность за неделю важнее одного срыва.";
}

function recipesMenu() {
  return { inline_keyboard: [
    [{ text: "🍳 Завтраки", callback_data: "recipe:breakfast" }],
    [{ text: "🍲 Обеды", callback_data: "recipe:lunch" }],
    [{ text: "🍽 Ужины", callback_data: "recipe:dinner" }],
    [{ text: "🍎 Перекусы", callback_data: "recipe:snack" }],
    [{ text: "Назад", callback_data: "food_supps" }, { text: "Главное меню", callback_data: "menu" }]
  ]};
}

function recipeText(cat) {
  const R = {
    breakfast: "🍳 Завтраки\n\n" +
"1) Омлет с овощами и сыром\n3 яйца, горсть шпината, помидор, 30 г сыра. Взбить яйца, вылить на сковороду, добавить овощи и сыр. ~350 ккал, Б 25 · Ж 24 · У 6.\n\n" +
"2) Овсянка с творогом и ягодами\n60 г овсянки на воде/молоке, 100 г творога, горсть ягод, мёд. Сварить овсянку, добавить творог и ягоды. ~400 ккал, Б 28 · Ж 8 · У 55.\n\n" +
"3) Скрэмбл с тостом\n3 яйца, ломтик цельнозернового хлеба, авокадо. ~420 ккал, Б 22 · Ж 26 · У 24.",
    lunch: "🍲 Обеды\n\n" +
"1) Курица с рисом и овощами\n150 г куриной грудки, 60 г риса (сухой вес), овощи на пару. ~480 ккал, Б 45 · Ж 8 · У 55.\n\n" +
"2) Говядина с гречкой\n130 г нежирной говядины, 60 г гречки, салат из огурцов и помидоров. ~500 ккал, Б 42 · Ж 14 · У 50.\n\n" +
"3) Лосось с картофелем\n150 г лосося, 200 г запечённого картофеля, зелень. ~550 ккал, Б 35 · Ж 28 · У 40.",
    dinner: "🍽 Ужины\n\n" +
"1) Творог с овощами\n200 г творога, огурец, зелень, ложка йогурта. ~280 ккал, Б 36 · Ж 8 · У 12.\n\n" +
"2) Рыба на пару с салатом\n180 г белой рыбы, большой овощной салат с оливковым маслом. ~330 ккал, Б 38 · Ж 14 · У 8.\n\n" +
"3) Индейка с тушёными овощами\n150 г филе индейки, кабачок, перец, морковь. ~340 ккал, Б 40 · Ж 10 · У 18.",
    snack: "🍎 Перекусы\n\n" +
"1) Греческий йогурт с орехами\n150 г йогурта, 20 г орехов. ~250 ккал, Б 16 · Ж 14 · У 12.\n\n" +
"2) Протеиновый коктейль с бананом\n1 порция протеина, банан, вода/молоко. ~280 ккал, Б 28 · Ж 4 · У 35.\n\n" +
"3) Яблоко с арахисовой пастой\n1 яблоко, 1 ст. ложка пасты. ~200 ккал, Б 6 · Ж 9 · У 28.\n\n" +
"4) Творог с мёдом\n150 г творога, ложка мёда. ~190 ккал, Б 26 · Ж 3 · У 16."
  };
  return R[cat] || "Раздел не найден.";
}

function suppsText() {
  return "💊 БАДы\n\n" +
"Добавки — это дополнение к питанию, а не замена. Сначала режим, белок и сон, потом добавки.\n\n" +
"Рабочие и проверенные:\n" +
"• Креатин моногидрат — 3–5 г в день, постоянно, в любое время. Самая изученная добавка: прибавляет силу и объём, помогает в наборе. Загрузка не обязательна.\n" +
"• Протеин (сывороточный/казеин) — удобный способ добрать норму белка, если не хватает из еды. Не «химия», а просто концентрат белка.\n" +
"• Омега-3 (рыбий жир) — 1–2 г EPA+DHA в день, если мало жирной рыбы. Для суставов, сердца, восстановления.\n" +
"• Витамин D — 1000–2000 МЕ, особенно осенью-зимой. Лучше сдать анализ и подобрать дозу.\n" +
"• Магний — при судорогах, стрессе, плохом сне. Вечером.\n\n" +
"По желанию:\n" +
"• Кофеин — 100–200 мг до тренировки для тонуса (не на ночь).\n" +
"• Цинк, комплекс витаминов — при несбалансированном рационе.\n\n" +
"Чего не нужно: «жиросжигатели» и экзотика с громкими обещаниями обычно не работают. Дефицит калорий сжигает жир, а не таблетка.\n\n" +
"Важно: при болезнях и приёме лекарств добавки согласуй с врачом.";
}

// ===================== ВОДА =====================

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

async function waterText(env, userId) {
  const u = await getUser(env, userId);
  const goal = u?.water_goal_ml || 2500;
  const rows = await supabaseGet(env, "water_log?user_id=eq." + userId + "&day=eq." + todayStr() + "&select=ml&limit=1");
  const ml = rows[0] ? rows[0].ml : 0;
  const pct = Math.min(100, Math.round(ml / goal * 100));
  const filled = Math.round(pct / 10);
  const bar = "▰".repeat(filled) + "▱".repeat(10 - filled);
  return "💧 Вода сегодня\n\n" + bar + "  " + pct + "%\n" + ml + " / " + goal + " мл\n\nДобавляй по мере того, как пьёшь.";
}

function waterMenu() {
  return { inline_keyboard: [
    [{ text: "+250 мл", callback_data: "water_add:250" }, { text: "+500 мл", callback_data: "water_add:500" }],
    [{ text: "✏️ Своё кол-во", callback_data: "water_custom" }],
    [{ text: "🎯 Изменить цель", callback_data: "water_goal" }],
    [{ text: "Назад", callback_data: "food_supps" }, { text: "Главное меню", callback_data: "menu" }]
  ]};
}

async function addWater(env, userId, ml) {
  if (!ml || ml < 0) return;
  const rows = await supabaseGet(env, "water_log?user_id=eq." + userId + "&day=eq." + todayStr() + "&select=ml&limit=1");
  const total = (rows[0] ? rows[0].ml : 0) + ml;
  await fetch(env.SUPABASE_URL + "/rest/v1/water_log?on_conflict=user_id,day", {
    method: "POST",
    headers: supabaseHeaders(env, "resolution=merge-duplicates"),
    body: JSON.stringify({ user_id: userId, day: todayStr(), ml: total })
  });
}

async function handleWaterCustom(env, msg) {
  const ml = Number(msg.text.trim());
  if (!ml || ml <= 0 || ml > 5000) return sendMessage(env, msg.chat.id, "Введи число от 1 до 5000.", navMenu("water"));
  await addWater(env, msg.from.id, ml);
  await clearState(env, msg.from.id);
  return sendMessage(env, msg.chat.id, await waterText(env, msg.from.id), waterMenu());
}

async function handleWaterGoal(env, msg) {
  const ml = Number(msg.text.trim());
  if (!ml || ml < 500 || ml > 8000) return sendMessage(env, msg.chat.id, "Введи цель от 500 до 8000 мл.", navMenu("water"));
  await supabasePatch(env, "users?id=eq." + msg.from.id, { water_goal_ml: ml });
  await clearState(env, msg.from.id);
  return sendMessage(env, msg.chat.id, "🎯 Цель обновлена.\n\n" + await waterText(env, msg.from.id), waterMenu());
}

// ===================== ОБЩЕЕ =====================

function navMenu(back) {
  return { inline_keyboard: [[{ text: "Назад", callback_data: back }, { text: "Главное меню", callback_data: "menu" }]] };
}

async function ensureVisitOncePer3Hours(env, from) {
  await ensureUser(env, from);
  const last = await supabaseGet(env, "gym_visits?user_id=eq." + from.id + "&select=visited_at&order=visited_at.desc&limit=1");
  if (last.length) {
    const diff = (Date.now() - new Date(last[0].visited_at).getTime()) / 1000 / 60 / 60;
    if (diff < VISIT_COOLDOWN_HOURS) return;
  }
  await supabaseInsert(env, "gym_visits", { user_id: from.id });
}

async function ensureUser(env, from) {
  if (!from) return;
  await fetch(env.SUPABASE_URL + "/rest/v1/users?on_conflict=id", {
    method: "POST",
    headers: supabaseHeaders(env, "resolution=merge-duplicates"),
    body: JSON.stringify({ id: from.id, username: from.username || null, first_name: from.first_name || null, last_name: from.last_name || null, last_seen: new Date().toISOString() })
  });
}

async function getUser(env, userId) {
  const rows = await supabaseGet(env, "users?id=eq." + userId + "&select=*&limit=1");
  return rows[0] || null;
}

async function saveProgram(env, userId, name, source, data) {
  await supabaseInsert(env, "custom_programs", { user_id: userId, name, source, data });
}

async function getState(env, userId) {
  const rows = await supabaseGet(env, "user_state?user_id=eq." + userId + "&select=state,data&limit=1");
  return rows[0] || null;
}

async function setState(env, userId, state, data) {
  await fetch(env.SUPABASE_URL + "/rest/v1/user_state?on_conflict=user_id", {
    method: "POST",
    headers: supabaseHeaders(env, "resolution=merge-duplicates"),
    body: JSON.stringify({ user_id: userId, state, data, updated_at: new Date().toISOString() })
  });
}

async function clearState(env, userId) {
  await supabaseDelete(env, "user_state?user_id=eq." + userId);
}

async function supabaseGet(env, path) {
  const res = await fetch(env.SUPABASE_URL + "/rest/v1/" + path, { method: "GET", headers: supabaseHeaders(env) });
  if (!res.ok) return [];
  return await res.json();
}

async function supabaseInsert(env, table, body) {
  return fetch(env.SUPABASE_URL + "/rest/v1/" + table, {
    method: "POST",
    headers: supabaseHeaders(env, "return=minimal"),
    body: JSON.stringify(body)
  });
}

async function supabasePatch(env, path, body) {
  return fetch(env.SUPABASE_URL + "/rest/v1/" + path, {
    method: "PATCH",
    headers: supabaseHeaders(env, "return=minimal"),
    body: JSON.stringify(body)
  });
}

async function supabaseDelete(env, path) {
  return fetch(env.SUPABASE_URL + "/rest/v1/" + path, {
    method: "DELETE",
    headers: supabaseHeaders(env)
  });
}

function supabaseHeaders(env, prefer) {
  const h = {
    apikey: env.SUPABASE_KEY,
    Authorization: "Bearer " + env.SUPABASE_KEY,
    "Content-Type": "application/json"
  };
  if (prefer) h.Prefer = prefer;
  return h;
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
