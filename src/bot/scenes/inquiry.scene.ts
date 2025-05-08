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
      await ctx.reply('Выберите тип проекта:', {
        reply_markup: {
          keyboard: [
            [{ text: 'Веб-приложение' }, { text: 'Мобильное приложение' }],
            [{ text: 'Десктопное приложение' }, { text: 'AI-решение' }],
            [{ text: 'Другое' }]
          ],
          resize_keyboard: true
        }
      });
      return;
    }
    
    if (!ctx.session.inquiryData.projectType) {
      ctx.session.inquiryData.projectType = ctx.message.text;
      logger.info(`User ${ctx.from.id} set project type: ${ctx.session.inquiryData.projectType}`);
      await ctx.reply('Опишите ваш проект подробнее:');
      return;
    }
    
    if (!ctx.session.inquiryData.projectDescription) {
      ctx.session.inquiryData.projectDescription = ctx.message.text;
      logger.info(`User ${ctx.from.id} set project description`);
      ctx.session.currentScene = 'budget';
      await ctx.reply('Каков примерный бюджет вашего проекта?', {
        reply_markup: {
          keyboard: [
            [{ text: 'до 100 000 ₽' }, { text: '100 000 - 300 000 ₽' }],
            [{ text: '300 000 - 600 000 ₽' }, { text: 'от 600 000 ₽' }],
            [{ text: 'Не определен' }]
          ],
          resize_keyboard: true
        }
      });
      return;
    }
  });
};
