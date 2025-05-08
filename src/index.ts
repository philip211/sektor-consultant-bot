import { Telegraf } from 'telegraf';
import { config } from './config/env.js';
import { logger } from './utils/logger.js';
import { BotContext, sessionMiddleware } from './bot/middleware/session.middleware.js';
import { registerCommandHandlers } from './bot/handlers/commandHandlers.js';
import { registerWelcomeScene } from './bot/scenes/welcome.scene.js';
import { registerFaqScene } from './bot/scenes/faq.scene.js';
import { registerInquiryScene } from './bot/scenes/inquiry.scene.js';
import { registerBudgetScene } from './bot/scenes/budget.scene.js';
import { registerSummaryScene } from './bot/scenes/summary.scene.js';

const bot = new Telegraf<BotContext>(config.botToken);

bot.use(sessionMiddleware);

registerCommandHandlers(bot);

registerWelcomeScene(bot);
registerFaqScene(bot);
registerInquiryScene(bot);
registerBudgetScene(bot);
registerSummaryScene(bot);

bot.catch((err, ctx) => {
  logger.error(`Error for ${ctx.updateType}`, err);
});

bot.launch()
  .then(() => {
    logger.info(`Bot started in ${config.mode} mode`);
  })
  .catch((err) => {
    logger.error('Error starting bot', err);
  });

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
