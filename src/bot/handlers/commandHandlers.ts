import { Telegraf } from 'telegraf';
import { BotContext } from '../middleware/session.middleware.js';
import { logger } from '../../utils/logger.js';

export const registerCommandHandlers = (bot: Telegraf<BotContext>) => {
  bot.command('start', async (ctx) => {
    logger.info(`User ${ctx.from.id} started the bot`);
    ctx.session.currentScene = 'welcome';
    await ctx.reply('Добро пожаловать в бота-консультанта компании "Сектор"! Чем я могу помочь вам сегодня?', {
      reply_markup: {
        keyboard: [
          [{ text: '🔍 Оставить заявку' }],
          [{ text: '❓ Часто задаваемые вопросы' }],
          [{ text: '📞 Связаться с менеджером' }]
        ],
        resize_keyboard: true
      }
    });
  });

  bot.command('help', async (ctx) => {
    logger.info(`User ${ctx.from.id} requested help`);
    await ctx.reply(`
Я бот-консультант компании "Сектор". Вот что я могу:

/start - Начать общение
/faq - Часто задаваемые вопросы
/inquiry - Оставить заявку

Вы также можете использовать кнопки в меню для навигации.
    `);
  });

  bot.command('faq', async (ctx) => {
    logger.info(`User ${ctx.from.id} accessed FAQ`);
    ctx.session.currentScene = 'faq';
    await ctx.reply('Выберите тему, по которой у вас есть вопрос:', {
      reply_markup: {
        keyboard: [
          [{ text: '💻 Веб-разработка' }, { text: '📱 Мобильная разработка' }],
          [{ text: '🤖 AI-решения' }, { text: '💰 Стоимость услуг' }],
          [{ text: '⬅️ Назад' }]
        ],
        resize_keyboard: true
      }
    });
  });

  bot.command('inquiry', async (ctx) => {
    logger.info(`User ${ctx.from.id} started inquiry`);
    ctx.session.currentScene = 'inquiry';
    ctx.session.inquiryData = {
      name: '',
      contact: '',
      projectType: '',
      projectDescription: '',
      budget: ''
    };
    await ctx.reply('Давайте оформим вашу заявку. Как к вам обращаться?');
  });
};
