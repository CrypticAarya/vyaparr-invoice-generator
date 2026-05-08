import OpenAI from 'openai';

class AiService {
  constructor() {
    this.client = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY || 'dummy' 
    });
  }

  async generateBusinessInsights(data) {
    const { metrics, charts, recentActivity } = data;

    const systemPrompt = `
      You are a high-level Business Intelligence Consultant for a SaaS platform called "VyaparFlow".
      Your goal is to provide actionable, data-driven insights to a business owner based on their current performance metrics.
      
      DATA CONTEXT:
      - Total Revenue: ${metrics.totalRevenue}
      - Revenue Growth: ${metrics.revenueGrowth}%
      - Pending AR: ${metrics.pendingPayments}
      - Inventory Health: ${metrics.inventoryHealth}%
      - Low Stock Count: ${metrics.lowStockCount}
      - Top Products: ${JSON.stringify(charts.topProducts)}
      - Top Clients: ${JSON.stringify(charts.topClients)}
      
      OUTPUT FORMAT (JSON ONLY):
      {
        "healthSummary": "A concise 2-sentence summary of overall business status.",
        "insights": [
          {
            "type": "success | warning | info | danger",
            "title": "Short title",
            "text": "Detailed actionable insight based on data.",
            "recommendation": "Specific action to take."
          }
        ],
        "predictions": {
          "revenueForecast": "Short prediction about next month",
          "riskLevel": "Low | Medium | High"
        }
      }
    `;

    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Analyze my business data and provide executive insights." }
        ],
        timeout: 15000
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('AI Service Error:', error);
      return this.getMockInsights(data);
    }
  }

  getMockInsights(data) {
    const { metrics } = data;
    return {
      healthSummary: `Your business is showing ${metrics.revenueGrowth >= 0 ? 'positive momentum' : 'some challenges'} with total revenue of ₹${(metrics.totalRevenue || 0).toLocaleString()}.`,
      insights: [
        {
          type: metrics.revenueGrowth >= 0 ? "success" : "warning",
          title: "Revenue Velocity",
          text: `Revenue has ${metrics.revenueGrowth >= 0 ? 'increased' : 'decreased'} by ${Math.abs(metrics.revenueGrowth)}% this month.`,
          recommendation: metrics.revenueGrowth >= 0 ? "Maintain current marketing strategy." : "Review pricing or customer acquisition costs."
        },
        {
          type: metrics.lowStockCount > 0 ? "warning" : "success",
          title: "Inventory Alert",
          text: `You have ${metrics.lowStockCount} items near or below threshold.`,
          recommendation: metrics.lowStockCount > 0 ? "Replenish top-selling items to avoid stockouts." : "Inventory levels are optimized."
        },
        {
          type: metrics.pendingPayments > 0 ? "info" : "success",
          title: "Cash Flow",
          text: `₹${(metrics.pendingPayments || 0).toLocaleString()} is currently tied up in outstanding invoices.`,
          recommendation: "Send automated reminders to clients with overdue balances."
        }
      ],
      predictions: {
        revenueForecast: "Expected to remain stable with 5-8% variance.",
        riskLevel: metrics.pendingPayments > (metrics.totalRevenue * 0.5) ? "Medium" : "Low"
      }
    };
  }
}

export default new AiService();
