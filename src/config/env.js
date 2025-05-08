import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = dirname(dirname(__dirname));

try {
  const envPath = join(rootDir, '.env');
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log('Loaded .env file from:', envPath);
  } else {
    console.log('.env file not found at:', envPath);
    dotenv.config(); // Try default location
  }
} catch (error) {
  console.error('Error loading .env file:', error);
  dotenv.config(); // Try default location
}

console.log('Environment variables loaded:', {
  BOT_TOKEN: process.env.BOT_TOKEN ? 'Set' : 'Not set',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'Set' : 'Not set',
  ADMIN_CHAT_ID: process.env.ADMIN_CHAT_ID ? 'Set' : 'Not set',
  MODE: process.env.MODE
});

export const config = {
  botToken: process.env.BOT_TOKEN || '',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  adminChatId: process.env.ADMIN_CHAT_ID || '',
  mode: process.env.MODE || 'development',
};
