import { PageData } from '@/lib/crawler/types';
import { CheckResult } from '@/types/audit';

export function checkTouchTargets(pageData: PageData): CheckResult {
  if (!pageData.mobileLayoutResults) {
    return {
      id: 'mobile-touch-targets',
      category: 'Mobile / UX',
      title: 'Small Touch Targets',
      description: 'Checks for interactive elements that are too small to easily tap on mobile.',
      status: 'NA',
      severity: 'INFO',
      score: 100,
      maxScore: 100,
      details: 'Mobile layout data not available.',
      affectedUrls: [pageData.url]
    };
  }

  // Use the results from the smallest viewport
  const smallestViewport = pageData.mobileLayoutResults.find(r => r.width === 375) || pageData.mobileLayoutResults[0];
  const smallTouchTargets = smallestViewport.smallTouchTargets;

  return {
    id: 'mobile-touch-targets',
    category: 'Mobile / UX',
    title: 'Small Touch Targets',
    description: 'Checks for interactive elements that are too small to easily tap on mobile (less than 44x44px).',
    status: smallTouchTargets > 0 ? 'WARNING' : 'PASS',
    severity: smallTouchTargets > 0 ? 'WARNING' : 'INFO',
    score: smallTouchTargets > 0 ? 50 : 100,
    maxScore: 100,
    details: smallTouchTargets > 0
      ? `Found ${smallTouchTargets} interactive element(s) smaller than 44x44 pixels.`
      : 'No overly small touch targets found.',
    recommendation: 'Ensure all buttons and links are at least 44x44 pixels to accommodate finger taps on mobile devices.',
    affectedUrls: [pageData.url]
  };
}
