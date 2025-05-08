import OpenAI from 'openai';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

const openai = new OpenAI({
  apiKey: config.openaiApiKey,
});

export const generateResponse = async (prompt: string): Promise<string> => {
  try {
    logger.info('Sending request to OpenAI');
    logger.debug('OpenAI prompt', { prompt });
    
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Ты - харизматичный консультант компании "Сектор", отвечающий на вопросы клиентов о разработке веб-приложений, мобильных приложений и других ИТ-услугах. Твой стиль общения: умный, уверенный, профессиональный, с лёгким юмором и заботой. Ты должен вызывать уважение и доверие. Отвечай информативно и помогай клиентам понять процесс разработки, функции, стоимость и сроки.',
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
