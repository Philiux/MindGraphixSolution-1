import { Quote } from "@/../shared/quote";

const apiCreate = async (payload: any) => {
  const res = await fetch('/api/quotes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Server error: ${res.status} ${txt}`);
  }
  return res.json();
};

const apiList = async (params?: Record<string, string | number>) => {
  const qs = params
    ? '?' + Object.entries(params).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join('&')
    : '';
  const res = await fetch('/api/quotes' + qs);
  if (!res.ok) throw new Error('Failed to fetch quotes');
  return res.json();
};

export const quoteService = {
  async submitQuoteRequest(data: any) {
    const body = {
      name: `${data.clientInfo.firstName} ${data.clientInfo.lastName}`,
      email: data.clientInfo.email,
      phone: data.clientInfo.phone,
      service: data.projectInfo.category,
      message: data.projectInfo.description,
      files: data.attachments || [],
    };
    const json = await apiCreate(body);
    return (json.quote && json.quote.id) || null;
  },

  async getQuoteRequests(params?: Record<string, string | number>) {
    const json = await apiList(params);
    return json.quotes || [];
  },

  async getQuoteRequest(id: string | number) {
    const list = await this.getQuoteRequests();
    return list.find((q: any) => String(q.id) === String(id));
  },

  async replyQuote(id: string | number, subject: string, message: string) {
    const res = await fetch(`/api/quotes/${id}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, message }),
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Failed to send reply: ${res.status} ${txt}`);
    }
    return res.json();
  },

  async getClientQuoteRequests(email: string) {
    const list = await this.getQuoteRequests();
    return list.filter((q: any) => q.email === email || (q.name && q.name.includes(email)));
  },

  async getQuoteStats() {
    const list = await this.getQuoteRequests();
    return {
      totalRequests: list.length,
    };
  },

  // Placeholder for generated quotes (not implemented)
  getQuotes() {
    return [];
  },
};

export default quoteService;
