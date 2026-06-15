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
      if (request.method === "GET") return new Response("Gym Bot v2 работает");
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
    return sendMessage(env, chatId, "Главное меню:", mainMenu());
  }

  if (st?.state === "set_input") return handleSetInput(env, msg, st);
  if (st?.state === "friend_add") return handleFriendAdd(env, msg);
  if (st?.state === "custom_name") return handleCustomName(env, msg);

  return sendMessage(env, chatId, "Используй кнопки ниже.", mainMenu());
}

async function handleCallback(env, cq) {
  const chatId = cq.message.chat.id;
  const msgId = cq.message.message_id;
  const userId = cq.from.id;
  const data = cq.data;

  await answerCallback(env, cq.id);
  await ensureUser(env, cq.from);

  if (data === "menu") return editMessage(env, chatId, msgId, "Главное меню:", mainMenu());
  if (data === "trainings") return editMessage(env, chatId, msgId, "Тренировки:", trainingsMenu());
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
    return editMessage(env, chatId, msgId, exerciseText(id), exerciseMenu(id));
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

  if (data === "programs") return editMessage(env, chatId, msgId, "Программы тренировок:", programsMenu());
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
    return editMessage(env, chatId, msgId, "Программа сохранена в Мои тренировки:\n\n" + PROGRAMS[id].name, navMenu("my_trainings"));
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
  if (data === "profile") return editMessage(env, chatId, msgId, profileText(cq.from), navMenu("menu"));
  if (data === "friends") return editMessage(env, chatId, msgId, "Друзья:", friendsMenu());
  if (data === "friend_add") {
    await setState(env, userId, "friend_add", {});
    return editMessage(env, chatId, msgId, "Добавить друга\n\nПопроси друга открыть Профиль и прислать тебе ID.\n\nВведи ID друга сообщением.", navMenu("friends"));
  }
  if (data === "friend_list") return editMessage(env, chatId, msgId, await friendListText(env, userId), navMenu("friends"));
  if (data === "friend_requests") return editMessage(env, chatId, msgId, await friendRequestsText(env, userId), navMenu("friends"));
  if (data === "friend_privacy") return editMessage(env, chatId, msgId, "Приватность друзей\n\nСкоро: разрешать или запрещать просмотр тренировок каждому другу отдельно.", navMenu("friends"));
  if (data === "friend_msg") return editMessage(env, chatId, msgId, "Сообщение друзьям\n\nСкоро: отправка заметки всем друзьям, которым разрешён просмотр.", navMenu("friends"));

  if (data === "food_supps") return editMessage(env, chatId, msgId, "Питание и БАДы:", foodMenu());
  if (data === "food") return editMessage(env, chatId, msgId, nutritionText(), navMenu("food_supps"));
  if (data === "supps") return editMessage(env, chatId, msgId, "Креатин 3-5 г в день.\nОмега-3 по желанию.\nВитамин D — лучше после анализа.", navMenu("food_supps"));
}

function mainMenu() {
  return { inline_keyboard: [
    [{ text: "Тренировки", callback_data: "trainings" }],
    [{ text: "Программы тренировок", callback_data: "programs" }],
    [{ text: "Мои тренировки", callback_data: "my_trainings" }],
    [{ text: "Подобрать тренировку", callback_data: "pick" }],
    [{ text: "Аналитика", callback_data: "analytics" }],
    [{ text: "Друзья", callback_data: "friends" }],
    [{ text: "Профиль", callback_data: "profile" }],
    [{ text: "Питание и БАДы", callback_data: "food_supps" }]
  ]};
}

function trainingsMenu() {
  return { inline_keyboard: [
    [{ text: "Свободная тренировка", callback_data: "free" }],
    [{ text: "Записать результат", callback_data: "log" }],
    [{ text: "Тренировка по программе", callback_data: "programs" }],
    [{ text: "Мои тренировки", callback_data: "my_trainings" }],
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

function exerciseText(id) {
  const e = EX[id];
  return e[0] + "\n\nГруппа: " + e[1] + (e[2] ? "\nРаздел: " + e[2] : "") + "\n\nВыбери действие.";
}

function exerciseMenu(id) {
  return { inline_keyboard: [
    [{ text: "Записать подход", callback_data: "set:" + id }],
    [{ text: "История", callback_data: "hist:" + id }],
    [{ text: "Назад", callback_data: "free" }, { text: "Главное меню", callback_data: "menu" }]
  ]};
}

function programsMenu() {
  return { inline_keyboard: [
    [{ text: "Фуллбади", callback_data: "program_full" }],
    [{ text: "Сплиты", callback_data: "program_split" }],
    [{ text: "Создать свою программу", callback_data: "custom_program" }],
    [{ text: "Мои тренировки", callback_data: "my_trainings" }],
    [{ text: "Назад", callback_data: "menu" }, { text: "Главное меню", callback_data: "menu" }]
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
  const p = PROGRAMS[id];
  let t = p.name + "\n\n";
  p.days.forEach((d, i) => {
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
    [{ text: "Назад", callback_data: "menu" }]
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
  return "Готово. Я подобрал и сохранил программу в Мои тренировки.\n\n" + programTextFromObject(program);
}

function programTextFromObject(p) {
  let t = p.name + "\n\n";
  p.days.forEach((d, i) => {
    t += "День " + (i + 1) + "\n";
    d.forEach(x => t += "• " + x + "\n");
    t += "\n";
  });
  return t.trim();
}

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

  return sendMessage(env, chatId, "Сохранено\n\n" + EX[exId][0] + "\n" + weight + " кг x " + reps, {
    inline_keyboard: [
      [{ text: "Ещё подход", callback_data: "set:" + exId }],
      [{ text: "История", callback_data: "hist:" + exId }],
      [{ text: "Назад", callback_data: "ex:" + exId }, { text: "Главное меню", callback_data: "menu" }]
    ]
  });
}

async function historyText(env, userId, exId) {
  const rows = await supabaseGet(env, "workout_sets?user_id=eq." + userId + "&exercise_id=eq." + exId + "&select=weight,reps,created_at&order=created_at.desc&limit=10");
  let t = "История\n\n" + EX[exId][0] + "\n";
  if (!rows.length) return t + "\nПока нет записей.";
  for (const r of rows) t += "\n• " + new Date(r.created_at).toLocaleDateString("ru-RU") + " — " + r.weight + " кг x " + r.reps;
  return t;
}

async function analyticsText(env, userId) {
  const visits = await supabaseGet(env, "gym_visits?user_id=eq." + userId + "&select=id");
  const sets = await supabaseGet(env, "workout_sets?user_id=eq." + userId + "&select=exercise_name,weight,reps,created_at&order=created_at.desc&limit=20");
  let t = "Аналитика\n\nПосещений: " + visits.length + "\nПодходов: " + sets.length + "\n";
  if (sets.length) {
    t += "\nПоследние подходы:";
    sets.slice(0, 8).forEach(s => t += "\n• " + s.exercise_name + " — " + s.weight + "x" + s.reps);
  }
  return t;
}

function profileText(from) {
  return "Профиль\n\nИмя: " + (from.first_name || "—") + "\nUsername: " + (from.username ? "@" + from.username : "—") + "\nID: " + from.id + "\n\nРост, вес, возраст и приватность добавим следующим этапом.";
}

function friendsMenu() {
  return { inline_keyboard: [
    [{ text: "Добавить друга по ID", callback_data: "friend_add" }],
    [{ text: "Список друзей", callback_data: "friend_list" }],
    [{ text: "Заявки", callback_data: "friend_requests" }],
    [{ text: "Приватность тренировок", callback_data: "friend_privacy" }],
    [{ text: "Сообщение друзьям", callback_data: "friend_msg" }],
    [{ text: "Назад", callback_data: "menu" }, { text: "Главное меню", callback_data: "menu" }]
  ]};
}

async function handleFriendAdd(env, msg) {
  const friendId = Number(msg.text.trim());
  if (!friendId) return sendMessage(env, msg.chat.id, "Нужен числовой ID друга.", navMenu("friends"));
  await supabaseInsert(env, "friends", { user_id: msg.from.id, friend_id: friendId, status: "pending", can_view_workouts: false });
  await clearState(env, msg.from.id);
  return sendMessage(env, msg.chat.id, "Заявка другу создана.\n\nКогда добавим уведомления — он сможет принять её в боте.", navMenu("friends"));
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

async function myTrainingsText(env, userId) {
  const rows = await supabaseGet(env, "custom_programs?user_id=eq." + userId + "&select=id,name,source&order=created_at.desc");
  if (!rows.length) return "Мои тренировки\n\nПока пусто.";
  let t = "Мои тренировки\n";
  rows.forEach(r => t += "\n• " + r.name + " (" + r.source + ")");
  return t;
}

async function myTrainingsMenu(env, userId) {
  const rowsData = await supabaseGet(env, "custom_programs?user_id=eq." + userId + "&select=id,name&order=created_at.desc&limit=20");
  const rows = rowsData.map(r => [{ text: r.name, callback_data: "myprog:" + r.id }]);
  rows.push([{ text: "Создать свою программу", callback_data: "custom_program" }]);
  rows.push([{ text: "Подобрать тренировку", callback_data: "pick" }]);
  rows.push([{ text: "Назад", callback_data: "menu" }, { text: "Главное меню", callback_data: "menu" }]);
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
  await saveProgram(env, msg.from.id, name, "custom", { name, days: [["Пока пусто. Редактирование упражнений добавим следующим этапом."]] });
  await clearState(env, msg.from.id);
  return sendMessage(env, msg.chat.id, "Программа создана:\n\n" + name, navMenu("my_trainings"));
}

function foodMenu() {
  return { inline_keyboard: [
    [{ text: "Питание", callback_data: "food" }],
    [{ text: "БАДы", callback_data: "supps" }],
    [{ text: "Назад", callback_data: "menu" }, { text: "Главное меню", callback_data: "menu" }]
  ]};
}

function nutritionText() {
  return "Питание\n\nБелок — 2+ грамма на кг веса.\nЖиры — около 1–1.2 г на кг веса.\nУглеводы регулируют сушку или массу.\nСон — 7–9 часов.";
}

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
    body: JSON.stringify({ id: from.id, username: from.username || null, first_name: from.first_name || null, last_name: from.last_name || null })
  });
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