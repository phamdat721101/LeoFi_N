import { BotContext, SessionData } from '../types';

interface LiquidityPool {
  name: string;
  apy: string;
  tvl: string;
  recommended: boolean;
}

export async function handleYieldAssistant(ctx: BotContext) {
    const opportunities = [
        { id: 'A', name: 'ETH-USDC LP', type: 'Liquidity Mining', apy: 12.5, platform: 'Uniswap V3' },
        { id: 'B', name: 'ATOM Staking', type: 'Staking', apy: 15.2, platform: 'Cosmos Hub' },
        { id: 'C', name: 'BTC-ETH Farming', type: 'Yield Farming', apy: 8.7, platform: 'Curve Finance' },
        { id: 'D', name: 'DOT Staking', type: 'Staking', apy: 14.0, platform: 'Polkadot' },
        { id: 'E', name: 'AAVE-ETH LP', type: 'Liquidity Mining', apy: 10.3, platform: 'Balancer' },
      ];
      
      const createAsciiGraph = (selectedOpportunities: any, initialInvestment: any) => {
        const graph = [
          "    [Your Wallet]    ",
          `    $${initialInvestment}    `,
          "          |          ",
          "          v          ",
          "    +-----------+    ",
          "    |   LeoFi   |    ",
          "    | Platform  |    ",
          "    +-----------+    ",
          "          |          ",
          "    +-----+-----+    ",
        ];
      
        selectedOpportunities.forEach((opp: any, index: any) => {
          const investment = (initialInvestment / selectedOpportunities.length).toFixed(2);
          graph.push(`    |     ${opp.id}     |    `);
          graph.push(`    |  $${investment}  |    `);
          graph.push(`    |  ${opp.apy.toFixed(1)}% APY  |    `);
          if (index < selectedOpportunities.length - 1) {
            graph.push(`    +-----+-----+    `);
          }
        });
      
        graph.push("          |          ");
        graph.push("          v          ");
        graph.push("    [DeFi Protocols] ");
      
        return graph.join('\n');
      };
      
      const createTelegramMessage = (asciiGraph: any, selectedOpportunities: any, initialInvestment: any) => {
        let message = "<b>🦁 LeoFi DeFi Opportunities 🦁</b>\n\n";
        message += `<b>Initial Investment:</b> $${initialInvestment}\n\n`;
        message += "<b>Here are your selected DeFi routes:</b>\n\n";
        message += `<pre>${asciiGraph}</pre>\n\n`;
        message += "<b>📊 Opportunity Details:</b>\n\n";
        selectedOpportunities.forEach((opp: any) => {
          const investment = (initialInvestment / selectedOpportunities.length).toFixed(2);
          message += `<b>${opp.id}. ${opp.name}</b> (${opp.type})\n`;
          message += `   💰 Investment: $${investment}\n`;
          message += `   📈 APY: ${opp.apy.toFixed(2)}%\n`;
          message += `   🏦 Platform: ${opp.platform}\n`;
          message += `   💸 Estimated Annual Yield: $${(Number(investment) * opp.apy / 100).toFixed(2)}\n\n`;
        });
        message += "Unlock your financial potential with LeoFi—explore decentralized asset management and start growing your investments today! Start your virtual investment <a href='https://leofi.xyz'>here</a> 🦁";
        return message;
      };
      
      // Assume we have the selected opportunities and initial investment
      const selectedOpportunities = [opportunities[0], opportunities[2]]; // Example: selecting A and C
      const initialInvestment = 1000;
      
      const asciiGraph = createAsciiGraph(selectedOpportunities, initialInvestment);
      const telegramMessage = createTelegramMessage(asciiGraph, selectedOpportunities, initialInvestment);
      
      // Send the message using ctx.replyWithHTML
      ctx.replyWithHTML(telegramMessage);
}