import OpenAI from 'openai';

class AiService {
  constructor() {
    this.client = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY || 'dummy' 
    });
  }

  /**
   * Generates simple, actionable alerts based on business data.
   * Focuses on utility (Inventory, Collections) rather than hype (Predictions).
   */
  async generateBusinessInsights(data) {
    const { metrics, charts } = data;

    const systemPrompt = `
      You are a Business Assistant for an invoicing app. 
      Analyze the data and provide 2-3 BRIEF, actionable alerts.
      Focus ONLY on:
      1. Inventory levels (if low).
      2. Accounts Receivable (if high).
      3. Revenue trends.
      
      DATA:
      - Revenue: ${metrics.totalRevenue}
      - Growth: ${metrics.revenueGrowth}%
      - Pending: ${metrics.pendingPayments}
      - Low Stock: ${metrics.lowStockCount}
      
      OUTPUT FORMAT (JSON ONLY):
      {
        "alerts": [
          {
            "type": "warning | info | success",
            "title": "Short title",
            "text": "1 sentence explanation."
          }
        ]
      }
    `;

    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Check my business health." }
        ],
        timeout: 10000
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      return this.getFallbackAlerts(data);
    }
  }

  getFallbackAlerts(data) {
    const { metrics } = data;
    const alerts = [];
    
    if (metrics.lowStockCount > 0) {
      alerts.push({
        type: "warning",
        title: "Low Stock Alert",
        text: `${metrics.lowStockCount} items are below their reorder threshold.`
      });
    }
    
    if (metrics.pendingPayments > 0) {
      alerts.push({
        type: "info",
        title: "Outstanding Receivables",
        text: `₹${metrics.pendingPayments.toLocaleString()} is currently pending across invoices.`
      });
    }

    if (alerts.length === 0) {
      alerts.push({
        type: "success",
        title: "Operations Healthy",
        text: "All inventory and payments are currently within normal ranges."
      });
    }

    return { alerts };
  }
}

export default new AiService();
