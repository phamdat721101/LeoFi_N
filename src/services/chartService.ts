import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { ChartConfiguration, ChartData } from 'chart.js';

export async function generatePortfolioChart(): Promise<Buffer> {
  const width = 400;
  const height = 400;
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

  const data: ChartData = {
    labels: ['Stocks', 'Bonds', 'Real Estate', 'Crypto'],
    datasets: [{
      data: [30, 40, 20, 10],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
    }]
  };

  const configuration: ChartConfiguration = {
    type: 'pie',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Portfolio Distribution'
        }
      }
    }
  };

  return chartJSNodeCanvas.renderToBuffer(configuration as any);
}
