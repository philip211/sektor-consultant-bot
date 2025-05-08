import { Telegraf } from 'telegraf';
import { BotContext } from '../middleware/session.middleware.js';
import { generateResponse } from '../../services/openai.service.js';
import { logger } from '../../utils/logger.js';

export const registerFaqScene = (bot: Telegraf<BotContext>) => {
  const topics = {
    '💻 Веб-разработка': 'Расскажи о веб-разработке в компании "Сектор", какие технологии используются, подходы, опыт и примеры',
    '📱 Мобильная разработка': 'Расскажи о мобильной разработке в компании "Сектор", какие платформы поддерживаются, технологии и примеры',
    '🤖 AI-решения': 'Расскажи о AI-решениях в компании "Сектор", какие технологии используются, возможности и примеры',
    '💰 Стоимость услуг': 'Расскажи о стоимости услуг в компании "Сектор", какие есть тарифы, от чего зависит цена'
  };

  Object.entries(topics).forEach(([topic, prompt]) => {
    bot.hears(topic, async (ctx) => {
      if (ctx.session.currentScene !== 'faq') return;
      
      logger.info(`User ${ctx.from.id} asked about ${topic}`);
      await ctx.reply('Генерирую ответ...');
      
      try {
        const response = await generateResponse(prompt);
        await ctx.reply(response, {
          parse_mode: 'Markdown',
          reply_markup: {
            keyboard: [
              [{ text: '💻 Веб-разработка' }, { text: '📱 Мобильная разработка' }],
              [{ text: '🤖 AI-решения' }, { text: '💰 Стоимость услуг' }],
              [{ text: '⬅️ Назад' }]
            ],
            resize_keyboard: true
          }
        });
      } catch (error) {
        logger.error('Error generating FAQ response', error);
        await ctx.reply('Извините, произошла ошибка при генерации ответа. Пожалуйста, попробуйте позже.');
      }
    });
  });

  bot.hears('⬅️ Назад', async (ctx) => {
    if (ctx.session.currentScene !== 'faq') return;
    
    logger.info(`User ${ctx.from.id} returned to welcome screen`);
    ctx.session.currentScene = 'welcome';
    await ctx.reply('Чем я могу помочь вам сегодня?', {
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
};
