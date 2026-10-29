import { PageData } from '@/lib/crawler/types';
import { CheckResult } from '@/types/audit';

export async function checkRobotsTxt(pageData: PageData): Promise<CheckResult> {
  let status: CheckResult['status'] = 'FAIL';
  let severity: CheckResult['severity'] = 'WARNING';
  let score = 0;
  let details = '';
  
  try {
    const url = new URL(pageData.url);
    const robotsUrl = `${url.protocol}//${url.host}/robots.txt`;
    
    // We fetch robots.txt directly
    const res = await fetch(robotsUrl, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
    
    if (res.ok) {
      status = 'PASS';
      severity = 'INFO';
      score = 100;
      details = `Found robots.txt at ${robotsUrl}`;
    } else {
      details = `robots.txt returned status ${res.status}`;
    }
  } catch (error: any) {
    details = `Failed to fetch robots.txt: ${error.message}`;
  }

  return {
    id: 'seo-robots',
    category: 'SEO Essentials',
    title: 'Robots.txt',
    description: 'Checks if a robots.txt file exists to guide search engine crawlers.',
    status,
    severity,
    score,
    maxScore: 100,
    details,
    recommendation: 'Ensure a valid robots.txt file is present at the root of your domain.',
    affectedUrls: [pageData.url]
  };
}
