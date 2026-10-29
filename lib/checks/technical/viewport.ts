import * as cheerio from 'cheerio';
import { PageData } from '@/lib/crawler/types';
import { CheckResult } from '@/types/audit';

export function checkViewport(pageData: PageData): CheckResult {
  const $ = cheerio.load(pageData.html);
  const viewport = $('meta[name="viewport"]').attr('content');

  if (!viewport) {
    return {
      id: 'tech-viewport',
      category: 'Technical',
      title: 'Viewport Meta Tag',
      description: 'Checks if the page has a viewport meta tag for mobile responsiveness.',
      status: 'FAIL',
      severity: 'CRITICAL',
      score: 0,
      maxScore: 100,
      details: 'Missing viewport meta tag.',
      recommendation: 'Add <meta name="viewport" content="width=device-width, initial-scale=1"> to your <head>.',
      affectedUrls: [pageData.url]
    };
  }

  return {
    id: 'tech-viewport',
    category: 'Technical',
    title: 'Viewport Meta Tag',
    description: 'Checks if the page has a viewport meta tag for mobile responsiveness.',
    status: 'PASS',
    severity: 'INFO',
    score: 100,
    maxScore: 100,
    details: `Viewport tag found: ${viewport}`,
    recommendation: 'Ensure the viewport tag includes width=device-width and initial-scale=1.',
    affectedUrls: [pageData.url]
  };
}
