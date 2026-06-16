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

const CHEST_IMAGES = {
  bench: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Bench_press.png",
  incline_bench: "https://upload.wikimedia.org/wikipedia/commons/7/70/Incline_bench_press.png",
  machine_press: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Chest_press_machine.png",
  pec_deck: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Pec_deck_machine.png",
  crossover: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Cable_crossover.png",
  dumbbell_press: "https://upload.wikimedia.org/wikipedia/commons/1/15/Dumbbell_bench_press.png",
  dips: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Parallel_bar_dips.png",
  pushups: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Push-up.png"
};

const TECH = {
  bench: "Лопатки сведены, стопы в полу. Гриф опускай к низу груди, локти примерно 45°. Не отбивай от груди.",
  incline_bench: "Скамья 20–35°. Лопатки сведены, жим вверх по дуге. Не превращай движение в жим плечами.",
  machine_press: "Спина прижата, грудь раскрыта. Жми плавно, не выпрямляй локти в жёсткий замок.",
  pec_deck: "Локти на уровне груди. Своди руки грудью, не плечами. В пике короткая пауза.",
  crossover: "Корпус слегка вперёд, локти мягкие. Своди руки перед собой, контролируй растяжение.",
  dumbbell_press: "Гантели опускай ниже уровня груди, не теряй контроль. Вверху не бей гантели друг о друга.",
  dips: "Для груди наклоняй корпус вперёд. Локти не разводи слишком резко. Движение подконтрольное.",
  pushups: "Корпус прямой, пресс напряжён. Опускайся до комфортной глубины, не проваливай поясницу.",

  squat: "Спина прямая, колени идут по направлению носков. Не отрывай пятки.",
  deadlift: "Гриф близко к ногам, спина нейтральная. Не тяни рывком.",
  lat_pulldown: "Тяни локтями вниз к груди. Не раскачивай корпус.",
  seated_row: "Тяни к животу, своди лопатки. Не округляй спину.",
  shoulder_press: "Спина ровная, жми вверх без сильного прогиба поясницы.",
  lateral_raise: "Поднимай через стороны до уровня плеч. Не забрасывай вес.",
  zbar_curl: "Локти у корпуса, без раскачки.",
  triceps_pushdown: "Локти неподвижны у корпуса, движение только в предплечьях.",
  leg_press: "Поясница прижата. Не выпрямляй колени в жёсткий замок.",
  romanian: "Таз назад, спина прямая, чувствуй заднюю поверхность бедра.",
  plank: "Тело прямое, таз не провисает.",
  pullups: "Тяни лопатками вниз, без рывков."
};

const MOTIVATION = [
  "Погнали в зал!",
  "Не пропускай тренировку.",
  "Ты сильнее, чем думаешь.",
  "Маленький шаг сегодня — большой результат завтра.",
  "Дисциплина бьёт мотивацию."
];

const CAT_ORDER = ["Грудь", "Спина", "Ноги", "Плечи", "Руки", "Пресс", "Кардио"];

const NAME2ID = {};
for (const id in EX) NAME2ID[EX[id][0].toLowerCase()] = id;

const CATS = {};
for (const id in EX) {
  const g = EX[id][1];
  (CATS[g] = CATS[g] || []).push(id);
}

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
      if (request.method === "GET") return new Response("Gym Bot v5 работает");

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
    return sendMessage(env, chatId, await mainText(env, msg.from), await mainMenu(env, userId));
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

  return sendMessage(env, chatId, "Используй кнопки ниже.", await mainMenu(env, userId));
}

async function handleCallback(env, cq) {
  const chatId = cq.message.chat.id;
  const msgId = cq.message.message_id;
  const userId = cq.from.id;
  const data = cq.data;
  const E = (t, kb) => editMessage(env, chatId, msgId, t, kb);

  await answerCallback(env, cq.id);
  await ensureUser(env, cq.from);

  if (data === "menu") return E(await mainText(env, cq.from), await mainMenu(env, userId));

  if (data === "active_workout") return openActiveWorkout(env, cq);

  if (data === "trainings") return E("Тренировки", trainingsMenu());

  if (data === "programs") return E("Программы тренировок", programsMenu());

  if (data === "program_full") return E("Фуллбади:", programListMenu("fb"));

  if (data === "program_split") return E("Сплиты:", programListMenu("split"));

  if (data.startsWith("program:")) {
    const id = data.split(":")[1];
    return E(programText(id), programMenu(id));
  }

  if (data.startsWith("saveprog:")) {
    const id = data.split(":")[1];
    await saveProgram(env, userId, PROGRAMS[id].name, "suggested", PROGRAMS[id]);
    return E("Сохранено в Мои программы:\n\n" + PROGRAMS[id].name, navMenu("my_trainings"));
  }

  if (data === "prog_train") return E("Тренировка по программе\n\nОткуда берём?", programTrainMenu());

  if (data === "ptrain_full" || data === "ptrain_split") {
    const type = data === "ptrain_full" ? "fb" : "split";
    const rows = Object.keys(PROGRAMS)
      .filter(id => id.startsWith(type + "_"))
      .map(id => [{ text: PROGRAMS[id].name, callback_data: "pstart:s:" + id }]);
    rows.push([{ text: "Назад", callback_data: "trainings" }, { text: "Главное меню", callback_data: "menu" }]);
    return E("Выбери программу:", { inline_keyboard: rows });
  }

  if (data === "ptrain_my") {
    const list = await supabaseGet(env, "custom_programs?user_id=eq." + userId + "&archived=eq.false&select=id,name&order=created_at.desc&limit=20");
    const rows = list.map(r => [{ text: r.name, callback_data: "pstart:c:" + r.id }]);
    rows.push([{ text: "Назад", callback_data: "trainings" }, { text: "Главное меню", callback_data: "menu" }]);
    return E(list.length ? "Выбери программу:" : "Пока пусто. Сохрани или создай программу.", { inline_keyboard: rows });
  }

  if (data.startsWith("pstart:")) return programDayPick(env, cq, data);
  if (data.startsWith("pday:")) return startProgramDay(env, cq, data);

  if (data === "free") {
    await startAutoSession(env, cq.from, "free", null, null);
    return E("Свободная тренировка\n\nВыбери группу или спонтанное упражнение:", freeWorkoutMenu());
  }

  if (data === "spont") return E("Спонтанное упражнение\n\nВыбери группу:", spontMenu());

  if (data.startsWith("spont:")) return spontaneous(env, cq, data.split(":")[1]);

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
    await startAutoSession(env, cq.from, "free", null, null);
    await syncJointExercise(env, userId, id);
    return openExercise(env, cq, id);
  }

  if (data.startsWith("set:")) {
    const id = data.split(":")[1];
    await setState(env, userId, "set_input", { exercise_id: id });
    return E("Запись подхода\n\n" + EX[id][0] + "\n\nВведи вес и повторы одним сообщением.\nПример: 80 8", navMenu("ex:" + id));
  }

  if (data.startsWith("hist:")) {
    const id = data.split(":")[1];
    return E(await historyText(env, userId, id), navMenu("ex:" + id));
  }

  if (data.startsWith("note:")) {
    const id = data.split(":")[1];
    await setState(env, userId, "set_note", { exercise_id: id });
    const exNote = await getNote(env, userId, id);
    return E("Заметка к «" + EX[id][0] + "»" + (exNote ? "\n\nСейчас:\n" + exNote : "\n\nЗаметки пока нет.") + "\n\nНапиши новый текст.", navMenu("ex:" + id));
  }

  if (data.startsWith("fav:")) {
    const id = data.split(":")[1];
    await toggleFav(env, userId, id);
    return openExercise(env, cq, id);
  }

  if (data.startsWith("tech:")) {
    const id = data.split(":")[1];
    return E("Техника — " + EX[id][0] + "\n\n" + (TECH[id] || "Делай движение подконтрольно, без рывков, в полной амплитуде."), navMenu("ex:" + id));
  }

  if (data === "sess_end") return endSession(env, cq);

  if (data === "repeat_last") return repeatLast(env, cq);

  if (data === "fav_list") return E(await favListText(env, userId), await favListMenu(env, userId));

  if (data === "my_trainings") return E(await myTrainingsText(env, userId), await myTrainingsMenu(env, userId));

  if (data.startsWith("myprog:")) {
    const id = data.split(":")[1];
    return E(await customProgramText(env, id), customProgramMenu(id));
  }

  if (data.startsWith("delprog:")) {
    const id = data.split(":")[1];
    await supabaseDelete(env, "custom_programs?id=eq." + id);
    return E("Программа удалена.", navMenu("my_trainings"));
  }

  if (data.startsWith("archiveprog:")) {
    const id = data.split(":")[1];
    await supabasePatch(env, "custom_programs?id=eq." + id, { archived: true });
    return E("Программа отправлена в архив.", navMenu("my_trainings"));
  }

  if (data.startsWith("favprog:")) {
    const id = data.split(":")[1];
    const row = await getProgramRow(env, id);
    await supabasePatch(env, "custom_programs?id=eq." + id, { is_favorite: !(row && row.is_favorite) });
    return E(await customProgramText(env, id), customProgramMenu(id));
  }

  if (data.startsWith("copyprog:")) {
    const id = data.split(":")[1];
    const row = await getProgramRow(env, id);
    if (row) {
      await saveProgram(env, userId, row.name + " — копия", "copy", row.data);
      return E("Копия создана:\n\n" + row.name + " — копия", navMenu("my_trainings"));
    }
    return E("Программа не найдена.", navMenu("my_trainings"));
  }

  if (data === "custom_program") {
    await setState(env, userId, "custom_name", {});
    return E("Новая программа\n\nНапиши название одним сообщением.", navMenu("trainings"));
  }

  if (data.startsWith("editprog:")) {
    const id = data.split(":")[1];
    return openEditor(env, cq, id);
  }

  if (data.startsWith("ce:")) return openEditor(env, cq, data.split(":")[1]);

  if (data.startsWith("cead:")) return editorAddDay(env, cq, data.split(":")[1]);

  if (data.startsWith("cdd:")) {
    const [, id, day] = data.split(":");
    return editorDelDay(env, cq, id, Number(day));
  }

  if (data.startsWith("cg:")) {
    const [, id, day] = data.split(":");
    return E("Категория:", catMenu(id, day));
  }

  if (data.startsWith("ccat:")) {
    const [, id, day, ci] = data.split(":");
    return E("Упражнение:", catExMenu(id, day, Number(ci)));
  }

  if (data.startsWith("cex:")) {
    const [, id, day, exId] = data.split(":");
    return E(EX[exId][0] + "\n\nСколько подходов?", setsMenu(id, day, exId));
  }

  if (data.startsWith("cset:")) {
    const [, id, day, exId, sets] = data.split(":");
    return E(EX[exId][0] + " — " + sets + " подх.\n\nСколько повторов?", repsMenu(id, day, exId, sets));
  }

  if (data.startsWith("creps:")) return editorAddItem(env, cq, data);
  if (data.startsWith("cdel:")) return editorDelItem(env, cq, data);
  if (data.startsWith("cmu:")) return editorMove(env, cq, data, -1);
  if (data.startsWith("cmd:")) return editorMove(env, cq, data, 1);

  if (data === "pick") {
    await setState(env, userId, "pick", {});
    return E("Подбор тренировки\n\nГде тренируемся?", pickPlaceMenu());
  }

  if (data.startsWith("pick:")) return handlePick(env, cq, data);

  if (data === "analytics") return E("Аналитика", analyticsMenu());
  if (data === "an_summary") return E(await analyticsSummary(env, userId), navMenu("analytics"));
  if (data === "an_groups") return analyticsGroups(env, cq);
  if (data === "an_visits") return analyticsVisits(env, cq);
  if (data === "an_last") return E(await lastWorkoutsText(env, userId), navMenu("analytics"));
  if (data === "an_records") return E(await recordsText(env, userId), navMenu("analytics"));
  if (data === "an_energy") return E(await energyText(env, userId), navMenu("analytics"));
  if (data === "an_export") return analyticsExport(env, cq);

  if (data === "food_recovery") return E("Питание и восстановление", foodRecoveryMenu());
  if (data === "food_supps") return E("Питание", foodMenu());
  if (data === "food_principles") return E(nutritionText(), navMenu("food_recovery"));
  if (data === "food_recipes") return E("Рецепты\n\nВыбери приём пищи:", recipesMenu());
  if (data.startsWith("recipe:")) return E(recipeText(data.split(":")[1]), navMenu("food_recipes"));
  if (data === "supps") return E(suppsText(), navMenu("food_recovery"));
  if (data === "rec_sleep") return E(sleepText(), navMenu("food_recovery"));
  if (data === "rec_sauna") return E(saunaText(), navMenu("food_recovery"));
  if (data === "water") return E(await waterText(env, userId), waterMenu());
  if (data.startsWith("water_add:")) {
    await addWater(env, userId, Number(data.split(":")[1]));
    return E(await waterText(env, userId), waterMenu());
  }
  if (data === "water_custom") {
    await setState(env, userId, "water_custom", {});
    return E("Введи объём в мл. Например: 300", navMenu("water"));
  }
  if (data === "water_goal") {
    await setState(env, userId, "water_goal", {});
    return E("Введи цель в мл. Например: 2500", navMenu("water"));
  }

  if (data === "friends") return E("Друзья", friendsMenu());
  if (data === "friend_add") {
    await setState(env, userId, "friend_add", {});
    return E("Добавить друга\n\nПусть друг откроет Профиль и пришлёт свой ID. Введи ID сообщением.", navMenu("friends"));
  }
  if (data === "friend_list") return E(await friendListText(env, userId), await friendListMenu(env, userId));
  if (data === "friend_requests") return E("Заявки в друзья:", await friendRequestsMenu(env, userId));
  if (data.startsWith("frq_ac:")) return acceptFriend(env, cq, Number(data.split(":")[1]));
  if (data.startsWith("frq_de:")) return declineFriend(env, cq, Number(data.split(":")[1]));
  if (data.startsWith("fdel:")) {
    const fid = Number(data.split(":")[1]);
    await removeFriend(env, userId, fid);
    return E(await friendListText(env, userId), await friendListMenu(env, userId));
  }
  if (data.startsWith("fview:")) return E(await friendViewText(env, userId, Number(data.split(":")[1])), navMenu("friend_list"));
  if (data === "friend_msg") return E("Сообщение друзьям", broadcastMenu());
  if (data.startsWith("bcast:")) return sendTemplate(env, cq, Number(data.split(":")[1]));
  if (data === "bcast_custom") {
    await setState(env, userId, "friend_broadcast", {});
    return E("Напиши сообщение — отправлю всем твоим друзьям.", navMenu("friend_msg"));
  }
  if (data === "joint") return E("Совместная тренировка\n\nВыбери друга:", await jointPickMenu(env, userId));
  if (data.startsWith("jinv:")) return jointInvite(env, cq, Number(data.split(":")[1]));
  if (data.startsWith("jac:")) return jointAccept(env, cq, Number(data.split(":")[1]));
  if (data.startsWith("jde:")) return jointDecline(env, cq, Number(data.split(":")[1]));

  if (data === "leaderboard") return E("Рейтинг среди друзей за 7 дней", leaderboardMenu());
  if (data.startsWith("lb:")) return leaderboard(env, cq, data.split(":")[1]);

  if (data === "challenges") return E(await challengesText(env, userId), await challengesMenu(env, userId));
  if (data === "ch_new") return E("Новый челлендж\n\nГотовые шаблоны или свой:", challengeTemplatesMenu());
  if (data.startsWith("chtpl:")) return createChallengeTemplate(env, cq, Number(data.split(":")[1]));
  if (data === "ch_custom") return E("Тип челленджа:", {
    inline_keyboard: [
      [{ text: "Кол-во тренировок", callback_data: "chc:workouts" }],
      [{ text: "Тоннаж", callback_data: "chc:tonnage" }],
      [{ text: "Назад", callback_data: "challenges" }, { text: "Главное меню", callback_data: "menu" }]
    ]
  });
  if (data.startsWith("chc:")) {
    const t = data.split(":")[1];
    return E("Период:", {
      inline_keyboard: [
        [{ text: "Неделя", callback_data: "chcp:" + t + ":week" }],
        [{ text: "Месяц", callback_data: "chcp:" + t + ":month" }],
        [{ text: "Назад", callback_data: "ch_custom" }, { text: "Главное меню", callback_data: "menu" }]
      ]
    });
  }
  if (data.startsWith("chcp:")) {
    const [, t, per] = data.split(":");
    return E("Цель:", goalMenu(t, per));
  }
  if (data.startsWith("chmk:")) return createChallengeCustom(env, cq, data);
  if (data.startsWith("ch_join:")) return joinChallenge(env, cq, Number(data.split(":")[1]));
  if (data.startsWith("ch_view:")) return E(await challengeViewText(env, Number(data.split(":")[1])), navMenu("challenges"));
  if (data.startsWith("ch_leave:")) {
    const id = Number(data.split(":")[1]);
    await supabaseDelete(env, "challenge_members?challenge_id=eq." + id + "&user_id=eq." + userId);
    return E(await challengesText(env, userId), await challengesMenu(env, userId));
  }

  if (data === "profile") return E(await profileText(env, cq.from), profileMenu());
  if (data === "profile_edit") {
    await setState(env, userId, "prof_height", {});
    return E("Заполнение профиля\n\nВведи рост в см. Например: 180", navMenu("profile"));
  }
  if (data.startsWith("prof_sex:")) {
    await supabasePatch(env, "users?id=eq." + userId, { sex: data.split(":")[1] });
    return E("Пол сохранён.\n\nУровень активности?", activityMenu());
  }
  if (data.startsWith("prof_activity:")) {
    await supabasePatch(env, "users?id=eq." + userId, { activity: data.split(":")[1] });
    await clearState(env, userId);
    return E(await profileText(env, cq.from), profileMenu());
  }
  if (data === "privacy") return E(privacyHeader(), await privacyMenu(env, userId));
  if (data.startsWith("priv:")) {
    const field = "priv_" + data.split(":")[1];
    const u = await getUser(env, userId);
    await supabasePatch(env, "users?id=eq." + userId, { [field]: !(u && u[field] !== false) });
    return E(privacyHeader(), await privacyMenu(env, userId));
  }
}

async function mainText(env, from) {
  let t = "Главное меню\n\nПривет, " + (from.first_name || "друг") + ". Что делаем сегодня?";
  const stale = await staleGroup(env, from.id);
  if (stale) t += "\n\nДавно не тренировал: " + stale.group + " (" + stale.days + " дн.)";
  return t;
}

async function mainMenu(env, userId) {
  const rows = [];
  const active = await activeSession(env, userId);

  if (active) rows.push([{ text: "Активная тренировка", callback_data: "active_workout" }]);

  rows.push([{ text: "Тренировки", callback_data: "trainings" }]);
  rows.push([{ text: "Аналитика", callback_data: "analytics" }]);
  rows.push([{ text: "Питание и восстановление", callback_data: "food_recovery" }]);
  rows.push([{ text: "Друзья", callback_data: "friends" }]);
  rows.push([{ text: "Профиль", callback_data: "profile" }]);

  return { inline_keyboard: rows };
}

function trainingsMenu() {
  return {
    inline_keyboard: [
      [{ text: "Программы тренировок", callback_data: "programs" }],
      [{ text: "Мои программы", callback_data: "my_trainings" }],
      [{ text: "Свободная тренировка", callback_data: "free" }],
      [{ text: "Создать программу", callback_data: "custom_program" }],
      [{ text: "Подобрать тренировку", callback_data: "pick" }],
      [{ text: "Повторить прошлую", callback_data: "repeat_last" }],
      [{ text: "Избранные упражнения", callback_data: "fav_list" }],
      [{ text: "Главное меню", callback_data: "menu" }]
    ]
  };
}

function programsMenu() {
  return {
    inline_keyboard: [
      [{ text: "Тренировка по программе", callback_data: "prog_train" }],
      [{ text: "Фуллбади", callback_data: "program_full" }],
      [{ text: "Сплиты", callback_data: "program_split" }],
      [{ text: "Мои программы", callback_data: "my_trainings" }],
      [{ text: "Создать программу", callback_data: "custom_program" }],
      [{ text: "Подобрать тренировку", callback_data: "pick" }],
      [{ text: "Назад", callback_data: "trainings" }, { text: "Главное меню", callback_data: "menu" }]
    ]
  };
}

function programTrainMenu() {
  return {
    inline_keyboard: [
      [{ text: "Готовые: Фуллбади", callback_data: "ptrain_full" }],
      [{ text: "Готовые: Сплиты", callback_data: "ptrain_split" }],
      [{ text: "Мои программы", callback_data: "ptrain_my" }],
      [{ text: "Назад", callback_data: "trainings" }, { text: "Главное меню", callback_data: "menu" }]
    ]
  };
}

function freeWorkoutMenu() {
  return {
    inline_keyboard: [
      [{ text: "Выбрать упражнение", callback_data: "free_groups" }],
      [{ text: "Спонтанное упражнение", callback_data: "spont" }],
      [{ text: "Грудь", callback_data: "group:chest" }],
      [{ text: "Спина", callback_data: "group:back" }],
      [{ text: "Ноги", callback_data: "group:legs" }],
      [{ text: "Плечи", callback_data: "group:shoulders" }],
      [{ text: "Руки", callback_data: "group:arms" }],
      [{ text: "Пресс", callback_data: "group:abs" }],
      [{ text: "Кардио", callback_data: "group:cardio" }],
      [{ text: "Завершить тренировку", callback_data: "sess_end" }],
      [{ text: "Главное меню", callback_data: "menu" }]
    ]
  };
}

function muscleGroupsMenu(back) {
  return {
    inline_keyboard: [
      [{ text: "Грудь", callback_data: "group:chest" }],
      [{ text: "Спина", callback_data: "group:back" }],
      [{ text: "Ноги", callback_data: "group:legs" }],
      [{ text: "Плечи", callback_data: "group:shoulders" }],
      [{ text: "Руки", callback_data: "group:arms" }],
      [{ text: "Пресс", callback_data: "group:abs" }],
      [{ text: "Кардио", callback_data: "group:cardio" }],
      [{ text: "Назад", callback_data: back || "trainings" }, { text: "Главное меню", callback_data: "menu" }]
    ]
  };
}

function subGroupsMenu(g) {
  const rows = Object.keys(SUBGROUPS[g].subs).map(s => [{ text: SUBGROUPS[g].subs[s][0], callback_data: "sub:" + g + ":" + s }]);
  rows.push([{ text: "Назад", callback_data: "free" }, { text: "Главное меню", callback_data: "menu" }]);
  return { inline_keyboard: rows };
}

function exercisesMenu(ids, back) {
  const rows = ids.map(id => [{ text: EX[id][0], callback_data: "ex:" + id }]);
  rows.push([{ text: "Назад", callback_data: back || "free" }, { text: "Главное меню", callback_data: "menu" }]);
  return { inline_keyboard: rows };
}

function foodRecoveryMenu() {
  return {
    inline_keyboard: [
      [{ text: "Питание", callback_data: "food_supps" }],
      [{ text: "БАДы", callback_data: "supps" }],
      [{ text: "Сон", callback_data: "rec_sleep" }],
      [{ text: "Баня", callback_data: "rec_sauna" }],
      [{ text: "Вода", callback_data: "water" }],
      [{ text: "Главное меню", callback_data: "menu" }]
    ]
  };
}

function foodMenu() {
  return {
    inline_keyboard: [
      [{ text: "Рецепты", callback_data: "food_recipes" }],
      [{ text: "Принципы питания", callback_data: "food_principles" }],
      [{ text: "Вода", callback_data: "water" }],
      [{ text: "Назад", callback_data: "food_recovery" }, { text: "Главное меню", callback_data: "menu" }]
    ]
  };
}

async function openExercise(env, cq, id) {
  const userId = cq.from.id;
  const text = await exerciseText(env, userId, id);
  const keyboard = await exerciseMenu(env, userId, id);

  if (CHEST_IMAGES[id]) {
    await sendPhoto(env, cq.message.chat.id, CHEST_IMAGES[id], text, keyboard);
    return;
  }

  return editMessage(env, cq.message.chat.id, cq.message.message_id, text, keyboard);
}

async function exerciseText(env, userId, id) {
  const e = EX[id];
  let t = e[0] + "\n\nГруппа: " + e[1] + (e[2] ? "\nРаздел: " + e[2] : "");
  const note = await getNote(env, userId, id);
  if (note) t += "\n\nЗаметка: " + note;
  return t + "\n\nВыбери действие.";
}

async function exerciseMenu(env, userId, id) {
  const fav = await isFav(env, userId, id);
  return {
    inline_keyboard: [
      [{ text: "Записать подход", callback_data: "set:" + id }],
      [{ text: "История", callback_data: "hist:" + id }, { text: "Техника", callback_data: "tech:" + id }],
      [{ text: "Заметка", callback_data: "note:" + id }, { text: fav ? "В избранном" : "В избранное", callback_data: "fav:" + id }],
      [{ text: "Завершить тренировку", callback_data: "sess_end" }],
      [{ text: "Назад", callback_data: "free" }, { text: "Главное меню", callback_data: "menu" }]
    ]
  };
}

async function activeSession(env, userId) {
  const rows = await supabaseGet(
    env,
    "workout_sessions?status=eq.active&or=(user_id.eq." + userId + ",partner_id.eq." + userId + ")&select=*&order=started_at.desc&limit=1"
  );
  return rows[0] || null;
}

async function startAutoSession(env, from, kind, programId, dayIndex) {
  const userId = from.id;
  const current = await activeSession(env, userId);
  if (current) return current;

  await ensureVisitOncePer3Hours(env, from);

  await supabaseInsert(env, "workout_sessions", {
    user_id: userId,
    kind: kind || "free",
    status: "active",
    program_id: programId || null,
    day_index: dayIndex === undefined ? null : Number(dayIndex)
  });

  const created = await activeSession(env, userId);

  const friends = await acceptedFriends(env, userId);
  for (const fid of friends) {
    const u = await getUser(env, fid);
    if (!u || u.priv_online === false) continue;
    await sendMessage(env, fid, (from.first_name || "Друг") + " начал тренировку.");
  }

  return created;
}

async function openActiveWorkout(env, cq) {
  const userId = cq.from.id;
  const s = await activeSession(env, userId);

  if (!s) {
    return editMessage(env, cq.message.chat.id, cq.message.message_id, "Активной тренировки нет.", await mainMenu(env, userId));
  }

  const sets = await supabaseGet(
    env,
    "workout_sets?session_id=eq." + s.id + "&user_id=eq." + userId + "&select=exercise_id,exercise_name,weight,reps,created_at&order=created_at.asc"
  );

  let tonnage = 0;
  const byEx = {};
  for (const x of sets) {
    const v = Number(x.weight) * Number(x.reps);
    tonnage += v;
    byEx[x.exercise_name] = (byEx[x.exercise_name] || 0) + 1;
  }

  const mins = Math.max(1, Math.round((Date.now() - new Date(s.started_at).getTime()) / 60000));

  let title = "Активная тренировка";
  if (s.kind === "program") title = "Активная тренировка по программе";
  if (s.kind === "joint") title = "Совместная тренировка";

  let text =
    title +
    "\n\nВремя: " +
    mins +
    " мин" +
    "\nПодходов: " +
    sets.length +
    "\nТоннаж: " +
    fmtNum(tonnage) +
    " кг";

  if (Object.keys(byEx).length) {
    text += "\n\nУпражнения:";
    for (const n in byEx) text += "\n• " + n + " — " + byEx[n] + " подх.";
  }

  const rows = [];

  if (s.kind === "program" && s.program_id) {
    const [src, pid] = String(s.program_id).split(":");
    const pr = await loadProgram(env, src, pid);
    const day = pr && pr.days ? pr.days[Number(s.day_index || 0)] : null;
    if (day) {
      for (const it of day.items) {
        if (it.ex && EX[it.ex]) rows.push([{ text: itemLabel(it), callback_data: "ex:" + it.ex }]);
      }
    }
  } else {
    rows.push([{ text: "Выбрать упражнение", callback_data: "free" }]);
    rows.push([{ text: "Спонтанное упражнение", callback_data: "spont" }]);
  }

  rows.push([{ text: "Завершить тренировку", callback_data: "sess_end" }]);
  rows.push([{ text: "Главное меню", callback_data: "menu" }]);

  return editMessage(env, cq.message.chat.id, cq.message.message_id, text, { inline_keyboard: rows });
}

async function endSession(env, cq) {
  const userId = cq.from.id;
  const chatId = cq.message.chat.id;
  const s = await activeSession(env, userId);

  if (!s) {
    return editMessage(env, chatId, cq.message.message_id, "Активной тренировки нет.", await mainMenu(env, userId));
  }

  const ended = new Date().toISOString();
  await supabasePatch(env, "workout_sessions?id=eq." + s.id, { status: "ended", ended_at: ended });

  const sets = await supabaseGet(
    env,
    "workout_sets?session_id=eq." + s.id + "&user_id=eq." + userId + "&select=exercise_name,weight,reps,created_at&order=created_at.asc"
  );

  const mins = Math.max(1, Math.round((Date.now() - new Date(s.started_at).getTime()) / 60000));
  let tonnage = 0;
  const byEx = {};

  for (const x of sets) {
    const v = Number(x.weight) * Number(x.reps);
    tonnage += v;
    byEx[x.exercise_name] = (byEx[x.exercise_name] || 0) + v;
  }

  let cap =
    "Тренировка завершена!\n\nВремя: " +
    mins +
    " мин\nПодходов: " +
    sets.length +
    "\nТоннаж: " +
    fmtNum(tonnage) +
    " кг";

  if (sets.length) {
    cap += "\n\nУпражнения:";
    for (const n in byEx) cap += "\n• " + n + " — " + fmtNum(byEx[n]) + " кг";
  } else {
    cap += "\n\nВ этот раз подходы не записаны.";
  }

  const friends = await acceptedFriends(env, userId);
  for (const fid of friends) {
    const u = await getUser(env, fid);
    if (!u || u.priv_online === false) continue;
    await sendMessage(env, fid, (cq.from.first_name || "Друг") + " завершил тренировку.\n\n" + cap);
  }

  const labels = Object.keys(byEx);
  if (labels.length) {
    const url = chartUrl({
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Тоннаж, кг",
            data: labels.map(n => Math.round(byEx[n])),
            backgroundColor: "#4f8cff"
          }
        ]
      },
      options: {
        plugins: {
          title: { display: true, text: "Итоги: " + mins + " мин · " + fmtNum(tonnage) + " кг" },
          legend: { display: false }
        }
      }
    });

    await sendPhoto(env, chatId, url, cap, await mainMenu(env, userId));
    return;
  }

  return sendMessage(env, chatId, cap, await mainMenu(env, userId));
}

async function handleSetInput(env, msg, st) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const exId = st.data.exercise_id;
  const parts = msg.text.trim().replace(",", ".").split(/\s+/);
  const weight = Number(parts[0]);
  const reps = Number(parts[1]);

  if (!weight || !reps) return sendMessage(env, chatId, "Нужно так: 80 8", navMenu("ex:" + exId));

  const session = await startAutoSession(env, msg.from, "free", null, null);

  const prev = await supabaseGet(
    env,
    "workout_sets?user_id=eq." + userId + "&exercise_id=eq." + exId + "&select=weight&order=weight.desc&limit=1"
  );
  const prevMax = prev[0] ? Number(prev[0].weight) : 0;

  await supabaseInsert(env, "workout_sets", {
    user_id: userId,
    exercise_id: exId,
    exercise_name: EX[exId][0],
    weight,
    reps,
    session_id: session ? session.id : null
  });

  await clearState(env, userId);

  let t = "Сохранено\n\n" + EX[exId][0] + "\n" + weight + " кг x " + reps;
  if (weight > prevMax && prevMax > 0) t += "\n\nНовый личный рекорд по весу!";
  t += "\n\nОценка 1ПМ ≈ " + Math.round(weight * (1 + reps / 30)) + " кг";

  return sendMessage(env, chatId, t, {
    inline_keyboard: [
      [{ text: "Ещё подход", callback_data: "set:" + exId }],
      [{ text: "История", callback_data: "hist:" + exId }],
      [{ text: "Активная тренировка", callback_data: "active_workout" }],
      [{ text: "Завершить тренировку", callback_data: "sess_end" }],
      [{ text: "Назад", callback_data: "ex:" + exId }, { text: "Главное меню", callback_data: "menu" }]
    ]
  });
}

async function handleSetNote(env, msg, st) {
  const exId = st.data.exercise_id;
  await saveNote(env, msg.from.id, exId, msg.text.trim());
  await clearState(env, msg.from.id);
  return sendMessage(env, msg.chat.id, "Заметка сохранена.", navMenu("ex:" + exId));
}

async function historyText(env, userId, exId) {
  const rows = await supabaseGet(
    env,
    "workout_sets?user_id=eq." + userId + "&exercise_id=eq." + exId + "&select=weight,reps,created_at&order=created_at.desc&limit=12"
  );

  let t = "История\n\n" + EX[exId][0] + "\n";
  if (!rows.length) return t + "\nПока нет записей.";

  for (const r of rows) t += "\n• " + fmtDate(r.created_at) + " — " + r.weight + " кг x " + r.reps;
  return t;
}

async function repeatLast(env, cq) {
  const userId = cq.from.id;
  const chatId = cq.message.chat.id;

  const last = await supabaseGet(
    env,
    "workout_sessions?user_id=eq." + userId + "&status=eq.ended&select=id&order=ended_at.desc&limit=1"
  );

  if (!last.length) return editMessage(env, chatId, cq.message.message_id, "Прошлых завершённых тренировок пока нет.", trainingsMenu());

  const sets = await supabaseGet(env, "workout_sets?session_id=eq." + last[0].id + "&select=exercise_id&order=created_at.asc");
  const ids = [...new Set(sets.map(s => s.exercise_id))].filter(Boolean);

  if (!ids.length) return editMessage(env, chatId, cq.message.message_id, "В прошлой тренировке нет записанных упражнений.", trainingsMenu());

  await startAutoSession(env, cq.from, "free", null, null);

  const rows = ids.map(id => [{ text: EX[id] ? EX[id][0] : id, callback_data: "ex:" + id }]);
  rows.push([{ text: "Завершить тренировку", callback_data: "sess_end" }]);
  rows.push([{ text: "Главное меню", callback_data: "menu" }]);

  return editMessage(env, chatId, cq.message.message_id, "Повтор прошлой тренировки. Упражнения подтянуты — записывай подходы:", { inline_keyboard: rows });
}

function spontMenu() {
  return {
    inline_keyboard: [
      ...Object.keys(GROUPS).map(g => [{ text: GROUPS[g][0], callback_data: "spont:" + g }]),
      [{ text: "Плечи", callback_data: "spont:shoulders" }, { text: "Руки", callback_data: "spont:arms" }],
      [{ text: "Любая", callback_data: "spont:any" }],
      [{ text: "Назад", callback_data: "free" }, { text: "Главное меню", callback_data: "menu" }]
    ]
  };
}

async function spontaneous(env, cq, g) {
  await startAutoSession(env, cq.from, "free", null, null);

  let pool = [];
  if (g === "any") pool = Object.keys(EX);
  else if (GROUPS[g]) pool = GROUPS[g][1];
  else if (SUBGROUPS[g]) for (const s in SUBGROUPS[g].subs) pool = pool.concat(SUBGROUPS[g].subs[s][1]);

  const id = pool[Math.floor(Math.random() * pool.length)];
  return openExercise(env, cq, id);
}

function programListMenu(type) {
  const rows = [];
  for (const id of Object.keys(PROGRAMS)) {
    if (id.startsWith(type + "_")) rows.push([{ text: PROGRAMS[id].name, callback_data: "program:" + id }]);
  }
  rows.push([{ text: "Назад", callback_data: "programs" }, { text: "Главное меню", callback_data: "menu" }]);
  return { inline_keyboard: rows };
}

function programText(id) {
  return renderProgram(normalizeProgram(PROGRAMS[id]));
}

function programMenu(id) {
  return {
    inline_keyboard: [
      [{ text: "Заниматься по программе", callback_data: "pstart:s:" + id }],
      [{ text: "Сохранить в мои", callback_data: "saveprog:" + id }],
      [{ text: "Назад", callback_data: id.startsWith("fb_") ? "program_full" : "program_split" }, { text: "Главное меню", callback_data: "menu" }]
    ]
  };
}

function renderProgram(pr) {
  let t = pr.name + "\n\n";
  pr.days.forEach((d, i) => {
    t += (d.title || "День " + (i + 1)) + "\n";
    d.items.forEach(it => (t += "• " + itemLabel(it) + "\n"));
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
      if (items.length && !items[0].ex && !/\d/.test(items[0].label)) {
        title = items[0].label;
        items.shift();
      }
      return { title, items };
    }

    return {
      title: d.title || "День " + (i + 1),
      items: (d.items || []).map(it => ({
        ex: it.ex || null,
        label: it.label || (it.ex && EX[it.ex] ? EX[it.ex][0] : ""),
        sets: it.sets || null,
        reps: it.reps || null
      }))
    };
  });

  return { name, days };
}

function parseLine(s) {
  const m = s.match(/^(.*?)[\s]+(\d+)x(\d+)\s*$/);
  if (m) {
    const ex = NAME2ID[m[1].trim().toLowerCase()] || null;
    return { ex, label: s, sets: Number(m[2]), reps: Number(m[3]) };
  }

  const m2 = s.match(/^(.*?)[\s]+\d+\s*$/);
  if (m2) {
    const ex = NAME2ID[m2[1].trim().toLowerCase()] || null;
    if (ex) return { ex, label: s, sets: null, reps: null };
  }

  const ex2 = NAME2ID[s.trim().toLowerCase()] || null;
  return { ex: ex2, label: s, sets: null, reps: null };
}

async function programDayPick(env, cq, data) {
  const [, src, id] = data.split(":");
  const pr = await loadProgram(env, src, id);

  if (!pr) return editMessage(env, cq.message.chat.id, cq.message.message_id, "Программа не найдена.", navMenu("programs"));

  const rows = pr.days.map((d, i) => [{ text: d.title || "День " + (i + 1), callback_data: "pday:" + src + ":" + id + ":" + i }]);
  rows.push([{ text: "Назад", callback_data: "prog_train" }, { text: "Главное меню", callback_data: "menu" }]);

  return editMessage(env, cq.message.chat.id, cq.message.message_id, pr.name + "\n\nВыбери день:", { inline_keyboard: rows });
}

async function startProgramDay(env, cq, data) {
  const [, src, id, dayIdx] = data.split(":");
  const userId = cq.from.id;
  const pr = await loadProgram(env, src, id);
  const day = pr && pr.days ? pr.days[Number(dayIdx)] : null;

  if (!day) return editMessage(env, cq.message.chat.id, cq.message.message_id, "День не найден.", navMenu("programs"));

  await startAutoSession(env, cq.from, "program", src + ":" + id, Number(dayIdx));

  let t = pr.name + " — " + (day.title || "День " + (Number(dayIdx) + 1)) + "\n\nЖми упражнение, чтобы записать подход.\n";

  const rows = [];
  for (const it of day.items) {
    if (it.ex && EX[it.ex]) rows.push([{ text: itemLabel(it), callback_data: "ex:" + it.ex }]);
    else t += "\n• " + (it.label || "") + " (без записи)";
  }

  rows.push([{ text: "Завершить тренировку", callback_data: "sess_end" }]);
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

async function handleCustomName(env, msg) {
  const name = msg.text.trim();

  await supabaseInsert(env, "custom_programs", {
    user_id: msg.from.id,
    name,
    source: "custom",
    data: { name, days: [{ title: "День 1", items: [] }] }
  });

  await clearState(env, msg.from.id);

  const rows = await supabaseGet(env, "custom_programs?user_id=eq." + msg.from.id + "&select=id&order=created_at.desc&limit=1");
  const id = rows[0] ? rows[0].id : null;

  return sendMessage(env, msg.chat.id, "Программа создана: " + name, id ? await editorKeyboard(env, id) : navMenu("my_trainings"));
}

async function getProgramRow(env, id) {
  const rows = await supabaseGet(env, "custom_programs?id=eq." + id + "&select=*&limit=1");
  return rows[0] || null;
}

async function saveProgramData(env, id, data) {
  await supabasePatch(env, "custom_programs?id=eq." + id, { data });
}

async function editorText(env, id) {
  const row = await getProgramRow(env, id);
  if (!row) return "Программа не найдена.";

  const pr = normalizeProgram(row.data || { name: row.name, days: [] });
  return "Конструктор: " + pr.name + "\n\n" + renderProgram(pr) + "\n\nДобавляй и убирай упражнения кнопками ниже.";
}

async function editorKeyboard(env, id) {
  const row = await getProgramRow(env, id);
  const pr = normalizeProgram(row.data || { name: row.name, days: [{ title: "День 1", items: [] }] });

  const rows = [];

  pr.days.forEach((d, di) => {
    rows.push([{ text: "— " + (d.title || "День " + (di + 1)) + " —", callback_data: "ce:" + id }]);

    d.items.forEach((it, ii) => {
      rows.push([
        { text: itemLabel(it), callback_data: "ce:" + id },
        { text: "Вверх", callback_data: "cmu:" + id + ":" + di + ":" + ii },
        { text: "Вниз", callback_data: "cmd:" + id + ":" + di + ":" + ii },
        { text: "Удалить", callback_data: "cdel:" + id + ":" + di + ":" + ii }
      ]);
    });

    rows.push([{ text: "Добавить упражнение в " + (d.title || "День " + (di + 1)), callback_data: "cg:" + id + ":" + di }]);

    if (pr.days.length > 1) {
      rows.push([{ text: "Удалить " + (d.title || "День " + (di + 1)), callback_data: "cdd:" + id + ":" + di }]);
    }
  });

  rows.push([{ text: "Добавить день", callback_data: "cead:" + id }]);
  rows.push([{ text: "Готово", callback_data: "my_trainings" }, { text: "Главное меню", callback_data: "menu" }]);

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
  rows.push([{ text: "Назад", callback_data: "ce:" + id }, { text: "Главное меню", callback_data: "menu" }]);
  return { inline_keyboard: rows };
}

function catExMenu(id, day, ci) {
  const cat = CAT_ORDER[ci];
  const rows = (CATS[cat] || []).map(exId => [{ text: EX[exId][0], callback_data: "cex:" + id + ":" + day + ":" + exId }]);
  rows.push([{ text: "Назад", callback_data: "cg:" + id + ":" + day }, { text: "Главное меню", callback_data: "menu" }]);
  return { inline_keyboard: rows };
}

function setsMenu(id, day, exId) {
  const rows = [[2, 3, 4, 5].map(n => ({ text: n + " подх.", callback_data: "cset:" + id + ":" + day + ":" + exId + ":" + n }))];
  rows.push([{ text: "Назад", callback_data: "cex:" + id + ":" + day + ":" + exId }, { text: "Главное меню", callback_data: "menu" }]);
  return { inline_keyboard: rows };
}

function repsMenu(id, day, exId, sets) {
  const rows = [[6, 8, 10, 12, 15, 20].map(n => ({ text: n + " повт.", callback_data: "creps:" + id + ":" + day + ":" + exId + ":" + sets + ":" + n }))];
  rows.push([{ text: "Назад", callback_data: "cex:" + id + ":" + day + ":" + exId }, { text: "Главное меню", callback_data: "menu" }]);
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

  const i = Number(idx);
  const j = i + dir;

  if (d && j >= 0 && j < d.items.length) {
    const tmp = d.items[i];
    d.items[i] = d.items[j];
    d.items[j] = tmp;
  }

  await saveProgramData(env, id, pr);
  return openEditor(env, cq, id);
}

async function myTrainingsText(env, userId) {
  const rows = await supabaseGet(env, "custom_programs?user_id=eq." + userId + "&archived=eq.false&select=id,name,source,is_favorite&order=created_at.desc");

  if (!rows.length) return "Мои программы\n\nПусто. Сохрани готовую программу или создай свою.";

  let t = "Мои программы\n";
  rows.forEach(r => {
    t += "\n• " + (r.is_favorite ? "★ " : "") + r.name + " (" + r.source + ")";
  });

  return t;
}

async function myTrainingsMenu(env, userId) {
  const list = await supabaseGet(env, "custom_programs?user_id=eq." + userId + "&archived=eq.false&select=id,name,is_favorite&order=is_favorite.desc,created_at.desc&limit=20");
  const rows = list.map(r => [{ text: (r.is_favorite ? "★ " : "") + r.name, callback_data: "myprog:" + r.id }]);

  rows.push([{ text: "Создать программу", callback_data: "custom_program" }]);
  rows.push([{ text: "Подобрать тренировку", callback_data: "pick" }]);
  rows.push([{ text: "Назад", callback_data: "trainings" }, { text: "Главное меню", callback_data: "menu" }]);

  return { inline_keyboard: rows };
}

async function customProgramText(env, id) {
  const row = await getProgramRow(env, id);
  if (!row) return "Программа не найдена.";
  return renderProgram(normalizeProgram(row.data || { name: row.name, days: [] }));
}

function customProgramMenu(id) {
  return {
    inline_keyboard: [
      [{ text: "Заниматься", callback_data: "pstart:c:" + id }],
      [{ text: "Редактировать", callback_data: "editprog:" + id }],
      [{ text: "Копировать", callback_data: "copyprog:" + id }],
      [{ text: "В избранное / убрать", callback_data: "favprog:" + id }],
      [{ text: "Архивировать", callback_data: "archiveprog:" + id }],
      [{ text: "Удалить", callback_data: "delprog:" + id }],
      [{ text: "Назад", callback_data: "my_trainings" }, { text: "Главное меню", callback_data: "menu" }]
    ]
  };
}

function pickPlaceMenu() {
  return {
    inline_keyboard: [
      [{ text: "Зал", callback_data: "pick:place:gym" }],
      [{ text: "Дом", callback_data: "pick:place:home" }],
      [{ text: "Назад", callback_data: "trainings" }, { text: "Главное меню", callback_data: "menu" }]
    ]
  };
}

function pickGoalMenu() {
  return {
    inline_keyboard: [
      [{ text: "Масса", callback_data: "pick:goal:mass" }],
      [{ text: "Сила", callback_data: "pick:goal:strength" }],
      [{ text: "Похудение", callback_data: "pick:goal:fatloss" }],
      [{ text: "Поддержание", callback_data: "pick:goal:maintain" }],
      [{ text: "Назад", callback_data: "trainings" }, { text: "Главное меню", callback_data: "menu" }]
    ]
  };
}

function pickLevelMenu() {
  return {
    inline_keyboard: [
      [{ text: "Новичок", callback_data: "pick:level:beginner" }],
      [{ text: "Средний", callback_data: "pick:level:middle" }],
      [{ text: "Опытный", callback_data: "pick:level:advanced" }],
      [{ text: "Назад", callback_data: "trainings" }, { text: "Главное меню", callback_data: "menu" }]
    ]
  };
}

function pickDaysMenu() {
  return {
    inline_keyboard: [
      [{ text: "2 дня", callback_data: "pick:days:2" }],
      [{ text: "3 дня", callback_data: "pick:days:3" }],
      [{ text: "4 дня", callback_data: "pick:days:4" }],
      [{ text: "5 дней", callback_data: "pick:days:5" }],
      [{ text: "6 дней", callback_data: "pick:days:6" }],
      [{ text: "Назад", callback_data: "trainings" }, { text: "Главное меню", callback_data: "menu" }]
    ]
  };
}

function pickTimeMenu() {
  return {
    inline_keyboard: [
      [{ text: "45 мин", callback_data: "pick:time:45" }],
      [{ text: "60 мин", callback_data: "pick:time:60" }],
      [{ text: "90 мин", callback_data: "pick:time:90" }],
      [{ text: "120 мин", callback_data: "pick:time:120" }],
      [{ text: "Назад", callback_data: "trainings" }, { text: "Главное меню", callback_data: "menu" }]
    ]
  };
}

function pickMuscleMenu(step) {
  return {
    inline_keyboard: [
      [{ text: "Не тренируем", callback_data: "pick:" + step + ":none" }],
      [{ text: "Чуть-чуть", callback_data: "pick:" + step + ":low" }],
      [{ text: "Нормально", callback_data: "pick:" + step + ":mid" }],
      [{ text: "Хорошо", callback_data: "pick:" + step + ":high" }],
      [{ text: "Назад", callback_data: "trainings" }, { text: "Главное меню", callback_data: "menu" }]
    ]
  };
}

async function handlePick(env, cq, data) {
  const [, step, value] = data.split(":");
  const userId = cq.from.id;
  const st = await getState(env, userId);
  const answers = st?.data || {};

  answers[step] = value;

  if (step === "place") {
    await setState(env, userId, "pick", answers);
    return editMessage(env, cq.message.chat.id, cq.message.message_id, "Какая цель?", pickGoalMenu());
  }

  if (step === "goal") {
    await setState(env, userId, "pick", answers);
    return editMessage(env, cq.message.chat.id, cq.message.message_id, "Какой стаж?", pickLevelMenu());
  }

  if (step === "level") {
    await setState(env, userId, "pick", answers);
    return editMessage(env, cq.message.chat.id, cq.message.message_id, "Сколько тренировок в неделю?", pickDaysMenu());
  }

  if (step === "days") {
    await setState(env, userId, "pick", answers);
    return editMessage(env, cq.message.chat.id, cq.message.message_id, "Сколько минут на тренировку?", pickTimeMenu());
  }

  if (step === "time") {
    await setState(env, userId, "pick", answers);
    return editMessage(env, cq.message.chat.id, cq.message.message_id, "Как тренируем ноги?", pickMuscleMenu("legs"));
  }

  const next = { legs: "chest", chest: "back", back: "shoulders", shoulders: "arms" }[step];

  if (next) {
    await setState(env, userId, "pick", answers);
    const names = { chest: "грудь", back: "спину", shoulders: "плечи", arms: "руки" };
    return editMessage(env, cq.message.chat.id, cq.message.message_id, "Как тренируем " + names[next] + "?", pickMuscleMenu(next));
  }

  const program = buildPickedProgram(answers);

  await supabaseInsert(env, "custom_programs", {
    user_id: userId,
    name: program.name,
    source: "picked",
    data: program
  });

  await clearState(env, userId);

  return editMessage(env, cq.message.chat.id, cq.message.message_id, "Подобрал и сохранил в Мои программы.\n\n" + renderProgram(normalizeProgram(program)), navMenu("my_trainings"));
}

function buildPickedProgram(a) {
  const daysCount = Number(a.days || 3);
  const place = a.place || "gym";
  const goal = a.goal || "maintain";
  const time = Number(a.time || 60);

  const chest = a.chest || "mid";
  const back = a.back || "mid";
  const legs = a.legs || "mid";
  const shoulders = a.shoulders || "mid";
  const arms = a.arms || "mid";

  const pool = {
    chest: ["Жим лёжа 3x8", "Жим на наклонной 3x10", "Бабочка 3x12", "Кроссовер 3x15"],
    back: ["Тяга верхнего блока 3x10", "Тяга горизонтального блока 3x10", "Пуловер 3x12", "Подтягивания 3x8"],
    legs: ["Приседания 3x8", "Платформа 3x12", "Разгибание на квадрицепс 3x12", "Задняя поверхность бедра в тренажёре 3x12"],
    shoulders: ["Жим гантелей сидя 3x10", "Подъём гантелей 3x15", "Бабочка на заднюю дельту 3x15"],
    arms: ["Подъём Z-грифа 3x12", "Скамья Скотта 3x12", "Разгибание на блоке 3x12", "Французский жим 3x10"],
    home: ["Отжимания 4x15", "Приседания 4x20", "Выпады 3x12", "Планка 3x60", "Скручивания 3x20"]
  };

  const intensity = { none: 0, low: 1, mid: 2, high: 3 };

  const selected = [];

  function add(groupName, level) {
    if (intensity[level] <= 0) return;
    const list = pool[groupName] || [];
    selected.push(...list.slice(0, intensity[level]));
  }

  if (place === "home") {
    selected.push(...pool.home);
  } else {
    add("legs", legs);
    add("chest", chest);
    add("back", back);
    add("shoulders", shoulders);
    add("arms", arms);
  }

  if (!selected.length) selected.push("Ходьба 30", "Планка 3x60", "Скручивания 3x20");

  if (goal === "strength") {
    selected.unshift("Жим лёжа 5x5", "Приседания 5x5");
  }

  if (goal === "fatloss") {
    selected.push("Велосипед 20", "Эллипс 20");
  }

  const perDay = Math.max(3, Math.min(7, Math.ceil(selected.length / daysCount)));
  const days = [];

  for (let i = 0; i < daysCount; i++) {
    const items = selected.slice(i * perDay, (i + 1) * perDay);
    if (items.length) days.push(items);
  }

  return {
    name: "Подобранная программа: " + daysCount + " дн/нед · " + time + " мин",
    days
  };
}

function analyticsMenu() {
  return {
    inline_keyboard: [
      [{ text: "Сводка", callback_data: "an_summary" }],
      [{ text: "По группам мышц", callback_data: "an_groups" }],
      [{ text: "Посещения зала", callback_data: "an_visits" }],
      [{ text: "Последние тренировки", callback_data: "an_last" }],
      [{ text: "Рекорды и 1ПМ", callback_data: "an_records" }],
      [{ text: "Энергия и результат", callback_data: "an_energy" }],
      [{ text: "Экспорт за 30 дней", callback_data: "an_export" }],
      [{ text: "Главное меню", callback_data: "menu" }]
    ]
  };
}

async function allSets(env, userId, limit) {
  return supabaseGet(env, "workout_sets?user_id=eq." + userId + "&select=exercise_id,exercise_name,weight,reps,created_at,session_id&order=created_at.desc&limit=" + (limit || 2000));
}

async function analyticsSummary(env, userId) {
  const visits = await supabaseGet(env, "gym_visits?user_id=eq." + userId + "&select=visited_at&order=visited_at.desc&limit=2000");
  const sets = await allSets(env, userId);

  let tonnage = 0;
  const freq = {};

  for (const s of sets) {
    tonnage += Number(s.weight) * Number(s.reps);
    freq[s.exercise_name] = (freq[s.exercise_name] || 0) + 1;
  }

  const fav = Object.keys(freq).sort((a, b) => freq[b] - freq[a])[0];
  const now = Date.now();
  const week = sets.filter(s => now - new Date(s.created_at).getTime() < 7 * 864e5).length;
  const month = sets.filter(s => now - new Date(s.created_at).getTime() < 30 * 864e5).length;
  const streak = computeStreak(visits.map(v => v.visited_at));

  return "Сводка\n\nПосещений всего: " + visits.length +
    "\nСерия подряд: " + streak + " дн." +
    "\nПодходов всего: " + sets.length +
    "\nПодходов за неделю: " + week +
    "\nПодходов за месяц: " + month +
    "\nОбщий тоннаж: " + fmtNum(tonnage) + " кг" +
    "\nЛюбимое упражнение: " + (fav || "—");
}

function groupOf(exId) {
  return EX[exId] ? EX[exId][1] : "Прочее";
}

async function analyticsGroups(env, cq) {
  const userId = cq.from.id;
  const sets = await allSets(env, userId);
  const now = Date.now();
  const recent = sets.filter(s => now - new Date(s.created_at).getTime() < 30 * 864e5);
  const byGroup = {};

  for (const s of recent) byGroup[groupOf(s.exercise_id)] = (byGroup[groupOf(s.exercise_id)] || 0) + 1;

  const labels = Object.keys(byGroup);
  if (!labels.length) return editMessage(env, cq.message.chat.id, cq.message.message_id, "За последние 30 дней подходов нет.", navMenu("analytics"));

  labels.sort((a, b) => byGroup[b] - byGroup[a]);

  let cap = "Подходы по группам за 30 дней\n";
  const max = byGroup[labels[0]];

  for (const l of labels) {
    const f = Math.round(byGroup[l] / max * 10);
    cap += "\n" + l + ": " + byGroup[l] + "  " + "▰".repeat(f) + "▱".repeat(10 - f);
  }

  const url = chartUrl({
    type: "bar",
    data: { labels, datasets: [{ label: "Подходы", data: labels.map(l => byGroup[l]), backgroundColor: "#4f8cff" }] },
    options: { plugins: { legend: { display: false }, title: { display: true, text: "Подходы по группам, 30 дней" } } }
  });

  return sendPhoto(env, cq.message.chat.id, url, cap, navMenu("analytics"));
}

async function analyticsVisits(env, cq) {
  const userId = cq.from.id;
  const visits = await supabaseGet(env, "gym_visits?user_id=eq." + userId + "&select=visited_at&order=visited_at.desc&limit=400");

  if (!visits.length) return editMessage(env, cq.message.chat.id, cq.message.message_id, "Посещений пока нет.", navMenu("analytics"));

  const weeks = {};
  const now = new Date();

  for (let i = 7; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i * 7);
    weeks[weekKey(d)] = 0;
  }

  for (const v of visits) {
    const k = weekKey(new Date(v.visited_at));
    if (k in weeks) weeks[k]++;
  }

  const labels = Object.keys(weeks);

  const url = chartUrl({
    type: "line",
    data: {
      labels,
      datasets: [{ label: "Посещения/нед", data: labels.map(l => weeks[l]), borderColor: "#22c55e", backgroundColor: "rgba(34,197,94,.2)", fill: true, tension: 0.3 }]
    },
    options: { plugins: { legend: { display: false }, title: { display: true, text: "Посещения зала по неделям" } } }
  });

  return sendPhoto(env, cq.message.chat.id, url, "Посещения зала за 8 недель", navMenu("analytics"));
}

async function lastWorkoutsText(env, userId) {
  const ses = await supabaseGet(env, "workout_sessions?user_id=eq." + userId + "&status=eq.ended&select=id,started_at,ended_at&order=ended_at.desc&limit=5");

  if (!ses.length) return "Завершённых тренировок пока нет.";

  let t = "Последние тренировки\n";

  for (const s of ses) {
    const sets = await supabaseGet(env, "workout_sets?session_id=eq." + s.id + "&user_id=eq." + userId + "&select=exercise_name,weight,reps");
    let ton = 0;
    const byEx = {};

    for (const x of sets) {
      ton += Number(x.weight) * Number(x.reps);
      byEx[x.exercise_name] = (byEx[x.exercise_name] || 0) + 1;
    }

    const mins = Math.max(1, Math.round((new Date(s.ended_at) - new Date(s.started_at)) / 60000));
    t += "\n" + fmtDate(s.started_at) + " · " + mins + " мин · " + fmtNum(ton) + " кг";

    for (const n in byEx) t += "\n• " + n + " ×" + byEx[n];

    t += "\n";
  }

  return t.trim();
}

async function recordsText(env, userId) {
  const sets = await allSets(env, userId);

  if (!sets.length) return "Рекордов пока нет — запиши первые подходы.";

  const best = {};

  for (const s of sets) {
    const orm = Number(s.weight) * (1 + Number(s.reps) / 30);
    const cur = best[s.exercise_name];

    if (!cur || Number(s.weight) > cur.w) {
      best[s.exercise_name] = { w: Number(s.weight), reps: Number(s.reps), orm: Math.max(orm, cur ? cur.orm : 0) };
    } else if (orm > cur.orm) {
      cur.orm = orm;
    }
  }

  let t = "Личные рекорды\nОценка 1ПМ: вес × (1 + повт/30)\n";

  for (const n of Object.keys(best)) {
    t += "\n• " + n + ": " + best[n].w + " кг × " + best[n].reps + " → 1ПМ ≈ " + Math.round(best[n].orm) + " кг";
  }

  return t;
}

async function energyText(env, userId) {
  const logs = await supabaseGet(
    env,
    "daily_logs?user_id=eq." + userId +
    "&select=energy,weight,created_at&order=created_at.desc&limit=30"
  );

  if (!logs.length) {
    return "Нет данных энергии за последние 30 дней.";
  }

  const avgEnergy =
    logs.reduce((s, x) => s + Number(x.energy || 0), 0) / logs.length;

  const firstWeight = Number(logs[logs.length - 1].weight || 0);
  const lastWeight = Number(logs[0].weight || 0);

  return (
    "Энергия и результат\n\n" +
    "Средняя энергия: " + avgEnergy.toFixed(1) + "/10\n" +
    "Изменение веса: " +
    (lastWeight - firstWeight >= 0 ? "+" : "") +
    (lastWeight - firstWeight).toFixed(1) +
    " кг"
  );
}

async function exportText(env, userId) {
  const sets = await supabaseGet(
    env,
    "workout_sets?user_id=eq." + userId +
    "&select=exercise_name,weight,reps,created_at" +
    "&order=created_at.desc&limit=1000"
  );

  const now = Date.now();

  const recent = sets.filter(
    s => now - new Date(s.created_at).getTime() < 30 * 864e5
  );

  let txt = "Экспорт за 30 дней\n\n";

  for (const s of recent) {
    txt +=
      fmtDate(s.created_at) +
      " | " +
      s.exercise_name +
      " | " +
      s.weight +
      " кг × " +
      s.reps +
      "\n";
  }

  return txt;
}

async function nutritionText(env, userId) {
  const rows = await supabaseGet(
    env,
    "daily_logs?user_id=eq." + userId +
    "&select=weight,created_at&order=created_at.desc&limit=14"
  );

  if (!rows.length) {
    return (
      "Питание\n\n" +
      "Недостаточно данных. Записывай вес ежедневно."
    );
  }

  const current = Number(rows[0].weight || 0);

  return (
    "Питание\n\n" +
    "Текущий вес: " + current + " кг\n\n" +
    "Белки: " + Math.round(current * 2) + " г\n" +
    "Жиры: " + Math.round(current * 0.8) + " г\n" +
    "Углеводы: " + Math.round(current * 4) + " г"
  );
}

async function friendsText(env, userId) {
  const rows = await supabaseGet(
    env,
    "friends?user_id=eq." + userId +
    "&select=friend_name&limit=100"
  );

  if (!rows.length) {
    return "Друзья пока не добавлены.";
  }

  return (
    "Друзья\n\n" +
    rows.map(x => "• " + x.friend_name).join("\n")
  );
}

async function sendMessage(env, chatId, text, keyboard) {
  return tg(env, "sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    reply_markup: keyboard
  });
}

async function editMessage(env, chatId, messageId, text, keyboard) {
  return tg(env, "editMessageText", {
    chat_id: chatId,
    message_id: messageId,
    text,
    parse_mode: "HTML",
    reply_markup: keyboard
  });
}

async function answerCb(env, id, text) {
  return tg(env, "answerCallbackQuery", {
    callback_query_id: id,
    text: text || ""
  });
}

async function sendPhoto(env, chatId, photo, caption, keyboard) {
  return tg(env, "sendPhoto", {
    chat_id: chatId,
    photo,
    caption,
    reply_markup: keyboard
  });
}

async function tg(env, method, body) {
  return fetch(
    "https://api.telegram.org/bot" +
      env.BOT_TOKEN +
      "/" +
      method,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }
  );
}

async function supabaseGet(env, path) {
  const r = await fetch(
    env.SUPABASE_URL +
      "/rest/v1/" +
      path,
    {
      headers: {
        apikey: env.SUPABASE_KEY,
        Authorization:
          "Bearer " + env.SUPABASE_KEY
      }
    }
  );

  return r.json();
}

async function supabaseInsert(env, table, data) {
  return fetch(
    env.SUPABASE_URL +
      "/rest/v1/" +
      table,
    {
      method: "POST",
      headers: {
        apikey: env.SUPABASE_KEY,
        Authorization:
          "Bearer " + env.SUPABASE_KEY,
        "Content-Type": "application/json",
        Prefer: "return=representation"
      },
      body: JSON.stringify(data)
    }
  );
}

async function supabasePatch(env, path, data) {
  return fetch(
    env.SUPABASE_URL +
      "/rest/v1/" +
      path,
    {
      method: "PATCH",
      headers: {
        apikey: env.SUPABASE_KEY,
        Authorization:
          "Bearer " + env.SUPABASE_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }
  );
}

async function getState(env, userId) {
  const rows = await supabaseGet(
    env,
    "user_states?user_id=eq." +
      userId +
      "&select=*&limit=1"
  );

  return rows[0] || null;
}

async function setState(env, userId, state, data) {
  await supabasePatch(
    env,
    "user_states?user_id=eq." + userId,
    {
      state,
      data
    }
  );
}

async function clearState(env, userId) {
  await supabasePatch(
    env,
    "user_states?user_id=eq." + userId,
    {
      state: null,
      data: null
    }
  );
}
async function answerCallback(env, callbackId) {
  return answerCb(env, callbackId);
}