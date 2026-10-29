import * as cheerio from 'cheerio';
import { PageData } from '@/lib/crawler/types';
import { CheckResult } from '@/types/audit';

export function checkMissingAlt(pageData: PageData): CheckResult {
  const $ = cheerio.load(pageData.html);
  let missingAltCount = 0;

  $('img').each((_, el) => {
    const alt = $(el).attr('alt');
    // Consider it missing if attribute doesn't exist. Empty alt (alt="") is valid for decorative images.
    if (alt === undefined) {
      missingAltCount++;
    }
  });

  return {
    id: 'images-missing-alt',
    category: 'Images',
    title: 'Missing ALT Attributes',
    description: 'Checks if images have an alt attribute (even if empty for decorative images).',
    status: missingAltCount > 0 ? 'FAIL' : 'PASS',
    severity: missingAltCount > 0 ? 'WARNING' : 'INFO',
    score: missingAltCount > 0 ? 0 : 100,
    maxScore: 100,
    details: missingAltCount > 0 
      ? `Found ${missingAltCount} image(s) completely missing the alt attribute.`
      : 'All images have an alt attribute.',
    recommendation: 'Add alt attributes to all images. Use alt="" for decorative images.',
    affectedUrls: [pageData.url]
  };
}
