import * as cheerio from 'cheerio';
import { PageData } from '@/lib/crawler/types';
import { CheckResult } from '@/types/audit';

export function checkCharset(pageData: PageData): CheckResult {
  const $ = cheerio.load(pageData.html);
  const charset = $('meta[charset]').attr('charset') || $('meta[http-equiv="Content-Type"]').attr('content');

  if (!charset) {
    return {
      id: 'tech-charset',
      category: 'Technical',
      title: 'Charset Declaration',
      description: 'Checks if the page specifies a character encoding.',
      status: 'FAIL',
      severity: 'WARNING',
      score: 0,
      maxScore: 100,
      details: 'Missing charset meta tag.',
      recommendation: 'Add <meta charset="UTF-8"> to the top of your <head>.',
      affectedUrls: [pageData.url]
    };
  }

  const isUTF8 = charset.toLowerCase().includes('utf-8');

  return {
    id: 'tech-charset',
    category: 'Technical',
    title: 'Charset Declaration',
    description: 'Checks if the page specifies a character encoding.',
    status: isUTF8 ? 'PASS' : 'WARNING',
    severity: isUTF8 ? 'INFO' : 'WARNING',
    score: isUTF8 ? 100 : 50,
    maxScore: 100,
    details: `Charset found: ${charset}`,
    recommendation: 'Ensure your charset is set to UTF-8 for maximum compatibility.',
    affectedUrls: [pageData.url]
  };
}
