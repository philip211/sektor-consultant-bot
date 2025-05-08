import { Telegraf } from 'telegraf';
import { BotContext } from '../middleware/session.middleware.js';
import { logger } from '../../utils/logger.js';
import { config } from '../../config/env.js';
import { formatInquiry } from '../../services/request-formatter.js';

export const registerBudgetScene = (bot: Telegraf<BotContext>) => {
  const budgetOptions = [
    'до 100 000 ₽', 
    '100 000 - 300 000 ₽', 
    '300 000 - 600 000 ₽', 
    'от 600 000 ₽',
    'Не определен'
  ];
  
  bot.hears(budgetOptions, async (ctx) => {
    if (ctx.session.currentScene !== 'budget') return;
    
    ctx.session.inquiryData.budget = ctx.message.text;
    logger.info(`User ${ctx.from.id} set budget: ${ctx.session.inquiryData.budget}`);
    
    ctx.session.currentScene = 'summary';
    
    const summary = formatInquiry(ctx.session.inquiryData);
    
    await ctx.reply(`Спасибо за информацию! Вот данные вашей заявки:

${summary}

Всё верно?`, {
      reply_markup: {
        keyboard: [
          [{ text: '✅ Подтвердить' }],
          [{ text: '❌ Отменить' }]
        ],
        resize_keyboard: true
      }
    });
  });
};
