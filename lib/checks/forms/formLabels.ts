import * as cheerio from 'cheerio';
import { PageData } from '@/lib/crawler/types';
import { CheckResult } from '@/types/audit';

export function checkFormLabels(pageData: PageData): CheckResult {
  const $ = cheerio.load(pageData.html);
  
  let inputsWithoutLabels = 0;
  
  // Find all inputs that need labels (ignore hidden, submit, button, etc)
  $('input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="image"]), textarea, select').each((_, el) => {
    const id = $(el).attr('id');
    const ariaLabel = $(el).attr('aria-label');
    const ariaLabelledby = $(el).attr('aria-labelledby');
    const title = $(el).attr('title');
    
    // Check for implicit wrapper label
    const parentLabel = $(el).closest('label').length > 0;
    
    let hasExplicitLabel = false;
    if (id) {
      hasExplicitLabel = $(`label[for="${id}"]`).length > 0;
    }

    if (!parentLabel && !hasExplicitLabel && !ariaLabel && !ariaLabelledby && !title) {
      inputsWithoutLabels++;
    }
  });

  return {
    id: 'forms-labels',
    category: 'Forms',
    title: 'Form Labels',
    description: 'Checks if form inputs have associated labels or accessible names.',
    status: inputsWithoutLabels > 0 ? 'FAIL' : 'PASS',
    severity: inputsWithoutLabels > 0 ? 'CRITICAL' : 'INFO',
    score: inputsWithoutLabels > 0 ? 0 : 100,
    maxScore: 100,
    details: inputsWithoutLabels > 0 
      ? `Found ${inputsWithoutLabels} form input(s) without an associated label.`
      : 'All relevant form inputs have accessible labels.',
    recommendation: 'Ensure every form input has a <label> (using the "for" attribute) or an aria-label attribute.',
    affectedUrls: [pageData.url]
  };
}
