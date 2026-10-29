import * as cheerio from 'cheerio';
import { PageData } from '@/lib/crawler/types';
import { CheckResult } from '@/types/audit';

export function checkMetaDescription(pageData: PageData): CheckResult {
  const $ = cheerio.load(pageData.html);
  const description = $('meta[name="description"]').attr('content')?.trim();

  let status: CheckResult['status'] = 'FAIL';
  let severity: CheckResult['severity'] = 'WARNING'; // Missing meta description is generally a warning, but some consider it critical. Let's stick to WARNING.
  let score = 0;
  let details = '';

  if (!description) {
    details = 'Meta description is missing or empty.';
  } else if (description.length < 50) {
    status = 'WARNING';
    severity = 'WARNING';
    score = 50;
    details = `Meta description is too short (${description.length} chars).`;
  } else if (description.length > 160) {
    status = 'WARNING';
    severity = 'WARNING';
    score = 50;
    details = `Meta description is too long (${description.length} chars).`;
  } else {
    status = 'PASS';
    severity = 'INFO';
    score = 100;
    details = `Meta description is optimal (${description.length} chars).`;
  }

  return {
    id: 'seo-meta-description',
    category: 'SEO Essentials',
    title: 'Meta Description',
    description: 'Checks for a meta description tag with an optimal length (50-160 characters).',
    status,
    severity,
    score,
    maxScore: 100,
    details,
    recommendation: 'Provide a compelling meta description between 50 and 160 characters to improve click-through rates.',
    affectedUrls: [pageData.url]
  };
}
