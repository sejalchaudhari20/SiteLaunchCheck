import * as cheerio from 'cheerio';
import { PageData } from '@/lib/crawler/types';
import { CheckResult } from '@/types/audit';

export async function checkBrokenLinks(pageData: PageData): Promise<CheckResult[]> {
  const $ = cheerio.load(pageData.html);
  const internalLinks = new Set<string>();
  const externalLinks = new Set<string>();
  
  const baseUrl = new URL(pageData.url);

  $('a[href]').each((_, el) => {
    const href = $(el).attr('href')?.trim();
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return;

    try {
      const url = new URL(href, pageData.url);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

      if (url.hostname === baseUrl.hostname) {
        internalLinks.add(url.href);
      } else {
        externalLinks.add(url.href);
      }
    } catch {
      // Invalid URL syntax
    }
  });

  // Limit checks in MVP to prevent excessive time/abuse (e.g. max 10 of each)
  const internalUrls = Array.from(internalLinks).slice(0, 10);
  const externalUrls = Array.from(externalLinks).slice(0, 5);

  const checkUrlStatus = async (urlStr: string) => {
    try {
      const res = await fetch(urlStr, { method: 'HEAD', signal: AbortSignal.timeout(3000) });
      return { url: urlStr, status: res.status, ok: res.ok };
    } catch (error) {
      return { url: urlStr, status: 0, ok: false }; // 0 for network/timeout errors
    }
  };

  const internalResults = await Promise.all(internalUrls.map(checkUrlStatus));
  const externalResults = await Promise.all(externalUrls.map(checkUrlStatus));

  const brokenInternal = internalResults.filter(r => !r.ok);
  const brokenExternal = externalResults.filter(r => !r.ok);

  const internalCheck: CheckResult = {
    id: 'links-broken-internal',
    category: 'Links',
    title: 'Broken Internal Links',
    description: 'Checks for broken links to other pages on the same website.',
    status: brokenInternal.length > 0 ? 'FAIL' : 'PASS',
    severity: brokenInternal.length > 0 ? 'CRITICAL' : 'INFO',
    score: brokenInternal.length > 0 ? 0 : 100,
    maxScore: 100,
    details: brokenInternal.length > 0 
      ? `Found ${brokenInternal.length} broken internal links. Example: ${brokenInternal[0]?.url}`
      : `Checked ${internalUrls.length} internal links. All working.`,
    recommendation: 'Fix or remove any broken internal links (404s) to improve user experience and SEO.',
    affectedUrls: brokenInternal.map(r => r.url)
  };

  const externalCheck: CheckResult = {
    id: 'links-broken-external',
    category: 'Links',
    title: 'Broken External Links',
    description: 'Checks for broken links to other websites.',
    status: brokenExternal.length > 0 ? 'WARNING' : 'PASS',
    severity: brokenExternal.length > 0 ? 'WARNING' : 'INFO',
    score: brokenExternal.length > 0 ? 50 : 100,
    maxScore: 100,
    details: brokenExternal.length > 0 
      ? `Found ${brokenExternal.length} broken external links. Example: ${brokenExternal[0]?.url}`
      : `Checked ${externalUrls.length} external links. All working.`,
    recommendation: 'Fix or remove any broken external links to maintain credibility.',
    affectedUrls: brokenExternal.map(r => r.url)
  };

  return [internalCheck, externalCheck];
}
