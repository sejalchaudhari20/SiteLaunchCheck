import * as cheerio from 'cheerio';
import { PageData } from '@/lib/crawler/types';
import { CheckResult } from '@/types/audit';

export function checkDimensions(pageData: PageData): CheckResult {
  const $ = cheerio.load(pageData.html);
  let missingDimensionsCount = 0;

  $('img').each((_, el) => {
    const width = $(el).attr('width');
    const height = $(el).attr('height');
    
    // We expect both width and height attributes to be present to prevent layout shift
    if (!width || !height) {
      missingDimensionsCount++;
    }
  });

  return {
    id: 'images-dimensions',
    category: 'Images',
    title: 'Image Dimensions',
    description: 'Checks if images have explicit width and height attributes to prevent layout shifts.',
    status: missingDimensionsCount > 0 ? 'WARNING' : 'PASS',
    severity: missingDimensionsCount > 0 ? 'WARNING' : 'INFO',
    score: missingDimensionsCount > 0 ? 50 : 100,
    maxScore: 100,
    details: missingDimensionsCount > 0 
      ? `Found ${missingDimensionsCount} image(s) missing width or height attributes.`
      : 'All images specify width and height attributes.',
    recommendation: 'Add width and height attributes to all <img> tags to improve Cumulative Layout Shift (CLS).',
    affectedUrls: [pageData.url]
  };
}
