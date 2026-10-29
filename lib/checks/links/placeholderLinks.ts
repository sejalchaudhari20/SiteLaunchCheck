import * as cheerio from 'cheerio';
import { PageData } from '@/lib/crawler/types';
import { CheckResult } from '@/types/audit';

export function checkPlaceholderLinks(pageData: PageData): CheckResult {
  const $ = cheerio.load(pageData.html);
  
  let placeholderCount = 0;
  
  $('a').each((_, el) => {
    const href = $(el).attr('href')?.trim();
    
    if (href === '#' || href?.startsWith('javascript:void') || href === '') {
      // Allow # links if they have some behavior or ID attached in modern apps, 
      // but purely `#` or `javascript:void(0)` are usually placeholders.
      placeholderCount++;
    }
  });

  return {
    id: 'links-placeholder',
    category: 'Links',
    title: 'Placeholder Links',
    description: 'Checks for unresolved placeholder links (like href="#" or href="javascript:void(0)").',
    status: placeholderCount > 0 ? 'FAIL' : 'PASS',
    severity: placeholderCount > 0 ? 'WARNING' : 'INFO',
    score: placeholderCount > 0 ? 0 : 100,
    maxScore: 100,
    details: placeholderCount > 0 
      ? `Found ${placeholderCount} placeholder link(s).`
      : 'No placeholder links found.',
    recommendation: 'Replace placeholder links with actual URLs or remove them before delivery.',
    affectedUrls: [pageData.url]
  };
}
