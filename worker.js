export default {
  async fetch(request, env) {
    if (request.method === "GET") {
      return new Response("Gym Bot работает через GitHub 🚀");
    }

    if (request.method === "POST") {
      const update = await request.json();

      if (update.message) {
        const chatId = update.message.chat.id;
        const text = update.message.text || "";

        if (text === "/start") {
          await sendMessage(env, chatId, "🏋️ Привет! Это Gym Bot 💪\n\nГлавное меню:", mainMenu());
        } else {
          await sendMessage(env, chatId, "Главное меню:", mainMenu());
        }
      }

      if (update.callback_query) {
        const cq = update.callback_query;
        const chatId = cq.message.chat.id;
        const data = cq.data;

        await answerCallback(env, cq.id);

        if (data === "trainings") {
          await sendMessage(env, chatId, "🏋️ Тренировки\n\nСкоро тут будет:\n• Я в зале\n• Свободная тренировка\n• Записать результат\n• Тренировка по программе");
        }

        if (data === "programs") {
          await sendMessage(env, chatId, "📋 Программы тренировок\n\nСкоро добавим фуллбади, сплиты и свои программы.");
        }

        if (data === "analytics") {
          await sendMessage(env, chatId, "📊 Аналитика\n\nСкоро тут будут графики, календарь и статистика.");
        }

        if (data === "friends") {
          await sendMessage(env, chatId, "👥 Друзья\n\nСкоро добавим друзей по ID.");
        }

        if (data === "profile") {
          await sendMessage(env, chatId, "👤 Профиль\n\nСкоро тут будут рост, вес, возраст, уровень и настройки приватности.");
        }

        if (data === "food_supps") {
          await sendMessage(env, chatId, "🍽 Питание/БАДы\n\nВыбери раздел:", foodSuppsMenu());
        }

        if (data === "food") {
          await sendMessage(env, chatId, nutritionText());
        }

        if (data === "supps") {
          await sendMessage(env, chatId, "💊 Пей креатин, чувак. Пока на этом всё 💪");
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

function foodSuppsMenu() {
  return {
    inline_keyboard: [
      [{ text: "🍽 Питание", callback_data: "food" }],
      [{ text: "💊 БАДы", callback_data: "supps" }],
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

async function answerCallback(env, callbackId) {
  await fetch("https://api.telegram.org/bot" + env.BOT_TOKEN + "/answerCallbackQuery", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackId }),
  });
}