import { track } from '@vercel/analytics';

export const ANALYTICS_EVENTS = {
  AUDIT_STARTED: 'audit_started',
  AUDIT_COMPLETED: 'audit_completed',
  AUDIT_FAILED: 'audit_failed',
  REPORT_GENERATED: 'report_generated',
  REPORT_DOWNLOADED: 'report_downloaded',
  REPORT_SHARED: 'report_shared',
  ANOTHER_AUDIT_STARTED: 'another_audit_started',
} as const;

/**
 * Safely tracks a custom event with Vercel Analytics.
 * Silently catches any errors to ensure product functionality is never disrupted.
 */
export function trackEvent(name: string, properties?: Record<string, string | number | boolean | null>) {
  try {
    // If in development mode, log to console so you can see it without a Vercel account
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics Tracked] Event: "${name}"`, properties || '');
    }

    // Only track in browser environments
    if (typeof window !== 'undefined') {
      // 1. Track via Vercel Web Analytics
      track(name, properties);

      // 2. Track via our custom internal analytics backend
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, properties }),
      }).catch(err => {
        // Silently ignore if internal fetch fails
        console.warn(`[Internal Analytics] Failed to send event: ${name}`, err);
      });
    }
  } catch (error) {
    // Silently ignore analytics failures
    console.warn(`[Analytics] Failed to track event: ${name}`, error);
  }
}

export function trackAuditStarted(sourcePage: string, auditType: string = 'website') {
  trackEvent(ANALYTICS_EVENTS.AUDIT_STARTED, {
    source_page: sourcePage,
    audit_type: auditType,
  });
}

/**
 * Tracks a completed audit using aggregated score data.
 * IMPORTANT: We strictly avoid passing the `url` to preserve privacy.
 */
export function trackAuditCompleted(data: any) {
  // We expect data to be the AuditResult object (or ReportData)
  trackEvent(ANALYTICS_EVENTS.AUDIT_COMPLETED, {
    score: Math.round(data.overallScore || 0),
    status: data.launchStatus || 'unknown',
    total_checks: data.results?.length || 0,
    passed_count: data.summary?.passed || 0,
    warning_count: data.summary?.warnings || 0,
    critical_count: data.summary?.critical || 0,
    // duration_ms can be added if calculated by the client, but for now we omit or pass 0 if not tracked
  });
}

export function trackAuditFailed(errorType: string, sourcePage: string) {
  trackEvent(ANALYTICS_EVENTS.AUDIT_FAILED, {
    error_type: errorType,
    source_page: sourcePage,
  });
}

export function trackReportGenerated(reportType: 'internal' | 'client') {
  trackEvent(ANALYTICS_EVENTS.REPORT_GENERATED, {
    report_type: reportType,
  });
}

export function trackReportDownloaded(reportType: 'internal' | 'client', format: string = 'pdf') {
  trackEvent(ANALYTICS_EVENTS.REPORT_DOWNLOADED, {
    report_type: reportType,
    format,
  });
}

export function trackReportShared(reportType: 'internal' | 'client', shareMethod: 'copy_link' | 'native_share') {
  trackEvent(ANALYTICS_EVENTS.REPORT_SHARED, {
    report_type: reportType,
    share_method: shareMethod,
  });
}

export function trackAnotherAuditStarted(sourcePage: 'results' | 'report' | 'client_report') {
  trackEvent(ANALYTICS_EVENTS.ANOTHER_AUDIT_STARTED, {
    source_page: sourcePage,
  });
}
