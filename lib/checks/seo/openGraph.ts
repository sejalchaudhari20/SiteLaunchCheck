import * as cheerio from 'cheerio';
import { PageData } from '@/lib/crawler/types';
import { CheckResult } from '@/types/audit';

export function checkOpenGraph(pageData: PageData): CheckResult {
  const $ = cheerio.load(pageData.html);
  const ogTitle = $('meta[property="og:title"]').attr('content') || $('meta[name="og:title"]').attr('content');
  const ogImage = $('meta[property="og:image"]').attr('content') || $('meta[name="og:image"]').attr('content');

  let status: CheckResult['status'] = 'FAIL';
  let severity: CheckResult['severity'] = 'WARNING';
  let score = 0;
  let details = '';

  if (ogTitle && ogImage) {
    status = 'PASS';
    severity = 'INFO';
    score = 100;
    details = 'Found og:title and og:image tags.';
  } else if (ogTitle || ogImage) {
    status = 'WARNING';
    severity = 'WARNING';
    score = 50;
    details = 'Missing some essential Open Graph tags (need both og:title and og:image).';
  } else {
    details = 'Missing essential Open Graph tags (og:title, og:image).';
  }

  return {
    id: 'seo-open-graph',
    category: 'SEO Essentials',
    title: 'Open Graph',
    description: 'Checks for basic Open Graph tags (og:title, og:image) for social sharing.',
    status,
    severity,
    score,
    maxScore: 100,
    details,
    recommendation: 'Include Open Graph metadata to control how your URLs are displayed on social media.',
    affectedUrls: [pageData.url]
  };
}
