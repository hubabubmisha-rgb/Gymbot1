export default {
  async fetch(request, env) {
    if (request.method === "GET") {
      return new Response("Gym Bot v0.2 работает 🚀");
    }

    if (request.method === "POST") {
      const update = await request.json();

      if (update.message) {
        const chatId = update.message.chat.id;
        const text = update.message.text || "";

        if (text === "/start" || text === "меню") {
          await sendMessage(env, chatId, "🏋️ Gym Bot v0.2\n\nГлавное меню:", mainMenu());
        } else {
          await sendMessage(env, chatId, "Я пока понимаю только кнопки 😄\n\nГлавное меню:", mainMenu());
        }
      }

      if (update.callback_query) {
        const cq = update.callback_query;
        const chatId = cq.message.chat.id;
        const data = cq.data;

        await answerCallback(env, cq.id);

        if (data === "menu") {
          await sendMessage(env, chatId, "🏋️ Главное меню:", mainMenu());
        }

        if (data === "trainings") {
          await sendMessage(env, chatId, "🏋️ Тренировки\n\nВыбери действие:", trainingsMenu());
        }

        if (data === "gym_checkin") {
          await sendMessage(env, chatId, "✅ Красавчик, ты в зале!\n\nПозже это будет сохраняться в календарь посещений.");
        }

        if (data === "free_workout") {
          await sendMessage(env, chatId, "🆓 Свободная тренировка\n\nВыбери группу мышц:", muscleGroupsMenu());
        }

        if (data === "log_result") {
          await sendMessage(env, chatId, "✍️ Запись результата\n\nПока выбери упражнение через свободную тренировку.\n\nФормат потом будет такой:\n100 кг × 5");
        }

        if (data === "programs") {
          await sendMessage(env, chatId, "📋 Программы тренировок\n\nСкоро добавим:\n• Фуллбади\n• Сплиты\n• Свои программы\n• Тренировку по программе", backMenu());
        }

        if (data === "analytics") {
          await sendMessage(env, chatId, "📊 Аналитика\n\nСкоро тут будут:\n• посещения\n• тоннаж\n• любимое упражнение\n• подходы по группам мышц\n• графики", backMenu());
        }

        if (data === "friends") {
          await sendMessage(env, chatId, "👥 Друзья\n\nСкоро добавим:\n• добавить друга по ID\n• разрешение смотреть тренировки\n• сообщение друзьям", backMenu());
        }

        if (data === "profile") {
          await sendMessage(env, chatId, "👤 Профиль\n\nСкоро тут будут:\n• рост\n• вес\n• возраст\n• пол\n• уровень\n• приватность", backMenu());
        }

        if (data === "food_supps") {
          await sendMessage(env, chatId, "🍽 Питание/БАДы\n\nВыбери раздел:", foodSuppsMenu());
        }

        if (data === "food") {
          await sendMessage(env, chatId, nutritionText(), backMenu());
        }

        if (data === "supps") {
          await sendMessage(env, chatId, "💊 Пей креатин, чувак. Пока на этом всё 💪", backMenu());
        }

        if (data.startsWith("group:")) {
          const group = data.replace("group:", "");
          await sendMessage(env, chatId, "Выбери упражнение:", exercisesMenu(group));
        }

        if (data.startsWith("ex:")) {
          const ex = data.replace("ex:", "");
          await sendMessage(env, chatId, exerciseText(ex), exerciseMenu());
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
      [{ text: "⬅️ В меню", callback_data: "menu" }],
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
      [{ text: "⬅️ В меню", callback_data: "menu" }],
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
  buttons.push([{ text: "⬅️ Назад", callback_data: "free_workout" }]);
  return { inline_keyboard: buttons };
}

function exerciseText(name) {
  return "🏋️ " + name + "\n\n" +
    "Описание и фото добавим в следующей версии.\n\n" +
    "Позже тут будет:\n" +
    "• картинка выполнения\n" +
    "• мышцы\n" +
    "• техника\n" +
    "• прошлый результат\n" +
    "• запись нового результата";
}

function exerciseMenu() {
  return {
    inline_keyboard: [
      [{ text: "✍️ Записать результат", callback_data: "log_result" }],
      [{ text: "⏱ Таймер 90 сек", callback_data: "timer_90" }],
      [{ text: "📊 История", callback_data: "analytics" }],
      [{ text: "⬅️ В меню", callback_data: "menu" }],
    ],
  };
}

function foodSuppsMenu() {
  return {
    inline_keyboard: [
      [{ text: "🍽 Питание", callback_data: "food" }],
      [{ text: "💊 БАДы", callback_data: "supps" }],
      [{ text: "⬅️ В меню", callback_data: "menu" }],
    ],
  };
}

function backMenu() {
  return {
    inline_keyboard: [
      [{ text: "⬅️ В меню", callback_data: "menu" }],
    ],
  };
}

function nutritionText() {
  return "🍽 ПИТАНИЕ — без занудства\n\n" +
    "Слушай сюда, чемпион 🦾\n\n" +
    "🥩 Белок — это святое.\n" +
    "2+ грамма белка на кг твоего веса в сутки. Без него ты не растёшь, а просто потеешь в зале за компанию.\n\n" +
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

async function answerCallback(env, callbackId) {
  await fetch("https://api.telegram.org/bot" + env.BOT_TOKEN + "/answerCallbackQuery", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackId }),
  });
}