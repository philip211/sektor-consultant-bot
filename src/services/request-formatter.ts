import { logger } from '../utils/logger.js';

export interface InquiryData {
  name: string;
  contact: string;
  username?: string;
  projectType: string;
  projectGoal?: string;
  projectDescription: string;
  features?: string;
  integrations?: string;
  timeline?: string;
  budget: string;
  specialRequirements?: string;
  clientComment?: string;
}

export const formatInquiry = (data: InquiryData): string => {
  logger.info('Formatting inquiry data');
  
  const username = data.username ? `@${data.username}` : data.name;
  
  return `
🧠 Новая AI-заявка от ${username}

🔹 Тип проекта: ${data.projectType}
🔹 Цель: ${data.projectGoal || data.projectDescription}
🔹 Интеграции: ${data.integrations || 'OpenAI'}
🔹 Сроки: ${data.timeline || 'Не указаны'}
🔹 Бюджет: ${data.budget}
🔹 Особенности: ${data.specialRequirements || data.features || 'Не указаны'}
🧾 Комментарий клиента: «${data.clientComment || data.projectDescription}»
👤 Контакт: ${data.contact}
  `.trim();
};
