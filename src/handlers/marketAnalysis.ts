import { BotContext } from '../types';

interface MarketData {
  symbol: string;
  price: number;
  volume: number;
  high24h: number;
  low24h: number;
}

interface AIAnalysis {
  symbol: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  recommendation: string;
  entryPoint: number;
  stopLoss: number;
  takeProfit: number;
  relatedAssets: string[];
}

function simulateMarketData(): MarketData[] {
  // In a real MVP, this would fetch actual market data
  return [
    { symbol: 'BTC', price: 50000, volume: 1000000, high24h: 51000, low24h: 49000 },
    { symbol: 'ETH', price: 3000, volume: 500000, high24h: 3100, low24h: 2900 },
    { symbol: 'ADA', price: 2, volume: 750000, high24h: 2.1, low24h: 1.9 },
    { symbol: 'DOT', price: 30, volume: 250000, high24h: 31, low24h: 29 },
    { symbol: 'SOL', price: 150, volume: 400000, high24h: 155, low24h: 145 },
  ];
}

function getSentimentEmoji(sentiment: string): string {
  switch (sentiment) {
    case 'bullish': return '📈';
    case 'bearish': return '📉';
    default: return '➖';
  }
}

function performAIAnalysis(data: MarketData): AIAnalysis {
  // Simulated AI analysis with more sophisticated (but still randomized) logic
  const priceVolatility = (data.high24h - data.low24h) / data.price;
  const volumeStrength = data.volume > 500000 ? 'high' : data.volume > 250000 ? 'medium' : 'low';
  
  // Sentiment analysis
  let sentiment: 'bullish' | 'bearish' | 'neutral';
  if (data.price > (data.high24h + data.low24h) / 2 && volumeStrength !== 'low') {
    sentiment = 'bullish';
  } else if (data.price < (data.high24h + data.low24h) / 2 && volumeStrength !== 'low') {
    sentiment = 'bearish';
  } else {
    sentiment = 'neutral';
  }

  const confidence = Math.min(priceVolatility * 5 + (volumeStrength === 'high' ? 0.3 : volumeStrength === 'medium' ? 0.15 : 0), 1);

  // Entry point, stop loss, and take profit calculations
  const entryPoint = data.price;
  const stopLoss = sentiment === 'bullish' ? data.price * 0.95 : data.price * 1.05;
  const takeProfit = sentiment === 'bullish' ? data.price * 1.1 : data.price * 0.9;

  // Recommendation logic
  let recommendation = '';
  if (sentiment === 'bullish' && confidence > 0.7) {
    recommendation = 'Strong Buy';
  } else if (sentiment === 'bullish' && confidence > 0.5) {
    recommendation = 'Buy';
  } else if (sentiment === 'bearish' && confidence > 0.7) {
    recommendation = 'Strong Sell';
  } else if (sentiment === 'bearish' && confidence > 0.5) {
    recommendation = 'Sell';
  } else {
    recommendation = 'Hold';
  }

  // Simulated related assets
  const allAssets = ['BTC', 'ETH', 'ADA', 'DOT', 'SOL', 'LINK', 'XRP', 'UNI', 'AAVE', 'SNX'];
  const relatedAssets = allAssets
    .filter(asset => asset !== data.symbol)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  return {
    symbol: data.symbol,
    sentiment,
    confidence,
    recommendation,
    entryPoint,
    stopLoss,
    takeProfit,
    relatedAssets,
  };
}

export async function handleMarketAnalysis(ctx: BotContext) {
  const marketData = simulateMarketData();
  const analyses = marketData.map(performAIAnalysis);

  let analysisReport = '🤖 AI Market Analysis Report (DEMO/SIMULATION)\n\n';
  
  analyses.forEach(analysis => {
    const sentimentEmoji = getSentimentEmoji(analysis.sentiment);
    analysisReport += `${sentimentEmoji} *${analysis.symbol}*\n`;
    analysisReport += `Price: $${analysis.entryPoint.toFixed(2)}\n`;
    analysisReport += `Sentiment: ${analysis.sentiment.toUpperCase()} (${(analysis.confidence * 100).toFixed(0)}%)\n`;
    analysisReport += `Recommendation: ${analysis.recommendation}\n`;
    analysisReport += `Entry: $${analysis.entryPoint.toFixed(2)} | SL: $${analysis.stopLoss.toFixed(2)} | TP: $${analysis.takeProfit.toFixed(2)}\n\n`;
  });

  ctx.session.messages.push({ type: 'bot', content: analysisReport });
  await ctx.reply(analysisReport, { parse_mode: 'Markdown' });
}

export async function handleInvestSimulation(ctx: BotContext, amount: number, symbol: string) {
  const marketData = simulateMarketData();
  const targetAsset = marketData.find(data => data.symbol === symbol);

  if (!targetAsset) {
    await ctx.reply(`Asset ${symbol} not found. Available assets: ${marketData.map(data => data.symbol).join(', ')}`);
    return;
  }

  const analysis = performAIAnalysis(targetAsset);
  const sentimentEmoji = getSentimentEmoji(analysis.sentiment);

  let simulationResult = '🎮 Investment Simulation Report (DEMO/SIMULATION)\n\n';
  simulationResult += `💰 Investment: $${amount} in ${analysis.symbol}\n\n`;
  simulationResult += `${sentimentEmoji} *AI Analysis*\n`;
  simulationResult += `Sentiment: ${analysis.sentiment.toUpperCase()} (${(analysis.confidence * 100).toFixed(0)}%)\n`;
  simulationResult += `Recommendation: ${analysis.recommendation}\n`;
  simulationResult += `Entry: $${analysis.entryPoint.toFixed(2)} | SL: $${analysis.stopLoss.toFixed(2)} | TP: $${analysis.takeProfit.toFixed(2)}\n\n`;

  // Simulate a basic outcome
  const outcomeMultiplier = analysis.sentiment === 'bullish' ? 1.1 : analysis.sentiment === 'bearish' ? 0.9 : 1.0;
  const simulatedOutcome = amount * outcomeMultiplier;
  const profit = simulatedOutcome - amount;

  simulationResult += `*Simulated Outcome*\n`;
  simulationResult += `Final Value: $${simulatedOutcome.toFixed(2)}\n`;
  simulationResult += `Profit/Loss: ${profit >= 0 ? '✅' : '❌'} $${profit.toFixed(2)}\n\n`;
  simulationResult += '⚠️ DISCLAIMER: This is a simulated MVP product. Do not use for actual trading decisions.';

  ctx.session.messages.push({ type: 'bot', content: simulationResult });
  await ctx.reply(simulationResult, { parse_mode: 'Markdown' });
}