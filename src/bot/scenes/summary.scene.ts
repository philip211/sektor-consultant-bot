import { Telegraf } from 'telegraf';
import { BotContext } from '../middleware/session.middleware.js';
import { logger } from '../../utils/logger.js';
import { config } from '../../config/env.js';
import { formatInquiry } from '../../services/request-formatter.js';

export const registerSummaryScene = (bot: Telegraf<BotContext>) => {
  bot.hears('✅ Подтвердить', async (ctx) => {
    if (ctx.session.currentScene !== 'summary') return;
    
    logger.info(`User ${ctx.from.id} confirmed inquiry`);
    
    const adminMessage = formatInquiry(ctx.session.inquiryData);
    
    try {
      await bot.telegram.sendMessage(config.adminChatId, adminMessage);
      logger.info(`Inquiry from user ${ctx.from.id} sent to admin`);
      
      await ctx.reply('Ваша заявка успешно отправлена! Наш менеджер свяжется с вами в ближайшее время.');
      
      ctx.session.currentScene = 'welcome';
      await ctx.reply('Чем ещё я могу вам помочь?', {
        reply_markup: {
          keyboard: [
            [{ text: '🔍 Оставить заявку' }],
            [{ text: '❓ Часто задаваемые вопросы' }],
            [{ text: '📞 Связаться с менеджером' }]
          ],
          resize_keyboard: true
        }
      });
    } catch (error) {
      logger.error('Error sending inquiry to admin', error);
      await ctx.reply('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.');
    }
  });
  
  bot.hears('❌ Отменить', async (ctx) => {
    if (ctx.session.currentScene !== 'summary') return;
    
    logger.info(`User ${ctx.from.id} cancelled inquiry`);
    
    ctx.session.inquiryData = {
      name: '',
      contact: '',
      projectType: '',
      projectDescription: '',
      budget: ''
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
