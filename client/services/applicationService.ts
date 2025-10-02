export const applicationService = {
  async getApplications(params?: Record<string, string | number>) {
    const qs = params
      ? '?' + Object.entries(params).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join('&')
      : '';
    const res = await fetch('/api/applications' + qs);
    if (!res.ok) throw new Error('Failed to fetch applications');
    return res.json();
  },
};

export default applicationService;
