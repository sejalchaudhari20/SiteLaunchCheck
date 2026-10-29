import * as cheerio from 'cheerio';
import { PageData } from '@/lib/crawler/types';
import { CheckResult } from '@/types/audit';

export function checkPlaceholderImages(pageData: PageData): CheckResult {
  const $ = cheerio.load(pageData.html);
  
  const placeholderDomains = ['via.placeholder.com', 'unsplash.it', 'placehold.co', 'dummyimage.com', 'placekitten.com'];
  let placeholderImageCount = 0;

  $('img[src]').each((_, el) => {
    const src = $(el).attr('src')?.toLowerCase() || '';
    if (placeholderDomains.some(domain => src.includes(domain))) {
      placeholderImageCount++;
    }
  });

  return {
    id: 'content-placeholder-images',
    category: 'Content / Client Delivery',
    title: 'Placeholder Images',
    description: 'Checks if generic placeholder image services are still being used.',
    status: placeholderImageCount > 0 ? 'WARNING' : 'PASS',
    severity: placeholderImageCount > 0 ? 'WARNING' : 'INFO',
    score: placeholderImageCount > 0 ? 50 : 100,
    maxScore: 100,
    details: placeholderImageCount > 0 
      ? `Found ${placeholderImageCount} placeholder image(s).`
      : 'No known placeholder image services detected.',
    recommendation: 'Replace placeholder images with final client assets.',
    affectedUrls: [pageData.url]
  };
}
