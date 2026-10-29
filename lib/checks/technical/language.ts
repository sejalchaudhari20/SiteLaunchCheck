import * as cheerio from 'cheerio';
import { PageData } from '@/lib/crawler/types';
import { CheckResult } from '@/types/audit';

export function checkLanguage(pageData: PageData): CheckResult {
  const $ = cheerio.load(pageData.html);
  const lang = $('html').attr('lang');

  if (!lang) {
    return {
      id: 'tech-language',
      category: 'Technical',
      title: 'HTML Language',
      description: 'Checks if the HTML tag has a lang attribute for accessibility and SEO.',
      status: 'FAIL',
      severity: 'WARNING',
      score: 0,
      maxScore: 100,
      details: 'Missing lang attribute on <html> tag.',
      recommendation: 'Add a lang attribute (e.g., <html lang="en">) to specify the document language.',
      affectedUrls: [pageData.url]
    };
  }

  return {
    id: 'tech-language',
    category: 'Technical',
    title: 'HTML Language',
    description: 'Checks if the HTML tag has a lang attribute for accessibility and SEO.',
    status: 'PASS',
    severity: 'INFO',
    score: 100,
    maxScore: 100,
    details: `Language specified: ${lang}`,
    recommendation: 'Ensure the specified language code is correct for the page content.',
    affectedUrls: [pageData.url]
  };
}
