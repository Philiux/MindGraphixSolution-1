export interface TrackingData {
  id: string;
  timestamp: Date;
  userAgent: string;
  page: string;
  action: string;
  duration?: number;
}

export interface TrackingStats {
  totalVisits: number;
  uniqueVisitors: number;
  averageSessionTime: number;
  bounceRate: number;
  topPages: Array<{ page: string; visits: number }>;
}

class TrackingBotService {
  private data: TrackingData[] = [];

  track(action: string, page: string): void {
    const trackingData: TrackingData = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      page,
      action,
    };

    this.data.push(trackingData);
    localStorage.setItem("trackingData", JSON.stringify(this.data));
  }

  getStats(): TrackingStats {
    const uniqueVisitors = new Set(this.data.map((d) => d.userAgent)).size;
    const totalVisits = this.data.length;
    const pages = this.data.reduce(
      (acc, d) => {
        acc[d.page] = (acc[d.page] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const topPages = Object.entries(pages)
      .map(([page, visits]) => ({ page, visits }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 10);

    return {
      totalVisits,
      uniqueVisitors,
      averageSessionTime: 180, // Simulation
      bounceRate: 35, // Simulation
      topPages,
    };
  }

  getData(): TrackingData[] {
    return this.data;
  }

  clearData(): void {
    this.data = [];
    localStorage.removeItem("trackingData");
  }

  clearAllData(): void {
    this.clearData();
  }

  getGeneralStats(): TrackingStats {
    return this.getStats();
  }

  getSessionStats(): TrackingStats {
    return this.getStats();
  }

  getAllEvents(): TrackingData[] {
    return this.getData();
  }
}

export const trackingBot = new TrackingBotService();
export default trackingBot;
