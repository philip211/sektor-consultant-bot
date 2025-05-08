import { logger } from '../utils/logger.js';

export interface InquiryData {
  name: string;
  contact: string;
  projectType: string;
  projectDescription: string;
  budget: string;
  features?: string;
  timeline?: string;
}

export const formatInquiry = (data: InquiryData): string => {
  logger.info('Formatting inquiry data');
  
  return `
📩 Новая заявка

🔹 Цель: ${data.projectType}
🔹 Функции: ${data.features || data.projectDescription}
🔹 Бюджет: ${data.budget}
🔹 Сроки: ${data.timeline || 'Не указаны'}
🔹 Комментарий: ${data.projectDescription}
👤 От: ${data.name} (${data.contact})
  `.trim();
};
