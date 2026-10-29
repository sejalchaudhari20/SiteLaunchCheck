import * as cheerio from 'cheerio';
import { PageData } from '@/lib/crawler/types';
import { CheckResult } from '@/types/audit';

export async function checkBrokenImages(pageData: PageData): Promise<CheckResult> {
  const $ = cheerio.load(pageData.html);
  const imageUrls = new Set<string>();

  $('img[src]').each((_, el) => {
    const src = $(el).attr('src')?.trim();
    if (!src || src.startsWith('data:')) return;
    try {
      const url = new URL(src, pageData.url);
      if (url.protocol === 'http:' || url.protocol === 'https:') {
        imageUrls.add(url.href);
      }
    } catch {
      // Invalid syntax
    }
  });

  const urlsToTest = Array.from(imageUrls).slice(0, 10); // Limit to 10 for MVP speed
  const brokenUrls: string[] = [];

  const checkUrl = async (urlStr: string) => {
    try {
      const res = await fetch(urlStr, { method: 'HEAD', signal: AbortSignal.timeout(3000) });
      if (!res.ok) brokenUrls.push(urlStr);
    } catch {
      brokenUrls.push(urlStr);
    }
  };

  await Promise.all(urlsToTest.map(checkUrl));

  return {
    id: 'images-broken',
    category: 'Images',
    title: 'Broken Images',
    description: 'Checks for broken image sources (returns a 404 or fails to load).',
    status: brokenUrls.length > 0 ? 'FAIL' : 'PASS',
    severity: brokenUrls.length > 0 ? 'CRITICAL' : 'INFO',
    score: brokenUrls.length > 0 ? 0 : 100,
    maxScore: 100,
    details: brokenUrls.length > 0 
      ? `Found ${brokenUrls.length} broken image(s). Example: ${brokenUrls[0]}`
      : `Checked ${urlsToTest.length} image(s). All loaded successfully.`,
    recommendation: 'Fix or remove any broken image URLs to improve user experience.',
    affectedUrls: brokenUrls
  };
}
