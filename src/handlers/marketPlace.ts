import { BotContext } from '../types';

export async function handleMarketplace(ctx: BotContext) {
  const message = `
Welcome to the LeoFi Marketplace! 🚀

Here you can access our Signal & ETF Marketplace, where you can:

• Copy Signals from top performers
• Invest in On-Chain ETFs
• Create your own Signals or ETFs

Visit our web app to explore the full functionality:
🌐 [LeoFi Marketplace](https://www.leofi.xyz/marketplace)

What would you like to do?
  `;

  const keyboard = {
    reply_markup: {
      inline_keyboard: [
        [{ text: "View Signals", callback_data: "view_signals" }],
        [{ text: "View ETFs", callback_data: "view_etfs" }],
        [{ text: "Create Signal", callback_data: "create_signal" }],
        [{ text: "Create ETF", callback_data: "create_etf" }],
      ]
    }
  };

  ctx.session.messages.push({ type: 'bot', content: message });
  await ctx.reply(message, { ...keyboard, parse_mode: 'Markdown' });
}