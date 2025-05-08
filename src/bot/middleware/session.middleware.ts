import { Context, Middleware } from 'telegraf';
import { SessionData } from '../../types/session.js';

export interface BotContext extends Context {
  session: SessionData;
}

const sessions = new Map<number, SessionData>();

export const sessionMiddleware: Middleware<BotContext> = async (ctx, next) => {
  const userId = ctx.from?.id;
  
  if (!userId) {
    return next();
  }
  
  if (!sessions.has(userId)) {
    sessions.set(userId, {
      inquiryData: {
        name: '',
        contact: '',
        projectType: '',
        projectDescription: '',
        budget: '',
        features: '',
        timeline: ''
      },
      currentScene: null,
    });
  }
  
  ctx.session = sessions.get(userId)!;
  
  await next();
  
  sessions.set(userId, ctx.session);
};
