import * as cheerio from 'cheerio';
import { PageData } from '@/lib/crawler/types';
import { CheckResult } from '@/types/audit';

export function checkSubmitButton(pageData: PageData): CheckResult {
  const $ = cheerio.load(pageData.html);
  const forms = $('form');
  
  if (forms.length === 0) {
    return {
      id: 'forms-submit-button',
      category: 'Forms',
      title: 'Submit Button',
      description: 'Checks if forms have a clear submit button.',
      status: 'NA',
      severity: 'INFO',
      score: 100,
      maxScore: 100,
      details: 'No forms found on this page.',
      affectedUrls: [pageData.url]
    };
  }

  let missingSubmitCount = 0;

  forms.each((_, el) => {
    const $form = $(el);
    const hasSubmit = $form.find('button[type="submit"], input[type="submit"], button:not([type="button"])').length > 0;
    if (!hasSubmit) {
      missingSubmitCount++;
    }
  });

  return {
    id: 'forms-submit-button',
    category: 'Forms',
    title: 'Submit Button',
    description: 'Checks if forms have a clear submit button.',
    status: missingSubmitCount > 0 ? 'FAIL' : 'PASS',
    severity: missingSubmitCount > 0 ? 'CRITICAL' : 'INFO',
    score: missingSubmitCount > 0 ? 0 : 100,
    maxScore: 100,
    details: missingSubmitCount > 0 
      ? `Found ${missingSubmitCount} form(s) missing a submit button.`
      : 'All forms have a submit button.',
    recommendation: 'Every form must include a button or input of type "submit" so users can submit their data.',
    affectedUrls: [pageData.url]
  };
}
