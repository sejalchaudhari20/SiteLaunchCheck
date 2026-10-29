import { PageData } from '@/lib/crawler/types';
import { CheckResult } from '@/types/audit';

export async function check404Page(pageData: PageData): Promise<CheckResult> {
  let status: CheckResult['status'] = 'FAIL';
  let severity: CheckResult['severity'] = 'WARNING';
  let score = 0;
  let details = '';

  try {
    const url = new URL(pageData.url);
    // Use a randomized path that is highly unlikely to exist
    const randomPath = `/${Math.random().toString(36).substring(2, 15)}-test-404`;
    const testUrl = `${url.protocol}//${url.host}${randomPath}`;
    
    const res = await fetch(testUrl, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
    
    if (res.status === 404) {
      status = 'PASS';
      severity = 'INFO';
      score = 100;
      details = 'Non-existent pages correctly return a 404 status code.';
    } else {
      details = `Non-existent page returned status ${res.status} instead of 404. This can cause soft-404 SEO issues.`;
    }
  } catch (error: any) {
    details = `Failed to test 404 behavior: ${error.message}`;
  }

  return {
    id: 'tech-404-page',
    category: 'Technical',
    title: '404 Page Behavior',
    description: 'Checks if non-existent URLs return the correct 404 HTTP status code.',
    status,
    severity,
    score,
    maxScore: 100,
    details,
    recommendation: 'Ensure your server returns a 404 status code for pages that do not exist (avoid soft 404s).',
    affectedUrls: [pageData.url]
  };
}
