export default {
  async fetch(request, env) {
    if (request.method === "GET") {
      return new Response("Gym Bot v0.3 работает 🚀");
    }

    if (request.method === "POST") {
      const update = await request.json();

      if (update.message) {
        const chatId = update.message.chat.id;
        const text = update.message.text || "";

        if (text === "/start" || text.toLowerCase() === "меню") {
          await sendMessage(env, chatId, "🏋️ Gym Bot v0.3\n\nГлавное меню:", mainMenu());
        } else {
          await sendMessage(env, chatId, "Пока управляй ботом через кнопки 👇", mainMenu());
        }
      }

      if (update.callback_query) {
        const cq = update.callback_query;
        const chatId = cq.message.chat.id;
        const msgId = cq.message.message_id;
        const data = cq.data;

        await answerCallback(env, cq.id);

        if (data === "menu") {
          await editMessage(env, chatId, msgId, "🏋️ Главное меню:", mainMenu());
        }

        if (data === "trainings") {
          await editMessage(env, chatId, msgId, "🏋️ Тренировки\n\nВыбери действие:", trainingsMenu());
        }

        if (data === "gym_checkin") {
          await editMessage(env, chatId, msgId,
            "✅ Красавчик, ты в зале!\n\nПозже это будет сохраняться в календарь посещений.",
            navMenu("trainings")
          );
        }

        if (data === "free_workout") {
          await editMessage(env, chatId, msgId, "🆓 Свободная тренировка\n\nВыбери группу мышц:", muscleGroupsMenu());
        }

        if (data === "log_result") {
          await editMessage(env, chatId, msgId,
            "✍️ Записать результат\n\nПока запись результата добавим в следующей версии.\n\nФормат будет такой:\n100 кг × 5",
            navMenu("trainings")
          );
        }

        if (data === "programs") {
          await editMessage(env, chatId, msgId,
            "📋 Программы тренировок\n\nСкоро тут будут:\n• Фуллбади\n• Сплиты\n• Программы с упором\n• Свои программы\n• Тренировка по программе",
            navMenu("menu")
          );
        }

        if (data === "analytics") {
          await editMessage(env, chatId, msgId,
            "📊 Аналитика\n\nСкоро тут будут:\n• календарь посещений\n• графики\n• тоннаж\n• любимое упражнение\n• подходы по группам мышц",
            navMenu("menu")
          );
        }

        if (data === "friends") {
          await editMessage(env, chatId, msgId,
            "👥 Друзья\n\nСкоро тут будут:\n• добавить друга по ID\n• разрешить смотреть тренировки\n• сообщение друзьям",
            navMenu("menu")
          );
        }

        if (data === "profile") {
          await editMessage(env, chatId, msgId,
            "👤 Профиль\n\nСкоро тут будут:\n• рост\n• вес\n• возраст\n• пол\n• уровень\n• приватность",
            navMenu("menu")
          );
        }

        if (data === "food_supps") {
          await editMessage(env, chatId, msgId, "🍽 Питание/БАДы\n\nВыбери раздел:", foodSuppsMenu());
        }

        if (data === "food") {
          await editMessage(env, chatId, msgId, nutritionText(), navMenu("food_supps"));
        }

        if (data === "supps") {
          await editMessage(env, chatId, msgId, "💊 Пей креатин, чувак. Пока на этом всё 💪", navMenu("food_supps"));
        }

        if (data.startsWith("group:")) {
          const group = data.replace("group:", "");
          await editMessage(env, chatId, msgId, groupTitle(group) + "\n\nВыбери упражнение:", exercisesMenu(group));
        }

        if (data.startsWith("ex:")) {
          const ex = data.replace("ex:", "");
          await editMessage(env, chatId, msgId, exerciseText(ex), exerciseMenu());
        }

        if (data === "timer_90") {
          await editMessage(env, chatId, msgId,
            "⏱ Таймер 90 секунд\n\nПока таймер будет текстовый. В следующей версии сделаем нормальное уведомление.",
            navMenu("free_workout")
          );
        }
      }

      return new Response("ok");
    }

    return new Response("Method not allowed", { status: 405 });
  },
};

function mainMenu() {
  return {
    inline_keyboard: [
      [{ text: "🏋️ Тренировки", callback_data: "trainings" }],
      [{ text: "📋 Программы тренировок", callback_data: "programs" }],
      [{ text: "📊 Аналитика", callback_data: "analytics" }],
      [{ text: "👥 Друзья", callback_data: "friends" }],
      [{ text: "👤 Профиль", callback_data: "profile" }],
      [{ text: "🍽 Питание/БАДы", callback_data: "food_supps" }],
    ],
  };
}

function trainingsMenu() {
  return {
    inline_keyboard: [
      [{ text: "✅ Я в зале", callback_data: "gym_checkin" }],
      [{ text: "🆓 Свободная тренировка", callback_data: "free_workout" }],
      [{ text: "✍️ Записать результат", callback_data: "log_result" }],
      [{ text: "📋 Тренировка по программе", callback_data: "programs" }],
      [{ text: "🏠 В меню", callback_data: "menu" }],
    ],
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
      [{ text: "⬅️ Назад", callback_data: "trainings" }, { text: "🏠 В меню", callback_data: "menu" }],
    ],
  };
}

function exercisesMenu(group) {
  const data = {
    chest: ["Жим лёжа", "Жим на наклонной", "Жим в тренажёре", "Бабочка"],
    back: ["Тяга верхнего блока", "Тяга горизонтального блока", "Пуловер"],
    legs: ["Приседания", "Платформа", "Разгибание ног", "Икры"],
    shoulders: ["Подъём гантелей", "Разгибание в кроссовере", "Бабочка на заднюю дельту"],
    arms: ["Подъём Z-грифа", "Скамья Скотта", "Разгибание на блоке", "Молотки"],
    abs: ["Скручивания"],
    cardio: ["Велосипед", "Ходьба", "Бег", "Эллипс"],
  };

  const list = data[group] || [];
  const buttons = list.map((x) => [{ text: x, callback_data: "ex:" + x }]);
  buttons.push([{ text: "⬅️ Назад", callback_data: "free_workout" }, { text: "🏠 В меню", callback_data: "menu" }]);
  return { inline_keyboard: buttons };
}

function groupTitle(group) {
  const titles = {
    chest: "💥 Грудь",
    back: "🔙 Спина",
    legs: "🦵 Ноги",
    shoulders: "🏋️ Плечи",
    arms: "💪 Руки",
    abs: "🔥 Пресс",
    cardio: "🚴 Кардио",
  };
  return titles[group] || "Группа";
}

function exerciseText(name) {
  return "🏋️ " + name + "\n\n" +
    "Скоро тут будет:\n" +
    "• фото выполнения\n" +
    "• описание техники\n" +
    "• основные мышцы\n" +
    "• прошлый результат\n" +
    "• запись нового результата";
}

function exerciseMenu() {
  return {
    inline_keyboard: [
      [{ text: "✍️ Записать результат", callback_data: "log_result" }],
      [{ text: "⏱ Таймер 90 сек", callback_data: "timer_90" }],
      [{ text: "📊 История", callback_data: "analytics" }],
      [{ text: "⬅️ Назад", callback_data: "free_workout" }, { text: "🏠 В меню", callback_data: "menu" }],
    ],
  };
}

function foodSuppsMenu() {
  return {
    inline_keyboard: [
      [{ text: "🍽 Питание", callback_data: "food" }],
      [{ text: "💊 БАДы", callback_data: "supps" }],
      [{ text: "⬅️ Назад", callback_data: "menu" }, { text: "🏠 В меню", callback_data: "menu" }],
    ],
  };
}

function navMenu(backTo) {
  return {
    inline_keyboard: [
      [{ text: "⬅️ Назад", callback_data: backTo }, { text: "🏠 В меню", callback_data: "menu" }],
    ],
  };
}

function nutritionText() {
  return "🍽 ПИТАНИЕ — без занудства\n\n" +
    "Слушай сюда, чемпион 🦾\n\n" +
    "🥩 Белок — это святое.\n" +
    "2+ грамма белка на кг твоего веса в сутки.\n\n" +
    "🥑 Жиры — нужны, но без фанатизма.\n" +
    "Около 1–1.2 г на кг веса.\n\n" +
    "🍚 Углеводы — твой рубильник «сушка / масса».\n" +
    "• Сушка → углеводы вниз 📉\n" +
    "• Масса → углеводы вверх 📈\n\n" +
    "😴 Сон.\n" +
    "Спи 7–9 часов. Мышцы растут не в зале, а пока ты спишь 💪";
}

async function sendMessage(env, chatId, text, keyboard) {
  const payload = { chat_id: chatId, text };
  if (keyboard) payload.reply_markup = keyboard;

  await fetch("https://api.telegram.org/bot" + env.BOT_TOKEN + "/sendMessage", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
}

async function editMessage(env, chatId, msgId, text, keyboard) {
  const payload = {
    chat_id: chatId,
    message_id: msgId,
    text,
  };

  if (keyboard) payload.reply_markup = keyboard;

  await fetch("https://api.telegram.org/bot" + env.BOT_TOKEN + "/editMessageText", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
}

async function answerCallback(env, callbackId) {
  await fetch("https://api.telegram.org/bot" + env.BOT_TOKEN + "/answerCallbackQuery", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackId }),
  });
}