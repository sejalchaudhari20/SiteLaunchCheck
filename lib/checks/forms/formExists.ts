import * as cheerio from 'cheerio';
import { PageData } from '@/lib/crawler/types';
import { CheckResult } from '@/types/audit';

export function checkFormExists(pageData: PageData): CheckResult {
  const $ = cheerio.load(pageData.html);
  const formCount = $('form').length;

  return {
    id: 'forms-exists',
    category: 'Forms',
    title: 'Form Exists',
    description: 'Checks if the page contains at least one form.',
    status: formCount > 0 ? 'PASS' : 'NA',
    severity: 'INFO',
    score: formCount > 0 ? 100 : 100,
    maxScore: 100,
    details: formCount > 0 
      ? `Found ${formCount} form(s) on the page.`
      : 'No forms found on this page.',
    affectedUrls: [pageData.url]
  };
}
