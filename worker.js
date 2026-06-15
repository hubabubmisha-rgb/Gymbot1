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

        if