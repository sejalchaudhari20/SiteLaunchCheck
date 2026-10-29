import * as cheerio from 'cheerio';
import { PageData } from '@/lib/crawler/types';
import { CheckResult } from '@/types/audit';

export function checkFormAction(pageData: PageData): CheckResult {
  const $ = cheerio.load(pageData.html);
  const forms = $('form');
  
  if (forms.length === 0) {
    return {
      id: 'forms-action',
      category: 'Forms',
      title: 'Form Action',
      description: 'Checks if forms have an action attribute or are handled by JavaScript.',
      status: 'NA',
      severity: 'INFO',
      score: 100,
      maxScore: 100,
      details: 'No forms found on this page.',
      affectedUrls: [pageData.url]
    };
  }

  let missingActionCount = 0;

  forms.each((_, el) => {
    const action = $(el).attr('action');
    const hasSubmitHandler = $(el).attr('onsubmit') || $(el).data('reactroot') !== undefined || $(el).attr('id');
    // Basic heuristic: if no action and no obvious JS handler
    if (!action && !hasSubmitHandler) {
      missingActionCount++;
    }
  });

  return {
    id: 'forms-action',
    category: 'Forms',
    title: 'Form Action',
    description: 'Checks if forms have an action attribute or are handled by JavaScript.',
    status: missingActionCount > 0 ? 'WARNING' : 'PASS',
    severity: missingActionCount > 0 ? 'WARNING' : 'INFO',
    score: missingActionCount > 0 ? 50 : 100,
    maxScore: 100,
    details: missingActionCount > 0 
      ? `Found ${missingActionCount} form(s) without an action attribute.`
      : 'All forms have an action attribute or seem to be handled via JavaScript.',
    recommendation: 'Ensure all forms have a valid action endpoint or are correctly captured by JavaScript.',
    affectedUrls: [pageData.url]
  };
}
