import { logger } from '../utils/logger.js';

export interface InquiryData {
  name: string;
  contact: string;
  projectType: string;
  projectDescription: string;
  budget: string;
}

export const formatInquiry = (data: InquiryData): string => {
  logger.info('Formatting inquiry data');
  
  return `
📋 НОВАЯ ЗАЯВКА 📋

👤 Имя: ${data.name}
📱 Контакт: ${data.contact}
🔍 Тип проекта: ${data.projectType}
💬 Описание: ${data.projectDescription}
💰 Бюджет: ${data.budget}
  `.trim();
};
