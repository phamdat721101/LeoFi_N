import { BotContext, SessionData } from '../types';

interface LiquidityPool {
  name: string;
  apy: string;
  tvl: string;
  recommended: boolean;
}

export async function handleDeFiLiquidity(ctx: BotContext) {
    // Initialize session and messages if they don't exist
  if (!ctx.session) {
    ctx.session = {
      messages: [],
      portfolio: {}, // Add this line, or initialize with appropriate data,
      awaitingPortfolioInput: false
    } as SessionData;
  }
  if (!ctx.session.messages) {
    ctx.session.messages = [];
  }
  // Simulated data - in a real scenario, this would come from an API or database
  const totalValueLocked = ",245.67";
  const dailyChange = "+2.5%";
  const liquidityPools: LiquidityPool[] = [
    { name: "ETH/USDC", apy: "5.2%", tvl: ".2B", recommended: true },
    { name: "BTC/ETH", apy: "4.8%", tvl: "M", recommended: false },
    { name: "AAVE/USDT", apy: "6.1%", tvl: "M", recommended: true },
  ];

  let message = "📊 DeFi Liquidity Performance Summary\n\n";
  message += `💰 Total Value Locked: ${totalValueLocked}\n`;
  message += `📈 24h Change: ${dailyChange}\n\n`;
  message += "🏊‍♂️ Recommended Liquidity Pools:\n";

  liquidityPools.forEach(pool => {
    message += `\n${pool.name}\n`;
    message += `   APY: ${pool.apy}\n`;
    message += `   TVL: ${pool.tvl}\n`;
    if (pool.recommended) {
      message += `   ✅ Recommended\n`;
    }
  });

  message += "\nWhat would you like to do?\n";
  message += "• Add Liquidity\n";
  message += "• Remove Liquidity\n";
  message += "• Rebalance Portfolio";

  ctx.session.messages.push({ type: 'bot', content: message });
  await ctx.reply(message, {
    reply_markup: {
      keyboard: [
        [{ text: "Add Liquidity" }, { text: "Remove Liquidity" }],
        [{ text: "Rebalance Portfolio" }, { text: "Back to Main Menu" }]
      ],
      resize_keyboard: true,
      one_time_keyboard: false
    }
  });
}

export async function handleAddLiquidity(ctx: BotContext) {
  const message = "To add liquidity, please specify the pool and the amount you wish to add. For example: 'Add 100 USDC to ETH/USDC pool'";
  ctx.session.messages.push({ type: 'bot', content: message });
  await ctx.reply(message);
}

export async function handleRemoveLiquidity(ctx: BotContext) {
  const message = "To remove liquidity, please specify the pool and the amount you wish to remove. For example: 'Remove 50 USDC from ETH/USDC pool'";
  ctx.session.messages.push({ type: 'bot', content: message });
  await ctx.reply(message);
}

export async function handleRebalance(ctx: BotContext) {
  const message = "Rebalancing your portfolio will adjust your positions across different pools to optimize returns. Would you like to proceed with rebalancing?";
  ctx.session.messages.push({ type: 'bot', content: message });
  await ctx.reply(message, {
    reply_markup: {
      keyboard: [
        [{ text: "Yes, rebalance my portfolio" }, { text: "No, keep current allocation" }],
        [{ text: "Back to Liquidity Menu" }]
      ],
      resize_keyboard: true,
      one_time_keyboard: false
    }
  });
}
