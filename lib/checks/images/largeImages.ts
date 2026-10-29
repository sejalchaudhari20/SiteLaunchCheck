import * as cheerio from 'cheerio';
import { PageData } from '@/lib/crawler/types';
import { CheckResult } from '@/types/audit';

export async function checkLargeImages(pageData: PageData): Promise<CheckResult> {
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

  const urlsToTest = Array.from(imageUrls).slice(0, 10);
  const largeImages: string[] = [];

  const checkSize = async (urlStr: string) => {
    try {
      const res = await fetch(urlStr, { method: 'HEAD', signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const contentLength = res.headers.get('content-length');
        if (contentLength) {
          const bytes = parseInt(contentLength, 10);
          // Flag if larger than 500 KB (512000 bytes)
          if (bytes > 512000) {
            largeImages.push(urlStr);
          }
        }
      }
    } catch {
      // Ignore fetch errors for this check
    }
  };

  await Promise.all(urlsToTest.map(checkSize));

  return {
    id: 'images-large',
    category: 'Images',
    title: 'Large Images',
    description: 'Checks if any images are excessively large (>500KB) and might slow down the page.',
    status: largeImages.length > 0 ? 'WARNING' : 'PASS',
    severity: largeImages.length > 0 ? 'WARNING' : 'INFO',
    score: largeImages.length > 0 ? 50 : 100,
    maxScore: 100,
    details: largeImages.length > 0 
      ? `Found ${largeImages.length} large image(s) over 500KB. Example: ${largeImages[0]}`
      : 'No excessively large images found among the checked URLs.',
    recommendation: 'Compress large images to improve page load speed.',
    affectedUrls: largeImages
  };
}
