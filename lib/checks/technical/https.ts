import { PageData } from '@/lib/crawler/types';
import { CheckResult } from '@/types/audit';

export function checkHttps(pageData: PageData): CheckResult {
  const isHttps = pageData.url.startsWith('https://');

  return {
    id: 'tech-https',
    category: 'Technical',
    title: 'HTTPS',
    description: 'Checks if the page is served over a secure HTTPS connection.',
    status: isHttps ? 'PASS' : 'FAIL',
    severity: isHttps ? 'INFO' : 'CRITICAL',
    score: isHttps ? 100 : 0,
    maxScore: 100,
    details: isHttps ? 'Page is served over HTTPS.' : 'Page is served over HTTP, which is not secure.',
    recommendation: 'Ensure your website forces HTTPS to encrypt traffic and protect user data.',
    affectedUrls: [pageData.url]
  };
}
