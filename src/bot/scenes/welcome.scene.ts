import { Telegraf } from 'telegraf';
import { BotContext } from '../middleware/session.middleware.js';
import { logger } from '../../utils/logger.js';

export const registerWelcomeScene = (bot: Telegraf<BotContext>) => {
  bot.hears('🔍 Оставить заявку', async (ctx) => {
    logger.info(`User ${ctx.from.id} chose to make an inquiry`);
    ctx.session.currentScene = 'inquiry';
    ctx.session.inquiryData = {
      name: '',
      contact: '',
      projectType: '',
      projectDescription: '',
      budget: '',
      features: '',
      timeline: ''
    };
    await ctx.reply('Давайте оформим вашу заявку. Как к вам обращаться?');
  });

  bot.hears('❓ Часто задаваемые вопросы', async (ctx) => {
    logger.info(`User ${ctx.from.id} chose FAQ`);
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

  bot.hears('📞 Связаться с менеджером', async (ctx) => {
    logger.info(`User ${ctx.from.id} chose to contact a manager`);
    await ctx.reply('Наш менеджер свяжется с вами в ближайшее время. Пожалуйста, оставьте ваш контакт (телефон или почту):');
    ctx.session.currentScene = 'contact';
  });
};
