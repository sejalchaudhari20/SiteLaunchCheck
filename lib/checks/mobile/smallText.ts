import { PageData } from '@/lib/crawler/types';
import { CheckResult } from '@/types/audit';

export function checkSmallText(pageData: PageData): CheckResult {
  if (!pageData.mobileLayoutResults) {
    return {
      id: 'mobile-small-text',
      category: 'Mobile / UX',
      title: 'Very Small Text',
      description: 'Checks for text that is too small to be readable on mobile (less than 12px).',
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
  const smallTextNodes = smallestViewport.smallTextNodes;

  return {
    id: 'mobile-small-text',
    category: 'Mobile / UX',
    title: 'Very Small Text',
    description: 'Checks for text that is too small to be readable on mobile (less than 12px).',
    status: smallTextNodes > 0 ? 'WARNING' : 'PASS',
    severity: smallTextNodes > 0 ? 'WARNING' : 'INFO',
    score: smallTextNodes > 0 ? 50 : 100,
    maxScore: 100,
    details: smallTextNodes > 0
      ? `Found ${smallTextNodes} text element(s) with a computed font size less than 12px.`
      : 'No overly small text found.',
    recommendation: 'Use a base font size of at least 16px to ensure readability on mobile devices.',
    affectedUrls: [pageData.url]
  };
}
