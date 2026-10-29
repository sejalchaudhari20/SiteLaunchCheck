import * as cheerio from 'cheerio';
import { PageData } from '@/lib/crawler/types';
import { CheckResult } from '@/types/audit';

export function checkH1Heading(pageData: PageData): CheckResult {
  const $ = cheerio.load(pageData.html);
  const h1Count = $('h1').length;

  let status: CheckResult['status'] = 'FAIL';
  let severity: CheckResult['severity'] = 'CRITICAL';
  let score = 0;
  let details = '';

  if (h1Count === 0) {
    details = 'Missing H1 heading.';
  } else if (h1Count > 1) {
    status = 'WARNING';
    severity = 'WARNING';
    score = 50;
    details = `Multiple H1 headings found (${h1Count}). It is best practice to have exactly one.`;
  } else {
    const h1Text = $('h1').first().text().trim();
    if (!h1Text) {
      details = 'H1 heading exists but is empty.';
    } else {
      status = 'PASS';
      severity = 'INFO';
      score = 100;
      details = 'Exactly one H1 heading found.';
    }
  }

  return {
    id: 'seo-h1-heading',
    category: 'SEO Essentials',
    title: 'H1 Heading',
    description: 'Checks if the page has exactly one descriptive H1 heading.',
    status,
    severity,
    score,
    maxScore: 100,
    details,
    recommendation: 'Ensure there is exactly one H1 tag per page, containing the primary topic of the page.',
    affectedUrls: [pageData.url]
  };
}
