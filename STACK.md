# Технологический стек

## Frontend
- React 18+
- TypeScript
- Tailwind CSS (стилизация)
- React Router (навигация)
- React Hook Form (работа с формами)

## Backend / База данных
- Supabase (база данных + авторизация)
  - Таблица: reports (отчёты)
  - Таблица: projects (список проектов)
  - Таблица: tasks (задачи внутри отчёта)

## Отправка отчётов
- Telegram Bot API
- HTTP запросы через fetch / axios
- Метод: sendMessage с parse_mode: "Markdown"

## Деплой
- Vercel (фронтенд)
- Supabase (бэкенд, бесплатный тариф)

## Переменные окружения (.env)
- VITE_SUPABASE_URL — URL Supabase проекта
- VITE_SUPABASE_ANON_KEY — публичный ключ Supabase
- VITE_TELEGRAM_BOT_TOKEN — токен Telegram бота
- VITE_TELEGRAM_CHAT_ID — chat_id руководителя