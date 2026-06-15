const VISIT_COOLDOWN_HOURS = 3;

const EXERCISES = {
  bench: { name: "Жим лёжа", group: "Грудь" },
  incline_bench: { name: "Жим на наклонной", group: "Грудь" },
  machine_press: { name: "Жим в тренажёре", group: "Грудь" },
  pec_deck: { name: "Бабочка", group: "Грудь" },
  crossover: { name: "Кроссовер", group: "Грудь" },
  dumbbell_press: { name: "Жим гантелей лёжа", group: "Грудь" },

  lat_pulldown: { name: "Тяга верхнего блока", group: "Спина" },
  lat_machine: { name: "Тяга верхнего блока в тренажёре", group: "Спина" },
  seated_row: { name: "Тяга горизонтального блока", group: "Спина" },
  pullover: { name: "Пуловер", group: "Спина" },
  pullups: { name: "Подтягивания", group: "Спина" },
  dumbbell_row: { name: "Тяга гантели одной рукой", group: "Спина" },

  squat: { name: "Приседания", group: "Ноги" },
  leg_press: { name: "Платформа", group: "Ноги" },
  leg_ext: { name: "Разгибание на квадрицепс", group: "Ноги" },
  leg_curl: { name: "Задняя поверхность бедра в тренажёре", group: "Ноги" },
  calves: { name: "Икры", group: "Ноги" },
  lunges: { name: "Выпады", group: "Ноги" },
  romanian: { name: "Румынская тяга", group: "Ноги" },

  front_raise: { name: "Подъём перед собой", group: "Плечи", sub: "Передняя дельта" },
  shoulder_press: { name: "Жим гантелей сидя", group: "Плечи", sub: "Передняя дельта" },
  lateral_raise: { name: "Подъём гантелей", group: "Плечи", sub: "Средняя дельта" },
  cable_lateral: { name: "Разгибание в кроссовере", group: "Плечи", sub: "Средняя дельта" },
  rear_deck: { name: "Бабочка", group: "Плечи", sub: "Задняя дельта" },
  face_pull: { name: "Тяга каната к лицу", group: "Плечи", sub: "Задняя дельта" },

  scott: { name: "Скамья Скотта", group: "Руки", sub: "Бицепс" },
  zbar_curl: { name: "Подъём Z-грифа", group: "Руки", sub: "Бицепс" },
  dumbbell_sitting: { name: "Гантели сидя", group: "Руки", sub: "Бицепс" },
  dumbbell_standing: { name: "Гантели стоя", group: "Руки", sub: "Бицепс" },
  hammer: { name: "Молотки", group: "Руки", sub: "Предплечье" },
  reverse_curl: { name: "Подъём обратным хватом", group: "Руки", sub: "Предплечье" },
  farmer: { name: "Фермерская прогулка", group: "Руки", sub: "Предплечье" },
  triceps_pushdown: { name: "Разгибание на блоке", group: "Руки", sub: "Трицепс" },
  overhead_triceps: { name: "Разгибание на блоке из-за головы", group: "Руки", sub: "Трицепс" },
  french_press: { name: "Французский жим", group: "Руки", sub: "Трицепс" },
  close_grip: { name: "Узкий жим", group: "Руки", sub: "Трицепс" },

  crunch: { name: "Скручивания", group: "Пресс" },
  leg_raise: { name: "Подъём ног", group: "Пресс" },
  plank: { name: "Планка", group: "Пресс" },

  bike: { name: "Велосипед", group: "Кардио" },
  walk: { name: "Ходьба", group: "Кардио" },
  run: { name: "Бег", group: "Кардио" },
  ellipse: { name: "Эллипс", group: "Кардио" }
};

const GROUPS = {
  chest: { title: "Грудь", ids: ["bench", "incline_bench", "machine_press", "pec_deck", "crossover", "dumbbell_press"] },
  back: { title: "Спина", ids: ["lat_pulldown", "lat_machine", "seated_row", "pullover", "pullups", "dumbbell_row"] },
  legs: { title: "Ноги", ids: ["squat", "leg_press", "leg_ext", "leg_curl", "calves", "lunges", "romanian"] },
  shoulders: { title: "Плечи", subs: {
    front: { title: "Передняя дельта", ids: ["shoulder_press", "front_raise"] },
    middle: { title: "Средняя дельта", ids: ["lateral_raise", "cable_lateral"] },
    rear: { title: "Задняя дельта", ids: ["rear_deck", "face_pull"] }
  }},
  arms: { title: "Руки", subs: {
    biceps: { title: "Бицепс", ids: ["scott", "zbar_curl", "dumbbell_sitting", "dumbbell_standing"] },
    triceps: { title: "Трицепс", ids: ["triceps_pushdown", "overhead_triceps", "french_press", "close_grip"] },
    forearm: { title: "Предплечье", ids: ["hammer", "reverse_curl", "farmer"] }
  }},
  abs: { title: "Пресс", ids: ["crunch", "leg_raise", "plank"] },
  cardio: { title: "Кардио", ids: ["bike", "walk", "run", "ellipse"] }
};

const PROGRAMS = {
  fb_beginner: {
    name: "Фуллбади: новичок",
    days: [
      ["Жим лёжа — 3×8–10", "Тяга верхнего блока — 3×10", "Приседания — 3×8", "Подъём гантелей — 3×12", "Разгибание на блоке — 2×12", "Скамья Скотта — 2×12"],
      ["Жим на наклонной — 3×10", "Тяга горизонтального блока — 3×10", "Платформа — 3×12", "Бабочка на заднюю дельту — 3×15", "Молотки — 2×12", "Французский жим — 2×12"]
    ]
  },
  fb_classic: {
    name: "Фуллбади: классика",
    days: [
      ["Жим лёжа — 4×8–12", "Тяга верхнего блока — 4×8–12", "Платформа — 4×10", "Подъём гантелей — 3×12", "Подъём Z-грифа — 3×10", "Разгибание на блоке — 3×10"],
      ["Жим на наклонной — 4×8–12", "Тяга горизонтального блока — 4×8–12", "Приседания — 4×8", "Бабочка — 3×12", "Гантели сидя — 3×10", "Французский жим — 3×10"]
    ]
  },
  fb_chest: {
    name: "Фуллбади: упор грудь",
    days: [
      ["Жим лёжа — 4×8", "Жим на наклонной — 4×10", "Бабочка — 3×12–15", "Тяга верхнего блока — 3×10", "Платформа — 3×12", "Разгибание на блоке — 3×12"],
      ["Жим в тренажёре — 4×10", "Кроссовер — 3×15", "Тяга горизонтального блока — 3×10", "Разгибание на квадрицепс — 3×12", "Подъём гантелей — 3×15", "Скамья Скотта — 3×12"]
    ]
  },
  fb_back: {
    name: "Фуллбади: упор спина",
    days: [
      ["Тяга верхнего блока — 4×8–12", "Тяга горизонтального блока — 4×8–12", "Пуловер — 3×12", "Жим лёжа — 3×10", "Платформа — 3×12", "Молотки — 3×12"],
      ["Тяга верхнего блока в тренажёре — 4×10", "Тяга гантели одной рукой — 3×10", "Подтягивания — 3 подхода", "Жим на наклонной — 3×10", "Задняя поверхность бедра — 3×12", "Бабочка на заднюю дельту — 3×15"]
    ]
  },
  fb_legs: {
    name: "Фуллбади: упор ноги",
    days: [
      ["Приседания — 4×8", "Платформа — 4×10", "Разгибание на квадрицепс — 3×12", "Задняя поверхность бедра — 3×12", "Жим лёжа — 3×10", "Тяга верхнего блока — 3×10"],
      ["Платформа — 4×12", "Румынская тяга — 3×10", "Икры — 4×15", "Жим на наклонной — 3×10", "Тяга горизонтального блока — 3×10", "Подъём гантелей — 3×15"]
    ]
  },
  fb_shoulders: {
    name: "Фуллбади: упор плечи",
    days: [
      ["Жим гантелей сидя — 4×8–10", "Подъём гантелей — 4×12–15", "Бабочка на заднюю дельту — 4×12–15", "Жим лёжа — 3×10", "Тяга верхнего блока — 3×10", "Платформа — 3×12"],
      ["Разгибание в кроссовере — 4×12–15", "Тяга каната к лицу — 4×15", "Жим на наклонной — 3×10", "Тяга горизонтального блока — 3×10", "Приседания — 3×8", "Разгибание на блоке — 3×12"]
    ]
  },
  fb_arms: {
    name: "Фуллбади: упор руки",
    days: [
      ["Подъём Z-грифа — 4×10", "Скамья Скотта — 3×12", "Разгибание на блоке — 4×10", "Французский жим — 3×10", "Жим лёжа — 3×8", "Тяга верхнего блока — 3×10"],
      ["Гантели сидя — 3×12", "Молотки — 3×12", "Разгибание из-за головы — 3×12", "Узкий жим — 3×8", "Платформа — 3×12", "Подъём гантелей — 3×15"]
    ]
  },
  fb_strength: {
    name: "Фуллбади: силовая",
    days: [
      ["Жим лёжа — 5×5", "Приседания — 5×5", "Тяга верхнего блока — 4×6–8", "Жим гантелей сидя — 4×6", "Подъём Z-грифа — 3×8", "Разгибание на блоке — 3×8"],
      ["Жим на наклонной — 4×6", "Платформа — 5×8", "Тяга горизонтального блока — 4×8", "Французский жим — 3×8", "Скамья Скотта — 3×8"]
    ]
  },
  fb_home: {
    name: "Фуллбади: дом",
    days: [
      ["Отжимания — 4 подхода", "Выпады — 4×12", "Планка — 3 подхода", "Скручивания — 4×15", "Бег или ходьба — 20–30 мин"],
      ["Приседания без веса — 4×20", "Отжимания узкие — 4 подхода", "Подъём ног — 4×12", "Планка — 3 подхода", "Ходьба — 30 мин"]
    ]
  },
  fb_girls: {
    name: "Фуллбади: девушки",
    days: [
      ["Платформа — 4×12", "Задняя поверхность бедра — 4×12", "Ягодичный мост — 4×12", "Тяга верхнего блока — 3×10", "Жим в тренажёре — 3×12", "Пресс — 3 подхода"],
      ["Приседания — 4×10", "Выпады — 3×12", "Разгибание ног — 3×12", "Тяга горизонтального блока — 3×10", "Бабочка — 3×12", "Кардио — 20 мин"]
    ]
  },
  split_ppl: {
    name: "Сплит: Push / Pull / Legs",
    days: [
      ["Push", "Жим лёжа — 4×8", "Жим на наклонной — 4×10", "Жим гантелей сидя — 3×10", "Подъём гантелей — 3×15", "Разгибание на блоке — 4×12"],
      ["Pull", "Тяга верхнего блока — 4×10", "Тяга горизонтального блока — 4×10", "Пуловер — 3×12", "Бабочка на заднюю дельту — 3×15", "Подъём Z-грифа — 3×12"],
      ["Legs", "Приседания — 4×8", "Платформа — 4×12", "Разгибание ног — 3×15", "Задняя поверхность бедра — 3×12", "Икры — 4×15"]
    ]
  },
  split_upper_lower: {
    name: "Сплит: верх / низ",
    days: [
      ["Верх", "Жим лёжа — 4×8", "Тяга верхнего блока — 4×10", "Жим на наклонной — 3×10", "Тяга горизонтального блока — 3×10", "Подъём гантелей — 3×15", "Руки — 4 упражнения"],
      ["Низ", "Приседания — 4×8", "Платформа — 4×12", "Разгибание ног — 3×15", "Задняя поверхность бедра — 3×12", "Икры — 4×15", "Пресс — 3 подхода"]
    ]
  },
  split_classic: {
    name: "Сплит: грудь / спина / ноги",
    days: [
      ["Грудь", "Жим лёжа — 4×8–12", "Жим на наклонной — 4×8–12", "Жим в тренажёре — 3×10", "Бабочка — 3×12–15"],
      ["Спина", "Тяга верхнего блока — 4×8–12", "Тяга горизонтального блока — 4×8–12", "Тяга верхнего блока в тренажёре — 3×10", "Пуловер — 3×12–15"],
      ["Ноги", "Приседания — 4×8", "Платформа — 4×12", "Разгибание ног — 3×15", "Задняя поверхность бедра — 3×12", "Икры — 4×15"]
    ]
  },
  split_chest: {
    name: "Сплит: упор грудь",
    days: [
      ["Грудь тяжёлая", "Жим лёжа — 5×5", "Жим на наклонной — 4×8", "Жим в тренажёре — 3×10", "Бабочка — 3×15"],
      ["Спина + руки", "Тяга верхнего блока — 4×10", "Тяга горизонтального блока — 4×10", "Скамья Скотта — 3×12", "Разгибание на блоке — 3×12"],
      ["Грудь объёмная", "Жим на наклонной — 4×10", "Жим гантелей лёжа — 3×12", "Кроссовер — 3×15", "Бабочка — 3×15"],
      ["Ноги + плечи", "Платформа — 4×12", "Приседания — 3×8", "Подъём гантелей — 4×15", "Бабочка на заднюю дельту — 3×15"]
    ]
  },
  split_back: {
    name: "Сплит: упор спина",
    days: [
      ["Спина ширина", "Тяга верхнего блока — 5×8–12", "Тяга верхнего блока в тренажёре — 4×10", "Пуловер — 4×12"],
      ["Грудь + плечи", "Жим лёжа — 4×8", "Жим на наклонной — 3×10", "Подъём гантелей — 4×15"],
      ["Спина толщина", "Тяга горизонтального блока — 5×8–12", "Тяга гантели одной рукой — 4×10", "Бабочка на заднюю дельту — 4×15"],
      ["Ноги + руки", "Платформа — 4×12", "Разгибание ног — 3×15", "Подъём Z-грифа — 3×12", "Разгибание на блоке — 3×12"]
    ]
  },
  split_legs: {
    name: "Сплит: упор ноги",
    days: [
      ["Ноги тяжело", "Приседания — 5×5", "Платформа — 4×10", "Разгибание ног — 3×15", "Икры — 4×15"],
      ["Верх", "Жим лёжа — 4×8", "Тяга верхнего блока — 4×10", "Подъём гантелей — 3×15", "Руки — 4 упражнения"],
      ["Ноги объём", "Платформа — 5×12", "Задняя поверхность бедра — 4×12", "Выпады — 3×12", "Икры — 4×20"]
    ]
  },
  split_shoulders: {
    name: "Сплит: упор плечи",
    days: [
      ["Плечи тяжело", "Жим гантелей сидя — 4×8", "Подъём гантелей — 4×12", "Бабочка на заднюю дельту — 4×15"],
      ["Грудь + трицепс", "Жим лёжа — 4×8", "Жим на наклонной — 3×10", "Разгибание на блоке — 4×12"],
      ["Спина + бицепс", "Тяга верхнего блока — 4×10", "Тяга горизонтального блока — 4×10", "Подъём Z-грифа — 4×12"],
      ["Плечи объём", "Разгибание в кроссовере — 4×15", "Тяга каната к лицу — 4×15", "Подъём перед собой — 3×12"]
    ]
  },
  split_arms: {
    name: "Сплит: упор руки",
    days: [
      ["Бицепс + трицепс", "Подъём Z-грифа — 4×10", "Скамья Скотта — 3×12", "Разгибание на блоке — 4×10", "Французский жим — 3×10"],
      ["Грудь + спина", "Жим лёжа — 4×8", "Тяга верхнего блока — 4×10", "Жим на наклонной — 3×10", "Тяга горизонтального блока — 3×10"],
      ["Ноги + плечи", "Платформа — 4×12", "Приседания — 3×8", "Подъём гантелей — 4×15", "Бабочка на заднюю дельту — 3×15"],
      ["Руки объём", "Гантели сидя — 3×12", "Молотки — 3×12", "Разгибание из-за головы — 3×12", "Узкий жим — 3×8", "Фермерская прогулка — 3 подхода"]
    ]
  },
  split_beginner: {
    name: "Сплит: новичок",
    days: [
      ["Верх", "Жим лёжа — 3×10", "Тяга верхнего блока — 3×10", "Жим в тренажёре — 3×12", "Тяга горизонтального блока — 3×12", "Подъём гантелей — 3×15"],
      ["Низ", "Платформа — 4×12", "Разгибание ног — 3×15", "Задняя поверхность бедра — 3×12", "Икры — 4×15", "Скручивания — 3×15"]
    ]
  },
  split_bench: {
    name: "Сплит: силовой жим",
    days: [
      ["Жим тяжёлый", "Жим лёжа — 5×5", "Жим на наклонной — 4×6", "Узкий жим — 4×6", "Разгибание на блоке — 3×10"],
      ["Спина", "Тяга верхнего блока — 4×8", "Тяга горизонтального блока — 4×8", "Пуловер — 3×12", "Бабочка на заднюю дельту — 4×15"],
      ["Жим объём", "Жим лёжа — 4×8", "Жим в тренажёре — 4×10", "Бабочка — 3×15", "Французский жим — 3×10"],
      ["Ноги + плечи", "Приседания — 4×8", "Платформа — 4×12", "Жим гантелей сидя — 3×10", "Подъём гантелей — 3×15"]
    ]
  }
};

export default {
  async fetch(request, env) {
    try {
      if (request.method === "GET") return new Response("Gym Bot v1.1 работает");

      if (request.method === "POST") {
        const update = await request.json();
        if (update.message) await handleMessage(env, update.message);
        if (update.callback_query) await handleCallback(env, update.callback_query);
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
    await sendMessage(env, chatId, "Gym Bot v1.1\n\nГлавное меню:", mainMenu());
    return;
  }

  if (text.startsWith("/log ")) {
    await ensureVisitOncePer3Hours(env, msg.from);
    await saveResultFromText(env, chatId, msg.from.id, text);
    return;
  }

  await sendMessage(env, chatId, "Пока управляй ботом через кнопки.\n\nЗапись результата:\n/log bench 80 8", mainMenu());
}

async function handleCallback(env, cq) {
  const chatId = cq.message.chat.id;
  const msgId = cq.message.message_id;
  const data = cq.data;

  await answerCallback(env, cq.id);
  await ensureUser(env, cq.from);

  if (data === "menu") return editMessage(env, chatId, msgId, "Главное меню:", mainMenu());

  if (data === "trainings") return editMessage(env, chatId, msgId, "Тренировки\n\nВыбери действие:", trainingsMenu());

  if (data === "free_workout") {
    await ensureVisitOncePer3Hours(env, cq.from);
    return editMessage(env, chatId, msgId, "Свободная тренировка\n\nВыбери группу:", muscleGroupsMenu());
  }

  if (data === "log_result") {
    await ensureVisitOncePer3Hours(env, cq.from);
    return editMessage(env, chatId, msgId, "Записать результат\n\nСначала выбери упражнение:", muscleGroupsMenu());
  }

  if (data === "programs") return editMessage(env, chatId, msgId, "Программы тренировок\n\nВыбери тип:", programsMenu());

  if (data === "program_full") return editMessage(env, chatId, msgId, "Фуллбади\n\nВыбери программу:", programListMenu("fb"));

  if (data === "program_split") return editMessage(env, chatId, msgId, "Сплиты\n\nВыбери программу:", programListMenu("split"));

  if (data.startsWith("program:")) {
    await ensureVisitOncePer3Hours(env, cq.from);
    const id = data.replace("program:", "");
    return editMessage(env, chatId, msgId, programText(id), programMenu(id));
  }

  if (data === "analytics") {
    const text = await analyticsText(env, cq.from.id);
    return editMessage(env, chatId, msgId, text, navMenu("menu"));
  }

  if (data === "profile") return editMessage(env, chatId, msgId, profileText(cq.from), navMenu("menu"));

  if (data === "friends") return editMessage(env, chatId, msgId, friendsText(), navMenu("menu"));

  if (data === "food_supps") return editMessage(env, chatId, msgId, "Питание и БАДы\n\nВыбери раздел:", foodSuppsMenu());

  if (data === "food") return editMessage(env, chatId, msgId, nutritionText(), navMenu("food_supps"));

  if (data === "supps") return editMessage(env, chatId, msgId, "Пей креатин, чувак. Пока на этом всё.", navMenu("food_supps"));

  if (data.startsWith("group:")) {
    const groupId = data.replace("group:", "");
    const group = GROUPS[groupId];

    if (group.subs) return editMessage(env, chatId, msgId, group.title + "\n\nВыбери раздел:", subGroupsMenu(groupId));

    return editMessage(env, chatId, msgId, group.title + "\n\nВыбери упражнение:", exercisesMenu(group.ids, "free_workout"));
  }

  if (data.startsWith("sub:")) {
    const parts = data.split(":");
    const groupId = parts[1];
    const subId = parts[2];
    const sub = GROUPS[groupId].subs[subId];
    return editMessage(env, chatId, msgId, sub.title + "\n\nВыбери упражнение:", exercisesMenu(sub.ids, "group:" + groupId));
  }

  if (data.startsWith("ex:")) {
    const exId = data.replace("ex:", "");
    return editMessage(env, chatId, msgId, exerciseText(exId), exerciseMenu(exId));
  }

  if (data.startsWith("hist:")) {
    const exId = data.replace("hist:", "");
    const text = await historyText(env, cq.from.id, exId);
    return editMessage(env, chatId, msgId, text, navMenu("ex:" + exId));
  }

  if (data.startsWith("log_help:")) {
    const exId = data.replace("log_help:", "");
    const ex = EXERCISES[exId];
    await ensureVisitOncePer3Hours(env, cq.from);
    return editMessage(
      env,
      chatId,
      msgId,
      "Запись результата\n\n" + ex.name + "\n\nОтправь сообщением:\n/log " + exId + " 80 8\n\n80 — вес, 8 — повторы.",
      navMenu("ex:" + exId)
    );
  }

  if (data === "timer_90") return editMessage(env, chatId, msgId, "Таймер 90 секунд\n\nПока текстовый.", navMenu("trainings"));
}

function mainMenu() {
  return { inline_keyboard: [
    [{ text: "Тренировки", callback_data: "trainings" }],
    [{ text: "Программы тренировок", callback_data: "programs" }],
    [{ text: "Аналитика", callback_data: "analytics" }],
    [{ text: "Друзья", callback_data: "friends" }],
    [{ text: "Профиль", callback_data: "profile" }],
    [{ text: "Питание и БАДы", callback_data: "food_supps" }]
  ]};
}

function trainingsMenu() {
  return { inline_keyboard: [
    [{ text: "Свободная тренировка", callback_data: "free_workout" }],
    [{ text: "Записать результат", callback_data: "log_result" }],
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

function subGroupsMenu(groupId) {
  const subs = GROUPS[groupId].subs;
  const rows = Object.keys(subs).map(id => [{ text: subs[id].title, callback_data: "sub:" + groupId + ":" + id }]);
  rows.push([{ text: "Назад", callback_data: "free_workout" }, { text: "Главное меню", callback_data: "menu" }]);
  return { inline_keyboard: rows };
}

function exercisesMenu(ids, backTo) {
  const rows = ids.map(id => [{ text: EXERCISES[id].name, callback_data: "ex:" + id }]);
  rows.push([{ text: "Назад", callback_data: backTo }, { text: "Главное меню", callback_data: "menu" }]);
  return { inline_keyboard: rows };
}

function exerciseText(exId) {
  const ex = EXERCISES[exId];
  return ex.name + "\n\nГруппа: " + ex.group + (ex.sub ? "\nРаздел: " + ex.sub : "") +
    "\n\nТехника:\n• двигайся подконтрольно\n• не гонись за весом\n• держи амплитуду\n• выдох на усилии\n\nФото добавим следующим этапом.";
}

function exerciseMenu(exId) {
  return { inline_keyboard: [
    [{ text: "Записать результат", callback_data: "log_help:" + exId }],
    [{ text: "История", callback_data: "hist:" + exId }],
    [{ text: "Таймер 90 сек", callback_data: "timer_90" }],
    [{ text: "Назад", callback_data: "free_workout" }, { text: "Главное меню", callback_data: "menu" }]
  ]};
}

function programsMenu() {
  return { inline_keyboard: [
    [{ text: "Фуллбади", callback_data: "program_full" }],
    [{ text: "Сплиты", callback_data: "program_split" }],
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
  let text = p.name + "\n\n";
  p.days.forEach((day, i) => {
    text += "День " + (i + 1) + "\n";
    day.forEach(x => text += "• " + x + "\n");
    text += "\n";
  });
  return text.trim();
}

function programMenu(id) {
  return { inline_keyboard: [
    [{ text: "Начать эту программу", callback_data: "program:" + id }],
    [{ text: "Назад", callback_data: id.startsWith("fb_") ? "program_full" : "program_split" }, { text: "Главное меню", callback_data: "menu" }]
  ]};
}

function foodSuppsMenu() {
  return { inline_keyboard: [
    [{ text: "Питание", callback_data: "food" }],
    [{ text: "БАДы", callback_data: "supps" }],
    [{ text: "Назад", callback_data: "menu" }, { text: "Главное меню", callback_data: "menu" }]
  ]};
}

function navMenu(backTo) {
  return { inline_keyboard: [[{ text: "Назад", callback_data: backTo }, { text: "Главное меню", callback_data: "menu" }]] };
}

function profileText(from) {
  return "Профиль\n\nИмя: " + (from.first_name || "—") + "\nUsername: " + (from.username ? "@" + from.username : "—") + "\nID: " + from.id + "\n\nРост, вес, возраст и приватность добавим следующим этапом.";
}

function friendsText() {
  return "Друзья\n\nСкоро добавим:\n• добавить друга по ID\n• заявки в друзья\n• разрешение смотреть тренировки\n• сообщение друзьям";
}

function nutritionText() {
  return "ПИТАНИЕ — без занудства\n\n" +
    "Белок — 2+ грамма на кг веса.\n\n" +
    "Жиры — около 1–1.2 г на кг веса.\n\n" +
    "Углеводы — рубильник сушка / масса.\n" +
    "Сушка → углеводы вниз.\n" +
    "Масса → углеводы вверх.\n\n" +
    "Сон — 7–9 часов. Мышцы растут не в зале, а пока ты спишь.";
}

async function ensureVisitOncePer3Hours(env, from) {
  await ensureUser(env, from);

  const last = await supabaseGet(env, "gym_visits?user_id=eq." + from.id + "&select=visited_at&order=visited_at.desc&limit=1");

  if (last && last.length > 0) {
    const lastDate = new Date(last[0].visited_at);
    const diffHours = (Date.now() - lastDate.getTime()) / 1000 / 60 / 60;
    if (diffHours < VISIT_COOLDOWN_HOURS) return;
  }

  await fetch(env.SUPABASE_URL + "/rest/v1/gym_visits", {
    method: "POST",
    headers: supabaseHeaders(env, "return=minimal"),
    body: JSON.stringify({ user_id: from.id })
  });
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
    await sendMessage(env, chatId, "Формат такой:\n/log bench 80 8", mainMenu());
    return;
  }

  const ex = EXERCISES[exId];

  const res = await fetch(env.SUPABASE_URL + "/rest/v1/workout_results", {
    method: "POST",
    headers: supabaseHeaders(env, "return=representation"),
    body: JSON.stringify({
      telegram_id: userId,
      exercise: ex.name,
      weight,
      reps
    })
  });

  if (!res.ok) {
    await sendMessage(env, chatId, "Не сохранилось.\nСтатус: " + res.status + "\n" + await res.text(), mainMenu());
    return;
  }

  await sendMessage(env, chatId, "Записал!\n\n" + ex.name + ": " + weight + " кг × " + reps, {
    inline_keyboard: [
      [{ text: "История", callback_data: "hist:" + exId }],
      [{ text: "Главное меню", callback_data: "menu" }]
    ]
  });
}

async function historyText(env, userId, exId) {
  const ex = EXERCISES[exId];
  const rows = await supabaseGet(env, "workout_results?telegram_id=eq." + userId + "&exercise=eq." + encodeURIComponent(ex.name) + "&select=weight,reps,created_at&order=created_at.desc&limit=10");

  let text = "История\n\n" + ex.name + "\n";
  if (!rows || rows.length === 0) return text + "\nПока нет записей.";

  for (const r of rows) {
    text += "\n• " + new Date(r.created_at).toLocaleDateString("ru-RU") + " — " + r.weight + " кг × " + r.reps;
  }
  return text;
}

async function analyticsText(env, userId) {
  const visits = await supabaseGet(env, "gym_visits?user_id=eq." + userId + "&select=id");
  const results = await supabaseGet(env, "workout_results?telegram_id=eq." + userId + "&select=id");

  return "Аналитика\n\nПосещений зала: " + (visits ? visits.length : 0) + "\nЗаписей результатов: " + (results ? results.length : 0) + "\n\nГрафики добавим следующим этапом.";
}

async function supabaseGet(env, path) {
  const res = await fetch(env.SUPABASE_URL + "/rest/v1/" + path, { method: "GET", headers: supabaseHeaders(env) });
  if (!res.ok) return [];
  return await res.json();
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