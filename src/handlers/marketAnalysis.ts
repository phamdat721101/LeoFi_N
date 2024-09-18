import { BotContext } from '../types';

export async function handleMarketAnalysis(ctx: BotContext) {
  const analysis = 'Here\'s the current market analysis: [Your analysis here]';
  ctx.session.messages.push({ type: 'bot', content: analysis });
  await ctx.reply(analysis);
}
