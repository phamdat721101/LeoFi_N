import { BotContext } from '../types';

export async function handleMarketAnalysis(ctx: BotContext) {
  const analysis = 'Here\'s the current market analysis: 🔗 [link](https://www.leofi.xyz/)';
  ctx.session.messages.push({ type: 'bot', content: analysis });
  await ctx.reply(analysis);
}
