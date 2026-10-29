import * as cheerio from 'cheerio';
import { PageData } from '@/lib/crawler/types';
import { CheckResult } from '@/types/audit';

export function checkCopyrightYear(pageData: PageData): CheckResult {
  const $ = cheerio.load(pageData.html);
  $('script, style').remove();
  const text = $('body').text();
  
  const currentYear = new Date().getFullYear().toString();
  const lastYear = (new Date().getFullYear() - 1).toString();
  
  // Look for copyright symbol followed by year(s)
  // Simple heuristic: if we see © 2023 or Copyright 2023 when it's 2024
  const hasCopyright = text.includes('©') || text.toLowerCase().includes('copyright');
  const hasCurrentYear = text.includes(currentYear);
  const hasLastYear = text.includes(lastYear);

  let status: CheckResult['status'] = 'PASS';
  let severity: CheckResult['severity'] = 'INFO';
  let score = 100;
  let details = 'Copyright year appears up to date or no copyright text found.';

  if (hasCopyright && hasLastYear && !hasCurrentYear) {
    status = 'WARNING';
    severity = 'WARNING';
    score = 50;
    details = `Found a copyright notice but it might be outdated (contains ${lastYear} but not ${currentYear}).`;
  }

  return {
    id: 'content-copyright-year',
    category: 'Content / Client Delivery',
    title: 'Copyright Year',
    description: 'Checks if the copyright year (if present) is current.',
    status,
    severity,
    score,
    maxScore: 100,
    details,
    recommendation: 'Ensure your footer copyright date is updated to the current year.',
    affectedUrls: [pageData.url]
  };
}
