import dotenv from 'dotenv';
dotenv.config();

export const config = {
  botToken: process.env.BOT_TOKEN || '',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  adminChatId: process.env.ADMIN_CHAT_ID || '',
  mode: process.env.MODE || 'development',
};
