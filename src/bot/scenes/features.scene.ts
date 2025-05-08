import { Telegraf } from 'telegraf';
import { BotContext } from '../middleware/session.middleware.js';
import { logger } from '../../utils/logger.js';

export const registerFeaturesScene = (bot: Telegraf<BotContext>) => {
  const featureOptions = [
    'Ответы на вопросы', 
    'Прием заказов', 
    'Интеграция с CRM', 
    'WebApp интерфейс',
    'AI-функции',
    'Другое'
  ];
  
  bot.hears(featureOptions, async (ctx) => {
    if (ctx.session.currentScene !== 'features') return;
    
    if (!ctx.session.inquiryData.features) {
      ctx.session.inquiryData.features = ctx.message.text;
    } else {
      ctx.session.inquiryData.features += `, ${ctx.message.text}`;
    }
    
    logger.info(`User ${ctx.from.id} added feature: ${ctx.message.text}`);
    
    await ctx.reply(`Функция "${ctx.message.text}" добавлена. Выберите еще функции или нажмите "Продолжить", когда закончите.`, {
      reply_markup: {
        keyboard: [
          [{ text: 'Ответы на вопросы' }, { text: 'Прием заказов' }],
          [{ text: 'Интеграция с CRM' }, { text: 'WebApp интерфейс' }],
          [{ text: 'AI-функции' }, { text: 'Другое' }],
          [{ text: '✅ Продолжить' }, { text: '⬅️ Назад' }, { text: '❌ Отменить' }]
        ],
        resize_keyboard: true
      }
    });
  });
  
  bot.hears('✅ Продолжить', async (ctx) => {
    if (ctx.session.currentScene !== 'features') return;
    
    if (!ctx.session.inquiryData.features) {
      await ctx.reply('Пожалуйста, выберите хотя бы одну функцию для вашего бота.');
      return;
    }
    
    logger.info(`User ${ctx.from.id} completed features selection: ${ctx.session.inquiryData.features}`);
    
    await ctx.reply('Отлично! Теперь укажите примерные сроки реализации проекта:', {
      reply_markup: {
        keyboard: [
          [{ text: '1-2 недели' }, { text: '3-4 недели' }],
          [{ text: '1-2 месяца' }, { text: '3+ месяцев' }],
          [{ text: 'Не определено' }],
          [{ text: '⬅️ Назад' }, { text: '❌ Отменить' }]
        ],
        resize_keyboard: true
      }
    });
  });
  
  const timelineOptions = ['1-2 недели', '3-4 недели', '1-2 месяца', '3+ месяцев', 'Не определено'];
  
  bot.hears(timelineOptions, async (ctx) => {
    if (ctx.session.currentScene !== 'features') return;
    
    ctx.session.inquiryData.timeline = ctx.message.text;
    logger.info(`User ${ctx.from.id} set timeline: ${ctx.session.inquiryData.timeline}`);
    
    ctx.session.currentScene = 'budget';
    await ctx.reply('Каков примерный бюджет вашего проекта?', {
      reply_markup: {
        keyboard: [
          [{ text: 'до 100 000 ₽' }, { text: '100 000 - 300 000 ₽' }],
          [{ text: '300 000 - 600 000 ₽' }, { text: 'от 600 000 ₽' }],
          [{ text: 'Не определен' }],
          [{ text: '⬅️ Назад' }, { text: '❌ Отменить' }]
        ],
        resize_keyboard: true
      }
    });
  });
  
  bot.hears('⬅️ Назад', async (ctx) => {
    if (ctx.session.currentScene !== 'features') return;
    
    logger.info(`User ${ctx.from.id} went back to goal screen`);
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
  });
  
  bot.hears('❌ Отменить', async (ctx) => {
    if (ctx.session.currentScene !== 'features') return;
    
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
