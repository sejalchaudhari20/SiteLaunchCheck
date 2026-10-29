import { PageData } from '@/lib/crawler/types';
import { CheckResult } from '@/types/audit';

export function checkMobileLayout(pageData: PageData): CheckResult {
  if (!pageData.mobileLayoutResults) {
    return {
      id: 'mobile-layout',
      category: 'Mobile / UX',
      title: 'Mobile Layout',
      description: 'Checks if the page fits on standard mobile screens without horizontal scrolling.',
      status: 'NA',
      severity: 'INFO',
      score: 100,
      maxScore: 100,
      details: 'Mobile layout data not available.',
      affectedUrls: [pageData.url]
    };
  }

  const failures = pageData.mobileLayoutResults.filter(r => r.hasHorizontalOverflow);

  return {
    id: 'mobile-layout',
    category: 'Mobile / UX',
    title: 'Horizontal Overflow',
    description: 'Checks if the page fits on standard mobile screens without horizontal scrolling.',
    status: failures.length > 0 ? 'FAIL' : 'PASS',
    severity: failures.length > 0 ? 'CRITICAL' : 'INFO',
    score: failures.length > 0 ? 0 : 100,
    maxScore: 100,
    details: failures.length > 0
      ? `Horizontal overflow detected at viewports: ${failures.map(f => f.width + 'px').join(', ')}.`
      : 'No horizontal overflow detected on mobile viewports.',
    recommendation: 'Ensure all elements fit within the viewport width to prevent horizontal scrolling on mobile devices.',
    affectedUrls: [pageData.url]
  };
}
