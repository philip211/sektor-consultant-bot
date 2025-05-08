import { Telegraf } from 'telegraf';
import { BotContext } from '../middleware/session.middleware.js';
import { logger } from '../../utils/logger.js';
import { generateSuggestions } from '../../services/openai.service.js';

export const registerGoalScene = (bot: Telegraf<BotContext>) => {
  const goalOptions = [
    'Инфо-бот', 
    'Бизнес-бот', 
    'Бот для продаж', 
    'Развлекательный бот',
    'Другое'
  ];
  
  bot.hears(goalOptions, async (ctx) => {
    if (ctx.session.currentScene !== 'goal') return;
    
    ctx.session.inquiryData.projectType = ctx.message.text;
    logger.info(`User ${ctx.from.id} set project type: ${ctx.session.inquiryData.projectType}`);
    
    await ctx.reply('Опишите кратко цель вашего проекта:', {
      reply_markup: {
        keyboard: [
          [{ text: '🤖 AI-подсказки' }],
          [{ text: '⬅️ Назад' }, { text: '❌ Отменить' }]
        ],
        resize_keyboard: true
      }
    });
  });
  
  bot.on('text', async (ctx) => {
    if (ctx.session.currentScene !== 'goal' || goalOptions.includes(ctx.message.text) || 
        ctx.message.text === '🤖 AI-подсказки' || ctx.message.text === '⬅️ Назад' || 
        ctx.message.text === '❌ Отменить') return;
    
    ctx.session.inquiryData.projectGoal = ctx.message.text;
    logger.info(`User ${ctx.from.id} set project goal: ${ctx.session.inquiryData.projectGoal}`);
    
    try {
      const prompt = `На основе следующей цели проекта: "${ctx.session.inquiryData.projectGoal}", предложи 2-3 ключевые функции, которые стоит реализовать в Telegram-боте. Ответ должен быть кратким и конкретным.`;
      
      const suggestions = await generateSuggestions(prompt);
      
      ctx.session.currentScene = 'features';
      await ctx.reply(`Отлично! Вот несколько рекомендаций на основе вашей цели:\n\n${suggestions}\n\nКакие функции нужны в вашем боте?`, {
        parse_mode: 'Markdown',
        reply_markup: {
          keyboard: [
            [{ text: 'Ответы на вопросы' }, { text: 'Прием заказов' }],
            [{ text: 'Интеграция с CRM' }, { text: 'WebApp интерфейс' }],
            [{ text: 'AI-функции' }, { text: 'Другое' }],
            [{ text: '🤖 AI-подсказки' }],
            [{ text: '⬅️ Назад' }, { text: '❌ Отменить' }]
          ],
          resize_keyboard: true
        }
      });
    } catch (error) {
      logger.error('Error generating recommendations', error);
      
      ctx.session.currentScene = 'features';
      await ctx.reply('Какие функции нужны в вашем боте?', {
        reply_markup: {
          keyboard: [
            [{ text: 'Ответы на вопросы' }, { text: 'Прием заказов' }],
            [{ text: 'Интеграция с CRM' }, { text: 'WebApp интерфейс' }],
            [{ text: 'AI-функции' }, { text: 'Другое' }],
            [{ text: '🤖 AI-подсказки' }],
            [{ text: '⬅️ Назад' }, { text: '❌ Отменить' }]
          ],
          resize_keyboard: true
        }
      });
    }
  });
  
  bot.hears('⬅️ Назад', async (ctx) => {
    if (ctx.session.currentScene !== 'goal') return;
    
    logger.info(`User ${ctx.from.id} went back to inquiry`);
    ctx.session.currentScene = 'inquiry';
    await ctx.reply('Пожалуйста, оставьте ваш контакт (телефон или email):');
  });
  
  bot.hears('❌ Отменить', async (ctx) => {
    if (ctx.session.currentScene !== 'goal') return;
    
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
    if (ctx.session.currentScene !== 'goal') return;
    
    logger.info(`User ${ctx.from.id} requested AI help from goal scene`);
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
