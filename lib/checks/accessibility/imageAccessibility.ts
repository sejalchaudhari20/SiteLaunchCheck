import * as cheerio from 'cheerio';
import { PageData } from '@/lib/crawler/types';
import { CheckResult } from '@/types/audit';

export function checkImageAccessibility(pageData: PageData): CheckResult {
  const $ = cheerio.load(pageData.html);
  let missingAltCount = 0;

  $('img').each((_, el) => {
    const alt = $(el).attr('alt');
    if (alt === undefined) {
      missingAltCount++;
    }
  });

  return {
    id: 'a11y-image-alt',
    category: 'Accessibility Basics',
    title: 'Image Alt Text',
    description: 'Checks if images have an alt attribute for screen readers.',
    status: missingAltCount > 0 ? 'FAIL' : 'PASS',
    severity: missingAltCount > 0 ? 'CRITICAL' : 'INFO',
    score: missingAltCount > 0 ? 0 : 100,
    maxScore: 100,
    details: missingAltCount > 0 
      ? `Found ${missingAltCount} image(s) completely missing the alt attribute.`
      : 'All images have an alt attribute.',
    recommendation: 'Add alt attributes to all images. Screen readers rely on this to describe images to visually impaired users.',
    affectedUrls: [pageData.url]
  };
}
