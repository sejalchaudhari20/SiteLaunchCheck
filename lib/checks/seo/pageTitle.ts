import * as cheerio from 'cheerio';
import { PageData } from '@/lib/crawler/types';
import { CheckResult } from '@/types/audit';

export function checkPageTitle(pageData: PageData): CheckResult {
  const $ = cheerio.load(pageData.html);
  const title = $('title').text().trim();

  let status: CheckResult['status'] = 'FAIL';
  let severity: CheckResult['severity'] = 'CRITICAL';
  let score = 0;
  let details = '';

  if (!title) {
    details = 'Page title is missing or empty.';
  } else if (title.length < 10) {
    status = 'WARNING';
    severity = 'WARNING';
    score = 50;
    details = `Page title is too short (${title.length} chars).`;
  } else if (title.length > 70) {
    status = 'WARNING';
    severity = 'WARNING';
    score = 50;
    details = `Page title is too long (${title.length} chars).`;
  } else {
    status = 'PASS';
    severity = 'INFO';
    score = 100;
    details = `Page title is optimal (${title.length} chars).`;
  }

  return {
    id: 'seo-page-title',
    category: 'SEO Essentials',
    title: 'Page Title',
    description: 'Checks if the page has a valid <title> tag with an optimal length (10-70 characters).',
    status,
    severity,
    score,
    maxScore: 100,
    details,
    recommendation: 'Ensure every page has a unique, descriptive title between 10 and 70 characters.',
    affectedUrls: [pageData.url]
  };
}
