import * as cheerio from 'cheerio';
import { PageData } from '@/lib/crawler/types';
import { CheckResult } from '@/types/audit';

export function checkCanonical(pageData: PageData): CheckResult {
  const $ = cheerio.load(pageData.html);
  const canonical = $('link[rel="canonical"]').attr('href');

  if (!canonical) {
    return {
      id: 'seo-canonical',
      category: 'SEO Essentials',
      title: 'Canonical URL',
      description: 'Checks if a canonical URL is specified to prevent duplicate content issues.',
      status: 'WARNING',
      severity: 'WARNING',
      score: 50,
      maxScore: 100,
      details: 'Missing canonical URL.',
      recommendation: 'Add a <link rel="canonical" href="..."> tag pointing to the preferred version of the page.',
      affectedUrls: [pageData.url]
    };
  }

  return {
    id: 'seo-canonical',
    category: 'SEO Essentials',
    title: 'Canonical URL',
    description: 'Checks if a canonical URL is specified to prevent duplicate content issues.',
    status: 'PASS',
    severity: 'INFO',
    score: 100,
    maxScore: 100,
    details: `Canonical URL found: ${canonical}`,
    recommendation: 'Ensure the canonical URL points to the correct preferred URL.',
    affectedUrls: [pageData.url]
  };
}
