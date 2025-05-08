import OpenAI from 'openai';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

const baseSystemPrompt = 'Ты - харизматичный консультант компании "Сектор", отвечающий на вопросы клиентов о разработке веб-приложений, мобильных приложений и других ИТ-услугах. Твой стиль общения: умный, уверенный, профессиональный, с лёгким юмором и заботой. Ты должен вызывать уважение и доверие. Отвечай информативно и помогай клиентам понять процесс разработки, функции, стоимость и сроки.';

const suggestionsSystemPrompt = 'Ты - опытный AI-продюсер Telegram-ботов, который помогает клиентам определиться с функциями, бюджетом и типом бота. Твой стиль общения: умный, уверенный, профессиональный, с лёгким юмором. Например, можешь сказать: "Хочешь сделать умного бота? Я — один из них." Твои ответы должны быть конкретными, полезными и вдохновляющими. Используй эмодзи для структурирования ответа.';

const createOpenAIClient = () => {
  if (!config.openaiApiKey) {
    logger.error('OpenAI API key is not set');
    throw new Error('OpenAI API key is not set');
  }
  
  logger.debug('Creating OpenAI client with API key');
  return new OpenAI({
    apiKey: config.openaiApiKey,
  });
};

/**
 * Генерирует ответ на вопрос пользователя
 * @param prompt Вопрос пользователя
 * @returns Ответ от OpenAI
 */
export const generateResponse = async (prompt: string): Promise<string> => {
  try {
    logger.info('Sending request to OpenAI');
    logger.debug('OpenAI prompt', { prompt });
    
    const openai = createOpenAIClient();
    
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: baseSystemPrompt,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'gpt-3.5-turbo',
    });

    const response = completion.choices[0]?.message?.content || 'Извините, не удалось сгенерировать ответ.';
    logger.debug('OpenAI response', { response });
    return response;
  } catch (error) {
    logger.error('Error generating OpenAI response', error);
    return 'Извините, произошла ошибка при генерации ответа. Пожалуйста, попробуйте позже.';
  }
};

/**
 * Генерирует предложения и рекомендации для пользователя
 * @param prompt Запрос для генерации предложений
 * @returns Предложения от OpenAI
 */
export const generateSuggestions = async (prompt: string): Promise<string> => {
  try {
    logger.info('Generating AI suggestions');
    logger.debug('Suggestions prompt', { prompt });
    
    const openai = createOpenAIClient();
    
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: suggestionsSystemPrompt,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0.7, // Немного больше креативности для предложений
      max_tokens: 500,  // Ограничиваем длину ответа
    });

    const suggestions = completion.choices[0]?.message?.content || 'Извините, не удалось сгенерировать предложения.';
    logger.debug('OpenAI suggestions', { suggestions });
    return suggestions;
  } catch (error) {
    logger.error('Error generating OpenAI suggestions', error);
    return 'Извините, произошла ошибка при генерации предложений. Пожалуйста, попробуйте позже.';
  }
};

/**
 * Генерирует финальную заявку на основе данных пользователя
 * @param projectType Тип проекта
 * @param projectGoal Цель проекта
 * @param features Функции
 * @param budget Бюджет
 * @param timeline Сроки
 * @returns Профессионально оформленная заявка
 */
export const generateFinalInquiry = async (
  projectType: string,
  projectGoal: string,
  features: string,
  budget: string,
  timeline: string
): Promise<string> => {
  try {
    logger.info('Generating final inquiry');
    
    const prompt = `Сформулируй профессиональное описание проекта на основе следующих данных:
    Тип проекта: ${projectType}
    Цель: ${projectGoal}
    Функции: ${features || 'Не указаны'}
    Бюджет: ${budget}
    Сроки: ${timeline || 'Не указаны'}
    
    Сделай текст кратким, но информативным, в стиле профессионального брифа.`;
    
    const openai = createOpenAIClient();
    
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Ты - профессиональный менеджер проектов, который составляет краткие, но информативные брифы для разработки Telegram-ботов. Твой стиль: деловой, четкий, структурированный.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0.5,
    });

    const finalInquiry = completion.choices[0]?.message?.content || 'Извините, не удалось сгенерировать заявку.';
    logger.debug('Final inquiry', { finalInquiry });
    return finalInquiry;
  } catch (error) {
    logger.error('Error generating final inquiry', error);
    return 'Извините, произошла ошибка при формировании заявки. Пожалуйста, попробуйте позже.';
  }
};
