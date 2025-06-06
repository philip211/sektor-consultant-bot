# Sektor Consultant Bot

Telegram-бот консультант с интеграцией OpenAI для компании "Сектор". Бот ведет диалог с клиентом, выявляет его цели и задачи, объясняет процесс разработки, консультирует по функциям, стоимости и срокам, а затем формирует и отправляет финальную заявку разработчику.

## Функциональность

- Ведение живого диалога на естественном языке
- Сценарное выявление задач клиента
- Интеллектуальные подсказки (с помощью OpenAI)
- Формирование структурированной заявки
- Отправка заявки администратору

## Установка и запуск

### Требования

- Node.js 16+
- npm или yarn

### Установка зависимостей

```bash
npm install
```

### Настройка окружения

Создайте файл `.env` в корне проекта со следующими переменными:

```
BOT_TOKEN=ваш_токен_телеграм_бота
OPENAI_API_KEY=ваш_ключ_api_openai
ADMIN_CHAT_ID=id_чата_администратора
MODE=development
```

### Запуск в режиме разработки

```bash
npm run dev
```

### Сборка и запуск в production режиме

```bash
npm run build
npm start
```

Для запуска с помощью PM2:

```bash
npm run build
pm2 start ecosystem.config.js
```

## Структура проекта

```
src/
├── bot/
│   ├── index.ts - основной файл бота
│   ├── middleware/ - middleware для бота
│   ├── handlers/ - обработчики команд
│   └── scenes/ - сцены диалога
├── services/ - сервисы для работы с API
├── config/ - конфигурация
├── utils/ - утилиты
└── types/ - типы TypeScript
```

## Сцены диалога

- **welcome.scene.ts** - приветствие, знакомство
- **goal.scene.ts** - цель проекта (инфо-бот, бизнес, продажи, развлечения)
- **features.scene.ts** - сбор функционала, описание, нужны ли WebApp/AI/CRM
- **budget.scene.ts** - бюджет и сроки, кнопки + открытый ответ
- **summary.scene.ts** - генерация и подтверждение итоговой заявки

## Лицензия

MIT
