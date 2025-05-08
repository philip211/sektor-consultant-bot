import { Telegraf } from 'telegraf';
import { BotContext } from '../middleware/session.middleware.js';
import { logger } from '../../utils/logger.js';
import { generateSuggestions } from '../../services/openai.service.js';

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
      if (!ctx.session.inquiryData.features.includes(ctx.message.text)) {
        ctx.session.inquiryData.features += `, ${ctx.message.text}`;
      }
    }
    
    logger.info(`User ${ctx.from.id} added feature: ${ctx.message.text}`);
    
    await ctx.reply(`Функция "${ctx.message.text}" добавлена. Вы можете выбрать еще функции или указать примерные сроки реализации:`, {
      reply_markup: {
        keyboard: [
          [{ text: '1-2 недели' }, { text: '3-4 недели' }],
          [{ text: '1-2 месяца' }, { text: '3+ месяцев' }],
          [{ text: 'Сроки не определены' }],
          [{ text: '🤖 AI-подсказки' }],
          [{ text: '⬅️ Назад' }, { text: '❌ Отменить' }]
        ],
        resize_keyboard: true
      }
    });
  });
  
  const timelineOptions = [
    '1-2 недели', 
    '3-4 недели', 
    '1-2 месяца', 
    '3+ месяцев',
    'Сроки не определены'
  ];
  
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
          [{ text: '🤖 AI-подсказки' }],
          [{ text: '⬅️ Назад' }, { text: '❌ Отменить' }]
        ],
        resize_keyboard: true
      }
    });
  });
  
  bot.on('text', async (ctx) => {
    if (ctx.session.currentScene !== 'features' || 
        featureOptions.includes(ctx.message.text) || 
        timelineOptions.includes(ctx.message.text) ||
        ctx.message.text === '🤖 AI-подсказки' || 
        ctx.message.text === '⬅️ Назад' || 
        ctx.message.text === '❌ Отменить') return;
    
    ctx.session.inquiryData.specialRequirements = ctx.message.text;
    logger.info(`User ${ctx.from.id} added special requirements`);
    
    await ctx.reply(`Ваши требования добавлены. Пожалуйста, укажите примерные сроки реализации:`, {
      reply_markup: {
        keyboard: [
          [{ text: '1-2 недели' }, { text: '3-4 недели' }],
          [{ text: '1-2 месяца' }, { text: '3+ месяцев' }],
          [{ text: 'Сроки не определены' }],
          [{ text: '🤖 AI-подсказки' }],
          [{ text: '⬅️ Назад' }, { text: '❌ Отменить' }]
        ],
        resize_keyboard: true
      }
    });
  });
  
  bot.hears('⬅️ Назад', async (ctx) => {
    if (ctx.session.currentScene !== 'features') return;
    
    logger.info(`User ${ctx.from.id} went back to goal`);
    ctx.session.currentScene = 'goal';
    await ctx.reply('Какова цель вашего проекта?', {
      reply_markup: {
        keyboard: [
          [{ text: 'Инфо-бот' }, { text: 'Бизнес-бот' }],
          [{ text: 'Бот для продаж' }, { text: 'Развлекательный бот' }],
          [{ text: 'Другое' }],
          [{ text: '🤖 AI-подсказки' }],
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
      username: '',
      projectType: '',
      projectGoal: '',
      projectDescription: '',
      features: '',
      integrations: '',
      timeline: '',
      budget: '',
      specialRequirements: '',
      clientComment: ''
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
  
  bot.hears('🤖 AI-подсказки', async (ctx) => {
    if (ctx.session.currentScene !== 'features') return;
    
    logger.info(`User ${ctx.from.id} requested AI help from features scene`);
    ctx.session.currentScene = 'ai-help';
    
    await ctx.reply('Выберите, какие подсказки от AI вы хотели бы получить:', {
      reply_markup: {
        keyboard: [
          [{ text: '💡 Идеи для функций' }],
          [{ text: '📊 Оценка бюджета' }],
          [{ text: '🔮 Рекомендации по типу бота' }],
          [{ text: '⬅️ Назад' }, { text: '❌ Отменить' }]
        ],
        resize_keyboard: true
      }
    });
  });
};
