import * as cheerio from 'cheerio';
import { PageData } from '@/lib/crawler/types';
import { CheckResult } from '@/types/audit';

export function checkHttpOnHttps(pageData: PageData): CheckResult {
  const $ = cheerio.load(pageData.html);
  const isHttps = pageData.url.startsWith('https://');

  if (!isHttps) {
    return {
      id: 'links-http-on-https',
      category: 'Links',
      title: 'HTTP Links on HTTPS Site',
      description: 'Checks for insecure HTTP links on a secure HTTPS page.',
      status: 'NA',
      severity: 'INFO',
      score: 100,
      maxScore: 100,
      details: 'Page is not served over HTTPS, so this check is skipped.',
      affectedUrls: [pageData.url]
    };
  }

  let insecureLinksCount = 0;
  
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href')?.trim() || '';
    if (href.startsWith('http://')) {
      insecureLinksCount++;
    }
  });

  return {
    id: 'links-http-on-https',
    category: 'Links',
    title: 'HTTP Links on HTTPS Site',
    description: 'Checks for insecure HTTP links on a secure HTTPS page.',
    status: insecureLinksCount > 0 ? 'WARNING' : 'PASS',
    severity: insecureLinksCount > 0 ? 'WARNING' : 'INFO',
    score: insecureLinksCount > 0 ? 50 : 100,
    maxScore: 100,
    details: insecureLinksCount > 0 
      ? `Found ${insecureLinksCount} insecure HTTP link(s).`
      : 'All absolute links use HTTPS.',
    recommendation: 'Update all HTTP links to HTTPS to maintain security and avoid mixed-content warnings.',
    affectedUrls: [pageData.url]
  };
}
