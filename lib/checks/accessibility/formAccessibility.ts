import * as cheerio from 'cheerio';
import { PageData } from '@/lib/crawler/types';
import { CheckResult } from '@/types/audit';

export function checkFormAccessibility(pageData: PageData): CheckResult {
  const $ = cheerio.load(pageData.html);
  
  let inaccessibleInputs = 0;
  
  $('input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="image"]), textarea, select').each((_, el) => {
    const id = $(el).attr('id');
    const ariaLabel = $(el).attr('aria-label');
    const ariaLabelledby = $(el).attr('aria-labelledby');
    const title = $(el).attr('title');
    
    const parentLabel = $(el).closest('label').length > 0;
    
    let hasExplicitLabel = false;
    if (id) {
      hasExplicitLabel = $(`label[for="${id}"]`).length > 0;
    }

    if (!parentLabel && !hasExplicitLabel && !ariaLabel && !ariaLabelledby && !title) {
      inaccessibleInputs++;
    }
  });

  return {
    id: 'a11y-form-labels',
    category: 'Accessibility Basics',
    title: 'Accessible Form Labels',
    description: 'Checks if form inputs have accessible names for screen readers.',
    status: inaccessibleInputs > 0 ? 'FAIL' : 'PASS',
    severity: inaccessibleInputs > 0 ? 'CRITICAL' : 'INFO',
    score: inaccessibleInputs > 0 ? 0 : 100,
    maxScore: 100,
    details: inaccessibleInputs > 0 
      ? `Found ${inaccessibleInputs} input(s) lacking an accessible name.`
      : 'All inputs have accessible names.',
    recommendation: 'Use <label for="..."> or aria-label so screen reader users know what to enter.',
    affectedUrls: [pageData.url]
  };
}
