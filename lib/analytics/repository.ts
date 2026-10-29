export interface AnalyticsEvent {
  id: string;
  timestamp: string;
  name: string;
  properties: Record<string, any>;
}

export interface AnalyticsRepository {
  save(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): Promise<AnalyticsEvent>;
  getAll(): Promise<AnalyticsEvent[]>;
}

class InMemoryAnalyticsRepository implements AnalyticsRepository {
  private events: AnalyticsEvent[] = [];

  async save(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): Promise<AnalyticsEvent> {
    const newEvent: AnalyticsEvent = {
      ...event,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    // Prepend to array so newest is first
    this.events.unshift(newEvent);
    
    // Keep only the last 1000 events to prevent memory leaks in dev
    if (this.events.length > 1000) {
      this.events = this.events.slice(0, 1000);
    }
    
    return newEvent;
  }

  async getAll(): Promise<AnalyticsEvent[]> {
    return [...this.events];
  }
}

// Singleton instance for the in-memory repository
export const analyticsRepo = new InMemoryAnalyticsRepository();
