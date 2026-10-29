import * as cheerio from 'cheerio';
import { PageData } from '@/lib/crawler/types';
import { CheckResult } from '@/types/audit';

export function checkButtonLinkNames(pageData: PageData): CheckResult {
  const $ = cheerio.load(pageData.html);
  
  let inaccessibleCount = 0;

  $('a, button').each((_, el) => {
    const text = $(el).text().trim();
    const ariaLabel = $(el).attr('aria-label')?.trim();
    const ariaLabelledby = $(el).attr('aria-labelledby')?.trim();
    const title = $(el).attr('title')?.trim();
    
    // Check if element has any screen-reader accessible name
    if (!text && !ariaLabel && !ariaLabelledby && !title) {
      // It might have an image with an alt tag inside
      const hasImageWithAlt = $(el).find('img[alt]').length > 0;
      const hasSvgWithTitle = $(el).find('svg title').length > 0;
      
      if (!hasImageWithAlt && !hasSvgWithTitle) {
        inaccessibleCount++;
      }
    }
  });

  return {
    id: 'a11y-button-link-names',
    category: 'Accessibility Basics',
    title: 'Button and Link Names',
    description: 'Checks if interactive elements have discernible text for screen readers.',
    status: inaccessibleCount > 0 ? 'FAIL' : 'PASS',
    severity: inaccessibleCount > 0 ? 'CRITICAL' : 'INFO',
    score: inaccessibleCount > 0 ? 0 : 100,
    maxScore: 100,
    details: inaccessibleCount > 0 
      ? `Found ${inaccessibleCount} button(s) or link(s) without discernible text.`
      : 'All buttons and links have accessible text.',
    recommendation: 'Ensure icon-only buttons or empty links have an aria-label to describe their purpose.',
    affectedUrls: [pageData.url]
  };
}
