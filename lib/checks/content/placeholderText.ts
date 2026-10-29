import * as cheerio from 'cheerio';
import { PageData } from '@/lib/crawler/types';
import { CheckResult } from '@/types/audit';

export function checkPlaceholderText(pageData: PageData): CheckResult {
  const $ = cheerio.load(pageData.html);
  $('script, style').remove();
  const text = $('body').text().toLowerCase();

  const placeholders = ['insert text here', 'add copy here', 'tbd', 'to be decided', 'tba', 'placeholder copy'];
  let foundPlaceholders: string[] = [];

  for (const phrase of placeholders) {
    if (text.includes(phrase)) {
      foundPlaceholders.push(phrase);
    }
  }

  return {
    id: 'content-placeholder-text',
    category: 'Content / Client Delivery',
    title: 'Placeholder Text',
    description: 'Checks for generic placeholder phrases (e.g. "insert text here", "TBD").',
    status: foundPlaceholders.length > 0 ? 'WARNING' : 'PASS',
    severity: foundPlaceholders.length > 0 ? 'WARNING' : 'INFO',
    score: foundPlaceholders.length > 0 ? 50 : 100,
    maxScore: 100,
    details: foundPlaceholders.length > 0 
      ? `Found placeholder text: "${foundPlaceholders.join('", "')}".`
      : 'No common placeholder phrases detected.',
    recommendation: 'Ensure all generic placeholders are replaced with actual content.',
    affectedUrls: [pageData.url]
  };
}
