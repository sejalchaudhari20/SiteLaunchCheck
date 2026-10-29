import * as cheerio from 'cheerio';
import { PageData } from '@/lib/crawler/types';
import { CheckResult } from '@/types/audit';

export function checkLoremIpsum(pageData: PageData): CheckResult {
  const $ = cheerio.load(pageData.html);
  // Remove script and style tags to avoid false positives
  $('script, style').remove();
  const text = $('body').text().toLowerCase();

  const loremMatch = text.includes('lorem ipsum') || text.includes('dolor sit amet');

  return {
    id: 'content-lorem-ipsum',
    category: 'Content / Client Delivery',
    title: 'Lorem Ipsum',
    description: 'Checks if placeholder "Lorem Ipsum" text was left on the page.',
    status: loremMatch ? 'FAIL' : 'PASS',
    severity: loremMatch ? 'CRITICAL' : 'INFO',
    score: loremMatch ? 0 : 100,
    maxScore: 100,
    details: loremMatch 
      ? 'Found "Lorem ipsum" placeholder text on the page.'
      : 'No "Lorem ipsum" text detected.',
    recommendation: 'Replace all placeholder text with real client copy before delivery.',
    affectedUrls: [pageData.url]
  };
}
