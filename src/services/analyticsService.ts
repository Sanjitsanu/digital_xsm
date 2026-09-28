// Analytics service for Digital X Growth Platform
export interface AnalyticsEvent {
  event: string;
  category: 'engagement' | 'ai' | 'lead' | 'sales' | 'navigation';
  label?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

const ANALYTICS_KEY = 'digitalx_analytics_events_v1';

export const trackEvent = (
  event: string,
  category: AnalyticsEvent['category'] = 'engagement',
  label?: string,
  metadata?: Record<string, any>
): void => {
  try {
    const payload: AnalyticsEvent = {
      event,
      category,
      label,
      metadata,
      timestamp: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      const existing = localStorage.getItem(ANALYTICS_KEY);
      const events: AnalyticsEvent[] = existing ? JSON.parse(existing) : [];
      events.push(payload);
      // Keep last 200 events
      if (events.length > 200) events.shift();
      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(events));
      
      // Also broadcast custom event for live admin dashboard
      window.dispatchEvent(new CustomEvent('digitalx_analytics_log', { detail: payload }));
    }
  } catch {}
};

export const getAnalyticsStats = () => {
  try {
    if (typeof window === 'undefined') return { total: 0, byEvent: {} };
    const raw = localStorage.getItem(ANALYTICS_KEY);
    const events: AnalyticsEvent[] = raw ? JSON.parse(raw) : [];
    
    const byEvent: Record<string, number> = {};
    for (const e of events) {
      byEvent[e.event] = (byEvent[e.event] || 0) + 1;
    }
    return {
      total: events.length,
      byEvent,
    };
  } catch {
    return { total: 0, byEvent: {} };
  }
};
