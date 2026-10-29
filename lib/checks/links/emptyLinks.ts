import * as cheerio from 'cheerio';
import { PageData } from '@/lib/crawler/types';
import { CheckResult } from '@/types/audit';

export function checkEmptyLinks(pageData: PageData): CheckResult {
  const $ = cheerio.load(pageData.html);
  
  let emptyLinksCount = 0;
  
  $('a').each((_, el) => {
    const href = $(el).attr('href');
    const text = $(el).text().trim();
    const hasChildren = $(el).children().length > 0;
    const ariaLabel = $(el).attr('aria-label');
    
    // A link is "empty" if it lacks an href OR if it lacks text/accessible name/children
    if (!href || (!text && !hasChildren && !ariaLabel)) {
      emptyLinksCount++;
    }
  });

  return {
    id: 'links-empty',
    category: 'Links',
    title: 'Empty Links',
    description: 'Checks for links missing an href attribute or accessible text/content.',
    status: emptyLinksCount > 0 ? 'WARNING' : 'PASS',
    severity: emptyLinksCount > 0 ? 'WARNING' : 'INFO',
    score: emptyLinksCount > 0 ? 50 : 100,
    maxScore: 100,
    details: emptyLinksCount > 0 
      ? `Found ${emptyLinksCount} empty link(s).`
      : 'No empty links found.',
    recommendation: 'Ensure all <a> tags have a valid href and descriptive text or an aria-label.',
    affectedUrls: [pageData.url]
  };
}
