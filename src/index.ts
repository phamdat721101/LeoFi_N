import { Telegraf, session } from 'telegraf';
import { message } from 'telegraf/filters';
import { BotContext, Message } from './types';
import { handlePortfolio, addToPortfolio, handleMarketAnalysis, handlePerformance, handleOnboarding } from './handlers';
import { handleDeFiLiquidity, handleAddLiquidity, handleRemoveLiquidity, handleRebalance } from './handlers/deFiLiquidity';

const bot = new Telegraf<BotContext>(process.env.BOT_TOKEN || '7380070505:AAHh5Fa9-AoNVgwi9BoorGe_RLkfBQohTlU');

bot.use(session({
  defaultSession: () => ({ messages: [], portfolio: [], awaitingPortfolioInput: false })
}));

bot.command('start', (ctx) => {
  ctx.session = {
    messages: [
      { type: 'bot', content: 'Welcome to LeoFi! How can I assist you with your investments today?' }
    ],
    portfolio: [], // Add this line
    awaitingPortfolioInput: false
  };
  ctx.reply('Welcome to LeoFi! How can I assist you with your investments today?', {
    reply_markup: {
      keyboard: [
        [{ text: 'Portfolio' }, { text: 'Market Analysis' }],
        [{ text: 'Performance' }, { text: 'DeFi Liquidity' }],
        [{ text: 'Onboarding' }]
      ],
      resize_keyboard: true,
      one_time_keyboard: false
    }
  });
});

function setupPortfolioHandlers(bot: Telegraf<BotContext>) {
  bot.action('add_portfolio', async (ctx) => {
    await ctx.answerCbQuery();
    const message = 'Great! Let\'s add to your portfolio. Please enter the details of your investment in the following format:\n\nAsset,Amount,BuyPrice\n\nFor example: BTC,0.5,30000';
    ctx.session.messages.push({ type: 'bot', content: message });
    ctx.session.awaitingPortfolioInput = true;
    await ctx.reply(message);
  });

  bot.action('view_portfolio', async (ctx) => {
    await ctx.answerCbQuery();
    await handlePortfolio(ctx);
  });

  bot.action('edit_portfolio', async (ctx) => {
    await ctx.answerCbQuery();
    const message = 'To edit your portfolio, please provide the asset you want to update and the new details in the following format:\n\nAsset,NewAmount,NewBuyPrice\n\nFor example: BTC,0.7,35000';
    ctx.session.messages.push({ type: 'bot', content: message });
    await ctx.reply(message);
  });

  // Add more portfolio-related action handlers as needed
}

// bot.on(message('text'), async (ctx) => {
//   const userMessage: Message = { type: 'user', content: ctx.message.text };
//   ctx.session.messages.push(userMessage);

//   // if (ctx.session.awaitingPortfolioInput) {
    
//   // } else {
//   //   // Handle other types of messages
//   //   const botResponse: Message = { type: 'bot', content: `You said: ${ctx.message.text}` };
//   //   ctx.session.messages.push(botResponse);
//   //   await ctx.reply(botResponse.content);
//   // }

//   const input = ctx.message.text.split(',');
//   if (input.length === 3) {
//     const [asset, amount, buyPrice] = input;
//     const result = await addToPortfolio(ctx, asset, parseFloat(amount), parseFloat(buyPrice));
//     ctx.session.awaitingPortfolioInput = false;
//     await ctx.reply(result);
//   } else {
//     await ctx.reply('Invalid input format. Please use: Asset,Amount,BuyPrice');
//   }
// });

bot.hears('Portfolio', handlePortfolio);
bot.hears('Market Analysis', handleMarketAnalysis);
bot.hears('Performance', handlePerformance);
bot.hears('Onboarding', handleOnboarding);
bot.hears('DeFi Liquidity', handleDeFiLiquidity);
bot.hears('Add Liquidity', handleAddLiquidity);
bot.hears('Remove Liquidity', handleRemoveLiquidity);
bot.hears('Rebalance Portfolio', handleRebalance);

bot.hears('Back to Main Menu', (ctx) => {
  ctx.reply('What would you like to do?', {
    reply_markup: {
      keyboard: [
        [{ text: 'Portfolio' }, { text: 'Market Analysis' }],
        [{ text: 'Performance' }, { text: 'DeFi Liquidity' }],
        [{ text: 'Onboarding' }]
      ],
      resize_keyboard: true,
      one_time_keyboard: false
    }
  });
});

bot.on(message('text'), async (ctx) => {
  const userMessage: Message = { type: 'user', content: ctx.message.text };
  ctx.session.messages.push(userMessage);

  // Here you would typically process the message and generate a response
  // For this example, we'll just echo the message back
  const botResponse: Message = { type: 'bot', content: `You said: ${ctx.message.text}` };
  ctx.session.messages.push(botResponse);

  await ctx.reply(botResponse.content);
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));