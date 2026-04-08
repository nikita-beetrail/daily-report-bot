# Настройка Telegram бота

## Шаг 1: Создай бота
1. Открой Telegram, найди @BotFather
2. Отправь команду /newbot
3. Придумай имя бота (например: «Отчёты PM»)
4. Придумай username (например: pm_daily_reports_bot)
5. BotFather даст тебе токен — сохрани его

## Шаг 2: Узнай chat_id руководителя
1. Руководитель должен написать твоему боту любое сообщение (например /start)
2. Открой в браузере:
   https://api.telegram.org/bot<ТВОЙ_ТОКЕН>/getUpdates
3. Найди в ответе поле "chat": {"id": XXXXXXXX}
4. Это и есть chat_id — сохрани его

## Шаг 3: Добавь в .env файл
VITE_TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
VITE_TELEGRAM_CHAT_ID=987654321

## Шаг 4: Проверь
Открой в браузере:
https://api.telegram.org/bot<ТОКЕН>/sendMessage?chat_id=<CHAT_ID>&text=Тест

Если руководитель получил сообщение «Тест» — всё работает!