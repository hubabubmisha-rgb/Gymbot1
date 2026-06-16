const VISIT_COOLDOWN_HOURS = 3;

const EX = {
  bench: ["Жим лёжа", "Грудь"],
  incline_bench: ["Жим на наклонной", "Грудь"],
  machine_press: ["Жим в тренажёре", "Грудь"],
  pec_deck: ["Бабочка", "Грудь"],
  crossover: ["Кроссовер", "Грудь"],
  dumbbell_press: ["Жим гантелей лёжа", "Грудь"],
  dips: ["Отжимания на брусьях", "Грудь"],
  pushups: ["Отжимания", "Грудь"],

  lat_pulldown: ["Тяга верхнего блока", "Спина"],
  lat_machine: ["Тяга верхнего блока в тренажёре", "Спина"],
  seated_row: ["Тяга горизонтального блока", "Спина"],
  pullover: ["Пуловер", "Спина"],
  pullups: ["Подтягивания", "Спина"],
  dumbbell_row: ["Тяга гантели одной рукой", "Спина"],
  deadlift: ["Становая тяга", "Спина"],
  t_bar: ["Тяга Т-грифа", "Спина"],
  hyperext: ["Гиперэкстензия", "Спина"],

  squat: ["Приседания", "Ноги"],
  leg_press: ["Платформа", "Ноги"],
  leg_ext: ["Разгибание на квадрицепс", "Ноги"],
  leg_curl: ["Задняя поверхность бедра в тренажёре", "Ноги"],
  calves: ["Икры", "Ноги"],
  lunges: ["Выпады", "Ноги"],
  romanian: ["Румынская тяга", "Ноги"],
  hack_squat: ["Гакк-приседания", "Ноги"],
  bulgarian: ["Болгарские выпады", "Ноги"],
  glute_bridge: ["Ягодичный мост", "Ноги"],

  shoulder_press: ["Жим гантелей сидя", "Плечи", "Передняя дельта"],
  front_raise: ["Подъём перед собой", "Плечи", "Передняя дельта"],
  arnold: ["Жим Арнольда", "Плечи", "Передняя дельта"],
  lateral_raise: ["Подъём гантелей", "Плечи", "Средняя дельта"],
  cable_lateral: ["Разгибание в кроссовере", "Плечи", "Средняя дельта"],
  upright_row: ["Тяга к подбородку", "Плечи", "Средняя дельта"],
  rear_deck: ["Бабочка на заднюю дельту", "Плечи", "Задняя дельта"],
  face_pull: ["Тяга каната к лицу", "Плечи", "Задняя дельта"],

  scott: ["Скамья Скотта", "Руки", "Бицепс"],
  zbar_curl: ["Подъём Z-грифа", "Руки", "Бицепс"],
  dumbbell_sitting: ["Гантели сидя", "Руки", "Бицепс"],
  dumbbell_standing: ["Гантели стоя", "Руки", "Бицепс"],
  cable_curl: ["Сгибание на блоке", "Руки", "Бицепс"],
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
  hanging_leg: ["Подъём ног в висе", "Пресс"],
  russian_twist: ["Русский твист", "Пресс"],

  bike: ["Велосипед", "Кардио"],
  walk: ["Ходьба", "Кардио"],
  run: ["Бег", "Кардио"],
  ellipse: ["Эллипс", "Кардио"],
  rope: ["Скакалка", "Кардио"],
  stairs: ["Степпер", "Кардио"]
};

const GROUPS = {
  chest: ["Грудь", ["bench", "incline_bench", "machine_press", "pec_deck", "crossover", "dumbbell_press", "dips", "pushups"]],
  back: ["Спина", ["lat_pulldown", "lat_machine", "seated_row", "pullover", "pullups", "dumbbell_row", "deadlift", "t_bar", "hyperext"]],
  legs: ["Ноги", ["squat", "leg_press", "leg_ext", "leg_curl", "calves", "lunges", "romanian", "hack_squat", "bulgarian", "glute_bridge"]],
  abs: ["Пресс", ["crunch", "leg_raise", "plank", "hanging_leg", "russian_twist"]],
  cardio: ["Кардио", ["bike", "walk", "run", "ellipse", "rope", "stairs"]]
};

const SUBGROUPS = {
  shoulders: {
    title: "Плечи",
    subs: {
      front: ["Передняя дельта", ["shoulder_press", "front_raise", "arnold"]],
      middle: ["Средняя дельта", ["lateral_raise", "cable_lateral", "upright_row"]],
      rear: ["Задняя дельта", ["rear_deck", "face_pull"]]
    }
  },
  arms: {
    title: "Руки",
    subs: {
      biceps: ["Бицепс", ["scott", "zbar_curl", "dumbbell_sitting", "dumbbell_standing", "cable_curl"]],
      triceps: ["Трицепс", ["triceps_pushdown", "overhead_triceps", "french_press", "close_grip"]],
      forearm: ["Предплечье", ["hammer", "reverse_curl", "farmer"]]
    }
  }
};

const TECH = {
  bench: "Лопатки сведены и прижаты, небольшой прогиб в пояснице, стопы в полу. Гриф опускай к низу груди, локти ~45°. Ошибки: разведённые локти, отбив от груди, подъём таза.",
  squat: "Штанга на верх трапеций, ноги чуть шире плеч, носки немного наружу. Таз назад и вниз, колени по направлению носков, спина прямая. Ошибки: круглая спина, колени внутрь, отрыв пяток.",
  deadlift: "Гриф над серединой стопы, спина прямая, плечи чуть впереди грифа. Тяни ногами, гриф скользит вдоль тела, в верхней точке полное выпрямление без переразгиба. Ошибки: круглая поясница, рывок, гриф далеко от ног.",
  lat_pulldown: "Грудь вверх, лёгкий прогиб, тяни локтями вниз к низу груди, сводя лопатки. Ошибки: раскачка корпусом, тяга за голову, работа только руками.",
  seated_row: "Спина прямая, тяни к животу, сводя лопатки, локти вдоль корпуса. Ошибки: округление спины, рывки, отклонение далеко назад.",
  shoulder_press: "Спина ровная, гантели на уровне ушей, жми вверх не до жёсткого замка. Ошибки: чрезмерный прогиб поясницы, разведение локтей далеко вперёд.",
  lateral_raise: "Лёгкий наклон вперёд, локти чуть согнуты, поднимай через стороны до уровня плеч, мизинцы чуть выше. Ошибки: заброс весом, подъём выше плеч, плечи к ушам.",
  zbar_curl: "Локти у корпуса, поднимай за счёт бицепса без раскачки, вверху короткая пауза. Ошибки: читинг корпусом, локти уходят вперёд.",
  triceps_pushdown: "Локти прижаты к корпусу и неподвижны, разгибай только предплечья, внизу полное выпрямление. Ошибки: локти гуляют, наклон всем телом.",
  leg_press: "Стопы на ширине плеч, опускай платформу до угла ~90° в коленях, поясница прижата. Ошибки: отрыв таза, полное распрямление с замком коленей.",
  romanian: "Ноги почти прямые, таз назад, спина прямая, опускай до растяжения задней поверхности бедра. Ошибки: круглая спина, приседание вместо наклона.",
  plank: "Тело в прямую линию, таз не провисает и не задран, пресс и ягодицы напряжены, дыши ровно. Ошибки: провал поясницы, задранный таз.",
  pullups: "Хват чуть шире плеч, тяни лопатками вниз, подбородок к перекладине, без рывков. Ошибки: неполная амплитуда, раскачка."
};

const MOTIVATION = [
  "Погнали в зал! 💪",
  "Не пропускай тренировку 🔥",
  "Ты сильнее, чем думаешь!",
  "Маленький шаг сегодня — большой результат завтра 🚀",
  "Дисциплина бьёт мотивацию. Вперёд!"
];

const CAT_ORDER = ["Грудь", "Спина", "Ноги", "Плечи", "Руки", "Пресс", "Кардио"];
const NAME2ID = {};
for (const id in EX) NAME2ID[EX[id][0].toLowerCase()] = id;
const CATS = {};
for (const id in EX) { const g = EX[id][1]; (CATS[g] = CATS[g] || []).push(id); }

const PROGRAMS = {
  fb_beginner: p("Фуллбади: новичок", [
    ["Жим лёжа 3x8", "Тяга верхнего блока 3x10", "Приседания 3x8", "Подъём гантелей 3x12", "Разгибание на блоке 2x12", "Скамья Скотта 2x12"],
    ["Жим на наклонной 3x10", "Тяга горизонтального блока 3x10", "Платформа 3x12", "Бабочка на заднюю дельту 3x15", "Молотки 2x12", "Французский жим 2x12"]
  ]),
  fb_classic: p("Фуллбади: классика", [
    ["Жим лёжа 4x8", "Тяга верхнего блока 4x10", "Платформа 4x10", "Подъём гантелей 3x12", "Подъём Z-грифа 3x10", "Разгибание на блоке 3x10"],
    ["Жим на наклонной 4x10", "Тяга горизонтального блока 4x10", "Приседания 4x8", "Бабочка 3x12", "Гантели сидя 3x10", "Французский жим 3x10"]
  ]),
  fb_strength: p("Фуллбади: силовая", [
    ["Жим лёжа 5x5", "Приседания 5x5", "Тяга верхнего блока 4x8", "Жим гантелей сидя 4x6", "Подъём Z-грифа 3x8", "Разгибание на блоке 3x8"],
    ["Жим на наклонной 4x6", "Платформа 5x8", "Тяга горизонтального блока 4x8", "Французский жим 3x8", "Скамья Скотта 3x8"]
  ]),
  fb_home: p("Фуллбади: дом", [
    ["Отжимания 4x15", "Выпады 4x12", "Планка 3x60", "Скручивания 4x15", "Бег 25"],
    ["Приседания 4x20", "Отжимания 4x12", "Подъём ног 4x12", "Планка 3x60", "Ходьба 30"]
  ]),
  fb_fatloss: p("Фуллбади: жиросжигание", [
    ["Платформа 4x15", "Жим в тренажёре 3x12", "Тяга верхнего блока 3x12", "Подъём гантелей 3x15", "Скручивания 3x20", "Велосипед 20"],
    ["Приседания 4x12", "Жим на наклонной 3x12", "Тяга горизонтального блока 3x12", "Бабочка 3x15", "Планка 3x60", "Эллипс 20"]
  ]),
  split_ppl: p("Сплит: Push / Pull / Legs", [
    ["Жим лёжа 4x8", "Жим на наклонной 4x10", "Жим гантелей сидя 3x10", "Подъём гантелей 3x15", "Разгибание на блоке 4x12"],
    ["Тяга верхнего блока 4x10", "Тяга горизонтального блока 4x10", "Пуловер 3x12", "Бабочка на заднюю дельту 3x15", "Подъём Z-грифа 3x12"],
    ["Приседания 4x8", "Платформа 4x12", "Разгибание на квадрицепс 3x15", "Задняя поверхность бедра в тренажёре 3x12", "Икры 4x15"]
  ]),
  split_upper_lower: p("Сплит: верх / низ", [
    ["Жим лёжа 4x8", "Тяга верхнего блока 4x10", "Жим на наклонной 3x10", "Тяга горизонтального блока 3x10", "Подъём гантелей 3x15"],
    ["Приседания 4x8", "Платформа 4x12", "Разгибание на квадрицепс 3x15", "Задняя поверхность бедра в тренажёре 3x12", "Икры 4x15"]
  ]),
  split_classic: p("Сплит: грудь / спина / ноги", [
    ["Жим лёжа 4x8", "Жим на наклонной 4x10", "Жим в тренажёре 3x10", "Бабочка 3x15"],
    ["Тяга верхнего блока 4x10", "Тяга горизонтального блока 4x10", "Тяга верхнего блока в тренажёре 3x10", "Пуловер 3x12"],
    ["Приседания 4x8", "Платформа 4x12", "Разгибание на квадрицепс 3x15", "Задняя поверхность бедра в тренажёре 3x12", "Икры 4x15"]
  ]),
  split_beginner: p("Сплит: новичок", [
    ["Жим лёжа 3x10", "Тяга верхнего блока 3x10", "Жим в тренажёре 3x12", "Тяга горизонтального блока 3x12", "Подъём гантелей 3x15"],
    ["Платформа 4x12", "Разгибание на квадрицепс 3x15", "Задняя поверхность бедра в тренажёре 3x12", "Икры 4x15", "Скручивания 3x15"]
  ])
};

export default {
  async fetch(request, env) {
    try {
      if (request.method === "GET") return new Response("Gym Bot v4 работает");
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

function p(name, days) { return { name, days }; }

// ===================== РОУТИНГ СООБЩЕНИЙ =====================

async function handleMessage(env, msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const text = (msg.text || "").trim();

  await ensureUser(env, msg.from);
  const st = await getState(env, userId);

  if (text === "/start" || text.toLowerCase() === "меню") {
    await clearState(env, userId);
    return sendMessage(env, chatId, await mainText(env, msg.from), mainMenu());
  }

  if (st?.state === "set_input") return handleSetInput(env, msg, st);
  if (st?.state === "set_note") return handleSetNote(env, msg, st);
  if (st?.state === "friend_add") return handleFriendAdd(env, msg);
  if (st?.state === "friend_broadcast") return handleBroadcast(env, msg);
  if (st?.state === "custom_name") return handleCustomName(env, msg);
  if (st?.state === "prof_height") return handleProfInput(env, msg, "height");
  if (st?.state === "prof_weight") return handleProfInput(env, msg, "weight");
  if (st?.state === "prof_age") return handleProfInput(env, msg, "age");
  if (st?.state === "water_custom") return handleWaterCustom(env, msg);
  if (st?.state === "water_goal") return handleWaterGoal(env, msg);

  return sendMessage(env, chatId, "Используй кнопки ниже 👇", mainMenu());
}

// ===================== РОУТИНГ КНОПОК =====================

async function handleCallback(env, cq) {
  const chatId = cq.message.chat.id;
  const msgId = cq.message.message_id;
  const userId = cq.from.id;
  const data = cq.data;
  const E = (t, kb) => editMessage(env, chatId, msgId, t, kb);

  await answerCallback(env, cq.id);
  await ensureUser(env, cq.from);

  if (data === "menu") return E(await mainText(env, cq.from), mainMenu());

  // ---- Тренировки ----
  if (data === "trainings") return E("🏋️ Тренировки", trainingsMenu());
  if (data === "log") { await ensureVisitOncePer3Hours(env, cq.from); return E("✍️ Записать результат\n\nВыбери группу:", muscleGroupsMenu("log")); }
  if (data === "sess_start") return E("▶️ Начать тренировку\n\nКак самочувствие/энергия сейчас?", energyMenu());
  if (data.startsWith("energy:")) return startSession(env, cq, Number(data.split(":")[1]));
  if (data === "sess_end") return endSession(env, cq);
  if (data === "repeat_last") return repeatLast(env, cq);
  if (data === "fav_list") return E(await favListText(env, userId), await favListMenu(env, userId));
  if (data === "spont") return E("🎲 Спонтанное упражнение\n\nВыбери группу:", spontMenu());
  if (data.startsWith("spont:")) return spontaneous(env, cq, data.split(":")[1]);

  // ---- Группы / упражнения ----
  if (data === "free") { await ensureVisitOncePer3Hours(env, cq.from); return E("🆓 Свободная тренировка\n\nВыбери группу:", muscleGroupsMenu("free")); }
  if (data.startsWith("group:")) {
    const g = data.split(":")[1];
    if (SUBGROUPS[g]) return E(SUBGROUPS[g].title + "\n\nВыбери раздел:", subGroupsMenu(g));
    return E(GROUPS[g][0] + "\n\nВыбери упражнение:", exercisesMenu(GROUPS[g][1], "free"));
  }
  if (data.startsWith("sub:")) {
    const [, g, s] = data.split(":");
    const sub = SUBGROUPS[g].subs[s];
    return E(sub[0] + "\n\nВыбери упражнение:", exercisesMenu(sub[1], "group:" + g));
  }
  if (data.startsWith("ex:")) {
    const id = data.split(":")[1];
    await syncJointExercise(env, userId, id);
    return E(await exerciseText(env, userId, id), await exerciseMenu(env, userId, id));
  }
  if (data.startsWith("set:")) {
    const id = data.split(":")[1];
    await setState(env, userId, "set_input", { exercise_id: id });
    return E("Запись подхода\n\n" + EX[id][0] + "\n\nВведи вес и повторы одним сообщением.\nПример: 80 8", navMenu("ex:" + id));
  }
  if (data.startsWith("hist:")) { const id = data.split(":")[1]; return E(await historyText(env, userId, id), navMenu("ex:" + id)); }
  if (data.startsWith("note:")) {
    const id = data.split(":")[1];
    await setState(env, userId, "set_note", { exercise_id: id });
    const ex = await getNote(env, userId, id);
    return E("✏️ Заметка к «" + EX[id][0] + "»" + (ex ? "\n\nСейчас:\n" + ex : "\n\nЗаметки пока нет.") + "\n\nНапиши новый текст (заменит старый).", navMenu("ex:" + id));
  }
  if (data.startsWith("fav:")) { const id = data.split(":")[1]; await toggleFav(env, userId, id); return E(await exerciseText(env, userId, id), await exerciseMenu(env, userId, id)); }
  if (data.startsWith("tech:")) { const id = data.split(":")[1]; return E("📚 Техника — " + EX[id][0] + "\n\n" + (TECH[id] || "Делай движение подконтрольно, без рывков, в полной амплитуде. Спина в нейтральном положении, дыхание ровное: выдох на усилии. Вес такой, чтобы техника не ломалась."), navMenu("ex:" + id)); }

  // ---- Программы ----
  if (data === "programs") return E("📋 Программы тренировок", programsMenu());
  if (data === "program_full") return E("Фуллбади:", programListMenu("fb"));
  if (data === "program_split") return E("Сплиты:", programListMenu("split"));
  if (data.startsWith("program:")) { const id = data.split(":")[1]; return E(programText(id), programMenu(id)); }
  if (data.startsWith("saveprog:")) {
    const id = data.split(":")[1];
    await saveProgram(env, userId, PROGRAMS[id].name, "suggested", PROGRAMS[id]);
    return E("✅ Сохранено в Мои тренировки:\n\n" + PROGRAMS[id].name, navMenu("my_trainings"));
  }
  if (data === "prog_train") return E("🎯 Тренировка по программе\n\nОткуда берём?", { inline_keyboard: [
    [{ text: "Готовые: Фуллбади", callback_data: "ptrain_full" }],
    [{ text: "Готовые: Сплиты", callback_data: "ptrain_split" }],
    [{ text: "🗂 Мои тренировки", callback_data: "ptrain_my" }],
    [{ text: "Назад", callback_data: "programs" }, { text: "Главное меню", callback_data: "menu" }]
  ]});
  if (data === "ptrain_full" || data === "ptrain_split") {
    const type = data === "ptrain_full" ? "fb" : "split";
    const rows = Object.keys(PROGRAMS).filter(id => id.startsWith(type + "_")).map(id => [{ text: PROGRAMS[id].name, callback_data: "pstart:s:" + id }]);
    rows.push([{ text: "Назад", callback_data: "prog_train" }, { text: "Главное меню", callback_data: "menu" }]);
    return E("Выбери программу:", { inline_keyboard: rows });
  }
  if (data === "ptrain_my") {
    const list = await supabaseGet(env, "custom_programs?user_id=eq." + userId + "&select=id,name&order=created_at.desc&limit=20");
    const rows = list.map(r => [{ text: r.name, callback_data: "pstart:c:" + r.id }]);
    rows.push([{ text: "Назад", callback_data: "prog_train" }, { text: "Главное меню", callback_data: "menu" }]);
    return E(list.length ? "Выбери программу:" : "Пусто. Создай программу в Программы → Создать.", { inline_keyboard: rows });
  }
  if (data.startsWith("pstart:")) return programDayPick(env, cq, data);
  if (data.startsWith("pday:")) return startProgramDay(env, cq, data);

  // ---- Мои тренировки / конструктор ----
  if (data === "my_trainings") return E(await myTrainingsText(env, userId), await myTrainingsMenu(env, userId));
  if (data.startsWith("myprog:")) { const id = data.split(":")[1]; return E(await customProgramText(env, id), customProgramMenu(id)); }
  if (data.startsWith("delprog:")) { const id = data.split(":")[1]; await supabaseDelete(env, "custom_programs?id=eq." + id); return E("Программа удалена.", navMenu("my_trainings")); }
  if (data === "custom_program") { await setState(env, userId, "custom_name", {}); return E("➕ Новая программа\n\nНапиши название одним сообщением.", navMenu("my_trainings")); }
  if (data.startsWith("editprog:")) { const id = data.split(":")[1]; return openEditor(env, cq, id); }
  if (data.startsWith("ce:")) return openEditor(env, cq, data.split(":")[1]);
  if (data.startsWith("cead:")) return editorAddDay(env, cq, data.split(":")[1]);
  if (data.startsWith("cdd:")) { const [, id, day] = data.split(":"); return editorDelDay(env, cq, id, Number(day)); }
  if (data.startsWith("cg:")) { const [, id, day] = data.split(":"); return E("Категория:", catMenu(id, day)); }
  if (data.startsWith("ccat:")) { const [, id, day, ci] = data.split(":"); return E("Упражнение:", catExMenu(id, day, Number(ci))); }
  if (data.startsWith("cex:")) { const [, id, day, exId] = data.split(":"); return E(EX[exId][0] + "\n\nСколько подходов?", setsMenu(id, day, exId)); }
  if (data.startsWith("cset:")) { const [, id, day, exId, sets] = data.split(":"); return E(EX[exId][0] + " — " + sets + " подх.\n\nСколько повторов?", repsMenu(id, day, exId, sets)); }
  if (data.startsWith("creps:")) return editorAddItem(env, cq, data);
  if (data.startsWith("cdel:")) return editorDelItem(env, cq, data);
  if (data.startsWith("cmu:")) return editorMove(env, cq, data, -1);
  if (data.startsWith("cmd:")) return editorMove(env, cq, data, 1);

  // ---- Подбор ----
  if (data === "pick") { await setState(env, userId, "pick", {}); return E("🧩 Подбор тренировки\n\nКак тренируем ноги?", pickMenu("legs")); }
  if (data.startsWith("pick:")) return handlePick(env, cq, data);

  // ---- Аналитика ----
  if (data === "analytics") return E("📊 Аналитика", analyticsMenu());
  if (data === "an_summary") return E(await analyticsSummary(env, userId), navMenu("analytics"));
  if (data === "an_groups") return analyticsGroups(env, cq);
  if (data === "an_visits") return analyticsVisits(env, cq);
  if (data === "an_last") return E(await lastWorkoutsText(env, userId), navMenu("analytics"));
  if (data === "an_records") return E(await recordsText(env, userId), navMenu("analytics"));
  if (data === "an_energy") return E(await energyText(env, userId), navMenu("analytics"));
  if (data === "an_export") return analyticsExport(env, cq);

  // ---- Профиль ----
  if (data === "profile") return E(await profileText(env, cq.from), profileMenu());
  if (data === "profile_edit") { await setState(env, userId, "prof_height", {}); return E("✏️ Заполнение профиля\n\nВведи рост в см (например 180).", navMenu("profile")); }
  if (data.startsWith("prof_sex:")) { await supabasePatch(env, "users?id=eq." + userId, { sex: data.split(":")[1] }); return E("Пол сохранён.\n\nУровень активности?", activityMenu()); }
  if (data.startsWith("prof_activity:")) { await supabasePatch(env, "users?id=eq." + userId, { activity: data.split(":")[1] }); await clearState(env, userId); return E(await profileText(env, cq.from), profileMenu()); }
  if (data === "privacy") return E(privacyHeader(), await privacyMenu(env, userId));
  if (data.startsWith("priv:")) {
    const field = "priv_" + data.split(":")[1];
    const u = await getUser(env, userId);
    await supabasePatch(env, "users?id=eq." + userId, { [field]: !(u && u[field] !== false) });
    return E(privacyHeader(), await privacyMenu(env, userId));
  }

  // ---- Восстановление ----
  if (data === "recovery") return E("🧖 Восстановление\n\nСон и баня — половина результата. Выбери раздел:", recoveryMenu());
  if (data === "rec_sleep") return E(sleepText(), navMenu("recovery"));
  if (data === "rec_sauna") return E(saunaText(), navMenu("recovery"));

  // ---- Друзья ----
  if (data === "friends") return E("👥 Друзья", friendsMenu());
  if (data === "friend_add") { await setState(env, userId, "friend_add", {}); return E("Добавить друга\n\nПусть друг откроет Профиль и пришлёт свой ID. Введи ID сообщением.", navMenu("friends")); }
  if (data === "friend_list") return E(await friendListText(env, userId), await friendListMenu(env, userId));
  if (data === "friend_requests") return E("Заявки в друзья:", await friendRequestsMenu(env, userId));
  if (data.startsWith("frq_ac:")) return acceptFriend(env, cq, Number(data.split(":")[1]));
  if (data.startsWith("frq_de:")) return declineFriend(env, cq, Number(data.split(":")[1]));
  if (data.startsWith("fdel:")) { const fid = Number(data.split(":")[1]); await removeFriend(env, userId, fid); return E(await friendListText(env, userId), await friendListMenu(env, userId)); }
  if (data.startsWith("fview:")) return E(await friendViewText(env, userId, Number(data.split(":")[1])), navMenu("friend_list"));
  if (data === "friend_msg") return E("✉️ Сообщение друзьям", broadcastMenu());
  if (data.startsWith("bcast:")) return sendTemplate(env, cq, Number(data.split(":")[1]));
  if (data === "bcast_custom") { await setState(env, userId, "friend_broadcast", {}); return E("Напиши сообщение — отправлю всем твоим друзьям.", navMenu("friend_msg")); }
  if (data === "joint") return E("🤝 Совместная тренировка\n\nВыбери друга:", await jointPickMenu(env, userId));
  if (data.startsWith("jinv:")) return jointInvite(env, cq, Number(data.split(":")[1]));
  if (data.startsWith("jac:")) return jointAccept(env, cq, Number(data.split(":")[1]));
  if (data.startsWith("jde:")) return jointDecline(env, cq, Number(data.split(":")[1]));

  // ---- Рейтинг ----
  if (data === "leaderboard") return E("🏆 Рейтинг среди друзей (за 7 дней)", leaderboardMenu());
  if (data.startsWith("lb:")) return leaderboard(env, cq, data.split(":")[1]);

  // ---- Челленджи ----
  if (data === "challenges") return E(await challengesText(env, userId), await challengesMenu(env, userId));
  if (data === "ch_new") return E("🎯 Новый челлендж\n\nГотовые шаблоны или свой:", challengeTemplatesMenu());
  if (data.startsWith("chtpl:")) return createChallengeTemplate(env, cq, Number(data.split(":")[1]));
  if (data === "ch_custom") return E("Тип челленджа:", { inline_keyboard: [
    [{ text: "Кол-во тренировок", callback_data: "chc:workouts" }],
    [{ text: "Тоннаж (кг)", callback_data: "chc:tonnage" }],
    [{ text: "Назад", callback_data: "challenges" }]
  ]});
  if (data.startsWith("chc:")) { const t = data.split(":")[1]; return E("Период:", { inline_keyboard: [
    [{ text: "Неделя", callback_data: "chcp:" + t + ":week" }],
    [{ text: "Месяц", callback_data: "chcp:" + t + ":month" }],
    [{ text: "Назад", callback_data: "ch_custom" }]
  ]}); }
  if (data.startsWith("chcp:")) { const [, t, per] = data.split(":"); return E("Цель:", goalMenu(t, per)); }
  if (data.startsWith("chmk:")) return createChallengeCustom(env, cq, data);
  if (data.startsWith("ch_join:")) return joinChallenge(env, cq, Number(data.split(":")[1]));
  if (data.startsWith("ch_view:")) return E(await challengeViewText(env, Number(data.split(":")[1])), navMenu("challenges"));
  if (data.startsWith("ch_leave:")) { const id = Number(data.split(":")[1]); await supabaseDelete(env, "challenge_members?challenge_id=eq." + id + "&user_id=eq." + userId); return E(await challengesText(env, userId), await challengesMenu(env, userId)); }

  // ---- Питание ----
  if (data === "food_supps") return E("🍽 Питание и БАДы", foodMenu());
  if (data === "food_principles") return E(nutritionText(), navMenu("food_supps"));
  if (data === "food_recipes") return E("🥗 Рецепты\n\nВыбери приём пищи:", recipesMenu());
  if (data.startsWith("recipe:")) return E(recipeText(data.split(":")[1]), navMenu("food_recipes"));
  if (data === "supps") return E(suppsText(), navMenu("food_supps"));
  if (data === "water") return E(await waterText(env, userId), waterMenu());
  if (data.startsWith("water_add:")) { await addWater(env, userId, Number(data.split(":")[1])); return E(await waterText(env, userId), waterMenu()); }
  if (data === "water_custom") { await setState(env, userId, "water_custom", {}); return E("💧 Введи объём в мл (например 300).", navMenu("water")); }
  if (data === "water_goal") { await setState(env, userId, "water_goal", {}); return E("🎯 Введи цель в мл (например 2500).", navMenu("water")); }
}

// ===================== ГЛАВНОЕ МЕНЮ =====================

async function mainText(env, from) {
  let t = "🏠 Главное меню\n\nПривет, " + (from.first_name || "друг") + "! 💪 Что делаем сегодня?";
  const stale = await staleGroup(env, from.id);
  if (stale) t += "\n\n💤 Давно не качал: " + stale.group + " (" + stale.days + " дн.)";
  return t;
}

function mainMenu() {
  return { inline_keyboard: [
    [{ text: "🏋️ Тренировки", callback_data: "trainings" }],
    [{ text: "📋 Программы тренировок", callback_data: "programs" }],
    [{ text: "📊 Аналитика", callback_data: "analytics" }],
    [{ text: "🍽 Питание и БАДы", callback_data: "food_supps" }],
    [{ text: "🧖 Восстановление", callback_data: "recovery" }],
    [{ text: "👥 Друзья", callback_data: "friends" }],
    [{ text: "🏆 Челленджи", callback_data: "challenges" }],
    [{ text: "👤 Профиль", callback_data: "profile" }]
  ]};
}

function trainingsMenu() {
  return { inline_keyboard: [
    [{ text: "✍️ Записать результат", callback_data: "log" }],
    [{ text: "▶️ Начать тренировку", callback_data: "sess_start" }],
    [{ text: "⏹ Закончить тренировку", callback_data: "sess_end" }],
    [{ text: "🔁 Повторить прошлую", callback_data: "repeat_last" }],
    [{ text: "⭐ Избранные", callback_data: "fav_list" }],
    [{ text: "🎲 Спонтанное упражнение", callback_data: "spont" }],
    [{ text: "Главное меню", callback_data: "menu" }]
  ]};
}

function programsMenu() {
  return { inline_keyboard: [
    [{ text: "🆓 Свободная тренировка", callback_data: "free" }],
    [{ text: "🎯 Тренировка по программе", callback_data: "prog_train" }],
    [{ text: "Фуллбади", callback_data: "program_full" }],
    [{ text: "Сплиты", callback_data: "program_split" }],
    [{ text: "🗂 Мои тренировки", callback_data: "my_trainings" }],
    [{ text: "➕ Создать программу", callback_data: "custom_program" }],
    [{ text: "🧩 Подобрать тренировку", callback_data: "pick" }],
    [{ text: "Главное меню", callback_data: "menu" }]
  ]};
}

function muscleGroupsMenu(back) {
  return { inline_keyboard: [
    [{ text: "Грудь", callback_data: "group:chest" }],
    [{ text: "Спина", callback_data: "group:back" }],
    [{ text: "Ноги", callback_data: "group:legs" }],
    [{ text: "Плечи", callback_data: "group:shoulders" }],
    [{ text: "Руки", callback_data: "group:arms" }],
    [{ text: "Пресс", callback_data: "group:abs" }],
    [{ text: "Кардио", callback_data: "group:cardio" }],
    [{ text: "Назад", callback_data: back === "log" ? "trainings" : "programs" }, { text: "Главное меню", callback_data: "menu" }]
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

async function exerciseMenu(env, userId, id) {
  const fav = await isFav(env, userId, id);
  return { inline_keyboard: [
    [{ text: "Записать подход", callback_data: "set:" + id }],
    [{ text: "История", callback_data: "hist:" + id }, { text: "📚 Техника", callback_data: "tech:" + id }],
    [{ text: "✏️ Заметка", callback_data: "note:" + id }, { text: fav ? "★ В избранном" : "⭐ В избранное", callback_data: "fav:" + id }],
    [{ text: "Назад", callback_data: "free" }, { text: "Главное меню", callback_data: "menu" }]
  ]};
}

// ===================== ЗАПИСЬ ПОДХОДА + PR =====================

async function handleSetInput(env, msg, st) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const exId = st.data.exercise_id;
  const parts = msg.text.trim().replace(",", ".").split(/\s+/);
  const weight = Number(parts[0]);
  const reps = Number(parts[1]);
  if (!weight || !reps) return sendMessage(env, chatId, "Нужно так: 80 8", navMenu("ex:" + exId));

  await ensureVisitOncePer3Hours(env, msg.from);
  const prev = await supabaseGet(env, "workout_sets?user_id=eq." + userId + "&exercise_id=eq." + exId + "&select=weight&order=weight.desc&limit=1");
  const prevMax = prev[0] ? Number(prev[0].weight) : 0;
  const session = await activeSession(env, userId);

  await supabaseInsert(env, "workout_sets", {
    user_id: userId, exercise_id: exId, exercise_name: EX[exId][0],
    weight, reps, session_id: session ? session.id : null
  });
  await clearState(env, userId);

  let t = "✅ Сохранено\n\n" + EX[exId][0] + "\n" + weight + " кг x " + reps;
  if (weight > prevMax && prevMax > 0) t += "\n\n🔥 Новый личный рекорд по весу!";
  t += "\n\nОценка 1ПМ ≈ " + Math.round(weight * (1 + reps / 30)) + " кг";

  return sendMessage(env, chatId, t, { inline_keyboard: [
    [{ text: "Ещё подход", callback_data: "set:" + exId }, { text: "✏️ Заметка", callback_data: "note:" + exId }],
    [{ text: "История", callback_data: "hist:" + exId }],
    [{ text: "Назад", callback_data: "ex:" + exId }, { text: "Главное меню", callback_data: "menu" }]
  ]});
}

async function handleSetNote(env, msg, st) {
  const exId = st.data.exercise_id;
  await saveNote(env, msg.from.id, exId, msg.text.trim());
  await clearState(env, msg.from.id);
  return sendMessage(env, msg.chat.id, "✏️ Заметка сохранена.", navMenu("ex:" + exId));
}

async function historyText(env, userId, exId) {
  const rows = await supabaseGet(env, "workout_sets?user_id=eq." + userId + "&exercise_id=eq." + exId + "&select=weight,reps,created_at&order=created_at.desc&limit=12");
  let t = "История\n\n" + EX[exId][0] + "\n";
  if (!rows.length) return t + "\nПока нет записей.";
  for (const r of rows) t += "\n• " + fmtDate(r.created_at) + " — " + r.weight + " кг x " + r.reps;
  return t;
}

// ===================== СЕССИИ =====================

function energyMenu() {
  return { inline_keyboard: [
    [{ text: "1 😩", callback_data: "energy:1" }, { text: "2 😕", callback_data: "energy:2" }, { text: "3 😐", callback_data: "energy:3" }, { text: "4 🙂", callback_data: "energy:4" }, { text: "5 💪", callback_data: "energy:5" }],
    [{ text: "Пропустить", callback_data: "energy:0" }],
    [{ text: "Назад", callback_data: "trainings" }]
  ]};
}

async function activeSession(env, userId) {
  const rows = await supabaseGet(env, "workout_sessions?status=eq.active&or=(user_id.eq." + userId + ",partner_id.eq." + userId + ")&select=id,user_id,partner_id,kind,current_exercise_id,started_at&order=started_at.desc&limit=1");
  return rows[0] || null;
}

async function startSession(env, cq, energy) {
  const userId = cq.from.id;
  const ex = await activeSession(env, userId);
  if (ex) return editMessage(env, cq.message.chat.id, cq.message.message_id, "У тебя уже идёт тренировка. Закончи её, чтобы начать новую.", trainingsMenu());
  await supabaseInsert(env, "workout_sessions", { user_id: userId, kind: "solo", status: "active", energy: energy || null });
  await ensureVisitOncePer3Hours(env, cq.from);
  return editMessage(env, cq.message.chat.id, cq.message.message_id, "▶️ Тренировка начата! Записывай подходы — время и тоннаж посчитаются автоматически.\n\nКогда закончишь — жми «Закончить тренировку».", trainingsMenu());
}

async function endSession(env, cq) {
  const userId = cq.from.id;
  const chatId = cq.message.chat.id;
  const s = await activeSession(env, userId);
  if (!s) return editMessage(env, chatId, cq.message.message_id, "Активной тренировки нет. Начни её кнопкой «Начать тренировку».", trainingsMenu());
  const ended = new Date().toISOString();
  await supabasePatch(env, "workout_sessions?id=eq." + s.id, { status: "ended", ended_at: ended });

  const sets = await supabaseGet(env, "workout_sets?session_id=eq." + s.id + "&user_id=eq." + userId + "&select=exercise_name,weight,reps,created_at&order=created_at.asc");
  const mins = Math.max(1, Math.round((Date.now() - new Date(s.started_at).getTime()) / 60000));
  let tonnage = 0; const byEx = {};
  for (const x of sets) { const v = Number(x.weight) * Number(x.reps); tonnage += v; byEx[x.exercise_name] = (byEx[x.exercise_name] || 0) + v; }

  let cap = "🏁 Тренировка завершена!\n\n⏱ Время: " + mins + " мин\n🏋️ Подходов: " + sets.length + "\n📦 Тоннаж: " + fmtNum(tonnage) + " кг";
  if (sets.length) { cap += "\n\nУпражнения:"; for (const n in byEx) cap += "\n• " + n + " — " + fmtNum(byEx[n]) + " кг"; }

  const labels = Object.keys(byEx);
  if (labels.length) {
    const url = chartUrl({ type: "bar", data: { labels, datasets: [{ label: "Тоннаж, кг", data: labels.map(n => Math.round(byEx[n])), backgroundColor: "#4f8cff" }] },
      options: { plugins: { title: { display: true, text: "Итоги: " + mins + " мин · " + fmtNum(tonnage) + " кг" }, legend: { display: false } } } });
    await sendPhoto(env, chatId, url, cap, trainingsMenu());
  } else {
    await sendMessage(env, chatId, cap + "\n\nВ этот раз подходы не записаны.", trainingsMenu());
  }
}

async function repeatLast(env, cq) {
  const userId = cq.from.id;
  const chatId = cq.message.chat.id;
  const last = await supabaseGet(env, "workout_sessions?user_id=eq." + userId + "&status=eq.ended&select=id&order=ended_at.desc&limit=1");
  if (!last.length) return editMessage(env, chatId, cq.message.message_id, "Прошлых завершённых тренировок пока нет.", trainingsMenu());
  const sets = await supabaseGet(env, "workout_sets?session_id=eq." + last[0].id + "&select=exercise_id&order=created_at.asc");
  const ids = [...new Set(sets.map(s => s.exercise_id))].filter(Boolean);
  if (!ids.length) return editMessage(env, chatId, cq.message.message_id, "В прошлой тренировке нет записанных упражнений.", trainingsMenu());
  const ex = await activeSession(env, userId);
  if (!ex) await supabaseInsert(env, "workout_sessions", { user_id: userId, kind: "solo", status: "active" });
  await ensureVisitOncePer3Hours(env, cq.from);
  const rows = ids.map(id => [{ text: EX[id] ? EX[id][0] : id, callback_data: "ex:" + id }]);
  rows.push([{ text: "⏹ Закончить тренировку", callback_data: "sess_end" }]);
  rows.push([{ text: "Главное меню", callback_data: "menu" }]);
  return editMessage(env, chatId, cq.message.message_id, "🔁 Повтор прошлой тренировки. Упражнения подтянуты — записывай подходы:", { inline_keyboard: rows });
}

function spontMenu() {
  return { inline_keyboard: [
    ...Object.keys(GROUPS).map(g => [{ text: GROUPS[g][0], callback_data: "spont:" + g }]),
    [{ text: "Плечи", callback_data: "spont:shoulders" }, { text: "Руки", callback_data: "spont:arms" }],
    [{ text: "Любая", callback_data: "spont:any" }],
    [{ text: "Назад", callback_data: "trainings" }]
  ]};
}

async function spontaneous(env, cq, g) {
  let pool = [];
  if (g === "any") pool = Object.keys(EX);
  else if (GROUPS[g]) pool = GROUPS[g][1];
  else if (SUBGROUPS[g]) for (const s in SUBGROUPS[g].subs) pool = pool.concat(SUBGROUPS[g].subs[s][1]);
  const id = pool[Math.floor(Math.random() * pool.length)];
  return editMessage(env, cq.message.chat.id, cq.message.message_id, "🎲 Тебе выпало:\n\n" + (await exerciseText(env, cq.from.id, id)), await exerciseMenu(env, cq.from.id, id));
}

// ===================== ПРОГРАММЫ =====================

function programListMenu(type) {
  const rows = [];
  for (const id of Object.keys(PROGRAMS)) if (id.startsWith(type + "_")) rows.push([{ text: PROGRAMS[id].name, callback_data: "program:" + id }]);
  rows.push([{ text: "Назад", callback_data: "programs" }, { text: "Главное меню", callback_data: "menu" }]);
  return { inline_keyboard: rows };
}

function programText(id) { return renderProgram(normalizeProgram(PROGRAMS[id])); }

function programMenu(id) {
  return { inline_keyboard: [
    [{ text: "▶️ Заниматься по программе", callback_data: "pstart:s:" + id }],
    [{ text: "💾 Сохранить в мои", callback_data: "saveprog:" + id }],
    [{ text: "Назад", callback_data: id.startsWith("fb_") ? "program_full" : "program_split" }, { text: "Главное меню", callback_data: "menu" }]
  ]};
}

function renderProgram(pr) {
  let t = pr.name + "\n\n";
  pr.days.forEach((d, i) => {
    t += (d.title || ("День " + (i + 1))) + "\n";
    d.items.forEach(it => t += "• " + itemLabel(it) + "\n");
    t += "\n";
  });
  return t.trim();
}

function itemLabel(it) {
  if (it.ex && EX[it.ex]) return EX[it.ex][0] + (it.sets && it.reps ? " " + it.sets + "x" + it.reps : "");
  return it.label || "";
}

function normalizeProgram(data) {
  const name = data.name || "Программа";
  const days = (data.days || []).map((d, i) => {
    if (Array.isArray(d)) {
      const items = d.map(s => parseLine(String(s)));
      let title = "День " + (i + 1);
      if (items.length && !items[0].ex && !/\d/.test(items[0].label)) { title = items[0].label; items.shift(); }
      return { title, items };
    }
    return { title: d.title || ("День " + (i + 1)), items: (d.items || []).map(it => ({ ex: it.ex || null, label: it.label || (it.ex && EX[it.ex] ? EX[it.ex][0] : ""), sets: it.sets || null, reps: it.reps || null })) };
  });
  return { name, days };
}

function parseLine(s) {
  const m = s.match(/^(.*?)[\s]+(\d+)x(\d+)\s*$/);
  if (m) { const ex = NAME2ID[m[1].trim().toLowerCase()] || null; return { ex, label: s, sets: Number(m[2]), reps: Number(m[3]) }; }
  const m2 = s.match(/^(.*?)[\s]+\d+\s*$/);
  if (m2) { const ex = NAME2ID[m2[1].trim().toLowerCase()] || null; if (ex) return { ex, label: s, sets: null, reps: null }; }
  const ex2 = NAME2ID[s.trim().toLowerCase()] || null;
  return { ex: ex2, label: s, sets: null, reps: null };
}

async function programDayPick(env, cq, data) {
  const [, src, id] = data.split(":");
  const pr = await loadProgram(env, src, id);
  if (!pr) return editMessage(env, cq.message.chat.id, cq.message.message_id, "Программа не найдена.", navMenu("programs"));
  const rows = pr.days.map((d, i) => [{ text: (d.title || ("День " + (i + 1))), callback_data: "pday:" + src + ":" + id + ":" + i }]);
  rows.push([{ text: "Назад", callback_data: "prog_train" }, { text: "Главное меню", callback_data: "menu" }]);
  return editMessage(env, cq.message.chat.id, cq.message.message_id, "🎯 " + pr.name + "\n\nВыбери день:", { inline_keyboard: rows });
}

async function startProgramDay(env, cq, data) {
  const [, src, id, dayIdx] = data.split(":");
  const userId = cq.from.id;
  const pr = await loadProgram(env, src, id);
  const day = pr.days[Number(dayIdx)];
  if (!day) return editMessage(env, cq.message.chat.id, cq.message.message_id, "День не найден.", navMenu("programs"));
  const ex = await activeSession(env, userId);
  if (!ex) await supabaseInsert(env, "workout_sessions", { user_id: userId, kind: "program", status: "active", program_id: src + ":" + id, day_index: Number(dayIdx) });
  await ensureVisitOncePer3Hours(env, cq.from);

  let t = "🎯 " + pr.name + " — " + (day.title || ("День " + (Number(dayIdx) + 1))) + "\n\nЖми упражнение, чтобы записать подход. Прошлые результаты видно внутри.\n";
  const rows = [];
  for (const it of day.items) {
    if (it.ex && EX[it.ex]) rows.push([{ text: itemLabel(it), callback_data: "ex:" + it.ex }]);
    else t += "\n• " + (it.label || "") + " (без записи)";
  }
  rows.push([{ text: "⏹ Закончить тренировку", callback_data: "sess_end" }]);
  rows.push([{ text: "Главное меню", callback_data: "menu" }]);
  return editMessage(env, cq.message.chat.id, cq.message.message_id, t, { inline_keyboard: rows });
}

async function loadProgram(env, src, id) {
  if (src === "s") return PROGRAMS[id] ? normalizeProgram(PROGRAMS[id]) : null;
  const rows = await supabaseGet(env, "custom_programs?id=eq." + id + "&select=name,data&limit=1");
  if (!rows.length) return null;
  const data = rows[0].data || {};
  if (!data.name) data.name = rows[0].name;
  return normalizeProgram(data);
}

// ===================== КОНСТРУКТОР =====================

async function handleCustomName(env, msg) {
  const name = msg.text.trim();
  await supabaseInsert(env, "custom_programs", { user_id: msg.from.id, name, source: "custom", data: { name, days: [{ title: "День 1", items: [] }] } });
  await clearState(env, msg.from.id);
  const rows = await supabaseGet(env, "custom_programs?user_id=eq." + msg.from.id + "&select=id&order=created_at.desc&limit=1");
  const id = rows[0] ? rows[0].id : null;
  return sendMessage(env, msg.chat.id, "Программа «" + name + "» создана. Открываю конструктор.", id ? await editorKeyboard(env, id) : navMenu("my_trainings"));
}

async function getProgramRow(env, id) {
  const rows = await supabaseGet(env, "custom_programs?id=eq." + id + "&select=id,name,data&limit=1");
  return rows[0] || null;
}

async function saveProgramData(env, id, data) {
  await supabasePatch(env, "custom_programs?id=eq." + id, { data });
}

async function editorText(env, id) {
  const row = await getProgramRow(env, id);
  if (!row) return "Программа не найдена.";
  const pr = normalizeProgram(row.data || { name: row.name, days: [] });
  return "🛠 Конструктор: " + pr.name + "\n\n" + renderProgram(pr) + "\n\nДобавляй и убирай упражнения кнопками ниже.";
}

async function editorKeyboard(env, id) {
  const row = await getProgramRow(env, id);
  const pr = normalizeProgram(row.data || { name: row.name, days: [{ title: "День 1", items: [] }] });
  const rows = [];
  pr.days.forEach((d, di) => {
    rows.push([{ text: "— " + (d.title || ("День " + (di + 1))) + " —", callback_data: "ce:" + id }]);
    d.items.forEach((it, ii) => {
      rows.push([
        { text: itemLabel(it), callback_data: "ce:" + id },
        { text: "⬆️", callback_data: "cmu:" + id + ":" + di + ":" + ii },
        { text: "⬇️", callback_data: "cmd:" + id + ":" + di + ":" + ii },
        { text: "❌", callback_data: "cdel:" + id + ":" + di + ":" + ii }
      ]);
    });
    rows.push([{ text: "➕ Упражнение в " + (d.title || ("День " + (di + 1))), callback_data: "cg:" + id + ":" + di }]);
    if (pr.days.length > 1) rows.push([{ text: "🗑 Удалить " + (d.title || ("День " + (di + 1))), callback_data: "cdd:" + id + ":" + di }]);
  });
  rows.push([{ text: "➕ Добавить день", callback_data: "cead:" + id }]);
  rows.push([{ text: "✅ Готово", callback_data: "my_trainings" }, { text: "Главное меню", callback_data: "menu" }]);
  return { inline_keyboard: rows };
}

async function openEditor(env, cq, id) {
  return editMessage(env, cq.message.chat.id, cq.message.message_id, await editorText(env, id), await editorKeyboard(env, id));
}

async function editorAddDay(env, cq, id) {
  const row = await getProgramRow(env, id);
  const pr = normalizeProgram(row.data || { name: row.name, days: [] });
  pr.days.push({ title: "День " + (pr.days.length + 1), items: [] });
  await saveProgramData(env, id, pr);
  return openEditor(env, cq, id);
}

async function editorDelDay(env, cq, id, day) {
  const row = await getProgramRow(env, id);
  const pr = normalizeProgram(row.data || { name: row.name, days: [] });
  if (pr.days.length > 1) pr.days.splice(day, 1);
  await saveProgramData(env, id, pr);
  return openEditor(env, cq, id);
}

function catMenu(id, day) {
  const rows = CAT_ORDER.map((c, i) => [{ text: c, callback_data: "ccat:" + id + ":" + day + ":" + i }]);
  rows.push([{ text: "Назад", callback_data: "ce:" + id }]);
  return { inline_keyboard: rows };
}

function catExMenu(id, day, ci) {
  const cat = CAT_ORDER[ci];
  const rows = (CATS[cat] || []).map(exId => [{ text: EX[exId][0], callback_data: "cex:" + id + ":" + day + ":" + exId }]);
  rows.push([{ text: "Назад", callback_data: "cg:" + id + ":" + day }]);
  return { inline_keyboard: rows };
}

function setsMenu(id, day, exId) {
  const rows = [[2, 3, 4, 5].map(n => ({ text: n + " подх.", callback_data: "cset:" + id + ":" + day + ":" + exId + ":" + n }))];
  rows.push([{ text: "Назад", callback_data: "ccat:" + id + ":" + day + ":0" }]);
  return { inline_keyboard: rows };
}

function repsMenu(id, day, exId, sets) {
  const rows = [[6, 8, 10, 12, 15, 20].map(n => ({ text: n + " повт.", callback_data: "creps:" + id + ":" + day + ":" + exId + ":" + sets + ":" + n }))];
  rows.push([{ text: "Назад", callback_data: "cex:" + id + ":" + day + ":" + exId }]);
  return { inline_keyboard: rows };
}

async function editorAddItem(env, cq, data) {
  const [, id, day, exId, sets, reps] = data.split(":");
  const row = await getProgramRow(env, id);
  const pr = normalizeProgram(row.data || { name: row.name, days: [] });
  const d = pr.days[Number(day)];
  if (d) d.items.push({ ex: exId, label: EX[exId][0], sets: Number(sets), reps: Number(reps) });
  await saveProgramData(env, id, pr);
  return openEditor(env, cq, id);
}

async function editorDelItem(env, cq, data) {
  const [, id, day, idx] = data.split(":");
  const row = await getProgramRow(env, id);
  const pr = normalizeProgram(row.data || { name: row.name, days: [] });
  const d = pr.days[Number(day)];
  if (d) d.items.splice(Number(idx), 1);
  await saveProgramData(env, id, pr);
  return openEditor(env, cq, id);
}

async function editorMove(env, cq, data, dir) {
  const [, id, day, idx] = data.split(":");
  const row = await getProgramRow(env, id);
  const pr = normalizeProgram(row.data || { name: row.name, days: [] });
  const d = pr.days[Number(day)];
  const i = Number(idx), j = i + dir;
  if (d && j >= 0 && j < d.items.length) { const tmp = d.items[i]; d.items[i] = d.items[j]; d.items[j] = tmp; }
  await saveProgramData(env, id, pr);
  return openEditor(env, cq, id);
}

async function myTrainingsText(env, userId) {
  const rows = await supabaseGet(env, "custom_programs?user_id=eq." + userId + "&select=id,name,source&order=created_at.desc");
  if (!rows.length) return "🗂 Мои тренировки\n\nПусто. Сохрани готовую программу или создай свою.";
  let t = "🗂 Мои тренировки\n";
  rows.forEach(r => t += "\n• " + r.name + " (" + r.source + ")");
  return t;
}

async function myTrainingsMenu(env, userId) {
  const list = await supabaseGet(env, "custom_programs?user_id=eq." + userId + "&select=id,name&order=created_at.desc&limit=20");
  const rows = list.map(r => [{ text: r.name, callback_data: "myprog:" + r.id }]);
  rows.push([{ text: "➕ Создать программу", callback_data: "custom_program" }]);
  rows.push([{ text: "Назад", callback_data: "programs" }, { text: "Главное меню", callback_data: "menu" }]);
  return { inline_keyboard: rows };
}

async function customProgramText(env, id) {
  const row = await getProgramRow(env, id);
  if (!row) return "Программа не найдена.";
  return renderProgram(normalizeProgram(row.data || { name: row.name, days: [] }));
}

function customProgramMenu(id) {
  return { inline_keyboard: [
    [{ text: "▶️ Заниматься", callback_data: "pstart:c:" + id }],
    [{ text: "🛠 Редактировать", callback_data: "editprog:" + id }],
    [{ text: "🗑 Удалить", callback_data: "delprog:" + id }],
    [{ text: "Назад", callback_data: "my_trainings" }, { text: "Главное меню", callback_data: "menu" }]
  ]};
}

// ===================== ПОДБОР =====================

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
  await supabaseInsert(env, "custom_programs", { user_id: userId, name: program.name, source: "picked", data: program });
  await clearState(env, userId);
  return editMessage(env, cq.message.chat.id, cq.message.message_id, "✅ Подобрал и сохранил в Мои тренировки.\n\n" + renderProgram(normalizeProgram(program)), navMenu("my_trainings"));
}

function buildPickedProgram(a) {
  const day1 = ["Жим лёжа 3x8", "Тяга верхнего блока 3x10", "Платформа 3x12"];
  const day2 = ["Жим на наклонной 3x10", "Тяга горизонтального блока 3x10", "Приседания 3x8"];
  if (a.chest === "high") day1.push("Бабочка 3x15", "Кроссовер 3x15");
  if (a.back === "high") day1.push("Пуловер 3x12", "Тяга верхнего блока в тренажёре 3x10");
  if (a.legs === "high") day2.push("Разгибание на квадрицепс 3x15", "Задняя поверхность бедра в тренажёре 3x12");
  if (a.shoulders === "high") day2.push("Подъём гантелей 4x15", "Бабочка на заднюю дельту 3x15");
  if (a.arms === "high") day2.push("Подъём Z-грифа 3x12", "Разгибание на блоке 3x12");
  if (a.chest === "mid") day1.push("Бабочка 3x12");
  if (a.back === "mid") day1.push("Пуловер 3x12");
  if (a.legs === "mid") day2.push("Разгибание на квадрицепс 3x12");
  if (a.shoulders === "mid") day2.push("Подъём гантелей 3x15");
  if (a.arms === "mid") day2.push("Подъём Z-грифа 2x12", "Разгибание на блоке 2x12");
  return { name: "Подобранная программа", days: [day1, day2] };
}

// ===================== АНАЛИТИКА =====================

function analyticsMenu() {
  return { inline_keyboard: [
    [{ text: "📈 Сводка", callback_data: "an_summary" }],
    [{ text: "💪 По группам мышц", callback_data: "an_groups" }],
    [{ text: "🗓 Посещения зала", callback_data: "an_visits" }],
    [{ text: "📝 Последние тренировки", callback_data: "an_last" }],
    [{ text: "🏅 Рекорды и 1ПМ", callback_data: "an_records" }],
    [{ text: "⚡ Энергия и результат", callback_data: "an_energy" }],
    [{ text: "📤 Экспорт за 30 дней", callback_data: "an_export" }],
    [{ text: "Главное меню", callback_data: "menu" }]
  ]};
}

async function allSets(env, userId, limit) {
  return supabaseGet(env, "workout_sets?user_id=eq." + userId + "&select=exercise_id,exercise_name,weight,reps,created_at,session_id&order=created_at.desc&limit=" + (limit || 2000));
}

async function analyticsSummary(env, userId) {
  const visits = await supabaseGet(env, "gym_visits?user_id=eq." + userId + "&select=visited_at&order=visited_at.desc&limit=2000");
  const sets = await allSets(env, userId);
  let tonnage = 0; const freq = {};
  for (const s of sets) { tonnage += Number(s.weight) * Number(s.reps); freq[s.exercise_name] = (freq[s.exercise_name] || 0) + 1; }
  const fav = Object.keys(freq).sort((a, b) => freq[b] - freq[a])[0];
  const now = Date.now();
  const week = sets.filter(s => now - new Date(s.created_at).getTime() < 7 * 864e5).length;
  const month = sets.filter(s => now - new Date(s.created_at).getTime() < 30 * 864e5).length;
  const streak = computeStreak(visits.map(v => v.visited_at));
  return "📈 Сводка\n\n" +
    "Посещений всего: " + visits.length + "\n" +
    "🔥 Серия подряд: " + streak + " дн.\n" +
    "Подходов всего: " + sets.length + "\n" +
    "Подходов за неделю: " + week + "\n" +
    "Подходов за месяц: " + month + "\n" +
    "📦 Общий тоннаж: " + fmtNum(tonnage) + " кг\n" +
    "⭐ Любимое упражнение: " + (fav || "—");
}

function groupOf(exId) { return EX[exId] ? EX[exId][1] : "Прочее"; }

async function analyticsGroups(env, cq) {
  const userId = cq.from.id;
  const sets = await allSets(env, userId);
  const now = Date.now();
  const recent = sets.filter(s => now - new Date(s.created_at).getTime() < 30 * 864e5);
  const byGroup = {};
  for (const s of recent) byGroup[groupOf(s.exercise_id)] = (byGroup[groupOf(s.exercise_id)] || 0) + 1;
  const labels = Object.keys(byGroup);
  if (!labels.length) return editMessage(env, cq.message.chat.id, cq.message.message_id, "💪 За последние 30 дней подходов нет.", navMenu("analytics"));
  labels.sort((a, b) => byGroup[b] - byGroup[a]);
  let cap = "💪 Подходы по группам за 30 дней\n";
  const max = byGroup[labels[0]];
  for (const l of labels) { const f = Math.round(byGroup[l] / max * 10); cap += "\n" + l + ": " + byGroup[l] + "  " + "▰".repeat(f) + "▱".repeat(10 - f); }
  const url = chartUrl({ type: "bar", data: { labels, datasets: [{ label: "Подходы", data: labels.map(l => byGroup[l]), backgroundColor: "#4f8cff" }] }, options: { plugins: { legend: { display: false }, title: { display: true, text: "Подходы по группам (30 дней)" } } } });
  return sendPhoto(env, cq.message.chat.id, url, cap, navMenu("analytics"));
}

async function analyticsVisits(env, cq) {
  const userId = cq.from.id;
  const visits = await supabaseGet(env, "gym_visits?user_id=eq." + userId + "&select=visited_at&order=visited_at.desc&limit=400");
  if (!visits.length) return editMessage(env, cq.message.chat.id, cq.message.message_id, "🗓 Посещений пока нет.", navMenu("analytics"));
  const weeks = {};
  const now = new Date();
  for (let i = 7; i >= 0; i--) { const d = new Date(now); d.setDate(d.getDate() - i * 7); weeks[weekKey(d)] = 0; }
  for (const v of visits) { const k = weekKey(new Date(v.visited_at)); if (k in weeks) weeks[k]++; }
  const labels = Object.keys(weeks);
  const url = chartUrl({ type: "line", data: { labels, datasets: [{ label: "Посещения/нед", data: labels.map(l => weeks[l]), borderColor: "#22c55e", backgroundColor: "rgba(34,197,94,.2)", fill: true, tension: 0.3 }] }, options: { plugins: { legend: { display: false }, title: { display: true, text: "Посещения зала по неделям" } } } });
  return sendPhoto(env, cq.message.chat.id, url, "🗓 Посещения зала за 8 недель", navMenu("analytics"));
}

async function lastWorkoutsText(env, userId) {
  const ses = await supabaseGet(env, "workout_sessions?user_id=eq." + userId + "&status=eq.ended&select=id,started_at,ended_at&order=ended_at.desc&limit=5");
  if (!ses.length) return "📝 Завершённых тренировок пока нет. Начни тренировку кнопкой «Начать тренировку», чтобы засекалось время.";
  let t = "📝 Последние тренировки\n";
  for (const s of ses) {
    const sets = await supabaseGet(env, "workout_sets?session_id=eq." + s.id + "&user_id=eq." + userId + "&select=exercise_name,weight,reps");
    let ton = 0; const byEx = {};
    for (const x of sets) { ton += Number(x.weight) * Number(x.reps); byEx[x.exercise_name] = (byEx[x.exercise_name] || 0) + 1; }
    const mins = Math.max(1, Math.round((new Date(s.ended_at) - new Date(s.started_at)) / 60000));
    t += "\n📅 " + fmtDate(s.started_at) + " · ⏱ " + mins + " мин · 📦 " + fmtNum(ton) + " кг";
    for (const n in byEx) t += "\n   • " + n + " ×" + byEx[n];
    t += "\n";
  }
  return t.trim();
}

async function recordsText(env, userId) {
  const sets = await allSets(env, userId);
  if (!sets.length) return "🏅 Рекордов пока нет — запиши первые подходы.";
  const best = {};
  for (const s of sets) {
    const orm = Number(s.weight) * (1 + Number(s.reps) / 30);
    const cur = best[s.exercise_name];
    if (!cur || Number(s.weight) > cur.w) best[s.exercise_name] = { w: Number(s.weight), reps: Number(s.reps), orm: Math.max(orm, cur ? cur.orm : 0) };
    else if (orm > cur.orm) cur.orm = orm;
  }
  let t = "🏅 Личные рекорды\n(оценка 1ПМ по формуле Эпли: вес × (1 + повт/30))\n";
  for (const n of Object.keys(best)) t += "\n• " + n + ": " + best[n].w + " кг × " + best[n].reps + "  →  1ПМ ≈ " + Math.round(best[n].orm) + " кг";
  return t;
}

async function energyText(env, userId) {
  const ses = await supabaseGet(env, "workout_sessions?user_id=eq." + userId + "&status=eq.ended&energy=not.is.null&select=id,energy&order=ended_at.desc&limit=30");
  if (!ses.length) return "⚡ Пока мало данных. Перед тренировкой отмечай энергию (1–5) — и здесь появится связь с тоннажем.";
  let hi = [], lo = [];
  for (const s of ses) {
    const sets = await supabaseGet(env, "workout_sets?session_id=eq." + s.id + "&user_id=eq." + userId + "&select=weight,reps");
    let ton = 0; for (const x of sets) ton += Number(x.weight) * Number(x.reps);
    if (s.energy >= 4) hi.push(ton); else if (s.energy <= 2) lo.push(ton);
  }
  const avg = a => a.length ? Math.round(a.reduce((x, y) => x + y, 0) / a.length) : 0;
  return "⚡ Энергия и результат\n\nСредний тоннаж тренировки:\n• при высокой энергии (4–5): " + fmtNum(avg(hi)) + " кг (" + hi.length + " трен.)\n• при низкой (1–2): " + fmtNum(avg(lo)) + " кг (" + lo.length + " трен.)\n\nОтмечай энергию на старте — выборка будет точнее.";
}

async function analyticsExport(env, cq) {
  const userId = cq.from.id;
  const now = Date.now();
  const sets = (await allSets(env, userId)).filter(s => now - new Date(s.created_at).getTime() < 30 * 864e5);
  const visits = await supabaseGet(env, "gym_visits?user_id=eq." + userId + "&select=visited_at&order=visited_at.desc&limit=400");
  const vis30 = visits.filter(v => now - new Date(v.visited_at).getTime() < 30 * 864e5).length;
  let ton = 0; const byGroup = {};
  for (const s of sets) { ton += Number(s.weight) * Number(s.reps); byGroup[groupOf(s.exercise_id)] = (byGroup[groupOf(s.exercise_id)] || 0) + 1; }
  let t = "📤 Отчёт за 30 дней\n\nПосещений: " + vis30 + "\nПодходов: " + sets.length + "\nТоннаж: " + fmtNum(ton) + " кг\n\nПодходы по группам:";
  for (const g of Object.keys(byGroup)) t += "\n• " + g + ": " + byGroup[g];
  t += "\n\nПоследние подходы (дата; упражнение; вес; повторы):\n";
  for (const s of sets.slice(0, 40)) t += fmtDate(s.created_at) + "; " + s.exercise_name + "; " + s.weight + "; " + s.reps + "\n";
  if (t.length > 3900) t = t.slice(0, 3900) + "\n…";
  return editMessage(env, cq.message.chat.id, cq.message.message_id, t, navMenu("analytics"));
}

// ===================== ПРОФИЛЬ + БЖУ =====================

async function profileText(env, from) {
  const u = await getUser(env, from.id);
  const sexMap = { m: "мужской", f: "женский" }, actMap = { low: "низкая", mid: "средняя", high: "высокая" };
  let t = "👤 Профиль\n\nИмя: " + (from.first_name || "—") +
    "\nUsername: " + (from.username ? "@" + from.username : "—") +
    "\nID: " + from.id + "  (покажи другу, чтобы он добавил тебя)\n" +
    "\nРост: " + (u?.height ? u.height + " см" : "—") +
    "\nВес: " + (u?.weight ? u.weight + " кг" : "—") +
    "\nВозраст: " + (u?.age || "—") +
    "\nПол: " + (u?.sex ? sexMap[u.sex] : "—") +
    "\nАктивность: " + (u?.activity ? actMap[u.activity] : "средняя") + "\n";
  t += bjuText(u);
  return t;
}

function bjuText(u) {
  if (!u || !u.weight || !u.height || !u.age || !u.sex) return "\n📐 Заполни рост, вес, возраст и пол — посчитаю калории и БЖУ на похудение, поддержание и массу.";
  const w = Number(u.weight), h = Number(u.height), a = Number(u.age);
  const bmr = u.sex === "m" ? 10 * w + 6.25 * h - 5 * a + 5 : 10 * w + 6.25 * h - 5 * a - 161;
  const tdee = Math.round(bmr * ({ low: 1.375, mid: 1.55, high: 1.725 }[u.activity || "mid"]));
  const goals = [["Похудение", tdee - 600, 2.0], ["Поддержание", tdee, 1.8], ["Масса", tdee + 400, 1.8]];
  let t = "\n🍽 Рекомендации (Mifflin-St Jeor)\nПоддержание ≈ " + tdee + " ккал/день\n";
  for (const [name, kcal, ppk] of goals) {
    const prot = Math.round(ppk * w), fat = Math.round(0.9 * w);
    const carbs = Math.max(0, Math.round((kcal - prot * 4 - fat * 9) / 4));
    t += "\n" + name + ": " + kcal + " ккал\n   Б " + prot + " · Ж " + fat + " · У " + carbs + " г";
  }
  return t + "\n\nПохудение — дефицит ~600 (500–700), масса — профицит ~400 (300–500).";
}

function profileMenu() {
  return { inline_keyboard: [
    [{ text: "✏️ Изменить данные", callback_data: "profile_edit" }],
    [{ text: "🔒 Приватность", callback_data: "privacy" }],
    [{ text: "Главное меню", callback_data: "menu" }]
  ]};
}

async function handleProfInput(env, msg, field) {
  const userId = msg.from.id, chatId = msg.chat.id;
  const v = Number(msg.text.trim().replace(",", "."));
  const limits = { height: [100, 250], weight: [30, 300], age: [10, 100] };
  const [min, max] = limits[field];
  if (!v || v < min || v > max) return sendMessage(env, chatId, "Введи число от " + min + " до " + max + ".", navMenu("profile"));
  await supabasePatch(env, "users?id=eq." + userId, { [field]: v });
  if (field === "height") { await setState(env, userId, "prof_weight", {}); return sendMessage(env, chatId, "Рост сохранён. Введи вес в кг (например 80).", navMenu("profile")); }
  if (field === "weight") { await setState(env, userId, "prof_age", {}); return sendMessage(env, chatId, "Вес сохранён. Введи возраст.", navMenu("profile")); }
  await clearState(env, userId);
  return sendMessage(env, chatId, "Возраст сохранён. Укажи пол:", { inline_keyboard: [[{ text: "Мужской", callback_data: "prof_sex:m" }, { text: "Женский", callback_data: "prof_sex:f" }]] });
}

function activityMenu() {
  return { inline_keyboard: [
    [{ text: "Низкая (0–1 трен/нед)", callback_data: "prof_activity:low" }],
    [{ text: "Средняя (3–4 трен/нед)", callback_data: "prof_activity:mid" }],
    [{ text: "Высокая (5+ трен/нед)", callback_data: "prof_activity:high" }]
  ]};
}

function privacyHeader() { return "🔒 Приватность\n\nЧто видят друзья. Нажми, чтобы переключить."; }

async function privacyMenu(env, userId) {
  const u = await getUser(env, userId);
  const on = f => (u && u[f] !== false) ? "✅ вкл" : "🚫 выкл";
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
"Сон — главная фаза роста. Ночью выделяется гормон роста, восстанавливаются мышцы, перезагружается нервная система. Можно идеально тренироваться и питаться, но при недосыпе прогресс встанет, а тяга к сладкому и кортизол вырастут.\n\n" +
"Сколько спать. 7–9 часов, при активных тренировках — ближе к 8–9. Важна регулярность: ложиться и вставать в одно время, включая выходные.\n\n" +
"За 1–2 часа до сна: приглуши свет и экраны; без кофеина после 14–15 часов; последний приём пищи за 2–3 часа без тяжёлой еды; без алкоголя — он рушит глубокие фазы.\n\n" +
"Спальня: прохладно 18–20 °C, темно (шторы/маска), тихо (беруши/белый шум). Кровать — только для сна.\n\n" +
"Ритуал: тёплый душ, лёгкая растяжка, дыхание 4-7-8 (вдох 4 — задержка 7 — выдох 8), бумажная книга. Не уснул за 20 минут — встань, спокойное дело при тусклом свете, вернись с сонливостью.\n\n" +
"Утро: сразу дневной свет 5–10 минут — это запускает циркадные ритмы и помогает легче засыпать вечером.\n\n" +
"После тяжёлой тренировки потребность во сне растёт. Мало спишь — снижай объём, иначе копится переутомление. Хороший сон восстанавливает сильнее любых добавок.";
}

function saunaText() {
  return "🧖 Баня, сауна и хамам\n\n" +
"Тепло ускоряет восстановление: расширяются сосуды, растёт кровоток в мышцах, быстрее уходит забитость, расслабляется тело, улучшаются сон и стрессоустойчивость. Регулярные сауны также тренируют сердечно-сосудистую систему.\n\n" +
"Хамам (турецкая баня). Мягкий пар, 40–50 °C, влажность под 100%. Самый щадящий формат — можно после каждой тренировки, включая силовую. Влажное тепло мягко прогревает мышцы, снимает забитость и не перегружает сердце. После тренировки достаточно 10–15 минут.\n\n" +
"Сауна (финская). Сухой жар 80–100 °C, нагружает сердце сильнее. Сразу после тяжёлой силовой лучше не злоупотреблять. Оптимально 2–3 захода по 8–12 минут с остыванием между ними.\n\n" +
"Сколько раз в неделю. Оптимально 2–4 сессии сауны в неделю — именно такая регулярность в исследованиях связана с лучшим восстановлением и здоровьем сердца. Хамам мягче, его можно и чаще, хоть после каждой тренировки. Главное — самочувствие и достаточно воды.\n\n" +
"Польза сразу после тренировки. Тепло усиливает приток крови к мышцам и помогает быстрее вывести продукты обмена, снижает мышечное напряжение и ощущение забитости, расслабляет нервную систему и помогает крепче уснуть вечером, а лёгкое потоотделение и контраст бодрят. После тяжёлой силовой выбирай мягкий формат (хамам или короткие заходы), после лёгкой или кардио можно чуть дольше.\n\n" +
"Контраст. После захода — прохладный душ или бассейн на 10–30 секунд. Тренирует сосуды и усиливает восстановление. Начинай мягко, без ледяной воды и резкого ныряния с разгорячённым сердцем.\n\n" +
"Душ и гигиена. Перед баней — тёплый душ, смыть пот и косметику. После каждого захода ополаскивайся, в конце — тёплый душ и хорошо высушись.\n\n" +
"Вода и безопасность. Пей воду или травяной чай до, между заходами и после (без алкоголя). Не парься натощак и сразу после плотной еды. Выходи при головокружении или сильном сердцебиении. Противопоказания: высокое давление, болезни сердца, острые воспаления, беременность — только после консультации с врачом.\n\n" +
"Итог: хамам — мягко и можно после каждой тренировки; сауну дозируй 2–4 раза в неделю короткими заходами.";
}

// ===================== ДРУЗЬЯ =====================

function friendsMenu() {
  return { inline_keyboard: [
    [{ text: "➕ Добавить по ID", callback_data: "friend_add" }],
    [{ text: "👤 Список друзей", callback_data: "friend_list" }],
    [{ text: "📨 Заявки", callback_data: "friend_requests" }],
    [{ text: "🤝 Совместная тренировка", callback_data: "joint" }],
    [{ text: "✉️ Сообщение друзьям", callback_data: "friend_msg" }],
    [{ text: "🏆 Рейтинг", callback_data: "leaderboard" }],
    [{ text: "🔒 Приватность", callback_data: "privacy" }],
    [{ text: "Главное меню", callback_data: "menu" }]
  ]};
}

async function handleFriendAdd(env, msg) {
  const fid = Number(msg.text.trim());
  const me = msg.from.id;
  if (!fid || fid === me) return sendMessage(env, msg.chat.id, "Нужен числовой ID друга (не твой собственный).", navMenu("friends"));
  await supabaseInsert(env, "friends", { user_id: me, friend_id: fid, status: "pending", can_view_workouts: false });
  await clearState(env, me);
  const target = await getUser(env, fid);
  if (target) {
    await sendMessage(env, fid, "📨 Заявка в друзья от " + (msg.from.first_name || ("ID " + me)) + ".", { inline_keyboard: [[{ text: "Принять", callback_data: "frq_ac:" + me }, { text: "Отклонить", callback_data: "frq_de:" + me }]] });
    return sendMessage(env, msg.chat.id, "Заявка отправлена — другу пришло уведомление.", navMenu("friends"));
  }
  return sendMessage(env, msg.chat.id, "Заявка создана. Но этот пользователь ещё не запускал бота — уведомление придёт, когда он откроет бота.", navMenu("friends"));
}

async function acceptFriend(env, cq, fromId) {
  const me = cq.from.id;
  await supabasePatch(env, "friends?user_id=eq." + fromId + "&friend_id=eq." + me, { status: "accepted" });
  await supabaseInsert(env, "friends", { user_id: me, friend_id: fromId, status: "accepted", can_view_workouts: true });
  await sendMessage(env, fromId, "✅ " + (cq.from.first_name || ("ID " + me)) + " принял заявку в друзья!");
  return editMessage(env, cq.message.chat.id, cq.message.message_id, "Готово — теперь вы друзья.", await friendRequestsMenu(env, me));
}

async function declineFriend(env, cq, fromId) {
  const me = cq.from.id;
  await supabaseDelete(env, "friends?user_id=eq." + fromId + "&friend_id=eq." + me);
  return editMessage(env, cq.message.chat.id, cq.message.message_id, "Заявка отклонена.", await friendRequestsMenu(env, me));
}

async function removeFriend(env, me, fid) {
  await supabaseDelete(env, "friends?user_id=eq." + me + "&friend_id=eq." + fid);
  await supabaseDelete(env, "friends?user_id=eq." + fid + "&friend_id=eq." + me);
}

async function acceptedFriends(env, userId) {
  const rows = await supabaseGet(env, "friends?user_id=eq." + userId + "&status=eq.accepted&select=friend_id");
  return rows.map(r => r.friend_id);
}

async function friendListText(env, userId) {
  const ids = await acceptedFriends(env, userId);
  if (!ids.length) return "👤 Друзей пока нет. Добавь по ID.";
  let t = "👤 Друзья:\n";
  for (const fid of ids) { const u = await getUser(env, fid); t += "\n• " + (u?.first_name || ("ID " + fid)) + (u?.username ? " (@" + u.username + ")" : ""); }
  return t;
}

async function friendListMenu(env, userId) {
  const ids = await acceptedFriends(env, userId);
  const rows = [];
  for (const fid of ids) { const u = await getUser(env, fid); rows.push([{ text: "👁 " + (u?.first_name || fid), callback_data: "fview:" + fid }, { text: "❌", callback_data: "fdel:" + fid }]); }
  rows.push([{ text: "Назад", callback_data: "friends" }, { text: "Главное меню", callback_data: "menu" }]);
  return { inline_keyboard: rows };
}

async function friendRequestsMenu(env, userId) {
  const rows = await supabaseGet(env, "friends?friend_id=eq." + userId + "&status=eq.pending&select=user_id");
  const kb = [];
  for (const r of rows) { const u = await getUser(env, r.user_id); kb.push([{ text: "✅ " + (u?.first_name || r.user_id), callback_data: "frq_ac:" + r.user_id }, { text: "❌", callback_data: "frq_de:" + r.user_id }]); }
  if (!kb.length) kb.push([{ text: "Заявок нет", callback_data: "friends" }]);
  kb.push([{ text: "Назад", callback_data: "friends" }, { text: "Главное меню", callback_data: "menu" }]);
  return { inline_keyboard: kb };
}

async function friendViewText(env, me, fid) {
  const ids = await acceptedFriends(env, me);
  if (!ids.includes(fid)) return "Это не твой друг.";
  const u = await getUser(env, fid);
  let t = "👁 " + (u?.first_name || ("ID " + fid)) + "\n";
  if (u && u.priv_profile !== false) {
    const sexMap = { m: "муж.", f: "жен." };
    t += "\nРост: " + (u.height ? u.height + " см" : "—") + " · Вес: " + (u.weight ? u.weight + " кг" : "—") + (u.sex ? " · " + sexMap[u.sex] : "");
  } else t += "\nПрофиль скрыт настройками приватности.";
  if (u && u.priv_analytics !== false) {
    const sets = await allSets(env, fid);
    let ton = 0; for (const s of sets) ton += Number(s.weight) * Number(s.reps);
    const visits = await supabaseGet(env, "gym_visits?user_id=eq." + fid + "&select=visited_at&order=visited_at.desc&limit=2000");
    t += "\n\n📊 Посещений: " + visits.length + " · Тоннаж: " + fmtNum(ton) + " кг · 🔥 " + computeStreak(visits.map(v => v.visited_at)) + " дн.";
  } else t += "\n\nАналитика скрыта настройками приватности.";
  if (u && u.priv_workouts !== false) {
    const last = await supabaseGet(env, "workout_sets?user_id=eq." + fid + "&select=exercise_name,weight,reps,created_at&order=created_at.desc&limit=6");
    if (last.length) { t += "\n\nПоследнее:"; last.forEach(s => t += "\n• " + s.exercise_name + " " + s.weight + "x" + s.reps); }
  } else t += "\n\nТренировки скрыты настройками приватности.";
  return t;
}

function broadcastMenu() {
  const rows = MOTIVATION.map((m, i) => [{ text: m, callback_data: "bcast:" + i }]);
  rows.push([{ text: "✍️ Свой текст", callback_data: "bcast_custom" }]);
  rows.push([{ text: "Назад", callback_data: "friends" }, { text: "Главное меню", callback_data: "menu" }]);
  return { inline_keyboard: rows };
}

async function sendTemplate(env, cq, idx) {
  return doBroadcast(env, cq.from, MOTIVATION[idx] || MOTIVATION[0], cq.message.chat.id, cq.message.message_id);
}

async function handleBroadcast(env, msg) {
  await clearState(env, msg.from.id);
  return doBroadcast(env, msg.from, msg.text.trim(), msg.chat.id);
}

async function doBroadcast(env, from, text, chatId, msgId) {
  const ids = await acceptedFriends(env, from.id);
  let sent = 0;
  for (const fid of ids) { await sendMessage(env, fid, "✉️ От " + (from.first_name || ("ID " + from.id)) + ":\n\n" + text); sent++; }
  const res = sent ? ("Отправлено друзьям: " + sent + " 💪") : "У тебя пока нет друзей для рассылки.";
  if (msgId) return editMessage(env, chatId, msgId, res, navMenu("friends"));
  return sendMessage(env, chatId, res, navMenu("friends"));
}

async function jointPickMenu(env, userId) {
  const ids = await acceptedFriends(env, userId);
  const rows = [];
  for (const fid of ids) { const u = await getUser(env, fid); rows.push([{ text: u?.first_name || ("ID " + fid), callback_data: "jinv:" + fid }]); }
  if (!rows.length) rows.push([{ text: "Нет друзей — добавь сначала", callback_data: "friends" }]);
  rows.push([{ text: "Назад", callback_data: "friends" }, { text: "Главное меню", callback_data: "menu" }]);
  return { inline_keyboard: rows };
}

async function jointInvite(env, cq, fid) {
  const me = cq.from.id;
  const target = await getUser(env, fid);
  if (!target) return editMessage(env, cq.message.chat.id, cq.message.message_id, "Друг ещё не запускал бота.", navMenu("friends"));
  await sendMessage(env, fid, "🤝 " + (cq.from.first_name || ("ID " + me)) + " зовёт на совместную тренировку!", { inline_keyboard: [[{ text: "Присоединиться", callback_data: "jac:" + me }, { text: "Отклонить", callback_data: "jde:" + me }]] });
  return editMessage(env, cq.message.chat.id, cq.message.message_id, "Приглашение отправлено. Жди, пока друг присоединится.", navMenu("friends"));
}

async function jointAccept(env, cq, hostId) {
  const me = cq.from.id;
  await supabaseInsert(env, "workout_sessions", { user_id: hostId, partner_id: me, kind: "joint", status: "active" });
  await ensureVisitOncePer3Hours(env, cq.from);
  await sendMessage(env, hostId, "✅ " + (cq.from.first_name || ("ID " + me)) + " присоединился! Выбирай упражнение — оно подтянется у партнёра.", trainingsMenu());
  return editMessage(env, cq.message.chat.id, cq.message.message_id, "🤝 Совместная тренировка началась! Выбирай упражнение — оно подтянется у партнёра. Записывай свои подходы.", trainingsMenu());
}

async function jointDecline(env, cq, hostId) {
  await sendMessage(env, hostId, "❌ " + (cq.from.first_name || "Друг") + " отклонил совместную тренировку.");
  return editMessage(env, cq.message.chat.id, cq.message.message_id, "Отклонено.", navMenu("friends"));
}

async function syncJointExercise(env, userId, exId) {
  const s = await activeSession(env, userId);
  if (!s || s.kind !== "joint") return;
  if (s.current_exercise_id === exId) return;
  await supabasePatch(env, "workout_sessions?id=eq." + s.id, { current_exercise_id: exId });
  const partner = s.user_id === userId ? s.partner_id : s.user_id;
  if (partner && EX[exId]) await sendMessage(env, partner, "🤝 Партнёр перешёл к: " + EX[exId][0], { inline_keyboard: [[{ text: "Записать свой подход", callback_data: "ex:" + exId }]] });
}

// ===================== РЕЙТИНГ =====================

function leaderboardMenu() {
  return { inline_keyboard: [
    [{ text: "По тоннажу", callback_data: "lb:tonnage" }],
    [{ text: "По посещениям", callback_data: "lb:visits" }],
    [{ text: "По серии (streak)", callback_data: "lb:streak" }],
    [{ text: "Назад", callback_data: "friends" }, { text: "Главное меню", callback_data: "menu" }]
  ]};
}

async function leaderboard(env, cq, metric) {
  const me = cq.from.id;
  const ids = [me, ...(await acceptedFriends(env, me))];
  const now = Date.now();
  const res = [];
  for (const id of ids) {
    const u = await getUser(env, id);
    let val = 0;
    if (metric === "visits" || metric === "streak") {
      const visits = await supabaseGet(env, "gym_visits?user_id=eq." + id + "&select=visited_at&order=visited_at.desc&limit=2000");
      if (metric === "visits") val = visits.filter(v => now - new Date(v.visited_at).getTime() < 7 * 864e5).length;
      else val = computeStreak(visits.map(v => v.visited_at));
    } else {
      const sets = await supabaseGet(env, "workout_sets?user_id=eq." + id + "&select=weight,reps,created_at&order=created_at.desc&limit=2000");
      for (const s of sets) if (now - new Date(s.created_at).getTime() < 7 * 864e5) val += Number(s.weight) * Number(s.reps);
    }
    res.push({ name: (id === me ? "Ты" : (u?.first_name || ("ID " + id))), val });
  }
  res.sort((a, b) => b.val - a.val);
  const unit = metric === "tonnage" ? " кг" : (metric === "streak" ? " дн." : "");
  const title = metric === "tonnage" ? "тоннаж за 7 дней" : (metric === "visits" ? "посещения за 7 дней" : "серия подряд");
  let t = "🏆 Рейтинг — " + title + "\n";
  const medals = ["🥇", "🥈", "🥉"];
  res.forEach((r, i) => t += "\n" + (medals[i] || (i + 1) + ".") + " " + r.name + " — " + fmtNum(r.val) + unit);
  return editMessage(env, cq.message.chat.id, cq.message.message_id, t, leaderboardMenu());
}

// ===================== ЧЕЛЛЕНДЖИ =====================

const CH_TEMPLATES = [
  { title: "5 тренировок за неделю", ctype: "workouts", goal: 5, period: "week" },
  { title: "20 тренировок за месяц", ctype: "workouts", goal: 20, period: "month" },
  { title: "10 000 кг за неделю", ctype: "tonnage", goal: 10000, period: "week" },
  { title: "50 000 кг за месяц", ctype: "tonnage", goal: 50000, period: "month" }
];

function periodEnd(period) {
  const d = new Date();
  d.setDate(d.getDate() + (period === "week" ? 7 : 30));
  return d.toISOString();
}

async function challengesText(env, userId) {
  const mine = await supabaseGet(env, "challenge_members?user_id=eq." + userId + "&select=challenge_id");
  let t = "🏆 Челленджи\n";
  if (!mine.length) t += "\nТы пока не участвуешь. Создай свой или присоединись к челленджу друга.";
  else t += "\nТвои челленджи и челленджи друзей — ниже.";
  return t;
}

async function challengesMenu(env, userId) {
  const rows = [];
  const mine = await supabaseGet(env, "challenge_members?user_id=eq." + userId + "&select=challenge_id");
  const myIds = mine.map(m => m.challenge_id);
  for (const cid of myIds) { const c = (await supabaseGet(env, "challenges?id=eq." + cid + "&select=id,title&limit=1"))[0]; if (c) rows.push([{ text: "📊 " + c.title, callback_data: "ch_view:" + c.id }, { text: "Выйти", callback_data: "ch_leave:" + c.id }]); }
  const friends = await acceptedFriends(env, userId);
  for (const fid of friends) {
    const owned = await supabaseGet(env, "challenges?owner_id=eq." + fid + "&select=id,title&order=id.desc&limit=5");
    for (const c of owned) if (!myIds.includes(c.id)) rows.push([{ text: "➕ " + c.title + " (друг)", callback_data: "ch_join:" + c.id }]);
  }
  rows.push([{ text: "🎯 Новый челлендж", callback_data: "ch_new" }]);
  rows.push([{ text: "Главное меню", callback_data: "menu" }]);
  return { inline_keyboard: rows };
}

function challengeTemplatesMenu() {
  const rows = CH_TEMPLATES.map((c, i) => [{ text: c.title, callback_data: "chtpl:" + i }]);
  rows.push([{ text: "🛠 Свой челлендж", callback_data: "ch_custom" }]);
  rows.push([{ text: "Назад", callback_data: "challenges" }]);
  return { inline_keyboard: rows };
}

async function createChallenge(env, userId, title, ctype, goal, period) {
  await supabaseInsert(env, "challenges", { owner_id: userId, title, ctype, goal, period, ends_at: periodEnd(period) });
  const row = (await supabaseGet(env, "challenges?owner_id=eq." + userId + "&select=id&order=id.desc&limit=1"))[0];
  if (row) await supabaseInsert(env, "challenge_members", { challenge_id: row.id, user_id: userId });
  return row ? row.id : null;
}

async function createChallengeTemplate(env, cq, idx) {
  const c = CH_TEMPLATES[idx];
  await createChallenge(env, cq.from.id, c.title, c.ctype, c.goal, c.period);
  return editMessage(env, cq.message.chat.id, cq.message.message_id, "✅ Челлендж создан: " + c.title + "\n\nДрузья увидят его в своём разделе Челленджи и смогут присоединиться.", navMenu("challenges"));
}

function goalMenu(t, per) {
  const opts = t === "workouts" ? [3, 5, 8, 12, 20] : [5000, 10000, 25000, 50000];
  const rows = [opts.map(g => ({ text: String(g), callback_data: "chmk:" + t + ":" + per + ":" + g }))];
  rows.push([{ text: "Назад", callback_data: "chc:" + t }]);
  return { inline_keyboard: rows };
}

async function createChallengeCustom(env, cq, data) {
  const [, t, per, goal] = data.split(":");
  const title = (t === "workouts" ? goal + " трен." : fmtNum(Number(goal)) + " кг") + " за " + (per === "week" ? "неделю" : "месяц");
  await createChallenge(env, cq.from.id, title, t, Number(goal), per);
  return editMessage(env, cq.message.chat.id, cq.message.message_id, "✅ Челлендж создан: " + title, navMenu("challenges"));
}

async function joinChallenge(env, cq, id) {
  await supabaseInsert(env, "challenge_members", { challenge_id: id, user_id: cq.from.id });
  return editMessage(env, cq.message.chat.id, cq.message.message_id, "✅ Ты присоединился к челленджу!", navMenu("challenges"));
}

async function challengeProgress(env, c, userId) {
  const start = new Date(c.starts_at || Date.now()).getTime();
  if (c.ctype === "workouts") {
    const v = await supabaseGet(env, "gym_visits?user_id=eq." + userId + "&select=visited_at&limit=2000");
    return v.filter(x => new Date(x.visited_at).getTime() >= start).length;
  }
  const sets = await supabaseGet(env, "workout_sets?user_id=eq." + userId + "&select=weight,reps,created_at&limit=2000");
  let ton = 0; for (const s of sets) if (new Date(s.created_at).getTime() >= start) ton += Number(s.weight) * Number(s.reps);
  return ton;
}

async function challengeViewText(env, id) {
  const c = (await supabaseGet(env, "challenges?id=eq." + id + "&select=*&limit=1"))[0];
  if (!c) return "Челлендж не найден.";
  const members = await supabaseGet(env, "challenge_members?challenge_id=eq." + id + "&select=user_id");
  let t = "📊 " + c.title + "\nЦель: " + fmtNum(c.goal) + (c.ctype === "tonnage" ? " кг" : " трен.") + "\n";
  const arr = [];
  for (const m of members) { const u = await getUser(env, m.user_id); const val = await challengeProgress(env, c, m.user_id); arr.push({ name: u?.first_name || ("ID " + m.user_id), val }); }
  arr.sort((a, b) => b.val - a.val);
  for (const a of arr) { const pct = Math.min(100, Math.round(a.val / c.goal * 100)); const f = Math.round(pct / 10); t += "\n" + a.name + ": " + fmtNum(a.val) + " (" + pct + "%)\n" + "▰".repeat(f) + "▱".repeat(10 - f); }
  return t;
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
"Главное — баланс калорий. Худеешь — ешь меньше, чем тратишь; набираешь — больше. Точные цифры под твой вес и цель бот считает в Профиле.\n\n" +
"Белок — фундамент: 1.8–2.2 г/кг, на похудении ближе к верхней границе. Источники: курица, индейка, рыба, яйца, творог, греческий йогурт, бобовые.\n\n" +
"Жиры — не враг: 0.8–1 г/кг. Нужны для гормонов. Оливковое масло, орехи, авокадо, жирная рыба, яйца. Избегай трансжиров.\n\n" +
"Углеводы — топливо: остаток калорий, упор на сложные (крупы, цельнозерновой хлеб, овощи). Быстрые удобны вокруг тренировки.\n\n" +
"Овощи и клетчатка — минимум 400 г овощей в день. Вода — 30–40 мл/кг (следи в разделе 💧 Вода).\n\n" +
"Режим: 3–5 приёмов как удобно. Важна сумма за день и за неделю, а не идеальность каждого приёма.";
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
    breakfast: "🍳 Завтраки\n\n1) Омлет с овощами\n3 яйца, шпинат, помидор, 30 г сыра. ~350 ккал, Б 25 · Ж 24 · У 6.\n\n2) Овсянка с творогом\n60 г овсянки, 100 г творога, ягоды, мёд. ~400 ккал, Б 28 · Ж 8 · У 55.\n\n3) Скрэмбл с тостом\n3 яйца, цельнозерновой тост, авокадо. ~420 ккал, Б 22 · Ж 26 · У 24.",
    lunch: "🍲 Обеды\n\n1) Курица с рисом\n150 г грудки, 60 г риса (сухой), овощи на пару. ~480 ккал, Б 45 · Ж 8 · У 55.\n\n2) Говядина с гречкой\n130 г говядины, 60 г гречки, салат. ~500 ккал, Б 42 · Ж 14 · У 50.\n\n3) Лосось с картофелем\n150 г лосося, 200 г запечённого картофеля. ~550 ккал, Б 35 · Ж 28 · У 40.",
    dinner: "🍽 Ужины\n\n1) Творог с овощами\n200 г творога, огурец, зелень, ложка йогурта. ~280 ккал, Б 36 · Ж 8 · У 12.\n\n2) Рыба с салатом\n180 г белой рыбы, овощной салат с оливковым маслом. ~330 ккал, Б 38 · Ж 14 · У 8.\n\n3) Индейка с овощами\n150 г индейки, кабачок, перец, морковь. ~340 ккал, Б 40 · Ж 10 · У 18.",
    snack: "🍎 Перекусы\n\n1) Йогурт с орехами — 150 г + 20 г. ~250 ккал, Б 16 · Ж 14 · У 12.\n\n2) Протеин с бананом. ~280 ккал, Б 28 · Ж 4 · У 35.\n\n3) Яблоко с арахисовой пастой. ~200 ккал, Б 6 · Ж 9 · У 28.\n\n4) Творог с мёдом — 150 г. ~190 ккал, Б 26 · Ж 3 · У 16."
  };
  return R[cat] || "Раздел не найден.";
}

function suppsText() {
  return "💊 БАДы\n\nДобавки дополняют питание, а не заменяют. Сначала режим, белок и сон.\n\n" +
"Рабочее:\n• Креатин моногидрат — 3–5 г/день постоянно, в любое время. Сила и объём, загрузка не нужна.\n• Протеин — удобно добрать норму белка.\n• Омега-3 — 1–2 г EPA+DHA, если мало жирной рыбы.\n• Витамин D — 1000–2000 МЕ, лучше по анализу.\n• Магний — при судорогах, стрессе, плохом сне, вечером.\n\n" +
"По желанию: кофеин 100–200 мг до тренировки (не на ночь), комплекс витаминов при бедном рационе.\n\n" +
"Не нужно: «жиросжигатели» обычно не работают — жир сжигает дефицит калорий.\n\nПри болезнях и лекарствах согласуй с врачом.";
}

function todayStr() { return new Date().toISOString().slice(0, 10); }

async function waterText(env, userId) {
  const u = await getUser(env, userId);
  const goal = u?.water_goal_ml || 2500;
  const rows = await supabaseGet(env, "water_log?user_id=eq." + userId + "&day=eq." + todayStr() + "&select=ml&limit=1");
  const ml = rows[0] ? rows[0].ml : 0;
  const pct = Math.min(100, Math.round(ml / goal * 100));
  const f = Math.round(pct / 10);
  return "💧 Вода сегодня\n\n" + "▰".repeat(f) + "▱".repeat(10 - f) + "  " + pct + "%\n" + ml + " / " + goal + " мл";
}

function waterMenu() {
  return { inline_keyboard: [
    [{ text: "+250 мл", callback_data: "water_add:250" }, { text: "+500 мл", callback_data: "water_add:500" }],
    [{ text: "✏️ Своё", callback_data: "water_custom" }, { text: "🎯 Цель", callback_data: "water_goal" }],
    [{ text: "Назад", callback_data: "food_supps" }, { text: "Главное меню", callback_data: "menu" }]
  ]};
}

async function addWater(env, userId, ml) {
  if (!ml || ml < 0) return;
  const rows = await supabaseGet(env, "water_log?user_id=eq." + userId + "&day=eq." + todayStr() + "&select=ml&limit=1");
  const total = (rows[0] ? rows[0].ml : 0) + ml;
  await fetch(env.SUPABASE_URL + "/rest/v1/water_log?on_conflict=user_id,day", {
    method: "POST", headers: supabaseHeaders(env, "resolution=merge-duplicates"),
    body: JSON.stringify({ user_id: userId, day: todayStr(), ml: total })
  });
}

async function handleWaterCustom(env, msg) {
  const ml = Number(msg.text.trim());
  if (!ml || ml <= 0 || ml > 5000) return sendMessage(env, msg.chat.id, "Введи число от 1 до 5000.", navMenu("water"));
  await addWater(env, msg.from.id, ml); await clearState(env, msg.from.id);
  return sendMessage(env, msg.chat.id, await waterText(env, msg.from.id), waterMenu());
}

async function handleWaterGoal(env, msg) {
  const ml = Number(msg.text.trim());
  if (!ml || ml < 500 || ml > 8000) return sendMessage(env, msg.chat.id, "Введи цель от 500 до 8000 мл.", navMenu("water"));
  await supabasePatch(env, "users?id=eq." + msg.from.id, { water_goal_ml: ml }); await clearState(env, msg.from.id);
  return sendMessage(env, msg.chat.id, "🎯 Цель обновлена.\n\n" + (await waterText(env, msg.from.id)), waterMenu());
}

// ===================== ИЗБРАННОЕ =====================

async function isFav(env, userId, exId) {
  const r = await supabaseGet(env, "favorite_exercises?user_id=eq." + userId + "&exercise_id=eq." + exId + "&select=exercise_id&limit=1");
  return r.length > 0;
}

async function toggleFav(env, userId, exId) {
  if (await isFav(env, userId, exId)) await supabaseDelete(env, "favorite_exercises?user_id=eq." + userId + "&exercise_id=eq." + exId);
  else await supabaseInsert(env, "favorite_exercises", { user_id: userId, exercise_id: exId });
}

async function favListText(env, userId) {
  const r = await supabaseGet(env, "favorite_exercises?user_id=eq." + userId + "&select=exercise_id");
  if (!r.length) return "⭐ Избранных упражнений нет. Открой упражнение и нажми «В избранное».";
  return "⭐ Избранные упражнения:";
}

async function favListMenu(env, userId) {
  const r = await supabaseGet(env, "favorite_exercises?user_id=eq." + userId + "&select=exercise_id");
  const rows = r.filter(x => EX[x.exercise_id]).map(x => [{ text: EX[x.exercise_id][0], callback_data: "ex:" + x.exercise_id }]);
  rows.push([{ text: "Назад", callback_data: "trainings" }, { text: "Главное меню", callback_data: "menu" }]);
  return { inline_keyboard: rows };
}

// ===================== «ДАВНО НЕ КАЧАЛ» =====================

async function staleGroup(env, userId) {
  const sets = await supabaseGet(env, "workout_sets?user_id=eq." + userId + "&select=exercise_id,created_at&order=created_at.desc&limit=500");
  if (sets.length < 5) return null;
  const trained = new Set(sets.map(s => groupOf(s.exercise_id)));
  const last = {};
  for (const s of sets) { const g = groupOf(s.exercise_id); if (!last[g]) last[g] = new Date(s.created_at).getTime(); }
  let worst = null;
  for (const g of trained) {
    const days = Math.floor((Date.now() - last[g]) / 864e5);
    if (days >= 10 && (!worst || days > worst.days)) worst = { group: g, days };
  }
  return worst;
}

// ===================== ОБЩЕЕ =====================

function fmtDate(s) { return new Date(s).toLocaleDateString("ru-RU"); }
function fmtNum(n) { return Math.round(n).toLocaleString("ru-RU"); }
function weekKey(d) { const x = new Date(d); const day = (x.getDay() + 6) % 7; x.setDate(x.getDate() - day); return (x.getMonth() + 1) + "/" + x.getDate(); }

function computeStreak(dates) {
  if (!dates.length) return 0;
  const set = new Set(dates.map(d => new Date(d).toISOString().slice(0, 10)));
  let streak = 0; const cur = new Date();
  if (!set.has(cur.toISOString().slice(0, 10))) cur.setDate(cur.getDate() - 1);
  while (set.has(cur.toISOString().slice(0, 10))) { streak++; cur.setDate(cur.getDate() - 1); }
  return streak;
}

function chartUrl(config) {
  return "https://quickchart.io/chart?bkg=white&w=640&h=380&c=" + encodeURIComponent(JSON.stringify(config));
}

function navMenu(back) { return { inline_keyboard: [[{ text: "Назад", callback_data: back }, { text: "Главное меню", callback_data: "menu" }]] }; }

async function ensureVisitOncePer3Hours(env, from) {
  await ensureUser(env, from);
  const last = await supabaseGet(env, "gym_visits?user_id=eq." + from.id + "&select=visited_at&order=visited_at.desc&limit=1");
  if (last.length) { const diff = (Date.now() - new Date(last[0].visited_at).getTime()) / 3.6e6; if (diff < VISIT_COOLDOWN_HOURS) return; }
  await supabaseInsert(env, "gym_visits", { user_id: from.id });
}

async function ensureUser(env, from) {
  if (!from) return;
  await fetch(env.SUPABASE_URL + "/rest/v1/users?on_conflict=id", {
    method: "POST", headers: supabaseHeaders(env, "resolution=merge-duplicates"),
    body: JSON.stringify({ id: from.id, username: from.username || null, first_name: from.first_name || null, last_name: from.last_name || null, last_seen: new Date().toISOString() })
  });
}

async function getUser(env, userId) { const r = await supabaseGet(env, "users?id=eq." + userId + "&select=*&limit=1"); return r[0] || null; }
async function saveProgram(env, userId, name, source, data) { await supabaseInsert(env, "custom_programs", { user_id: userId, name, source, data }); }
async function getNote(env, userId, exId) { const r = await supabaseGet(env, "exercise_notes?user_id=eq." + userId + "&exercise_id=eq." + exId + "&select=note&limit=1"); return r[0] ? r[0].note : null; }
async function saveNote(env, userId, exId, note) {
  await fetch(env.SUPABASE_URL + "/rest/v1/exercise_notes?on_conflict=user_id,exercise_id", {
    method: "POST", headers: supabaseHeaders(env, "resolution=merge-duplicates"),
    body: JSON.stringify({ user_id: userId, exercise_id: exId, note, updated_at: new Date().toISOString() })
  });
}

async function getState(env, userId) { const r = await supabaseGet(env, "user_state?user_id=eq." + userId + "&select=state,data&limit=1"); return r[0] || null; }
async function setState(env, userId, state, data) {
  await fetch(env.SUPABASE_URL + "/rest/v1/user_state?on_conflict=user_id", {
    method: "POST", headers: supabaseHeaders(env, "resolution=merge-duplicates"),
    body: JSON.stringify({ user_id: userId, state, data, updated_at: new Date().toISOString() })
  });
}
async function clearState(env, userId) { await supabaseDelete(env, "user_state?user_id=eq." + userId); }

async function supabaseGet(env, path) {
  const res = await fetch(env.SUPABASE_URL + "/rest/v1/" + path, { method: "GET", headers: supabaseHeaders(env) });
  if (!res.ok) return [];
  return await res.json();
}
async function supabaseInsert(env, table, body) {
  return fetch(env.SUPABASE_URL + "/rest/v1/" + table, { method: "POST", headers: supabaseHeaders(env, "return=minimal"), body: JSON.stringify(body) });
}
async function supabasePatch(env, path, body) {
  return fetch(env.SUPABASE_URL + "/rest/v1/" + path, { method: "PATCH", headers: supabaseHeaders(env, "return=minimal"), body: JSON.stringify(body) });
}
async function supabaseDelete(env, path) {
  return fetch(env.SUPABASE_URL + "/rest/v1/" + path, { method: "DELETE", headers: supabaseHeaders(env) });
}
function supabaseHeaders(env, prefer) {
  const h = { apikey: env.SUPABASE_KEY, Authorization: "Bearer " + env.SUPABASE_KEY, "Content-Type": "application/json" };
  if (prefer) h.Prefer = prefer;
  return h;
}

async function sendMessage(env, chatId, text, keyboard) {
  const payload = { chat_id: chatId, text };
  if (keyboard) payload.reply_markup = keyboard;
  await fetch("https://api.telegram.org/bot" + env.BOT_TOKEN + "/sendMessage", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
}
async function sendPhoto(env, chatId, url, caption, keyboard) {
  const payload = { chat_id: chatId, photo: url };
  if (caption) payload.caption = caption.slice(0, 1000);
  if (keyboard) payload.reply_markup = keyboard;
  await fetch("https://api.telegram.org/bot" + env.BOT_TOKEN + "/sendPhoto", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
}
async function editMessage(env, chatId, msgId, text, keyboard) {
  const payload = { chat_id: chatId, message_id: msgId, text };
  if (keyboard) payload.reply_markup = keyboard;
  await fetch("https://api.telegram.org/bot" + env.BOT_TOKEN + "/editMessageText", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
}
async function answerCallback(env, callbackId) {
  await fetch("https://api.telegram.org/bot" + env.BOT_TOKEN + "/answerCallbackQuery", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ callback_query_id: callbackId }) });
}
