import { Telegraf } from 'telegraf';
import { BotContext } from '../middleware/session.middleware.js';
import { logger } from '../../utils/logger.js';

export const registerInquiryScene = (bot: Telegraf<BotContext>) => {
  bot.on('text', async (ctx) => {
    if (ctx.session.currentScene !== 'inquiry') return;
    
    if (!ctx.session.inquiryData.name) {
      ctx.session.inquiryData.name = ctx.message.text;
      logger.info(`User ${ctx.from.id} set name: ${ctx.session.inquiryData.name}`);
      await ctx.reply(`Приятно познакомиться, ${ctx.session.inquiryData.name}! Оставьте, пожалуйста, ваш контакт (телефон или email):`);
      return;
    }
    
    if (!ctx.session.inquiryData.contact) {
      ctx.session.inquiryData.contact = ctx.message.text;
      logger.info(`User ${ctx.from.id} set contact: ${ctx.session.inquiryData.contact}`);
      
      ctx.session.currentScene = 'goal';
      await ctx.reply('Какова цель вашего проекта?', {
        reply_markup: {
          keyboard: [
            [{ text: 'Инфо-бот' }, { text: 'Бизнес-бот' }],
            [{ text: 'Бот для продаж' }, { text: 'Развлекательный бот' }],
            [{ text: 'Другое' }],
            [{ text: '⬅️ Назад' }, { text: '❌ Отменить' }]
          ],
          resize_keyboard: true
        }
      });
      return;
    }
  });
};
