import * as cheerio from 'cheerio';
import { PageData } from '@/lib/crawler/types';
import { CheckResult } from '@/types/audit';

export function checkHeadingHierarchy(pageData: PageData): CheckResult {
  const $ = cheerio.load(pageData.html);
  
  let skippedLevels = 0;
  let previousLevel = 0;

  $('h1, h2, h3, h4, h5, h6').each((_, el) => {
    const currentLevel = parseInt(el.tagName.replace('h', ''), 10);
    
    // Check if we skipped a level (e.g., H1 -> H3)
    if (previousLevel > 0 && currentLevel - previousLevel > 1) {
      skippedLevels++;
    }
    previousLevel = currentLevel;
  });

  return {
    id: 'a11y-heading-hierarchy',
    category: 'Accessibility Basics',
    title: 'Heading Hierarchy',
    description: 'Checks if heading tags are used in a logical, sequential order (no skipped levels).',
    status: skippedLevels > 0 ? 'WARNING' : 'PASS',
    severity: skippedLevels > 0 ? 'WARNING' : 'INFO',
    score: skippedLevels > 0 ? 50 : 100,
    maxScore: 100,
    details: skippedLevels > 0 
      ? `Detected ${skippedLevels} instance(s) of skipped heading levels (e.g. H1 directly to H3).`
      : 'Heading hierarchy is logical and sequential.',
    recommendation: 'Do not skip heading levels. Use headings to construct a logical document outline.',
    affectedUrls: [pageData.url]
  };
}
