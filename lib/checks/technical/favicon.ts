import * as cheerio from 'cheerio';
import { PageData } from '@/lib/crawler/types';
import { CheckResult } from '@/types/audit';

export async function checkFavicon(pageData: PageData): Promise<CheckResult> {
  const $ = cheerio.load(pageData.html);
  const faviconLink = $('link[rel="icon"], link[rel="shortcut icon"]').attr('href');

  let status: CheckResult['status'] = 'FAIL';
  let severity: CheckResult['severity'] = 'WARNING';
  let score = 0;
  let details = '';

  if (faviconLink) {
    status = 'PASS';
    severity = 'INFO';
    score = 100;
    details = `Favicon linked in HTML: ${faviconLink}`;
  } else {
    // Check if /favicon.ico exists as a fallback
    try {
      const url = new URL(pageData.url);
      const fallbackUrl = `${url.protocol}//${url.host}/favicon.ico`;
      const res = await fetch(fallbackUrl, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
      
      if (res.ok) {
        status = 'PASS';
        severity = 'INFO';
        score = 100;
        details = 'Favicon found at default /favicon.ico location.';
      } else {
        details = 'No favicon linked in HTML and default /favicon.ico not found.';
      }
    } catch {
      details = 'No favicon linked in HTML and failed to check default location.';
    }
  }

  return {
    id: 'tech-favicon',
    category: 'Technical',
    title: 'Favicon',
    description: 'Checks if a favicon is specified or present at the default location.',
    status,
    severity,
    score,
    maxScore: 100,
    details,
    recommendation: 'Add a favicon to improve brand recognition in browser tabs and bookmarks.',
    affectedUrls: [pageData.url]
  };
}
