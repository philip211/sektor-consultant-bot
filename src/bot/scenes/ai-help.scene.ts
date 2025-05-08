import { Telegraf } from 'telegraf';
import { BotContext } from '../middleware/session.middleware.js';
import { logger } from '../../utils/logger.js';
import { generateResponse, generateSuggestions } from '../../services/openai.service.js';

export const registerAiHelpScene = (bot: Telegraf<BotContext>) => {
  bot.hears('🤖 AI-подсказки', async (ctx) => {
    logger.info(`User ${ctx.from.id} requested AI suggestions`);
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
  
  bot.hears('💡 Идеи для функций', async (ctx) => {
    if (ctx.session.currentScene !== 'ai-help') return;
    
    await ctx.reply('Генерирую идеи для функций вашего бота...');
    
    try {
      const projectType = ctx.session.inquiryData.projectType || 'Telegram-бот';
      const projectGoal = ctx.session.inquiryData.projectGoal || ctx.session.inquiryData.projectDescription || 'для бизнеса';
      
      const prompt = `Предложи топ-5 функций для ${projectType}, цель которого: ${projectGoal}. Опиши каждую функцию кратко, но информативно.`;
      
      const suggestions = await generateSuggestions(prompt);
      
      await ctx.reply(`Вот несколько идей для функций вашего бота:\n\n${suggestions}`, {
        parse_mode: 'Markdown',
        reply_markup: {
          keyboard: [
            [{ text: '✅ Добавить эти функции' }],
            [{ text: '🔄 Другие идеи' }],
            [{ text: '⬅️ Назад' }, { text: '❌ Отменить' }]
          ],
          resize_keyboard: true
        }
      });
    } catch (error) {
      logger.error('Error generating function ideas', error);
      await ctx.reply('Извините, произошла ошибка при генерации идей. Пожалуйста, попробуйте позже.');
    }
  });
  
  bot.hears('📊 Оценка бюджета', async (ctx) => {
    if (ctx.session.currentScene !== 'ai-help') return;
    
    await ctx.reply('Анализирую информацию для оценки бюджета...');
    
    try {
      const projectType = ctx.session.inquiryData.projectType || 'Telegram-бот';
      const features = ctx.session.inquiryData.features || 'стандартные функции';
      
      const prompt = `Оцени примерный бюджет для разработки ${projectType} со следующими функциями: ${features}. Дай три варианта: минимальный, оптимальный и расширенный бюджет. Объясни, что входит в каждый вариант.`;
      
      const budgetEstimation = await generateSuggestions(prompt);
      
      await ctx.reply(`Вот оценка бюджета для вашего проекта:\n\n${budgetEstimation}`, {
        parse_mode: 'Markdown',
        reply_markup: {
          keyboard: [
            [{ text: '✅ Выбрать бюджет' }],
            [{ text: '🔄 Уточнить оценку' }],
            [{ text: '⬅️ Назад' }, { text: '❌ Отменить' }]
          ],
          resize_keyboard: true
        }
      });
    } catch (error) {
      logger.error('Error generating budget estimation', error);
      await ctx.reply('Извините, произошла ошибка при оценке бюджета. Пожалуйста, попробуйте позже.');
    }
  });
  
  bot.hears('🔮 Рекомендации по типу бота', async (ctx) => {
    if (ctx.session.currentScene !== 'ai-help') return;
    
    await ctx.reply('Анализирую, какой тип бота лучше подойдет для ваших задач...');
    
    try {
      const projectGoal = ctx.session.inquiryData.projectGoal || ctx.session.inquiryData.projectDescription || 'для бизнеса';
      
      const prompt = `Порекомендуй оптимальный тип Telegram-бота для следующей цели: ${projectGoal}. Объясни преимущества этого типа бота и почему он подходит для данной задачи. Предложи 2-3 варианта с разным функционалом.`;
      
      const recommendations = await generateSuggestions(prompt);
      
      await ctx.reply(`Вот рекомендации по типу бота для вашего проекта:\n\n${recommendations}`, {
        parse_mode: 'Markdown',
        reply_markup: {
          keyboard: [
            [{ text: '✅ Принять рекомендации' }],
            [{ text: '🔄 Другие рекомендации' }],
            [{ text: '⬅️ Назад' }, { text: '❌ Отменить' }]
          ],
          resize_keyboard: true
        }
      });
    } catch (error) {
      logger.error('Error generating bot type recommendations', error);
      await ctx.reply('Извините, произошла ошибка при генерации рекомендаций. Пожалуйста, попробуйте позже.');
    }
  });
  
  bot.hears('✅ Добавить эти функции', async (ctx) => {
    if (ctx.session.currentScene !== 'ai-help') return;
    
    if (ctx.message && ctx.message.reply_to_message) {
      const replyText = (ctx.message.reply_to_message as any).text || '';
      const aiSuggestions = replyText.replace('Вот несколько идей для функций вашего бота:\n\n', '');
      ctx.session.inquiryData.features = aiSuggestions;
      logger.info(`User ${ctx.from.id} added AI-suggested functions`);
      
      await ctx.reply('Отлично! Я добавил эти функции в вашу заявку. Что бы вы хотели сделать дальше?', {
        reply_markup: {
          keyboard: [
            [{ text: '📊 Оценка бюджета' }],
            [{ text: '🔮 Рекомендации по типу бота' }],
            [{ text: '⏩ Продолжить оформление заявки' }],
            [{ text: '⬅️ Назад' }, { text: '❌ Отменить' }]
          ],
          resize_keyboard: true
        }
      });
    } else {
      await ctx.reply('Пожалуйста, сначала получите предложения по функциям от AI.');
    }
  });
  
  bot.hears('✅ Выбрать бюджет', async (ctx) => {
    if (ctx.session.currentScene !== 'ai-help') return;
    
    await ctx.reply('Пожалуйста, укажите конкретный бюджет на основе предложенных вариантов:', {
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
  
  bot.hears('✅ Принять рекомендации', async (ctx) => {
    if (ctx.session.currentScene !== 'ai-help') return;
    
    if (ctx.message && ctx.message.reply_to_message) {
      const replyText = (ctx.message.reply_to_message as any).text || '';
      const aiRecommendations = replyText.replace('Вот рекомендации по типу бота для вашего проекта:\n\n', '');
      ctx.session.inquiryData.projectType = aiRecommendations.split('\n')[0]; // Берем первую строку как тип
      logger.info(`User ${ctx.from.id} accepted AI-suggested bot type`);
      
      await ctx.reply('Отлично! Я обновил тип бота в вашей заявке. Что бы вы хотели сделать дальше?', {
        reply_markup: {
          keyboard: [
            [{ text: '💡 Идеи для функций' }],
            [{ text: '📊 Оценка бюджета' }],
            [{ text: '⏩ Продолжить оформление заявки' }],
            [{ text: '⬅️ Назад' }, { text: '❌ Отменить' }]
          ],
          resize_keyboard: true
        }
      });
    } else {
      await ctx.reply('Пожалуйста, сначала получите рекомендации по типу бота от AI.');
    }
  });
  
  bot.hears('⏩ Продолжить оформление заявки', async (ctx) => {
    if (ctx.session.currentScene !== 'ai-help') return;
    
    logger.info(`User ${ctx.from.id} continued with inquiry after AI help`);
    
    if (!ctx.session.inquiryData.budget) {
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
    } else {
      ctx.session.currentScene = 'summary';
      try {
        const prompt = `Сформулируй профессиональное описание проекта на основе следующих данных:
        Тип проекта: ${ctx.session.inquiryData.projectType}
        Цель: ${ctx.session.inquiryData.projectGoal || ctx.session.inquiryData.projectDescription}
        Функции: ${ctx.session.inquiryData.features || 'Не указаны'}
        Бюджет: ${ctx.session.inquiryData.budget}
        Сроки: ${ctx.session.inquiryData.timeline || 'Не указаны'}
        
        Сделай текст кратким, но информативным, в стиле профессионального брифа.`;
        
        const summary = await generateSuggestions(prompt);
        ctx.session.inquiryData.clientComment = summary;
        
        await ctx.reply('Я подготовил финальную версию вашей заявки. Пожалуйста, проверьте и подтвердите:', {
          reply_markup: {
            keyboard: [
              [{ text: '✅ Подтвердить' }],
              [{ text: '🔄 Переформулировать' }],
              [{ text: '❌ Отменить' }]
            ],
            resize_keyboard: true
          }
        });
      } catch (error) {
        logger.error('Error generating final inquiry', error);
        await ctx.reply('Извините, произошла ошибка при формировании заявки. Пожалуйста, попробуйте позже.');
      }
    }
  });
  
  bot.hears('🔄 Другие идеи', async (ctx) => {
    if (ctx.session.currentScene !== 'ai-help') return;
    
    await ctx.reply('Генерирую новые идеи для функций...');
    bot.handleUpdate(ctx.update); // Повторно вызываем обработчик для "💡 Идеи для функций"
  });
  
  bot.hears('🔄 Уточнить оценку', async (ctx) => {
    if (ctx.session.currentScene !== 'ai-help') return;
    
    await ctx.reply('Генерирую уточненную оценку бюджета...');
    bot.handleUpdate(ctx.update); // Повторно вызываем обработчик для "📊 Оценка бюджета"
  });
  
  bot.hears('🔄 Другие рекомендации', async (ctx) => {
    if (ctx.session.currentScene !== 'ai-help') return;
    
    await ctx.reply('Генерирую новые рекомендации по типу бота...');
    bot.handleUpdate(ctx.update); // Повторно вызываем обработчик для "🔮 Рекомендации по типу бота"
  });
  
  bot.hears('⬅️ Назад', async (ctx) => {
    if (ctx.session.currentScene !== 'ai-help') return;
    
    logger.info(`User ${ctx.from.id} went back from AI help`);
    
    if (ctx.session.inquiryData.projectType) {
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
    } else {
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
    }
  });
  
  bot.hears('❌ Отменить', async (ctx) => {
    if (ctx.session.currentScene !== 'ai-help') return;
    
    logger.info(`User ${ctx.from.id} cancelled inquiry from AI help`);
    
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
};
