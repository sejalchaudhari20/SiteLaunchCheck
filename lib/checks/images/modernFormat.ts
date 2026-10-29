import * as cheerio from 'cheerio';
import { PageData } from '@/lib/crawler/types';
import { CheckResult } from '@/types/audit';

export function checkModernFormat(pageData: PageData): CheckResult {
  const $ = cheerio.load(pageData.html);
  let oldFormatCount = 0;

  $('img[src]').each((_, el) => {
    const src = $(el).attr('src')?.toLowerCase() || '';
    // Flag PNG, JPG, JPEG, GIF as older formats. WebP, AVIF, SVG are modern.
    if (src.endsWith('.png') || src.endsWith('.jpg') || src.endsWith('.jpeg') || src.endsWith('.gif')) {
      oldFormatCount++;
    }
  });

  return {
    id: 'images-modern-format',
    category: 'Images',
    title: 'Modern Image Format',
    description: 'Checks if images use modern, optimized formats like WebP or AVIF.',
    status: oldFormatCount > 0 ? 'WARNING' : 'PASS',
    severity: oldFormatCount > 0 ? 'WARNING' : 'INFO',
    score: oldFormatCount > 0 ? 50 : 100,
    maxScore: 100,
    details: oldFormatCount > 0 
      ? `Found ${oldFormatCount} image(s) using older formats (PNG/JPG/GIF).`
      : 'All images appear to use modern formats or none were found.',
    recommendation: 'Serve images in modern formats like WebP or AVIF to reduce file sizes and improve load times.',
    affectedUrls: [pageData.url]
  };
}
