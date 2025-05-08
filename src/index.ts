import './config/env.js';
import { Telegraf } from 'telegraf';
import { logger } from './utils/logger.js';
import { BotContext, sessionMiddleware } from './bot/middleware/session.middleware.js';
import { registerCommandHandlers } from './bot/handlers/commandHandlers.js';
import { registerWelcomeScene } from './bot/scenes/welcome.scene.js';
import { registerFaqScene } from './bot/scenes/faq.scene.js';
import { registerInquiryScene } from './bot/scenes/inquiry.scene.js';
import { registerGoalScene } from './bot/scenes/goal.scene.js';
import { registerFeaturesScene } from './bot/scenes/features.scene.js';
import { registerAiHelpScene } from './bot/scenes/ai-help.scene.js';
import { registerBudgetScene } from './bot/scenes/budget.scene.js';
import { registerSummaryScene } from './bot/scenes/summary.scene.js';

const config = {
  botToken: process.env.BOT_TOKEN || '',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  adminChatId: process.env.ADMIN_CHAT_ID || '',
  mode: process.env.MODE || 'development',
};

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

console.log('Environment variables:', {
  BOT_TOKEN: config.botToken ? 'Set' : 'Not set',
  OPENAI_API_KEY: config.openaiApiKey ? 'Set' : 'Not set',
  ADMIN_CHAT_ID: config.adminChatId ? 'Set' : 'Not set',
  MODE: config.mode
});

try {
  console.log('Creating Telegraf bot instance');
  const bot = new Telegraf<BotContext>(config.botToken);
  
  console.log('Registering middleware');
  bot.use(sessionMiddleware);
  
  console.log('Registering command handlers');
  registerCommandHandlers(bot);
  
  console.log('Registering welcome scene');
  registerWelcomeScene(bot);
  
  console.log('Registering FAQ scene');
  registerFaqScene(bot);
  
  console.log('Registering inquiry scene');
  registerInquiryScene(bot);
  
  console.log('Registering goal scene');
  registerGoalScene(bot);
  
  console.log('Registering features scene');
  registerFeaturesScene(bot);
  
  console.log('Registering AI help scene');
  registerAiHelpScene(bot);
  
  console.log('Registering budget scene');
  registerBudgetScene(bot);
  
  console.log('Registering summary scene');
  registerSummaryScene(bot);
  
  bot.catch((err, ctx) => {
    logger.error(`Error for ${ctx.updateType}`, err);
  });
  
  console.log('Launching bot');
  bot.launch()
    .then(() => {
      logger.info(`Bot started in ${config.mode} mode`);
    })
    .catch((err) => {
      logger.error('Error starting bot', err);
      console.error('Bot launch error details:', err);
    });
  
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
} catch (error) {
  console.error('Error in bot initialization:', error);
}
