import { Telegraf } from 'telegraf';
import { BotContext } from '../middleware/session.middleware.js';
import { logger } from '../../utils/logger.js';

export const registerGoalScene = (bot: Telegraf<BotContext>) => {
  bot.on('text', async (ctx) => {
    if (ctx.session.currentScene !== 'goal') return;
    
    if (!ctx.session.inquiryData.projectType) {
      ctx.session.inquiryData.projectType = ctx.message.text;
      logger.info(`User ${ctx.from.id} set project goal: ${ctx.session.inquiryData.projectType}`);
      
      ctx.session.currentScene = 'features';
      await ctx.reply(`Отлично! Вы выбрали цель: ${ctx.session.inquiryData.projectType}. 

Теперь расскажите, какие функции должен иметь ваш бот?`, {
        reply_markup: {
          keyboard: [
            [{ text: 'Ответы на вопросы' }, { text: 'Прием заказов' }],
            [{ text: 'Интеграция с CRM' }, { text: 'WebApp интерфейс' }],
            [{ text: 'AI-функции' }, { text: 'Другое' }],
            [{ text: '⬅️ Назад' }, { text: '❌ Отменить' }]
          ],
          resize_keyboard: true
        }
      });
    }
  });
  
  bot.hears('⬅️ Назад', async (ctx) => {
    if (ctx.session.currentScene !== 'goal') return;
    
    logger.info(`User ${ctx.from.id} went back to welcome screen`);
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
  
  bot.hears('❌ Отменить', async (ctx) => {
    if (ctx.session.currentScene !== 'goal') return;
    
    logger.info(`User ${ctx.from.id} cancelled inquiry`);
    
    ctx.session.inquiryData = {
      name: '',
      contact: '',
      projectType: '',
      projectDescription: '',
      budget: '',
      features: '',
      timeline: ''
    };
    
    ctx.session.currentScene = 'welcome';
    await ctx.reply('Заявка отменена. Чем ещё я могу вам помочь?', {
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
