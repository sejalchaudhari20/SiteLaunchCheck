import { PageData } from '@/lib/crawler/types';
import { CheckResult } from '@/types/audit';

export async function checkSitemap(pageData: PageData): Promise<CheckResult> {
  let status: CheckResult['status'] = 'FAIL';
  let severity: CheckResult['severity'] = 'WARNING';
  let score = 0;
  let details = '';
  
  try {
    const url = new URL(pageData.url);
    const sitemapUrl = `${url.protocol}//${url.host}/sitemap.xml`;
    
    // Check default location
    const res = await fetch(sitemapUrl, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
    
    if (res.ok) {
      status = 'PASS';
      severity = 'INFO';
      score = 100;
      details = `Found XML sitemap at ${sitemapUrl}`;
    } else {
      details = `Default sitemap.xml returned status ${res.status}. Note: It might be defined in robots.txt instead.`;
    }
  } catch (error: any) {
    details = `Failed to fetch sitemap.xml: ${error.message}`;
  }

  return {
    id: 'seo-sitemap',
    category: 'SEO Essentials',
    title: 'XML Sitemap',
    description: 'Checks if an XML sitemap exists at the default /sitemap.xml location.',
    status,
    severity,
    score,
    maxScore: 100,
    details,
    recommendation: 'Provide an XML sitemap to help search engines discover your pages.',
    affectedUrls: [pageData.url]
  };
}
